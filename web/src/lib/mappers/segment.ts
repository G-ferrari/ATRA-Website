import type { Segment } from '@/payload-types'
import type { SegmentCard } from '@/types/content'

/* Mesmo padrão de `solution.ts`: o parâmetro é o `Pick` do que o cartão usa, e
 * não `Segment` inteiro, para o `select` da consulta e o mapper não saírem de
 * sincronia — acrescentar campo aqui deixa de compilar até a consulta pedir. */
type DocDoCartao = Pick<Segment, 'slug' | 'name' | 'icon' | 'shortDescription'>

export function toSegmentCard(doc: DocDoCartao): SegmentCard {
  return {
    slug: doc.slug,
    name: doc.name,
    icon: doc.icon,
    shortDescription: doc.shortDescription,
  }
}
