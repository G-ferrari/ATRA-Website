import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import { isLocale, LOCALES } from '@/lib/locales'
import { metadataDaPaginaMestra, resolverPaginaMestra } from '@/lib/paginas'

/* /ebooks (MIG-041, porte de `legacy/src/pages/Ebooks.tsx`) — página-mestra da
 * seção (D-55).
 *
 * Casca fina: o topo, os textos, a ordem das seções e o SEO são a página
 * marcada como página-mestra de `ebooks` em Páginas, no admin. A lista
 * automática é o bloco "Lista da seção" (`components/secoes/`).
 * Despublicada, a rota responde 404. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataDaPaginaMestra('ebooks')
}

export default async function EbooksPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPaginaMestra('ebooks', locale)
  if (!pagina) notFound()

  return <PaginaMestra pagina={pagina} locale={locale} className="min-h-screen bg-surface-1 text-text-main" />
}
