import { Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { isLocale, LOCALES } from '@/lib/locales'
import { toConsultantRole } from '@/lib/mappers/consultant'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'

import { ListaDeConsultores } from './lista-de-consultores'

/* /consultores (MIG-052) — porte de `legacy/src/pages/Consultants.tsx`.
 * Servidor resolve os perfis; a ilha filtra. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const META = {
  pt: { title: 'Consultores', description: 'Especialistas em dados, cloud e IA prontos para alocação rápida.' },
  en: { title: 'Consultants', description: 'Data, cloud and AI specialists ready for fast allocation.' },
} as const

const TEXTOS = {
  pt: { badge: 'Especialistas em Dados, Cloud & IA', chip: 'Alocação Rápida', titulo: 'Nosso time de', destaque: 'consultores de elite' },
  en: { badge: 'Data, Cloud & AI specialists', chip: 'Fast allocation', titulo: 'Our team of', destaque: 'elite consultants' },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return META[isLocale(locale) ? locale : 'pt']
}

export default async function ConsultoresPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'specialist-roles',
    locale,
    depth: 0,
    limit: 100,
    sort: 'order',
  })
  const perfis = docs.map(toConsultantRole)

  return (
    <main className="pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
              <MetricChip label={t.chip} variant="neutral" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight">
              {t.titulo} <span className="text-primary font-normal">{t.destaque}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ListaDeConsultores perfis={perfis} contatoHref={hrefDe('contato', locale)} locale={locale} />
      </section>
    </main>
  )
}
