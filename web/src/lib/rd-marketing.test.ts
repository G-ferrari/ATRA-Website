import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CONVERSOES_PADRAO } from './formatos-de-integracao'
import {
  CAMPOS_PERSONALIZADOS,
  chaveDoRdConfigurada,
  deveSincronizar,
  enviarConversao,
  identificadorDe,
  KINDS_PARA_O_RD,
  formularioDoRd,
  rdAceitou,
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
  tags: { contato: [], chat: [], newsletter: ['newsletter'], download: [], consultores: [], diagnostico: [] },
  ...extra,
})

/* Task 045: quem avisa o time é o RD quando ele aceitou; senão, o site. */
describe('rdAceitou', () => {
  it('só com syncedAt gravado', () => {
    expect(rdAceitou({ rd: { syncedAt: '2026-10-16T12:00:00Z' } })).toBe(true)
    expect(rdAceitou({ rd: { syncedAt: null, error: 'RD Station respondeu 400' } })).toBe(false)
    expect(rdAceitou({ rd: null })).toBe(false)
    expect(rdAceitou(null)).toBe(false)
  })
})

/* 15/10: o admin mostra se a chave está no servidor — e só isso. */
describe('chaveDoRdConfigurada', () => {
  it('diz se a chave existe, sem devolver nada dela', () => {
    expect(chaveDoRdConfigurada({ RDSTATION_MARKETING_API_KEY: 'abc123' })).toBe(true)
    expect(chaveDoRdConfigurada({})).toBe(false)
  })

  it('chave só com espaço conta como ausente', () => {
    expect(chaveDoRdConfigurada({ RDSTATION_MARKETING_API_KEY: '   ' })).toBe(false)
  })
})

