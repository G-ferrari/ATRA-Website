import type { Resource as Doc } from '@/payload-types'
import type { Resource } from '@/types/content'

import { toImage, toTextos } from './shared'

export function toResource(doc: Doc): Resource {
  return {
    slug: doc.slug,
    kind: doc.kind,
    title: doc.title,
    description: doc.description,
    image: toImage(doc.coverImage, 'resources.coverImage'),
    tags: toTextos(doc.tags, 'name'),
    pages: doc.pages ?? null,
    publishedAt: doc.publishedAt,
  }
}

/** Data por extenso, como o legado escreve nos cards ("10 de janeiro de 2026"). */
export function dataPorExtenso(iso: string, locale: 'pt' | 'en'): string {
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
