import { describe, expect, it } from 'vitest'

import type { ConteudoRecomendavel } from '@/types/content'

import { montarInstrucao } from './instrucao-da-ia'

const CATALOGO: ConteudoRecomendavel[] = [
  { codigo: 'A128', tipo: 'artigo', titulo: 'O que é Data Mesh', resumo: 'Resumo do artigo que não entra na lista.', href: '/blog/o-que-e-data-mesh' },
  { codigo: 'S12', tipo: 'solucao', titulo: 'Customer 360', resumo: 'Visão única do cliente.', href: '/solucoes/customer-360' },
  { codigo: 'P-CONTATO', tipo: 'pagina', titulo: 'Fale com a ATRA', resumo: '', href: '/contato' },
]

describe('montarInstrucao', () => {
  const instrucao = montarInstrucao('Você é um consultor da ATRA.', CATALOGO, 'pt')

  it('o texto do admin vem primeiro; as regras, depois; a lista, por último', () => {
    const admin = instrucao.indexOf('Você é um consultor da ATRA.')
    const regras = instrucao.indexOf('REGRAS PARA RECOMENDAR CONTEÚDO DO SITE')
    const lista = instrucao.indexOf('CONTEÚDO DO SITE DA ATRA')
    expect(admin).toBe(0)
    expect(regras).toBeGreaterThan(admin)
    expect(lista).toBeGreaterThan(regras)
  })

  it('cada item entra com o código; o resumo, só fora do blog', () => {
    expect(instrucao).toContain('- S12 — Customer 360: Visão única do cliente.')
    expect(instrucao).toContain('- P-CONTATO — Fale com a ATRA')
    expect(instrucao).toContain('- A128 — O que é Data Mesh')
    expect(instrucao).not.toContain('Resumo do artigo que não entra na lista.')
  })

  /* O modelo nunca recebe endereço: o que ele não leu, não escreve. */
  it('nenhum endereço entra na instrução', () => {
    for (const item of CATALOGO) expect(instrucao).not.toContain(item.href)
  })

  it('os artigos ficam no fim: é a parte que mais muda e a que mais pesa', () => {
    expect(instrucao.indexOf('Soluções:')).toBeLessThan(instrucao.indexOf('Páginas do site:'))
    expect(instrucao.indexOf('Páginas do site:')).toBeLessThan(instrucao.indexOf('Artigos do blog'))
  })

  it('as regras dizem como citar, proíbem endereço e aposentam a etiqueta antiga', () => {
    expect(instrucao).toContain('[UI_CONTEUDO:CÓDIGO]')
    expect(instrucao).toContain('Nunca escreva endereços')
    expect(instrucao).toContain('Não use a etiqueta [UI_SERVICE:...]')
    expect(instrucao).toContain('Não invente recursos, prazos, preços, clientes ou resultados')
  })

  it('tipo sem item não ganha título de seção', () => {
    expect(instrucao).not.toContain('Webinars:')
    expect(instrucao).not.toContain('Segmentos:')
  })

  it('em inglês, regras e títulos em inglês', () => {
    const en = montarInstrucao('You are an ATRA consultant.', CATALOGO, 'en')
    expect(en).toContain('RULES FOR RECOMMENDING WEBSITE CONTENT')
    expect(en).toContain('Solutions:')
    expect(en).toContain('- S12 — Customer 360')
  })

  /* Tipos todos desligados no admin, ou catálogo fora do ar: o modelo é avisado
     de que não há o que recomendar — e de que não pode inventar. */
  it('catálogo vazio: sem lista, com a proibição', () => {
    const vazio = montarInstrucao('Você é um consultor da ATRA.', [], 'pt')
    expect(vazio).toContain('Hoje não há conteúdo do site para recomendar')
    expect(vazio).toContain('não escreva endereços')
    expect(vazio).not.toContain('Soluções:')
  })

  it('sem texto do admin, sobram as regras e a lista', () => {
    expect(montarInstrucao('  ', CATALOGO, 'pt').startsWith('REGRAS PARA RECOMENDAR')).toBe(true)
  })
})