/* Espelho declarado de `KINDS_PARA_O_RD`, conferido pelo teste logo abaixo. */
const COMERCIAIS = [
  'contact',
  'chat-lead',
  'material-download',
  'rc18-diagnostic',
  'consultant-request',
  'data-maturity-diagnostic',
  'custom-form',
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
  it('manda os kinds da lista', () => {
    for (const kind of COMERCIAIS) expect(deveSincronizar(lead({ kind }))).toBe(true)
  })

  /* ⚠️ É este teste que impede a próxima pessoa de repetir o que aconteceu com
     `rc18-diagnostic` no `crm.ts`: ele entrou na lista e ficou sete dias sem
     cobertura, porque a lista acima é escrita à mão. */
  it('a lista deste arquivo ainda espelha KINDS_PARA_O_RD', () => {
    expect([...COMERCIAIS].sort()).toEqual([...KINDS_PARA_O_RD].sort())
  })

  /* A candidatura com currículo é RH: currículo em base de marketing seria
     desvio de finalidade (D-29, mantido). O banco de talentos foi da D-62 à
     D-67 e saiu: cada inscrição gastava um lead do plano do RD. */
  it('segura a candidatura com currículo e o banco de talentos', () => {
    expect(deveSincronizar(lead({ kind: 'job-application' }))).toBe(false)
    expect(deveSincronizar(lead({ kind: 'talent-pool' }))).toBe(false)
  })

  /* ⚠️ D-67: o cadastro do banco de talentos ainda guarda a cópia do aviso de
     privacidade (`talent.privacyNotice`), que da D-62 à D-67 era o que o
     liberava para o RD. Um cadastro daquela semana, com a cópia, não pode ir
     quando o RH o marcar como lido no admin. */
  it('banco de talentos não vai nem com a cópia do aviso no cadastro', () => {
    const comAviso = {
      ...lead({ kind: 'talent-pool' }),
      talent: { privacyNotice: 'Seu cadastro também vai ao RD Station.' },
    } as LeadParaRd
    expect(deveSincronizar(comAviso)).toBe(false)
  })

  it('kind fora da lista não vai', () => {
    expect(deveSincronizar(lead({ kind: 'qualquer-outro' }))).toBe(false)
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
    expect(identificadorDe({ kind: 'contact' }, c)).toBe('site-contato')
    expect(identificadorDe({ kind: 'chat-lead' }, c)).toBe('site-chat')
    expect(identificadorDe({ kind: 'newsletter' }, c)).toBe('site-newsletter')
    expect(identificadorDe({ kind: 'material-download' }, c)).toBe('site-download-material')
    expect(identificadorDe({ kind: 'consultant-request' }, c)).toBe('site-solicitacao-consultores')
    expect(identificadorDe({ kind: 'data-maturity-diagnostic' }, c)).toBe('site-diagnostico-maturidade')
    expect(identificadorDe({ kind: 'rc18-diagnostic' }, c)).toBe('site-diagnostico-maturidade')
    /* D-67: sem formulário no RD, sem identificador — a segunda trava, se o
       kind voltasse à lista por engano. */
    expect(identificadorDe({ kind: 'talent-pool' }, c)).toBeNull()
  })

  it('kind sem identificador (apagado no admin, ou RH) é null', () => {
    expect(identificadorDe({ kind: 'contact' }, { ...config().conversoes, contato: null })).toBeNull()
    expect(identificadorDe({ kind: 'job-application' }, config().conversoes)).toBeNull()
  })

  /* Task 046: cada e-book chega ao RD com o próprio identificador. */
  describe('download de e-book', () => {
    const download = (material: LeadParaRd['material']) => ({ kind: 'material-download', material })

    it('vai com o identificador do e-book, quando ele tem', () => {
      const c = config().conversoes
      expect(identificadorDe(download({ slug: 'guia', identificador: 'E-book Guia de Governança' }), c)).toBe(
        'E-book Guia de Governança',
      )
    })

    it('sem identificador próprio, vai como ebook-<slug>', () => {
      const c = config().conversoes
      expect(identificadorDe(download({ slug: 'guia-de-governanca', identificador: null }), c)).toBe(
        'ebook-guia-de-governanca',
      )
      expect(identificadorDe(download({ slug: 'guia-de-governanca', identificador: '   ' }), c)).toBe(
        'ebook-guia-de-governanca',
      )
    })

    it('e-book que não pôde ser lido cai no identificador do formulário', () => {
      expect(identificadorDe(download(null), config().conversoes)).toBe('site-download-material')
      expect(identificadorDe(download({ slug: null, identificador: null }), config().conversoes)).toBe(
        'site-download-material',
      )
    })

    /* O do formulário continua sendo o liga/desliga, como em todo formulário. */
    it('formulário de download vazio no admin: nenhum e-book vai, nem com identificador próprio', () => {
      const c = { ...config().conversoes, download: null }
      expect(identificadorDe(download({ slug: 'guia', identificador: 'E-book Guia' }), c)).toBeNull()
      expect(identificadorDe(download({ slug: 'guia', identificador: null }), c)).toBeNull()
    })

    it('o material só vale para o download', () => {
      expect(identificadorDe({ kind: 'contact', material: { slug: 'guia', identificador: 'X' } }, config().conversoes)).toBe(
        'site-contato',
      )
    })

    it('a conversão sai com o identificador do e-book', async () => {
      vi.stubEnv('RDSTATION_MARKETING_API_KEY', 'chave-falsa-de-teste')
      const fetch = vi.fn(async () => new Response(JSON.stringify({ event_uuid: 'uuid-9' }), { status: 200 }))
      vi.stubGlobal('fetch', fetch)
      try {
        const r = await enviarConversao(
          lead({ kind: 'material-download', material: { slug: 'guia-de-governanca', identificador: null } }),
          config(),
        )
        expect(r).toEqual({ ok: true, eventUuid: 'uuid-9' })
        const corpo = JSON.parse(String((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body))
        expect(corpo.payload.conversion_identifier).toBe('ebook-guia-de-governanca')
      } finally {
        vi.unstubAllEnvs()
        vi.unstubAllGlobals()
      }
    })
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

  /* Task 044: as tags que o marketing configurou no admin (043). */
  it('leva as tags do formulário — a newsletter com `newsletter`', () => {
    const cfg = config({ tags: { ...config().tags, contato: ['lead site', 'comercial'] } })
    expect(montarPayload(lead(), 'site-contato', cfg).tags).toEqual(['lead site', 'comercial'])
    const inscrito = lead({ kind: 'newsletter', confirmedAt: '2026-10-02T10:00:00Z' })
    expect(montarPayload(inscrito, 'site-newsletter', config()).tags).toEqual(['newsletter'])
  })

  it('sem tag configurada, o campo nem vai', () => {
    expect(montarPayload(lead(), 'site-contato', config())).not.toHaveProperty('tags')
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
      cf_quiz_maturidade_geral: '2.45',
      cf_quiz_nivel_dmbok: '2 · Repetível',
      cf_quiz_governanca: '2.1',
      cf_quiz_qualidade: '2.8',
      cf_quiz_seguranca: '3',
      cf_quiz_conformidade: '1.9',
      cf_quiz_gaps_top3: 'LGPD (12) | IA (9) | BCB (7)',
      cf_quiz_gaps_json: JSON.stringify(diagnostico.gaps),
      cf_quiz_dama_json: JSON.stringify(diagnostico.dama),
      cf_quiz_respostas_json: JSON.stringify(diagnostico.answers),
      cf_quiz_roadmap: '1. Governança; 2. Qualidade',
      cf_quiz_duracao_seg: '184',
      cf_quiz_versao: '1.0',
    })
    /* Todo cf_quiz_* enviado está na lista que o admin mostra ao marketing. */
    const enviados = Object.keys(p).filter((k) => k.startsWith('cf_quiz_'))
    for (const k of enviados) expect(CAMPOS_PERSONALIZADOS.diagnostico).toContain(k)
    /* A RD recusa o lead inteiro com número num campo de texto (27/10). */
    for (const k of enviados) expect(typeof p[k]).toBe('string')
  })

  it('leva o idioma e o link absoluto da página do resultado, no idioma do lead', () => {
    const token = 'a'.repeat(43)
    const p = montarPayload(
      lead({ kind: 'data-maturity-diagnostic', diagnostic: { ...diagnostico, locale: 'en', resultToken: token } }),
      'site-diagnostico-maturidade',
      config({ camposPersonalizados: true }),
    )
    expect(p.cf_quiz_idioma).toBe('en')
    expect(p.cf_quiz_link_resultado).toMatch(new RegExp(`^https?://[^/]+/en/data-maturity-assessment/resultado/${token}$`))
  })

  it('lead sem token (de antes de 28/10) não leva link nem idioma', () => {
    const p = montarPayload(
      lead({ kind: 'data-maturity-diagnostic', diagnostic: { ...diagnostico, resultToken: 'curto' } }),
      'site-diagnostico-maturidade',
      config({ camposPersonalizados: true }),
    )
    expect(p).not.toHaveProperty('cf_quiz_link_resultado')
    expect(p).not.toHaveProperty('cf_quiz_idioma')
  })

  it('pilar que não é número é pulado em vez de sair NaN', () => {
    const p = montarPayload(
      lead({ kind: 'data-maturity-diagnostic', diagnostic: { pillars: { Governança: 'x', Qualidade: 2 } } }),
      'site-diagnostico-maturidade',
      config({ camposPersonalizados: true }),
    )
    expect(p).not.toHaveProperty('cf_quiz_governanca')
    expect(p.cf_quiz_qualidade).toBe('2')
  })
})

