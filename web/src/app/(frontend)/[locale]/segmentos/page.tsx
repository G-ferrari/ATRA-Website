import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import { isLocale, LOCALES } from '@/lib/locales'
import { metadataDaPaginaMestra, resolverPaginaMestra } from '@/lib/paginas'

/* /segmentos (MIG-091) — página-mestra da seção (D-55).
 *
 * Sem gabarito: o protótipo não tem esta rota, e as 8 verticais vêm do
 * WordPress (D-17). O desenho é o do índice de soluções, sem categorias.
 *
 * Casca fina: o topo, os textos, a ordem das seções e o SEO são a página
 * marcada como página-mestra de `segmentos` em Páginas, no admin. A lista
 * automática é o bloco "Lista da seção" (`components/secoes/`).
 * Despublicada, a rota responde 404. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataDaPaginaMestra('segmentos')
}

export default async function SegmentosPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPaginaMestra('segmentos', locale)
  if (!pagina) notFound()

  return <PaginaMestra pagina={pagina} locale={locale} className="pb-20 min-h-screen bg-surface-1 text-text-main" />
}
