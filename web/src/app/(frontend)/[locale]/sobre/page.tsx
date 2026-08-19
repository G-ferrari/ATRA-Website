import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toBlocos, toMetricas } from '@/lib/mappers/blocks'
import { getPayload } from '@/lib/payload'

/* /sobre (MIG-049) — a primeira página montada por blocos.
 *
 * A rota é fina de propósito: resolve o documento, resolve o global, entrega os
 * blocos já mapeados. Toda a estrutura vive no CMS, que é o ponto — reordenar
 * seção não passa por deploy. As próximas páginas institucionais reusam esta
 * mesma casca com outro slug. */

const SLUG = { pt: 'sobre', en: 'about' } as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

async function buscarPagina(locale: Locale) {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const [{ docs }, global] = await Promise.all([
    payload.find({
      collection: 'pages',
      locale,
      /* depth 2: os blocos referenciam parceiros, que referenciam o logo em
       * media — dois saltos até a imagem. */
      depth: 2,
      limit: 1,
      draft: rascunho,
      where: rascunho
        ? { slug: { equals: SLUG[locale] } }
        : { slug: { equals: SLUG[locale] }, _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
  ])

  if (!docs[0]) return null
  return {
    doc: docs[0],
    blocos: toBlocos(docs[0].layout, { metricas: toMetricas(global) }),
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const p = await buscarPagina(locale)
  if (!p) return {}
  return { title: p.doc.title }
}

export default async function SobrePage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await buscarPagina(locale)
  if (!pagina) notFound()

  return (
    /* `pt-24 md:pt-36` limpa o menu fixo, como no legado (`About.tsx:146`).
       Fica na página e não nos blocos: é a casca que precisa do espaço, e um
       bloco não sabe se é o primeiro. */
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={pagina.blocos} />
    </main>
  )
}
