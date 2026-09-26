import { describe, expect, it } from 'vitest'

import { larguraOtica } from './logo'

const logo = (proporcao: number) => ({ width: proporcao * 100, height: 100 })
/** Área ocupada, em frações da largura da caixa ao quadrado. */
const area = (proporcao: number, largura: number) => (largura * largura) / proporcao

describe('larguraOtica', () => {
  it('o logo mais comprido usa a largura inteira', () => {
    expect(larguraOtica(logo(6.3), 'md', 0.5)).toBe(1)
  })

  /* É a regra inteira: o compacto fica mais estreito na medida exata para
     pesar o mesmo que o comprido. */
  it('logos de proporções diferentes ocupam a mesma área', () => {
    const [a, b] = [2.5, 4.5]
    expect(area(a, larguraOtica(logo(a), 'md', 0.5))).toBeCloseTo(area(b, larguraOtica(logo(b), 'md', 0.5)), 6)
  })

  it('nunca passa da altura da caixa', () => {
    const largura = larguraOtica(logo(1), 'lg', 0.3)
    expect(largura).toBeCloseTo(0.3, 6) // quadrado numa caixa baixa: a altura manda
  })

  it('o tamanho do cadastro ajusta a área', () => {
    const [sm, md, lg] = (['sm', 'md', 'lg'] as const).map((e) => larguraOtica(logo(3), e, 0.5))
    expect(sm).toBeLessThan(md)
    expect(md).toBeLessThan(lg)
  })
})
