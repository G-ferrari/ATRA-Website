import type { Page, SiteSetting } from '@/payload-types'
import type {
  Acento,
  Bloco,
  Contato,
  Depoimento,
  LogoDeCliente,
  MetricaInstitucional,
  ParceiroDaFaixa,
  PartnerBadge,
  Selo,
  TemaDoBloco,
  Vaga,
} from '@/types/content'

import { isPopulated, toImage, toImageOpcional, toTextos } from './shared'

/* Documento do Payload → blocos de apresentação.
 *
 * ⚠️ Bloco desconhecido é **descartado, não derruba a página**. É diferente do
 * relacionamento não populado, que derruba: ali o dado existe e a consulta está
 * errada; aqui o bloco pode ter sido removido do código com conteúdo antigo
 * ainda no banco, e uma página institucional inteira fora do ar por causa de
 * uma seção obsoleta é pior que a seção sumir. O aviso vai para o log do
 * servidor, onde quem opera enxerga. */

type BlocoDoPayload = NonNullable<Page['layout']>[number]

const vazio = (v: string | null | undefined): string | null => {
  const t = v?.trim()
  return t ? t : null
}

/* Parceiro não populado é descartado em silêncio, não derruba: aqui é uma
 * vitrine decorativa, e a página inteira fora do ar por um logo é troca ruim.
 * Difere de `cases.heroImage`, onde a imagem é o conteúdo. */
type ParceiroPopulado = { name: string; slug: string; logo: unknown; logoDark?: unknown; logoScale?: unknown }

function toPartnerBadge(valor: number | ParceiroPopulado): PartnerBadge | null {
  if (!isPopulated<ParceiroPopulado>(valor)) return null
  return {
    name: valor.name,
    slug: valor.slug,
    logo: toImageOpcional(valor.logo as never, 'partnerShowcase.partners.logo'),
    logoDark: toImageOpcional(valor.logoDark as never, 'partnerShowcase.partners.logoDark'),
    logoScale: (valor.logoScale as 'sm' | 'md' | 'lg') ?? 'md',
  }
}

/* Grupo de CTA do Payload sempre existe, com os campos vazios. Só vira botão
 * quando os dois lados estão preenchidos — link sem destino é pior que
 * nenhum botão. */
function toCta(
  g: { label?: string | null; href?: string | null } | null | undefined,
): { label: string; href: string } | null {
  return g?.label && g?.href ? { label: g.label, href: g.href } : null
}

/** Cabeçalho com pílula de seção, comum aos quatro blocos de solução. */
function cabecalho(b: {
  eyebrow?: string | null
  eyebrowIcon?: string | null
  title: string
  description?: string | null
}) {
  return {
    eyebrow: vazio(b.eyebrow),
    eyebrowIcon: vazio(b.eyebrowIcon),
    title: b.title,
    description: vazio(b.description),
  }
}

function base(b: BlocoDoPayload) {
  return {
    id: b.id ?? `${b.blockType}-sem-id`,
    anchor: vazio(b.anchor),
    navLabel: vazio(b.navLabel),
    theme: (b.theme ?? 'surface-1') as TemaDoBloco,
    borda: (b.borda ?? 'nenhuma') as 'nenhuma' | 'topo' | 'ambas',
    espaco: (b.spacing === 'roomy' ? 'amplo' : 'normal') as 'normal' | 'amplo',
  }
}

/** Números e selos do global, prontos para os blocos que os consomem. */
export function toMetricas(g: SiteSetting | null | undefined): MetricaInstitucional[] {
  return (g?.metrics ?? []).map((m) => ({
    value: m.value,
    suffix: m.suffix ?? '',
    label: m.label,
    icon: m.icon ?? null,
  }))
}

export function toSelos(g: SiteSetting | null | undefined): Selo[] {
  return (g?.seals ?? []).map((s) => ({
    name: s.name,
    image: toImage(s.image, 'siteSettings.seals.image'),
  }))
}

