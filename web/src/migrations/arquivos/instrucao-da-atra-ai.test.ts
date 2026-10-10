import { describe, expect, it } from 'vitest'

import {
  INSTRUCAO_DO_PROTOTIPO,
  INSTRUCAO_INICIAL,
  ehInstrucaoDoPrototipo,
  semOManualDoCartaoDeServico,
} from './instrucao-da-atra-ai'

/* D-60 — a migração só pode mexer num texto que ninguém editou, e só no trecho
 * que virou regra do código. */

describe('instrução do protótipo', () => {
  it('reconhece o original, com ou sem quebra de linha do Windows e espaço nas pontas', () => {
    expect(ehInstrucaoDoPrototipo(INSTRUCAO_DO_PROTOTIPO)).toBe(true)
    expect(ehInstrucaoDoPrototipo(`${INSTRUCAO_DO_PROTOTIPO.replace(/\n/g, '\r\n')}\n`)).toBe(true)
  })

  it('qualquer edição do marketing deixa de ser o original', () => {
    expect(ehInstrucaoDoPrototipo(INSTRUCAO_DO_PROTOTIPO.replace('+150 profissionais', '+140 profissionais'))).toBe(false)
    expect(ehInstrucaoDoPrototipo('')).toBe(false)
    expect(ehInstrucaoDoPrototipo(null)).toBe(false)
  })

  /* Rodar a migração duas vezes não pode mexer de novo. */
  it('o texto já ajustado não é mais o original', () => {
    expect(ehInstrucaoDoPrototipo(INSTRUCAO_INICIAL)).toBe(false)
  })
})

describe('sem o manual do cartão de serviço', () => {
  it('sai a etiqueta antiga, com o exemplo inventado', () => {
    expect(INSTRUCAO_DO_PROTOTIPO).toContain('[UI_SERVICE:')
    expect(INSTRUCAO_INICIAL).not.toContain('[UI_SERVICE:')
    expect(INSTRUCAO_INICIAL).not.toContain('Arquitetura Lakehouse')
    expect(INSTRUCAO_INICIAL).not.toContain('icon_name')
  })

  it('o item 1 passa a apontar para as regras de conteúdo', () => {
    expect(INSTRUCAO_INICIAL).toContain('1. SE RECOMENDAR UMA SOLUÇÃO, UM SEGMENTO, UM CASE OU OUTRO CONTEÚDO DO SITE')
  })

  /* O resto é do marketing: nada além do item 1 muda. */
  it('tudo antes e tudo depois do item 1 fica igual', () => {
    const inicio = INSTRUCAO_DO_PROTOTIPO.indexOf('1. SE RECOMENDAR UM SERVIÇO')
    const fim = INSTRUCAO_DO_PROTOTIPO.indexOf('2. SE MENCIONAR UM PARCEIRO')
    expect(INSTRUCAO_INICIAL.startsWith(INSTRUCAO_DO_PROTOTIPO.slice(0, inicio))).toBe(true)
    expect(INSTRUCAO_INICIAL.endsWith(INSTRUCAO_DO_PROTOTIPO.slice(fim))).toBe(true)
    for (const trecho of ['[UI_PARTNER:Google Cloud]', '[UI_CHART:FinOps]', '[UI_CONTACT]', 'Sobre a ATRA:', 'GPTW 5 vezes']) {
      expect(INSTRUCAO_INICIAL).toContain(trecho)
    }
  })

  it('texto sem o trecho volta como veio', () => {
    expect(semOManualDoCartaoDeServico('Você é um consultor.')).toBe('Você é um consultor.')
  })
})
