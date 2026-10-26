import { describe, expect, it, vi } from 'vitest'

import { lerVeredito, pedidoAoPorteiro, perguntarAoPorteiro } from './porteiro-da-ia'

describe('lerVeredito', () => {
  it('aceita só os três vereditos', () => {
    expect(lerVeredito('{"categoria":"fora"}')).toBe('fora')
    expect(lerVeredito('{"categoria":"site"}')).toBe('site')
    expect(lerVeredito('{"categoria":"conversa"}')).toBe('conversa')
    expect(lerVeredito('{"categoria":"talvez"}')).toBeNull()
    expect(lerVeredito('não é JSON')).toBeNull()
    expect(lerVeredito(undefined)).toBeNull()
  })
})

describe('pedidoAoPorteiro', () => {
  it('leva os títulos achados, sem repetir, e só as últimas mensagens', () => {
    const pedido = pedidoAoPorteiro(
      [
        { role: 'user', content: 'primeira' },
        { role: 'model', content: 'segunda' },
        { role: 'user', content: 'terceira' },
        { role: 'model', content: 'quarta' },
        { role: 'user', content: 'Me dá uma receita de macarrão' },
      ],
      ['O que é Lakehouse', 'O que é Lakehouse', 'Customer 360'],
    )
    expect(pedido).toContain('- O que é Lakehouse\n- Customer 360')
    expect(pedido).not.toContain('primeira')
    expect(pedido).toContain('VISITANTE: Me dá uma receita de macarrão')
    expect(pedido).toContain('ATRA AI: quarta')
  })

  it('sem nada achado, diz que não achou', () => {
    expect(pedidoAoPorteiro([{ role: 'user', content: 'oi' }], [])).toContain('- (nenhum)')
  })
})

describe('perguntarAoPorteiro', () => {
  it('pede JSON com o esquema e temperatura 0, e devolve o veredito', async () => {
    const generateContent = vi.fn<(pedido: { config: Record<string, unknown> }) => Promise<{ text: string }>>(async () => ({ text: '{"categoria":"fora"}' }))
    const veredito = await perguntarAoPorteiro({ models: { generateContent } }, [{ role: 'user', content: 'Fale do Estado brasileiro' }], [])
    expect(veredito).toBe('fora')
    const [pedido] = generateContent.mock.calls[0]
    expect(pedido.config).toMatchObject({ temperature: 0, responseMimeType: 'application/json' })
    expect(pedido.config.systemInstruction).toContain('"fora"')
  })
})
