import { describe, expect, it } from 'vitest'

import { respostaForaDoAssunto } from './fora-do-assunto'

describe('respostaForaDoAssunto', () => {
  it('o texto do admin vence; vazio, vale o padrão do idioma', () => {
    expect(respostaForaDoAssunto('Só falo da ATRA.', 'pt')).toBe('Só falo da ATRA.')
    expect(respostaForaDoAssunto('   ', 'pt')).toContain('assuntos da ATRA')
    expect(respostaForaDoAssunto(null, 'en')).toContain('only help with ATRA')
  })
})
