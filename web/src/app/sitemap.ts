import type { MetadataRoute } from 'next'

import { ehSecaoMestra } from '@/lib/paginas-mestras'
import { getPayload } from '@/lib/payload'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/locales'
import { paraSitemap, versoesDe, type Entrada } from '@/lib/sitemap'

/* MIG-106 — `/sitemap.xml`.
 *
 * ⚠️ Fica na **raiz de `app/`**, fora do grupo `(frontend)`, porque não vive
 * sob `[locale]`: é um arquivo só, listando todos os idiomas. O `proxy.ts` não o
 * intercepta — o matcher dele já exclui caminho com ponto.
 *
 * O que entra:
 *  - só publicado. A Local API roda com `overrideAccess: true`, então o
 *    `access.read` que esconde rascunho **não se aplica** e o filtro de status
 *    é escrito em cada consulta;
 *  - só o que tem corpo. Página magra sai do índice por D-08, e anunciá-la aqui
 *    contradiz o `robots` que a própria página manda;
 *  - inglês e espanhol só onde há tradução de verdade e slug gravado no
 *    idioma, que dá o endereço — ver `versoesDe`.
 */

/** Revalida a cada hora: publicar um artigo não deve exigir deploy. */
export const revalidate = 3600

const PUBLICADO = { _status: { equals: 'published' } } as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()

  /* Genérico sobre o slug da collection, e não uma união: com a união o tipo do
   * documento vira a interseção de todas, e `doc.body` deixa de existir porque
   * `Case` não tem corpo. */
  const emTodosOsIdiomas = async <T extends 'posts' | 'cases' | 'jobs' | 'segments' | 'solutions'>(collection: T) => {
    const comum = { collection, limit: 1000, depth: 0, where: PUBLICADO } as const
    /* ⚠️ `fallbackLocale: false` é o que torna a comparação honesta: com o
     * fallback ligado, o outro idioma devolve o português e todo documento
     * pareceria traduzido. */
    const [pt, ...outros] = await Promise.all(
      LOCALES.map((locale) =>
        payload.find({ ...comum, locale, ...(locale !== DEFAULT_LOCALE && { fallbackLocale: false as const }) }),
      ),
    )
    const porIdioma = outros.map((r, i) => [LOCALES[i + 1], new Map(r.docs.map((d) => [d.id, d]))] as const)
    return pt.docs.map((doc) => ({
      doc,
      /** O mesmo documento em cada um dos outros idiomas, sem fallback. */
      em: Object.fromEntries(porIdioma.map(([l, m]) => [l, m.get(doc.id)])) as Partial<Record<Locale, typeof doc>>,
    }))
  }

  /* As versões de um item, comparando o campo de texto de cada idioma. */
  const versoes = <D extends { slug: string }>(doc: D, em: Partial<Record<Locale, D>>, texto: (d: D) => string | null | undefined) =>
    versoesDe({
      pt: { slug: doc.slug, texto: texto(doc) },
      ...Object.fromEntries(
        Object.entries(em).map(([l, d]) => [l, d && { slug: d.slug, texto: texto(d) }]),
      ),
    })

  const [posts, cases, vagas, segmentos, solucoes, paginas] = await Promise.all([
    emTodosOsIdiomas('posts'),
    emTodosOsIdiomas('cases'),
    emTodosOsIdiomas('jobs'),
    emTodosOsIdiomas('segments'),
    emTodosOsIdiomas('solutions'),
    /* `select`: sem ele a consulta a `pages` faz um JOIN por tipo de bloco. */
    payload.find({
      collection: 'pages',
      limit: 100,
      depth: 0,
      locale: 'pt',
      where: PUBLICADO,
      select: { slug: true, masterOf: true },
    }),
  ])

  /* Índices e páginas de rota: o texto **deles** é traduzido — título, descrição
   * e toda a interface vêm do código, nos dois idiomas. Que a lista abaixo
   * mostre conteúdo em português é outra coisa, e é P-08. */
  const indices: Entrada[] = [
    { local: { caminho: '/' }, prioridade: 1 },
    { local: { secao: 'solucoes' }, prioridade: 0.8 },
    { local: { secao: 'segmentos' }, prioridade: 0.8 },
    { local: { secao: 'cases' }, prioridade: 0.8 },
    { local: { secao: 'blog' }, prioridade: 0.7 },
    { local: { secao: 'insights' }, prioridade: 0.7 },
    { local: { secao: 'consultores' }, prioridade: 0.7 },
    { local: { secao: 'carreiras' }, prioridade: 0.7 },
    { local: { secao: 'sobre' }, prioridade: 0.7 },
    { local: { secao: 'contato' }, prioridade: 0.6 },
    // `/glossario` fora do ar (D-36): responde 404 e não entra no sitemap.
    { local: { secao: 'midia' }, prioridade: 0.5 },
    { local: { secao: 'ebooks' }, prioridade: 0.5 },
    { local: { secao: 'webinars' }, prioridade: 0.5 },
    { local: { secao: 'politicas' }, prioridade: 0.3 },
  ]

  const entradas: Entrada[] = [
    ...indices,
    ...posts
      /* D-08: artigo sem corpo é invisível para busca, e o sitemap não pode
       * contradizer o `robots` que a página manda. */
      .filter(({ doc }) => doc.body)
      .map(({ doc, em }) => ({
        local: { secao: 'blog' as const, slug: doc.slug },
        atualizadoEm: doc.updatedAt,
        prioridade: 0.6,
        versoes: versoes(doc, em, (d) => d.title),
      })),
    ...cases.map(({ doc, em }) => ({
      local: { secao: 'cases' as const, slug: doc.slug },
      atualizadoEm: doc.updatedAt,
      prioridade: 0.7,
      versoes: versoes(doc, em, (d) => d.title),
    })),
    ...vagas.filter(({ doc }) => doc.body).map(({ doc, em }) => ({
      local: { secao: 'carreiras' as const, slug: doc.slug },
      atualizadoEm: doc.updatedAt,
      prioridade: 0.6,
      versoes: versoes(doc, em, (d) => d.title),
    })),
    ...segmentos.filter(({ doc }) => doc.layout?.length).map(({ doc, em }) => ({
      local: { secao: 'segmentos' as const, slug: doc.slug },
      atualizadoEm: doc.updatedAt,
      prioridade: 0.7,
      versoes: versoes(doc, em, (d) => d.name),
    })),
    /* Só solução com página: as outras aparecem no índice e no menu, mas não
     * têm URL (D-09). */
    ...solucoes.filter(({ doc }) => doc.hasPage).map(({ doc, em }) => ({
      local: { secao: 'solucoes' as const, slug: doc.slug },
      atualizadoEm: doc.updatedAt,
      prioridade: 0.7,
      versoes: versoes(doc, em, (d) => d.title),
    })),
  ]

  /* As `pages` já estão nos índices acima, cada uma com a sua rota própria — a
   * consulta serve só para não anunciar rota cuja página foi despublicada. */
  const publicadas = new Set(paginas.docs.map((d) => d.slug))
  const rotaDePagina: Partial<Record<string, string>> = {
    sobre: 'sobre',
    contato: 'contato',
    politicas: 'politicas-e-termos',
  }
  /* As seções com página-mestra (D-55): o índice delas responde 404 quando a
     página é despublicada, e o sitemap não pode continuar a anunciá-lo. A
     marca é da seção, não do slug. */
  const mestrasPublicadas = new Set(paginas.docs.map((d) => d.masterOf).filter(Boolean))

  return paraSitemap(
    entradas.filter((e) => {
      if (!('secao' in e.local)) return true
      if (e.local.slug !== undefined) return true
      if (ehSecaoMestra(e.local.secao)) return mestrasPublicadas.has(e.local.secao)
      const slug = rotaDePagina[e.local.secao]
      return slug === undefined || publicadas.has(slug)
    }),
  )
}
