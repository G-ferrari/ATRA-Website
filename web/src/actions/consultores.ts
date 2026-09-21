'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import { enviarAviso } from '@/lib/email'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'
import {
  lerDuracao,
  PADRAO_EMAIL,
  lerModelo,
  lerPerfisPedidos,
  resumoDaSolicitacao,
  type PerfilConfirmado,
} from '@/lib/solicitacao-consultores'
import { MAX_POR_VALOR } from '@/lib/utm'

/* Solicitação de consultores de /consultores (feature consultores-solicitacao,
 * task 012).
 *
 * Mesmo contrato dos outros formulários (`architecture.md` §4): anti-spam →
 * grava → avisa, com o aviso incapaz de derrubar a gravação. A sincronização com
 * o RD Station CRM não vem aqui: é o hook `afterChange` de `form-submissions`, e
 * `consultant-request` entrou na lista comercial na task 011.
 *
 * ⚠️ **Os perfis são revalidados no servidor.** Server Action é endpoint público
 * (MIG-142): o cliente manda ids e quantidades, e cargo e nível saem do
 * `specialist-roles` — nunca do que veio no formulário. Id que não existe some.
 *
 * ⚠️ **Depois que o lead é gravado, a resposta é sucesso, aconteça o que
 * acontecer.** No modelo (`diagnostico-rc18.ts`), `lerContato` e o `update` do
 * `notified` rodam sem proteção depois do `create`: se um deles falhar, o
 * visitante vê erro com o lead já salvo, tenta de novo, e o comercial recebe
 * duplicata. Aqui o bloco pós-gravação só registra no log.
 *
 * ⚠️ `notified` é marcado pelo **id que o `create` devolveu**. O modelo busca o
 * lead por e-mail + kind + `-createdAt`, e dois envios simultâneos do mesmo
 * e-mail marcariam o errado.
 *
 * Destino do aviso: o `email` do global `contact`, como os demais formulários —
 * sem variável de ambiente nova. */

/** ⚠️ `codigo` existe porque `/consultores` é bilíngue e esta action não sabe
 *  o idioma da página: sem ele, quem errasse o e-mail em `/en/consultants` lia
 *  "Confira o e-mail informado." O formulário traduz pelo código; `erro`, em
 *  português, fica como reserva e para quem chamar a action de outro lugar. */
export type CodigoDeErro = 'email' | 'vazio' | 'indisponiveis' | 'falha'

/** O que o visitante mandou, devolvido quando o pedido é recusado.
 *
 * ⚠️ O React 19 **reseta o formulário** quando a action termina — com sucesso
 * **ou** com erro, porque devolver `{ ok: false }` não é lançar. Sem isto, uma
 * recusa apagava nome, e-mail, telefone e descrição, e o visitante redigitava
 * tudo. O formulário usa estes valores como `defaultValue`, e o reset os
 * restaura. Volta só para quem enviou, na mesma resposta; nada vai para log. */
export type ValoresEnviados = {
  name: string
  email: string
  phone: string
  company: string
  message: string
  duracao: string
  modelo: string
}

export type ResultadoSolicitacao =
  | { ok: true }
  | { ok: false; codigo: CodigoDeErro; erro: string; valores: ValoresEnviados }

const ERRO = 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.'
const VAZIO = 'Escolha ao menos um perfil ou descreva o profissional que você procura.'
const INDISPONIVEIS =
  'Os perfis escolhidos não estão mais disponíveis. Atualize a página e escolha de novo, ou descreva o profissional que você procura.'
const MAX_CAMPO = 200
const EMAIL_VALIDO = new RegExp(`^${PADRAO_EMAIL}$`)
const MAX_MENSAGEM = 5000

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

/** Campo de uma linha só — nome, empresa, telefone.
 *
 * ⚠️ `texto()` só apara as pontas. Com quebra de linha no meio, o telefone
 * podia carregar um bloco forjado — "Perfis solicitados (40 pessoas): …" — para
 * dentro do e-mail do comercial, com cara de texto gerado pelo sistema. O
 * `<input>` do navegador já tira quebras, então colapsar não custa nada a quem
 * preenche de boa-fé. */
