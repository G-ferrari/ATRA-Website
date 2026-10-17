import type { ConteudoRecomendavel } from '@/types/content'

import { comCache } from './cache-do-catalogo-da-ia'
import { lerDiagnosticoDeMaturidade } from './diagnostico'
import type { Locale } from './locales'
import {
  deArtigo,
  deCase,
  deEbook,
  dePagina,
  deSegmento,
  deSolucao,
  deWebinar,
  doDiagnostico,
  type Par,
} from './mappers/catalogo-da-ia'
import { getPayload } from './payload'

/* O catálogo da ATRA AI (D-60): tudo o que está **publicado** e tem endereço,
 * no formato que o assistente recebe a cada conversa.
 *
 * Antes disto o modelo só conhecia o texto fixo do admin: inventava o nome do
 * que recomendava e o cartão não levava a lugar nenhum. Agora ele escolhe um
 * item daqui pelo código, e o servidor devolve título, resumo e endereço — o
 * modelo não escreve endereço.
 *
 * ⚠️ Toda consulta escreve o filtro de publicado (a Local API roda com
 * `overrideAccess: true`) e usa `select`: sem ele, soluções, segmentos e páginas
 * custam um JOIN por tipo de bloco, e esta leitura acontece dentro de uma
 * resposta de chat.
 *
 * ⚠️ Não filtra página magra como o sitemap faz (segmento sem `layout`, artigo
 * sem corpo): conferir exigiria carregar os blocos e o corpo dos 213 artigos.
 * O endereço existe e responde; o que falta ali é conteúdo, e isso é do CMS. */

const PUBLICADO = { _status: { equals: 'published' as const } }

/* Teto de artigos na lista que o modelo lê, dos mais recentes para trás. Cada
 * título custa ~15 tokens em toda mensagem; quando o blog passar disto, a saída
 * é busca por assunto, não lista maior. */
export const MAX_ARTIGOS = 400

type Idioma = { locale: Locale; fallbackLocale?: false }

/** O português sempre; o inglês, sem fallback, só quando a conversa é em inglês. */
async function nosDoisIdiomas<T extends { id: number | string }>(
  locale: Locale,
  buscar: (idioma: Idioma) => Promise<{ docs: T[] }>,
): Promise<Par<T>[]> {
  if (locale === 'pt') return (await buscar({ locale: 'pt' })).docs.map((doc) => ({ pt: doc }))

  /* ⚠️ `fallbackLocale: false` é o que deixa ver se o slug em inglês **existe**:
     com o fallback, o inglês devolveria o slug português, e o endereço montado
     com ele responderia 404. */
  const [pt, en] = await Promise.all([buscar({ locale: 'pt' }), buscar({ locale: 'en', fallbackLocale: false })])
  const ingles = new Map(en.docs.map((doc) => [doc.id, doc]))
  return pt.docs.map((doc) => ({ pt: doc, en: ingles.get(doc.id) }))
}

async function montar(locale: Locale): Promise<ConteudoRecomendavel[]> {
  const payload = await getPayload()
  const comum = { depth: 0, where: PUBLICADO } as const

  const [solucoes, segmentos, cases, webinars, ebooks, artigos, paginas, diagnostico] = await Promise.all([
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'solutions',
        ...comum,
        ...idioma,
        limit: 200,
        sort: 'order',
        select: { title: true, slug: true, shortDescription: true, hasPage: true },
      }),
    ),
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'segments',
        ...comum,
        ...idioma,
        limit: 100,
        sort: 'order',
        select: { name: true, slug: true, shortDescription: true },
      }),
    ),
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'cases',
        ...comum,
        ...idioma,
        limit: 200,
        sort: '-publishedAt',
        select: { title: true, slug: true, summary: true },
      }),
    ),
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'webinars',
        ...comum,
        ...idioma,
        limit: 100,
        sort: 'order',
        select: { title: true, slug: true, description: true },
      }),
    ),
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'resources',
        depth: 0,
        ...idioma,
        limit: 100,
        sort: '-publishedAt',
        where: { kind: { equals: 'ebook' }, ...PUBLICADO },
        select: { title: true, slug: true, description: true },
      }),
    ),
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'posts',
        ...comum,
        ...idioma,
        limit: MAX_ARTIGOS,
        sort: '-publishedAt',
        select: { title: true, slug: true, description: true },
      }),
    ),
    nosDoisIdiomas(locale, (idioma) =>
      payload.find({
        collection: 'pages',
        ...comum,
        ...idioma,
        limit: 100,
        select: { title: true, slug: true, masterOf: true, seo: { metaDescription: true } },
      }),
    ),
    lerDiagnosticoDeMaturidade(locale),
  ])

  const itens: (ConteudoRecomendavel | null)[] = [
    ...solucoes.map((par) => deSolucao(par, locale)),
    ...segmentos.map((par) => deSegmento(par, locale)),
    ...cases.map((par) => deCase(par, locale)),
    ...webinars.map((par) => deWebinar(par, locale)),
    ...ebooks.map((par) => deEbook(par, locale)),
    ...paginas.map((par) => dePagina(par, locale)),
    doDiagnostico({ titulo: diagnostico.titulo, resumo: diagnostico.abertura }, locale),
    ...artigos.map((par) => deArtigo(par, locale)),
  ]

  /* Código repetido só acontece com duas páginas marcadas para a mesma seção —
     o admin não deixa, mas o cartão não pode depender disso: vale a primeira. */
  const vistos = new Set<string>()
  return itens.filter((item): item is ConteudoRecomendavel => {
    if (!item || vistos.has(item.codigo)) return false
    vistos.add(item.codigo)
    return true
  })
}

/** O catálogo do idioma, do cache quando houver (`cache-do-catalogo-da-ia.ts`). */
export function lerCatalogoDaIa(locale: Locale): Promise<ConteudoRecomendavel[]> {
  return comCache(locale, () => montar(locale))
}
