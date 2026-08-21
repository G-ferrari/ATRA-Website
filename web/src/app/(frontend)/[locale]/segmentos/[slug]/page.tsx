import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toBlocos, toMetricas, toSelos } from '@/lib/mappers/blocks'
import { getPayload } from '@/lib/payload'
import { robotsDeCorpo } from '@/lib/seo'

/* /segmentos/[slug] (MIG-091).
 *
 * Casca fina, idêntica à de `/solucoes/[slug]`: a página é montada por blocos
 * guardados no próprio segmento. Nenhum componente novo — a vertical usa as
 * mesmas seções que solução e página institucional já usam.
 *
 * ⚠️ Sem gabarito visual: a rota não existe no protótipo (D-17). */

async function buscarSegmento(slug: string, locale: Locale) {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const [{ docs }, global] = await Promise.all([
    payload.find({
      collection: 'segments',
      locale,
      depth: 2,
      limit: 1,
      draft: rascunho,
      /* Fora do modo rascunho, só publicado — a Local API ignora `access.read`. */
      where: rascunho ? { slug: { equals: slug } } : { slug: { equals: slug }, _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
  ])

  if (!docs[0]) return null
  return {
    doc: docs[0],
    blocos: toBlocos(docs[0].layout, { metricas: toMetricas(global), selos: toSelos(global) }),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'segments',
      locale,
      depth: 0,
      limit: 200,
      where: { _status: { equals: 'published' } },
      // Só o slug: sem isto a consulta arrasta o `layout`, com um join por tipo
      // de bloco, para montar uma lista de caminhos.
      select: { slug: true },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/segmentos/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const s = await buscarSegmento(slug, locale)
  if (!s) return {}
  return {
    title: `ATRA / ${s.doc.name}`,
    description: s.doc.shortDescription,
    /* D-08: vertical sem seção montada é página magra e não entra no índice. */
    robots: robotsDeCorpo(s.doc.layout?.length),
  }
}

export default async function SegmentoPage({ params }: PageProps<'/[locale]/segmentos/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const segmento = await buscarSegmento(slug, locale)
  if (!segmento) notFound()

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={segmento.blocos} locale={locale} />
    </main>
  )
}
