import { describe, expect, it } from 'vitest'

import { ABAS_DE_SOLUCOES } from '../../lib/abas-de-solucoes'
import { ICONES } from '../../blocks/shared'

import { DESTINO_DAS_ANTIGAS, layoutEsqueleto, SLUG_MARCADOR, SLUGS_ANTIGOS, SOLUCOES_NOVAS } from './solucoes-estrutura'

/* A migração apaga 18 soluções e cria 18. O que este teste segura é a lista:
 * um endereço repetido, uma aba que não existe ou um destino que não foi criado
 * só apareceriam no deploy. */

const slugsNovos = SOLUCOES_NOVAS.map((s) => s.slug)

describe('SOLUCOES_NOVAS', () => {
  it('são 18, em 4 abas: 5, 6, 2 e 5', () => {
    expect(SOLUCOES_NOVAS).toHaveLength(18)
    expect(ABAS_DE_SOLUCOES.map((a) => SOLUCOES_NOVAS.filter((s) => s.aba === a.id).length)).toEqual([5, 6, 2, 5])
  })

  it('endereço único, só com letra minúscula, número e hífen', () => {
    expect(new Set(slugsNovos).size).toBe(slugsNovos.length)
    for (const slug of slugsNovos) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('todo ícone existe no registro', () => {
    for (const s of SOLUCOES_NOVAS) expect(ICONES, s.slug).toContain(s.icon)
  })

  it('título e descrição preenchidos, sem espaço sobrando', () => {
    for (const s of SOLUCOES_NOVAS) {
      for (const texto of [s.title, s.shortDescription]) {
        expect(texto.trim()).toBe(texto)
        expect(texto).not.toMatch(/\s{2,}|\s[.,]/)
        expect(texto.length).toBeGreaterThan(0)
      }
    }
  })

  it('só Analytics Conversacional tem selo, e é ela a marca da migração', () => {
    expect(SOLUCOES_NOVAS.filter((s) => s.badge).map((s) => [s.slug, s.badge])).toEqual([[SLUG_MARCADOR, 'Diferencial ATRA']])
  })
})

describe('DESTINO_DAS_ANTIGAS', () => {
  it('são as 18 antigas, e a RC18 não está entre elas', () => {
    expect(SLUGS_ANTIGOS).toHaveLength(18)
    expect(SLUGS_ANTIGOS).not.toContain('rc18')
  })

  it('todo destino é uma solução nova', () => {
    for (const [antigo, novo] of Object.entries(DESTINO_DAS_ANTIGAS)) expect(slugsNovos, antigo).toContain(novo)
  })
})

describe('layoutEsqueleto', () => {
  const solucao = SOLUCOES_NOVAS[0]

  it('é o topo, com o título e a frase da lista, e a faixa final padrão', () => {
    const [topo, fim] = layoutEsqueleto(solucao, 'IA & Analytics Avançada', 'pt')
    expect(topo).toMatchObject({ blockType: 'pageHero', badge: 'IA & Analytics Avançada', title: solucao.title, description: solucao.shortDescription })
    expect(fim).toMatchObject({ blockType: 'ctaBanner', variant: 'dark-centered', title: 'Entre em contato', cta: { label: 'Fale conosco', href: '/contato' } })
  })

  it('em inglês a faixa final é a traduzida, com os mesmos destinos', () => {
    const [, fim] = layoutEsqueleto(solucao, 'AI & Advanced Analytics', 'en')
    expect(fim).toMatchObject({ title: 'Get in touch', cta: { label: 'Contact us', href: '/contato' }, secondaryCta: { href: '/chat' } })
  })
})
