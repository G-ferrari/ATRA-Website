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

export type Seo = {
  title: string
  description: string
  image: Image | null
  noIndex: boolean
}
