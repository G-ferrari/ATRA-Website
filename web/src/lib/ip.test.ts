import { describe, expect, it } from 'vitest'

import { ipDe } from './ip'

describe('ipDe', () => {
  it('prefere o X-Real-IP, que é o Caddy quem escreve', () => {
    const h = new Headers({ 'x-real-ip': '203.0.113.7', 'x-forwarded-for': '10.0.0.1' })
    expect(ipDe(h)).toBe('203.0.113.7')
  })

  it('ignora um X-Forwarded-For forjado quando há o cabeçalho confiável', () => {
    /* O cenário do contorno: cliente manda XFF aleatório a cada requisição
     * para nunca "repetir IP". Com o Caddy na frente, o X-Real-IP existe e o
     * forjado não conta. */
    const h = new Headers({ 'x-real-ip': '203.0.113.7', 'x-forwarded-for': 'forjado-123, 203.0.113.7' })
    expect(ipDe(h)).toBe('203.0.113.7')
  })

  it('cai no primeiro XFF sem o proxy na frente (dev e gate)', () => {
    const h = new Headers({ 'x-forwarded-for': '198.51.100.4, 203.0.113.7' })
    expect(ipDe(h)).toBe('198.51.100.4')
  })

  it('devolve "desconhecido" sem cabeçalho nenhum', () => {
    expect(ipDe(new Headers())).toBe('desconhecido')
  })

  it('não devolve vazio quando o X-Real-IP vem em branco', () => {
    const h = new Headers({ 'x-real-ip': '  ', 'x-forwarded-for': '198.51.100.4' })
    expect(ipDe(h)).toBe('198.51.100.4')
  })
})
