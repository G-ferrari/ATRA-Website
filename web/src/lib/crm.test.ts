import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { deveSincronizar, sincronizarLead, type LeadParaCrm } from './crm'

const lead = (extra: Partial<LeadParaCrm> = {}): LeadParaCrm => ({
  kind: 'contact',
  email: 'lead@empresa.com.br',
  name: 'Maria',
  company: 'Empresa X',
  ...extra,
})

describe('deveSincronizar', () => {
  /* ⚠️ A lista tem de espelhar `KINDS_COMERCIAIS` inteiro. `rc18-diagnostic`
     entrou no conjunto e nunca entrou aqui — um kind comercial sem cobertura
     nenhuma até esta task. */
  it('manda os kinds comerciais', () => {
    for (const kind of ['contact', 'chat-lead', 'material-download', 'rc18-diagnostic', 'consultant-request']) {
      expect(deveSincronizar(lead({ kind }))).toBe(true)
    }
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
