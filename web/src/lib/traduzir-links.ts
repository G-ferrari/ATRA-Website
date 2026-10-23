import type { CollectionSlug, Where } from 'payload'

import { itensCitados, linksDe, visitarLinks } from './links-no-idioma'
import { DEFAULT_LOCALE, type Locale } from './locales'
import { slugNoIdioma } from './mappers/idioma'
import { getPayload } from './payload'
import { linkNoIdioma, localizarHref, type SecaoComItem } from './routes'

/* O link português sem `/en` vai para o inglês quando a página existe no
 * inglês (D-71). Para seção e página inicial a resposta está na tabela de
 * rotas; para item, no banco — e é isto que este módulo pergunta, em lote.
 *
 * Existir no inglês é a regra da D-69: slug gravado no inglês, lido sem
 * fallback, e o mesmo filtro com que a rota do item abre (publicado, e
 * `hasPage` onde a rota exige). Com `locale: 'all'` o slug chega com os dois
 * idiomas crus, sem fallback, e a busca é pela coluna do português
 * (`slug.pt`): **uma consulta por collection**, com todos os itens citados. */

const PUBLICADO: Where = { _status: { equals: 'published' } }

const ITENS: Record<SecaoComItem, { collection: CollectionSlug; where: Where }> = {
  cases: { collection: 'cases', where: PUBLICADO },
  solucoes: { collection: 'solutions', where: { and: [PUBLICADO, { hasPage: { equals: true } }] } },
  // Parceiro não tem rascunho; a rota abre quem tem página.
  parceiros: { collection: 'partners', where: { hasPage: { equals: true } } },
  segmentos: { collection: 'segments', where: PUBLICADO },
  blog: { collection: 'posts', where: PUBLICADO },
  webinars: { collection: 'webinars', where: PUBLICADO },
  ebooks: { collection: 'resources', where: { and: [PUBLICADO, { kind: { equals: 'ebook' } }] } },
  carreiras: { collection: 'jobs', where: PUBLICADO },
}

const chave = (secao: SecaoComItem, slug: string) => `${secao}/${slug}`

/** Os slugs no idioma dos itens citados, uma consulta por seção. */
async function slugsNoIdioma(
  citados: Map<SecaoComItem, Set<string>>,
  locale: Locale,
): Promise<Map<string, string | null>> {
  const payload = await getPayload()
  const respostas = await Promise.all(
    [...citados].map(async ([secao, slugs]) => {
      const { collection, where } = ITENS[secao]
      try {
        const { docs } = await payload.find({
          collection,
          locale: 'all',
          depth: 0,
          pagination: false,
          // Só o slug: sem isto, collection com blocos faz um join por tipo de bloco.
          select: { slug: true },
          where: { and: [where, { [`slug.${DEFAULT_LOCALE}`]: { in: [...slugs] } }] },
        })
        return docs.map((doc) => {
          const slug = (doc as unknown as { slug?: Partial<Record<Locale, string | null>> }).slug ?? {}
          return [chave(secao, slug.pt ?? ''), slugNoIdioma({ pt: { slug: slug.pt }, en: { slug: slug.en } }, locale)] as const
        })
      } catch (e) {
        /* Sem a resposta, o link fica em português — que abre. Uma página
           fora do ar por causa de um link seria troca ruim. */
        console.error(`[links] não consultou ${collection}; os links para itens ficam em português:`, e)
        return []
      }
    }),
  )
  return new Map(respostas.flat())
}

/** A função que põe um link no idioma da página, com os itens de `hrefs` já
 *  consultados. No português não consulta nada. */
export async function tradutorDeLinks(hrefs: Iterable<string>, locale: Locale): Promise<(href: string) => string> {
  if (locale === DEFAULT_LOCALE) return localizarHref
  const citados = itensCitados(hrefs)
  const slugs = citados.size ? await slugsNoIdioma(citados, locale) : new Map<string, string | null>()
  return (href) => linkNoIdioma(href, locale, (secao, slug) => slugs.get(chave(secao, slug)) ?? null)
}

/** Põe no idioma da página, no lugar, todo destino de link do objeto —
 *  blocos, menu, rodapé. */
export async function comLinksNoIdioma<T>(alvo: T, locale: Locale): Promise<T> {
  const traduzir = await tradutorDeLinks(linksDe(alvo), locale)
  visitarLinks(alvo, traduzir)
  return alvo
}

/** Um link só — o "depois do envio" do formulário, na action. */
export async function traduzirLink(href: string, locale: Locale): Promise<string> {
  return (await tradutorDeLinks([href], locale))(href)
}
