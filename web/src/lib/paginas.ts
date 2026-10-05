import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { cache } from 'react'
import type { Where } from 'payload'

import { isLocale, type Locale } from './locales'
import { metadataDe } from './seo'
import { comClientes, comContato, comDepoimentos, comVagas, toBlocos, toMetricas, toSelos } from './mappers/blocks'
import { toDepoimento, toLogoDeCliente } from './mappers/client'
import { toSeo } from './mappers/seo'
import { lerContato } from './contato'
import { buscarConteudoDaSecao } from './conteudo-da-secao'
import { marcarAbertura } from './destaques-da-secao'
import { toWebinar } from './mappers/webinar'
import type { SecaoMestra } from './paginas-mestras'
import { toVaga } from './mappers/job'
import { comParceirosCadastrados } from './parceiros'
import { getPayload } from './payload'
import type { Bloco, Seo } from '@/types/content'

/* Resolve uma página montada por blocos, com tudo que os blocos consomem.
 *
 * Existe para não repetir, em /sobre, /carreiras e /contato, a mesma sequência:
 * achar o documento pelo slug, ler o global institucional, ler as vagas, e
 * injetar os dados nos blocos que os pedem — sempre respeitando a regra de que
 * bloco não busca dado. */
type PaginaResolvida = { title: string; seo: Seo; blocos: Bloco[] }

/** `topoProprio`: o primeiro bloco visível já dá o respiro sob o cabeçalho fixo
 *  (o carrossel de destaques, ou uma lista aberta), e a `<main>` da rota não
 *  pode somar o dela. Ver `marcarAbertura`. */
export type PaginaMestraResolvida = PaginaResolvida & { topoProprio: boolean }

export async function resolverPagina(slugPt: string, slugEn: string, locale: Locale): Promise<PaginaResolvida | null> {
  const { isEnabled: rascunho } = await draftMode()
  const slug = locale === 'pt' ? slugPt : slugEn
  return montar({ slug: { equals: slug } }, locale, rascunho)
}

/**
 * A página-mestra de uma seção (feature paginas-mestras, D-55), achada pela
 * marca da seção — e não pelo slug, que acompanha o idioma —, com a parte
 * automática da seção injetada nos blocos "Lista da seção" e "Destaques da
 * seção", e a capa do webinar mais recente na "Chamada para os webinars".
 *
 * `null` quando a página não existe ou está despublicada: a rota responde 404,
 * que é o que despublicar quer dizer (decisão de 05/10). Também `null` para
 * página do blog além da última.
 *
 * Em `cache` porque a rota chama duas vezes, no `generateMetadata` e na página,
 * e a consulta de Cases e a do Blog são as mais pesadas do site. Por isso os
 * argumentos são primitivos: objeto novo a cada chamada nunca acertaria.
 */
export const resolverPaginaMestra = cache(async function resolverPaginaMestra(
  secao: SecaoMestra,
  locale: Locale,
  pagina: number = 1,
): Promise<PaginaMestraResolvida | null> {
  const { isEnabled: rascunho } = await draftMode()
  const resolvida = await montar({ masterOf: { equals: secao } }, locale, rascunho)
  if (!resolvida) return null

  const { blocos } = resolvida
  if (blocos.some((b) => b.tipo === 'sectionListing' || b.tipo === 'sectionFeatured')) {
    const conteudo = await buscarConteudoDaSecao(secao, locale, { rascunho, pagina })
    for (const b of blocos) if (b.tipo === 'sectionListing' || b.tipo === 'sectionFeatured') b.conteudo = conteudo
  }

  /* Só o blog pagina, e pagina pela lista. Sem ela, /blog/pagina/2 repetiria a
     página-mestra num segundo endereço; além da última página, seria uma lista
     vazia com 200, que o Google indexaria como página magra. */
  if (pagina > 1) {
    const lista = blocos.find((b) => b.tipo === 'sectionListing')
    const conteudo = lista?.tipo === 'sectionListing' ? lista.conteudo : null
    if (conteudo?.secao !== 'blog' || pagina > conteudo.totalDePaginas) return null
  }

  if (blocos.some((b) => b.tipo === 'webinarTeaser')) {
    /* A capa da chamada vem do webinar mais recente: a seção fala de webinars e
       leva para /webinars. Rascunho nunca vira capa. */
    const payload = await getPayload()
    const { docs: webinars } = await payload.find({
      collection: 'webinars',
      locale,
      depth: 1,
      limit: 1,
      sort: 'order',
      where: { _status: { equals: 'published' } },
    })
    const capa = webinars[0] ? toWebinar(webinars[0]).image : null
    for (const b of blocos) if (b.tipo === 'webinarTeaser') b.capa = capa
  }

  return { ...resolvida, ...marcarAbertura(blocos) }
})

/** O `generateMetadata` de uma rota de página-mestra: o SEO escrito no admin,
 *  com a canônica e os idiomas da seção. Despublicada, nada — a página dá 404. */
export async function metadataDaPaginaMestra(secao: SecaoMestra): Promise<Metadata> {
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const pagina = await resolverPaginaMestra(secao, locale)
  return pagina ? metadataDe({ locale, local: { secao }, seo: pagina.seo }) : {}
}

async function montar(filtro: Where, locale: Locale, rascunho: boolean): Promise<PaginaResolvida | null> {
  const payload = await getPayload()
  const [{ docs }, global] = await Promise.all([
    payload.find({
      collection: 'pages',
      locale,
      depth: 2,
      limit: 1,
      draft: rascunho,
      where: rascunho ? filtro : { and: [filtro, { _status: { equals: 'published' } }] },
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

  /* A faixa "Parceiros de Confiança" e a vitrine em "Todos" leem a collection
     `partners`, a mesma do mega-menu: trocar ou adicionar um logo no admin muda
     todos os lugares. Até aqui a faixa guardava uma lista própria de uploads, e
     o logo novo do menu não chegava à home. */
  await comParceirosCadastrados(blocos, locale)

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
