import { GoogleGenAI, ThinkingLevel } from '@google/genai'
import { NextResponse } from 'next/server'

import { lerCatalogoDaIa } from '@/lib/catalogo-da-ia'
import { MAX_TOKENS_DE_SAIDA, validarConversa, type Mensagem } from '@/lib/chat'
import { montarInstrucao } from '@/lib/instrucao-da-ia'
import { ipDe } from '@/lib/ip'
import { tiposLigados } from '@/lib/mappers/catalogo-da-ia'
import { getPayload } from '@/lib/payload'
import { resolverReferencias } from '@/lib/referencias-da-ia'
import type { ConteudoRecomendavel } from '@/types/content'

/* POST /api/chat — porte de `legacy/server.ts:38`, com o que D-12 decidiu.
 *
 * O legado expõe a rota **sem limite nenhum**: cada POST gasta cota do Gemini, e
 * qualquer um pode chamá-la em laço. Aqui entra limite por IP e degradação
 * graciosa — atingido o teto, responde a mensagem de indisponibilidade em vez
 * de continuar gastando.
 *
 * ⚠️ O contador é **em memória do processo**. Serve a um servidor só, que é o
 * plano de deploy (P-05), e some a cada reinício. Com mais de uma instância ou
 * função serverless, cada uma conta a sua e o teto efetivo multiplica. Trocar
 * por Redis é a próxima etapa, e depende de saber o teto real de custo (P-04).
 *
 * ⚠️ `GEMINI_API_KEY` **sem** prefixo `NEXT_PUBLIC_`: a chave só existe no
 * servidor. O `define` de `legacy/vite.config.ts:12` injeta a chave no bundle
 * do cliente, e é exatamente o que a regra 7 proíbe portar. */

export const dynamic = 'force-dynamic'


/**
 * Idioma da conversa, mandado pelo cliente.
 *
 * ⚠️ A rota vive em `/api/chat`, **fora** do segmento `[locale]`, então não há
 * `getLocale()` aqui — o proxy nem passa por ela. Sem isto o Payload devolve o
 * idioma padrão, e a página em inglês recebia mensagem em português (e vice-
 * versa, enquanto os campos não eram localizados).
 */
function idiomaDe(corpo: unknown): 'pt' | 'en' {
  return (corpo as { locale?: string })?.locale === 'en' ? 'en' : 'pt'
}

const JANELA_MS = 60 * 60 * 1000
const acessos = new Map<string, number[]>()

