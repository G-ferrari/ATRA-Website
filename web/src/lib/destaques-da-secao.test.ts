import { describe, expect, it } from 'vitest'

import type { Bloco, ConteudoDaSecao } from '@/types/content'

import { itensEmDestaque, marcarAbertura } from './destaques-da-secao'

const base = { anchor: null, navLabel: null, theme: 'surface-1', borda: 'nenhuma', espaco: 'normal' } as const
const cabecalho = { eyebrow: null, chip: null, title: 'Todos os', highlight: 'artigos', paragrafos: [] }

const blog = (pagina: number, posts = 5): ConteudoDaSecao => ({
  secao: 'blog',
  posts: Array.from({ length: posts }, (_, i) => ({ slug: `p${i}` }) as never),
  pagina,
  totalDePaginas: 2,
})
const solucoes: ConteudoDaSecao = { secao: 'solucoes', solucoes: [] }

const destaques = (conteudo: ConteudoDaSecao | null): Bloco =>
  ({ ...base, id: 'd', tipo: 'sectionFeatured', actionLabel: null, conteudo, abertura: true }) as Bloco
const lista = (conteudo: ConteudoDaSecao | null): Bloco =>
  ({ ...base, id: 'l', tipo: 'sectionListing', cabecalho, conteudo, abertura: false }) as Bloco
const heroi = { ...base, id: 'h', tipo: 'pageHero' } as unknown as Bloco

const aberturas = (blocos: Bloco[]) =>
  blocos.map((b) => (b.tipo === 'sectionListing' || b.tipo === 'sectionFeatured' ? b.abertura : null))

describe('itensEmDestaque', () => {
  it('o blog só tem destaque na primeira página, e no máximo 3', () => {
    expect(itensEmDestaque(blog(1))).toBe(3)
    expect(itensEmDestaque(blog(2))).toBe(0)
  })

  it('seção sem carrossel não tem destaque', () => {
    expect(itensEmDestaque(solucoes)).toBe(0)
    expect(itensEmDestaque(null)).toBe(0)
  })
})

describe('marcarAbertura', () => {
  it('carrossel no topo: ele abre a página e traz o próprio respiro', () => {
    const blocos = [destaques(blog(1)), lista(blog(1))]
    expect(marcarAbertura(blocos)).toEqual({ topoProprio: true })
    expect(aberturas(blocos)).toEqual([true, false])
  })

  it('página 2 do blog: o carrossel some e a lista abre a página', () => {
    const blocos = [destaques(blog(2)), lista(blog(2))]
    expect(marcarAbertura(blocos)).toEqual({ topoProprio: true })
    expect(aberturas(blocos)).toEqual([false, true])
  })

  it('herói de página no topo: nenhum bloco de seção abre, e a <main> dá o respiro', () => {
    const blocos = [heroi, destaques(blog(1)), lista(blog(1))]
    expect(marcarAbertura(blocos)).toEqual({ topoProprio: false })
    expect(aberturas(blocos)).toEqual([null, false, false])
  })

  it('lista em cartão (Soluções) abre a página, mas conta com o respiro da <main>', () => {
    const blocos = [lista(solucoes)]
    expect(marcarAbertura(blocos)).toEqual({ topoProprio: false })
    expect(aberturas(blocos)).toEqual([true])
  })
})
