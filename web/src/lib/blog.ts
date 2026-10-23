import { cache } from 'react'

import { ondeExisteNoIdioma } from './existe-no-idioma'
import type { Locale } from './locales'
import { toPostCard } from './mappers/post'
import { getPayload } from './payload'
import type { PostCard } from '@/types/content'

/* Os artigos do blog, **todos**, do mais novo para o mais antigo (D-47).
 *
 * ⚠️ Até 02/10 a listagem pedia `limit: 100`, e o WordPress trouxe 207: os 107
 * anteriores a maio de 2025 não apareciam nem na lista nem na busca, que filtra
 * o que a página carregou. A ilha recebe a lista inteira — é ela que faz a busca
 * valer para todos — e mostra 12 por vez (`lib/paginacao.ts`).
 *
 * ⚠️ `select` não é otimização prematura: sem ele a consulta traz o `body` de
 * cada artigo — JSONB de artigo de blog, não um campo curto — só para desenhar
 * cartão. Medido depois da importação: 536ms sem `select`, 68ms com, para 100.
 *
 * `cache()` por requisição: `generateMetadata` e a página pedem a mesma lista.
 *
 * No inglês, só o artigo que tem slug em inglês (D-69): o que foi publicado só
 * em português daria link para 404. */
const PUBLICADO = { _status: { equals: 'published' as const } }

export const buscarPostsDoBlog = cache(async (locale: Locale, rascunho: boolean): Promise<PostCard[]> => {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    pagination: false,
    sort: '-publishedAt',
    draft: rascunho,
    /* Fora do modo rascunho, só publicado — a Local API ignora `access.read`. */
    where: ondeExisteNoIdioma(locale, rascunho ? undefined : PUBLICADO),
    select: { title: true, slug: true, description: true, coverImage: true, tags: true, publishedAt: true },
  })
  return docs.map(toPostCard)
})

/** Quantos artigos publicados há no idioma — para saber quantas páginas
 *  pré-montar. O mesmo corte da lista, ou o inglês montaria página vazia. */
export async function contarPostsPublicados(locale: Locale): Promise<number> {
  const payload = await getPayload()
  const { totalDocs } = await payload.count({ collection: 'posts', locale, where: ondeExisteNoIdioma(locale, PUBLICADO) })
  return totalDocs
}
