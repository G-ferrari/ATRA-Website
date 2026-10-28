'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import { destinoDoAviso } from '@/lib/destino-do-aviso'
import { enviarAviso } from '@/lib/email'
import { conferirEnvio, MAX_CAMPOS, MAX_TEXTO_LONGO, nomeDoCampo, type ConferenciaDoEnvio } from '@/lib/formularios-do-admin'
import { ipDe } from '@/lib/ip'
import { isLocale, type Locale } from '@/lib/locales'
import { destinoDepoisDoEnvio, toConfigDoFormulario } from '@/lib/mappers/form'
import { getPayload } from '@/lib/payload'
import { rdAceitou } from '@/lib/rd-marketing'
import { traduzirLink } from '@/lib/traduzir-links'
import { MAX_POR_VALOR } from '@/lib/utm'
import type { ConfigDoFormulario } from '@/types/content'

/* O envio de um formulário montado no admin (feature criador-de-formularios,
 * task 049).
 *
 * O mesmo caminho dos formulários escritos em código (`formularios.ts`):
 * anti-spam → **grava** → aviso. Gravar antes de avisar é o que garante que um
 * problema no e-mail não perca o lead. O que muda é que os campos não são
 * conhecidos aqui: vêm do formulário **publicado**, lido pelo id a cada envio,
 * e é contra ele que o envio é conferido (`conferirEnvio`). Nome que não é
 * campo do formulário nem é lido.
 *
 * ⚠️ Lido com a Local API, que ignora o `access` — por isso o filtro de
 * `_status` escrito (regra 4 do CLAUDE.md): sem ele, um formulário em
 * rascunho, ou uma página com um id antigo, gravaria envios.
 *
 * O RD é o gancho de `form-submissions`, que roda dentro do `create`; o corpo
 * da conversão do formulário do admin é a task 050. Até lá o kind novo não vai
 * ao RD, e o aviso do site sempre sai.
 */

/* `{ ok: true }` sem redirecionamento, num formulário que leva a outra página,
 * é o sucesso falso do anti-spam (ou do limite por IP): a seção (051) leva o
 * visitante à página que já tem nas props, para o falso não se distinguir do
 * verdadeiro — que chega aqui como `redirect()`. */
export type ResultadoDoFormularioDoAdmin =
  | { ok: true }
  | {
      ok: false
      /** Mensagem geral, acima do botão. */
      erro?: string
      /** Por id da linha do campo: a mensagem ao lado de cada um. */
      erros?: Record<string, string>
    }

const ERRO_GENERICO: Record<Locale, string> = {
  pt: 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.',
  en: 'We could not send it right now. Please try WhatsApp or negocios@atra.com.br.',
  es: 'No pudimos enviar ahora. Intente por WhatsApp o en negocios@atra.com.br.',
}

const MAX_CAMPO = 200
const ler = (dados: FormData, campo: string, max = MAX_CAMPO): string => String(dados.get(campo) ?? '').trim().slice(0, max)

/** Um parâmetro de campanha, cortado no teto. `undefined` quando vazio. */
const campanha = (dados: FormData, campo: string): string | undefined => ler(dados, campo).slice(0, MAX_POR_VALOR) || undefined

/** O que um erro pode deixar no log: o código do Postgres ou o nome — nunca a
 *  mensagem, que no Drizzle leva os valores gravados (ver `formularios.ts`). */
const semDadoPessoal = (e: unknown): string => {
  const erro = e as { cause?: { code?: unknown }; code?: unknown; name?: unknown } | null
  return String(erro?.cause?.code ?? erro?.code ?? erro?.name ?? 'erro desconhecido')
}

