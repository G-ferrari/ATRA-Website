import type { Press as Doc } from '@/payload-types'
import type { MateriaDaImprensa } from '@/types/content'

import { toImage } from './shared'

export function toMateriaDaImprensa(doc: Doc): MateriaDaImprensa {
  return {
    id: String(doc.id),
    title: doc.title,
    outlet: doc.outlet,
    description: doc.description,
    url: doc.url,
    image: toImage(doc.coverImage, 'press.coverImage'),
    kind: doc.kind === 'video' ? 'video' : 'article',
    publishedAt: doc.publishedAt ?? null,
  }
}
