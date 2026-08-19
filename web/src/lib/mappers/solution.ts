import type { Solution } from '@/payload-types'
import type { SolutionCard } from '@/types/content'

export function toSolutionCard(doc: Solution): SolutionCard {
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    icon: doc.icon,
    shortDescription: doc.shortDescription,
    hasPage: Boolean(doc.hasPage),
  }
}
