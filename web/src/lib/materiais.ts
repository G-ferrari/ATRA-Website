import { draftMode } from 'next/headers'

import type { Locale } from './locales'
import { toResource, toResourceDetail } from './mappers/resource'
import { getPayload } from './payload'
import type { Resource, ResourceDetail } from '@/types/content'

/* Consulta compartilhada por /relatorios e /ebooks.
 *
 * As duas páginas leem a mesma collection filtrando por `kind`; a única
 * diferença é o layout do card. Ter isso num lugar só evita que as duas
 * divirjam em ordenação ou em tratamento de rascunho. */
export async function buscarMateriais(kind: Resource['kind'], locale: Locale): Promise<Resource[]> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'resources',
    locale,
    depth: 1, // popula coverImage; o mapper exige documento, não id
    limit: 100,
    sort: '-publishedAt',
    draft: rascunho,
    where: rascunho
      ? { kind: { equals: kind } }
      : { kind: { equals: kind }, _status: { equals: 'published' } },
  })

  return docs.map(toResource)
}

/** Um material pelo slug, respeitando o tipo da rota que o pediu. */
export async function buscarMaterial(
  kind: Resource['kind'],
  slug: string,
  locale: Locale,
): Promise<ResourceDetail | null> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'resources',
    locale,
    depth: 1,
    limit: 1,
    draft: rascunho,
    /* O tipo entra na consulta, não só na rota: sem isso `/ebooks/<slug-de-
     * relatorio>` responderia 200 e o mesmo material teria duas URLs. */
    where: rascunho
      ? { kind: { equals: kind }, slug: { equals: slug } }
      : { kind: { equals: kind }, slug: { equals: slug }, _status: { equals: 'published' } },
  })

  return docs[0] ? toResourceDetail(docs[0]) : null
}

/** Slugs publicados de um tipo, para `generateStaticParams`. */
export async function slugsDeMaterial(kind: Resource['kind'], locale: Locale): Promise<string[]> {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'resources',
    locale,
    depth: 0,
    limit: 500,
    where: { kind: { equals: kind }, _status: { equals: 'published' } },
  })
  return docs.map((d) => d.slug)
}
