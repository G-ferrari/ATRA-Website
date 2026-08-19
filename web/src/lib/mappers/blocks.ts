import type { Page, SiteSetting } from '@/payload-types'
import type { Bloco, MetricaInstitucional, PartnerBadge, Selo, TemaDoBloco } from '@/types/content'

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
type ParceiroPopulado = { name: string; slug: string; logo: unknown; logoScale?: unknown }

function toPartnerBadge(valor: number | ParceiroPopulado): PartnerBadge | null {
  if (!isPopulated<ParceiroPopulado>(valor)) return null
  return {
    name: valor.name,
    slug: valor.slug,
    logo: toImageOpcional(valor.logo as never, 'partnerShowcase.partners.logo'),
    logoScale: (valor.logoScale as 'sm' | 'md' | 'lg') ?? 'md',
  }
}

function base(b: BlocoDoPayload) {
  return {
    id: b.id ?? `${b.blockType}-sem-id`,
    anchor: vazio(b.anchor),
    navLabel: vazio(b.navLabel),
    theme: (b.theme ?? 'surface-1') as TemaDoBloco,
    borda: (b.borda ?? 'nenhuma') as 'nenhuma' | 'topo' | 'ambas',
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
          description: vazio(b.description),
          ctas: (b.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
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

      case 'ctaBanner':
        blocos.push({
          ...base(b),
          tipo: 'ctaBanner',
          title: b.title,
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          cta:
            b.cta?.label && b.cta?.href ? { label: b.cta.label, href: b.cta.href } : null,
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
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            glowColor: i.glowColor ?? 'blue',
            title: i.title,
            description: i.description,
          })),
        })
        break

      case 'stickyPageNav':
        // Itens preenchidos abaixo, quando a lista inteira já é conhecida.
        blocos.push({ ...base(b), tipo: 'stickyPageNav', items: [] })
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

/** Itens do menu lateral: os blocos que preencheram `anchor` (blocos.md, regra 2). */
export function ancorasDe(blocos: Bloco[]): { anchor: string; label: string }[] {
  return blocos
    .filter((b) => b.anchor)
    .map((b) => ({
      anchor: b.anchor as string,
      label: b.navLabel ?? ('title' in b && b.title ? b.title : (b.anchor as string)),
    }))
}

export { toTextos }
