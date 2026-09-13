import { describe, expect, it } from 'vitest'

import {
  calcularIndice,
  DIMENSOES,
  faixaDe,
  validarRespostas,
  type Nivel,
  type RespostasDiagnostico,
} from './diagnostico-rc18'

const todas = (nivel: Nivel): RespostasDiagnostico =>
  Object.fromEntries(DIMENSOES.map((d) => [d.id, nivel])) as RespostasDiagnostico

describe('diagnostico-rc18', () => {
  it('tem exatamente as 12 dimensões oficiais', () => {
    expect(DIMENSOES).toHaveLength(12)
    expect(DIMENSOES.map((d) => d.id)).toContain('rastreabilidade')
  })

  it('tudo no nível 0 → índice 0, faixa inicial, 12 lacunas', () => {
    const r = calcularIndice(todas(0))
    expect(r.ipRc18).toBe(0)
    expect(r.faixa).toBe('inicial')
    expect(r.lacunas).toHaveLength(12)
    expect(r.respondidas).toBe(12)
  })

  it('tudo no nível 3 (piso da norma) → índice 100, avançado, sem lacunas', () => {
    const r = calcularIndice(todas(3))
    expect(r.ipRc18).toBe(100)
    expect(r.faixa).toBe('avancado')
    expect(r.lacunas).toEqual([])
  })

  it('tudo no nível 2 → 67% (intermediário) e as 12 ainda são lacunas (abaixo do piso 3)', () => {
    const r = calcularIndice(todas(2))
    expect(r.ipRc18).toBe(67) // 24 / 36 = 66,67 → 67
    expect(r.faixa).toBe('intermediario')
    expect(r.lacunas).toHaveLength(12)
  })

  it('respostas parciais: não respondida conta como 0', () => {
    const r = calcularIndice({ acuracia: 3, completude: 3 })
    expect(r.respondidas).toBe(2)
    // 6 de 36 pontos possíveis
    expect(r.ipRc18).toBe(17)
    expect(r.lacunas).not.toContain('acuracia')
    expect(r.lacunas).toContain('acessibilidade')
  })

  it('entrada vazia → índice 0 e nada respondido', () => {
    const r = calcularIndice({})
    expect(r.ipRc18).toBe(0)
    expect(r.respondidas).toBe(0)
    expect(r.porDimensao).toHaveLength(12)
  })

  it('validarRespostas descarta chaves desconhecidas e níveis fora de 0–3', () => {
    const limpo = validarRespostas({ acuracia: 3, inexistente: 2, clareza: 9, integridade: -1, comparabilidade: 1.5 })
    expect(limpo).toEqual({ acuracia: 3 })
  })

  it('validarRespostas tolera entradas não-objeto', () => {
    expect(validarRespostas(null)).toEqual({})
    expect(validarRespostas('x')).toEqual({})
    expect(validarRespostas(42)).toEqual({})
  })

  it('faixaDe respeita os limites indicativos', () => {
    expect(faixaDe(0)).toBe('inicial')
    expect(faixaDe(44)).toBe('inicial')
    expect(faixaDe(45)).toBe('intermediario')
    expect(faixaDe(74)).toBe('intermediario')
    expect(faixaDe(75)).toBe('avancado')
    expect(faixaDe(100)).toBe('avancado')
  })

  it('é determinístico: mesma entrada, mesma saída', () => {
    const entrada = todas(2)
    expect(calcularIndice(entrada)).toEqual(calcularIndice(entrada))
  })
})
