import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES } from '@/lib/locales'
import { resolverPagina } from '@/lib/paginas'
import { metadataDe } from '@/lib/seo'

/* /sobre (MIG-049) — página montada por blocos. Casca fina: resolve e renderiza.
 * Toda a estrutura vive no CMS. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const pagina = await resolverPagina('sobre', 'about', locale)
  return pagina ? metadataDe({ locale, local: { secao: 'sobre' }, seo: pagina.seo }) : {}
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPagina('sobre', 'about', locale)
  if (!pagina) notFound()

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={pagina.blocos} locale={locale} />
    </main>
  )
}
