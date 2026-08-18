import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Blog (MIG-043).
 *
 * ⚠️ Esta collection recebe os **207 posts reais do WordPress** na Fase 4b
 * (D-17). Os 6 do protótipo são fictícios e servem só de fixture do porte —
 * ver scripts/seed/posts.ts.
 *
 * `drafts: true` por D-08: post sem corpo é página magra, e página magra
 * prejudica o domínio inteiro. Aqui a regra vale de verdade, ao contrário de
 * `resources`, onde o material é isca de lead e não artigo. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    listSearchableFields: ['title', 'description'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Artigos do blog. Publique só com o corpo escrito.',
      en: 'Blog posts. Publish only once the body is written.',
    },
  },
  labels: {
    singular: { pt: 'Artigo', en: 'Post' },
    plural: { pt: 'Blog', en: 'Blog' },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 220,
      label: { pt: 'Resumo', en: 'Summary' },
      admin: {
        description: {
          pt: 'Até 220 caracteres. Aparece no card e como descrição para buscadores.',
          en: 'Up to 220 characters. Used on the card and as the search description.',
        },
      },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true, label: { pt: 'Capa', en: 'Cover' } },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { pt: 'Conteúdo', en: 'Body' },
      admin: {
        description: {
          pt: 'O artigo. Enquanto estiver vazio, mantenha em rascunho.',
          en: 'The article. Keep it as a draft while this is empty.',
        },
      },
    },
    {
      /* Texto solto e não relação com `topics`, pela mesma razão de `resources`:
       * as tags do blog no legado ("Managed IT", "Retail", "Finance") são
       * rótulos de card, e a barra de filtro é uma lista fixa e separada
       * (`Blog.tsx:62`) que nem sempre coincide com elas. */
      name: 'tags',
      type: 'array',
      localized: true,
      label: { pt: 'Tags', en: 'Tags' },
      fields: [{ name: 'name', type: 'text', required: true, label: { pt: 'Tag', en: 'Tag' } }],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: { pt: 'Data de publicação', en: 'Published at' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    seoField,
  ],
}