const linha = (dados: FormData, campo: string): string => texto(dados, campo).replace(/\s+/g, ' ')

const campanha = (dados: FormData, campo: string): string | undefined =>
  texto(dados, campo).slice(0, MAX_POR_VALOR) || undefined

/** O que um erro pode deixar no log: o código do Postgres ou o nome.
 *
 * ⚠️ **Nunca `console.error(..., e)`.** A mensagem do erro do Drizzle leva
 * `params:` — e-mail, nome, telefone, empresa e a mensagem do visitante vão
 * inteiros para o log do servidor. Bastava mandar um caractere NUL no nome para
 * o `create` falhar e gravar o lead no log. O modelo (`diagnostico-rc18.ts`) e
 * `formularios.ts` têm o mesmo defeito. */
const semDadoPessoal = (e: unknown): string => {
  const erro = e as { cause?: { code?: unknown }; code?: unknown; name?: unknown } | null
  return String(erro?.cause?.code ?? erro?.code ?? erro?.name ?? 'erro desconhecido')
}

export async function solicitarConsultores(dados: FormData): Promise<ResultadoSolicitacao> {
  const valores: ValoresEnviados = {
    name: texto(dados, 'name'),
    email: texto(dados, 'email'),
    phone: texto(dados, 'phone'),
    company: texto(dados, 'company'),
    message: texto(dados, 'message', MAX_MENSAGEM),
    duracao: texto(dados, 'duracao'),
    modelo: texto(dados, 'modelo'),
  }
  const recusa = (codigo: CodigoDeErro, erro: string): ResultadoSolicitacao => ({ ok: false, codigo, erro, valores })

  const email = valores.email
  if (!EMAIL_VALIDO.test(email)) return recusa('email', 'Confira o e-mail informado.')

  /* Sem perfil e sem descrição não há pedido.
   *
   * ⚠️ **Antes** das barreiras, e não depois. Na ordem inversa, um envio vazio
   * virava oráculo: o robô recebia `{ ok: true }` se tinha sido barrado e o erro
   * de vazio se não tinha — testava cada técnica sem nunca ser aceito, que é
   * exatamente o "entregar o critério" que o sucesso falso existe para evitar.
   * E de quebra não gasta a cota por IP, que é compartilhada com os outros
   * formulários. */
  const pedidos = lerPerfisPedidos(texto(dados, 'perfis', MAX_MENSAGEM))
  const descricao = texto(dados, 'message', MAX_MENSAGEM)
  if (pedidos.length === 0 && !descricao) return recusa('vazio', VAZIO)

  /* Robô barrado recebe sucesso: dizer "você foi barrado" entrega o critério.
   * O limite por IP vem antes de qualquer trabalho caro (a consulta ao banco). */
  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) {
    console.warn(`[consultores] barrado por ${veredito.motivo}`)
    return { ok: true }
  }
  if (excedeuPorIp(ipDe(await headers()))) return { ok: true }

  /* B4: dentro de `try` — banco fora do ar na inicialização vira resposta, não
   * exceção que o formulário teria de tratar. */
  let payload: Awaited<ReturnType<typeof getPayload>>
  try {
    payload = await getPayload()
  } catch (e) {
    console.error('[consultores] sem conexão com o banco:', semDadoPessoal(e))
    return recusa('falha', ERRO)
  }

  let perfis: PerfilConfirmado[] = []
  if (pedidos.length > 0) {
    try {
      /* `specialist-roles` é `isPublic` e sem drafts: não há rascunho a esconder,
         então o filtro `_status` da regra 4 não se aplica. `select` porque o
         adapter Postgres faz um JOIN por tipo de bloco mesmo com `depth: 0`.
         `pt`: quem lê o resumo é o comercial da ATRA. */
      const { docs } = await payload.find({
        collection: 'specialist-roles',
        where: { id: { in: pedidos.map((p) => p.id) } },
        locale: 'pt',
        depth: 0,
        limit: pedidos.length,
        select: { role: true, level: true },
      })
      const porId = new Map(docs.map((d) => [Number(d.id), d]))
      /* Na ordem em que o visitante escolheu, e não na do banco. */
      perfis = pedidos.flatMap((p) => {
        const d = porId.get(p.id)
        return d ? [{ cargo: d.role, nivel: d.level, quantidade: p.quantidade }] : []
      })
    } catch (e) {
      console.error('[consultores] não conferiu os perfis:', semDadoPessoal(e))
      return recusa('falha', ERRO)
    }
  }
  /* Todos os ids eram forjados ou de perfis que saíram do catálogo.
   *
   * ⚠️ Mensagem própria. Com a mesma do vazio, quem estava com a página aberta
   * enquanto o perfil era despublicado lia "escolha ao menos um perfil" — tendo
   * escolhido — e tentava de novo até a cota por IP virar sucesso falso, sem
   * nada gravado. */
  if (perfis.length === 0 && !descricao) return recusa('indisponiveis', INDISPONIVEIS)

  const mensagem = resumoDaSolicitacao({
    perfis,
    duracaoMeses: lerDuracao(texto(dados, 'duracao')),
    modelo: lerModelo(texto(dados, 'modelo')),
    descricao,
  }).slice(0, MAX_MENSAGEM)

  const nome = linha(dados, 'name')
  const telefone = linha(dados, 'phone')
  const empresa = linha(dados, 'company')

  let id: number | string
  try {
    const doc = await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'consultant-request',
        email,
        name: nome || undefined,
        phone: telefone || undefined,
        company: empresa || undefined,
        message: mensagem,
        source: linha(dados, 'source') || undefined,
        utm: {
          source: campanha(dados, 'utm_source'),
          medium: campanha(dados, 'utm_medium'),
          campaign: campanha(dados, 'utm_campaign'),
          term: campanha(dados, 'utm_term'),
          content: campanha(dados, 'utm_content'),
        },
        status: 'new',
        notified: false,
      },
    })
    id = doc.id
  } catch (e) {
    console.error('[consultores] não gravou:', semDadoPessoal(e))
    return recusa('falha', ERRO)
  }

  /* Daqui em diante o lead está salvo: falha só vai para o log. */
  try {
    const contato = await lerContato()
    const enviou = await enviarAviso({
      para: contato.email,
      assunto: `[site] solicitação de consultores${empresa ? ` — ${empresa}` : ''}`,
      responderPara: email,
      /* `filter(Boolean)` só nas linhas de contato, que são opcionais: no corpo
         inteiro ele comeria as linhas em branco entre os blocos. */
      texto: [
        'Nova solicitação de consultores pelo site.',
        [
          'Contato',
          nome && `Nome: ${nome}`,
          empresa && `Empresa: ${empresa}`,
          `E-mail: ${email}`,
          telefone && `Telefone: ${telefone}`,
        ]
          .filter(Boolean)
          .join('\n'),
        mensagem,
      ].join('\n\n'),
    })
    if (enviou) await payload.update({ collection: 'form-submissions', id, data: { notified: true } })
  } catch (e) {
    console.error(`[consultores] lead ${id} gravado, mas o aviso falhou:`, semDadoPessoal(e))
  }

  return { ok: true }
}

/** A assinatura que o `useActionState` exige — `(estadoAnterior, dados)` —, para
 * o formulário receber **a própria Server Action**, e não um embrulho cliente.
 *
 * ⚠️ É isto que faz o envio funcionar **sem JavaScript**. Com um embrulho
 * (`async (_, dados) => solicitarConsultores(dados)`), o React não tem uma
 * referência de servidor para emitir, e o HTML sai com
 * `action="javascript:throw new Error('React form unexpectedly submitted.')"`:
 * sem JS, o clique em enviar não faz nada. O `Formulario` de contato e o
 * diagnóstico RC18 têm esse defeito, apesar de o comentário deles e a SPEC §11
 * afirmarem o contrário. */
export async function solicitarConsultoresNoFormulario(
  _anterior: ResultadoSolicitacao | null,
  dados: FormData,
): Promise<ResultadoSolicitacao> {
  return solicitarConsultores(dados)
}
