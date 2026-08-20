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
  /** Altura de exibição do logo; varia por marca. */
  logoScale: 'sm' | 'md' | 'lg'
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
  navLabel: string | null
  theme: TemaDoBloco
  borda: 'nenhuma' | 'topo' | 'ambas'
  espaco: 'normal' | 'amplo'
}

export type BlocoPageHero = Base & {
  tipo: 'pageHero'
  badge: string | null
  chip: string | null
  title: string
  /** Trechos de `title` pintados de azul; o componente os localiza no texto. */
  highlight: string[]
  subtitle: string | null
  description: string | null
  align: 'left' | 'center'
  ctas: { label: string; href: string }[]
  ctaVariant: 'primary' | 'secondary'
  descriptionWidth: 'narrow' | 'wide'
  mediaMode: 'none' | 'image' | 'marquee'
  images: Image[]
  /** Números da própria oferta, não da empresa — o `statsGrid` é que lê o global. */
  metrics: { value: number; suffix: string; label: string; color: 'primary' | 'secondary' | 'emerald' }[]
}

export type BlocoRichTextSection = Base & {
  tipo: 'richTextSection'
  eyebrow: string | null
  title: string | null
  headerLayout: 'inline' | 'centered'
  /** Só no cabeçalho centralizado; a coluna de texto usa `body`. */
  description: string | null
  subtitle: string | null
  callout: { label: string | null; text: string | null } | null
  body: unknown | null
  image: Image | null
  imagePosition: 'left' | 'right' | 'none'
  ctas: { label: string; href: string }[]
}

export type BlocoIconCardGrid = Base & {
  tipo: 'iconCardGrid'
  eyebrow: string | null
  title: string | null
  columns: 2 | 3 | 4
  variant: 'compact' | 'card' | 'card-centered'
  headerWidth: 'full' | 'narrow'
  items: { icon: string; title: string; description: string | null }[]
}

/* Blocos do template de página de parceiro (MIG-054a). A justificativa de cada
 * um está em `src/blocks/index.ts`, junto da definição. */

export type BlocoPartnerHero = Base & {
  tipo: 'partnerHero'
  badge: string | null
  chip: string | null
  title: string
  highlight: string | null
  description: string | null
  logo: Image | null
  awards: { topText: string | null; title: string; highlight: string | null }[]
  cta: { label: string; href: string } | null
}

export type BlocoPartnerSplit = Base & {
  tipo: 'partnerSplit'
  eyebrow: string | null
  title: string
  /** Parágrafos separados; o gabarito preserva as quebras dentro de cada um. */
  body: string[]
  rightColumn: 'image' | 'checklist' | 'specGrid'
  image: Image | null
  imageLabel: string | null
  logo: Image | null
  items: string[]
  cta: { label: string; href: string } | null
  linkCta: { label: string; href: string } | null
}

/* Blocos da home (MIG-057). */

export type BlocoHomeHero = Base & {
  tipo: 'homeHero'
  titlePrefix: string
  rotatingWords: string[]
  description: string | null
  scrollLabel: string | null
  prompt: {
    title: string | null
    placeholder: string | null
    disclaimer: string | null
    clientsTitle: string | null
    clients: { name: string; logo: Image; boost: boolean }[]
  } | null
}

export type BlocoLogoMarquee = Base & {
  tipo: 'logoMarquee'
  title: string | null
  partners: { name: string; logo: Image }[]
}

export type BlocoFeatureTabs = Base & {
  tipo: 'featureTabs'
  eyebrow: string | null
  title: string
  description: string | null
  footnote: string | null
  cta: { label: string; href: string } | null
  items: { icon: string; badge: string; title: string; description: string; image: Image | null }[]
}

export type BlocoHomeBento = Base & {
  tipo: 'homeBento'
  partnerCard: {
    eyebrow: string | null
    title: string | null
    description: string | null
    items: { name: string; subtitle: string | null; logo: Image | null }[]
  } | null
  sealsCard: {
    eyebrow: string | null
    counter: string | null
    title: string | null
    description: string | null
    badge: string | null
    footnote: string | null
    seals: Image[]
  } | null
  metrics: { icon: string; tag: string; value: string; label: string; color: 'primary' | 'secondary' }[]
}

