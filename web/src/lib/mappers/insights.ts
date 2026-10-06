import type { Locale } from '@/lib/locales'
import { nomeDaSecao } from '@/lib/paginas-mestras'
import { hrefDe } from '@/lib/routes'
import type {
  CartaoDeInsight,
  CaseCard,
  FaixaDeInsights,
  MateriaDaImprensa,
  PostCard,
  Resource,
  TipoDeInsight,
  Webinar,
} from '@/types/content'

/** O que a Insights recebe de cada collection, já em cartão de apresentação. */
export type UltimosConteudos = {
  cases: CaseCard[]
  posts: PostCard[]
  webinars: Webinar[]
  materias: MateriaDaImprensa[]
  ebooks: Resource[]
}

/** Quantos itens por faixa (decisão de 05/10). */
export const POR_FAIXA = 3

/** Mais que isso e o cartão vira lista de etiquetas. */
const ETIQUETAS = 3

const SELO = {
  pt: { paginas: (n: number) => `${n} páginas` },
  en: { paginas: (n: number) => `${n} pages` },
} as const

function data(iso: string | null, locale: Locale): string | null {
  if (!iso) return null
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** "A • B", sem marcador solto quando falta um dos dois. */
const juntar = (...partes: (string | null)[]) => partes.filter(Boolean).join(' • ') || null

/**
 * As faixas da Insights (feature paginas-mestras, D-55): uma por tipo, na
 * ordem Cases, Blog, Webinars, ATRA na mídia, E-books, cada uma com os
 * primeiros da seção — os mesmos que abrem a página da seção, na mesma ordem —
 * e o "Ver todos" para ela. Tipo sem conteúdo publicado não tem faixa.
 *
 * É aqui, e só aqui, que se sabe onde cada collection guarda quem e quando: o
 * cliente do case, o veículo da matéria, a data em texto livre do webinar.
 */
export function faixasDeInsights(c: UltimosConteudos, locale: Locale): FaixaDeInsights[] {
  const faixa = (tipo: TipoDeInsight, itens: CartaoDeInsight[]): FaixaDeInsights => ({
    tipo,
    titulo: nomeDaSecao(tipo, locale),
    verTodos: hrefDe(tipo, locale),
    itens: itens.slice(0, POR_FAIXA),
  })

  const faixas = [
    faixa(
      'cases',
      c.cases.map((x) => ({
        id: x.slug,
        title: x.title,
        description: x.summary,
        image: x.image,
        href: hrefDe('cases', locale, x.slug),
        externo: false,
        origem: juntar(x.client, data(x.publishedAt, locale)),
        selo: null,
        tags: x.topics.map((t) => t.name).slice(0, ETIQUETAS),
      })),
    ),
    faixa(
      'blog',
      c.posts.map((x) => ({
        id: x.slug,
        title: x.title,
        description: x.description,
        image: x.image,
        href: hrefDe('blog', locale, x.slug),
        externo: false,
        origem: data(x.publishedAt, locale),
        selo: null,
        tags: x.tags.slice(0, ETIQUETAS),
      })),
    ),
    faixa(
      'webinars',
      c.webinars.map((x) => ({
        id: x.slug,
        title: x.title,
        description: x.description,
        image: x.image,
        href: hrefDe('webinars', locale, x.slug),
        externo: false,
        /* Texto livre no admin ("Amanhã, 15:00"), não data formatada. */
        origem: x.dateLabel || null,
        selo: x.duration || null,
        tags: x.tags.slice(0, ETIQUETAS),
      })),
    ),
    faixa(
      'midia',
      c.materias.map((x) => ({
        id: x.id,
        title: x.title,
        description: x.description,
        image: x.image,
        href: x.url,
        externo: true,
        origem: juntar(x.outlet, data(x.publishedAt, locale)),
        selo: null,
        tags: [],
      })),
    ),
    faixa(
      'ebooks',
      c.ebooks.map((x) => ({
        id: x.slug,
        title: x.title,
        description: x.description,
        image: x.image,
        href: hrefDe('ebooks', locale, x.slug),
        externo: false,
        /* Como na página dos e-books: sem data. */
        origem: null,
        selo: x.pages ? SELO[locale].paginas(x.pages) : null,
        tags: x.tags.slice(0, ETIQUETAS),
      })),
    ),
  ]
  return faixas.filter((f) => f.itens.length > 0)
}
