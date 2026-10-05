/* Tipos de APRESENTAÇÃO.
 *
 * Não substituem `@/payload-types` — derivam dele. A regra do contrato de dados:
 * componente recebe estes tipos e nunca conhece o schema do CMS. Trocar o nome
 * de um campo no Payload quebra um mapper, não oito componentes.
 *
 * Ver docs/02-especificacao/contratos-de-dados.md. */

import type { AbaDeSolucoes } from '@/lib/abas-de-solucoes'

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
  /** Versão para o tema escuro; nula, o `logo` vale nos dois. */
  logoDark: Image | null
  /** Ajuste fino do tamanho; o peso visual já sai igual pela proporção (`lib/logo.ts`). */
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
  /** `null` quando o case não identifica o cliente: o nome some da tela. */
  client: string | null
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
  seo: Seo
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
  seo: Seo
}

/** Matéria, entrevista ou vídeo sobre a ATRA na imprensa — "ATRA na mídia" (D-49). */
export type MateriaDaImprensa = {
  id: string
  title: string
  /** O veículo que publicou. */
  outlet: string
  description: string
  /** Endereço no site do veículo: é para onde o cartão leva. */
  url: string
  image: Image
  kind: 'article' | 'video'
  /** ISO 8601, ou `null`: a página antiga não mostrava data. */
  publishedAt: string | null
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
  seo: Seo
}

export type ResourceDetail = Resource & {
  /** Documento Lexical serializado; `null` enquanto ninguém escreveu. */
  body: unknown | null
  /* MIG-104. O id vai para a Server Action do download; `temDownload` é a
   * presença do PDF em `resources.file` — é ela que liga o formulário gated,
   * material a material (P-07: subir o arquivo é o interruptor). */
  id: number
  temDownload: boolean
  seo: Seo
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
  /** Data-limite em destaque (ex.: RC 18/2025). Presentation-only, injetada pela
   *  página; quando presente, o herói mostra o selo de prazo no lugar do `chip`. */
  prazoDestaque?: string | null
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
  /** Tamanho dos parágrafos, escolhido no admin. */
  bodySize: 'normal' | 'large'
}

export type BlocoIconCardGrid = Base & {
  tipo: 'iconCardGrid'
  eyebrow: string | null
  title: string | null
  columns: 2 | 3 | 4
  variant: 'compact' | 'card' | 'card-centered'
  headerWidth: 'full' | 'narrow'
  /** `accent` intercala a cor do traço do ícone (azul padrão, laranja escasso);
   *  presentation-only, injetado pela página — o CMS não tem o campo. */
  items: { icon: string; title: string; description: string | null; accent?: 'primary' | 'secondary' }[]
  /** Abaixo de `md`, cartão em linha (ícone ao lado do texto) e mais justo.
   *  Presentation-only, injetado pela página — hoje só na RC18, onde as 12
   *  dimensões empilhadas em cartão alto passavam de 1.900px no celular. */
  compactoNoCelular?: boolean
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
  logoDark: Image | null
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
  logoDark: Image | null
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
  } | null
  /** Resolvidos pela página, da collection `clients`. */
  clientes: LogoDeCliente[]
}

/** Ficha da faixa de parceiros da home. `href` nulo: parceiro sem página. */
export type ParceiroDaFaixa = {
  name: string
  logo: Image
  logoDark: Image | null
  logoScale: 'sm' | 'md' | 'lg'
  href: string | null
}

