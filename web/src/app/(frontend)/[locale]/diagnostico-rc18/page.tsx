import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { isLocale, LOCALES } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'

import { Diagnostico } from './diagnostico'

/* /diagnostico-rc18 (feature rc18, task 006) — autoavaliação de prontidão para a
 * RC 18/2025, com índice na hora.
 *
 * ⚠️ `noindex`, como `/chat`: é ferramenta de conversão, não conteúdo de SEO.
 * A página de solução `/solucoes/rc18` é a indexável; esta captura o lead.
 *
 * PT-only na v1: a ilha é em português e a rota serve o mesmo conteúdo nos dois
 * locales (o alias EN existe só para a arquitetura de slug resolver). */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Diagnóstico de prontidão · RC 18/2025',
  description:
    'Autoavaliação rápida e gratuita da prontidão da sua instituição para a Resolução Conjunta nº 18/2025, pelas 12 dimensões de qualidade da informação.',
  robots: { index: false, follow: true },
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  /* O CTA do resultado leva ao formulário da página de solução (regra 6 — sem
     URL na mão). O lead do próprio diagnóstico chega na task 007. */
  const hrefContato = `${hrefDe('solucoes', locale, 'rc18')}#contato`

  return (
    <main className="flex-1">
      <Diagnostico hrefContato={hrefContato} />
    </main>
  )
}
