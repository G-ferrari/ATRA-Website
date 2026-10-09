/* D-54 — sincronização de leads com o RD Station Marketing, por conversão.
 *
 * Substitui o `crm.ts` da D-26: a ATRA respondeu em 02/10 que os formulários
 * vivem no **RD Station Marketing**, não no CRM. A arquitetura é a mesma —
 * grava no Postgres primeiro, sincroniza depois, retry por edição —; o que
 * muda é o alvo. Lá cada lead é uma **conversão** (`POST /platform/conversions`),
 * não contato + negociação, e a API devolve só um `event_uuid`.
 *
 * ⚠️ Pelo HTTP puro, sem SDK — a mesma escolha do `email.ts` e do `atrair.ts`:
 * uma chamada `fetch` não justifica uma dependência nova.
 *
 * ⚠️ **Sem chave, não sincroniza e não falha.** O lead já está no Postgres
 * quando isto roda, e a falta fica visível no admin — `rd.syncedAt` vazio —
 * em vez de virar erro para quem acabou de enviar o formulário.
 *
 * ⚠️ `RDSTATION_MARKETING_API_KEY` **sem** `NEXT_PUBLIC_`: chave de servidor
 * (regra 7, o CI reprova o prefixo junto de `KEY`). É a "Chave de API" gerada
 * na App Store do RD (App Publisher → Gerar chave de API) — só registra
 * conversões e não expira. **Não** é o "Token público"/"Token privado" de
 * Integrações → Dados de Integração: aqueles são da API 1.x, que o RD está
 * descontinuando e que o endpoint abaixo não aceita.
 *
 * ⚠️ O contrato externo (`api_key` na query string, corpo `{ event_type:
 * 'CONVERSION', event_family: 'CDP', payload }`, campos `cf_*` para o que não
 * é padrão) vem de developers.rdstation.com. Campo personalizado **precisa
 * existir na conta** antes de ser enviado — por isso eles só vão com a chave
 * `customFields` do admin ligada, e os nomes estão documentados lá.
 */

import type { IntegracaoRd } from '@/types/content'

const ENDPOINT = 'https://api.rd.services/platform/conversions'
const TIMEOUT_MS = 8_000

/** O recorte de `form-submissions` que a sincronização lê. Estrutural de
 * propósito: o hook passa o doc do Payload, os testes passam objetos crus. */
export type LeadParaRd = {
  kind: string
  email: string
  name?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  source?: string | null
  /** Só o kind `chat-lead` (MIG-149) preenche. */
  chatContext?: string | null
  /** Só o kind `data-maturity-diagnostic` (D-35) preenche. Os JSON chegam
   * como `unknown` e a montagem confere o formato. */
  diagnostic?: {
    sector?: string | null
    size?: string | null
    role?: string | null
    level?: string | null
    average?: number | null
    pillars?: unknown
    dama?: unknown
    gaps?: unknown
    topGaps?: string | null
    answers?: unknown
    roadmap?: string | null
    version?: string | null
    durationSeconds?: number | null
  } | null
  confirmedAt?: string | null
  utm?: {
    source?: string | null
    medium?: string | null
    campaign?: string | null
    term?: string | null
    content?: string | null
  } | null
  rd?: {
    eventUuid?: string | null
    syncedAt?: string | null
    error?: string | null
  } | null
}

export type ResultadoDaConversao = { ok: true; eventUuid: string } | { ok: false; motivo: string }

/* ⚠️ Só lead de **marketing/vendas** vai ao RD. `job-application` e
 * `talent-pool` são dado de RH — currículo dentro de base de marketing seria
 * desvio de finalidade (LGPD), não integração. Se a ATRA quiser o banco de
 * talentos lá, é decisão dela, não default nosso (D-29, mantido na D-54). */
export const KINDS_COMERCIAIS = new Set([
  'contact',
  'chat-lead',
  'material-download',
  'rc18-diagnostic',
  'consultant-request',
  'data-maturity-diagnostic',
])

/**
 * Se este doc deve ir ao RD **agora**. Pura, para a matriz de teste.
 *
 * A regra de retry mora aqui: `syncedAt` vazio deixa qualquer escrita
 * posterior — o `notified` da action, um "lido" no admin — tentar de novo.
 * Newsletter só entra confirmada (MIG-103): pendente não é inscrito, muito
 * menos lead.
 */