/**
 * `institucional` chega resolvido pela página: bloco não busca dado
 * (blocos.md, regra 1). Passar o global inteiro para o mapper, e não para os
 * componentes, mantém a regra e evita cada bloco reabrir a mesma consulta.
 */
export function toBlocos(
  layout: Page['layout'] | null | undefined,
  institucional?: { metricas: MetricaInstitucional[]; selos?: Selo[] },
): Bloco[] {
  const blocos: Bloco[] = []

  for (const b of layout ?? []) {
    switch (b.blockType) {
      case 'pageHero':
        blocos.push({
          ...base(b),
          tipo: 'pageHero',
          badge: vazio(b.badge),
          chip: vazio(b.chip),
          title: b.title,
          highlight: (b.highlight ?? []).filter((h): h is string => Boolean(h?.trim())),
          subtitle: vazio(b.subtitle),
          description: vazio(b.description),
          align: b.align ?? 'left',
          ctas: (b.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
          ctaVariant: b.ctaVariant ?? 'primary',
          descriptionWidth: b.descriptionWidth ?? 'narrow',
          metrics: (b.metrics ?? []).map((m) => ({
            value: m.value,
            suffix: m.suffix ?? '',
            label: m.label,
            color: m.color ?? 'primary',
          })),
          mediaMode: b.mediaMode ?? 'none',
          images: (b.images ?? [])
            .map((i) => toImageOpcional(i as never, 'pageHero.images'))
            .filter((i): i is NonNullable<typeof i> => i !== null),
        })
        break

      case 'richTextSection':
        blocos.push({
          ...base(b),
          tipo: 'richTextSection',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          headerLayout: b.headerLayout ?? 'inline',
          description: vazio(b.description),
          subtitle: vazio(b.subtitle),
          callout: b.callout?.text
            ? { label: vazio(b.callout.label), text: vazio(b.callout.text) }
            : null,
          body: b.body ?? null,
          image: toImageOpcional(b.image, 'richTextSection.image'),
          imagePosition: b.imagePosition ?? 'right',
          ctas: (b.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
        })
        break

      case 'iconCardGrid':
        blocos.push({
          ...base(b),
          tipo: 'iconCardGrid',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          columns: Number(b.columns ?? 4) as 2 | 3 | 4,
          variant: b.variant ?? 'compact',
          headerWidth: b.headerWidth ?? 'full',
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            title: i.title,
            description: vazio(i.description),
          })),
        })
        break

      case 'partnerHero':
        blocos.push({
          ...base(b),
          tipo: 'partnerHero',
          badge: vazio(b.badge),
          chip: vazio(b.chip),
          title: b.title,
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          logo: toImageOpcional(b.logo, 'partnerHero.logo'),
          logoDark: toImageOpcional(b.logoDark, 'partnerHero.logoDark'),
          awards: (b.awards ?? []).map((a) => ({
            topText: vazio(a.topText),
            title: a.title,
            highlight: vazio(a.highlight),
          })),
          cta: toCta(b.cta),
        })
        break

      case 'partnerSplit':
        blocos.push({
          ...base(b),
          tipo: 'partnerSplit',
          eyebrow: vazio(b.eyebrow),
          title: b.title,
          body: (b.body ?? []).map((p) => p.text),
          rightColumn: b.rightColumn ?? 'image',
          image: toImageOpcional(b.image, 'partnerSplit.image'),
          imageLabel: vazio(b.imageLabel),
          logo: toImageOpcional(b.logo, 'partnerSplit.logo'),
          logoDark: toImageOpcional(b.logoDark, 'partnerSplit.logoDark'),
          items: (b.items ?? []).map((i) => i.text),
          cta: toCta(b.cta),
          linkCta: toCta(b.linkCta),
        })
        break

      case 'homeHero':
        blocos.push({
          ...base(b),
          tipo: 'homeHero',
          titlePrefix: b.titlePrefix,
          rotatingWords: (b.rotatingWords ?? []).filter((w): w is string => Boolean(w?.trim())),
          description: vazio(b.description),
          scrollLabel: vazio(b.scrollLabel),
          prompt: b.prompt?.title
            ? {
                title: vazio(b.prompt.title),
                placeholder: vazio(b.prompt.placeholder),
                disclaimer: vazio(b.prompt.disclaimer),
                clientsTitle: vazio(b.prompt.clientsTitle),
              }
            : null,
          // Preenchidos pela página, da collection `clients`.
          clientes: [],
        })
        break

      case 'logoMarquee':
        blocos.push({
          ...base(b),
          tipo: 'logoMarquee',
          title: vazio(b.title),
          // Preenchidos pela página, da collection `partners`.
          partners: [],
        })
        break

      case 'featureTabs':
        blocos.push({
          ...base(b),
          tipo: 'featureTabs',
          eyebrow: vazio(b.eyebrow),
          title: b.title,
          description: vazio(b.description),
          footnote: vazio(b.footnote),
          cta: toCta(b.cta),
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            badge: i.badge,
            title: i.title,
            description: i.description,
            image: toImageOpcional(i.image, 'featureTabs.items.image'),
          })),
        })
        break

      case 'homeBento':
        blocos.push({
          ...base(b),
          tipo: 'homeBento',
          partnerCard: b.partnerCard?.title
            ? {
                eyebrow: vazio(b.partnerCard.eyebrow),
                title: vazio(b.partnerCard.title),
                description: vazio(b.partnerCard.description),
                items: (b.partnerCard.items ?? []).map((i) => ({
                  name: i.name,
                  subtitle: vazio(i.subtitle),
                  logo: toImageOpcional(i.logo, 'homeBento.partnerCard.items.logo'),
                })),
              }
            : null,
          sealsCard: b.sealsCard?.title
            ? {
                eyebrow: vazio(b.sealsCard.eyebrow),
                counter: vazio(b.sealsCard.counter),
                title: vazio(b.sealsCard.title),
                description: vazio(b.sealsCard.description),
                badge: vazio(b.sealsCard.badge),
                footnote: vazio(b.sealsCard.footnote),
                seals: (b.sealsCard.seals ?? [])
                  .map((i) => toImageOpcional(i as never, 'homeBento.sealsCard.seals'))
                  .filter((i): i is NonNullable<typeof i> => i !== null),
              }
            : null,
          metrics: (b.metrics ?? []).map((m) => ({
            icon: m.icon,
            tag: m.tag,
            value: m.value,
            label: m.label,
            color: m.color ?? 'primary',
          })),
        })
        break

      case 'caseCarousel':
        blocos.push({
          ...base(b),
          tipo: 'caseCarousel',
          eyebrow: vazio(b.eyebrow),
          title: b.title,
          description: vazio(b.description),
          readLabel: vazio(b.readLabel),
          cta: toCta(b.cta),
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            company: i.company,
            title: i.title,
            description: i.description,
            href: i.href,
            image: toImageOpcional(i.image, 'caseCarousel.items.image'),
            color: i.color,
          })),
        })
        break

      case 'highlightCarousel':
        blocos.push({
          ...base(b),
          tipo: 'highlightCarousel',
          title: vazio(b.title),
          autoplay: b.autoplay ?? true,
          items: (b.items ?? []).map((i) => ({
            tag: vazio(i.tag),
            title: i.title,
            description: vazio(i.description),
            image: toImageOpcional(i.image, 'highlightCarousel.items.image'),
            cta: toCta(i.cta),
          })),
        })
        break

      case 'testimonialCarousel':
        blocos.push({
          ...base(b),
          tipo: 'testimonialCarousel',
          title: b.title,
          // Preenchidos pela página, da collection `testimonials`.
          items: [],
        })
        break

      case 'contentTeaser':
        blocos.push({
          ...base(b),
          tipo: 'contentTeaser',
          eyebrow: vazio(b.eyebrow),
          title: b.title,
          description: vazio(b.description),
          cards: (b.cards ?? []).map((c) => ({
            icon: c.icon,
            category: c.category,
            title: c.title,
            href: vazio(c.href),
            image: toImageOpcional(c.image, 'contentTeaser.cards.image'),
            column: c.column ?? 'first',
          })),
          featured: b.featured?.title
            ? {
                category: vazio(b.featured.category),
                title: vazio(b.featured.title),
                ctaLabel: vazio(b.featured.ctaLabel),
                href: vazio(b.featured.href),
                image: toImageOpcional(b.featured.image, 'contentTeaser.featured.image'),
              }
            : null,
          newsletter: b.newsletter?.title
            ? { title: vazio(b.newsletter.title), placeholder: vazio(b.newsletter.placeholder) }
            : null,
        })
        break

      case 'insightsHub':
        blocos.push({
          ...base(b),
          tipo: 'insightsHub',
          badge: vazio(b.badge),
          chip: vazio(b.chip),
          title: b.title,
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          formats: (b.formats ?? []).map((f) => ({
            key: f.key,
            label: f.label,
            icon: f.icon,
            count: f.count ?? null,
            href: vazio(f.href),
          })),
          topics: (b.topics ?? []).filter((t): t is string => Boolean(t?.trim())),
          items: (b.items ?? []).map((i) => ({
            format: i.format,
            title: i.title,
            description: i.description,
            category: i.category,
            meta: i.meta,
            date: i.date,
            author: i.author,
            href: i.href,
            image: toImageOpcional(i.image, 'insightsHub.items.image'),
            featured: Boolean(i.featured),
            tags: (i.tags ?? []).map((t) => t.text),
          })),
          portals: b.portals?.title
            ? { title: vazio(b.portals.title), description: vazio(b.portals.description) }
            : null,
          newsletter: b.newsletter?.title
            ? {
                eyebrow: vazio(b.newsletter.eyebrow),
                title: vazio(b.newsletter.title),
                description: vazio(b.newsletter.description),
              }
            : null,
          closing: b.closing?.title
            ? {
                title: vazio(b.closing.title),
                description: vazio(b.closing.description),
                ctaLabel: vazio(b.closing.ctaLabel),
                ctaHref: vazio(b.closing.ctaHref),
                secondaryLabel: vazio(b.closing.secondaryLabel),
                secondaryHref: vazio(b.closing.secondaryHref),
              }
            : null,
        })
        break

      case 'ctaBanner':
        blocos.push({
          ...base(b),
          tipo: 'ctaBanner',
          title: b.title,
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          cta: toCta(b.cta),
          secondaryCta:
            b.secondaryCta?.label && b.secondaryCta?.href
              ? {
                  label: b.secondaryCta.label,
                  href: b.secondaryCta.href,
                  caption: vazio(b.secondaryCta.caption),
                }
              : null,
          variant: b.variant ?? 'primary',
        })
        break

      case 'statsGrid':
        blocos.push({
          ...base(b),
          tipo: 'statsGrid',
          items:
            b.source === 'custom'
              ? (b.customItems ?? []).map((i) => ({
                  value: i.value,
                  suffix: i.suffix ?? '',
                  label: i.label,
                  icon: null,
                }))
              : (institucional?.metricas ?? []),
        })
        break

      case 'sealsBanner':
        blocos.push({
          ...base(b),
          tipo: 'sealsBanner',
          title: vazio(b.title),
          seals: institucional?.selos ?? [],
        })
        break

      case 'processSteps':
        blocos.push({
          ...base(b),
          tipo: 'processSteps',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          description: vazio(b.description),
          steps: (b.steps ?? []).map((e) => ({ title: e.title, description: e.description })),
        })
        break

      case 'ctaContact':
        blocos.push({
          ...base(b),
          tipo: 'ctaContact',
          variant: b.variant ?? 'panel',
          photo: toImageOpcional(b.photo, 'ctaContact.photo'),
          title: b.title,
          subtitle: vazio(b.subtitle),
          showContactCard: b.showContactCard ?? true,
          contato: null,
        })
        break

      case 'jobsList':
        blocos.push({
          ...base(b),
          tipo: 'jobsList',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          description: vazio(b.description),
          emptyText: vazio(b.emptyText),
          talentBank: b.talentBank?.title
            ? {
                eyebrow: vazio(b.talentBank.eyebrow),
                title: vazio(b.talentBank.title),
                highlight: vazio(b.talentBank.highlight),
                description: vazio(b.talentBank.description),
                note: vazio(b.talentBank.note),
              }
            : null,
          // Preenchido pela página, que tem as vagas publicadas.
          vagas: [],
        })
        break

      case 'partnerShowcase':
        blocos.push({
          ...base(b),
          tipo: 'partnerShowcase',
          title: vazio(b.title),
          grayscale: b.grayscale ?? true,
          partners: (b.partners ?? [])
            .map(toPartnerBadge)
            .filter((p): p is PartnerBadge => p !== null),
        })
        break

      case 'valueCards':
        blocos.push({
          ...base(b),
          tipo: 'valueCards',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          variant: b.variant ?? 'glow',
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            glowColor: i.glowColor ?? 'blue',
            title: i.title,
            description: i.description,
            bullets: (i.bullets ?? []).map((x) => x.text),
          })),
        })
        break

      case 'stickyPageNav':
        // Itens preenchidos abaixo, quando a lista inteira já é conhecida.
        blocos.push({
          ...base(b),
          tipo: 'stickyPageNav',
          variant: b.variant ?? 'institutional',
          bottomGap: b.bottomGap ?? 'normal',
          items: [],
        })
        break

      case 'methodCards':
        blocos.push({
          ...base(b),
          ...cabecalho(b),
          tipo: 'methodCards',
          headerCta: toCta(b.headerCta),
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            accent: (i.accent ?? 'primary') as Acento,
            badge: vazio(i.badge),
            title: i.title,
            description: i.description,
            bullets: toTextos(i.bullets, 'text'),
          })),
        })
        break

      case 'bentoGrid':
        blocos.push({
          ...base(b),
          ...cabecalho(b),
          tipo: 'bentoGrid',
          items: (b.items ?? []).map((i) => ({
            span: i.span,
            size: i.size ?? 'supporting',
            accent: (i.accent ?? 'primary') as Acento,
            icon: vazio(i.icon),
            badge: vazio(i.badge),
            chip: vazio(i.chip),
            title: i.title,
            description: i.description,
            metrics: (i.metrics ?? []).map((m) => ({
              value: m.value,
              label: m.label,
              color: m.color ?? 'primary',
            })),
            tags: toTextos(i.tags, 'name'),
            bullets: toTextos(i.bullets, 'text'),
            footer: vazio(i.footer),
            footerIcon: vazio(i.footerIcon),
          })),
        })
        break

      case 'audienceSplit':
        blocos.push({
          ...base(b),
          ...cabecalho(b),
          tipo: 'audienceSplit',
          cta: toCta(b.cta),
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            accent: (i.accent ?? 'primary') as Acento,
            title: i.title,
            description: i.description,
          })),
        })
        break

      case 'accordionSteps':
        blocos.push({
          ...base(b),
          ...cabecalho(b),
          tipo: 'accordionSteps',
          image: toImageOpcional(b.image, 'accordionSteps.image'),
          /* Selo sem título é grupo vazio, não selo: o Payload cria o grupo
           * mesmo quando ninguém preencheu nada dentro dele. */
          imageBadge: b.imageBadge?.title
            ? {
                icon: vazio(b.imageBadge.icon),
                title: b.imageBadge.title,
                subtitle: vazio(b.imageBadge.subtitle),
              }
            : null,
          steps: (b.steps ?? []).map((e) => ({ title: e.title, description: e.description })),
        })
        break

      default:
        console.warn(
          `[mapper] bloco desconhecido "${(b as { blockType: string }).blockType}" ignorado. ` +
            `Removido do código com conteúdo ainda no banco?`,
        )
    }
  }

  /* O menu só pode ser montado depois de percorrer tudo: ele lista as âncoras
   * dos **outros** blocos, inclusive as que vêm depois dele na página. */
  const ancoras = ancorasDe(blocos)
  for (const b of blocos) {
    if (b.tipo === 'stickyPageNav') b.items = ancoras
  }

  return blocos
}

