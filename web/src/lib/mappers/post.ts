import type { Post as Doc } from '@/payload-types'
import type { PostCard, PostDetail } from '@/types/content'

import { toImage, toTextos } from './shared'

export function toPostCard(doc: Doc): PostCard {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    image: toImage(doc.coverImage, 'posts.coverImage'),
    tags: toTextos(doc.tags, 'name'),
    publishedAt: doc.publishedAt,
  }
}

export function toPostDetail(doc: Doc): PostDetail {
  return {
    ...toPostCard(doc),
    body: doc.body ?? null,
  }
}
