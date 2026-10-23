import { beforeEach, describe, expect, it, vi } from 'vitest'

/* A consulta que a regra de `mappers/idioma.ts` pede (task #52). O que importa
 * fixar aqui é o que não se vê no resultado: que a segunda consulta vai **sem**
 * fallback — com ele, o inglês devolveria o slug português e nada sairia da
 * lista — e que ela lê só publicado, como a da listagem. O banco é simulado. */

const payload = { find: vi.fn() }
vi.mock('@/lib/payload', () => ({ getPayload: async () => payload }))

const { existentesNoIdioma } = await import('./existe-no-idioma')

const PUBLICADO = { _status: { equals: 'published' } } as const
const LISTAGEM = [
  { id: 1, slug: 'analytics-conversacional' },
  { id: 2, slug: 'privacidade' },
]

beforeEach(() => {
  vi.clearAllMocks()
  payload.find.mockResolvedValue({ docs: [{ id: 1, slug: 'analytics-conversacional' }, { id: 2, slug: null }] })
})

describe('existentesNoIdioma', () => {
  it('no inglês, tira da listagem o que não tem slug no inglês', async () => {
    const docs = await existentesNoIdioma('en', 'solutions', PUBLICADO, Promise.resolve({ docs: LISTAGEM }))
    expect(docs.map((d) => d.id)).toEqual([1])
  })

  it('a consulta do inglês vai sem fallback, só com o slug e com o filtro da listagem', async () => {
    await existentesNoIdioma('en', 'solutions', PUBLICADO, Promise.resolve({ docs: LISTAGEM }))
    expect(payload.find).toHaveBeenCalledTimes(1)
    expect(payload.find.mock.calls[0][0]).toMatchObject({
      collection: 'solutions',
      locale: 'en',
      fallbackLocale: false,
      where: PUBLICADO,
      select: { slug: true },
    })
  })

  it('no português, a listagem inteira e nenhuma consulta a mais', async () => {
    const docs = await existentesNoIdioma('pt', 'solutions', PUBLICADO, Promise.resolve({ docs: LISTAGEM }))
    expect(docs.map((d) => d.id)).toEqual([1, 2])
    expect(payload.find).not.toHaveBeenCalled()
  })
})
