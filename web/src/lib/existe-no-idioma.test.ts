import { describe, expect, it } from 'vitest'

import { ondeExisteNoIdioma } from './existe-no-idioma'

/* D-69 (task #52): no inglês, listagem só com o que tem slug em inglês. O corte
 * vai no `where` porque condição sobre campo localizado bate na coluna do
 * idioma pedido, sem fallback — conferido contra o Postgres em 23/10: em `en`,
 * com o fallback ligado, `slug exists` tira o documento que só tem português e
 * mantém o slug emprestado fora da lista. */

const PUBLICADO = { _status: { equals: 'published' } }
const CORTE = { slug: { exists: true } }

describe('ondeExisteNoIdioma', () => {
  it('em português, o filtro volta como veio', () => {
    expect(ondeExisteNoIdioma('pt', PUBLICADO)).toBe(PUBLICADO)
    expect(ondeExisteNoIdioma('pt')).toBeUndefined()
  })

  it('no inglês, soma o slug gravado no inglês ao filtro da listagem', () => {
    expect(ondeExisteNoIdioma('en', PUBLICADO)).toEqual({ and: [PUBLICADO, CORTE] })
  })

  it('no inglês sem filtro (rascunho, parceiros), fica só o corte', () => {
    expect(ondeExisteNoIdioma('en')).toEqual(CORTE)
    expect(ondeExisteNoIdioma('en', {})).toEqual(CORTE)
  })

  it('não mexe no filtro recebido', () => {
    const filtro = { kind: { equals: 'ebook' } }
    ondeExisteNoIdioma('en', filtro)
    expect(filtro).toEqual({ kind: { equals: 'ebook' } })
  })
})
