import { describe, expect, it } from 'vitest'

import { itensCitados, linksDe, visitarLinks } from './links-no-idioma'
import { linkNoIdioma } from './routes'

/* D-71: os destinos de link dos objetos de apresentação — blocos, menu,
 * rodapé —, achados pelo nome do campo, e os itens que eles citam, para a
 * consulta ao banco sair em lote. */

const blocos = () => [
  {
    tipo: 'pageHero',
    ctas: [
      { label: 'Contato', href: '/contato' },
      { label: 'WhatsApp', href: 'https://api.whatsapp.com/send/?phone=5511999999999' },
    ],
  },
  { tipo: 'caseCarousel', cta: { label: 'Ver todos', href: '/cases-de-sucesso' }, items: [{ href: '/cases-de-sucesso/abc' }] },
  { tipo: 'insightsHub', closing: { ctaHref: '/consultores', secondaryHref: '/#fale-conosco' }, formats: [{ href: null }] },
  { tipo: 'partnerMosaic', items: [{ href: '/parceiros/aws', image: { url: '/api/media/file/aws.webp' } }] },
  // O texto rico tem conversor próprio e não entra.
  { tipo: 'richTextSection', body: { root: { children: [{ type: 'link', fields: { url: '/sobre' }, href: '/sobre' }] } } },
]

describe('linksDe', () => {
  it('acha os destinos pelo nome do campo, em qualquer profundidade, menos no texto rico', () => {
    expect(linksDe(blocos())).toEqual([
      '/contato',
      'https://api.whatsapp.com/send/?phone=5511999999999',
      '/cases-de-sucesso',
      '/cases-de-sucesso/abc',
      '/consultores',
      '/#fale-conosco',
      '/parceiros/aws',
    ])
  })

  it('acha os do menu e do rodapé, juntos', () => {
    const navegacao = {
      categorias: [{ href: '/sobre', links: [{ href: '/blog' }], card: { href: '/carreiras' } }],
      conversao: { caminhos: [{ href: '/diagnostico-maturidade' }], cta: { href: '/contato' }, ctaSecundario: null },
    }
    const rodape = { colunas: [{ links: [{ href: '/parceiros/google-cloud' }, { href: null }] }] }
    expect(linksDe({ navegacao, rodape })).toEqual([
      '/sobre',
      '/blog',
      '/carreiras',
      '/diagnostico-maturidade',
      '/contato',
      '/parceiros/google-cloud',
    ])
  })
})

describe('visitarLinks', () => {
  it('troca no lugar, e só o destino', () => {
    const b = blocos()
    const slugs: Record<string, string> = { 'cases/abc': 'abc-en' }
    visitarLinks(b, (href) => linkNoIdioma(href, 'en', (secao, slug) => slugs[`${secao}/${slug}`] ?? null))
    expect(linksDe(b)).toEqual([
      '/en/contact',
      'https://api.whatsapp.com/send/?phone=5511999999999',
      '/en/success-stories',
      '/en/success-stories/abc-en',
      '/en/consultants',
      '/en#fale-conosco',
      // Parceiro sem slug inglês no "banco": fica em português.
      '/parceiros/aws',
    ])
    expect(b[3]).toMatchObject({ items: [{ image: { url: '/api/media/file/aws.webp' } }] })
    expect(b[4]).toMatchObject({ body: { root: { children: [{ fields: { url: '/sobre' }, href: '/sobre' }] } } })
  })

  it('objeto repetido é visitado uma vez só', () => {
    const cta = { href: '/contato' }
    const vezes: string[] = []
    visitarLinks([{ cta }, { cta }], (href) => {
      vezes.push(href)
      return href
    })
    expect(vezes).toEqual(['/contato'])
  })
})

describe('itensCitados', () => {
  it('agrupa por seção os itens que links portugueses citam', () => {
    const itens = itensCitados([
      '/cases-de-sucesso/abc',
      '/cases-de-sucesso/def#topo',
      '/cases-de-sucesso/abc?x=1',
      '/parceiros/aws',
      '/solucoes/rc18',
      '/contato',
      '/en/success-stories/xyz',
      'https://fora.com/cases-de-sucesso/abc',
    ])
    expect(Object.fromEntries([...itens].map(([secao, slugs]) => [secao, [...slugs]]))).toEqual({
      cases: ['abc', 'def'],
      parceiros: ['aws'],
      solucoes: ['rc18'],
    })
  })
})
