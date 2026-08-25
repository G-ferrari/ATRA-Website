import type { Resource as Doc } from '@/payload-types'
import type { Resource, ResourceDetail } from '@/types/content'

import { toImage, toTextos } from './shared'
import { toSeo } from './seo'

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

export function toResourceDetail(doc: Doc): ResourceDetail {
  const base = toResource(doc)
  return {
    ...base,
    body: doc.body ?? null,
    id: doc.id,
    /* `file` populado (depth ≥ 1) ou só id — os dois contam como "tem". */
    temDownload: Boolean(doc.file),
    seo: toSeo(doc.seo, { titulo: base.title, descricao: base.description, imagem: base.image }),
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
