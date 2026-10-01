import { describe, expect, it } from 'vitest'

import { comAtraNaMidia, mudaAlgo } from './atra-na-midia'

/* A migração reescreve o menu e a página Insights no deploy. O risco é trocar
 * de mais: uma frase de marketing, ou um endereço que só começa parecido. */

describe('comAtraNaMidia', () => {
  it('troca o rótulo do menu e o destino, nos dois idiomas', () => {
    expect(comAtraNaMidia({ label: 'Relatórios', description: 'Análises profundas do mercado de dados.', href: '/relatorios' })).toEqual({
      label: 'ATRA na mídia',
      description: 'Análises profundas do mercado de dados.',
      href: '/atra-na-midia',
    })
    expect(comAtraNaMidia({ label: 'Reports', href: '/relatorios' })).toEqual({ label: 'ATRA in the media', href: '/atra-na-midia' })
  })

  it('troca a aba e a categoria dos cartões da página Insights, em qualquer profundidade', () => {
    const hub = {
      blockType: 'insightsHub',
      formats: [{ key: 'report', label: 'Relatórios', href: '/relatorios' }, { key: 'ebook', label: 'E-books', href: '/ebooks' }],
      items: [{ format: 'report', category: 'Relatórios', title: 'Panorama de Dados', href: '/relatorios/panorama-de-dados' }],
    }
    expect(comAtraNaMidia({ layout: [hub] })).toEqual({
      layout: [
        {
          blockType: 'insightsHub',
          formats: [{ key: 'report', label: 'ATRA na mídia', href: '/atra-na-midia' }, { key: 'ebook', label: 'E-books', href: '/ebooks' }],
          items: [{ format: 'report', category: 'ATRA na mídia', title: 'Panorama de Dados', href: '/atra-na-midia/panorama-de-dados' }],
        },
      ],
    })
  })

  /* D-22: frase é texto de marketing, e título não é rótulo de seção. */
  it('não mexe em frase, em título nem em endereço que só começa parecido', () => {
    const intacto = {
      title: 'Relatórios',
      description: 'Explore nossos cases, relatórios de mercado e webinars.',
      label: 'Relatórios anuais',
      href: '/relatorios-anuais',
      ctaHref: '/blog/copilot-no-power-bi-otimizando-relatorios',
    }
    expect(comAtraNaMidia(intacto)).toEqual(intacto)
    expect(mudaAlgo(intacto)).toBe(false)
  })

  it('preserva a query e a âncora do destino, e não altera o original', () => {
    const original = { ctaHref: '/relatorios?utm_source=home', secondaryHref: '/relatorios#arquivo' }
    expect(comAtraNaMidia(original)).toEqual({ ctaHref: '/atra-na-midia?utm_source=home', secondaryHref: '/atra-na-midia#arquivo' })
    expect(original.ctaHref).toBe('/relatorios?utm_source=home')
    expect(mudaAlgo(original)).toBe(true)
  })
})
