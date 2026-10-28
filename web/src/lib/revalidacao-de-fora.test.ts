import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { pedirRevalidacaoAoProprioServidor, tokenConfere } from './revalidacao-de-fora'

describe('pedirRevalidacaoAoProprioServidor', () => {
  const buscar = vi.fn(async () => new Response(null, { status: 204 }))

  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', buscar)
    buscar.mockClear()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('dentro do Next, junta os pedidos e chama a própria rota com o token', async () => {
    vi.stubEnv('NEXT_RUNTIME', 'nodejs')
    vi.stubEnv('PORT', '3100')
    pedirRevalidacaoAoProprioServidor()
    pedirRevalidacaoAoProprioServidor()
    await vi.runAllTimersAsync()

    expect(buscar).toHaveBeenCalledTimes(1)
    const [url, init] = buscar.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('http://127.0.0.1:3100/api/revalidar')
    expect(tokenConfere((init.headers as Record<string, string>)['x-revalidar'])).toBe(true)
  })

  it('fora do Next (seed, importador), não pede nada', async () => {
    vi.stubEnv('NEXT_RUNTIME', '')
    pedirRevalidacaoAoProprioServidor()
    await vi.runAllTimersAsync()
    expect(buscar).not.toHaveBeenCalled()
  })
})

it('a rota recusa token ausente ou errado', () => {
  expect(tokenConfere(null)).toBe(false)
  expect(tokenConfere('chute')).toBe(false)
})
