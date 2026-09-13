import { Calendar, Download } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { EntradaAnimada, FeaturedHero, type FeaturedItem } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { buscarMateriais } from '@/lib/materiais'
import { hrefDe } from '@/lib/routes'
import type { Resource } from '@/types/content'
import { metadataDe } from '@/lib/seo'

/* /ebooks (MIG-041) — porte de `legacy/src/pages/Ebooks.tsx`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const TEXTOS = {
  pt: {
    selo: 'E-book',
    acao: 'Baixar E-book agora',
    paginas: 'páginas de conteúdo exclusivo',
    cta: 'Baixar agora',
    rotuloDaCapa: 'E-book',
    metaTitle: 'E-books',
    metaDescription: 'Guias práticos sobre arquitetura de dados, governança e cloud.',
  },
  en: {
    selo: 'Ebook',
    acao: 'Download the ebook',
    paginas: 'pages of exclusive content',
    cta: 'Download now',
    rotuloDaCapa: 'E-book',
    metaTitle: 'Ebooks',
    metaDescription: 'Practical guides on data architecture, governance and cloud.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const t = TEXTOS[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'ebooks' },
    seo: { title: t.metaTitle, description: t.metaDescription, image: null, noIndex: false },
  })
}

/* Sem `eyebrow`: o e-book não tem data no legado, e `getSubtext` devolvia
 * `undefined`, que esconde a linha inteira (FeaturedHero.tsx:56). */
function paraDestaque(r: Resource, locale: Locale): FeaturedItem {
  return {
    id: r.slug,
    title: r.title,
    description: r.description,
    tags: r.tags,
    image: r.image,
    href: hrefDe('ebooks', locale, r.slug),
    eyebrow: null,
    thumbLabel: null,
  }
}

export default async function EbooksPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const materiais = await buscarMateriais('ebook', locale)

  return (
    <main className="min-h-screen bg-surface-1 text-text-main">
      {materiais.length > 0 && (
        <FeaturedHero
          items={materiais.map((r) => paraDestaque(r, locale))}
          actionLabel={t.acao}
          actionIcon={<Download size={20} aria-hidden />}
          eyebrowIcon={<Calendar size={15} aria-hidden />}
          variante="cover"
          rotuloDaCapa={t.rotuloDaCapa}
        />
      )}

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {materiais.map((r, i) => (
              <EntradaAnimada
                key={r.slug}
                index={i}
                className="bg-surface-2  hover:border-primary/40 rounded-[6px] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:bg-surface-3 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[3/4] rounded-[6px] overflow-hidden mb-6 shadow-inner relative ">
                    <Image
                      src={r.image.url}
                      alt={r.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                        {t.selo}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-display text-text-main mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <div className="text-xs text-text-muted mb-6 font-light">
                    {r.pages} {t.paginas}
                  </div>
                </div>
                {/* Ver a nota do botão em /relatorios: o legado também não baixa nada. */}
                <button
                  type="button"
                  className="w-full py-3 rounded-[6px] border border-primary/40 text-primary font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <Download size={16} aria-hidden /> <span>{t.cta}</span>
                </button>
              </EntradaAnimada>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
