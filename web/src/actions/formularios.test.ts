import { beforeEach, describe, expect, it, vi } from 'vitest'

/* Task 045 — quem avisa o time a cada contato e cadastro no banco de talentos.
 * Decidido em 15/10: quando o RD aceita o lead, quem avisa é a automação do RD
 * (como no site atual); quando não aceita, o site manda o aviso dele. Banco,
 * e-mail, contato, integrações e cabeçalhos são simulados; o anti-spam roda de
 * verdade. O RD em si está no gancho (`hooks/sincronizar-rd.ts`), que aqui
 * aparece só pelo resultado que ele deixou gravado (`rd.syncedAt`). */

const payload = { create: vi.fn(), findByID: vi.fn(), update: vi.fn(), find: vi.fn() }
const enviarAviso = vi.fn()
const getPayload = vi.fn()

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }) }))
vi.mock('@/lib/payload', () => ({ getPayload: () => getPayload() }))
vi.mock('@/lib/email', () => ({ enviarAviso: (...a: unknown[]) => enviarAviso(...a) }))
vi.mock('@/lib/contato', () => ({
  lerContato: async () => ({
    email: 'negocios@atra.com.br',
    destinos: { contato: null, consultores: null, diagnostico: null, carreiras: 'rh@atra.com.br', chat: null },
  }),
}))
vi.mock('@/lib/integracoes', () => ({
  lerIntegracaoAtrair: async () => ({ endpoint: null, vagas: false, bancoDeTalentos: false }),
  lerIntegracaoRd: async () => ({ avisoAoCandidato: 'Aviso de teste.' }),
}))
vi.mock('@/lib/atrair', () => ({ enviarParaAtrair: async () => false }))
vi.mock('@/lib/anti-spam', async (original) => ({
  ...(await original<typeof import('@/lib/anti-spam')>()),
  excedeuPorIp: () => false,
}))

const { enviarFormulario } = await import('./formularios')

const form = (campos: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(campos)) f.set(k, v)
  return f
}
const contato = () => form({ kind: 'contact', email: 'lead@empresa.com.br', name: 'Maria', message: 'Oi' })
const talento = () => form({ kind: 'talent-pool', email: 'cand@exemplo.com', name: 'Ana', area: 'Data Engineering' })

/** O que o gancho do RD deixou gravado no documento. */
const rdGravou = (rd: Record<string, unknown> | null) => payload.findByID.mockResolvedValue({ id: 501, rd })

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  getPayload.mockResolvedValue(payload)
  payload.create.mockResolvedValue({ id: 501 })
  payload.update.mockResolvedValue({})
  enviarAviso.mockResolvedValue(true)
  rdGravou(null)
})

describe('aviso ao time (task 045)', () => {
  it('RD aceitou o contato → o site não manda aviso (quem avisa é o RD)', async () => {
    rdGravou({ syncedAt: '2026-10-16T12:00:00Z', eventUuid: 'uuid-1', error: null })
    expect(await enviarFormulario(contato())).toEqual({ ok: true })
    expect(enviarAviso).not.toHaveBeenCalled()
    expect(payload.update).not.toHaveBeenCalled()
  })

  it.each([
    ['chave ausente ou integração desligada', null],
    ['RD recusou', { syncedAt: null, error: 'RD Station respondeu 400' }],
    ['rede caiu', { syncedAt: null, error: 'fetch failed' }],
  ])('RD não aceitou (%s) → o site manda um aviso e marca notified pelo id', async (_, rd) => {
    rdGravou(rd)
    expect(await enviarFormulario(contato())).toEqual({ ok: true })
    expect(enviarAviso).toHaveBeenCalledTimes(1)
    expect(enviarAviso).toHaveBeenCalledWith(expect.objectContaining({ para: 'negocios@atra.com.br' }))
    expect(payload.update).toHaveBeenCalledWith({ collection: 'form-submissions', id: 501, data: { notified: true } })
  })

  it('banco de talentos segue a mesma regra, com o aviso indo para o RH', async () => {
    await enviarFormulario(talento())
    expect(enviarAviso).toHaveBeenCalledWith(expect.objectContaining({ para: 'rh@atra.com.br' }))

    vi.clearAllMocks()
    getPayload.mockResolvedValue(payload)
    payload.create.mockResolvedValue({ id: 502 })
    rdGravou({ syncedAt: '2026-10-16T12:00:00Z' })
    await enviarFormulario(talento())
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('não conseguir reler o resultado do RD conta como "não aceitou": avisa', async () => {
    payload.findByID.mockRejectedValue(new Error('banco fora'))
    expect(await enviarFormulario(contato())).toEqual({ ok: true })
    expect(enviarAviso).toHaveBeenCalledTimes(1)
  })

  it('falha do aviso não derruba o envio e deixa notified falso', async () => {
    enviarAviso.mockResolvedValue(false)
    expect(await enviarFormulario(contato())).toEqual({ ok: true })
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('newsletter continua mandando a confirmação ao visitante, sem olhar o RD', async () => {
    payload.find.mockResolvedValue({ docs: [{ confirmationToken: 'tok' }] })
    await enviarFormulario(form({ kind: 'newsletter', email: 'leitor@exemplo.com' }))
    expect(payload.findByID).not.toHaveBeenCalled()
    expect(enviarAviso).toHaveBeenCalledWith(expect.objectContaining({ para: 'leitor@exemplo.com' }))
  })
})

describe('banco de talentos — o que é gravado (D-62)', () => {
  it('grava a área em português e a cópia do aviso que estava valendo', async () => {
    await enviarFormulario(talento())
    expect(payload.create.mock.calls[0][0].data.talent).toMatchObject({
      area: 'Engenharia de Dados',
      privacyNotice: 'Aviso de teste.',
    })
  })

  it('valor fora da lista e LinkedIn que não é endereço não são gravados no perfil', async () => {
    await enviarFormulario(
      form({ kind: 'talent-pool', email: 'c@x.com', area: 'texto livre forjado', linkedin: 'me ache no google' }),
    )
    const t = payload.create.mock.calls[0][0].data.talent
    expect(t.area).toBeUndefined()
    expect(t.linkedin).toBeUndefined()
  })
})
