import { Calendar, Play } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { EntradaAnimada, FeaturedHero, type FeaturedItem } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toWebinar } from '@/lib/mappers/webinar'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { Webinar } from '@/types/content'
import { metadataDe } from '@/lib/seo'

/* /webinars (MIG-042) — porte de `legacy/src/pages/Webinars.tsx`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const TEXTOS = {
  pt: {
    eyebrow: 'Próximo Evento',
    acao: 'Garantir minha vaga',
    acaoSecundaria: 'Ver detalhes',
    titulo: 'Webinars',
    tituloDestaque: 'Gravados',
    metaTitle: 'Webinars',
    metaDescription: 'Eventos online sobre dados, IA e cloud com especialistas do mercado.',
  },
  en: {
    eyebrow: 'Next event',
    acao: 'Save my seat',
    acaoSecundaria: 'See details',
    titulo: 'Recorded',
    tituloDestaque: 'webinars',
    metaTitle: 'Webinars',
    metaDescription: 'Online events on data, AI and cloud with market specialists.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const t = TEXTOS[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'webinars' },
    seo: { title: t.metaTitle, description: t.metaDescription, image: null, noIndex: false },
  })
}

function paraDestaque(w: Webinar, locale: Locale, eyebrow: string): FeaturedItem {
  return {
    id: w.slug,
    title: w.title,
    description: w.description,
    tags: w.tags,
    image: w.image,
    href: hrefDe('webinars', locale, w.slug),
    eyebrow: `${eyebrow} • ${w.dateLabel}`,
    thumbLabel: w.dateLabel,
  }
}

export default async function WebinarsPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'webinars',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    draft: rascunho,
    ...(rascunho ? {} : { where: { _status: { equals: 'published' } } }),
  })
  const webinars = docs.map(toWebinar)

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      {webinars.length > 0 && (
        <FeaturedHero
          items={webinars.map((w) => paraDestaque(w, locale, t.eyebrow))}
          actionLabel={t.acao}
          actionIcon={<Play size={20} aria-hidden />}
          eyebrowIcon={<Calendar size={15} aria-hidden />}
          acaoSecundaria={{
            label: t.acaoSecundaria,
            href: hrefDe('webinars', locale, webinars[0].slug),
          }}
        />
      )}

      <section className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white">
              {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {webinars.map((w, i) => (
              <EntradaAnimada
                key={w.slug}
                index={i}
                escala
                className="group flex flex-col gap-5 bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b]"
              >
                <div className="aspect-video rounded-[6px] overflow-hidden relative shadow-md group cursor-pointer border border-slate-200 dark:border-white/10">
                  <Image
                    src={w.image.url}
                    alt={w.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/15 transition-all flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all shadow-lg">
                      <Play className="text-white fill-white ml-1" size={20} aria-hidden />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="px-2.5 py-1 rounded-[4px] bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      {w.duration}
                    </span>
                    {/* "HD" é literal no legado, igual nos três cards. */}
                    <span className="px-2.5 py-1 rounded-[4px] bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      HD
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-primary mb-1.5 font-bold uppercase tracking-wider">
                    {w.dateLabel}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-text-main dark:text-white group-hover:text-primary transition-colors leading-snug">
                    {w.title}
                  </h3>
                </div>
              </EntradaAnimada>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