export type BlocoLogoMarquee = Base & {
  tipo: 'logoMarquee'
  title: string | null
  /** Resolvidos pela página, da collection `partners`. */
  partners: ParceiroDaFaixa[]
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

export type BlocoHighlightCarousel = Base & {
  tipo: 'highlightCarousel'
  title: string | null
  autoplay: boolean
  items: {
    tag: string | null
    title: string
    description: string | null
    image: Image | null
    cta: { label: string; href: string } | null
  }[]
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

export type LogoDeCliente = { name: string; logo: Image; enlarge: boolean }

export type Depoimento = {
  quote: string
  company: string
  authorName: string | null
  authorRole: string
  photo: Image | null
}

export type BlocoTestimonialCarousel = Base & {
  tipo: 'testimonialCarousel'
  title: string
  /** Resolvidos pela página, da collection `testimonials` com `featured`. */
  items: Depoimento[]
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

export type FormatoDeInsight = {
  key: string
  label: string
  icon: string
  count: number | null
  href: string | null
}

export type ItemDeInsight = {
  format: string
  title: string
  description: string
  category: string
  meta: string
  date: string
  author: string
  href: string
  image: Image | null
  featured: boolean
  tags: string[]
}

export type BlocoInsightsHub = Base & {
  tipo: 'insightsHub'
  badge: string | null
  chip: string | null
  title: string
  highlight: string | null
  description: string | null
  formats: FormatoDeInsight[]
  topics: string[]
  items: ItemDeInsight[]
  portals: { title: string | null; description: string | null } | null
  newsletter: { eyebrow: string | null; title: string | null; description: string | null } | null
  closing: {
    title: string | null
    description: string | null
    ctaLabel: string | null
    ctaHref: string | null
    secondaryLabel: string | null
    secondaryHref: string | null
  } | null
}

export type BlocoCtaBanner = Base & {
  tipo: 'ctaBanner'
  title: string
  highlight: string | null
  description: string | null
  cta: { label: string; href: string } | null
  secondaryCta: { label: string; href: string; caption: string | null } | null
  variant: 'primary' | 'subtle' | 'dark' | 'dark-centered'
  /** Data-limite em destaque (ex.: RC 18/2025). Presentation-only, injetada pela
   *  página; quando presente, a faixa mostra o selo de prazo. */
  prazoDestaque?: string | null
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

/** Grade de imagens do próprio bloco — selos, certificações, prêmios. */
export type BlocoImageGrid = Base & {
  tipo: 'imageGrid'
  eyebrow: string | null
  title: string | null
  description: string | null
  images: { image: Image; caption: string | null }[]
  boxed: boolean
}

export type BlocoProcessSteps = Base & {
  tipo: 'processSteps'
  eyebrow: string | null
  title: string | null
  description: string | null
  steps: { title: string; description: string }[]
  /** Apresentação-only, injetada pela página: `timeline` troca a grade de cards
   *  por uma linha do tempo horizontal com círculos numerados (layout da jornada
   *  da landing). Padrão `cards`. */
  layout?: 'cards' | 'timeline'
}

export type BlocoPartnerShowcase = Base & {
  tipo: 'partnerShowcase'
  title: string | null
  /** `all` segue o cadastro de parceiros (a página injeta); `selected` usa a lista do bloco. */
  source: 'all' | 'selected'
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
  /** Vazia quando ninguém classificou a vaga — a página esconde a etiqueta (P-28). */
  area: string | null
  locationLabel: string
}

export type VagaDetalhe = Vaga & {
  summary: string
  /** Documento Lexical serializado; `null` enquanto ninguém escreveu. */
  body: unknown | null
  /** MIG-102: vai para a Server Action da candidatura. */
  id: number
  seo: Seo
}

export type BlocoCtaContact = Base & {
  tipo: 'ctaContact'
  variant: 'panel' | 'photo'
  photo: Image | null
  title: string
  subtitle: string | null
  showContactCard: boolean
  /** Resolvido pela página a partir do global `contact` — o bloco não busca. */
  contato: Contato | null
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
    /** Apresentação-only, injetada pela página: `strip` troca os cards empilhados
     *  por uma faixa compacta de ícone + rótulo num painel (layout da landing do
     *  "verdadeiro desafio"). `itemsIntro` é a frase acima da faixa. */
    itemLayout?: 'stack' | 'strip'
    itemsIntro?: string | null
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
  | BlocoHighlightCarousel
  | BlocoTestimonialCarousel
  | BlocoContentTeaser
  | BlocoInsightsHub
  | BlocoValueCards
  | BlocoStickyPageNav
  | BlocoSealsBanner
  | BlocoImageGrid
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

/** A aba do menu de Soluções, ou `rc18` — que tem página e não tem aba (D-37). */
export type SolutionCategory = AbaDeSolucoes | 'rc18'

export type SolutionCard = {
  slug: string
  title: string
  category: SolutionCategory
  icon: string
  shortDescription: string
  /** `false` mostra o card sem link — a solução ainda não tem página (D-09). */
  hasPage: boolean
  /** O selo do cartão em destaque (D-52); `null` é cartão comum. */
  badge: string | null
}

/**
 * SEO de uma rota, **já resolvido** (MIG-105).
 *
 * Não é o grupo `seo` do documento: é o resultado depois dos fallbacks de
 * `seo-e-redirects.md` — `seo.metaTitle` → título da página,
 * `seo.metaDescription` → resumo, `seo.ogImage` → capa. Quem resolve é
 * `mappers/seo.ts`; quem consome é `lib/seo.ts`.
 */
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
/* As abas do menu de Soluções moram em `lib/abas-de-solucoes.ts`, que é de
 * onde a collection, o menu e o índice leem a ordem e os nomes (D-52). */
export type { AbaDeSolucoes }

export type GrupoDeSolucoes = {
  /** A aba: é por ela que o painel de conversão escolhe o case (D-51). */
  id: AbaDeSolucoes
  title: string
  items: { title: string; description: string; icon: string; href: string | null; badge: string | null }[]
}

export type CategoriaDoMenu = {
  label: string
  /** `null` quando a categoria só abre o painel — Soluções e Parceiros. */
  href: string | null
  panel: 'solutions' | 'partners' | 'segments' | 'links' | 'split'
  links: AtalhoDoMenu[]
  intro: string | null
  highlights: DestaqueDoMenu[]
  card: CartaoDoMenu | null
}

/** Cartão do índice /segmentos (MIG-091). */
export type SegmentCard = {
  slug: string
  name: string
  icon: string
  shortDescription: string
}

/** O convite de lead dentro do chat (MIG-150, D-29), do global `atra-ai`.
 * `null` quando qualquer uma das três chaves está fechada — env, toggle
 * editorial ou consentimento vazio no idioma. */
export type ConviteDeLead = {
  aposMensagens: number
  titulo: string
  mensagem: string
  /** O aviso de P-14: o que acontece com o dado. Sem ele, não há convite. */
  consentimento: string
  sucesso: string
}

/** Uma categoria do painel de cookies, com nome e o que ela registra. */
export type CategoriaDeCookies = { nome: string; descricao: string }

/** O aviso de cookies (MIG-151, D-30), do global `cookie-consent`.
 * `null` quando `bannerMessage` está vazio no idioma — sem texto jurídico
 * (P-14) não há banner. */
export type AvisoDeCookies = {
  titulo: string
  mensagem: string
  aceitar: string
  recusar: string
  preferencias: string
  salvar: string
  tituloDoPainel: string
  mensagemDoPainel: string
  categorias: {
    necessarios: CategoriaDeCookies
    analytics: CategoriaDeCookies
    marketing: CategoriaDeCookies
  }
}

/** Os ids dos scripts de rastreamento (D-40), do global `tracking`. `null` é
 * "não configurado": o componente correspondente não faz nada. Mesmo com id,
 * cada script espera o aceite da sua categoria no aviso de cookies. */
export type Rastreamento = {
  /** Google Tag Manager — categoria estatística. */
  gtmId: string | null
  /** Lusha Website Visitors — categoria marketing. */
  lushaSiteId: string | null
}

/** As chaves da integração com o ATRAIR (D-41), do global `integrations`.
 *
 * `endpoint: null` é "sem endereço utilizável" — vazio no admin ou fora do
 * formato. Com ele nulo as duas chaves não valem nada, porque não há para onde
 * chamar.
 *
 * ⚠️ `vagas` ligado **não** garante vaga na tela, e `false` não é o mesmo que
 * "lista vazia": é o que separa "integração desligada" de "o ATRAIR respondeu
 * que não há vaga aberta". Ver `ResultadoDeVagas` em `lib/atrair.ts` — foi essa
 * confusão que a D-41 desfez. */
export type IntegracaoAtrair = {
  /** Base da API, já validada e **sem barra final**. */
  endpoint: string | null
  /** A grade de /carreiras lista as vagas publicadas no ATRAIR. */
  vagas: boolean
  /** O currículo do Banco de Talentos é criado no ATRAIR. */
  bancoDeTalentos: boolean
}

/** Textos e links do Diagnóstico de Maturidade de Dados (D-35), do global
 * `data-maturity-diagnostic`. Servem à página, à conclusão e ao e-mail do
 * resultado.
 *
 * `null` é o editor dizendo "sem isto": parágrafo que não se desenha, botão que
 * não aparece. Título, assunto e WhatsApp nunca chegam vazios — sem eles a
 * página fica sem cabeçalho, o e-mail sem assunto e o lead sem saída. */
export type DiagnosticoDeMaturidade = {
  titulo: string
  abertura: string | null
  conclusao: string | null
  email: { assunto: string; abertura: string | null }
  /** Vazio no CMS = sem botão "Agendar conversa" na conclusão e no e-mail. */
  agendaUrl: string | null
  whatsappUrl: string
}

/** Dados de contato da ATRA, do global `contact` (MIG-072). */
export type Contato = {
  telefone: string
  /** O mesmo número com parênteses — o legado escreve dos dois jeitos. */
  telefoneComDdd: string
  whatsapp: string
  email: string
  /** `null` quando o global não tem endereço — a ATRA não tem sede fixa desde 29/09. */
  endereco: string | null
  redes: { linkedin: string | null; instagram: string | null; facebook: string | null; youtube: string | null }
  /** Destino do aviso de cada formulário; `null` cai no `email`. Ver `lib/destino-do-aviso.ts`. */
  destinos: Record<FormularioComAviso, string | null>
}

/** Os formulários que avisam a ATRA por e-mail. A newsletter não entra: quem
 *  recebe e-mail ali é o visitante (MIG-103). */
export type FormularioComAviso = 'contato' | 'consultores' | 'diagnostico' | 'carreiras' | 'chat'

export type ColunaDoRodape = {
  titulo: string
  /** `contact`: a coluna desenha o global `contact` em vez dos links. */
  tipo: 'links' | 'contact'
  links: { label: string; href: string | null }[]
}

/** Tudo que o rodapé precisa, resolvido no servidor. */
export type Rodape = {
  sobre: string
  colunas: ColunaDoRodape[]
  direitos: string
}

/** O case rotativo do painel de conversão: o que o cartão desenha, com o
 *  endereço já resolvido no idioma. */
export type MiniCase = {
  slug: string
  title: string
  client: string | null
  image: Image | null
  href: string
}

/** Painel fixo à direita do menu de Soluções (D-51), do global
 *  `conversion-panel`. Destinos já chegam com o prefixo do idioma. */
export type PainelDeConversao = {
  titulo: string
  abertura: string | null
  caminhos: { icon: string; title: string; description: string | null; href: string }[]
  /** `null` sem texto ou sem destino: o botão não é desenhado. */
  cta: { label: string; href: string } | null
  provas: { value: string; label: string | null }[]
  /** O que cada aba mostra. Aba sem case escolhido recebe os mais recentes. */
  cases: Record<AbaDeSolucoes, MiniCase[]>
}

/** Tudo que o cabeçalho precisa, resolvido no servidor. */
export type Navegacao = {
  categorias: CategoriaDoMenu[]
  solucoes: GrupoDeSolucoes[]
  /** `null` enquanto o painel não tiver título no CMS: o menu sai como era. */
  conversao: PainelDeConversao | null
  parceiros: PartnerBadge[]
  segmentos: SegmentCard[]
  /** Descrição de cada parceiro, para o painel — o `PartnerBadge` não a carrega. */
  descricoesDeParceiro: Record<string, string>
}
