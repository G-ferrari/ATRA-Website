import { describe, expect, it } from 'vitest'

import { tokenizarUiGenerativa } from './ui-generativa'

describe('tokenizarUiGenerativa', () => {
  it('texto sem tag vira um token só', () => {
    expect(tokenizarUiGenerativa('Olá! Como posso ajudar?')).toEqual([
      { tipo: 'texto', texto: 'Olá! Como posso ajudar?' },
    ])
  })

  it('troca [UI_CONTACT] no meio do texto', () => {
    expect(tokenizarUiGenerativa('Deixe seus dados:\n\n[UI_CONTACT]')).toEqual([
      { tipo: 'texto', texto: 'Deixe seus dados:\n\n' },
      { tipo: 'contato' },
    ])
  })

  it('serviço com ícone fluente — o nome do ícone tem dois-pontos e fica inteiro', () => {
    expect(
      tokenizarUiGenerativa('[UI_SERVICE:Arquitetura Lakehouse:Centralize seus dados.:fluent:cloud-24-regular]'),
    ).toEqual([
      { tipo: 'servico', titulo: 'Arquitetura Lakehouse', descricao: 'Centralize seus dados.', icone: 'fluent:cloud-24-regular' },
    ])
  })

  it('serviço sem ícone recebe string vazia, como no legado', () => {
    expect(tokenizarUiGenerativa('[UI_SERVICE:BI:Dashboards executivos.]')).toEqual([
      { tipo: 'servico', titulo: 'BI', descricao: 'Dashboards executivos.', icone: '' },
    ])
  })

  it('parceiro inline preserva o texto em volta', () => {
    expect(tokenizarUiGenerativa('Com o [UI_PARTNER:Google Cloud], entregamos.')).toEqual([
      { tipo: 'texto', texto: 'Com o ' },
      { tipo: 'parceiro', nome: 'Google Cloud' },
      { tipo: 'texto', texto: ', entregamos.' },
    ])
  })

  it('gráfico carrega o tipo', () => {
    expect(tokenizarUiGenerativa('Veja: [UI_CHART:FinOps]')).toEqual([
      { tipo: 'texto', texto: 'Veja: ' },
      { tipo: 'grafico', grafico: 'FinOps' },
    ])
  })

  it('tag malformada é engolida sem sobrar texto cru — comportamento do legado (Chat.tsx:47)', () => {
    expect(tokenizarUiGenerativa('antes [UI_SERVICE:só-título] depois')).toEqual([
      { tipo: 'texto', texto: 'antes ' },
      { tipo: 'texto', texto: ' depois' },
    ])
  })

  /* D-60 — o item do site vem pelo código; título e endereço são do servidor. */
  it('conteúdo do site carrega só o código', () => {
    expect(tokenizarUiGenerativa('Veja:\n[UI_CONTEUDO:S12]\nFaz sentido?')).toEqual([
      { tipo: 'texto', texto: 'Veja:\n' },
      { tipo: 'conteudo', codigo: 'S12' },
      { tipo: 'texto', texto: '\nFaz sentido?' },
    ])
    expect(tokenizarUiGenerativa('[UI_CONTEUDO:P-CONTATO]')).toEqual([{ tipo: 'conteudo', codigo: 'P-CONTATO' }])
  })

  it('duas tags adjacentes não geram token de texto vazio', () => {
    expect(tokenizarUiGenerativa('[UI_CONTACT][UI_CHART:BI]')).toEqual([
      { tipo: 'contato' },
      { tipo: 'grafico', grafico: 'BI' },
    ])
  })
})
