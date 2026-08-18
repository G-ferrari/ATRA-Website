import { draftMode } from 'next/headers'

import type { Locale } from './locales'
import { toResource } from './mappers/resource'
import { getPayload } from './payload'
import type { Resource } from '@/types/content'

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
