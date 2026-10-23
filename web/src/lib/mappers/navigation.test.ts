import { describe, expect, it } from 'vitest'

import type { Navigation } from '@/payload-types'

import { toCategorias } from './navigation'

const menu = (categorias: Record<string, unknown>[]): Navigation =>
  ({ id: 1, categories: categorias.map((c, i) => ({ id: `c${i}`, panel: 'links', links: [], ...c })) }) as unknown as Navigation

describe('toCategorias', () => {
  /* #210: o destino da categoria é guardado sem o idioma e ganhava o prefixo
     no componente; o `proxy.ts` traduzia com um 308 a cada clique. */
  it('no inglês, o destino da categoria sai com o idioma e o caminho traduzido', () => {
    const [sobre, insights, solucoes] = toCategorias(
      menu([
        { label: 'About', href: '/sobre' },
        { label: 'Insights', href: '/insights' },
        { label: 'Solutions', href: '   ', panel: 'solutions' },
      ]),
      'en',
    )
    expect(sobre.href).toBe('/en/about')
    expect(insights.href).toBe('/en/insights')
    // Vazio: a categoria só abre o painel.
    expect(solucoes.href).toBeNull()
  })

  it('no português, o destino da categoria é o que o admin guardou', () => {
    expect(toCategorias(menu([{ label: 'Sobre', href: '/sobre' }]), 'pt')[0].href).toBe('/sobre')
  })

  /* Os atalhos e o cartão sempre foram como estão escritos: só `/en/<português>`
     é traduzido, e o português sem `/en` fica (D-22). */
  it('atalhos e cartão: traduz /en/<português> e deixa o resto como está', () => {
    const [c] = toCategorias(
      menu([
        {
          label: 'Insights',
          href: '/insights',
          links: [
            { id: 'a', icon: 'x', label: 'Cases', description: 'd', href: '/en/cases-de-sucesso' },
            { id: 'b', icon: 'x', label: 'Blog', description: 'd', href: '/blog' },
          ],
          card: { title: 'Carreiras', href: '/en/carreiras#vagas' },
        },
      ]),
      'en',
    )
    expect(c.links.map((l) => l.href)).toEqual(['/en/success-stories', '/blog'])
    expect(c.card?.href).toBe('/en/careers#vagas')
  })
})
