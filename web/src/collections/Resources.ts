import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Materiais ricos: relatórios e e-books (MIG-041).
 *
 * Uma collection e não duas: no legado as duas páginas têm o mesmo dado (título,
 * descrição, capa, tags) e diferem em um campo cada — relatório tem data,
 * e-book tem número de páginas — e no rótulo do card. Duas collections seriam
 * dois formulários quase idênticos para o editor manter.
 *
 * `drafts: true` por D-08: os 6 materiais existem só como capa no protótipo e
 * ninguém escreveu o corpo (P-07). Ficam em rascunho até alguém escrever. */
export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'publishedAt', '_status'],
    listSearchableFields: ['title', 'description'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Relatórios e e-books. O tipo define em qual página o material aparece.',
      en: 'Reports and ebooks. The kind decides which page lists the item.',
    },
  },
  labels: {
    singular: { pt: 'Material', en: 'Resource' },
    plural: { pt: 'Materiais', en: 'Resources' },
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
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'report',
      options: [
        { value: 'report', label: { pt: 'Relatório', en: 'Report' } },
        { value: 'ebook', label: { pt: 'E-book', en: 'Ebook' } },
      ],
      label: { pt: 'Tipo', en: 'Kind' },
      admin: { description: { pt: 'Relatório aparece em /relatorios; e-book em /ebooks.', en: 'Reports list on /reports; ebooks on /ebooks.' } },
    },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 220,
      label: { pt: 'Descrição', en: 'Description' },
    },
    {
      /* MIG-104. A presença deste arquivo é o que **liga** o download gated na
       * página do material: sem arquivo, o botão segue como está (P-07 — os 9
       * materiais ainda não têm corpo nem PDF). Subir o PDF aqui é o gatilho. */
      name: 'file',
      type: 'relationship',
      relationTo: 'private-files',
      label: { pt: 'Arquivo (PDF) — liga o download gated', en: 'File (PDF) — enables the gated download' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { pt: 'Capa', en: 'Cover' },
    },
    {
      /* Texto solto, não relação com `topics`. As tags destes cards no legado
       * são rótulos decorativos ("Market", "2026", "ROI") e nenhuma tela filtra
       * por elas. Virar taxonomia poluiria o vocabulário que filtra cases e
       * blog. Revisitar se um filtro aparecer aqui. */
      name: 'tags',
      type: 'array',
      localized: true,
      label: { pt: 'Tags', en: 'Tags' },
      fields: [{ name: 'name', type: 'text', required: true, label: { pt: 'Tag', en: 'Tag' } }],
    },
    {
      name: 'pages',
      type: 'number',
      min: 1,
      label: { pt: 'Número de páginas', en: 'Page count' },
      admin: {
        condition: (_, irmaos) => irmaos?.kind === 'ebook',
        description: { pt: 'Mostrado no card do e-book.', en: 'Shown on the ebook card.' },
      },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { pt: 'Conteúdo', en: 'Body' },
      admin: {
        description: {
          pt: 'O material em si. Enquanto estiver vazio, mantenha em rascunho.',
          en: 'The material itself. Keep the item as a draft while this is empty.',
        },
      },
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
