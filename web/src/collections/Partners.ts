import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Parceiros de tecnologia. Separada de `clients` porque cliente é quem
 * contrata (logo + nome) e parceiro é fornecedor, com descrição, nível e
 * página própria — ver modelo-de-conteudo.md.
 *
 * No legado a mesma lista existia em TRÊS lugares: App.tsx:107, App.tsx:1396 e
 * ui/logo-clouds.tsx:24. */
export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name', 'slug', 'description'],
    defaultColumns: ['name', 'tier', 'featured', 'hasPage'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Parceiros de tecnologia. Aparecem no menu, na home e na página de parceiro.',
      en: 'Technology partners. Shown in the menu, on the home page and on partner pages.',
    },
  },
  labels: {
    singular: { pt: 'Parceiro', en: 'Partner' },
    plural: { pt: 'Parceiros', en: 'Partners' },
  },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { pt: 'Nome', en: 'Name' },
      admin: { description: { pt: 'Não é traduzido: nome próprio.', en: 'Not translated: proper noun.' } },
    },
    slugField('name'),
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { pt: 'Logo', en: 'Logo' },
      admin: {
        description: {
          pt: 'Preferir SVG. O repositório já tem os SVGs íntegros dos parceiros.',
          en: 'Prefer SVG. The repository already has intact partner SVGs.',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Descrição', en: 'Description' },
      admin: { description: { pt: 'Uma frase, usada no menu.', en: 'One sentence, used in the menu.' } },
    },
    {
      name: 'tier',
      type: 'text',
      localized: true,
      label: { pt: 'Nível da parceria', en: 'Partnership tier' },
      admin: { description: { pt: 'Ex.: Premier Partner.', en: 'E.g. Premier Partner.' } },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { pt: 'Destacar na home', en: 'Feature on the home page' },
    },
    {
      name: 'hasPage',
      type: 'checkbox',
      label: { pt: 'Tem página própria', en: 'Has its own page' },
      admin: {
        description: {
          pt: 'Sem isto, o parceiro aparece no menu mas não vira link.',
          en: 'Without this, the partner appears in the menu but is not a link.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { pt: 'Ordem', en: 'Order' },
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
