import { describe, expect, it } from 'vitest'

import { dividirEmTrechos, paragrafosDoDocumento } from './texto'

const lexical = (...paragrafos: string[]) => ({
  root: {
    type: 'root',
    children: paragrafos.map((texto) => ({
      type: 'paragraph',
      format: '',
      children: [{ type: 'text', text: texto, format: 0, mode: 'normal', style: '' }],
    })),
  },
})

describe('paragrafosDoDocumento', () => {
  it('lê o texto dos blocos e deixa de fora estrutura, endereço e opção de lista', () => {
    const doc = {
      id: 7,
      slug: 'ia-generativa',
      title: 'IA Generativa',
      layout: [
        {
          id: '6adf',
          blockType: 'pageHero',
          theme: 'surface-1',
          align: 'left',
          title: 'IA que executa processos',
          description: 'Copilotos conectados às suas operações.',
          ctas: [{ label: 'Fale conosco', href: '/contato' }],
        },
        { blockType: 'ctaBanner', variant: 'dark-centered', cta: { href: 'https://atra.com.br/contato' } },
      ],
      seo: { metaDescription: 'Repete o resumo' },
      _status: 'published',
    }
    expect(paragrafosDoDocumento(doc)).toEqual(['IA Generativa', 'IA que executa processos', 'Copilotos conectados às suas operações.'])
  })

  it('lê o rich text do Lexical parágrafo a parágrafo, juntando o que é da mesma linha', () => {
    const corpo = lexical('Primeiro parágrafo.', 'Segundo parágrafo.')
    corpo.root.children[0].children.push({ type: 'text', text: ' Com negrito.', format: 1, mode: 'normal', style: '' })
    expect(paragrafosDoDocumento({ body: corpo })).toEqual(['Primeiro parágrafo. Com negrito.', 'Segundo parágrafo.'])
  })

  it('item de lista com sublista vira um parágrafo para o item e um para cada subitem', () => {
    const doc = {
      body: {
        root: {
          type: 'root',
          children: [
            {
              type: 'list',
              children: [
                {
                  type: 'listitem',
                  children: [
                    { type: 'text', text: 'Governança' },
                    { type: 'list', children: [{ type: 'listitem', children: [{ type: 'text', text: 'Catálogo' }] }] },
                  ],
                },
              ],
            },
          ],
        },
      },
    }
    expect(paragrafosDoDocumento(doc)).toEqual(['Governança', 'Catálogo'])
  })

  it('não repete o mesmo texto e não guarda o que não tem letra', () => {
    expect(paragrafosDoDocumento({ a: 'Mesmo título', b: '  Mesmo   título ', c: '+300%', d: '2026', e: '+300% de adoção' })).toEqual([
      'Mesmo título',
      '+300% de adoção',
    ])
  })
})

describe('dividirEmTrechos', () => {
  it('junta parágrafos até o tamanho e põe o título na frente de cada trecho', () => {
    const trechos = dividirEmTrechos('Case Banco ABC', ['a'.repeat(30), 'b'.repeat(30), 'c'.repeat(30)], 70)
    expect(trechos).toEqual([`Case Banco ABC\n\n${'a'.repeat(30)}\n${'b'.repeat(30)}`, `Case Banco ABC\n\n${'c'.repeat(30)}`])
  })

  it('parte parágrafo longo nas frases, sem perder texto', () => {
    const frases = Array.from({ length: 10 }, (_, i) => `Frase número ${i} do parágrafo.`)
    const trechos = dividirEmTrechos('T', [frases.join(' ')], 80)
    expect(trechos.length).toBeGreaterThan(1)
    for (const t of trechos) expect(t.length).toBeLessThanOrEqual(80 + 3)
    expect(trechos.map((t) => t.replace('T\n\n', '')).join(' ')).toBe(frases.join(' '))
  })

  it('o título não se repete no corpo, e documento sem corpo vira só o título', () => {
    expect(dividirEmTrechos('Contato', ['Contato'])).toEqual(['Contato'])
    expect(dividirEmTrechos('', [])).toEqual([])
  })

  it('respeita o teto de trechos por documento', () => {
    expect(dividirEmTrechos('T', Array.from({ length: 50 }, () => 'x'.repeat(100)), 100, 5)).toHaveLength(5)
  })
})
