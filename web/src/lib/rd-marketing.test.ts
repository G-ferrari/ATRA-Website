import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CONVERSOES_PADRAO } from './formatos-de-integracao'
import {
  CAMPOS_PERSONALIZADOS,
  deveSincronizar,
  enviarConversao,
  identificadorDe,
  KINDS_COMERCIAIS,
  montarPayload,
  type LeadParaRd,
} from './rd-marketing'
import type { IntegracaoRd } from '@/types/content'

const lead = (extra: Partial<LeadParaRd> = {}): LeadParaRd => ({
  kind: 'contact',
  email: 'Lead@Empresa.com.br',
  name: 'Maria',
  company: 'Empresa X',
  ...extra,
})

const config = (extra: Partial<IntegracaoRd> = {}): IntegracaoRd => ({
  ligado: true,
  camposPersonalizados: false,
  conversoes: {
    contato: CONVERSOES_PADRAO.contact,
    chat: CONVERSOES_PADRAO.chatLead,
    newsletter: CONVERSOES_PADRAO.newsletter,
    download: CONVERSOES_PADRAO.materialDownload,
    consultores: CONVERSOES_PADRAO.consultantRequest,
    diagnostico: CONVERSOES_PADRAO.dataMaturityDiagnostic,
  },
  ...extra,
})

/* Espelho declarado de `KINDS_COMERCIAIS`, conferido pelo teste logo abaixo. */
const COMERCIAIS = [
  'contact',
  'chat-lead',
  'material-download',
  'rc18-diagnostic',
  'consultant-request',
  'data-maturity-diagnostic',
]

/* O grupo como a action do diagnóstico grava: números do motor, top 3 no
   formato `cf_quiz_gaps_top3` do questionário do Roger. */
const diagnostico: NonNullable<LeadParaRd['diagnostic']> = {
  sector: 'financeiro',
  size: 'ate_50mi',
  role: 'cio_cto_cdo',
  level: '2 · Repetível',
  average: 2.45,
  pillars: { Governança: 2.1, Qualidade: 2.8, Segurança: 3, Conformidade: 1.9 },
  dama: { 'Governança de Dados': 2.1 },
  gaps: { LGPD: 12, IA: 9, BCB: 7 },
  topGaps: 'LGPD (12) | IA (9) | BCB (7)',
  answers: [{ id: 'q1', score: 2 }],
  roadmap: '1. Governança; 2. Qualidade',
  version: '1.0',
  durationSeconds: 184,
}

describe('deveSincronizar', () => {
  it('manda os kinds comerciais', () => {
    for (const kind of COMERCIAIS) expect(deveSincronizar(lead({ kind }))).toBe(true)
  })

  /* ⚠️ É este teste que impede a próxima pessoa de repetir o que aconteceu com
     `rc18-diagnostic` no `crm.ts`: ele entrou na lista e ficou sete dias sem
     cobertura, porque a lista acima é escrita à mão. */
  it('a lista deste arquivo ainda espelha KINDS_COMERCIAIS', () => {
    expect([...COMERCIAIS].sort()).toEqual([...KINDS_COMERCIAIS].sort())
  })

  /* Candidatura e banco de talentos são RH: currículo em base de marketing
     seria desvio de finalidade, não integração (D-29, mantido na D-54). */
  it('segura os kinds de RH', () => {
    expect(deveSincronizar(lead({ kind: 'job-application' }))).toBe(false)
    expect(deveSincronizar(lead({ kind: 'talent-pool' }))).toBe(false)
  })

  /* MIG-103: sem o clique de confirmação a pessoa NÃO está inscrita. */
  it('newsletter só entra confirmada', () => {
    expect(deveSincronizar(lead({ kind: 'newsletter' }))).toBe(false)
    expect(deveSincronizar(lead({ kind: 'newsletter', confirmedAt: '2026-10-02T10:00:00Z' }))).toBe(true)
  })

  it('não repete quem já sincronizou', () => {
    expect(deveSincronizar(lead({ rd: { syncedAt: '2026-10-02T10:00:00Z' } }))).toBe(false)
  })

  /* A regra do retry: falha anterior deixa `syncedAt` vazio, e qualquer
     escrita posterior tenta de novo. */
  it('tenta de novo quando a falha anterior deixou syncedAt vazio', () => {
    expect(deveSincronizar(lead({ rd: { error: 'timeout' } }))).toBe(true)
  })
})

