import { describe, expect, it } from 'vitest'

import {
  PILARES,
  PONTUACAO_MAXIMA,
  TOTAL_PILARES,
  pontuacao,
  resumoRespostas,
  validarRespostas,
  type RespostasQuickCheck,
} from './diagnostico-rc18'

/** Respostas escolhendo, em cada pilar, a opção de maior/menor pontuação. */
const extremo = (maior: boolean): RespostasQuickCheck =>
  Object.fromEntries(
    PILARES.map((p) => {
      const opcao = p.opcoes.reduce((a, b) => (maior ? (b.pontos > a.pontos ? b : a) : b.pontos < a.pontos ? b : a))
      return [p.id, opcao.valor]
    }),
  ) as RespostasQuickCheck

describe('diagnostico-rc18 (quick check, 11 pilares)', () => {
  it('tem exatamente 11 pilares, cada um com opções pontuadas', () => {
    expect(PILARES).toHaveLength(11)
    expect(TOTAL_PILARES).toBe(11)
    expect(PILARES.map((p) => p.id)).toContain('rastreabilidade')
    for (const p of PILARES) {
      expect(p.opcoes.length).toBeGreaterThanOrEqual(2)
      expect(Math.max(...p.opcoes.map((o) => o.pontos))).toBe(10)
    }
  })

  it('teto de pontuação é 11 × 10 = 110', () => {
    expect(PONTUACAO_MAXIMA).toBe(110)
  })

  it('melhor opção em todos → 110/110 (100%)', () => {
    const r = pontuacao(extremo(true))
    expect(r.total).toBe(110)
    expect(r.maximo).toBe(110)
    expect(r.pct).toBe(100)
  })

  it('pior opção em todos → soma dos mínimos, pct arredondado', () => {
    const minimos = PILARES.reduce((acc, p) => acc + Math.min(...p.opcoes.map((o) => o.pontos)), 0)
    const r = pontuacao(extremo(false))
    expect(r.total).toBe(minimos)
    expect(r.pct).toBe(Math.round((minimos / 110) * 100))
  })

  it('entrada vazia → 0', () => {
    expect(pontuacao({})).toEqual({ total: 0, maximo: 110, pct: 0 })
  })

  it('validarRespostas descarta pilar desconhecido e opção inválida', () => {
    const limpo = validarRespostas({
      governanca: 'sim',
      inexistente: 'sim',
      controles: 'opcao-que-nao-existe',
      cultura: 'em-parte',
    })
    expect(limpo).toEqual({ governanca: 'sim', cultura: 'em-parte' })
  })

  it('validarRespostas tolera entradas não-objeto', () => {
    expect(validarRespostas(null)).toEqual({})
    expect(validarRespostas('x')).toEqual({})
    expect(validarRespostas(42)).toEqual({})
  })

  it('resumoRespostas traz a pontuação e uma linha por pilar', () => {
    const texto = resumoRespostas({ governanca: 'sim' })
    expect(texto).toContain('Pontuação:')
    expect(texto).toContain('Governança: Sim (10 pts)')
    // pilar não respondido aparece com travessão
    expect(texto).toContain('Cultura: —')
    expect(texto.split('\n').filter((l) => l.startsWith('- '))).toHaveLength(11)
  })

  it('é determinístico: mesma entrada, mesma saída', () => {
    const entrada = extremo(true)
    expect(pontuacao(entrada)).toEqual(pontuacao(entrada))
    expect(resumoRespostas(entrada)).toEqual(resumoRespostas(entrada))
  })
})
