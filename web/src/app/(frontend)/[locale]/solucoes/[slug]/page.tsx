import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toBlocos, toMetricas, toSelos } from '@/lib/mappers/blocks'
import { getPayload } from '@/lib/payload'

/* /solucoes/[slug] (MIG-056) — porte de `legacy/src/pages/SolutionAI.tsx`.
 *
 * Mesmo padrão de `/parceiros/[slug]`: a página é montada por blocos guardados
 * na própria solução, e só existe para quem tem `hasPage`. No legado havia uma
 * página de IA em código, servindo também `/solucoes`; D-09 separou as duas, e
 * o que era componente fixo virou conteúdo — as outras 5 soluções (e as 13 de
 * MIG-093) reaproveitam a mesma estrutura sem código novo. */

async function buscarSolucao(slug: string, locale: Locale) {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const [{ docs }, global] = await Promise.all([
    payload.find({
      collection: 'solutions',
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
    blocos: toBlocos(docs[0].layout, { metricas: toMetricas(global), selos: toSelos(global) }),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'solutions',
      locale,
      depth: 0,
      limit: 200,
      where: { hasPage: { equals: true } },
      // Só o slug: sem isto a consulta arrasta o `layout` inteiro, com um join
      // por tipo de bloco, para montar uma lista de caminhos.
      select: { slug: true },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/solucoes/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const s = await buscarSolucao(slug, locale)
  if (!s) return {}
  return { title: `ATRA / ${s.doc.title}`, description: s.doc.shortDescription }
}

export default async function SolucaoPage({ params }: PageProps<'/[locale]/solucoes/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const solucao = await buscarSolucao(slug, locale)
  if (!solucao) notFound()

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={solucao.blocos} locale={locale} />
    </main>
  )
}
