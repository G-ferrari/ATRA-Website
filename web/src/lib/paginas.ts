import { draftMode } from 'next/headers'

import type { Locale } from './locales'
import { comClientes, comContato, comDepoimentos, comParceiros, comVagas, toBlocos, toMetricas, toSelos } from './mappers/blocks'
import { toDepoimento, toLogoDeCliente } from './mappers/client'
import { toSeo } from './mappers/seo'
import { lerContato } from './contato'
import { toVaga } from './mappers/job'
import { toParceiroDaFaixa } from './mappers/partner'
import { getPayload } from './payload'
import type { Bloco, Seo } from '@/types/content'

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
): Promise<{ title: string; seo: Seo; blocos: Bloco[] } | null> {
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

  /* Idem para a home: os logos de cliente e os depoimentos em destaque saem das
     collections, não de arrays no bloco (MIG-071). */
  if (blocos.some((b) => b.tipo === 'homeHero')) {
    const { docs: clientes } = await payload.find({
      collection: 'clients',
      locale,
      depth: 1,
      limit: 100,
      sort: 'order',
    })
    comClientes(blocos, clientes.map(toLogoDeCliente))
  }

  /* A faixa "Parceiros de Confiança" lê a collection `partners`, a mesma do
     mega-menu: trocar ou adicionar um logo no admin muda os dois lugares. Até
     aqui ela guardava uma lista própria de uploads, e o logo novo do menu não
     chegava à home. `partners` não tem rascunho — não há `_status` a filtrar. */
  if (blocos.some((b) => b.tipo === 'logoMarquee')) {
    const { docs: parceiros } = await payload.find({
      collection: 'partners',
      locale,
      depth: 1,
      limit: 100,
      sort: 'order',
      select: { name: true, slug: true, logo: true, logoDark: true, logoScale: true, hasPage: true },
    })
    comParceiros(
      blocos,
      parceiros.map((p) => toParceiroDaFaixa(p, locale)).filter((p) => p !== null),
    )
  }

  if (blocos.some((b) => b.tipo === 'testimonialCarousel')) {
    const { docs: depoimentos } = await payload.find({
      collection: 'testimonials',
      locale,
      depth: 1,
      limit: 100,
      sort: 'id',
      where: { featured: { equals: true } },
    })
    comDepoimentos(blocos, depoimentos.map(toDepoimento))
  }

  /* O CTA de contato desenha telefone, e-mail e redes — que agora vêm do
     global `contact` (MIG-072), não de uma lista escrita no repositório. */
  if (blocos.some((b) => b.tipo === 'ctaContact')) {
    comContato(blocos, await lerContato())
  }

  /* O `seo` sai resolvido daqui para o `generateMetadata` da rota não repetir
     os fallbacks — eles já estavam escritos em quatro lugares com três
     resultados diferentes (MIG-105). */
  return { title: docs[0].title, seo: toSeo(docs[0].seo, { titulo: docs[0].title }), blocos }
}
