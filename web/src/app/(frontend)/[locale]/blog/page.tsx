import { Calendar, Play, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { FeaturedHero, MetricChip, StatusBadge, type FeaturedItem } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toPostCard } from '@/lib/mappers/post'
import { toWebinar } from '@/lib/mappers/webinar'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { PostCard } from '@/types/content'

import { ListaDeArtigos } from './lista-de-artigos'
import { metadataDe } from '@/lib/seo'

/* /blog (MIG-043) — porte de `legacy/src/pages/Blog.tsx`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/** O legado destaca os 3 primeiros (`Blog.tsx:70`). */
const DESTAQUES = 3

/* Barra de filtro: lista fixa no legado (`Blog.tsx:62`), não derivada das tags.
 * Fica aqui, e não em `topics`, porque é o vocabulário do blog e não coincide
 * com as tags dos cards — "Managed IT" e "Retail" aparecem nos posts e não na
 * barra. Vira campo do CMS quando alguém quiser mudar sem deploy. */
const CATEGORIAS = ['Business', 'IA', 'Cloud', 'Analytics', 'Cybersecurity', 'Strategy']

const TEXTOS = {
  pt: {
    badge: 'Conhecimento & Inovação',
    chip: 'Artigos Técnicos',
    titulo: 'Todos os',
    tituloDestaque: 'artigos',
    acao: 'Ler artigo completo',
    destaqueSelo: 'Destaque Multimídia',
    destaqueTitulo: 'Assista aos nossos',
    destaqueTituloDestaque: 'Webinars',
    destaqueTituloFim: 'técnicos',
    destaqueTexto:
      'Aprenda com nossos especialistas as melhores práticas, tendências e casos reais de uso de dados, nuvem e Inteligência Artificial no ecossistema corporativo.',
    destaqueAcao: 'Começar a assistir',
    metaTitle: 'Blog',
    metaDescription: 'Artigos técnicos sobre dados, IA, cloud e governança aplicados a negócios.',
  },
  en: {
    badge: 'Knowledge & Innovation',
    chip: 'Technical articles',
    titulo: 'All',
    tituloDestaque: 'posts',
    acao: 'Read the full post',
    destaqueSelo: 'Multimedia highlight',
    destaqueTitulo: 'Watch our technical',
    destaqueTituloDestaque: 'Webinars',
    destaqueTituloFim: '',
    destaqueTexto:
      'Learn best practices, trends and real use cases of data, cloud and AI in the enterprise, from our specialists.',
    destaqueAcao: 'Start watching',
    metaTitle: 'Blog',
    metaDescription: 'Technical articles on data, AI, cloud and governance applied to business.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const t = TEXTOS[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'blog' },
    seo: { title: t.metaTitle, description: t.metaDescription, image: null, noIndex: false },
  })
}

function paraDestaque(p: PostCard, locale: Locale): FeaturedItem {
  return {
    id: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    image: p.image,
    href: hrefDe('blog', locale, p.slug),
    /* type 'blog' no legado devolve `activeItem.date` cru como subtexto
     * (`FeaturedHero.tsx:57`) — sem prefixo, ao contrário de case e webinar. */
    eyebrow: new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(p.publishedAt)),
    thumbLabel: new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(p.publishedAt)),
  }
}

export default async function BlogPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  /* ⚠️ `select` não é otimização prematura aqui: sem ele a consulta traz o
   * `body` inteiro dos 100 artigos — JSONB de artigo de blog, não um campo curto
   * — só para desenhar cartão. Medido depois da importação dos 207: 536ms sem
   * `select`, 68ms com. É a mesma armadilha que já custou caro em `solutions`. */
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 100,
    sort: '-publishedAt',
    draft: rascunho,
    ...(rascunho ? {} : { where: { _status: { equals: 'published' } } }),
    select: { title: true, slug: true, description: true, coverImage: true, tags: true, publishedAt: true },
  })
  const posts = docs.map(toPostCard)

  /* A capa da chamada final vem do primeiro webinar, não de um post: a seção
   * fala de webinars e leva para /webinars. No legado é um hotlink fixo do
   * Unsplash (`Blog.tsx:329`), sem relação com o conteúdo. */
  const { docs: webinars } = await payload.find({
    collection: 'webinars',
    locale,
    depth: 1,
    limit: 1,
    sort: 'order',
    where: { _status: { equals: 'published' } },
  })
  const capaDoWebinar = webinars[0] ? toWebinar(webinars[0]).image : null

  const cabecalho = (
    <div key="cabecalho-blog">
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
        <MetricChip label={t.chip} variant="neutral" size="sm" />
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight">
        {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
      </h2>
    </div>
  )

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      {posts.length > 0 && (
        <FeaturedHero
          items={posts.slice(0, DESTAQUES).map((p) => paraDestaque(p, locale))}
          actionLabel={t.acao}
          eyebrowIcon={<Calendar size={15} aria-hidden />}
        />
      )}

      <section className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <ListaDeArtigos posts={posts} categorias={CATEGORIAS} locale={locale} cabecalho={cabecalho} />
        </div>
      </section>

      {/* Chamada para os webinars, no fim da listagem (`Blog.tsx:283`). */}
      <section className="py-20 md:py-24 bg-surface-2 dark:bg-[#13161c] border-t border-b border-slate-200 dark:border-white/10 text-text-main dark:text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] opacity-40 dark:opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(60, 152, 250, 0.4) 0%, rgba(60, 152, 250, 0) 70%)' }}
          />
          <div
            className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] opacity-30 dark:opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.35) 0%, rgba(253, 186, 116, 0) 70%)' }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-6">
                <Sparkles size={13} aria-hidden />
                <span>{t.destaqueSelo}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 md:mb-6 leading-tight text-text-main dark:text-white">
                {t.destaqueTitulo} <span className="text-primary font-normal">{t.destaqueTituloDestaque}</span>{' '}
                {t.destaqueTituloFim}
              </h2>
              <p className="text-sm md:text-base text-text-muted dark:text-gray-300 mb-8 max-w-xl font-light leading-relaxed">
                {t.destaqueTexto}
              </p>
              <Link
                href={hrefDe('webinars', locale)}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-[6px] font-bold text-xs sm:text-sm transition-all shadow-md shadow-primary/25 cursor-pointer active:scale-95"
              >
                <Play size={16} fill="currentColor" aria-hidden />
                <span>{t.destaqueAcao}</span>
              </Link>
            </div>

            <div className="flex-1 w-full max-w-2xl">
              <Link
                href={hrefDe('webinars', locale)}
                className="block aspect-video rounded-[6px] overflow-hidden relative group shadow-2xl  cursor-pointer bg-surface-1 dark:bg-[#0e1015]"
              >
                {capaDoWebinar && (
                  <Image
                    src={capaDoWebinar.url}
                    alt={capaDoWebinar.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-xl shadow-primary/30">
                    <Play className="fill-white ml-0.5" size={24} aria-hidden />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
