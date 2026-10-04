import { describe, expect, it } from 'vitest'

import { categoriasComArtigo } from './categorias-do-blog'

const BARRA = ['Business', 'IA', 'Cloud', 'Analytics', 'Cybersecurity', 'Strategy']

describe('categoriasComArtigo', () => {
  /* O estado da homologação: 207 artigos, nenhuma tag. A barra some. */
  it('sem tag em nenhum artigo, nenhuma categoria aparece', () => {
    expect(categoriasComArtigo(BARRA, [{ tags: [] }, { tags: [] }])).toEqual([])
    expect(categoriasComArtigo(BARRA, [])).toEqual([])
  })

  it('só entra a categoria que tem artigo, na ordem da barra', () => {
    expect(categoriasComArtigo(BARRA, [{ tags: ['Cloud'] }, { tags: ['IA', 'Retail'] }])).toEqual(['IA', 'Cloud'])
  })

  /* A mesma comparação do filtro: senão o botão apareceria e não acharia nada. */
  it('ignora diferença de maiúscula, como o filtro', () => {
    expect(categoriasComArtigo(BARRA, [{ tags: ['cloud', 'ANALYTICS'] }])).toEqual(['Cloud', 'Analytics'])
  })

  it('tag fora da barra não cria categoria', () => {
    expect(categoriasComArtigo(BARRA, [{ tags: ['Managed IT'] }])).toEqual([])
  })
})