export function deveSincronizar(doc: LeadParaRd): boolean {
  if (doc.rd?.syncedAt) return false
  if (doc.kind === 'newsletter') return Boolean(doc.confirmedAt)
  return KINDS_COMERCIAIS.has(doc.kind)
}

/** Qual identificador de conversão vale para o kind. `rc18-diagnostic` é o
 * kind antigo (D-35) e entra pelo do diagnóstico de maturidade, que o
 * substituiu — ninguém grava mais aquele kind, mas o retry de um envio velho
 * ainda pode passar por aqui. */
export function identificadorDe(kind: string, conversoes: IntegracaoRd['conversoes']): string | null {
  const mapa: Record<string, string | null> = {
    contact: conversoes.contato,
    'chat-lead': conversoes.chat,
    newsletter: conversoes.newsletter,
    'material-download': conversoes.download,
    'consultant-request': conversoes.consultores,
    'data-maturity-diagnostic': conversoes.diagnostico,
    'rc18-diagnostic': conversoes.diagnostico,
  }
  return mapa[kind] ?? null
}

export async function enviarConversao(doc: LeadParaRd, config: IntegracaoRd): Promise<ResultadoDaConversao> {
  if (!config.ligado) return { ok: false, motivo: 'integração desligada no admin' }
  const chave = process.env.RDSTATION_MARKETING_API_KEY
  if (!chave) return { ok: false, motivo: 'RDSTATION_MARKETING_API_KEY ausente' }
  const identificador = identificadorDe(doc.kind, config.conversoes)
  if (!identificador) return { ok: false, motivo: `sem identificador de conversão para o kind "${doc.kind}"` }

  const corpo = { event_type: 'CONVERSION', event_family: 'CDP', payload: montarPayload(doc, identificador, config) }

  try {
    const r = await fetch(`${ENDPOINT}?api_key=${encodeURIComponent(chave)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!r.ok) {
      /* ⚠️ O corpo do 400 é o que diz **qual campo** o RD recusou (um `cf_`
       * que não existe na conta, por exemplo). Vai para o `rd.error` do admin
       * cortado, para a mensagem caber na tela e não guardar o lead inteiro
       * repetido. */
      const detalhe = (await r.text().catch(() => '')).slice(0, 500)
      console.error('[rd] RD Station Marketing recusou:', r.status, detalhe)
      return { ok: false, motivo: `RD Station respondeu ${r.status}${detalhe ? `: ${detalhe}` : ''}` }
    }
    const json = (await r.json().catch(() => null)) as { event_uuid?: unknown } | null
    const eventUuid = typeof json?.event_uuid === 'string' && json.event_uuid ? json.event_uuid : null
    /* 200 sem `event_uuid` é contrato quebrado, não sucesso: sem o id não há
     * prova de que a conversão entrou, e o retry é barato. */
    if (!eventUuid) return { ok: false, motivo: 'resposta sem event_uuid' }
    return { ok: true, eventUuid }
  } catch (e) {
    /* ⚠️ Nunca propaga: o lead já está no banco, e o retry é gratuito —
     * qualquer escrita com `syncedAt` vazio tenta de novo. */
    console.error('[rd] falhou:', e)
    return { ok: false, motivo: e instanceof Error ? e.message : 'falha de rede' }
  }
}

/* Os nomes dos campos personalizados, **exatamente** como o questionário do
 * Roger (`docs/02-especificacao/diagnostico-maturidade/*.html`) já os mandava
 * ao RD — se a conta da ATRA os criou para o quiz, continuam valendo. Os dois
 * de contato/chat são novos desta decisão. A lista é exportada para o admin e
 * para a documentação dizerem a mesma coisa. */
export const CAMPOS_PERSONALIZADOS = {
  mensagem: 'cf_site_mensagem',
  chat: 'cf_site_chat',
  diagnostico: [
    'cf_quiz_setor_codigo',
    'cf_quiz_porte',
    'cf_quiz_cargo_codigo',
    'cf_quiz_maturidade_geral',
    'cf_quiz_nivel_dmbok',
    'cf_quiz_governanca',
    'cf_quiz_qualidade',
    'cf_quiz_seguranca',
    'cf_quiz_conformidade',
    'cf_quiz_gaps_top3',
    'cf_quiz_gaps_json',
    'cf_quiz_dama_json',
    'cf_quiz_respostas_json',
    'cf_quiz_roadmap',
    'cf_quiz_duracao_seg',
    'cf_quiz_versao',
    'cf_quiz_url',
  ],
} as const

/** O `payload` da conversão. Exportada para o teste conferir o corpo sem
 * passar pela rede. */
export function montarPayload(
  doc: LeadParaRd,
  identificador: string,
  config: Pick<IntegracaoRd, 'camposPersonalizados'>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    conversion_identifier: identificador,
    /* Minúsculo como o `buildPayload` do HTML fazia: é por ele que o RD
     * deduplica o lead. */
    email: doc.email.trim().toLowerCase(),
  }
  const nome = doc.name?.trim()
  if (nome) payload.name = nome
  const telefone = doc.phone?.trim()
  if (telefone) payload.personal_phone = telefone
  const empresa = doc.company?.trim()
  if (empresa) payload.company_name = empresa

  /* Atribuição (D-26, mantida): de onde o visitante veio, pela UTM que a
   * chegada guardou. `traffic_value` é onde o RD guarda o `utm_term`. */
  if (doc.utm?.source) payload.traffic_source = doc.utm.source
  if (doc.utm?.medium) payload.traffic_medium = doc.utm.medium
  if (doc.utm?.campaign) payload.traffic_campaign = doc.utm.campaign
  if (doc.utm?.term) payload.traffic_value = doc.utm.term

  /* ⚠️ Base legal só onde há opt-in **provado**: a newsletter confirmada pelo
   * link (MIG-103). Os outros formulários ainda não têm o aviso de
   * consentimento (P-14), e declarar "consentimento concedido" sem ele seria
   * mentir ao RD — que trata o lead como contatável. Quando a P-14 puser o
   * aviso nos formulários, estende-se aqui. */
  if (doc.kind === 'newsletter' && doc.confirmedAt) {
    payload.legal_bases = [{ category: 'communications', type: 'consent', status: 'granted' }]
    payload.available_for_mailing = true
  }

  if (config.camposPersonalizados) Object.assign(payload, camposPersonalizados(doc))
  return payload
}

/* ⚠️ Só com a chave ligada: campo `cf_` que não existe na conta derruba a
 * conversão inteira em 400, e o lead ficaria preso no retry até alguém criar o
 * campo no RD. Ligado sem os campos criados, o erro aparece no admin
 * (`rd.error`) com o nome do campo recusado. */
function camposPersonalizados(doc: LeadParaRd): Record<string, unknown> {
  const campos: Record<string, unknown> = {}
  const mensagem = doc.message?.trim()
  if (mensagem) campos[CAMPOS_PERSONALIZADOS.mensagem] = mensagem
  const chat = doc.chatContext?.trim()
  if (chat) campos[CAMPOS_PERSONALIZADOS.chat] = chat
  if (doc.source) campos.cf_quiz_url = doc.source

  const d = doc.diagnostic
  if (!d) return campos
  const pilar = (nome: string) => {
    const p = d.pillars
    if (!p || typeof p !== 'object' || Array.isArray(p)) return undefined
    const v = (p as Record<string, unknown>)[nome]
    return typeof v === 'number' && Number.isFinite(v) ? v : undefined
  }
  const json = (v: unknown) => (v === null || v === undefined ? undefined : JSON.stringify(v))
  const entradas: Record<string, unknown> = {
    cf_quiz_setor_codigo: d.sector ?? undefined,
    cf_quiz_porte: d.size ?? undefined,
    cf_quiz_cargo_codigo: d.role ?? undefined,
    cf_quiz_maturidade_geral: typeof d.average === 'number' ? d.average : undefined,
    cf_quiz_nivel_dmbok: d.level ?? undefined,
    cf_quiz_governanca: pilar('Governança'),
    cf_quiz_qualidade: pilar('Qualidade'),
    cf_quiz_seguranca: pilar('Segurança'),
    cf_quiz_conformidade: pilar('Conformidade'),
    cf_quiz_gaps_top3: d.topGaps?.trim() || undefined,
    cf_quiz_gaps_json: json(d.gaps),
    cf_quiz_dama_json: json(d.dama),
    cf_quiz_respostas_json: json(d.answers),
    cf_quiz_roadmap: d.roadmap?.trim() || undefined,
    cf_quiz_duracao_seg: typeof d.durationSeconds === 'number' ? d.durationSeconds : undefined,
    cf_quiz_versao: d.version ?? undefined,
  }
  for (const [chave, valor] of Object.entries(entradas)) if (valor !== undefined) campos[chave] = valor
  return campos
}
