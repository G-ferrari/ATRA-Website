import { describe, expect, it } from 'vitest'

import type { Case, Media, Testimonial as TestimonialDoc, Topic } from '@/payload-types'

import { toCaseCard, toCaseDetail, toTestimonial } from './case'

/* O que estes testes protegem: relacionamento não populado é o bug mais
 * provável desta camada, e o sintoma sem mapper seria imagem quebrada em
 * produção — não erro. Ver docs/03-plano/estrategia-de-testes.md. */

const imagem = (over: Partial<Media> = {}): Media =>
  ({
    id: 1,
    alt: 'Marketplace de dados',
    url: '/media/case.webp',
    width: 1376,
    height: 768,
    updatedAt: '',
    createdAt: '',
    ...over,
  }) as Media

const topico = (slug: string, name: string): Topic =>
  ({ id: 1, slug, name, updatedAt: '', createdAt: '' }) as Topic

const caso = (over: Partial<Case> = {}): Case =>
  ({
    id: 1,
    title: 'Marketplace e Governança de dados',
    client: 'Banco ABC',
    summary: 'Fluxo entre Informatica e GCP.',
    slug: 'marketplace-governanca-dados',
    heroImage: imagem(),
    topics: [topico('governanca', 'Governança')],
    publishedAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '',
    createdAt: '',
    ...over,
  }) as Case

describe('toCaseCard', () => {
  it('mapeia os campos do card', () => {
    const card = toCaseCard(caso())
    expect(card).toEqual({
      slug: 'marketplace-governanca-dados',
      title: 'Marketplace e Governança de dados',
      client: 'Banco ABC',
      summary: 'Fluxo entre Informatica e GCP.',
      impact: null,
      image: { url: '/media/case.webp', alt: 'Marketplace de dados', width: 1376, height: 768 },
      topics: [{ slug: 'governanca', name: 'Governança' }],
      publishedAt: '2026-03-01T00:00:00.000Z',
    })
  })

  it('falha alto quando a imagem vem como id, não como documento', () => {
    // Sem isto o componente receberia `undefined` e renderizaria imagem quebrada.
    expect(() => toCaseCard(caso({ heroImage: 42 }))).toThrowError(/heroImage[\s\S]*depth/)
  })

  it('falha quando a Media veio populada mas sem url', () => {
    expect(() => toCaseCard(caso({ heroImage: imagem({ url: null }) }))).toThrowError(/sem url/)
  })

  it('descarta topics não populados em vez de quebrar a página', () => {
    const card = toCaseCard(caso({ topics: [7, topico('cloud', 'Cloud')] }))
    expect(card.topics).toEqual([{ slug: 'cloud', name: 'Cloud' }])
  })

  it('normaliza campo opcional ausente para null, nunca undefined', () => {
    expect(toCaseCard(caso({ impact: undefined })).impact).toBeNull()
  })

  it('entrega a data em ISO, sem formatar', () => {
    // Formatar é do componente, no locale ativo — o legado guardava
    // "23 de março de 2026" e por isso não conseguia ordenar nem traduzir.
    expect(toCaseCard(caso()).publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})

describe('toCaseDetail', () => {
  it('achata arrays do Payload e ignora itens vazios', () => {
    const d = toCaseDetail(
      caso({
        challenges: [{ text: 'Integrar Informatica ao GCP' }, { text: '  ' }],
        results: [{ text: 'Democratização de dados' }],
        technologies: [{ name: 'BigQuery' }, { name: 'Informatica CDGC' }],
      } as Partial<Case>),
    )
    expect(d.challenges).toEqual(['Integrar Informatica ao GCP'])
    expect(d.results).toEqual(['Democratização de dados'])
    expect(d.technologies).toEqual(['BigQuery', 'Informatica CDGC'])
  })

  it('mantém os campos do card', () => {
    const d = toCaseDetail(caso())
    expect(d.slug).toBe('marketplace-governanca-dados')
    expect(d.image.alt).toBe('Marketplace de dados')
  })

  it('não quebra sem desafios, resultados ou parceiros', () => {
    const d = toCaseDetail(caso())
    expect(d).toMatchObject({ challenges: [], results: [], technologies: [], partners: [] })
    expect(d.testimonial).toBeNull()
  })
})

describe('toTestimonial', () => {
  const depoimento = (over: Partial<TestimonialDoc> = {}): TestimonialDoc =>
    ({
      id: 1,
      quote: 'A parceria com a ATRA foi essencial.',
      authorRole: 'Superintendente de Risco',
      company: 'Banco Carrefour',
      updatedAt: '',
      createdAt: '',
      ...over,
    }) as TestimonialDoc

  it('devolve null quando não veio populado', () => {
    expect(toTestimonial(9)).toBeNull()
    expect(toTestimonial(null)).toBeNull()
  })

  it('deixa authorName null para o componente cair no monograma (D-14)', () => {
    expect(toTestimonial(depoimento())?.authorName).toBeNull()
    expect(toTestimonial(depoimento({ authorName: 'Paulo Ruza' }))?.authorName).toBe('Paulo Ruza')
  })

  it('foto ausente é null, não erro — o campo é opcional por decisão', () => {
    expect(toTestimonial(depoimento())?.photo).toBeNull()
  })
})
