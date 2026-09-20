import { Download, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { EntradaAnimada, FeaturedHero, type FeaturedItem } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { buscarMateriais } from '@/lib/materiais'
import { dataPorExtenso } from '@/lib/mappers/resource'
import { hrefDe } from '@/lib/routes'
import type { Resource } from '@/types/content'
import { metadataDe } from '@/lib/seo'

/* /relatorios (MIG-041) — porte de `legacy/src/pages/Reports.tsx`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const TEXTOS = {
  pt: {
    selo: 'Relatório',
    eyebrow: 'Relatório Técnico',
    acao: 'Baixar Relatório Grátis',
    tituloArquivo: 'Arquivo de',
    tituloDestaque: 'Relatórios',
    cta: 'Solicitar acesso',
    rotuloDaCapa: 'Report 2026',
    metaTitle: 'Relatórios',
    metaDescription: 'Pesquisas e benchmarks sobre dados, IA e cloud no mercado brasileiro.',
  },
  en: {
    selo: 'Report',
    eyebrow: 'Technical Report',
    acao: 'Download the free report',
    tituloArquivo: 'Report',
    tituloDestaque: 'archive',
    cta: 'Request access',
    rotuloDaCapa: 'Report 2026',
    metaTitle: 'Reports',
    metaDescription: 'Research and benchmarks on data, AI and cloud in the Brazilian market.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const t = TEXTOS[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'relatorios' },
    seo: { title: t.metaTitle, description: t.metaDescription, image: null, noIndex: false },
  })
}

function paraDestaque(r: Resource, locale: Locale, eyebrow: string): FeaturedItem {
  return {
    id: r.slug,
    title: r.title,
    description: r.description,
    tags: r.tags,
    image: r.image,
    href: hrefDe('relatorios', locale, r.slug),
    eyebrow: `${eyebrow} • ${dataPorExtenso(r.publishedAt, locale)}`,
    thumbLabel: dataPorExtenso(r.publishedAt, locale),
  }
}

export default async function RelatoriosPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const materiais = await buscarMateriais('report', locale)

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      {materiais.length > 0 && (
        <FeaturedHero
          items={materiais.map((r) => paraDestaque(r, locale, t.eyebrow))}
          actionLabel={t.acao}
          actionIcon={<Download size={20} aria-hidden />}
          eyebrowIcon={<FileText size={15} aria-hidden />}
          variante="cover"
          rotuloDaCapa={t.rotuloDaCapa}
        />
      )}

      <section className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-16 gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white">
              {t.tituloArquivo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {materiais.map((r, i) => (
              <EntradaAnimada
                key={r.slug}
                index={i}
                className="group flex flex-col bg-surface-2 dark:bg-[#181b22]  hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b] transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden relative border-b border-slate-200 dark:border-white/10">
                  <Image
                    src={r.image.url}
                    alt={r.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 dark:bg-black/40 group-hover:bg-transparent transition-all" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {t.selo}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="text-[11px] text-text-muted dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    {dataPorExtenso(r.publishedAt, locale)}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-display text-text-main dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-text-muted dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-6 flex-1">
                    {r.description}
                  </p>
                  {/* Botão sem destino: no legado ele também não faz nada. O
                      formulário de acesso é MIG-045 (debito-tecnico.md). */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-primary dark:text-[#3C98FA] hover:text-primary-dark dark:hover:text-white font-bold text-xs sm:text-sm hover:gap-3 transition-all cursor-pointer self-start"
                  >
                    <span>{t.cta}</span>
                    <Download size={15} aria-hidden />
                  </button>
                </div>
              </EntradaAnimada>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
