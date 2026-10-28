import { describe, expect, it } from 'vitest'

import { ACOES_POR_REGULACAO, CARGOS, PERGUNTAS, PORTES, ROTULOS_DAS_TAGS, SETORES } from './dados'
import { TRADUCOES } from './traducoes'

/* A base é gerada do HTML do Roger; as traduções, à mão. HTML novo com
   pergunta, alternativa ou regulação a mais deixaria um idioma com buraco sem
   aviso — e o `Record` dos tipos não pega chave sobrando nem alternativa a
   menos. Vale para todo idioma traduzido (D-76, D-77). */
describe.each(Object.entries(TRADUCOES))('a tradução %s cobre a base inteira', (_, tr) => {
  it('toda pergunta, com uma tradução por alternativa', () => {
    for (const p of PERGUNTAS) {
      const em = tr.perguntas[p.id]
      expect(em, p.id).toBeDefined()
      expect(em.alternativas.length, p.id).toBe(p.alternativas.length)
      expect(em.enunciado.trim(), p.id).not.toBe('')
      for (const a of em.alternativas) expect(a.trim(), p.id).not.toBe('')
    }
    expect(Object.keys(tr.perguntas).sort()).toEqual(PERGUNTAS.map((p) => p.id).sort())
  })

  it('toda regulação e toda ação recomendada', () => {
    expect(Object.keys(tr.rotulosDasTags).sort()).toEqual(Object.keys(ROTULOS_DAS_TAGS).sort())
    expect(Object.keys(tr.acoesPorRegulacao).sort()).toEqual(Object.keys(ACOES_POR_REGULACAO).sort())
  })

  it('todo setor, porte e cargo', () => {
    expect(Object.keys(tr.setores).sort()).toEqual(SETORES.map((o) => o.valor).sort())
    expect(Object.keys(tr.portes).sort()).toEqual(PORTES.map((o) => o.valor).sort())
    expect(Object.keys(tr.cargos).sort()).toEqual(CARGOS.map((o) => o.valor).sort())
  })
})
