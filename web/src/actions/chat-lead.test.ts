import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/* Fluxo da Server Action do convite de lead do chat — o que ela grava e como
 * marca o aviso. `conferir` (anti-spam) roda de verdade; banco, e-mail,
 * contato, cabeçalhos e o limite por IP são simulados, no padrão de
 * `consultores.test.ts`. */

const payload = { find: vi.fn(), findGlobal: vi.fn(), create: vi.fn(), update: vi.fn() }
const enviarAviso = vi.fn()
const lerContato = vi.fn()
const excedeuPorIp = vi.fn()
const getPayload = vi.fn()

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }) }))
vi.mock('@/lib/payload', () => ({ getPayload: () => getPayload() }))
vi.mock('@/lib/email', () => ({ enviarAviso: (...a: unknown[]) => enviarAviso(...a) }))
vi.mock('@/lib/contato', () => ({ lerContato: () => lerContato() }))
vi.mock('@/lib/anti-spam', async (original) => ({
  ...(await original<typeof import('@/lib/anti-spam')>()),
  excedeuPorIp: (...a: unknown[]) => excedeuPorIp(...a),
}))

const { enviarLeadDoChat } = await import('./chat-lead')

const form = (campos: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(campos)) f.set(k, v)
  return f
}
const valido = (extra: Record<string, string> = {}) =>
  form({ email: 'gestora@banco.com.br', name: 'Ana', company: 'Banco X', chatContext: 'Quanto custa um lakehouse?', ...extra })

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('ENABLE_CHAT_LEAD', '1')
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  excedeuPorIp.mockReturnValue(false)
  getPayload.mockResolvedValue(payload)
  payload.findGlobal.mockResolvedValue({ leadCapture: { enabled: true } })
  lerContato.mockResolvedValue({
    email: 'negocios@atra.com.br',
    destinos: { contato: null, consultores: null, diagnostico: null, carreiras: null, chat: null },
  })
  enviarAviso.mockResolvedValue(true)
  payload.create.mockResolvedValue({ id: 501 })
  payload.update.mockResolvedValue({})
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('enviarLeadDoChat — o aviso volta ao lead certo', () => {
  it('grava o lead do chat e avisa o comercial', async () => {
    const r = await enviarLeadDoChat(valido())
    expect(r).toEqual({ ok: true })
    expect(payload.create.mock.calls[0][0].data).toMatchObject({
      kind: 'chat-lead',
      email: 'gestora@banco.com.br',
      company: 'Banco X',
      status: 'new',
      notified: false,
    })
    expect(enviarAviso).toHaveBeenCalledWith(
      expect.objectContaining({ assunto: '[site] novo lead do chat — Banco X', responderPara: 'gestora@banco.com.br' }),
    )
  })

  it('marca notified pelo id que o create devolveu, sem disparar o RD de novo', async () => {
    await enviarLeadDoChat(valido())
    expect(payload.update).toHaveBeenCalledTimes(1)
    expect(payload.update).toHaveBeenCalledWith({
      collection: 'form-submissions',
      id: 501,
      data: { notified: true },
      context: { skipRdSync: true },
    })
  })

  /* ⚠️ Antes ela procurava "o último lead do chat daquele e-mail" e marcava
     o que achasse — podia ser um envio antigo da mesma pessoa. */
  it('não procura o lead pelo e-mail', async () => {
    await enviarLeadDoChat(valido())
    expect(payload.find).not.toHaveBeenCalled()
  })

  it('aviso recusado: grava e não marca notified', async () => {
    enviarAviso.mockResolvedValue(false)
    const r = await enviarLeadDoChat(valido())
    expect(r).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(payload.update).not.toHaveBeenCalled()
  })
})

describe('enviarLeadDoChat — depois de gravar, é sucesso', () => {
  /* O lead já está gravado e o time já foi avisado: um erro aqui faria o
     visitante tentar de novo, e o comercial receber duplicata. */
  it('falha ao marcar notified: continua sucesso', async () => {
    payload.update.mockRejectedValue(new Error('timeout'))
    const r = await enviarLeadDoChat(valido())
    expect(r).toEqual({ ok: true })
    expect(console.error).toHaveBeenCalledWith('[chat-lead] não marcou o aviso como enviado:', expect.any(Error))
  })

  /* ⚠️ `lerContato` ficava fora de qualquer `try`: o banco falhando aqui
     derrubava a resposta com o lead já salvo. */
  it('falha ao ler o contato depois de gravar: continua sucesso', async () => {
    lerContato.mockRejectedValue(new Error('banco caiu'))
    const r = await enviarLeadDoChat(valido())
    expect(r).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(enviarAviso).not.toHaveBeenCalled()
    expect(payload.update).not.toHaveBeenCalled()
  })

  /* `enviarAviso` promete não lançar; se um dia lançar, o lead segue gravado. */
  it('aviso lança depois de gravar: continua sucesso, sem marcar notified', async () => {
    enviarAviso.mockRejectedValue(new Error('rede'))
    const r = await enviarLeadDoChat(valido())
    expect(r).toEqual({ ok: true })
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('o log da falha depois de gravar não leva o que o visitante digitou', async () => {
    /* O formato do erro do Drizzle: a mensagem carrega os `params` da consulta. */
    lerContato.mockRejectedValue(
      Object.assign(new Error('Failed query: … params: gestora@banco.com.br,Ana'), { cause: { code: '57P01' } }),
    )
    await enviarLeadDoChat(valido())
    expect(console.error).toHaveBeenCalledWith('[chat-lead] lead 501 gravado, mas o aviso falhou:', '57P01')
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain('gestora@banco.com.br')
  })

  it('falha ao GRAVAR: aí sim é erro — e nem avisa', async () => {
    payload.create.mockRejectedValue(new Error('constraint'))
    const r = await enviarLeadDoChat(valido())
    expect(r).toMatchObject({ ok: false })
    expect(enviarAviso).not.toHaveBeenCalled()
    expect(payload.update).not.toHaveBeenCalled()
  })
})

describe('enviarLeadDoChat — a guarda de flag fica na action', () => {
  it('sem ENABLE_CHAT_LEAD: recusa sem consultar o banco', async () => {
    vi.stubEnv('ENABLE_CHAT_LEAD', '')
    const r = await enviarLeadDoChat(valido())
    expect(r).toMatchObject({ ok: false })
    expect(getPayload).not.toHaveBeenCalled()
  })

  it('convite desligado no CMS: recusa sem gravar', async () => {
    payload.findGlobal.mockResolvedValue({ leadCapture: { enabled: false } })
    const r = await enviarLeadDoChat(valido())
    expect(r).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })
})
