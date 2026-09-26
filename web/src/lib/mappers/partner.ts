import type { Partner } from '@/payload-types'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { ParceiroDaFaixa } from '@/types/content'

import { toImageOpcional } from './shared'

/** O que a faixa da home lê de cada parceiro — o `select` da consulta. */
export type ParceiroDaFaixaDoc = Pick<Partner, 'name' | 'slug' | 'logo' | 'hasPage'>

/* Parceiro → ficha da faixa "Parceiros de Confiança" da home.
 *
 * Só vira link quem tem `hasPage`: é o contrato que o campo promete no admin
 * ("sem isto, o parceiro aparece mas não vira link"), e link para parceiro sem
 * página é 404. Devolve `null` sem logo, como a vitrine de /sobre: a faixa
 * inteira fora do ar por um arquivo faltando é troca ruim. */
export function toParceiroDaFaixa(doc: ParceiroDaFaixaDoc, locale: Locale): ParceiroDaFaixa | null {
  const logo = toImageOpcional(doc.logo, 'partners.logo')
  if (!logo) return null
  return {
    name: doc.name,
    logo,
    href: doc.hasPage ? hrefDe('parceiros', locale, doc.slug) : null,
  }
}
