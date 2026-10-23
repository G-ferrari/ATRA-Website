import { describe, expect, it } from 'vitest'

import type { Footer } from '@/payload-types'

import { toRodape } from './site'

const rodape = (links: { label: string; href?: string | null }[]): Footer =>
  ({
    id: 1,
    about: 'A ATRA.',
    copyright: '© ATRA',
    columns: [{ id: 'c1', title: 'Empresa', kind: 'links', links: links.map((l, i) => ({ id: `l${i}`, ...l })) }],
  }) as Footer

describe('toRodape', () => {
  /* #210: o admin guarda `/sobre`, um só para os dois idiomas. O prefixo
     entrava no componente, e o `proxy.ts` traduzia com um 308 a cada clique. */
  it('no inglês, o destino sai com o idioma e o caminho traduzido', () => {
    const r = toRodape(
      rodape([
        { label: 'Sobre', href: '/sobre' },
        { label: 'Google Cloud', href: '/parceiros/google-cloud' },
        { label: 'Políticas', href: '/politicas-e-termos' },
        { label: 'Blog', href: '/blog' },
      ]),
      'en',
    )
    expect(r.colunas[0].links.map((l) => l.href)).toEqual([
      '/en/about',
      '/en/partners/google-cloud',
      '/en/privacy-and-terms',
      '/en/blog',
    ])
  })

  it('no português, o destino é o que o admin guardou', () => {
    const r = toRodape(rodape([{ label: 'Sobre', href: '/sobre' }]), 'pt')
    expect(r.colunas[0].links[0].href).toBe('/sobre')
  })

  it('vazio vira null, e "#" ou endereço externo passam intactos', () => {
    const r = toRodape(
      rodape([
        { label: 'Vazio', href: '' },
        { label: 'Nada', href: '#' },
        { label: 'ERP', href: 'https://erp.atra.com.br/' },
      ]),
      'en',
    )
    expect(r.colunas[0].links.map((l) => l.href)).toEqual([null, '#', 'https://erp.atra.com.br/'])
  })
})
