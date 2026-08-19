import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { BLOCOS } from '@/blocks'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Páginas montadas por blocos (MIG-047).
 *
 * É a collection que responde ao objetivo declarado da migração: o marketing
 * monta e reordena seção sem pedir deploy. `/sobre`, `/carreiras` e `/contato`
 * vivem aqui (blocos.md); rota e seed vêm em MIG-049.
 *
 * O slug é localizado (D-07) e a rota é resolvida por ele, então mudar o slug
 * muda a URL — o admin avisa. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
    listSearchableFields: ['title', 'slug'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Páginas montadas por blocos. Arraste para reordenar as seções.',
      en: 'Pages assembled from blocks. Drag to reorder sections.',
    },
  },
  labels: { singular: { pt: 'Página', en: 'Page' }, plural: { pt: 'Páginas', en: 'Pages' } },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    slugField('title'),
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: BLOCOS,
      label: { pt: 'Seções', en: 'Sections' },
      labels: { singular: { pt: 'Seção', en: 'Section' }, plural: { pt: 'Seções', en: 'Sections' } },
    },
    seoField,
  ],
}
