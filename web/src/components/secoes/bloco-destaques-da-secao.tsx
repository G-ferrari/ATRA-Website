import { ArrowUpRight, Calendar, Download, Newspaper, Play } from 'lucide-react'

import { FeaturedHero, type FeaturedHeroProps, type FeaturedItem } from '@/components/ui'
import { itensEmDestaque } from '@/lib/destaques-da-secao'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { BlocoSectionFeatured } from '@/types/content'

import { origemDaMateria } from './lista-de-midia'
import { TEXTOS_DAS_SECOES } from './textos'

function dataPorExtenso(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/**
 * "Destaques da seção" (feature paginas-mestras, D-55): o carrossel do topo de
 * Webinars, Cases, Blog, ATRA na mídia e E-books, com os itens e o desenho que
 * cada rota tinha. Quantos itens entram é regra de `itensEmDestaque` — a mesma
 * conta que o resolvedor usa para saber se o carrossel abre a página.
 *
 * O texto do botão é o do bloco; vazio, vale o de sempre da seção.
 */
export function BlocoDestaquesDaSecao({ bloco, locale }: { bloco: BlocoSectionFeatured; locale: Locale }) {
  const { conteudo } = bloco
  const n = itensEmDestaque(conteudo)
  if (!conteudo || n === 0) return null

  const t = TEXTOS_DAS_SECOES[locale]
  const calendario = <Calendar size={15} aria-hidden />
  let props: FeaturedHeroProps

  switch (conteudo.secao) {
    case 'webinars':
      props = {
        items: conteudo.webinars.slice(0, n).map(
          (w): FeaturedItem => ({
            id: w.slug,
            title: w.title,
            description: w.description,
            tags: w.tags,
            image: w.image,
            href: hrefDe('webinars', locale, w.slug),
            eyebrow: `${t.webinars.eyebrow} • ${w.dateLabel}`,
            thumbLabel: w.dateLabel,
          }),
        ),
        actionLabel: bloco.actionLabel ?? t.acaoPadrao.webinars,
        actionIcon: <Play size={20} aria-hidden />,
        eyebrowIcon: calendario,
        acaoSecundaria: { label: t.webinars.acaoSecundaria },
      }
      break

    case 'cases':
      props = {
        items: conteudo.cases.slice(0, n).map(
          (c): FeaturedItem => ({
            id: c.slug,
            title: c.title,
            description: c.summary,
            tags: c.topics.map((topico) => topico.name),
            image: c.image,
            href: hrefDe('cases', locale, c.slug),
            /* O nome do cliente, e some quando não há (cliente opcional, 03/10). */
            eyebrow: c.client,
            thumbLabel: c.client,
          }),
        ),
        actionLabel: bloco.actionLabel ?? t.acaoPadrao.cases,
        eyebrowIcon: calendario,
      }
      break

    case 'blog':
      props = {
        items: conteudo.posts.slice(0, n).map((p): FeaturedItem => {
          /* type 'blog' no legado devolve a data crua como subtexto
           * (`FeaturedHero.tsx:57`) — sem prefixo, ao contrário de webinar. */
          const data = dataPorExtenso(p.publishedAt, locale)
          return {
            id: p.slug,
            title: p.title,
            description: p.description,
            tags: p.tags,
            image: p.image,
            href: hrefDe('blog', locale, p.slug),
            eyebrow: data,
            thumbLabel: data,
          }
        }),
        actionLabel: bloco.actionLabel ?? t.acaoPadrao.blog,
        eyebrowIcon: calendario,
      }
      break

    case 'midia': {
      const ler = bloco.actionLabel ?? t.acaoPadrao.midia
      props = {
        items: conteudo.materias.slice(0, n).map(
          (m): FeaturedItem => ({
            id: m.id,
            title: m.title,
            description: m.description,
            tags: [],
            image: m.image,
            href: m.url,
            /* A matéria abre no site do veículo; vídeo pede "Assistir". */
            externo: true,
            actionLabel: m.kind === 'video' ? t.midia.assistir : ler,
            eyebrow: origemDaMateria(m, locale),
            thumbLabel: m.outlet,
          }),
        ),
        actionLabel: ler,
        actionIcon: <ArrowUpRight size={18} aria-hidden />,
        eyebrowIcon: <Newspaper size={15} aria-hidden />,
      }
      break
    }

    case 'ebooks':
      props = {
        /* Sem `eyebrow`: o e-book não tem data no legado, e `getSubtext`
         * devolvia `undefined`, que esconde a linha inteira. */
        items: conteudo.materiais.slice(0, n).map(
          (r): FeaturedItem => ({
            id: r.slug,
            title: r.title,
            description: r.description,
            tags: r.tags,
            image: r.image,
            href: hrefDe('ebooks', locale, r.slug),
            eyebrow: null,
            thumbLabel: null,
          }),
        ),
        actionLabel: bloco.actionLabel ?? t.acaoPadrao.ebooks,
        actionIcon: <Download size={20} aria-hidden />,
        eyebrowIcon: calendario,
        variante: 'cover',
        rotuloDaCapa: t.ebooks.rotuloDaCapa,
      }
      break

    default:
      return null
  }

  return <FeaturedHero {...props} />
}