export async function enviarFormularioDoAdmin(dados: FormData): Promise<ResultadoDoFormularioDoAdmin> {
  const idioma = ler(dados, 'locale')
  const locale: Locale = isLocale(idioma) ? idioma : 'pt'
  const generico = { ok: false as const, erro: ERRO_GENERICO[locale] }

  const id = Number(ler(dados, 'formulario'))
  if (!Number.isSafeInteger(id) || id <= 0) return generico

  const veredito = conferir({ isca: ler(dados, CAMPO_ISCA), carimbo: ler(dados, 'carimbo') })
  if (!veredito.ok) {
    /* ⚠️ Sucesso falso ao robô, de propósito — dizer "barrado" entrega o
       critério (ver `formularios.ts`). */
    console.warn(`[formulario-do-admin] barrado por ${veredito.motivo}`)
    /* Sem JavaScript, o sucesso de um formulário que leva a outra página é o
       redirecionamento (051): o falso tem que ser igual, ou um robô sem
       JavaScript distingue os dois pela resposta. Fora do `try`, como abaixo. */
    const destinoDoFalso = await destinoPublicado(id, locale)
    if (destinoDoFalso) redirect(destinoDoFalso)
    return { ok: true }
  }

  const payload = await getPayload()

  let config: ConfigDoFormulario
  let destino: string | null
  let rotuloDoConsentimento: string | undefined
  try {
    const lerNo = (idiomaDaLeitura: Locale) =>
      payload.find({
        collection: 'forms',
        where: { and: [{ id: { equals: id } }, { _status: { equals: 'published' } }] },
        depth: 0,
        limit: 1,
        locale: idiomaDaLeitura,
      })
    /* Os rótulos em português: são eles que ficam no envio e no aviso, como
       nos formulários escritos em código. */
    const { docs } = await lerNo('pt')
    if (!docs[0]) return generico
    config = toConfigDoFormulario(docs[0])
    /* D-71: no inglês, o item citado vai ao slug inglês quando existe. */
    const bruto = destinoDepoisDoEnvio(docs[0], locale)
    destino = bruto && (await traduzirLink(bruto, locale))
    /* ⚠️ Menos a caixa de consentimento: ela guarda o texto **que o visitante
       viu e marcou**, no idioma da página — é a prova do consentimento
       (LGPD, art. 8º), como a cópia do aviso no Trabalhe Conosco (D-62). */
    const consentimento = config.campos.find((c) => c.consentimento)
    if (consentimento && locale !== 'pt') {
      const noIdioma = (await lerNo(locale)).docs[0]
      rotuloDoConsentimento = noIdioma?.fields?.find((f) => f.id === consentimento.id)?.label?.trim() || undefined
    }
  } catch (e) {
    console.error(`[formulario-do-admin] não leu o formulário ${id}:`, semDadoPessoal(e))
    return generico
  }

  const conferencia = conferirEnvio(config, (campoId) => String(dados.get(nomeDoCampo(campoId)) ?? ''), locale)
  if (!conferencia.ok) {
    return Object.keys(conferencia.erros).length ? { ok: false, erros: conferencia.erros } : generico
  }

  /* Depois da conferência, e não antes: o teto conta só envio válido. Antes,
     cada tentativa com erro de campo gastava uma das vagas do IP — e um
     escritório inteiro atrás de um IP só (NAT) perderia inscrições no
     silêncio do sucesso falso. O descarte fica no log, sem o IP. */
  if (excedeuPorIp(ipDe(await headers()))) {
    console.warn('[formulario-do-admin] barrado por limite de envios do IP')
    if (destino) redirect(destino)
    return { ok: true }
  }
  if (rotuloDoConsentimento) {
    const idDoConsentimento = config.campos.find((c) => c.consentimento)?.id
    for (const r of conferencia.respostas) if (r.campoId === idDoConsentimento) r.rotulo = rotuloDoConsentimento
  }

  const source = ler(dados, 'source') || undefined
  let idDoEnvio: number | string
  try {
    const gravado = await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'custom-form',
        form: config.id,
        email: conferencia.padrao.email,
        name: conferencia.padrao.name,
        phone: conferencia.padrao.phone,
        company: conferencia.padrao.company,
        answers: conferencia.respostas.map((r) => ({ fieldId: r.campoId, label: r.rotulo, value: r.valor })),
        communicationConsent: conferencia.consentimento,
        source,
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
    idDoEnvio = gravado.id
  } catch (e) {
    console.error(`[formulario-do-admin] não gravou o envio do formulário ${id}:`, semDadoPessoal(e))
    return generico
  }

  /* Daqui em diante o lead está salvo: falha só vai para o log, e a resposta
     é sucesso — responder erro faria o visitante enviar de novo, e o time
     receberia duplicata (o defeito que `formularios.ts` já evita). */
  let enviou = false
  try {
    if (!(await rdJaAvisou(payload, idDoEnvio))) {
      /* Regra da task 045: quando o RD aceita, quem avisa é a automação dele;
         quando não aceita, o site manda o aviso — aos endereços do
         formulário, ou ao destino geral de contato. */
      const para = config.avisarPara.length ? config.avisarPara : destinoDoAviso(await lerContato(), 'contato')
      enviou = await enviarAviso({
        para,
        assunto: `[site] ${config.nome}${conferencia.padrao.company ? ` — ${conferencia.padrao.company}` : ''}`,
        responderPara: conferencia.padrao.email,
        texto: resumo(conferencia, source, campanha(dados, 'utm_campaign')),
      })
    }
  } catch (e) {
    console.error(`[formulario-do-admin] envio ${idDoEnvio} gravado, mas o aviso falhou:`, semDadoPessoal(e))
  }

  /* ⚠️ Com `skipRdSync`: este caminho só roda quando o RD não aceitou e o site
     já avisou — tentar o RD de novo aqui daria dois avisos se passasse. */
  if (enviou) {
    try {
      await payload.update({
        collection: 'form-submissions',
        id: idDoEnvio,
        data: { notified: true },
        context: { skipRdSync: true },
      })
    } catch (e) {
      console.error('[formulario-do-admin] não marcou o aviso como enviado:', semDadoPessoal(e))
    }
  }

  /* Fora de qualquer `try`: o `redirect` funciona lançando, e com JavaScript
     desligado é ele que leva o visitante à página escolhida. */
  if (destino) redirect(destino)
  return { ok: true }
}

