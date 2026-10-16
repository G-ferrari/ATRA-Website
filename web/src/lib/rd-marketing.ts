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

import type { FormularioDoRd, IntegracaoRd } from '@/types/content'

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
  /** Só o kind `talent-pool` (D-62) preenche: o perfil, cada um no seu campo,
   *  e a cópia do aviso que o formulário mostrava. */
  talent?: {
    linkedin?: string | null
    area?: string | null
    seniority?: string | null
    privacyNotice?: string | null
  } | null
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

/* Os kinds que vão ao RD.
 *
 * ⚠️ `job-application` **nunca**: é a candidatura com currículo, e currículo
 * dentro de base de marketing seria desvio de finalidade (LGPD) — D-29, mantido.
 *
 * `talent-pool` **vai desde a D-62** (15/10): a ATRA pediu (Taci, 14/10) que o
 * Trabalhe Conosco chegue ao RD como no site atual, para o agradecimento
 * automático. Vão só dados de contato e de perfil — nunca o currículo, que o
 * banco de talentos nem coleta, nem a mensagem em texto livre
 * (`camposPersonalizados` a deixa de fora). */
export const KINDS_PARA_O_RD = new Set([
  'contact',
  'chat-lead',
  'material-download',
  'rc18-diagnostic',
  'consultant-request',
  'data-maturity-diagnostic',
  'talent-pool',
])

/**
 * Se este doc deve ir ao RD **agora**. Pura, para a matriz de teste.
 *
 * A regra de retry mora aqui: `syncedAt` vazio deixa a próxima escrita no
 * doc — um "lido" no admin — tentar de novo. O `notified` da action grava com
 * `skipRdSync` (task 045): só acontece quando o site já avisou o time.
 * Newsletter só entra confirmada (MIG-103): pendente não é inscrito, muito
 * menos lead.
 */
export function deveSincronizar(doc: LeadParaRd): boolean {
  if (doc.rd?.syncedAt) return false
  if (!KINDS_PARA_O_RD.has(doc.kind) && doc.kind !== 'newsletter') return false
  if (doc.kind === 'newsletter') return Boolean(doc.confirmedAt)
  /* ⚠️ O banco de talentos só vai ao RD com o aviso ao candidato registrado
   * no próprio cadastro (D-62): a cópia do aviso que o formulário mostrava,
   * gravada pela action no servidor. Sem ela a pessoa não foi avisada de que o
   * dado iria a uma base de marketing — vale para quem se cadastrou antes do
   * aviso existir e para quem se cadastrar enquanto ele estiver vazio no
   * admin. É o que impede o retry por edição de mandar um cadastro antigo ao
   * RD quando o RH o marca como lido. */
  if (doc.kind === 'talent-pool') return Boolean(doc.talent?.privacyNotice?.trim())
  return true
}

/**
 * Se o RD já aceitou este lead — e então quem avisa o time é a automação do
 * RD, não o site (task 045, decidido em 15/10). Pura, para a matriz de teste.
 *
 * Não aceitou cobre todo o resto: integração desligada, chave ausente,
 * formulário sem identificador, RD recusou, rede caiu, ou o kind nem vai ao
 * RD. Em todos, o site manda o aviso dele — nenhum lead fica sem aviso.
 */
export function rdAceitou(doc: Pick<LeadParaRd, 'rd'> | null | undefined): boolean {
  return Boolean(doc?.rd?.syncedAt)
}

/** De qual formulário do admin o kind é — a fonte única do mapeamento, que vale
 * para o identificador e para as tags. `rc18-diagnostic` é o kind antigo (D-35)
 * e entra pelo do diagnóstico de maturidade, que o substituiu — ninguém grava
 * mais aquele kind, mas o retry de um envio velho ainda pode passar por aqui. */
