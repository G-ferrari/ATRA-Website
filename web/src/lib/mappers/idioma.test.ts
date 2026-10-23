import { describe, expect, it } from 'vitest'

import { parDeTodosOsIdiomas, slugNoIdioma } from './idioma'

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

/* O formato é o que o Payload devolveu na cópia do banco local em 23/10, com
 * `locale: 'all'` e `select`: só os idiomas gravados, sem fallback. */
describe('parDeTodosOsIdiomas', () => {
  it('separa o slug e o texto de cada idioma', () => {
    const doc = {
      id: 1,
      title: { pt: 'Gerando valor com Marketplace', en: 'Gerando valor com Marketplace' },
      slug: { pt: 'marketplace-governanca-dados', en: 'data-marketplace-governance' },
    }
    expect(parDeTodosOsIdiomas(doc, 'title')).toEqual({
      pt: { slug: 'marketplace-governanca-dados', texto: 'Gerando valor com Marketplace' },
      en: { slug: 'data-marketplace-governance', texto: 'Gerando valor com Marketplace' },
    })
  })

  /* Webinar criado no admin só em português: o inglês nem aparece no objeto. */
  it('idioma não gravado vira nulo, e não o português emprestado', () => {
    const doc = { id: 9, title: { pt: 'Tendências (cópia 4)' }, slug: { pt: 'teste-32-4' } }
    expect(parDeTodosOsIdiomas(doc, 'title').en).toEqual({ slug: null, texto: null })
  })

  it('campo não localizado vale para os dois idiomas', () => {
    const doc = { id: 1, name: 'Google Cloud', slug: { pt: 'google-cloud', en: 'google-cloud' } }
    const par = parDeTodosOsIdiomas(doc, 'name')
    expect([par.pt.texto, par.en?.texto]).toEqual(['Google Cloud', 'Google Cloud'])
  })
})