/** O estado da seção "Formulário" (task 051): o resultado e, quando o envio
 *  volta com erro, o que o visitante tinha digitado. */
export type EstadoDoFormularioDoAdmin = ResultadoDoFormularioDoAdmin & {
  /** Por nome do campo no `<form>` (`campo-…`). */
  valores?: Record<string, string>
}

/**
 * A action com a assinatura do `useActionState`, entregue **direto** a ele
 * pela seção (051).
 *
 * ⚠️ Direto, e não embrulhada numa função do navegador: só uma Server Action
 * de verdade vira o `action` do `<form>` no HTML, e é isso que faz o envio
 * funcionar com o JavaScript desligado — o navegador posta, o servidor roda
 * isto e devolve a página com o estado (ou o `redirect`).
 *
 * Com erro, volta também o que foi digitado: o React 19 limpa o formulário ao
 * fim de toda action, e a seção devolve os valores como `defaultValue`. Só os
 * campos do formulário (`campo-…`), cortados no teto, nunca os escondidos.
 */
export async function enviarFormularioDoAdminNoEstado(
  _anterior: EstadoDoFormularioDoAdmin | null,
  dados: FormData,
): Promise<EstadoDoFormularioDoAdmin> {
  const resultado = await enviarFormularioDoAdmin(dados)
  if (resultado.ok) return resultado
  const valores: Record<string, string> = {}
  for (const [nome, valor] of dados) {
    if (Object.keys(valores).length >= MAX_CAMPOS) break
    if (nome.startsWith(nomeDoCampo('')) && typeof valor === 'string') valores[nome] = valor.slice(0, MAX_TEXTO_LONGO)
  }
  return { ...resultado, valores }
}

/** Para onde o formulário publicado leva depois do envio — só para o sucesso
 *  falso imitar o verdadeiro. Falhar ao ler é ficar na mensagem. */
async function destinoPublicado(id: number, locale: Locale): Promise<string | null> {
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'forms',
      where: { and: [{ id: { equals: id } }, { _status: { equals: 'published' } }] },
      depth: 0,
      limit: 1,
      locale: 'pt',
      select: { afterSubmit: true, redirectPath: true },
    })
    const destino = docs[0] ? destinoDepoisDoEnvio(docs[0], locale) : null
    return destino && (await traduzirLink(destino, locale))
  } catch {
    return null
  }
}

/** Se o RD aceitou o envio recém-gravado. Falhar ao reler conta como "não
 *  aceitou": na dúvida o site avisa — um aviso a mais, nunca um a menos. */
async function rdJaAvisou(payload: Awaited<ReturnType<typeof getPayload>>, id: number | string): Promise<boolean> {
  try {
    const gravado = await payload.findByID({ collection: 'form-submissions', id, depth: 0, select: { rd: true } })
    return rdAceitou(gravado)
  } catch (e) {
    console.error('[formulario-do-admin] não releu o resultado do RD:', semDadoPessoal(e))
    return false
  }
}

function resumo(conferencia: Extract<ConferenciaDoEnvio, { ok: true }>, source?: string, campanhaDaUtm?: string): string {
  return [
    ...conferencia.respostas.map((r) => (r.valor.includes('\n') ? `${r.rotulo}:\n${r.valor}` : `${r.rotulo}: ${r.valor}`)),
    source && `Veio de: ${source}`,
    campanhaDaUtm && `Campanha: ${campanhaDaUtm}`,
  ]
    .filter(Boolean)
    .join('\n')
}
