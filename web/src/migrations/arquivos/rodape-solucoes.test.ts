import { describe, expect, it } from 'vitest'

import { abasEmIngles, comAsAbasNovas } from './rodape-solucoes'

const solucoes = () => ({
  id: 'col-solucoes',
  title: 'Soluções',
  kind: 'links',
  links: [
    { id: 's1', label: 'Inovação & IA', href: '/solucoes' },
    { id: 's2', label: 'Dados, BI & Advanced Analytics', href: '/solucoes' },
    { id: 's3', label: 'Governança & Cultura', href: '/solucoes' },
  ],
})

const sobre = () => ({ id: 'col-sobre', title: 'Sobre', kind: 'links', links: [{ id: 'a1', label: 'Carreiras', href: '/carreiras' }] })

describe('comAsAbasNovas', () => {
  it('as três abas antigas viram as quatro novas, todas para o índice', () => {
    const { colunas, mudou } = comAsAbasNovas([solucoes(), sobre()])
    expect(mudou).toBe(true)
    expect(colunas[0].links).toEqual([
      { id: 's1', label: 'IA & Analytics Avançada', href: '/solucoes' },
      { id: 's2', label: 'Dados & Cloud', href: '/solucoes' },
      { id: 's3', label: 'Governança & FinOps', href: '/solucoes' },
      { label: 'Serviços Especializados', href: '/solucoes' },
    ])
    expect(colunas[1]).toEqual(sobre())
  })

  /* Conteúdo é do marketing: coluna que já não é a do seed fica como está. */
  it('coluna editada no admin não é tocada', () => {
    const renomeada = solucoes()
    renomeada.links[0].label = 'Inteligência Artificial'
    const comLinkAMais = solucoes()
    comLinkAMais.links.push({ id: 's4', label: 'Ver todas', href: '/solucoes' })
    const paraOutroLugar = solucoes()
    paraOutroLugar.links[2].href = '/solucoes/governanca'

    for (const coluna of [renomeada, comLinkAMais, paraOutroLugar]) {
      const { colunas, mudou } = comAsAbasNovas([coluna])
      expect(mudou).toBe(false)
      expect(colunas).toEqual([coluna])
    }
  })

  it('rodar de novo não muda nada', () => {
    const { colunas } = comAsAbasNovas([solucoes()])
    expect(comAsAbasNovas(colunas).mudou).toBe(false)
  })

  it('não altera o que recebeu', () => {
    const original = [solucoes()]
    comAsAbasNovas(original)
    expect(original).toEqual([solucoes()])
  })
})

describe('abasEmIngles', () => {
  it('põe o nome em inglês nas linhas das abas, pelo id, e só nelas', () => {
    const ingles = [
      { id: 'col-solucoes', links: [{ id: 's1', label: 'Innovation & AI', href: '/solucoes' }, { id: 'n4', label: null, href: '/solucoes' }] },
      { id: 'col-sobre', links: [{ id: 'a1', label: 'Careers', href: '/carreiras' }] },
    ]
    expect(abasEmIngles(ingles, ['s1', 's2', 's3', 'n4'])).toEqual([
      { id: 'col-solucoes', links: [{ id: 's1', label: 'AI & Advanced Analytics', href: '/solucoes' }, { id: 'n4', label: 'Specialized Services', href: '/solucoes' }] },
      { id: 'col-sobre', links: [{ id: 'a1', label: 'Careers', href: '/carreiras' }] },
    ])
  })
})
