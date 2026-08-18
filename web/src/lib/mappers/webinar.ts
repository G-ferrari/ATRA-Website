import type { Webinar as Doc } from '@/payload-types'
import type { Webinar } from '@/types/content'

import { toImage, toTextos } from './shared'

export function toWebinar(doc: Doc): Webinar {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    image: toImage(doc.coverImage, 'webinars.coverImage'),
    tags: toTextos(doc.tags, 'name'),
    dateLabel: doc.dateLabel,
    duration: doc.duration ?? '45:00',
    videoUrl: doc.videoUrl ?? null,
  }
}
