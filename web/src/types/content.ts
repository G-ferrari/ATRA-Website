/* Tipos de APRESENTAÇÃO.
 *
 * Não substituem `@/payload-types` — derivam dele. A regra do contrato de dados:
 * componente recebe estes tipos e nunca conhece o schema do CMS. Trocar o nome
 * de um campo no Payload quebra um mapper, não oito componentes.
 *
 * Ver docs/02-especificacao/contratos-de-dados.md. */

export type Image = {
  url: string
  /** Obrigatório no schema do Media — nunca chega indefinido aqui. */
  alt: string
  width: number
  height: number
}

export type Topic = {
  slug: string
  name: string
}

export type PartnerBadge = {
  name: string
  slug: string
  logo: Image | null
}

export type Testimonial = {
  quote: string
  /** `null` → o componente mostra monograma com as iniciais (D-14). */
  authorName: string | null
  authorRole: string
  company: string
  photo: Image | null
}

export type CaseCard = {
  slug: string
  title: string
  client: string
  summary: string
  impact: string | null
  image: Image
  topics: Topic[]
  /** ISO 8601. A formatação é do componente, no locale ativo. */
  publishedAt: string
}

export type CaseDetail = CaseCard & {
  /** Linha de abertura da página. Cai em `summary` quando não preenchida. */
  heroSubtitle: string
  challenges: string[]
  /** Documento Lexical serializado; o componente usa o conversor do Payload. */
  solution: unknown | null
  results: string[]
  technologies: string[]
  partners: PartnerBadge[]
  testimonial: Testimonial | null
  aboutClient: string | null
}

export type GlossaryTerm = {
  slug: string
  term: string
  definition: string
  category: string
}

export type Resource = {
  slug: string
  kind: 'report' | 'ebook'
  title: string
  description: string
  image: Image
  tags: string[]
  /** Só para e-book; `null` em relatório. */
  pages: number | null
  /** ISO 8601. */
  publishedAt: string
}

export type Webinar = {
  slug: string
  title: string
  description: string
  image: Image
  tags: string[]
  /** Texto livre no legado ("Amanhã, 15:00"), não data formatada. */
  dateLabel: string
  duration: string
  videoUrl: string | null
}

export type PostCard = {
  slug: string
  title: string
  description: string
  image: Image
  tags: string[]
  /** ISO 8601; o componente formata no locale ativo. */
  publishedAt: string
}

export type PostDetail = PostCard & {
  /** Documento Lexical serializado; `null` enquanto ninguém escreveu. */
  body: unknown | null
}

export type ResourceDetail = Resource & {
  /** Documento Lexical serializado; `null` enquanto ninguém escreveu. */
  body: unknown | null
}

/* Blocos de página (MIG-047).
 *
 * União discriminada por `tipo`: o componente que despacha faz `switch` e o
 * TypeScript garante que nenhum caso ficou de fora. Adicionar bloco sem tratar
 * o novo caso não compila. */

export type TemaDoBloco = 'surface-1' | 'surface-2'

type Base = {
  id: string
  anchor: string | null
  theme: TemaDoBloco
}

export type BlocoPageHero = Base & {
  tipo: 'pageHero'
  badge: string | null
  chip: string | null
  title: string
  /** Trecho de `title` pintado de azul; o componente o localiza no texto. */
  highlight: string | null
  description: string | null
  ctas: { label: string; href: string }[]
  mediaMode: 'none' | 'image' | 'marquee'
  images: Image[]
}

export type BlocoRichTextSection = Base & {
  tipo: 'richTextSection'
  eyebrow: string | null
  title: string | null
  body: unknown | null
  image: Image | null
  imagePosition: 'left' | 'right' | 'none'
}

export type BlocoIconCardGrid = Base & {
  tipo: 'iconCardGrid'
  eyebrow: string | null
  title: string | null
  columns: 2 | 3 | 4
  variant: 'compact' | 'card'
  items: { icon: string; title: string; description: string | null }[]
}

export type BlocoCtaBanner = Base & {
  tipo: 'ctaBanner'
  title: string
  highlight: string | null
  description: string | null
  cta: { label: string; href: string } | null
  variant: 'primary' | 'subtle'
}

export type MetricaInstitucional = {
  value: number
  suffix: string
  label: string
  icon: string | null
}

export type BlocoStatsGrid = Base & {
  tipo: 'statsGrid'
  /** Já resolvido pela página: o bloco não sabe de onde os números vieram. */
  items: MetricaInstitucional[]
}

export type BlocoPartnerShowcase = Base & {
  tipo: 'partnerShowcase'
  title: string | null
  partners: PartnerBadge[]
  grayscale: boolean
}

export type BlocoValueCards = Base & {
  tipo: 'valueCards'
  title: string | null
  items: { icon: string; glowColor: 'blue' | 'orange'; title: string; description: string }[]
}

export type BlocoStickyPageNav = Base & {
  tipo: 'stickyPageNav'
  /** Derivados dos blocos com `anchor`; o editor não os digita. */
  items: { anchor: string; label: string }[]
}

export type Bloco =
  | BlocoPageHero
  | BlocoRichTextSection
  | BlocoIconCardGrid
  | BlocoCtaBanner
  | BlocoStatsGrid
  | BlocoPartnerShowcase
  | BlocoValueCards
  | BlocoStickyPageNav

export type Seo = {
  title: string
  description: string
  image: Image | null
  noIndex: boolean
}
