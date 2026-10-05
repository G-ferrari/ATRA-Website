import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import { isLocale, LOCALES } from '@/lib/locales'
import { metadataDaPaginaMestra, resolverPaginaMestra } from '@/lib/paginas'

/* /insights (MIG-060) — o hub central de conteúdo.
 *
 * ⚠️ O plano dizia "agrega 4 collections", e o legado **não agrega nada**: é uma
 * lista curada com texto próprio. Dos 10 itens, só 3 repetem o título da página
 * de origem. Ver a nota do campo `items` em `blocks/index.ts`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataDaPaginaMestra('insights')
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPaginaMestra('insights', locale)
  if (!pagina) notFound()

  return (
    <PaginaMestra
      pagina={pagina}
      locale={locale}
      className="pb-20 bg-surface-1 min-h-screen text-text-main relative overflow-hidden"
    />
  )
}
