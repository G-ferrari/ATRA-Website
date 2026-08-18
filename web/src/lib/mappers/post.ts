import type { Post as Doc } from '@/payload-types'
import type { PostCard } from '@/types/content'

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
