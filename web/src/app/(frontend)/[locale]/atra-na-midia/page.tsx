import { ArrowUpRight, Newspaper, Play } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { ChamadaFinal } from '@/components/layout/chamada-final'
import { EntradaAnimada, FeaturedHero, type FeaturedItem } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toMateriaDaImprensa } from '@/lib/mappers/press'
import { getPayload } from '@/lib/payload'
import { metadataDe } from '@/lib/seo'
import type { MateriaDaImprensa } from '@/types/content'

/* /atra-na-midia (D-49) — as matérias, entrevistas e vídeos sobre a ATRA na
 * imprensa, no molde de `/webinars`: destaque rotativo no topo e grade de
 * cartões.
 *
 * Até 02/10 esta rota era o arquivo de relatórios do protótipo
 * (`legacy/src/pages/Reports.tsx`), com três itens de exemplo e botão de
 * download. O conteúdo agora é o da página `/atra-na-midia/` do WordPress.
 *
 * ⚠️ **Não há página por matéria.** O cartão abre a matéria no site do veículo,
 * em outra aba — como no site antigo. Uma página nossa só teria o resumo e um
 * botão, e seria página magra (D-08). É a diferença para os webinars, e é
 * decisão (G-ferrari, 02/10). */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/** O destaque do topo mostra as primeiras, na ordem do admin. Mais que isso e a
 *  régua de miniaturas ganha barra de rolagem — o defeito anotado em /webinars. */
const DESTAQUES = 4

/* Título e parágrafos são os da página antiga, literais (D-22). */
const TEXTOS = {
  pt: {
    titulo: 'Conhecimento que gera impacto.',
    tituloDestaque: 'Voz que influencia o mercado.',
    intro: [
      'Nossa experiência em dados, IA, cloud e transformação digital está presente nas mídias.',
      'Explore os conteúdos que apresentam a visão da ATRA e de nossos especialistas sobre os desafios e oportunidades que estão moldando o futuro dos negócios.',
    ],
    ler: 'Leia a matéria',
    assistir: 'Assistir',
    novaAba: 'abre em outra aba',
    vazio: 'As matérias aparecem aqui assim que forem publicadas.',
    metaTitle: 'ATRA na mídia',
    metaDescription:
      'Matérias, entrevistas e vídeos em que a ATRA e seus especialistas falam de dados, IA, cloud e transformação digital.',
  },
  en: {
    titulo: 'Knowledge that makes an impact.',
    tituloDestaque: 'A voice that shapes the market.',
    intro: [
      'Our experience in data, AI, cloud and digital transformation is in the media.',
      'Explore the content that presents the view of ATRA and our specialists on the challenges and opportunities shaping the future of business.',
    ],
    ler: 'Read the article',
    assistir: 'Watch',
    novaAba: 'opens in a new tab',
    vazio: 'Articles show up here as soon as they are published.',
    metaTitle: 'ATRA in the media',
    metaDescription:
      'Articles, interviews and videos in which ATRA and its specialists talk about data, AI, cloud and digital transformation.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const t = TEXTOS[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'midia' },
    seo: { title: t.metaTitle, description: t.metaDescription, image: null, noIndex: false },
  })
}

function dataDe(m: MateriaDaImprensa, locale: Locale): string | null {
  if (!m.publishedAt) return null
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(m.publishedAt))
}

/** Veículo e, quando há, a data: é o que identifica a matéria antes do título. */
function origemDe(m: MateriaDaImprensa, locale: Locale): string {
  const data = dataDe(m, locale)
  return data ? `${m.outlet} • ${data}` : m.outlet
}

export default async function AtraNaMidiaPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'press',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    draft: rascunho,
    /* Fora do modo rascunho, só publicado — a Local API ignora `access.read`. */
    ...(rascunho ? {} : { where: { _status: { equals: 'published' } } }),
  })
  const materias = docs.map(toMateriaDaImprensa)
  const acaoDe = (m: MateriaDaImprensa) => (m.kind === 'video' ? t.assistir : t.ler)

  const destaques: FeaturedItem[] = materias.slice(0, DESTAQUES).map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    tags: [],
    image: m.image,
    href: m.url,
    externo: true,
    actionLabel: acaoDe(m),
    eyebrow: origemDe(m, locale),
    thumbLabel: m.outlet,
  }))

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      {destaques.length > 0 && (
        <FeaturedHero
          items={destaques}
          actionLabel={t.ler}
          actionIcon={<ArrowUpRight size={18} aria-hidden />}
          eyebrowIcon={<Newspaper size={15} aria-hidden />}
        />
      )}

      {/* Sem destaque (nenhuma matéria publicada), a seção é o topo da página e
          precisa do respiro que ele dava sob o cabeçalho fixo. */}
      <section
        className={
          destaques.length > 0
            ? 'py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]'
            : 'pt-28 sm:pt-36 md:pt-44 pb-20 md:pb-24 bg-surface-1 dark:bg-[#0e1015]'
        }
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="mb-12 md:mb-16 max-w-3xl">
            {/* Com destaque, o `h1` é o título da matéria em destaque; sem ele,
                este é o título da página. */}
            {destaques.length > 0 ? (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white leading-tight">
                {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
              </h2>
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white leading-tight">
                {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
              </h1>
            )}
            <div className="mt-5 space-y-3 text-sm md:text-base text-text-muted dark:text-gray-300 font-light leading-relaxed">
              {t.intro.map((paragrafo) => (
                <p key={paragrafo}>{paragrafo}</p>
              ))}
            </div>
          </div>

          {materias.length === 0 ? (
            <p className="text-sm text-text-muted font-light">{t.vazio}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {materias.map((m, i) => (
                <EntradaAnimada
                  key={m.id}
                  index={i}
                  escala
                  className="group relative flex flex-col gap-5 bg-surface-2 dark:bg-[#181b22]  hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b]"
                >
                  <div className="aspect-video rounded-[6px] overflow-hidden relative shadow-md">
                    <Image
                      src={m.image.url}
                      alt={m.image.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* O botão de play só aparece no que é vídeo: numa matéria
                        de jornal ele prometeria o que o clique não entrega. */}
                    {m.kind === 'video' && (
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-all flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all shadow-lg">
                          <Play className="text-white fill-white ml-1" size={20} aria-hidden />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="text-[11px] text-primary mb-1.5 font-bold uppercase tracking-wider">
                      {origemDe(m, locale)}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-text-main dark:text-white group-hover:text-primary transition-colors leading-snug">
                      {/* Um link só por cartão, no título, com `after:inset-0`
                          cobrindo o cartão inteiro — o mesmo desenho de
                          /webinars. Abre em outra aba, e o leitor de tela é
                          avisado disso. */}
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-[6px] focus-visible:after:ring-2 focus-visible:after:ring-[#3C98FA]"
                      >
                        {m.title}
                        <span className="sr-only"> ({t.novaAba})</span>
                      </a>
                    </h3>
                    <p className="mt-2 text-text-muted dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                      {m.description}
                    </p>
                    <div
                      aria-hidden
                      className="mt-4 inline-flex items-center gap-2 text-primary dark:text-[#3C98FA] font-bold text-xs sm:text-sm group-hover:gap-3 transition-all"
                    >
                      <span>{acaoDe(m)}</span>
                      <ArrowUpRight size={15} />
                    </div>
                  </div>
                </EntradaAnimada>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* A página antiga fechava com um formulário próprio; aqui vale o fim
          padrão de toda página interna (D-42). */}
      <ChamadaFinal locale={locale} />
    </main>
  )
}
