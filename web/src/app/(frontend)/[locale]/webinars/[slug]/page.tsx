import { Calendar, ChevronLeft, Clock, Tag, Video } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { ContactCta } from '@/components/ui'
import { lerContato } from '@/lib/contato'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toWebinar } from '@/lib/mappers/webinar'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import { paraEmbed } from '@/lib/video'
import type { Webinar } from '@/types/content'
import { metadataDe } from '@/lib/seo'

import { VideoSobClique } from './video-sob-clique'

/* /webinars/[slug] (MIG-046). Rota **sem gabarito** — não existe no protótipo.
 *
 * D-11 previu os dois estados e ambos existem no seed: nenhum dos três webinars
 * tem vídeo hoje. Webinar futuro é página de inscrição legítima — tem data,
 * descrição e capa —, então **não** leva `noindex`, ao contrário de um artigo
 * sem corpo. O que falta aqui é o formulário de inscrição (MIG-100). */

const TEXTOS = {
  pt: {
    voltar: 'Voltar para webinars',
    prefixo: 'Webinar',
    duracao: 'Duração',
    semVideoTitulo: 'Gravação em breve',
    semVideoTexto:
      'Este webinar ainda não tem gravação publicada. Assim que o vídeo estiver disponível, ele aparece aqui.',
    assistir: 'Assistir à gravação',
    ctaTitulo: 'Quer esse tema',
    ctaDestaque: 'dentro da sua empresa?',
    ctaDescricao:
      'Nossos especialistas apresentam o conteúdo adaptado ao seu contexto, com os seus dados na mesa. Fale com a gente.',
    ctaTelefone: 'Telefone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Fale com um especialista',
  },
  en: {
    voltar: 'Back to webinars',
    prefixo: 'Webinar',
    duracao: 'Duration',
    semVideoTitulo: 'Recording coming soon',
    semVideoTexto:
      'This webinar has no published recording yet. The video shows up here as soon as it is available.',
    assistir: 'Watch the recording',
    ctaTitulo: 'Want this topic',
    ctaDestaque: 'inside your company?',
    ctaDescricao:
      'Our specialists present the content adapted to your context, with your own data on the table. Talk to us.',
    ctaTelefone: 'Phone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Talk to a specialist',
  },
} as const

async function buscarWebinar(slug: string, locale: Locale): Promise<Webinar | null> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'webinars',
    locale,
    depth: 1,
    limit: 1,
    draft: rascunho,
    where: rascunho
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] ? toWebinar(docs[0]) : null
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'webinars',
      locale,
      depth: 0,
      limit: 200,
      where: { _status: { equals: 'published' } },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/webinars/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const w = await buscarWebinar(slug, locale)
  if (!w) return {}
  return metadataDe({ locale, local: { secao: 'webinars', slug }, seo: w.seo })
}

export default async function WebinarPage({ params }: PageProps<'/[locale]/webinars/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const w = await buscarWebinar(slug, locale)
  if (!w) notFound()

  const t = TEXTOS[locale]
  const contato = await lerContato()
  const embed = paraEmbed(w.videoUrl)

  return (
    <main className="min-h-screen bg-white dark:bg-[#0e1015]">
      <section className="relative bg-primary overflow-hidden pt-32 md:pt-44 pb-12">
        <div className="absolute inset-0">
          <Image src={w.image.url} alt="" fill priority sizes="100vw" className="object-cover opacity-25 mix-blend-overlay" />
          <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/85 to-primary/60" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            href={hrefDe('webinars', locale)}
            className="inline-flex items-center gap-2 text-white font-bold mb-8 hover:gap-3 hover:text-secondary transition-all"
          >
            <ChevronLeft size={20} aria-hidden /> {t.voltar}
          </Link>

          <div className="max-w-4xl">
            <div className="text-secondary font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-2">
                <Calendar size={14} aria-hidden /> {t.prefixo} — {w.dateLabel}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} aria-hidden /> {t.duracao} {w.duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{w.title}</h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">{w.description}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {embed ? (
              /* MIG-155 (D-30): o iframe só monta no clique — antes disso,
                 nenhuma requisição sai para YouTube/Vimeo. Ver o comentário do
                 componente. */
              <VideoSobClique embed={embed} imagem={w.image} titulo={w.title} rotuloAssistir={t.assistir} />
            ) : (
              <div className="aspect-video rounded-[6px]  bg-slate-50 dark:bg-[#181b22] flex flex-col items-center justify-center text-center px-8">
                <Video size={36} className="text-slate-400 mb-4" aria-hidden />
                <h2 className="font-bold text-slate-900 dark:text-white mb-1">{t.semVideoTitulo}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">{t.semVideoTexto}</p>
              </div>
            )}

            {w.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-8">
                {w.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-[4px] bg-slate-50 dark:bg-[#181b22] text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 "
                  >
                    <Tag size={10} className="text-primary/70" aria-hidden /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCta
        title={t.ctaTitulo}
        titleHighlight={t.ctaDestaque}
        description={t.ctaDescricao}
        phoneLabel={t.ctaTelefone}
        emailLabel={t.ctaEmail}
        actionLabel={t.ctaAcao}
        href={hrefDe('contato', locale)}
        contato={contato}
      />
    </main>
  )
}
