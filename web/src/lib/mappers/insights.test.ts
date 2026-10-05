import { describe, expect, it } from 'vitest'

import type { CaseCard, MateriaDaImprensa, PostCard, Resource, Webinar } from '@/types/content'

import { faixasDeInsights, type UltimosConteudos } from './insights'

const imagem = { url: '/x.webp', alt: '', width: 1, height: 1 }

const caso = (n: number, client: string | null = 'Banco X'): CaseCard => ({
  slug: `case-${n}`,
  title: `Case ${n}`,
  client,
  summary: 'Resumo',
  impact: null,
  image: imagem,
  topics: [{ name: 'IA', slug: 'ia' }],
  publishedAt: '2026-03-03T12:00:00.000Z',
})
const post = (n: number): PostCard => ({
  slug: `post-${n}`,
  title: `Post ${n}`,
  description: 'Descrição',
  image: imagem,
  tags: ['IA', 'Cloud', 'Dados', 'Governança'],
  publishedAt: '2026-09-25T12:00:00.000Z',
})
const webinar: Webinar = {
  slug: 'w',
  title: 'Webinar',
  description: 'd',
  image: imagem,
  tags: [],
  dateLabel: 'Amanhã, 15:00',
  duration: '45 min',
  videoUrl: null,
  seo: { title: 'w', description: '', image: null, noIndex: false },
}
const materia: MateriaDaImprensa = {
  id: 'm1',
  title: 'Matéria',
  outlet: 'Valor',
  description: 'd',
  url: 'https://valor.com.br/x',
  image: imagem,
  kind: 'article',
  publishedAt: null,
}
const ebook: Resource = {
  slug: 'e',
  kind: 'ebook',
  title: 'E-book',
  description: 'd',
  image: imagem,
  tags: [],
  pages: 24,
  publishedAt: '2026-01-01T00:00:00.000Z',
}

const vazio: UltimosConteudos = { cases: [], posts: [], webinars: [], materias: [], ebooks: [] }

describe('faixasDeInsights', () => {
  it('uma faixa por tipo, na ordem fixa, com "Ver todos" para a seção', () => {
    const faixas = faixasDeInsights(
      { cases: [caso(1)], posts: [post(1)], webinars: [webinar], materias: [materia], ebooks: [ebook] },
      'pt',
    )
    expect(faixas.map((f) => [f.tipo, f.titulo, f.verTodos])).toEqual([
      ['cases', 'Cases de sucesso', '/cases-de-sucesso'],
      ['blog', 'Blog', '/blog'],
      ['webinars', 'Webinars', '/webinars'],
      ['midia', 'ATRA na mídia', '/atra-na-midia'],
      ['ebooks', 'E-books', '/ebooks'],
    ])
  })

  it('em inglês, título e endereços traduzidos', () => {
    const [faixa] = faixasDeInsights({ ...vazio, cases: [caso(1)] }, 'en')
    expect(faixa.titulo).toBe('Success stories')
    expect(faixa.verTodos).toBe('/en/success-stories')
    expect(faixa.itens[0].href).toBe('/en/success-stories/case-1')
  })

  it('no máximo 3 por faixa, e tipo vazio não tem faixa', () => {
    const faixas = faixasDeInsights({ ...vazio, posts: [1, 2, 3, 4, 5].map(post) }, 'pt')
    expect(faixas).toHaveLength(1)
    expect(faixas[0].itens.map((i) => i.id)).toEqual(['post-1', 'post-2', 'post-3'])
  })

  it('normaliza quem e quando de cada collection', () => {
    const faixas = faixasDeInsights(
      { cases: [caso(1), caso(2, null)], posts: [post(1)], webinars: [webinar], materias: [materia], ebooks: [ebook] },
      'pt',
    )
    const [cases, blog, webinars, midia, ebooks] = faixas
    expect(cases.itens[0].origem).toBe('Banco X • 3 de março de 2026')
    /* Cliente opcional: sem marcador solto. */
    expect(cases.itens[1].origem).toBe('3 de março de 2026')
    expect(blog.itens[0].tags).toEqual(['IA', 'Cloud', 'Dados'])
    expect(webinars.itens[0]).toMatchObject({ origem: 'Amanhã, 15:00', selo: '45 min' })
    expect(midia.itens[0]).toMatchObject({ origem: 'Valor', externo: true, href: 'https://valor.com.br/x' })
    expect(ebooks.itens[0]).toMatchObject({ origem: null, selo: '24 páginas' })
  })
})
