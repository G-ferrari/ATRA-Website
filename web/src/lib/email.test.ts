import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { enviarAviso } from './email'

/* O corpo que chegaria ao Resend, sem rede: o `fetch` é trocado por um espião. */
const fetchFalso = vi.fn()
const corpoEnviado = () => JSON.parse(fetchFalso.mock.calls[0][1].body as string) as Record<string, unknown>

beforeEach(() => {
  fetchFalso.mockReset()
  fetchFalso.mockResolvedValue(new Response('{}', { status: 200 }))
  vi.stubGlobal('fetch', fetchFalso)
  vi.stubEnv('RESEND_API_KEY', 're_teste')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('enviarAviso', () => {
  /* Os avisos de antes da task 024 (contato, chat, newsletter, candidatura) não
   * passam `html` — e têm que continuar chegando exatamente como chegavam. */
  it('aviso sem html manda só o texto, sem a chave `html`', async () => {
    expect(await enviarAviso({ para: 'contato@atra.com.br', assunto: 'Assunto', texto: 'Corpo' })).toBe(true)
    const corpo = corpoEnviado()
    expect(corpo.text).toBe('Corpo')
    expect(corpo).not.toHaveProperty('html')
  })

  it('aviso com html manda as duas partes', async () => {
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'Assunto', texto: 'Corpo', html: '<p>Corpo</p>' })
    const corpo = corpoEnviado()
    expect(corpo.text).toBe('Corpo')
    expect(corpo.html).toBe('<p>Corpo</p>')
  })

  it('html vazio conta como ausente', async () => {
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'Assunto', texto: 'Corpo', html: '' })
    expect(corpoEnviado()).not.toHaveProperty('html')
  })

  it('sem chave do Resend não chama a rede e devolve false', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    expect(await enviarAviso({ para: 'x@empresa.com.br', assunto: 'A', texto: 'B', html: '<p>B</p>' })).toBe(false)
    expect(fetchFalso).not.toHaveBeenCalled()
  })
})
