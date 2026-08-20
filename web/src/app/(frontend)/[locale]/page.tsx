import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES } from '@/lib/locales'
import { resolverPagina } from '@/lib/paginas'

/* A home (MIG-059) — montada por blocos, como as outras.
 *
 * ⚠️ O `<main>` não tem `pt-24 md:pt-36`. Todas as outras rotas afastam o
 * conteúdo do cabeçalho fixo; aqui o herói passa **por baixo** dele, de
 * propósito (`App.tsx:2546` abre com `relative overflow-hidden` e mais nada), e
 * é o próprio herói que reserva o espaço com `pt-24 sm:pt-32`. Acrescentar o
 * respiro aqui empurraria a tela cheia para fora da dobra. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const pagina = await resolverPagina('home', 'home', locale)
  return pagina ? { title: pagina.title } : {}
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPagina('home', 'home', locale)
  if (!pagina) notFound()

  return (
    <main className="relative overflow-hidden bg-surface-1 text-text-main">
      <RenderBlocks blocos={pagina.blocos} locale={locale} />
    </main>
  )
}
