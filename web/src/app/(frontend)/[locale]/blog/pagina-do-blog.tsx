import { Calendar, Play, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FeaturedHero, MetricChip, StatusBadge, type FeaturedItem } from '@/components/ui'
import { buscarPostsDoBlog } from '@/lib/blog'
import type { Locale } from '@/lib/locales'
import { toWebinar } from '@/lib/mappers/webinar'
import { POR_PAGINA, totalDePaginas } from '@/lib/paginacao'
import { getPayload } from '@/lib/payload'
import { hrefDe, SEGMENTO_DE_PAGINA } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { metadataDe } from '@/lib/seo'
import type { PostCard } from '@/types/content'

import { ListaDeArtigos } from './lista-de-artigos'

/* /blog (MIG-043) — porte de `legacy/src/pages/Blog.tsx`, com paginação de
 * verdade desde 02/10 (D-47).
 *
 * Duas rotas desenham esta página: `/blog` (a primeira) e
 * `/blog/pagina/[numero]` (as seguintes). Cada página é um endereço
 * pré-montado, com 12 artigos; o destaque do topo só existe na primeira — quem
 * foi à página 5 já passou por ele e quer a lista. */

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
    metaTituloDaPagina: (n: number) => `Blog — página ${n}`,
    metaDescription: 'Artigos técnicos sobre dados, IA, cloud e governança aplicados a negócios.',
    paginaDe: (n: number, total: number) => `Página ${n} de ${total}`,
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
    metaTituloDaPagina: (n: number) => `Blog — page ${n}`,
    metaDescription: 'Technical articles on data, AI, cloud and governance applied to business.',
    paginaDe: (n: number, total: number) => `Page ${n} of ${total}`,
  },
} as const

/** Metadata de uma página do blog. Cada uma é canônica de si mesma: o conteúdo
 *  é outro, e apontar todas para `/blog` esconderia do Google os artigos antigos. */
export function metadataDoBlog(locale: Locale, pagina: number): Metadata {
  const t = TEXTOS[locale]
  return metadataDe({
    locale,
    local: pagina <= 1 ? { secao: 'blog' } : { secao: 'blog', slug: `${SEGMENTO_DE_PAGINA}/${pagina}` },
    seo: {
      title: pagina <= 1 ? t.metaTitle : t.metaTituloDaPagina(pagina),
      description: t.metaDescription,
      image: null,
      noIndex: false,
    },
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

export async function PaginaDoBlog({ locale, pagina }: { locale: Locale; pagina: number }) {
  const t = TEXTOS[locale]
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const posts = await buscarPostsDoBlog(locale, rascunho)
  const total = totalDePaginas(posts.length)
  /* Página além da última não existe — 404, e não uma lista vazia com 200, que
     o Google indexaria como página magra. */
  if (pagina > total) notFound()
  const primeira = pagina === 1

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

  const Titulo = primeira ? 'h2' : 'h1'
  const cabecalho = (
    <div key="cabecalho-blog">
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
        <MetricChip label={t.chip} variant="neutral" size="sm" />
      </div>
      {/* Na primeira página o `h1` é o do destaque; nas seguintes não há
          destaque, e este título é o da página. */}
      <Titulo className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight">
        {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
      </Titulo>
      {!primeira && <p className="mt-2 text-xs sm:text-sm text-text-muted font-light">{t.paginaDe(pagina, total)}</p>}
    </div>
  )

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      {primeira && posts.length > 0 && (
        <FeaturedHero
          items={posts.slice(0, DESTAQUES).map((p) => paraDestaque(p, locale))}
          actionLabel={t.acao}
          eyebrowIcon={<Calendar size={15} aria-hidden />}
        />
      )}

      {/* Sem o destaque, a seção é o topo da página e precisa do respiro que ele
          dava sob o cabeçalho fixo — os mesmos `pt-28/36/44` do `FeaturedHero`. */}
      <section
        className={cn(
          'pb-20 md:pb-24 bg-surface-1 dark:bg-[#0e1015]',
          primeira ? 'pt-20 md:pt-24' : 'pt-28 sm:pt-36 md:pt-44',
        )}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <ListaDeArtigos
            posts={posts}
            pagina={pagina}
            porPagina={POR_PAGINA}
            categorias={CATEGORIAS}
            locale={locale}
            cabecalho={cabecalho}
          />
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