/** Injeta as vagas resolvidas nos blocos `jobsList` (bloco não busca dado). */
export function comVagas(blocos: Bloco[], vagas: Vaga[]): Bloco[] {
  for (const b of blocos) if (b.tipo === 'jobsList') b.vagas = vagas
  return blocos
}

/** Injeta os logos de cliente no herói da home (bloco não busca dado). */
export function comClientes(blocos: Bloco[], clientes: LogoDeCliente[]): Bloco[] {
  for (const b of blocos) if (b.tipo === 'homeHero') b.clientes = clientes
  return blocos
}

/** Injeta os parceiros na faixa de logos da home. */
export function comParceiros(blocos: Bloco[], parceiros: ParceiroDaFaixa[]): Bloco[] {
  for (const b of blocos) if (b.tipo === 'logoMarquee') b.partners = parceiros
  return blocos
}

/** Injeta os dados de contato nos CTAs que desenham o cartão (MIG-072). */
export function comContato(blocos: Bloco[], contato: Contato): Bloco[] {
  for (const b of blocos) if (b.tipo === 'ctaContact') b.contato = contato
  return blocos
}

/** Injeta os depoimentos em destaque no carrossel da home. */
export function comDepoimentos(blocos: Bloco[], depoimentos: Depoimento[]): Bloco[] {
  for (const b of blocos) if (b.tipo === 'testimonialCarousel') b.items = depoimentos
  return blocos
}

