import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import { isLocale, LOCALES } from '@/lib/locales'
import { metadataDaPaginaMestra, resolverPaginaMestra } from '@/lib/paginas'

/* /consultores (porte de `legacy/src/pages/Consultants.tsx`) — página-mestra da
 * seção (D-55). O topo é do admin; números, perfis, carrinho e o formulário
 * de pedido seguem no código (decisão de 05/10). O modal de detalhe do legado
 * segue de fora: ver debito-tecnico.md.
 *
 * Casca fina: o topo, os textos, a ordem das seções e o SEO são a página
 * marcada como página-mestra de `consultores` em Páginas, no admin. A lista
 * automática é o bloco "Lista da seção" (`components/secoes/`).
 * Despublicada, a rota responde 404. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataDaPaginaMestra('consultores')
}

export default async function ConsultoresPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPaginaMestra('consultores', locale)
  if (!pagina) notFound()

  return <PaginaMestra pagina={pagina} locale={locale} className="pb-20 min-h-screen bg-surface-1 text-text-main" />
}
