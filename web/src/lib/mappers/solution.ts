import type { Solution } from '@/payload-types'
import type { SolutionCard } from '@/types/content'

/* O parâmetro é o `Pick` do que o cartão usa, e não `Solution` inteiro, para o
 * `select` da consulta e o mapper não saírem de sincronia: acrescentar campo
 * aqui deixa de compilar até a consulta pedir o campo. */
type DocDoCartao = Pick<Solution, 'slug' | 'title' | 'category' | 'icon' | 'shortDescription' | 'hasPage' | 'badge'>

export function toSolutionCard(doc: DocDoCartao): SolutionCard {
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    icon: doc.icon,
    shortDescription: doc.shortDescription,
    hasPage: Boolean(doc.hasPage),
    badge: doc.badge?.trim() || null,
  }
}
