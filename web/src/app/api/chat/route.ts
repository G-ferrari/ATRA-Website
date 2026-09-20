import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

import { MAX_TOKENS_DE_SAIDA, validarConversa, type Mensagem } from '@/lib/chat'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'

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

  const payload = await getPayload()
  const config = await payload.findGlobal({ slug: 'atra-ai', depth: 0, locale: idiomaDe(corpo) })

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

  try {
    const ai = new GoogleGenAI({ apiKey })
    const resposta = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: mensagens.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      /* `maxOutputTokens`: sem ele a resposta é custo sem teto — e o orçamento
       * de MIG-110 conta requisições, não tokens. */
      config: { systemInstruction: config?.systemPrompt ?? '', temperature: 0.7, maxOutputTokens: MAX_TOKENS_DE_SAIDA },
    })
    return NextResponse.json({ text: resposta.text ?? '' })
  } catch (e) {
    console.error('ATRA AI:', e)
    return NextResponse.json({ error: indisponivel }, { status: 502 })
  }
}
