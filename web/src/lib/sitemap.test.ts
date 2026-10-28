import { describe, expect, it } from 'vitest'

import { paraSitemap, temTraducao, versoesDe } from './sitemap'

describe('temTraducao', () => {
  it('aceita tradução de verdade', () => {
    expect(temTraducao('Sobre a ATRA', 'About ATRA')).toBe(true)
  })

  /* Os 207 artigos do WP têm linha em `en` só para o slug existir — sem isso
     `/en/blog/<slug>` dá 404. Linha existir não prova tradução. */
  it('recusa inglês que repete o português', () => {
    expect(temTraducao('Migrando cargas de trabalho', 'Migrando cargas de trabalho')).toBe(false)
  })

  it('recusa inglês vazio ou ausente', () => {
    expect(temTraducao('Título', '')).toBe(false)
    expect(temTraducao('Título', null)).toBe(false)
    expect(temTraducao('Título', '   ')).toBe(false)
  })
})

describe('paraSitemap', () => {
  it('lista os três idiomas e declara as versões', () => {
    const r = paraSitemap([{ local: { secao: 'sobre' } }])
    expect(r.map((e) => e.url)).toEqual([
      'http://localhost:3000/sobre',
      'http://localhost:3000/en/about',
      'http://localhost:3000/es/sobre-nosotros',
    ])
    expect(r[0].alternates?.languages).toEqual({
      'pt-BR': 'http://localhost:3000/sobre',
      en: 'http://localhost:3000/en/about',
      es: 'http://localhost:3000/es/sobre-nosotros',
    })
  })

  /* Sem inglês, uma entrada só — e **sem** `alternates`: declarar um par de
     idiomas para uma URL que não existe é a mesma mentira que listá-la. */
  it('deixa a URL inglesa de fora quando o documento não está traduzido', () => {
    const r = paraSitemap([{ local: { secao: 'blog', slug: 'x' }, versoes: { pt: 'x' } }])
    expect(r).toHaveLength(1)
    expect(r[0].url).toBe('http://localhost:3000/blog/x')
    expect(r[0].alternates).toBeUndefined()
  })

  it('monta a raiz sem barra sobrando', () => {
    expect(paraSitemap([{ local: { caminho: '/' } }]).map((e) => e.url)).toEqual([
      'http://localhost:3000/',
      'http://localhost:3000/en',
      'http://localhost:3000/es',
    ])
  })

  it('leva a data de atualização quando existe', () => {
    const r = paraSitemap([{ local: { secao: 'blog', slug: 'x' }, atualizadoEm: '2026-08-17T00:00:00.000Z' }])
    expect(r[0].lastModified).toEqual(new Date('2026-08-17T00:00:00.000Z'))
  })
})

/* D-69: a URL inglesa sai do slug **inglês**. Até 23/10 saía do português, e
   as três URLs inglesas que o sitemap da homologação anunciava davam 404. */
describe('versoesDe no sitemap', () => {
  it('traduzido e com slug no inglês: entra, com o slug inglês', () => {
    expect(
      versoesDe({ pt: { slug: 'privacidade', texto: 'Privacidade & LGPD' }, en: { texto: 'Privacy & LGPD', slug: 'privacy' } }),
    ).toEqual({ pt: 'privacidade', en: 'privacy' })
  })

  it('sem slug gravado no inglês, fica de fora mesmo com título em inglês', () => {
    expect(versoesDe({ pt: { slug: 'c360', texto: 'Customer 360' }, en: { texto: 'Customer 360 view', slug: null } })).toEqual({ pt: 'c360' })
    expect(versoesDe({ pt: { slug: 'c360', texto: 'Customer 360' } })).toEqual({ pt: 'c360' })
  })

  it('inglês copiado do português continua fora do sitemap, mesmo com slug', () => {
    expect(
      versoesDe({
        pt: { slug: 'analytics-conversacional', texto: 'Analytics Conversacional' },
        en: { texto: 'Analytics Conversacional', slug: 'analytics-conversacional' },
      }),
    ).toEqual({ pt: 'analytics-conversacional' })
  })

  /* D-77: o espanhol nasce com o slug copiado do português e o texto também, até
     a fila traduzir. Cada idioma entra por conta própria. */
  it('espanhol traduzido e inglês não: só o português e o espanhol', () => {
    expect(
      versoesDe({
        pt: { slug: 'bancos', texto: 'Bancos digitais' },
        en: { slug: 'bancos', texto: 'Bancos digitais' },
        es: { slug: 'bancos', texto: 'Bancos digitales' },
      }),
    ).toEqual({ pt: 'bancos', es: 'bancos' })
  })
})

describe('paraSitemap com slug inglês', () => {
  it('a URL inglesa e o par de idiomas usam o slug de cada idioma', () => {
    const r = paraSitemap([{ local: { secao: 'solucoes', slug: 'privacidade' }, versoes: { pt: 'privacidade', en: 'privacy' } }])
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
