import { describe, expect, it } from 'vitest'

import { slugNoIdioma } from './idioma'

/* D-69: o documento existe no idioma quando tem slug gravado nele. Esta é a
 * forma da regra para quem já tem os dois idiomas em mãos (o catálogo da ATRA
 * AI); as listagens a aplicam no banco, com `ondeExisteNoIdioma`. */

describe('slugNoIdioma', () => {
  it('em português, o slug português', () => {
    expect(slugNoIdioma({ pt: { slug: 'privacidade' } }, 'pt')).toBe('privacidade')
  })

  it('no inglês, o slug gravado no inglês', () => {
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: { slug: 'privacy' } }, 'en')).toBe('privacy')
  })

  it('criada no admin só em português: sem slug no inglês, não existe no inglês', () => {
    expect(slugNoIdioma({ pt: { slug: 'privacidade' } }, 'en')).toBeNull()
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: null }, 'en')).toBeNull()
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: { slug: null } }, 'en')).toBeNull()
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: { slug: '  ' } }, 'en')).toBeNull()
  })
})