export type BlocoCaseCarousel = Base & {
  tipo: 'caseCarousel'
  eyebrow: string | null
  title: string
  description: string | null
  readLabel: string | null
  cta: { label: string; href: string } | null
  items: {
    icon: string
    company: string
    title: string
    description: string
    href: string
    image: Image | null
    color: string
  }[]
}

export type BlocoTestimonialCarousel = Base & {
  tipo: 'testimonialCarousel'
  title: string
  items: { text: string; client: string; role: string; avatar: Image | null }[]
}

export type BlocoContentTeaser = Base & {
  tipo: 'contentTeaser'
  eyebrow: string | null
  title: string
  description: string | null
  cards: {
    icon: string
    category: string
    title: string
    href: string | null
    image: Image | null
    column: 'first' | 'second'
  }[]
  featured: {
    category: string | null
    title: string | null
    ctaLabel: string | null
    href: string | null
    image: Image | null
  } | null
  newsletter: { title: string | null; placeholder: string | null } | null
}

export type BlocoCtaBanner = Base & {
  tipo: 'ctaBanner'
  title: string
  highlight: string | null
  description: string | null
  cta: { label: string; href: string } | null
  secondaryCta: { label: string; href: string; caption: string | null } | null
  variant: 'primary' | 'subtle' | 'dark' | 'dark-centered'
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

export type Selo = {
  name: string
  image: Image
}

export type BlocoSealsBanner = Base & {
  tipo: 'sealsBanner'
  title: string | null
  seals: Selo[]
}

export type BlocoProcessSteps = Base & {
  tipo: 'processSteps'
  eyebrow: string | null
  title: string | null
  description: string | null
  steps: { title: string; description: string }[]
}

export type BlocoPartnerShowcase = Base & {
  tipo: 'partnerShowcase'
  title: string | null
  partners: PartnerBadge[]
  grayscale: boolean
}

export type BlocoValueCards = Base & {
  tipo: 'valueCards'
  eyebrow: string | null
  title: string | null
  highlight: string | null
  /** Só no cartão alto; o curto não tem descrição de cabeçalho. */
  description: string | null
  variant: 'glow' | 'expanded'
  items: {
    icon: string
    glowColor: 'blue' | 'orange'
    title: string
    /** No cartão alto vira a tagline colorida — mesmo texto, outra cor. */
    description: string
    bullets: string[]
  }[]
}

export type BlocoStickyPageNav = Base & {
  tipo: 'stickyPageNav'
  variant: 'institutional' | 'solution'
  bottomGap: 'normal' | 'none'
  /** Derivados dos blocos com `anchor`; o editor não os digita. */
  items: { anchor: string; label: string }[]
}

export type Vaga = {
  slug: string
  title: string
  area: string
  locationLabel: string
}

export type VagaDetalhe = Vaga & {
  summary: string
  /** Documento Lexical serializado; `null` enquanto ninguém escreveu. */
  body: unknown | null
}

export type BlocoCtaContact = Base & {
  tipo: 'ctaContact'
  variant: 'panel' | 'photo'
  photo: Image | null
  title: string
  subtitle: string | null
  showContactCard: boolean
}

export type BlocoJobsList = Base & {
  tipo: 'jobsList'
  eyebrow: string | null
  title: string | null
  description: string | null
  emptyText: string | null
  /** O cartão "Banco de Talentos" fica **dentro** desta seção, sob a grade. */
  talentBank: {
    eyebrow: string | null
    title: string | null
    highlight: string | null
    description: string | null
    note: string | null
  } | null
  /** Resolvido pela página, das vagas publicadas. */
  vagas: Vaga[]
}

/* Blocos da página de solução (MIG-056) — a justificativa de cada um está em
 * `src/blocks/index.ts`, junto da definição. */

export type Acento = 'primary' | 'secondary'

/** Cabeçalho com pílula de seção, comum às quatro seções de `SolutionAI.tsx`. */
type ComCabecalho = {
  eyebrow: string | null
  eyebrowIcon: string | null
  title: string
  description: string | null
}

export type BlocoMethodCards = Base &
  ComCabecalho & {
    tipo: 'methodCards'
    headerCta: { label: string; href: string } | null
    items: {
      icon: string
      accent: Acento
      badge: string | null
      title: string
      description: string
      bullets: string[]
    }[]
  }

export type BlocoBentoGrid = Base &
  ComCabecalho & {
    tipo: 'bentoGrid'
    items: {
      span: '5' | '6' | '7' | '12'
      size: 'featured-wide' | 'featured' | 'supporting'
      accent: Acento
      icon: string | null
      badge: string | null
      chip: string | null
      title: string
      description: string
      metrics: { value: string; label: string; color: 'primary' | 'secondary' | 'emerald' }[]
      tags: string[]
      bullets: string[]
      footer: string | null
      footerIcon: string | null
    }[]
  }

export type BlocoAudienceSplit = Base &
  ComCabecalho & {
    tipo: 'audienceSplit'
    cta: { label: string; href: string } | null
    items: { icon: string; accent: Acento; title: string; description: string }[]
  }

export type BlocoAccordionSteps = Base &
  ComCabecalho & {
    tipo: 'accordionSteps'
    image: Image | null
    imageBadge: { icon: string | null; title: string; subtitle: string | null } | null
    steps: { title: string; description: string }[]
  }

export type Bloco =
  | BlocoPageHero
  | BlocoRichTextSection
  | BlocoIconCardGrid
  | BlocoCtaBanner
  | BlocoStatsGrid
  | BlocoPartnerShowcase
  | BlocoMethodCards
  | BlocoBentoGrid
  | BlocoAudienceSplit
  | BlocoAccordionSteps
  | BlocoPartnerHero
  | BlocoPartnerSplit
  | BlocoHomeHero
  | BlocoLogoMarquee
  | BlocoFeatureTabs
  | BlocoHomeBento
  | BlocoCaseCarousel
  | BlocoTestimonialCarousel
  | BlocoContentTeaser
  | BlocoValueCards
  | BlocoStickyPageNav
  | BlocoSealsBanner
  | BlocoProcessSteps
  | BlocoCtaContact
  | BlocoJobsList

export type ConsultantRole = {
  slug: string
  role: string
  code: string
  level: string
  gradient: string
  description: string
  tags: string[]
  ecosystem: number
  /* A barra de números do herói soma estes dois por perfil
   * (`Consultants.tsx:360`) — são de cada perfil, não do site. */
  allocatedProjects: number
  totalTeamSize: number
  certifications: string[]
}

export type SolutionCategory = 'innovation-ai' | 'data-bi' | 'governance-culture'

export type SolutionCard = {
  slug: string
  title: string
  category: SolutionCategory
  icon: string
  shortDescription: string
  /** `false` mostra o card sem link — a solução ainda não tem página (D-09). */
  hasPage: boolean
}

export type Seo = {
  title: string
  description: string
  image: Image | null
  noIndex: boolean
}

/* Navegação do topo (MIG-072a). O componente do menu recebe isto pronto: a
 * casca é ilha cliente, e ilha cliente não busca dado. */

export type CorDeDestaque =
  | 'primary' | 'emerald' | 'purple' | 'indigo' | 'pink' | 'orange' | 'blue' | 'amber'

export type AtalhoDoMenu = {
  icon: string
  label: string
  description: string
  href: string
}

export type DestaqueDoMenu = {
  icon: string
  color: CorDeDestaque
  title: string
  description: string
}

export type CartaoDoMenu = {
  icon: string | null
  title: string
  bullets: string[]
  ctaLabel: string | null
  href: string
}

/** Uma solução no painel, agrupada pela categoria do mega-menu. */
export type GrupoDeSolucoes = {
  title: string
  items: { title: string; description: string; icon: string; href: string | null }[]
}

export type CategoriaDoMenu = {
  label: string
  /** `null` quando a categoria só abre o painel — Soluções e Parceiros. */
  href: string | null
  panel: 'solutions' | 'partners' | 'links' | 'split'
  links: AtalhoDoMenu[]
  intro: string | null
  highlights: DestaqueDoMenu[]
  card: CartaoDoMenu | null
}

/** Tudo que o cabeçalho precisa, resolvido no servidor. */
export type Navegacao = {
  categorias: CategoriaDoMenu[]
  solucoes: GrupoDeSolucoes[]
  parceiros: PartnerBadge[]
  /** Descrição de cada parceiro, para o painel — o `PartnerBadge` não a carrega. */
  descricoesDeParceiro: Record<string, string>
}