describe('identificadorDe', () => {
  it('cada kind comercial tem o seu, e o da RC 18 cai no do diagnóstico que o substituiu', () => {
    const c = config().conversoes
    expect(identificadorDe('contact', c)).toBe('site-contato')
    expect(identificadorDe('chat-lead', c)).toBe('site-chat')
    expect(identificadorDe('newsletter', c)).toBe('site-newsletter')
    expect(identificadorDe('material-download', c)).toBe('site-download-material')
    expect(identificadorDe('consultant-request', c)).toBe('site-solicitacao-consultores')
    expect(identificadorDe('data-maturity-diagnostic', c)).toBe('site-diagnostico-maturidade')
    expect(identificadorDe('rc18-diagnostic', c)).toBe('site-diagnostico-maturidade')
  })

  it('kind sem identificador (apagado no admin, ou RH) é null', () => {
    expect(identificadorDe('contact', { ...config().conversoes, contato: null })).toBeNull()
    expect(identificadorDe('job-application', config().conversoes)).toBeNull()
  })
})

describe('montarPayload', () => {
  it('leva os campos padrão do RD, com o e-mail minúsculo', () => {
    const p = montarPayload(lead({ phone: '11 99999-0000' }), 'site-contato', config())
    expect(p).toEqual({
      conversion_identifier: 'site-contato',
      email: 'lead@empresa.com.br',
      name: 'Maria',
      personal_phone: '11 99999-0000',
      company_name: 'Empresa X',
    })
  })

  /* De onde o visitante veio (D-26): a UTM da chegada vira os campos de
     tráfego do RD; `traffic_value` é onde ele guarda o `utm_term`. */
  it('leva a atribuição de campanha nos campos de tráfego', () => {
    const p = montarPayload(
      lead({ utm: { source: 'linkedin', medium: 'cpc', campaign: 'rc18', term: 'dados', content: null } }),
      'site-contato',
      config(),
    )
    expect(p).toMatchObject({
      traffic_source: 'linkedin',
      traffic_medium: 'cpc',
      traffic_campaign: 'rc18',
      traffic_value: 'dados',
    })
  })

  /* ⚠️ Base legal só onde há opt-in provado. Declarar consentimento no
     formulário de contato, que ainda não tem o aviso (P-14), seria mentir ao
     RD, que passaria a tratar o lead como contatável. */
  it('declara consentimento de comunicação só para a newsletter confirmada', () => {
    const contato = montarPayload(lead(), 'site-contato', config())
    expect(contato).not.toHaveProperty('legal_bases')
    expect(contato).not.toHaveProperty('available_for_mailing')

    const newsletter = montarPayload(
      lead({ kind: 'newsletter', confirmedAt: '2026-10-02T10:00:00Z' }),
      'site-newsletter',
      config(),
    )
    expect(newsletter.legal_bases).toEqual([{ category: 'communications', type: 'consent', status: 'granted' }])
    expect(newsletter.available_for_mailing).toBe(true)
  })

  /* ⚠️ `cf_` que não existe na conta derruba a conversão inteira: por isso
     eles só vão com a chave ligada, e sem ela nem a mensagem vai. */
  it('sem a chave de campos personalizados, nenhum cf_ sai — nem a mensagem', () => {
    const p = montarPayload(
      lead({ message: 'quero saber de FinOps', chatContext: 'oi', diagnostic: diagnostico }),
      'site-contato',
      config(),
    )
    expect(Object.keys(p).some((k) => k.startsWith('cf_'))).toBe(false)
  })

  it('com a chave, mensagem e chat vão nos campos documentados', () => {
    const p = montarPayload(
      lead({ kind: 'chat-lead', message: 'quero saber de FinOps', chatContext: 'o que é RC 18?', source: '/chat' }),
      'site-chat',
      config({ camposPersonalizados: true }),
    )
    expect(p[CAMPOS_PERSONALIZADOS.mensagem]).toBe('quero saber de FinOps')
    expect(p[CAMPOS_PERSONALIZADOS.chat]).toBe('o que é RC 18?')
    expect(p.cf_quiz_url).toBe('/chat')
  })

  /* Os nomes são os do `buildPayload` do questionário do Roger — se a conta
     do RD já os tem, continuam valendo. */
  it('com a chave, o diagnóstico vai nos cf_quiz_* do questionário original', () => {
    const p = montarPayload(
      lead({ kind: 'data-maturity-diagnostic', diagnostic: diagnostico }),
      'site-diagnostico-maturidade',
      config({ camposPersonalizados: true }),
    )
    expect(p).toMatchObject({
      cf_quiz_setor_codigo: 'financeiro',
      cf_quiz_porte: 'ate_50mi',
      cf_quiz_cargo_codigo: 'cio_cto_cdo',
      cf_quiz_maturidade_geral: 2.45,
      cf_quiz_nivel_dmbok: '2 · Repetível',
      cf_quiz_governanca: 2.1,
      cf_quiz_qualidade: 2.8,
      cf_quiz_seguranca: 3,
      cf_quiz_conformidade: 1.9,
      cf_quiz_gaps_top3: 'LGPD (12) | IA (9) | BCB (7)',
      cf_quiz_gaps_json: JSON.stringify(diagnostico.gaps),
      cf_quiz_dama_json: JSON.stringify(diagnostico.dama),
      cf_quiz_respostas_json: JSON.stringify(diagnostico.answers),
      cf_quiz_roadmap: '1. Governança; 2. Qualidade',
      cf_quiz_duracao_seg: 184,
      cf_quiz_versao: '1.0',
    })
    /* Todo cf_quiz_* enviado está na lista que o admin mostra ao marketing. */
    const enviados = Object.keys(p).filter((k) => k.startsWith('cf_quiz_'))
    for (const k of enviados) expect(CAMPOS_PERSONALIZADOS.diagnostico).toContain(k)
  })

  it('pilar que não é número é pulado em vez de sair NaN', () => {
    const p = montarPayload(
      lead({ kind: 'data-maturity-diagnostic', diagnostic: { pillars: { Governança: 'x', Qualidade: 2 } } }),
      'site-diagnostico-maturidade',
      config({ camposPersonalizados: true }),
    )
    expect(p).not.toHaveProperty('cf_quiz_governanca')
    expect(p.cf_quiz_qualidade).toBe(2)
  })
})

