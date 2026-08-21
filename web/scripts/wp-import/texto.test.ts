/* Teste do que MIG-083 decide sozinho: encurtar o resumo e decodificar o que o
   WordPress entrega com entidade HTML. */
import { describe, expect, it } from 'vitest'

import { decodificar, encurtar, textoPuro } from './texto'

describe('encurtar', () => {
  it('não mexe no que já cabe', () => {
    expect(encurtar('Resumo curto.')).toBe('Resumo curto.')
  })

  it('corta no espaço, sem partir palavra, e cabe no limite do campo', () => {
    const r = encurtar(`${'palavra '.repeat(40)}fim`)
    expect(r.length).toBeLessThanOrEqual(220)
    expect(r.endsWith('…')).toBe(true)
    expect(r).not.toMatch(/pala…$/)
  })

  /* O WP fecha o resumo automático com "[…]"; repetir a reticência sairia
     "texto […]…" no cartão. */
  it('descarta a reticência que o WordPress já pôs', () => {
    expect(encurtar('Um resumo curto […]')).toBe('Um resumo curto')
    expect(encurtar('Outro resumo…')).toBe('Outro resumo')
  })

  it('não deixa pontuação solta antes da reticência', () => {
    expect(encurtar('a'.repeat(200) + ' meio, ' + 'b'.repeat(60))).toMatch(/[^,;:.\s]…$/)
  })

  /* Palavra única gigante não tem espaço onde cortar: corta seco, mas não
     estoura o campo — que era o único jeito de a gravação falhar. */
  it('respeita o limite mesmo sem espaço para cortar', () => {
    expect(encurtar('x'.repeat(500)).length).toBeLessThanOrEqual(220)
  })
})

describe('decodificar / textoPuro', () => {
  it('resolve as entidades do WordPress', () => {
    expect(decodificar('IA &#8211; o que muda &#8217;24')).toBe('IA – o que muda ’24')
    expect(decodificar('Dados &amp; Cloud')).toBe('Dados & Cloud')
  })

  it('tira a marcação do resumo e normaliza o espaço', () => {
    expect(textoPuro('<p>Um <strong>resumo</strong>\n  com marcação &amp; entidade</p>')).toBe(
      'Um resumo com marcação & entidade',
    )
  })
})
