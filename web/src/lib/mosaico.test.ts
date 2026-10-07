import { describe, expect, it } from 'vitest'

import { CELULAS, formasDoMosaico, MAXIMO_DO_MOSAICO } from './mosaico'

describe('formasDoMosaico', () => {
  it('uma forma por cartão, do primeiro ao último', () => {
    for (let n = 1; n <= MAXIMO_DO_MOSAICO; n++) expect(formasDoMosaico(n), `${n}`).toHaveLength(n)
    expect(formasDoMosaico(0)).toEqual([])
  })

  /* O pedido: ajeitar-se com 4, 5 e 6. "Sem buraco" é a área dos cartões
     fechar um retângulo de 4 colunas. */
  it('com 2 a 6 cartões a área fecha um retângulo de 4 colunas, sem buraco', () => {
    for (let n = 2; n <= MAXIMO_DO_MOSAICO; n++) {
      const area = formasDoMosaico(n).reduce((s, f) => s + CELULAS[f].colunas * CELULAS[f].linhas, 0)
      expect(area % 4, `${n} cartões`).toBe(0)
      expect(area / 4, `${n} cartões`).toBe(2)
    }
  })

  /* No celular são 2 colunas: pequeno sem par deixaria meia linha vazia. */
  it('os pequenos vêm sempre aos pares, para o celular', () => {
    for (let n = 1; n <= MAXIMO_DO_MOSAICO; n++) {
      const seguidos = formasDoMosaico(n).map((f) => (f === 'pequeno' ? 'p' : '|')).join('').split('|')
      for (const grupo of seguidos) expect(grupo.length % 2, `${n} cartões`).toBe(0)
    }
  })

  it('além do teto, desenha os primeiros', () => {
    expect(formasDoMosaico(9)).toEqual(formasDoMosaico(MAXIMO_DO_MOSAICO))
  })
})
