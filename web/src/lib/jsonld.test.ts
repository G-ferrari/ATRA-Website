import { describe, expect, it } from 'vitest'

import { artigo, ID_DA_ORGANIZACAO, organizacao, servico } from './jsonld'
import type { Contato, Seo } from '@/types/content'

const contato: Contato = {
  telefone: '+55 11 96305-2391',
  telefoneComDdd: '+55 (11) 96305-2391',
  whatsapp: 'https://wa.me/5511963052391',
  email: 'negocios@atra.com.br',
  endereco: 'Av. Queiroz Filho, 1700 – SP',
  redes: { linkedin: 'https://linkedin.com/company/atra', instagram: null, facebook: 'https://facebook.com/atra', youtube: 'https://youtube.com/@atra' },
  destinos: { contato: null, consultores: null, diagnostico: null, carreiras: null, chat: null },
}
const seo: Seo = { title: 'Título', description: 'Resumo', image: { url: '/capa.webp', alt: 'a', width: 1200, height: 630 }, noIndex: false }

describe('organizacao', () => {
  const o = organizacao({ contato, logo: { url: '/logo.webp', alt: 'ATRA', width: 2048, height: 1134 }, fundadaEm: 2011 })

  it('declara o essencial que o Rich Results exige', () => {
    expect(o['@type']).toBe('Organization')
    expect(o['@id']).toBe(ID_DA_ORGANIZACAO)
    expect(o.name).toBe('ATRA')
    expect((o.logo as Record<string, unknown>).url).toBe('http://localhost:3000/logo.webp')
  })

  /* `null` viraria a string "null" no JSON e o Google trataria como perfil. */
  it('só lista as redes que existem', () => {
    expect(o.sameAs).toEqual(['https://linkedin.com/company/atra', 'https://facebook.com/atra', 'https://youtube.com/@atra'])
  })

  it('omite logo e fundação quando não há', () => {
    const sem = organizacao({ contato, logo: null })
    expect(sem).not.toHaveProperty('logo')
    expect(sem).not.toHaveProperty('foundingDate')
  })
})

describe('artigo', () => {
  const a = artigo({ seo, url: 'http://localhost:3000/blog/x', publicadoEm: '2026-08-17' })

  it('aponta autor e publicador para a mesma organização', () => {
    expect(a.author).toEqual({ '@id': ID_DA_ORGANIZACAO })
    expect(a.publisher).toEqual({ '@id': ID_DA_ORGANIZACAO })
  })

  /* O Google recusa caminho relativo em `image`. */
  it('torna a imagem absoluta', () => {
    expect(a.image).toEqual(['http://localhost:3000/capa.webp'])
  })

  it('sem data de alteração, repete a de publicação', () => {
    expect(a.dateModified).toBe('2026-08-17')
    expect(artigo({ seo, url: 'u', publicadoEm: '2026-08-17', atualizadoEm: '2026-08-20' }).dateModified).toBe('2026-08-20')
  })
})

describe('servico', () => {
  it('declara a ATRA como prestadora', () => {
    const s = servico({ seo, url: 'http://localhost:3000/solucoes/x' })
    expect(s['@type']).toBe('Service')
    expect(s.provider).toEqual({ '@id': ID_DA_ORGANIZACAO })
  })
})
