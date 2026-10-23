import { describe, expect, it } from 'vitest'

import { paraSitemap, temIngles, versaoInglesa, versoesDe } from './sitemap'

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

/* D-69: a URL inglesa sai do slug **inglês**. Até 23/10 saía do português, e
   as três URLs inglesas que o sitemap da homologação anunciava davam 404. */
describe('versaoInglesa', () => {
  it('traduzido e com slug no inglês: entra, com o slug inglês', () => {
    expect(versaoInglesa({ texto: 'Privacidade & LGPD' }, { texto: 'Privacy & LGPD', slug: 'privacy' })).toEqual({
      ingles: true,
      slugIngles: 'privacy',
    })
  })

  it('sem slug gravado no inglês, fica de fora mesmo com título em inglês', () => {
    expect(versaoInglesa({ texto: 'Customer 360' }, { texto: 'Customer 360 view', slug: null })).toEqual({ ingles: false })
    expect(versaoInglesa({ texto: 'Customer 360' }, undefined)).toEqual({ ingles: false })
  })

  it('inglês copiado do português continua fora do sitemap, mesmo com slug', () => {
    expect(versaoInglesa({ texto: 'Analytics Conversacional' }, { texto: 'Analytics Conversacional', slug: 'analytics-conversacional' })).toEqual({
      ingles: false,
    })
  })
})

describe('paraSitemap com slug inglês', () => {
  it('a URL inglesa e o par de idiomas usam o slug de cada idioma', () => {
    const r = paraSitemap([{ local: { secao: 'solucoes', slug: 'privacidade' }, ingles: true, slugIngles: 'privacy' }])
    expect(r.map((e) => e.url)).toEqual(['http://localhost:3000/solucoes/privacidade', 'http://localhost:3000/en/solutions/privacy'])
    expect(r[1].alternates?.languages).toEqual({
      'pt-BR': 'http://localhost:3000/solucoes/privacidade',
      en: 'http://localhost:3000/en/solutions/privacy',
    })
  })
})

/* Task #209: o `hreflang` da página de item usa a mesma regra do sitemap, para
   os dois não declararem ao Google versões de idioma diferentes. */
describe('versoesDe', () => {
  it('traduzido e com slug no inglês: os dois idiomas, cada um com o seu slug', () => {
    expect(
      versoesDe({ pt: { slug: 'privacidade', texto: 'Privacidade & LGPD' }, en: { slug: 'privacy', texto: 'Privacy & LGPD' } }),
    ).toEqual({ pt: 'privacidade', en: 'privacy' })
  })

  /* Os 4 cases: slug próprio no inglês, texto ainda em português. A página
     inglesa abre, mas não é tradução — o sitemap não a lista. */
  it('inglês que repete o português: só o português', () => {
    expect(
      versoesDe({
        pt: { slug: 'marketplace-governanca-dados', texto: 'Gerando valor' },
        en: { slug: 'data-marketplace-governance', texto: 'Gerando valor' },
      }),
    ).toEqual({ pt: 'marketplace-governanca-dados' })
  })

  it('sem slug no inglês: só o português', () => {
    expect(versoesDe({ pt: { slug: 'seguros', texto: 'Seguros' }, en: { slug: null, texto: 'Insurance' } })).toEqual({
      pt: 'seguros',
    })
    expect(versoesDe({ pt: { slug: 'seguros', texto: 'Seguros' } })).toEqual({ pt: 'seguros' })
  })
})
