import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VALIDADE_MS, comCache, invalidarCatalogoDaIa } from './cache-do-catalogo-da-ia'

/* D-60 — "publicou, a conversa seguinte já vê" é uma promessa deste arquivo. */

describe('cache do catálogo da ATRA AI', () => {
  beforeEach(() => invalidarCatalogoDaIa())

  it('dentro da validade, não monta de novo', async () => {
    const montar = vi.fn(async () => ['a'])
    expect(await comCache('pt', montar, 1_000)).toEqual(['a'])
    expect(await comCache('pt', montar, 1_000 + VALIDADE_MS - 1)).toEqual(['a'])
    expect(montar).toHaveBeenCalledTimes(1)
  })

  it('vencida a validade, monta de novo', async () => {
    const montar = vi.fn(async () => ['a'])
    await comCache('pt', montar, 1_000)
    await comCache('pt', montar, 1_000 + VALIDADE_MS)
    expect(montar).toHaveBeenCalledTimes(2)
  })

  it('publicação zera na hora, sem esperar a validade', async () => {
    const montar = vi.fn(async () => ['a'])
    await comCache('pt', montar, 1_000)
    invalidarCatalogoDaIa()
    await comCache('pt', montar, 1_001)
    expect(montar).toHaveBeenCalledTimes(2)
  })

  it('cada idioma tem o seu', async () => {
    expect(await comCache('pt', async () => 'português', 1_000)).toBe('português')
    expect(await comCache('en', async () => 'inglês', 1_000)).toBe('inglês')
    expect(await comCache('pt', async () => 'outro', 1_001)).toBe('português')
  })

  it('duas conversas juntas dividem a mesma consulta', async () => {
    let chamadas = 0
    const montar = () =>
      new Promise<number>((resolver) => {
        chamadas += 1
        setTimeout(() => resolver(chamadas), 5)
      })
    const [a, b] = await Promise.all([comCache('pt', montar, 1_000), comCache('pt', montar, 1_000)])
    expect([a, b]).toEqual([1, 1])
  })

  it('consulta que falha não fica guardada', async () => {
    await expect(comCache('pt', async () => Promise.reject(new Error('banco fora')), 1_000)).rejects.toThrow('banco fora')
    expect(await comCache('pt', async () => 'voltou', 1_001)).toBe('voltou')
  })
})
