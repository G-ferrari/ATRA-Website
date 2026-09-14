import { ChevronLeft, Calendar, Tag } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RascunhoIncompleto } from '@/components/content/rascunho-incompleto'
import { RichText } from '@/components/content/rich-text'
import { ContactCta } from '@/components/ui'
import { lerContato } from '@/lib/contato'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toPostDetail } from '@/lib/mappers/post'
import { mapearOuFaltando } from '@/lib/mappers/shared'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { PostDetail } from '@/types/content'
import { metadataDe } from '@/lib/seo'
import { artigo } from '@/lib/jsonld'
import { ORIGEM } from '@/lib/seo'
import { DadosEstruturados } from '@/components/layout/dados-estruturados'

/* /blog/[slug] (MIG-044).
 *
 * ⚠️ **Esta rota não existe no legado.** Os cards do blog apontam para `#`
 * (`legacy/src/pages/Blog.tsx:229`); a página de detalhe foi decidida em D-08,
 * não portada. Consequências práticas:
 *
 * - **Não há gabarito**, então a regressão visual não cobre esta rota. O que a
 *   verifica é `smoke.spec.ts`: responde 200, rascunho não vaza, e post sem
 *   corpo sai com `noindex`.
 * - O layout é composto do que já foi portado — mesma abertura da página de
 *   case, mesmo `RichText`, mesmo `ContactCta` — em vez de inventar uma
 *   linguagem visual nova para uma única rota. */

const TEXTOS = {
  pt: {
    voltar: 'Voltar para o blog',
    prefixo: 'Artigo',
    semCorpoTitulo: 'Conteúdo em preparação',
    semCorpoTexto:
      'Este artigo ainda não tem texto publicado. Assim que estiver pronto, ele aparece aqui.',
    ctaTitulo: 'Quer conversar sobre',
    ctaDestaque: 'o seu projeto?',
    ctaDescricao:
      'Nossos especialistas ajudam a transformar dados em decisão. Fale com a gente e descubra o que dá para fazer com o que você já tem.',
    ctaTelefone: 'Telefone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Fale com um especialista',
  },
  en: {
    voltar: 'Back to the blog',
    prefixo: 'Post',
    semCorpoTitulo: 'Content in preparation',
    semCorpoTexto: 'This post has no published text yet. It shows up here as soon as it is ready.',
    ctaTitulo: 'Want to talk about',
    ctaDestaque: 'your project?',
    ctaDescricao:
      'Our specialists turn data into decisions. Talk to us and find out what can be done with what you already have.',
    ctaTelefone: 'Phone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Talk to a specialist',
  },
} as const

type Resultado = { doc: PostDetail } | { faltando: string } | null

async function buscarPost(slug: string, locale: Locale): Promise<Resultado> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 1,
    draft: rascunho,
    where: rascunho
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  if (!docs[0]) return null
  return mapearOuFaltando(() => toPostDetail(docs[0]))
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'posts',
      locale,
      depth: 0,
      limit: 500,
      where: { _status: { equals: 'published' } },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const r = await buscarPost(slug, locale)
  if (!r || !('doc' in r)) return {}
  const post = r.doc

  /* `corpo` aplica D-08: artigo sem texto existe para quem tem o link e é
     invisível para busca — página magra prejudica o domínio inteiro. */
  return metadataDe({ locale, local: { secao: 'blog', slug }, seo: post.seo, corpo: post.body })
}

export default async function PostPage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const resultado = await buscarPost(slug, locale)
  if (!resultado) notFound()

  const t = TEXTOS[locale]
  const contato = await lerContato()

  if ('faltando' in resultado) {
    return (
      <main className="min-h-screen bg-surface-1 text-text-main pt-40 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <RascunhoIncompleto campos={[resultado.faltando]} />
        </div>
      </main>
    )
  }

  const post = resultado.doc
  const dadosDoArtigo = artigo({
    seo: post.seo,
    url: `${ORIGEM}${hrefDe('blog', locale, post.slug)}`,
    publicadoEm: post.publishedAt,
  })
  const data = new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(post.publishedAt))

  return (
    <main className="min-h-screen bg-white">
      {/* Invisível: vai num `<script type="application/ld+json">`. */}
      <DadosEstruturados dados={dadosDoArtigo} />
      <section className="relative min-h-[50vh] md:min-h-[60vh] bg-primary overflow-hidden flex items-center pt-32 md:pt-48 pb-16">
        <div className="absolute inset-0">
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            href={hrefDe('blog', locale)}
            className="inline-flex items-center gap-2 text-white font-bold mb-8 hover:gap-3 hover:text-secondary transition-all"
          >
            <ChevronLeft size={20} aria-hidden /> {t.voltar}
          </Link>
          <div className="max-w-4xl">
            <div className="text-secondary font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4 flex items-center gap-2">
              <Calendar size={14} aria-hidden />
              {t.prefixo} — {data}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">{post.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-10">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-[4px] bg-slate-50 text-[10px] font-medium text-slate-500 uppercase flex items-center gap-1 "
                  >
                    <Tag size={10} className="text-primary/70" aria-hidden /> {tag}
                  </span>
                ))}
              </div>
            )}

            {post.body ? (
              <RichText data={post.body} />
            ) : (
              <div className="rounded-[6px]  bg-slate-50 p-8 text-center mb-12">
                <h2 className="font-bold text-slate-900 mb-1">{t.semCorpoTitulo}</h2>
                <p className="text-sm text-slate-600">{t.semCorpoTexto}</p>
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
