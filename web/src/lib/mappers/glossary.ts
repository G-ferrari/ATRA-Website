import type { GlossaryTerm as Doc } from '@/payload-types'
import type { GlossaryTerm } from '@/types/content'

export function toGlossaryTerm(doc: Doc): GlossaryTerm {
  return {
    slug: doc.slug,
    term: doc.term,
    definition: doc.definition,
    category: doc.category,
  }
}

/**
 * Primeira letra do termo, normalizada.
 *
 * Sem `normalize`, "Índice" cairia num grupo "Í" separado de "I" — o legado tem
 * "Inteligência Artificial (IA)" e "IA Generativa", que precisam ficar juntos.
 */
export function letraDe(termo: string): string {
  return termo
    .charAt(0)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
}

/** Agrupa por letra e ordena os termos dentro de cada uma. */
export function agruparPorLetra(termos: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const grupos: Record<string, GlossaryTerm[]> = {}
  for (const t of termos) {
    const letra = letraDe(t.term)
    ;(grupos[letra] ??= []).push(t)
  }
  for (const letra of Object.keys(grupos)) {
    grupos[letra].sort((a, b) => a.term.localeCompare(b.term))
  }
  return grupos
}
