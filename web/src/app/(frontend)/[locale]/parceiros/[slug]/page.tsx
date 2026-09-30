import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { toBlocos, toMetricas, toSelos } from '@/lib/mappers/blocks'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { comParceirosCadastrados } from '@/lib/parceiros'
import { getPayload } from '@/lib/payload'
import { metadataDe } from '@/lib/seo'
import { toSeo } from '@/lib/mappers/seo'
import { toImageOpcional } from '@/lib/mappers/shared'

/* /parceiros/[slug] (MIG-054).
 *
 * A página é montada por blocos, guardados no próprio parceiro (Partners.layout),
 * e só existe para quem tem `hasPage`. O legado tinha um `PartnerPageBase` fixo
 * com uma página (Google Cloud); blocos dão a mesma estrutura para qualquer
 * parceiro, sem código novo por marca. */

async function buscarParceiro(slug: string, locale: Locale) {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const [{ docs }, global] = await Promise.all([
    payload.find({
      collection: 'partners',
      locale,
      depth: 2,
      limit: 1,
      draft: rascunho,
      where: { slug: { equals: slug }, hasPage: { equals: true } },
    }),
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
  ])

  if (!docs[0]) return null
  return {
    doc: docs[0],
    // A vitrine de parceiros em "Todos" lê o cadastro (29/09).
    blocos: await comParceirosCadastrados(
      toBlocos(docs[0].layout, { metricas: toMetricas(global), selos: toSelos(global) }),
      locale,
    ),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'partners',
      locale,
      depth: 0,
      limit: 200,
      where: { hasPage: { equals: true } },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/parceiros/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const p = await buscarParceiro(slug, locale)
  if (!p) return {}
  return metadataDe({
    locale,
    local: { secao: 'parceiros', slug },
    seo: toSeo(p.doc.seo, { titulo: p.doc.name, descricao: p.doc.description, imagem: toImageOpcional(p.doc.logo, 'partners.logo') }),
  })
}

export default async function ParceiroPage({ params }: PageProps<'/[locale]/parceiros/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const parceiro = await buscarParceiro(slug, locale)
  if (!parceiro) notFound()

  return (
    /* `pb-12`, não `pb-0`: o gabarito fecha a página com 48px abaixo da última
       faixa (`PartnerPageBase.tsx:97`). É a única rota do site que faz isso. */
    <main className="pt-24 md:pt-36 pb-12 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={parceiro.blocos} locale={locale} />
    </main>
  )
}
