import { describe, expect, it } from 'vitest'

import { comMosaico, ehVitrineDeParceiros, paraMosaico } from './assessoria-mosaico'

/* A seção como estava na homologação em 06/10 (ids e textos de lá). */
const vitrine = {
  id: '6ac5450e5bffa6082a34640f',
  blockType: 'contentTeaser',
  theme: 'surface-2',
  borda: 'nenhuma',
  spacing: 'normal',
  anchor: null,
  eyebrow: 'Nossos Parceiros',
  title: 'Soluções das principais empresas de tecnologia',
  description: 'Trabalhamos com um ecossistema de parceiros.\n\nConheça as soluções.',
  cards: [
    { id: 'c1', icon: 'search', column: 'first', category: 'Google Cloud', title: 'Ferramentas', href: '/parceiros/google-cloud', image: 456 },
    { id: 'c2', icon: 'search', column: 'second', category: 'Amazon AWS', title: 'Ferramentas', href: '/parceiros/aws', image: { id: 457 } },
    { id: 'c3', icon: 'sparkles', column: 'first', category: 'Microsoft Azure', title: 'Ferramentas', href: '/parceiros/microsoft-azure', image: 458 },
    { id: 'c4', icon: 'sparkles', column: 'second', category: 'Denodo', title: 'Ferramentas', href: '/parceiros/denodo', image: 459 },
  ],
  featured: { category: 'Databricks', title: 'Ferramentas', ctaLabel: '', href: '/parceiros/databricks', image: 460 },
  newsletter: { title: '', placeholder: '' },
}
const heroi = { id: 'h', blockType: 'pageHero', title: 'Assessoria em Produtos' }
const faixa = { id: 'f', blockType: 'ctaBanner', title: 'Entre em contato' }

describe('paraMosaico', () => {
  it('leva cabeçalho, tema e os cinco parceiros, na ordem do cadastro e com o destaque por último', () => {
    const mosaico = paraMosaico(vitrine)!
    expect(mosaico).toMatchObject({
      blockType: 'partnerMosaic',
      theme: 'surface-2',
      eyebrow: 'Nossos Parceiros',
      title: 'Soluções das principais empresas de tecnologia',
      description: 'Trabalhamos com um ecossistema de parceiros.\n\nConheça as soluções.',
    })
    expect(mosaico.items).toEqual([
      { image: 456, name: 'Google Cloud', linkLabel: 'Ferramentas', href: '/parceiros/google-cloud' },
      { image: 457, name: 'Amazon AWS', linkLabel: 'Ferramentas', href: '/parceiros/aws' },
      { image: 458, name: 'Microsoft Azure', linkLabel: 'Ferramentas', href: '/parceiros/microsoft-azure' },
      { image: 459, name: 'Denodo', linkLabel: 'Ferramentas', href: '/parceiros/denodo' },
      { image: 460, name: 'Databricks', linkLabel: 'Ferramentas', href: '/parceiros/databricks' },
    ])
    /* Bloco novo: sem o id da vitrine, que é de outra tabela. */
    expect(mosaico.id).toBeUndefined()
  })
})

describe('ehVitrineDeParceiros', () => {
  /* A vitrine da home leva a blog e e-books: não é esta seção. */
  it('vitrine com cartão que não é de parceiro fica como está', () => {
    const daHome = { ...vitrine, cards: [{ category: 'Blog', title: 'Artigo', href: '/blog/x', image: 1 }], featured: null }
    expect(ehVitrineDeParceiros(daHome)).toBe(false)
    expect(paraMosaico(daHome)).toBeNull()
  })

  it('cartão sem imagem ou sem nome não converte: o mosaico exige os dois', () => {
    expect(ehVitrineDeParceiros({ ...vitrine, cards: [{ category: 'Denodo', href: '/parceiros/denodo', image: null }], featured: null })).toBe(false)
    expect(ehVitrineDeParceiros({ ...vitrine, cards: [{ category: ' ', href: '/parceiros/denodo', image: 1 }], featured: null })).toBe(false)
    expect(ehVitrineDeParceiros({ ...vitrine, cards: [], featured: null })).toBe(false)
  })
})

describe('comMosaico', () => {
  it('troca a vitrine pelo mosaico na mesma posição, sem tocar nos vizinhos', () => {
    const novo = comMosaico([heroi, vitrine, faixa])!
    expect(novo.map((b) => b.blockType)).toEqual(['pageHero', 'partnerMosaic', 'ctaBanner'])
    expect(novo[0]).toBe(heroi)
    expect(novo[2]).toBe(faixa)
  })

  it('página que já tem o mosaico, ou sem vitrine de parceiros, não muda', () => {
    expect(comMosaico([heroi, vitrine, { blockType: 'partnerMosaic' }])).toBeNull()
    expect(comMosaico([heroi, faixa])).toBeNull()
  })

  it('mais de 6 parceiros não cabem no mosaico: a seção fica como está', () => {
    const sete = { ...vitrine, cards: [...vitrine.cards, ...vitrine.cards.slice(0, 2)] }
    expect(comMosaico([sete])).toBeNull()
  })
})
