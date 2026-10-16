import { beforeEach, describe, expect, it, vi } from 'vitest'

/* O download de material (MIG-104) depois da task 046: o RD não entra no
 * caminho do visitante. A ida ao RD é do gancho de `form-submissions`, que
 * roda dentro do `create` e nunca lança (`hooks/sincronizar-rd.test.ts`); aqui
 * o `create` simulado responde como o gancho deixaria, com o RD aceitando ou
 * não, e a URL sai igual. Banco, storage e cabeçalhos são simulados; o
 * anti-spam roda de verdade. */

const payload = { findByID: vi.fn(), create: vi.fn() }
const urlAssinada = vi.fn()

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.9' }) }))
vi.mock('@/lib/payload', () => ({ getPayload: async () => payload }))
vi.mock('@/lib/s3-privado', () => ({ urlAssinadaDoPrivado: (nome: string) => urlAssinada(nome) }))
vi.mock('@/lib/anti-spam', async (original) => ({
  ...(await original<typeof import('@/lib/anti-spam')>()),
  excedeuPorIp: () => false,
}))

const { baixarMaterial } = await import('./materiais')

/* Carimbo de 10 s atrás: passa da armadilha de tempo do anti-spam. */
const envio = (extra: Record<string, string> = {}) => {
  const f = new FormData()
  const campos = { resourceId: '31', email: 'leitor@empresa.com.br', name: 'Ana', carimbo: String(Date.now() - 10_000), ...extra }
  for (const [k, v] of Object.entries(campos)) f.set(k, v)
  return f
}
const ebook = { id: 31, _status: 'published', file: { filename: 'guia.pdf' } }

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  payload.findByID.mockResolvedValue(ebook)
  urlAssinada.mockResolvedValue('https://storage/atra-privado/guia.pdf?assinatura')
})

describe('baixarMaterial — o download sai na hora, com ou sem RD (task 046)', () => {
  it.each([
    ['RD aceitou', { syncedAt: '2026-10-16T12:00:00Z', error: null }],
    ['RD recusou', { syncedAt: null, error: 'RD Station respondeu 400' }],
    ['sem chave do RD', null],
  ])('%s → grava o lead do e-book e devolve a URL assinada', async (_, rd) => {
    payload.create.mockResolvedValue({ id: 501, rd })
    expect(await baixarMaterial(envio())).toEqual({ ok: true, url: 'https://storage/atra-privado/guia.pdf?assinatura' })
    expect(payload.create).toHaveBeenCalledWith({
      collection: 'form-submissions',
      data: expect.objectContaining({ kind: 'material-download', email: 'leitor@empresa.com.br', resource: 31 }),
    })
    expect(urlAssinada).toHaveBeenCalledWith('guia.pdf')
  })

  it('lead que não gravou não libera o arquivo', async () => {
    payload.create.mockRejectedValue(new Error('banco fora'))
    expect(await baixarMaterial(envio())).toMatchObject({ ok: false })
    expect(urlAssinada).not.toHaveBeenCalled()
  })

  it('material sem PDF ou em rascunho não libera nada', async () => {
    payload.findByID.mockResolvedValue({ ...ebook, file: null })
    expect(await baixarMaterial(envio())).toMatchObject({ ok: false })
    payload.findByID.mockResolvedValue({ ...ebook, _status: 'draft' })
    expect(await baixarMaterial(envio())).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })
})
