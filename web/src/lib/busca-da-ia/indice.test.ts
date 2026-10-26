import { describe, expect, it } from 'vitest'

import type { ConteudoRecomendavel } from '@/types/content'

import { hashDoTrecho, planejar, trechosDesejados } from './plano'

const CATALOGO: ConteudoRecomendavel[] = [
  { codigo: 'C1', tipo: 'case', titulo: 'Case Banco ABC', resumo: 'Marketplace de dados.', href: '/cases/abc' },
  { codigo: 'P-DIAGNOSTICO', tipo: 'pagina', titulo: 'Diagnóstico de maturidade', resumo: 'Descubra seu nível.', href: '/diagnostico' },
]

describe('trechosDesejados', () => {
  it('cada item do catálogo vira trechos com o código e a posição; item sem texto no CMS usa o resumo', () => {
    const desejados = trechosDesejados(CATALOGO, new Map([['C1', ['Desafio: dados espalhados.']]]))
    expect(desejados.map(({ codigo, tipo, posicao, conteudo }) => ({ codigo, tipo, posicao, conteudo }))).toEqual([
      { codigo: 'C1', tipo: 'case', posicao: 0, conteudo: 'Case Banco ABC\n\nDesafio: dados espalhados.' },
      { codigo: 'P-DIAGNOSTICO', tipo: 'pagina', posicao: 0, conteudo: 'Diagnóstico de maturidade\n\nDescubra seu nível.' },
    ])
  })

  it('o que não está no catálogo não entra, mesmo com texto', () => {
    expect(trechosDesejados([], new Map([['C1', ['Texto']]]))).toEqual([])
  })
})

describe('hashDoTrecho', () => {
  it('muda com o texto e é estável para o mesmo texto', () => {
    expect(hashDoTrecho('a')).toBe(hashDoTrecho('a'))
    expect(hashDoTrecho('a')).not.toBe(hashDoTrecho('b'))
    expect(hashDoTrecho('a')).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe('planejar', () => {
  const trecho = (codigo: string, posicao: number, conteudo: string) => ({
    codigo,
    tipo: 'case' as const,
    posicao,
    conteudo,
    hash: hashDoTrecho(conteudo),
  })

  it('grava só o que é novo ou mudou, e apaga o que sobrou', () => {
    const desejados = [trecho('C1', 0, 'igual'), trecho('C1', 1, 'mudou'), trecho('C2', 0, 'novo')]
    const guardados = [
      { codigo: 'C1', posicao: 0, hash: hashDoTrecho('igual') },
      { codigo: 'C1', posicao: 1, hash: hashDoTrecho('antes') },
      { codigo: 'C1', posicao: 2, hash: hashDoTrecho('encurtou') },
      { codigo: 'C9', posicao: 0, hash: hashDoTrecho('despublicado') },
    ]
    const { gravar, apagar } = planejar(desejados, guardados)
    expect(gravar.map((t) => `${t.codigo}#${t.posicao}`)).toEqual(['C1#1', 'C2#0'])
    expect(apagar.map((t) => `${t.codigo}#${t.posicao}`)).toEqual(['C1#2', 'C9#0'])
  })

  it('nada mudou, nada a fazer', () => {
    const desejados = [trecho('C1', 0, 'igual')]
    expect(planejar(desejados, [{ codigo: 'C1', posicao: 0, hash: hashDoTrecho('igual') }])).toEqual({ gravar: [], apagar: [] })
  })
})