/**
 * Itens do menu lateral: os blocos que preencheram `anchor` (blocos.md, regra 2).
 *
 * ⚠️ **`ctaBanner` fica de fora.** A regra 2 confunde duas coisas que o legado
 * separa: ter id e estar no índice. A faixa que fecha a página de solução tem
 * `id="contato"` porque três botões apontam para `#contato`
 * (`SolutionAI.tsx:150`, `:244`, `:643`), mas o menu lista **quatro** itens e
 * ela não é um deles — é destino de rolagem, não seção do sumário.
 *
 * Sem esta exclusão o menu ganhava um quinto item com o título inteiro da
 * chamada ("Comece a revolução da IA na sua empresa"), e a faixa passava de
 * 64px para 144px no mobile. Nenhuma outra página é afetada: /sobre e
 * /carreiras ancoram seções de conteúdo, nunca a faixa de chamada.
 */
export function ancorasDe(blocos: Bloco[]): { anchor: string; label: string }[] {
  /* `ctaBanner` fica fora do submenu por padrão — seu `anchor` costuma ser só
     alvo de link (ex.: `#contato`), não uma seção navegável. Exceção opt-in:
     quando o bloco define `navLabel` explícito, ele entra. Nenhum seed usa hoje:
     a RC18 era o caso previsto, e o formulário que ficava abaixo do CTA final
     dela saiu na task 029. */
  return blocos
    .filter((b) => b.anchor && (b.tipo !== 'ctaBanner' || Boolean(b.navLabel)))
    .map((b) => ({
      anchor: b.anchor as string,
      label: b.navLabel ?? ('title' in b && b.title ? b.title : (b.anchor as string)),
    }))
}

export { toTextos }
