import { describe, expect, it } from 'vitest'

import { fatia, numeracao, paginaDaUrl, POR_PAGINA, totalDePaginas } from './paginacao'

const lista = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

describe('totalDePaginas', () => {
  it('213 artigos em páginas de 12 são 18; lista vazia ainda é 1 página', () => {
    expect(POR_PAGINA).toBe(12)
    expect(totalDePaginas(213)).toBe(18)
    expect(totalDePaginas(12)).toBe(1)
    expect(totalDePaginas(13)).toBe(2)
    expect(totalDePaginas(0)).toBe(1)
  })
})

describe('fatia', () => {
  it('devolve os itens da página, e a última pode vir incompleta', () => {
    expect(fatia(lista(30), 1)).toEqual(lista(12))
    expect(fatia(lista(30), 2)[0]).toBe(13)
    expect(fatia(lista(30), 3)).toEqual([25, 26, 27, 28, 29, 30])
  })

  /* Toda página junta devolve a lista inteira, sem repetir nem pular — era o
     defeito de origem: 107 artigos que não apareciam em página nenhuma. */
  it('nenhum item fica de fora nem aparece duas vezes', () => {
    const itens = lista(213)
    const todas = lista(totalDePaginas(213)).flatMap((p) => fatia(itens, p))
    expect(todas).toEqual(itens)
  })

  it('página que não existe devolve vazio', () => {
    expect(fatia(lista(30), 4)).toEqual([])
    expect(fatia(lista(30), 0)).toEqual([])
    expect(fatia(lista(30), 1.5)).toEqual([])
  })
})

describe('paginaDaUrl', () => {
  it('aceita só inteiro positivo, sem zero à esquerda', () => {
    expect(paginaDaUrl('2')).toBe(2)
    expect(paginaDaUrl('18')).toBe(18)
    for (const ruim of ['0', '02', '-1', '1.5', 'abc', '', '2a', ' 2']) expect(paginaDaUrl(ruim), ruim).toBeNull()
  })
})

describe('numeracao', () => {
  it('poucas páginas aparecem todas', () => {
    expect(numeracao(1, 1)).toEqual([1])
    expect(numeracao(2, 3)).toEqual([1, 2, 3])
    expect(numeracao(1, 4)).toEqual([1, 2, 3, 4])
    expect(numeracao(1, 5)).toEqual([1, 2, 'reticencias', 5])
  })

  it('no meio: primeira, vizinhas, última', () => {
    expect(numeracao(9, 18)).toEqual([1, 'reticencias', 8, 9, 10, 'reticencias', 18])
  })

  it('nas pontas não sobra reticências à toa', () => {
    expect(numeracao(1, 18)).toEqual([1, 2, 'reticencias', 18])
    expect(numeracao(18, 18)).toEqual([1, 'reticencias', 17, 18])
  })

  /* Reticências escondendo uma página só gastam o mesmo espaço do número. */
  it('buraco de uma página vira o número, não reticências', () => {
    expect(numeracao(3, 18)).toEqual([1, 2, 3, 4, 'reticencias', 18])
    expect(numeracao(16, 18)).toEqual([1, 'reticencias', 15, 16, 17, 18])
    expect(numeracao(4, 18)).toEqual([1, 2, 3, 4, 5, 'reticencias', 18])
    expect(numeracao(5, 18)).toEqual([1, 'reticencias', 4, 5, 6, 'reticencias', 18])
  })

  it('a atual sempre aparece, e nunca há número repetido ou fora do intervalo', () => {
    for (let total = 1; total <= 25; total++) {
      for (let atual = 1; atual <= total; atual++) {
        const numeros = numeracao(atual, total).filter((n): n is number => n !== 'reticencias')
        expect(numeros).toContain(atual)
        expect(new Set(numeros).size).toBe(numeros.length)
        expect(numeros.every((n) => n >= 1 && n <= total)).toBe(true)
        expect([...numeros].sort((a, b) => a - b)).toEqual(numeros)
      }
    }
  })
})
