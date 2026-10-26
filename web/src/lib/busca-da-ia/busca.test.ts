import { describe, expect, it } from 'vitest'

import { comoLista, consultaDaConversa } from './consulta'

describe('consultaDaConversa', () => {
  it('a última mensagem do visitante, com a anterior dele na frente; as da IA ficam de fora', () => {
    expect(
      consultaDaConversa([
        { role: 'user', content: 'Oi' },
        { role: 'model', content: 'Olá! Como posso ajudar?' },
        { role: 'user', content: 'Vocês migram para o BigQuery?' },
        { role: 'model', content: 'Sim.' },
        { role: 'user', content: ' E quanto tempo leva? ' },
      ]),
    ).toBe('Vocês migram para o BigQuery?\nE quanto tempo leva?')
  })

  it('sem mensagem do visitante, nada a buscar', () => {
    expect(consultaDaConversa([{ role: 'model', content: 'Olá' }])).toBe('')
  })
})

describe('comoLista', () => {
  it('monta o array do Postgres só com o que tem forma de código', () => {
    expect(comoLista(['S12', 'P-CONTATO', "x'); DROP TABLE ai_chunks; --"])).toBe('{S12,P-CONTATO}')
  })
})
