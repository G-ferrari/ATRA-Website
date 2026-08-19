import { draftMode } from 'next/headers'

import type { Locale } from './locales'
import { comVagas, toBlocos, toMetricas, toSelos } from './mappers/blocks'
import { toVaga } from './mappers/job'
import { getPayload } from './payload'
import type { Bloco } from '@/types/content'

/* Resolve uma página montada por blocos, com tudo que os blocos consomem.
 *
 * Existe para não repetir, em /sobre, /carreiras e /contato, a mesma sequência:
 * achar o documento pelo slug, ler o global institucional, ler as vagas, e
 * injetar os dados nos blocos que os pedem — sempre respeitando a regra de que
 * bloco não busca dado. */
export async function resolverPagina(
  slugPt: string,
  slugEn: string,
  locale: Locale,
): Promise<{ title: string; blocos: Bloco[] } | null> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()
  const slug = locale === 'pt' ? slugPt : slugEn

  const [{ docs }, global] = await Promise.all([
    payload.find({
      collection: 'pages',
      locale,
      depth: 2,
      limit: 1,
      draft: rascunho,
      where: rascunho
        ? { slug: { equals: slug } }
        : { slug: { equals: slug }, _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
  ])

  if (!docs[0]) return null

  const blocos = toBlocos(docs[0].layout, {
    metricas: toMetricas(global),
    selos: toSelos(global),
  })

  /* Só consulta vagas se algum bloco as usa — a maioria das páginas não. */
  if (blocos.some((b) => b.tipo === 'jobsList')) {
    const { docs: vagas } = await payload.find({
      collection: 'jobs',
      locale,
      depth: 0,
      limit: 100,
      sort: '-publishedAt',
      where: rascunho ? {} : { _status: { equals: 'published' } },
    })
    comVagas(blocos, vagas.map((v) => toVaga(v, locale)))
  }

  return { title: docs[0].title, blocos }
}
