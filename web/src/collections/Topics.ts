import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { slugField } from '@/fields/slug'

/* Taxonomia única de assunto. Existe como collection, e não como array de
 * texto, porque tag livre já produziu "IA" vs "Inteligência Artificial" e
 * "Governança" vs "Governança & LGPD" no legado — ver inventario-conteudo.md. */
export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Conteúdo',
    description: {
      pt: 'Assuntos usados para filtrar cases, artigos e materiais. Vocabulário controlado: prefira reaproveitar a criar.',
      en: 'Topics used to filter cases, posts and resources. Controlled vocabulary: prefer reusing over creating.',
    },
  },
  labels: {
    singular: { pt: 'Assunto', en: 'Topic' },
    plural: { pt: 'Assuntos', en: 'Topics' },
  },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Nome', en: 'Name' },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { pt: 'Descrição', en: 'Description' },
    },
  ],
}
