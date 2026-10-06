import { describe, expect, it } from 'vitest'

import { impedirExclusaoDePaginaMestra } from './pagina-mestra'

/* A trava só precisa de `req.payload.findByID`; o resto do hook é regra. */
const chamar = (doc: { title: string; masterOf?: string | null }) =>
  impedirExclusaoDePaginaMestra({
    id: 1,
    req: { payload: { findByID: async () => doc } },
  } as never)

describe('impedirExclusaoDePaginaMestra', () => {
  it('recusa apagar a página-mestra, dizendo como tirá-la do ar', async () => {
    await expect(chamar({ title: 'Blog', masterOf: 'blog' })).rejects.toThrow(
      '"Blog" é a página-mestra da seção Blog e não pode ser apagada. Para tirá-la do ar, despublique.',
    )
  })

  it('deixa apagar página comum', async () => {
    await expect(chamar({ title: 'Landing', masterOf: null })).resolves.toBeUndefined()
  })
})
