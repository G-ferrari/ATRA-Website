import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toCaseDetail } from '@/lib/mappers/case'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { CaseDetail } from '@/types/content'

const TEXTOS = {
  pt: {
    voltar: 'Voltar para cases',
    prefixo: 'Case de Sucesso',
    desafios: 'Desafios',
    solucao: 'Solução',
    resultados: 'Resultados',
    sobre: 'Sobre o',
    tecnologias: 'Tecnologias',
    parceiros: 'Parceiros',
    infoProjeto: 'Informações do Projeto',
  },
  en: {
    voltar: 'Back to cases',
    prefixo: 'Success Story',
    desafios: 'Challenges',
    solucao: 'Solution',
    resultados: 'Results',
    sobre: 'About',
    tecnologias: 'Technologies',
    parceiros: 'Partners',
    infoProjeto: 'Project details',
  },
} as const

async function buscarCase(slug: string, locale: Locale): Promise<CaseDetail | null> {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'cases',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] ? toCaseDetail(docs[0]) : null
}

/* Pré-renderiza os slugs dos dois idiomas. O slug é localizado (D-07), então
 * cada locale tem o seu — não dá para reaproveitar a lista de um só. */
export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'cases',
      locale,
      depth: 0,
      limit: 200,
      where: { _status: { equals: 'published' } },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/cases-de-sucesso/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const caso = await buscarCase(slug, locale)
  if (!caso) return {}
  return {
    title: `${caso.title} — ${TEXTOS[locale].prefixo} ${caso.client}`,
    description: caso.summary,
    openGraph: { images: [{ url: caso.image.url }] },
  }
}

export default async function CasePage({ params }: PageProps<'/[locale]/cases-de-sucesso/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const caso = await buscarCase(slug, locale)
  if (!caso) notFound()

  const t = TEXTOS[locale]

  return (
    <main className="min-h-screen bg-white">
      <section className="relative min-h-[50vh] md:min-h-[60vh] bg-primary overflow-hidden flex items-center pt-32 md:pt-48 pb-16">
        <div className="absolute inset-0">
          <Image
            src={caso.image.url}
            alt={caso.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            href={hrefDe('cases', locale)}
            className="inline-flex items-center gap-2 text-white font-bold mb-8 hover:gap-3 hover:text-secondary transition-all"
          >
            <ChevronLeft size={20} aria-hidden /> {t.voltar}
          </Link>
          <div className="max-w-4xl">
            <div className="text-secondary font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4">
              {t.prefixo} — {caso.client}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {caso.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">{caso.summary}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              {caso.challenges.length > 0 && (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">{t.desafios}</h2>
                  <ul className="space-y-4 mb-12">
                    {caso.challenges.map((d) => (
                      <li key={d} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex-shrink-0 flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span className="text-slate-700">{d}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {caso.results.length > 0 && (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">{t.resultados}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {caso.results.map((r) => (
                      <div key={r} className="bg-slate-50 p-6 rounded-[6px]">
                        <p className="text-slate-900 font-medium">{r}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {caso.aboutClient && (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">
                    {t.sobre} {caso.client}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-12">{caso.aboutClient}</p>
                </>
              )}
            </div>

            <aside className="lg:w-1/3">
              <div className="sticky top-32 space-y-6">
                <div className="bg-slate-50 rounded-[6px] overflow-hidden">
                  <div className="bg-primary p-6 text-white">
                    <h2 className="font-bold uppercase tracking-wider text-xs">{t.infoProjeto}</h2>
                  </div>
                  <div className="p-8 space-y-8">
                    {caso.partners.length > 0 && (
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-1">{t.parceiros}</div>
                        <div className="text-slate-900 font-bold text-sm">
                          {caso.partners.map((p) => p.name).join(' e ')}
                        </div>
                      </div>
                    )}
                    {caso.technologies.length > 0 && (
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3">{t.tecnologias}</div>
                        <div className="flex flex-wrap gap-2">
                          {caso.technologies.map((tec) => (
                            <span key={tec} className="px-2.5 py-1 bg-white rounded-[6px] text-[10px] font-bold text-slate-600">
                              {tec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
