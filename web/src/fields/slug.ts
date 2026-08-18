import type { CollectionBeforeValidateHook, Field } from 'payload'

/** Título → slug, sem acento e sem pontuação. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* D-07: o slug é localizado — `/sobre` vira `/en/about`, não `/en/sobre`.
 * Gerado do título quando vazio, com override manual sempre disponível. */
export const slugField = (origem = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  localized: true,
  label: { pt: 'Slug (URL)', en: 'Slug (URL)' },
  admin: {
    position: 'sidebar',
    description: {
      pt: 'Parte final da URL. Gerado do título se ficar vazio. Mudar depois de publicar quebra links existentes.',
      en: 'Final part of the URL. Generated from the title when left empty. Changing it after publishing breaks existing links.',
    },
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const base = (data as Record<string, unknown>)?.[origem]
        return typeof base === 'string' && base.trim() ? slugify(base) : value
      },
    ],
  },
})

/** Bloqueia salvar sem o campo que dá URL à página. */
export const exigirSlug: CollectionBeforeValidateHook = ({ data }) => data
