import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { deveSincronizar, KINDS_COMERCIAIS, resumoDoDiagnostico, sincronizarLead, type LeadParaCrm } from './crm'

const lead = (extra: Partial<LeadParaCrm> = {}): LeadParaCrm => ({
  kind: 'contact',
  email: 'lead@empresa.com.br',
  name: 'Maria',
  company: 'Empresa X',
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

/* O grupo como a action da task 025 grava: números do motor, top 3 no formato
   `cf_quiz_gaps_top3` do questionário do Roger. */
const diagnostico = {
  level: '2 · Repetível',
  average: 2.45,
  pillars: { Governança: 2.1, Qualidade: 2.8, Segurança: 3, Conformidade: 1.9 },
  topGaps: 'LGPD (12) | IA (9) | BCB (7)',
}

describe('deveSincronizar', () => {
  it('manda os kinds comerciais', () => {
    for (const kind of COMERCIAIS) {
      expect(deveSincronizar(lead({ kind }))).toBe(true)
    }
  })

  /* ⚠️ É este teste que impede a próxima pessoa de repetir o que aconteceu com
     `rc18-diagnostic`: ele entrou em `KINDS_COMERCIAIS` e ficou **sete dias**
     sem cobertura, porque a lista acima é escrita à mão e ninguém conferia se
     ela ainda espelhava o conjunto. Acrescentar kind comercial sem tocar aqui
     agora reprova. */
  it('a lista deste arquivo ainda espelha KINDS_COMERCIAIS', () => {
    expect([...COMERCIAIS].sort()).toEqual([...KINDS_COMERCIAIS].sort())
  })

  /* D-35: o diagnóstico de maturidade é lead de vendas — é ele que substitui o
     da RC 18 na página e no funil. */
  it('manda o diagnóstico de maturidade', () => {
    expect(deveSincronizar(lead({ kind: 'data-maturity-diagnostic', diagnostic: diagnostico }))).toBe(true)
  })

  /* Candidatura e banco de talentos são RH: currículo em pipeline de vendas
     seria desvio de finalidade, não integração (D-29). */
  it('segura os kinds de RH', () => {
    expect(deveSincronizar(lead({ kind: 'job-application' }))).toBe(false)
    expect(deveSincronizar(lead({ kind: 'talent-pool' }))).toBe(false)
  })

  /* MIG-103: sem o clique de confirmação a pessoa NÃO está inscrita — muito
     menos é lead. */
  it('newsletter só entra confirmada', () => {
    expect(deveSincronizar(lead({ kind: 'newsletter' }))).toBe(false)
    expect(deveSincronizar(lead({ kind: 'newsletter', confirmedAt: '2026-09-03T10:00:00Z' }))).toBe(true)
  })

  it('não repete quem já sincronizou', () => {
    expect(deveSincronizar(lead({ crm: { syncedAt: '2026-09-03T10:00:00Z' } }))).toBe(false)
  })

  /* A regra do retry: falha anterior deixa `syncedAt` vazio, e qualquer
     escrita posterior tenta de novo. */
  it('tenta de novo quando a falha anterior deixou syncedAt vazio', () => {
    expect(deveSincronizar(lead({ crm: { contactId: 'c1', error: 'timeout' } }))).toBe(true)
  })
})

describe('sincronizarLead', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RDSTATION_CRM_TOKEN', 'tok-teste')
    fetchMock.mockReset()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  const resposta = (json: unknown, ok = true) =>
    ({ ok, status: ok ? 200 : 422, json: async () => json, text: async () => JSON.stringify(json) }) as Response

  it('sem token, devolve não sincronizado sem tocar na rede', async () => {
    vi.stubEnv('RDSTATION_CRM_TOKEN', '')
    const r = await sincronizarLead(lead())
    expect(r.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('acha o contato pelo e-mail e cria só a negociação', async () => {
    fetchMock
      .mockResolvedValueOnce(resposta({ contacts: [{ _id: 'c1' }] })) // GET /contacts
      .mockResolvedValueOnce(resposta({ _id: 'd1' })) // POST /deals
      .mockResolvedValueOnce(resposta({ ok: true })) // POST /activities (melhor esforço)

    const r = await sincronizarLead(lead({ message: 'quero saber de FinOps' }))
    expect(r).toMatchObject({ ok: true, contactId: 'c1', dealId: 'd1' })

    const urls = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(urls[0]).toContain('/contacts?email=lead%40empresa.com.br')
    expect(urls[0]).toContain('token=tok-teste')
    expect(urls[1]).toContain('/deals?token=')
  })

  /* O rótulo da origem é o que o comercial lê no RD Station para saber de onde
     veio o lead. Sem ele, "Solicitação de consultores" chega como negociação
     indistinguível de um "Fale conosco". */
  it('leva a origem legível do kind na negociação', async () => {
    fetchMock
      .mockResolvedValueOnce(resposta({ contacts: [{ _id: 'c1' }] }))
      .mockResolvedValueOnce(resposta({ _id: 'd1' }))
      .mockResolvedValueOnce(resposta({ ok: true }))

    await sincronizarLead(lead({ kind: 'consultant-request' }))
    const corpo = String(fetchMock.mock.calls[1][1]?.body)
    expect(corpo).toContain('Solicitação de consultores')
  })

  /* O comercial liga sabendo o nível e onde a empresa está mais fraca, sem
     abrir o admin. */
  it('anota nível, média, pilares e top 3 do diagnóstico na negociação', async () => {
    fetchMock
      .mockResolvedValueOnce(resposta({ contacts: [{ _id: 'c1' }] }))
      .mockResolvedValueOnce(resposta({ _id: 'd1' }))
      .mockResolvedValueOnce(resposta({ ok: true }))

    await sincronizarLead(lead({ kind: 'data-maturity-diagnostic', diagnostic: diagnostico }))

    expect(String(fetchMock.mock.calls[1][1]?.body)).toContain('Diagnóstico de maturidade de dados')
    expect(String(fetchMock.mock.calls[2][0])).toContain('/activities')
    const { activity } = JSON.parse(String(fetchMock.mock.calls[2][1]?.body)) as {
      activity: { deal_id: string; text: string }
    }
    expect(activity.deal_id).toBe('d1')
    expect(activity.text).toContain('nível 2 · Repetível (média 2,45)')
    expect(activity.text).toContain('Pilares: Governança 2,1 · Qualidade 2,8 · Segurança 3 · Conformidade 1,9')
    expect(activity.text).toContain('Maiores gaps: LGPD (12) | IA (9) | BCB (7)')
  })

  it('cria o contato quando a busca volta vazia', async () => {
    fetchMock
      .mockResolvedValueOnce(resposta({ contacts: [] })) // GET /contacts
      .mockResolvedValueOnce(resposta({ _id: 'c2' })) // POST /contacts
      .mockResolvedValueOnce(resposta({ _id: 'd2' })) // POST /deals

    const r = await sincronizarLead(lead())
    expect(r).toMatchObject({ ok: true, contactId: 'c2', dealId: 'd2' })

    const corpo = JSON.parse(String(fetchMock.mock.calls[1][1]?.body)) as {
      contact: { name: string; emails: { email: string }[] }
    }
    expect(corpo.contact.name).toBe('Maria')
    expect(corpo.contact.emails[0].email).toBe('lead@empresa.com.br')
  })

  /* Idempotência (D-26): id já gravado nunca é recriado. */
  it('reaproveita os ids já gravados no doc', async () => {
    fetchMock.mockResolvedValueOnce(resposta({ ok: true })) // só a anotação
    const r = await sincronizarLead(lead({ message: 'oi', crm: { contactId: 'c1', dealId: 'd1' } }))
    expect(r).toMatchObject({ ok: true, contactId: 'c1', dealId: 'd1' })
    expect(fetchMock.mock.calls.every(([u]) => String(u).includes('/activities'))).toBe(true)
  })

  /* O contato criado sobrevive à falha da negociação: gravá-lo é o que impede
     o retry de duplicar contato. */
  it('devolve o contactId parcial quando a negociação falha', async () => {
    fetchMock
      .mockResolvedValueOnce(resposta({ contacts: [{ _id: 'c1' }] }))
      .mockResolvedValueOnce(resposta({ errors: 'stage inválido' }, false))

    const r = await sincronizarLead(lead())
    expect(r).toMatchObject({ ok: false, contactId: 'c1' })
  })

  it('erro de rede vira { ok: false }, nunca exceção', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    await expect(sincronizarLead(lead())).resolves.toMatchObject({ ok: false })
  })

  it('quem não disse o nome entra pelo e-mail (a API exige nome)', async () => {
    fetchMock
      .mockResolvedValueOnce(resposta({ contacts: [] }))
      .mockResolvedValueOnce(resposta({ _id: 'c3' }))
      .mockResolvedValueOnce(resposta({ _id: 'd3' }))

    await sincronizarLead(lead({ name: undefined }))
    const corpo = JSON.parse(String(fetchMock.mock.calls[1][1]?.body)) as { contact: { name: string } }
    expect(corpo.contact.name).toBe('lead@empresa.com.br')
  })
})

describe('resumoDoDiagnostico', () => {
  /* Envio de outro kind chega com o grupo inteiro em `null` (é assim que o
     Payload devolve grupo vazio): não pode virar linha na anotação. */
  it('grupo ausente ou vazio não gera texto', () => {
    expect(resumoDoDiagnostico(null)).toBeNull()
    expect(resumoDoDiagnostico(undefined)).toBeNull()
    expect(resumoDoDiagnostico({ level: null, average: null, pillars: null, topGaps: null })).toBeNull()
  })

  it('pula pilar que não é número em vez de escrever NaN', () => {
    const texto = resumoDoDiagnostico({ pillars: { Governança: 2.5, Qualidade: 'x', Segurança: null } })
    expect(texto).toBe('Pilares: Governança 2,5')
  })

  it('ignora pilares em formato que não é objeto', () => {
    expect(resumoDoDiagnostico({ level: '1 · Inicial', pillars: [1, 2] })).toBe(
      'Diagnóstico de maturidade: nível 1 · Inicial',
    )
  })
})
