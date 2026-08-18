import { Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { MetricChip, StatusBadge } from '@/components/ui'
import { toCaseCard } from '@/lib/mappers/case'
import { toTopics } from '@/lib/mappers/shared'
import { getPayload } from '@/lib/payload'
import { isLocale, LOCALES } from '@/lib/locales'
import type { Topic } from '@/types/content'

import { ListaDeCases } from './lista-de-cases'

/* Listagem de cases — a fatia vertical de referência.
 *
 * A página resolve o dado e monta as props; o markup interativo vive na ilha
 * cliente. Nenhum componente busca dado (contratos-de-dados.md). */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const TEXTOS = {
  pt: {
    badge: 'Histórias Reais de Sucesso',
    chip: 'Grandes Instituições',
    titulo: 'Todos os',
    tituloDestaque: 'cases de sucesso',
    metaTitle: 'Cases de Sucesso',
    metaDescription:
      'Histórias reais de transformação com dados, IA e cloud nos maiores bancos e empresas do Brasil.',
  },
  en: {
    badge: 'Real Success Stories',
    chip: 'Major Institutions',
    titulo: 'All',
    tituloDestaque: 'success stories',
    metaTitle: 'Success Stories',
    metaDescription:
      'Real transformation stories with data, AI and cloud at Brazil’s largest banks and enterprises.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = TEXTOS[isLocale(locale) ? locale : 'pt']
  return { title: t.metaTitle, description: t.metaDescription }
}

export default async function CasesPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const payload = await getPayload()

  // depth: 2 popula heroImage e topics — os mappers exigem documento, não id.
  const { docs } = await payload.find({
    collection: 'cases',
    locale,
    depth: 2,
    limit: 100,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  const cases = docs.map(toCaseCard)

  // Só os assuntos em uso — filtro vazio confunde mais que ajuda.
  const emUso = new Map<string, Topic>()
  for (const doc of docs) for (const t of toTopics(doc.topics)) emUso.set(t.slug, t)

  const t = TEXTOS[locale]

  return (
    <main className="min-h-screen bg-surface-1 text-text-main">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-10 md:mb-12">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
              <MetricChip label={t.chip} variant="neutral" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight">
              {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
            </h1>
          </div>

          <ListaDeCases cases={cases} topics={[...emUso.values()]} locale={locale} />
        </div>
      </section>
    </main>
  )
}
