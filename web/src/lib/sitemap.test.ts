import { describe, expect, it } from 'vitest'

import { paraSitemap, temIngles } from './sitemap'

describe('temIngles', () => {
  it('aceita tradução de verdade', () => {
    expect(temIngles('Sobre a ATRA', 'About ATRA')).toBe(true)
  })

  /* Os 207 artigos do WP têm linha em `en` só para o slug existir — sem isso
     `/en/blog/<slug>` dá 404. Linha existir não prova tradução. */
  it('recusa inglês que repete o português', () => {
    expect(temIngles('Migrando cargas de trabalho', 'Migrando cargas de trabalho')).toBe(false)
  })

  it('recusa inglês vazio ou ausente', () => {
    expect(temIngles('Título', '')).toBe(false)
    expect(temIngles('Título', null)).toBe(false)
    expect(temIngles('Título', '   ')).toBe(false)
  })
})

describe('paraSitemap', () => {
  it('lista os dois idiomas e declara o par', () => {
    const r = paraSitemap([{ local: { secao: 'sobre' } }])
    expect(r.map((e) => e.url)).toEqual(['http://localhost:3000/sobre', 'http://localhost:3000/en/about'])
    expect(r[0].alternates?.languages).toEqual({
      'pt-BR': 'http://localhost:3000/sobre',
      en: 'http://localhost:3000/en/about',
    })
  })

  /* Sem inglês, uma entrada só — e **sem** `alternates`: declarar um par de
     idiomas para uma URL que não existe é a mesma mentira que listá-la. */
  it('deixa a URL inglesa de fora quando o documento não está traduzido', () => {
    const r = paraSitemap([{ local: { secao: 'blog', slug: 'x' }, ingles: false }])
    expect(r).toHaveLength(1)
    expect(r[0].url).toBe('http://localhost:3000/blog/x')
    expect(r[0].alternates).toBeUndefined()
  })

  it('monta a raiz sem barra sobrando', () => {
    expect(paraSitemap([{ local: { caminho: '/' } }]).map((e) => e.url)).toEqual([
      'http://localhost:3000/',
      'http://localhost:3000/en',
    ])
  })

  it('leva a data de atualização quando existe', () => {
    const r = paraSitemap([{ local: { secao: 'blog', slug: 'x' }, atualizadoEm: '2026-08-17T00:00:00.000Z' }])
    expect(r[0].lastModified).toEqual(new Date('2026-08-17T00:00:00.000Z'))
  })
})
