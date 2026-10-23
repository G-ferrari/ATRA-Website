import { describe, expect, it } from 'vitest'

import { areaEmPortugues, linkedinValido, senioridadeEmPortugues } from './banco-de-talentos'

/* D-62: a action aceita só as opções da lista e grava sempre em português — um
 * POST forjado não põe texto livre no perfil, e o mesmo cargo não vira dois
 * valores conforme o idioma da página. O envio ao RD, que motivou a regra, saiu
 * na D-67; a regra ficou para o filtro do admin. */
describe('opções do banco de talentos', () => {
  it('opção em português fica como está', () => {
    expect(areaEmPortugues('Engenharia de Dados')).toBe('Engenharia de Dados')
    expect(senioridadeEmPortugues('Sênior')).toBe('Sênior')
  })

  it('opção em inglês vira o rótulo em português', () => {
    expect(areaEmPortugues('Data Engineering')).toBe('Engenharia de Dados')
    expect(areaEmPortugues('Other')).toBe('Outros')
    expect(senioridadeEmPortugues('Mid-level')).toBe('Pleno')
    expect(senioridadeEmPortugues('Senior')).toBe('Sênior')
  })

  it('o que não é opção da lista some', () => {
    expect(areaEmPortugues('')).toBeUndefined()
    expect(areaEmPortugues('Qualquer coisa que alguém escreveu')).toBeUndefined()
    expect(senioridadeEmPortugues('CEO')).toBeUndefined()
  })
})

describe('linkedinValido', () => {
  it('aceita endereço http(s)', () => {
    expect(linkedinValido('https://www.linkedin.com/in/maria')).toBe('https://www.linkedin.com/in/maria')
  })

  it('recusa o que não é endereço, ou é longo demais', () => {
    expect(linkedinValido('linkedin.com/in/maria')).toBeUndefined()
    expect(linkedinValido('javascript:alert(1)')).toBeUndefined()
    expect(linkedinValido('Me procure por Maria Silva')).toBeUndefined()
    expect(linkedinValido(`https://linkedin.com/in/${'a'.repeat(300)}`)).toBeUndefined()
    expect(linkedinValido('')).toBeUndefined()
  })
})
