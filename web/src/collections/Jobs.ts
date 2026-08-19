import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Vagas (MIG-050).
 *
 * P-02 foi respondida por evidência: o sitemap do WordPress mostra 6 vagas
 * publicadas como páginas comuns — não há ATS. O fluxo atual se mantém, só muda
 * o CMS. Resta confirmar com o RH se querem seguir assim (pendencias.md).
 *
 * ⚠️ A candidatura em si — formulário e upload de currículo — é MIG-102, e
 * depende de P-17: prazo de retenção do CV e quem no RH tem acesso. É exigência
 * de LGPD, não preferência. */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'area', 'locationType', '_status'],
    listSearchableFields: ['title', 'area'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Vagas abertas. Despublique quando a vaga fechar — não apague, para o link não quebrar.',
      en: 'Open roles. Unpublish when a role closes; do not delete, so the link keeps working.',
    },
  },
  labels: { singular: { pt: 'Vaga', en: 'Job' }, plural: { pt: 'Vagas', en: 'Jobs' } },
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
    { name: 'area', type: 'text', required: true, localized: true, label: { pt: 'Área', en: 'Area' } },
    {
      name: 'locationType',
      type: 'select',
      required: true,
      defaultValue: 'remote',
      options: [
        { value: 'remote', label: { pt: 'Remoto', en: 'Remote' } },
        { value: 'hybrid', label: { pt: 'Híbrido', en: 'Hybrid' } },
        { value: 'onsite', label: { pt: 'Presencial', en: 'On site' } },
      ],
      label: { pt: 'Modelo de trabalho', en: 'Work model' },
    },
    { name: 'location', type: 'text', localized: true, label: { pt: 'Localidade', en: 'Location' } },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 220,
      label: { pt: 'Resumo', en: 'Summary' },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { pt: 'Descrição da vaga', en: 'Role description' },
      admin: {
        description: {
          pt: 'Responsabilidades, requisitos e diferenciais. Publique só com isto preenchido.',
          en: 'Responsibilities, requirements and nice-to-haves. Publish only once filled in.',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: { pt: 'Publicada em', en: 'Published at' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    seoField,
  ],
}
