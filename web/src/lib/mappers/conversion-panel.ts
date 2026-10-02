import type { Case, ConversionPanel, Media } from '@/payload-types'
import { ABAS_DE_SOLUCOES } from '@/lib/abas-de-solucoes'
import type { AbaDeSolucoes, MiniCase, PainelDeConversao } from '@/types/content'

import { isPopulated, toImage } from './shared'

/* Global `conversion-panel` + os cases publicados → o painel fixo do menu de
 * Soluções (D-51). */

/** Só o que o cartão do case desenha — o mesmo `Pick` do `select` da consulta. */
export type CaseDoPainel = Pick<Case, 'id' | 'title' | 'slug' | 'client' | 'heroImage'>

/** Quantos cases uma aba alterna. É também o teto do campo no admin. */
export const CASES_POR_ABA = 3

/** A aba do menu → o campo do grupo `cases` no global. */
const CAMPO_DA_ABA = {
  'innovation-ai': 'innovationAi',
  'data-bi': 'dataBi',
  'governance-culture': 'governanceCulture',
  'specialized-services': 'specializedServices',
} as const satisfies Record<AbaDeSolucoes, keyof NonNullable<ConversionPanel['cases']>>

const vazio = (v: string | null | undefined): string | null => {
  const t = v?.trim()
  return t ? t : null
}

const idDe = (valor: number | Case): number => (typeof valor === 'object' ? valor.id : valor)

export function toPainelDeConversao(args: {
  global: ConversionPanel | null | undefined
  /** Os cases **publicados**, do mais novo para o mais antigo. Rascunho não
   *  entra aqui, então case escolhido no admin e depois despublicado some do
   *  menu sem ninguém precisar lembrar de tirá-lo do painel. */
  cases: CaseDoPainel[]
  /** Põe o prefixo do idioma num destino interno (`/contato` → `/en/contato`). */
  hrefLocal: (href: string) => string
  hrefDoCase: (slug: string) => string
}): PainelDeConversao | null {
  const { global, cases, hrefLocal, hrefDoCase } = args
  const titulo = vazio(global?.title)
  // Sem título o painel não existe: é a trava que deixa o código ir ao ar
  // antes do conteúdo.
  if (!global || !titulo) return null

  const porId = new Map(cases.map((c) => [c.id, c]))
  const miniCase = (c: CaseDoPainel): MiniCase => ({
    slug: c.slug,
    title: c.title,
    client: vazio(c.client),
    /* Capa não populada, ou sem arquivo, vira cartão sem imagem, e não erro: o
     * menu inteiro fora do ar por uma capa faltando é troca ruim — mesmo
     * critério do logo dos parceiros no painel ao lado. */
    image:
      isPopulated<Media>(c.heroImage) && c.heroImage.url && c.heroImage.width && c.heroImage.height
        ? toImage(c.heroImage, 'cases.heroImage')
        : null,
    href: hrefDoCase(c.slug),
  })
  const recentes = cases.slice(0, CASES_POR_ABA).map(miniCase)

  const daAba = (aba: AbaDeSolucoes): MiniCase[] => {
    const escolhidos = (global.cases?.[CAMPO_DA_ABA[aba]] ?? [])
      .map((v) => porId.get(idDe(v)))
      .filter((c): c is CaseDoPainel => Boolean(c))
      .slice(0, CASES_POR_ABA)
      .map(miniCase)
    return escolhidos.length > 0 ? escolhidos : recentes
  }

  const ctaLabel = vazio(global.ctaLabel)
  const ctaHref = vazio(global.ctaHref)

  return {
    titulo,
    abertura: vazio(global.intro),
    caminhos: (global.paths ?? []).map((p) => ({
      icon: p.icon,
      title: p.title,
      description: vazio(p.description),
      href: hrefLocal(p.href),
    })),
    cta: ctaLabel && ctaHref ? { label: ctaLabel, href: hrefLocal(ctaHref) } : null,
    provas: (global.proof ?? []).map((p) => ({ value: p.value, label: vazio(p.label) })),
    cases: Object.fromEntries(ABAS_DE_SOLUCOES.map((a) => [a.id, daAba(a.id)])) as Record<AbaDeSolucoes, MiniCase[]>,
  }
}