/* D-67 (22/10): o Trabalhe Conosco não vai ao RD. Da D-62 à D-67 ia, com o
   perfil em campos próprios; o que sobra é provar que nenhuma peça daquele
   envio continua de pé. */
describe('banco de talentos fora do RD', () => {
  it('não é formulário do RD, e não há campo personalizado de candidato', () => {
    expect(formularioDoRd('talent-pool')).toBeNull()
    expect(Object.keys(CAMPOS_PERSONALIZADOS)).not.toContain('talentos')
    expect(Object.keys(CONVERSOES_PADRAO)).not.toContain('talentPool')
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

/* Task 050 — o formulário montado no admin. O gancho resolve `formulario`
   (identificador, tags e destino de cada campo) a partir do `form` do envio. */
describe('formulário do admin no RD', () => {
  const formulario = {
    identificador: 'Inscrição Evento Dados',
    tags: ['evento', 'dados-2026'],
    campos: [
      { id: 'f1', tipo: 'name', campoNoRd: null },
      { id: 'f2', tipo: 'email', campoNoRd: null },
      { id: 'f3', tipo: 'jobTitle', campoNoRd: null },
      { id: 'f4', tipo: 'select', campoNoRd: 'cf_area_de_interesse' },
      { id: 'f5', tipo: 'longText', campoNoRd: 'cf_desafio' },
      { id: 'f6', tipo: 'shortText', campoNoRd: null },
      { id: 'f7', tipo: 'checkbox', campoNoRd: 'cf_aceite' },
    ],
  }
  const envio = (extra: Partial<LeadParaRd> = {}) =>
    lead({
      kind: 'custom-form',
      name: 'Ana',
      email: 'Ana@Empresa.com.br',
      company: 'Banco X',
      source: '/eventos',
      formulario,
      answers: [
        { fieldId: 'f1', label: 'Nome', value: 'Ana' },
        { fieldId: 'f2', label: 'E-mail', value: 'Ana@Empresa.com.br' },
        { fieldId: 'f3', label: 'Cargo', value: 'CDO' },
        { fieldId: 'f4', label: 'Área', value: 'governanca' },
        { fieldId: 'f5', label: 'Desafio', value: '  ' },
        { fieldId: 'f6', label: 'Como soube', value: 'LinkedIn' },
        { fieldId: 'f7', label: 'Aceito', value: 'Sim' },
      ],
      communicationConsent: false,
      ...extra,
    })

  it('vai ao RD, com o identificador e as tags do próprio formulário', () => {
    expect(deveSincronizar(envio())).toBe(true)
    expect(identificadorDe(envio(), config().conversoes)).toBe('Inscrição Evento Dados')
    expect(montarPayload(envio(), 'Inscrição Evento Dados', config()).tags).toEqual(['evento', 'dados-2026'])
  })

  it('formulário apagado ou sem identificador não vai — e não cai em identificador de outro formulário', () => {
    expect(identificadorDe(envio({ formulario: null }), config().conversoes)).toBeNull()
    expect(identificadorDe(envio({ formulario: { ...formulario, identificador: '  ' } }), config().conversoes)).toBeNull()
  })

  it('campos padrão, cargo em job_title, sem cf_ com a chave desligada — nem a página de origem', () => {
    expect(montarPayload(envio(), 'X', config())).toEqual({
      conversion_identifier: 'X',
      email: 'ana@empresa.com.br',
      name: 'Ana',
      company_name: 'Banco X',
      job_title: 'CDO',
      tags: ['evento', 'dados-2026'],
    })
  })

  it('com a chave, só os cf_ escolhidos no formulário, sem resposta vazia e sem cf_quiz_url', () => {
    const p = montarPayload(envio(), 'X', config({ camposPersonalizados: true }))
    expect(p).toMatchObject({ cf_area_de_interesse: 'governanca', cf_aceite: 'Sim' })
    expect(p).not.toHaveProperty('cf_desafio')
    expect(p).not.toHaveProperty('cf_quiz_url')
    expect(p).not.toHaveProperty(CAMPOS_PERSONALIZADOS.mensagem)
    expect(JSON.stringify(p)).not.toMatch(/LinkedIn/)
  })

  it('caixa de marcar desmarcada não vai ao RD (o "Não" fica só no envio)', () => {
    const desmarcada = envio({
      answers: [
        { fieldId: 'f2', label: 'E-mail', value: 'ana@empresa.com.br' },
        { fieldId: 'f7', label: 'Aceito', value: 'Não' },
      ],
    })
    expect(montarPayload(desmarcada, 'X', config({ camposPersonalizados: true }))).not.toHaveProperty('cf_aceite')
  })

  it('consentimento marcado declara a base legal; desmarcado não declara', () => {
    expect(montarPayload(envio({ communicationConsent: true }), 'X', config())).toMatchObject({
      legal_bases: [{ category: 'communications', type: 'consent', status: 'granted' }],
      available_for_mailing: true,
    })
    const sem = montarPayload(envio(), 'X', config())
    expect(sem).not.toHaveProperty('legal_bases')
    expect(sem).not.toHaveProperty('available_for_mailing')
  })

  it('enviarConversao sem formulário ou sem identificador não toca na rede, e o motivo diz onde olhar', async () => {
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', 'chave-teste')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await expect(enviarConversao(envio({ formulario: null }), config())).resolves.toEqual({
      ok: false,
      motivo: 'formulário do envio apagado ou ilegível',
    })
    await expect(
      enviarConversao(envio({ formulario: { ...formulario, identificador: null } }), config()),
    ).resolves.toEqual({
      ok: false,
      motivo: 'formulário sem identificador de conversão (aba RD Station do formulário)',
    })
    expect(fetchMock).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })
})
