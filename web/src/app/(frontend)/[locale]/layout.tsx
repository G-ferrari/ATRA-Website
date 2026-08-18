import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { LOCALES, isLocale } from '@/lib/locales'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'ATRA', template: '%s | ATRA' },
  description: 'Consultoria de Dados e IA.',
}

/* Pré-renderiza os dois idiomas. O proxy reescreve a raiz para /pt, então
 * este é o layout raiz de fato do site público. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  // next/root-params (Next 16): dá o locale em qualquer Server Component,
  // sem passar por props até o fim da árvore.
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale === 'pt' ? 'pt-BR' : 'en'} className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
