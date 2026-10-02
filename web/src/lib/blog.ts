import { cache } from 'react'

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
 * `cache()` por requisição: `generateMetadata` e a página pedem a mesma lista. */
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
    ...(rascunho ? {} : { where: { _status: { equals: 'published' } } }),
    select: { title: true, slug: true, description: true, coverImage: true, tags: true, publishedAt: true },
  })
  return docs.map(toPostCard)
})

/** Quantos artigos publicados há — para saber quantas páginas pré-montar. */
export async function contarPostsPublicados(locale: Locale): Promise<number> {
  const payload = await getPayload()
  const { totalDocs } = await payload.count({ collection: 'posts', locale, where: { _status: { equals: 'published' } } })
  return totalDocs
}
