import type { Webinar as Doc } from '@/payload-types'
import type { Webinar } from '@/types/content'

import { toSeo } from './seo'
import { toImage, toTextos } from './shared'

export function toWebinar(doc: Doc): Webinar {
  const image = toImage(doc.coverImage, 'webinars.coverImage')
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    image,
    tags: toTextos(doc.tags, 'name'),
    dateLabel: doc.dateLabel,
    duration: doc.duration ?? '45:00',
    videoUrl: doc.videoUrl ?? null,
    seo: toSeo(doc.seo, { titulo: doc.title, descricao: doc.description, imagem: image }),
  }
}
