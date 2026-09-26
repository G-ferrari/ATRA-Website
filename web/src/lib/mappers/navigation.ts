import type { Navigation, Partner, Solution } from '@/payload-types'
import type {
  CategoriaDoMenu,
  CorDeDestaque,
  GrupoDeSolucoes,
  Navegacao,
  PartnerBadge,
} from '@/types/content'

import { toSegmentCard } from './segment'
import { toImageOpcional } from './shared'

/* Como em `solution.ts`: o parâmetro é o `Pick` do que o menu usa, e não o
 * documento inteiro, para o `select` da consulta e o mapper não saírem de
 * sincronia — e porque `select` estreita o tipo de retorno do Payload. */
type SolucaoDoMenu = Pick<Solution, 'title' | 'slug' | 'category' | 'icon' | 'shortDescription' | 'hasPage'>
type ParceiroDoMenu = Pick<Partner, 'name' | 'slug' | 'logo' | 'logoDark' | 'logoScale' | 'description'>

/* Global `navigation` + duas collections → o que o cabeçalho desenha (MIG-072a).
 *
 * Os painéis de Soluções e Parceiros não vêm do global: leem as collections, de
 * onde o resto do site já lê. É o que impede o menu de discordar do índice —
 * no legado a lista de parceiros existia em três lugares e já divergia. */

const vazio = (v: string | null | undefined): string | null => {
  const t = v?.trim()
  return t ? t : null
}

/* Ordem e rótulo das categorias de solução, iguais aos do índice `/solucoes`.
 * O rótulo do grupo é do menu, não da collection: `category` é um `select` com
 * três valores, e o texto que o editor vê está no admin, não no dado. */
const GRUPOS: { id: Solution['category']; pt: string; en: string }[] = [
  { id: 'innovation-ai', pt: 'Inovação & IA', en: 'Innovation & AI' },
  { id: 'data-bi', pt: 'Dados, BI & Advanced Analytics', en: 'Data, BI & Advanced Analytics' },
  { id: 'governance-culture', pt: 'Governança & Cultura', en: 'Governance & Culture' },
  { id: 'rc18', pt: 'RC18', en: 'RC18' },
]

export function toGruposDeSolucoes(
  docs: SolucaoDoMenu[],
  locale: 'pt' | 'en',
  hrefDaSolucao: (slug: string) => string,
): GrupoDeSolucoes[] {
  return GRUPOS.map((g) => ({
    title: g[locale],
    items: docs
      .filter((d) => d.category === g.id)
      .map((d) => ({
        title: d.title,
        description: d.shortDescription,
        icon: d.icon,
        // Solução sem página não vira link, igual ao índice (D-09).
        href: d.hasPage ? hrefDaSolucao(d.slug) : null,
      })),
  })).filter((g) => g.items.length > 0)
}

export function toCategorias(global: Navigation | null | undefined): CategoriaDoMenu[] {
  return (global?.categories ?? []).map((c) => ({
    label: c.label,
    href: vazio(c.href),
    panel: c.panel,
    links: (c.links ?? []).map((l) => ({
      icon: l.icon,
      label: l.label,
      description: l.description,
      href: l.href,
    })),
    intro: vazio(c.intro),
    highlights: (c.highlights ?? []).map((h) => ({
      icon: h.icon,
      color: (h.color ?? 'primary') as CorDeDestaque,
      title: h.title,
      description: h.description,
    })),
    /* Grupo do Payload existe mesmo vazio: só vira cartão quando tem título e
     * destino, senão o painel desenharia uma caixa em branco. */
    card:
      c.card?.title && c.card?.href
        ? {
            icon: vazio(c.card.icon),
            title: c.card.title,
            bullets: (c.card.bullets ?? []).map((b) => b.text).filter(Boolean),
            ctaLabel: vazio(c.card.ctaLabel),
            href: c.card.href,
          }
        : null,
  }))
}

export function toParceirosDoMenu(docs: ParceiroDoMenu[]): {
  parceiros: PartnerBadge[]
  descricoes: Record<string, string>
} {
  const parceiros: PartnerBadge[] = []
  const descricoes: Record<string, string> = {}

  for (const p of docs) {
    parceiros.push({
      name: p.name,
      slug: p.slug,
      /* Logo ausente é descartado em silêncio, como na vitrine de /sobre: o
       * menu inteiro fora do ar por um arquivo faltando é troca ruim. */
      logo: toImageOpcional(p.logo as never, 'navigation.partners.logo'),
      logoDark: toImageOpcional(p.logoDark as never, 'navigation.partners.logoDark'),
      logoScale: (p.logoScale as 'sm' | 'md' | 'lg') ?? 'md',
    })
    if (p.description) descricoes[p.slug] = p.description
  }

  return { parceiros, descricoes }
}

/** O que o painel de segmentos precisa — o mesmo `Pick` do cartão do índice. */
type SegmentoDoMenu = Parameters<typeof toSegmentCard>[0]

export function toNavegacao(args: {
  global: Navigation | null | undefined
  solucoes: SolucaoDoMenu[]
  parceiros: ParceiroDoMenu[]
  segmentos: SegmentoDoMenu[]
  locale: 'pt' | 'en'
  hrefDaSolucao: (slug: string) => string
}): Navegacao {
  const { parceiros, descricoes } = toParceirosDoMenu(args.parceiros)
  return {
    categorias: toCategorias(args.global),
    solucoes: toGruposDeSolucoes(args.solucoes, args.locale, args.hrefDaSolucao),
    parceiros,
    descricoesDeParceiro: descricoes,
    segmentos: args.segmentos.map(toSegmentCard),
  }
}
