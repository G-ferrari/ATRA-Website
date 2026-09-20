import { beforeEach, describe, expect, it } from 'vitest'

import { conferir, excedeuPorIp, limparContagem, SEGUNDOS_MINIMOS } from './anti-spam'

const AGORA = 1_800_000_000_000

describe('conferir', () => {
  it('deixa passar o envio de gente', () => {
    expect(conferir({ carimbo: String(AGORA - 30_000), agora: AGORA })).toEqual({ ok: true })
  })

  it('barra quem preencheu o campo isca', () => {
    expect(conferir({ isca: 'https://spam.example', carimbo: String(AGORA - 30_000), agora: AGORA })).toEqual({
      ok: false,
      motivo: 'honeypot',
    })
  })

  it('barra o envio instantâneo', () => {
    expect(conferir({ carimbo: String(AGORA - (SEGUNDOS_MINIMOS - 1) * 1000), agora: AGORA }).ok).toBe(false)
  })

  it('barra formulário velho, de aba esquecida', () => {
    expect(conferir({ carimbo: String(AGORA - 3 * 60 * 60 * 1000), agora: AGORA })).toEqual({
      ok: false,
      motivo: 'expirado',
    })
  })

  /* Sem carimbo pode ser JavaScript bloqueado. Recusar um envio honesto é pior
     do que aceitar um automático — as outras barreiras continuam valendo. */
  it('não reprova por carimbo ausente ou ilegível', () => {
    expect(conferir({ agora: AGORA })).toEqual({ ok: true })
    expect(conferir({ carimbo: 'abc', agora: AGORA })).toEqual({ ok: true })
  })

  /* Espaço em branco não é preenchimento: alguns navegadores autocompletam com
     string vazia e reprovariam gente de verdade. */
  it('ignora isca só com espaço', () => {
    expect(conferir({ isca: '   ', carimbo: String(AGORA - 30_000), agora: AGORA })).toEqual({ ok: true })
  })
})

describe('excedeuPorIp', () => {
  beforeEach(limparContagem)

  it('deixa passar até o teto e barra do teto em diante', () => {
    for (let i = 0; i < 5; i++) expect(excedeuPorIp('1.2.3.4', 5, AGORA)).toBe(false)
    expect(excedeuPorIp('1.2.3.4', 5, AGORA)).toBe(true)
  })

  it('conta cada IP por si', () => {
    for (let i = 0; i < 5; i++) excedeuPorIp('1.2.3.4', 5, AGORA)
    expect(excedeuPorIp('9.9.9.9', 5, AGORA)).toBe(false)
  })

  it('esquece o que saiu da janela de uma hora', () => {
    for (let i = 0; i < 5; i++) excedeuPorIp('1.2.3.4', 5, AGORA)
    expect(excedeuPorIp('1.2.3.4', 5, AGORA + 61 * 60 * 1000)).toBe(false)
  })
})
