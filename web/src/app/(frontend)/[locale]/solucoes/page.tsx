import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import { isLocale, LOCALES } from '@/lib/locales'
import { metadataDaPaginaMestra, resolverPaginaMestra } from '@/lib/paginas'

/* /solucoes (MIG-055, D-52) — página-mestra da seção (D-55).
 *
 * ⚠️ No legado não havia índice (D-09): `/solucoes` servia a página de IA. O
 * cartão da lista é o do painel de Soluções do mega-menu, agrupado pelas abas
 * dele (`lib/abas-de-solucoes.ts`).
 *
 * Casca fina: o topo, os textos, a ordem das seções e o SEO são a página
 * marcada como página-mestra de `solucoes` em Páginas, no admin. A lista
 * automática é o bloco "Lista da seção" (`components/secoes/`).
 * Despublicada, a rota responde 404. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataDaPaginaMestra('solucoes')
}

export default async function SolucoesPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPaginaMestra('solucoes', locale)
  if (!pagina) notFound()

  return <PaginaMestra pagina={pagina} locale={locale} className="pb-20 min-h-screen bg-surface-1 text-text-main" />
}
