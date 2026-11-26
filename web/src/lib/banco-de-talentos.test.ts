import { describe, expect, it } from 'vitest'

import { areaEmPortugues, perfilDoLinkedin, senioridadeEmPortugues } from './banco-de-talentos'

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

describe('perfilDoLinkedin', () => {
  it('aceita o perfil como o candidato cola, e devolve com https', () => {
    expect(perfilDoLinkedin('https://www.linkedin.com/in/maria')).toBe('https://www.linkedin.com/in/maria')
    expect(perfilDoLinkedin('linkedin.com/in/maria')).toBe('https://linkedin.com/in/maria')
    expect(perfilDoLinkedin('  www.linkedin.com/in/maria-silva-123/  ')).toBe('https://www.linkedin.com/in/maria-silva-123/')
    expect(perfilDoLinkedin('http://br.linkedin.com/in/maria')).toBe('https://br.linkedin.com/in/maria')
    expect(perfilDoLinkedin('https://LinkedIn.com/in/Maria?utm_source=share')).toBe('https://linkedin.com/in/Maria?utm_source=share')
    expect(perfilDoLinkedin('https://www.linkedin.com/pub/maria/1/2/3')).toBe('https://www.linkedin.com/pub/maria/1/2/3')
  })

  it('recusa o que não é perfil do LinkedIn', () => {
    expect(perfilDoLinkedin('')).toBeUndefined()
    expect(perfilDoLinkedin('Me procure por Maria Silva')).toBeUndefined()
    expect(perfilDoLinkedin('javascript:alert(1)')).toBeUndefined()
    expect(perfilDoLinkedin('https://github.com/maria')).toBeUndefined()
    expect(perfilDoLinkedin('https://linkedin.com.golpe.com/in/maria')).toBeUndefined()
    expect(perfilDoLinkedin('https://naolinkedin.com/in/maria')).toBeUndefined()
    expect(perfilDoLinkedin('https://www.linkedin.com/')).toBeUndefined()
    expect(perfilDoLinkedin('https://www.linkedin.com/in/')).toBeUndefined()
    expect(perfilDoLinkedin('https://www.linkedin.com/company/atra')).toBeUndefined()
    expect(perfilDoLinkedin('https://user:senha@linkedin.com/in/maria')).toBeUndefined()
    expect(perfilDoLinkedin(`https://linkedin.com/in/${'a'.repeat(300)}`)).toBeUndefined()
  })
})
