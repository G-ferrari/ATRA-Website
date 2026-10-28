import { describe, expect, it } from 'vitest'

import { ACOES_POR_REGULACAO, PERGUNTAS, ROTULOS_DAS_TAGS } from './dados'
import { ACOES_POR_REGULACAO_EN, PERGUNTAS_EN, ROTULOS_DAS_TAGS_EN } from './ingles'

/* A base é gerada do HTML do Roger; a tradução, à mão. HTML novo com pergunta,
   alternativa ou regulação a mais deixaria o inglês com buraco sem aviso. */
describe('a tradução cobre a base inteira', () => {
  it('toda pergunta, com uma tradução por alternativa', () => {
    for (const p of PERGUNTAS) {
      const em = PERGUNTAS_EN[p.id]
      expect(em, p.id).toBeDefined()
      expect(em.alternativas.length, p.id).toBe(p.alternativas.length)
      expect(em.enunciado.trim(), p.id).not.toBe('')
    }
    expect(Object.keys(PERGUNTAS_EN).sort()).toEqual(PERGUNTAS.map((p) => p.id).sort())
  })

  it('toda regulação e toda ação recomendada', () => {
    expect(Object.keys(ROTULOS_DAS_TAGS_EN).sort()).toEqual(Object.keys(ROTULOS_DAS_TAGS).sort())
    expect(Object.keys(ACOES_POR_REGULACAO_EN).sort()).toEqual(Object.keys(ACOES_POR_REGULACAO).sort())
  })
})
