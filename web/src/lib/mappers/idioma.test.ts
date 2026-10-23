import { describe, expect, it } from 'vitest'

import { hrefDe } from '../routes'

import { toGruposDeSolucoes } from './navigation'
import { slugNoIdioma, soOsQueExistemNoIdioma } from './idioma'

/* Task #52 (decisão de 23/10): no inglês, o que não existe no inglês não é
 * listado. A regra é a do catálogo da ATRA AI — slug gravado no idioma, lido
 * sem fallback —, agora num lugar só para ele, o menu e os índices. */

describe('slugNoIdioma', () => {
  it('em português, o slug português', () => {
    expect(slugNoIdioma({ pt: { slug: 'privacidade' } }, 'pt')).toBe('privacidade')
  })

  it('em inglês, só o slug gravado no inglês', () => {
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: { slug: 'privacy' } }, 'en')).toBe('privacy')
    /* Criada no admin só em português: a consulta sem fallback não devolve slug. */
    expect(slugNoIdioma({ pt: { slug: 'privacidade' } }, 'en')).toBeNull()
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: null }, 'en')).toBeNull()
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: { slug: null } }, 'en')).toBeNull()
    expect(slugNoIdioma({ pt: { slug: 'privacidade' }, en: { slug: '  ' } }, 'en')).toBeNull()
  })
})

/* Como as duas consultas chegam: a da listagem, com fallback (o slug português
   aparece emprestado no inglês), e a sem fallback, só com o slug. */
const SOLUCOES = [
  { id: 1, slug: 'analytics-conversacional', title: 'Analytics Conversacional', category: 'innovation-ai' as const },
  { id: 2, slug: 'privacidade', title: 'Privacidade & LGPD', category: 'governance-culture' as const },
  { id: 3, slug: 'master-data-management', title: 'Master Data Management', category: 'data-bi' as const },
]
const SEM_FALLBACK_EN = [
  { id: 1, slug: 'analytics-conversacional' },
  { id: 2, slug: null },
  /* A 3 nem volta: o Payload devolve o documento, mas sem nada no idioma. */
]

describe('soOsQueExistemNoIdioma', () => {
  it('solução sem tradução some do inglês', () => {
    expect(soOsQueExistemNoIdioma(SOLUCOES, SEM_FALLBACK_EN, 'en').map((s) => s.id)).toEqual([1])
  })

  it('e continua no português', () => {
    expect(soOsQueExistemNoIdioma(SOLUCOES, [], 'pt').map((s) => s.id)).toEqual([1, 2, 3])
  })

  it('aparece sozinha quando ganha o slug em inglês (a tradução no admin)', () => {
    const traduzida = [...SEM_FALLBACK_EN, { id: 3, slug: 'master-data-management-en' }]
    expect(soOsQueExistemNoIdioma(SOLUCOES, traduzida, 'en').map((s) => s.id)).toEqual([1, 3])
  })

  it('mantém a ordem da listagem, não a da consulta sem fallback', () => {
    const foraDeOrdem = [
      { id: 3, slug: 'mdm' },
      { id: 1, slug: 'analytics-conversacional' },
    ]
    expect(soOsQueExistemNoIdioma(SOLUCOES, foraDeOrdem, 'en').map((s) => s.id)).toEqual([1, 3])
  })
})

describe('no menu de Soluções', () => {
  const doMenu = (docs: typeof SOLUCOES, locale: 'pt' | 'en') =>
    toGruposDeSolucoes(
      docs.map((d) => ({ ...d, icon: 'sparkles', shortDescription: 'Uma frase.', hasPage: true, badge: null })),
      locale,
      (slug) => hrefDe('solucoes', locale, slug),
    ).flatMap((g) => g.items.map((i) => i.href))

  it('no inglês, nenhum link para endereço que não existe no inglês', () => {
    expect(doMenu(soOsQueExistemNoIdioma(SOLUCOES, SEM_FALLBACK_EN, 'en'), 'en')).toEqual([
      '/en/solutions/analytics-conversacional',
    ])
  })

  it('no português, as três', () => {
    expect(doMenu(soOsQueExistemNoIdioma(SOLUCOES, [], 'pt'), 'pt')).toEqual([
      '/solucoes/analytics-conversacional',
      '/solucoes/master-data-management',
      '/solucoes/privacidade',
    ])
  })
})