describe('enviarConversao', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', 'chave-teste')
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  const resposta = (json: unknown, ok = true, status = ok ? 200 : 400) =>
    ({ ok, status, json: async () => json, text: async () => JSON.stringify(json) }) as Response

  it('sem chave, devolve não sincronizado sem tocar na rede', async () => {
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', '')
    const r = await enviarConversao(lead(), config())
    expect(r).toMatchObject({ ok: false, motivo: expect.stringContaining('RDSTATION_MARKETING_API_KEY') })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('desligado no admin, não chama ninguém mesmo com a chave', async () => {
    const r = await enviarConversao(lead(), config({ ligado: false }))
    expect(r.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('formulário sem identificador não é enviado', async () => {
    const r = await enviarConversao(lead(), config({ conversoes: { ...config().conversoes, contato: null } }))
    expect(r).toMatchObject({ ok: false, motivo: expect.stringContaining('contact') })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('manda a conversão no formato da API e guarda o event_uuid', async () => {
    fetchMock.mockResolvedValueOnce(resposta({ event_uuid: 'ev-1' }))
    const r = await enviarConversao(lead(), config())
    expect(r).toEqual({ ok: true, eventUuid: 'ev-1' })

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.rd.services/platform/conversions?api_key=chave-teste')
    expect(init.method).toBe('POST')
    const corpo = JSON.parse(String(init.body)) as {
      event_type: string
      event_family: string
      payload: Record<string, unknown>
    }
    expect(corpo.event_type).toBe('CONVERSION')
    expect(corpo.event_family).toBe('CDP')
    expect(corpo.payload.conversion_identifier).toBe('site-contato')
    expect(corpo.payload.email).toBe('lead@empresa.com.br')
  })

  /* O corpo do 400 é o que diz qual campo o RD recusou: vai para o admin. */
  it('recusa da API vira { ok: false } com o motivo legível, nunca exceção', async () => {
    fetchMock.mockResolvedValueOnce(resposta({ errors: { cf_site_mensagem: ['não existe'] } }, false))
    const r = await enviarConversao(lead(), config())
    expect(r).toMatchObject({ ok: false, motivo: expect.stringContaining('400') })
    expect((r as { motivo: string }).motivo).toContain('cf_site_mensagem')
  })

  it('200 sem event_uuid não conta como sincronizado', async () => {
    fetchMock.mockResolvedValueOnce(resposta({}))
    await expect(enviarConversao(lead(), config())).resolves.toMatchObject({ ok: false })
  })

  it('erro de rede vira { ok: false }, nunca exceção', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    await expect(enviarConversao(lead(), config())).resolves.toMatchObject({ ok: false, motivo: 'fetch failed' })
  })
})