export function formularioDoRd(kind: string): FormularioDoRd | null {
  const mapa: Record<string, FormularioDoRd> = {
    contact: 'contato',
    'chat-lead': 'chat',
    newsletter: 'newsletter',
    'material-download': 'download',
    'consultant-request': 'consultores',
    'data-maturity-diagnostic': 'diagnostico',
    'rc18-diagnostic': 'diagnostico',
    'talent-pool': 'talentos',
  }
  return mapa[kind] ?? null
}

/** Qual identificador de conversão vale para o kind. */
export function identificadorDe(kind: string, conversoes: IntegracaoRd['conversoes']): string | null {
  const formulario = formularioDoRd(kind)
  return formulario ? conversoes[formulario] : null
}

/**
 * Se a chave do RD está no servidor (15/10) — é o que o admin mostra em
 * Sistema → Integrações, como "configurada" ou "ausente".
 *
 * ⚠️ Só o booleano sai daqui. A chave fica no ambiente de propósito (D-41,
 * D-54): no banco ela iria junto em todo backup e ficaria à vista de qualquer
 * administrador. Quem chama nunca recebe o valor, nem um pedaço dele.
 */
export function chaveDoRdConfigurada(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.RDSTATION_MARKETING_API_KEY?.trim())
}

export async function enviarConversao(doc: LeadParaRd, config: IntegracaoRd): Promise<ResultadoDaConversao> {
  if (!config.ligado) return { ok: false, motivo: 'integração desligada no admin' }
  /* Aparada, pela mesma regra de `chaveDoRdConfigurada`: o que o admin chama de
     "ausente" não pode virar tentativa de envio aqui. */
  const chave = process.env.RDSTATION_MARKETING_API_KEY?.trim()
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
  /* D-62 — o perfil do Trabalhe Conosco. Os nomes seguem os campos do
   * formulário do WordPress (`area-de-atuacao`, `nivel`), que é o que o plugin
   * do RD mapeava. ⚠️ A confirmar com a lista do RD (task 047): campo que não
   * existe na conta derruba a conversão inteira. */
  talentos: { area: 'cf_area_de_atuacao', senioridade: 'cf_nivel' },
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
  config: Pick<IntegracaoRd, 'camposPersonalizados'> & Partial<Pick<IntegracaoRd, 'tags'>>,
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
  /* `linkedin` é campo padrão do RD, não `cf_`: vai sempre, sem depender da
     chave de campos personalizados. Só o banco de talentos tem (D-62). */
  const linkedin = doc.talent?.linkedin?.trim()
  if (linkedin) payload.linkedin = linkedin

  /* As tags do formulário, como o marketing configurou (task 043) — a
     newsletter chega com `newsletter`, que é como os envios são segmentados.
     Sem tag configurada, o campo nem vai. */
  const formulario = formularioDoRd(doc.kind)
  const tags = formulario ? (config.tags?.[formulario] ?? []) : []
  if (tags.length) payload.tags = [...tags]

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
  /* ⚠️ A mensagem do banco de talentos **não** vai (D-62): ali ela é o perfil
     serializado para o admin, e texto livre de candidato não entra na base de
     marketing. O perfil vai pelos campos próprios, logo abaixo. */
  const mensagem = doc.kind === 'talent-pool' ? undefined : doc.message?.trim()
  if (mensagem) campos[CAMPOS_PERSONALIZADOS.mensagem] = mensagem
  const area = doc.talent?.area?.trim()
  if (area) campos[CAMPOS_PERSONALIZADOS.talentos.area] = area
  const senioridade = doc.talent?.seniority?.trim()
  if (senioridade) campos[CAMPOS_PERSONALIZADOS.talentos.senioridade] = senioridade
  const chat = doc.chatContext?.trim()
  if (chat) campos[CAMPOS_PERSONALIZADOS.chat] = chat
  /* Do candidato vai só o que a D-62 lista: a página de origem não está nela
     (e cairia num campo do questionário). */
  if (doc.source && doc.kind !== 'talent-pool') campos.cf_quiz_url = doc.source

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
