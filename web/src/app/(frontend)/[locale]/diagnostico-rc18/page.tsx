import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { isLocale, LOCALES } from '@/lib/locales'

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
  title: 'RC18 Quick Check · prontidão para a RC 18/2025',
  description:
    'Autoavaliação rápida e gratuita da prontidão da sua instituição para a Resolução Conjunta nº 18/2025, em onze pilares de qualidade das informações regulatórias.',
  robots: { index: false, follow: true },
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  /* Sem props: o único link que a ilha recebia era o do formulário de contato,
     e ele virou o WhatsApp do especialista — o mesmo dos CTAs de
     /solucoes/rc18. Link externo não passa por `routes.ts` (regra 6 vale para
     URL do site). */
  return (
    <main className="flex-1">
      <Diagnostico />
    </main>
  )
}
