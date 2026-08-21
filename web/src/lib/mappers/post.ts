import type { Post as Doc } from '@/payload-types'
import type { PostCard, PostDetail } from '@/types/content'

import { toImage, toTextos } from './shared'

/* ⚠️ Pede só os campos do cartão, e não `Post` inteiro, para a página poder
 * consultar com `select`. Sem isto o tipo obriga a trazer o `body` de 100
 * artigos para desenhar uma listagem — ver a nota em `blog/page.tsx`. */
type CamposDeCartao = Pick<Doc, 'slug' | 'title' | 'description' | 'coverImage' | 'tags' | 'publishedAt'>

export function toPostCard(doc: CamposDeCartao): PostCard {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    image: toImage(doc.coverImage, 'posts.coverImage'),
    tags: toTextos(doc.tags, 'name'),
    publishedAt: doc.publishedAt,
  }
}

export function toPostDetail(doc: CamposDeCartao & Pick<Doc, 'body'>): PostDetail {
  return {
    ...toPostCard(doc),
    body: doc.body ?? null,
  }
}
