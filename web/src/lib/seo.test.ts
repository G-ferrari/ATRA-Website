import { describe, expect, it, vi } from 'vitest'

import { metadataDe, robotsDeCorpo } from './seo'
import { toSeo } from './mappers/seo'
import type { Seo } from '@/types/content'

const seo = (p: Partial<Seo> = {}): Seo => ({ title: 'Título', description: 'Resumo', image: null, noIndex: false, ...p })

describe('toSeo', () => {
  it('usa o que o editor escreveu', () => {
    const r = toSeo({ metaTitle: 'Do editor', metaDescription: 'Descrição do editor' }, { titulo: 'Da página' })
    expect(r.title).toBe('Do editor')
    expect(r.description).toBe('Descrição do editor')
  })

  it('cai para o título e o resumo da página quando o grupo está vazio', () => {
    expect(toSeo(null, { titulo: 'Da página', descricao: 'Resumo da página' })).toMatchObject({
      title: 'Da página',
      description: 'Resumo da página',
    })
  })

  /* Campo em branco não é "preenchido": o admin salva string vazia quando o
     editor entra no campo e sai, e sem o `trim` isso apagaria a descrição. */
  it('trata campo só com espaço como vazio', () => {
    expect(toSeo({ metaTitle: '   ', metaDescription: '' }, { titulo: 'Da página' }).title).toBe('Da página')
  })

  it('cai para a capa quando não há imagem de compartilhamento', () => {
    const capa = { url: '/capa.webp', alt: 'Capa', width: 1200, height: 630 }
    expect(toSeo(null, { titulo: 't', imagem: capa }).image).toBe(capa)
  })
})

describe('metadataDe', () => {
  const m = metadataDe({ locale: 'pt', local: { secao: 'sobre' }, seo: seo() })

  /* D-07 dá slug traduzido a cada rota: `/sobre` e `/en/about` são a mesma
     página em dois idiomas. Sem declarar o par, o Google trata uma como
     duplicata da outra — e a que ele escolhe não é a do idioma de quem busca. */
  it('declara as duas versões de idioma, com os slugs traduzidos', () => {
    expect(m.alternates?.languages).toEqual({
      'pt-BR': 'http://localhost:3000/sobre',
      en: 'http://localhost:3000/en/about',
      'x-default': 'http://localhost:3000/sobre',
    })
  })

  it('a canônica é absoluta e aponta para o idioma da página', () => {
    expect(m.alternates?.canonical).toBe('http://localhost:3000/sobre')
    expect(metadataDe({ locale: 'en', local: { secao: 'sobre' }, seo: seo() }).alternates?.canonical).toBe(
      'http://localhost:3000/en/about',
    )
  })

  it('monta a raiz sem barra sobrando', () => {
    const home = metadataDe({ locale: 'pt', local: { caminho: '/' }, seo: seo() })
    expect(home.alternates?.canonical).toBe('http://localhost:3000/')
    expect((home.alternates?.languages as Record<string, string>).en).toBe('http://localhost:3000/en')
  })

  it('leva título, descrição e imagem para o Open Graph', () => {
    const comImagem = metadataDe({
      locale: 'pt',
      local: { secao: 'blog', slug: 'x' },
      seo: seo({ image: { url: '/capa.webp', alt: 'Capa', width: 1200, height: 630 } }),
    })
    expect(comImagem.openGraph).toMatchObject({
      title: 'Título',
      description: 'Resumo',
      url: 'http://localhost:3000/blog/x',
      locale: 'pt_BR',
    })
    expect(comImagem.openGraph?.images).toEqual([
      { url: 'http://localhost:3000/capa.webp', alt: 'Capa', width: 1200, height: 630 },
    ])
  })

  /* ⚠️ A imagem de compartilhamento tem de sair com a origem **do site**. Caminho
     relativo o Next completa com `http://localhost:3000`, e foi isso que a
     homologação publicou em todo artigo e case até 02/10. O módulo lê a origem
     ao carregar, por isso o teste o recarrega com a variável trocada. */
  it('a imagem do Open Graph leva a origem do site, não localhost', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.atra.com.br/')
    vi.resetModules()
    try {
      const { metadataDe: comOrigem } = await import('./seo')
      const m = comOrigem({
        locale: 'pt',
        local: { secao: 'blog', slug: 'x' },
        seo: seo({ image: { url: '/api/media/file/capa.webp', alt: 'Capa', width: 1200, height: 630 } }),
      })
      expect(m.openGraph?.images).toEqual([
        { url: 'https://www.atra.com.br/api/media/file/capa.webp', alt: 'Capa', width: 1200, height: 630 },
      ])
      // Mídia que já vem com endereço completo (storage externo) fica como está.
      const externa = comOrigem({
        locale: 'pt',
        local: { secao: 'blog', slug: 'x' },
        seo: seo({ image: { url: 'https://cdn.exemplo.com/capa.webp', alt: 'Capa', width: 1200, height: 630 } }),
      })
      expect((externa.openGraph?.images as { url: string }[])[0].url).toBe('https://cdn.exemplo.com/capa.webp')
    } finally {
      vi.unstubAllEnvs()
      vi.resetModules()
    }
  })

  /* A caixa do editor é decisão explícita; corpo cheio é só o estado normal.
     Por isso `noIndex` vence, e não o contrário. */
  it('respeita o noIndex do editor mesmo com corpo escrito', () => {
    expect(metadataDe({ locale: 'pt', local: { secao: 'blog' }, seo: seo({ noIndex: true }), corpo: {} }).robots).toEqual(
      { index: false, follow: true },
    )
  })

  it('esconde página magra sem o editor pedir (D-08)', () => {
    expect(metadataDe({ locale: 'pt', local: { secao: 'blog' }, seo: seo(), corpo: null }).robots).toEqual({
      index: false,
      follow: true,
    })
  })

  it('indexa quando há corpo e ninguém marcou nada', () => {
    expect(metadataDe({ locale: 'pt', local: { secao: 'blog' }, seo: seo(), corpo: {} }).robots).toBeUndefined()
  })
})

describe('robotsDeCorpo', () => {
  it('deixa o robô seguir os links mesmo sem indexar', () => {
    expect(robotsDeCorpo(null)).toEqual({ index: false, follow: true })
    expect(robotsDeCorpo({})).toBeUndefined()
  })
})
