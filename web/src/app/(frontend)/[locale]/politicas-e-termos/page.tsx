import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES } from '@/lib/locales'
import { resolverPagina } from '@/lib/paginas'

/* /politicas-e-termos (MIG-094) — página montada por blocos, como /sobre.
 *
 * ⚠️ Não existe no protótipo: os 3 links legais do rodapé apontam para `#`
 * (`App.tsx:2520`). A página existe no WordPress e é a **única** das três —
 * privacidade, termos de uso e cookies vivem no mesmo documento, e os 3 links
 * passam a apontar para cá.
 *
 * ⚠️ Bloqueia LGPD e, por consequência, a Fase 5: MIG-100 liga o formulário de
 * contato, e coletar dado pessoal sem política publicada é o que P-14 impede. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const pagina = await resolverPagina('politicas-e-termos', 'privacy-and-terms', locale)
  return pagina ? { title: pagina.title } : {}
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const pagina = await resolverPagina('politicas-e-termos', 'privacy-and-terms', locale)
  if (!pagina) notFound()

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={pagina.blocos} locale={locale} />
    </main>
  )
}
