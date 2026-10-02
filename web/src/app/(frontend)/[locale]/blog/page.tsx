import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { isLocale, LOCALES } from '@/lib/locales'

import { metadataDoBlog, PaginaDoBlog } from './pagina-do-blog'

/* /blog — a primeira página da listagem. As seguintes são
 * `/blog/pagina/[numero]`; o desenho das duas está em `pagina-do-blog.tsx`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return metadataDoBlog(isLocale(locale) ? locale : 'pt', 1)
}

export default async function BlogPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()
  return <PaginaDoBlog locale={locale} pagina={1} />
}