/** Conta as chamadas da última hora e registra esta. Devolve se passou do teto. */
function estourouOLimite(ip: string, teto: number): boolean {
  const agora = Date.now()
  const recentes = (acessos.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  if (recentes.length >= teto) {
    acessos.set(ip, recentes)
    return true
  }
  recentes.push(agora)
  acessos.set(ip, recentes)

  /* Limpeza oportunista: sem isto o mapa cresce com um IP por visitante e nunca
     encolhe. Roda de vez em quando para não pagar o custo a cada requisição. */
  if (acessos.size > 5000) {
    for (const [chave, marcas] of acessos) {
      const vivos = marcas.filter((t) => agora - t < JANELA_MS)
      if (vivos.length === 0) acessos.delete(chave)
      else acessos.set(chave, vivos)
    }
  }
  return false
}

/**
 * Conta a conversa do dia e diz se o teto global já foi atingido.
 *
 * ⚠️ Grava no banco, e não em memória como o limite por IP. O de IP protege
 * contra um visitante em laço e perder a contagem num reinício custa alguns
 * pedidos; este protege **dinheiro**, e contador que zera a cada deploy não
 * protege nada — bastaria reiniciar.
 *
 * ⚠️ Lê e escreve em duas etapas, então duas requisições simultâneas podem
 * contar a mesma posição. O desvio é limitado pela concorrência (unidades, não
 * ordens de grandeza) e o teto é orçamentário, não regulatório — errar para
 * mais em duas conversas num teto de 500 não muda nada. Um `UPDATE ...
 * RETURNING` atômico resolveria, e depende do adapter.
 */
async function estourouOOrcamento(teto: number): Promise<boolean> {
  if (teto <= 0) return false

  const payload = await getPayload()
  const dia = new Date().toISOString().slice(0, 10)

  const { docs } = await payload.find({ collection: 'ai-usage', where: { day: { equals: dia } }, limit: 1, depth: 0 })
  const atual = docs[0]

  if (atual && atual.requests >= teto) return true

  if (atual) {
    await payload.update({ collection: 'ai-usage', id: atual.id, data: { requests: atual.requests + 1 } })
  } else {
    await payload.create({ collection: 'ai-usage', data: { day: dia, requests: 1 } })
  }
  return false
}

export async function POST(req: Request) {
  let corpo: { messages?: Mensagem[]; locale?: string }
  try {
    corpo = (await req.json()) as { messages?: Mensagem[]; locale?: string }
  } catch {
    return NextResponse.json({ error: 'Formato de mensagens inválido.' }, { status: 400 })
  }

  /* ⚠️ Validar o pedido **antes** de qualquer verificação de capacidade.
   *
   * A ordem anterior respondia 503 ("indisponível") a um corpo malformado,
   * porque a checagem da chave vinha antes — o cliente recebia "tente mais
   * tarde" para um erro que é dele e nunca vai passar. Pior: o pedido inválido
   * já tinha consumido uma unidade do teto de orçamento. */
  /* MIG-141: além do formato, os tetos — o limite por IP conta requisições,
   * e sem isto uma requisição carregava qualquer volume de tokens. Histórico
   * longo é cortado em silêncio dentro do validador; mensagem individual
   * gigante ou role desconhecido recusam aqui. */
  const validado = validarConversa(corpo.messages)
  if (!validado.ok) {
    return NextResponse.json({ error: 'Formato de mensagens inválido.' }, { status: 400 })
  }
  const mensagens = validado.mensagens

  const locale = idiomaDe(corpo)
  const payload = await getPayload()
  const config = await payload.findGlobal({ slug: 'atra-ai', depth: 0, locale })

  const indisponivel =
    config?.unavailableMessage ??
    'A ATRA AI está indisponível no momento. Fale com a gente pelo WhatsApp ou por negocios@atra.com.br.'

  if (config?.enabled === false) {
    return NextResponse.json({ error: indisponivel }, { status: 503 })
  }

  if (estourouOLimite(ipDe(req.headers), config?.requestsPerHour ?? 20)) {
    return NextResponse.json({ error: indisponivel }, { status: 429 })
  }

  /* Teto de orçamento (MIG-110). Conferido **antes** de chamar o Gemini: depois
   * seria contabilidade, não guarda. */
  if (await estourouOOrcamento(config?.dailyRequestCap ?? 0)) {
    return NextResponse.json({ error: indisponivel }, { status: 429 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    /* Sem chave a rota não erra 500: responde o mesmo texto de
       indisponibilidade. É o caso do ambiente de desenvolvimento e do
       container do aceite visual. */
    return NextResponse.json({ error: indisponivel }, { status: 503 })
  }

  /* D-60 — o que o assistente pode recomendar: o que está publicado hoje, nos
   * tipos que o admin ligou. Lido aqui, depois de todas as guardas: pedido
   * recusado não consulta o catálogo.
   *
   * ⚠️ Falha aqui não derruba a conversa. Sem catálogo o modelo é instruído a
   * não recomendar nem escrever endereço — responde pior, mas responde. */
  let catalogo: ConteudoRecomendavel[] = []
  try {
    const ligados = tiposLigados(config?.recommends)
    if (ligados.size > 0) catalogo = (await lerCatalogoDaIa(locale)).filter((item) => ligados.has(item.tipo))
  } catch (e) {
    console.error('ATRA AI: catálogo indisponível:', e)
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const resposta = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: mensagens.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      /* `maxOutputTokens`: sem ele a resposta é custo sem teto — e o orçamento
       * de MIG-110 conta requisições, não tokens.
       *
       * ⚠️ `thinkingLevel: MINIMAL` é o que deixa o teto caber. O 3.6-flash
       * raciocina por padrão, e o raciocínio conta **dentro** do
       * `maxOutputTokens`: medido em 05/10, 744 a 836 dos 1024 iam para ele, e
       * a resposta parava no meio da frase (`finishReason: MAX_TOKENS`). Subir
       * o teto só empurra o corte; o raciocínio cresce junto. */
      config: {
        systemInstruction: montarInstrucao(config?.systemPrompt ?? '', catalogo, locale),
        /* ⚠️ 0,3, e não o 0,7 do protótipo (10/10, decisão do G-ferrari). No
         * primeiro teste com o catálogo os cartões saíram certos, mas o texto
         * livre enfeitava: disse como a ATRA cobra e deu a um case qualidades
         * que o resumo não tem. Temperatura baixa deixa a resposta mais
         * contida e mais repetitiva — é a troca certa para quem fala em nome
         * da empresa. Não é garantia: o que impede promessa de preço são os
         * limites de `lib/instrucao-da-ia.ts`. */
        temperature: 0.3,
        maxOutputTokens: MAX_TOKENS_DE_SAIDA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      },
    })
    /* A resposta sai conferida: cartão só de item que existe, link só para
       endereço do catálogo. O host de produção entra na lista porque o modelo
       às vezes escreve o endereço inteiro. */
    const { texto, referencias } = resolverReferencias(resposta.text ?? '', catalogo, [
      process.env.NEXT_PUBLIC_SITE_URL,
      'atra.com.br',
    ])
    return NextResponse.json({ text: texto, referencias })
  } catch (e) {
    console.error('ATRA AI:', e)
    return NextResponse.json({ error: indisponivel }, { status: 502 })
  }
}
