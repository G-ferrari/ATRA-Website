import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Webinars (MIG-042).
 *
 * D-11: o vídeo entra por embed de YouTube/Vimeo, não por upload — a ATRA já
 * publica lá e hospedar de novo dobraria custo e trabalho. */
export const Webinars: CollectionConfig = {
  slug: 'webinars',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'dateLabel', 'startsAt', '_status'],
    listSearchableFields: ['title', 'description'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Webinars e eventos online. O vídeo entra por link do YouTube ou Vimeo.',
      en: 'Webinars and online events. The video comes in as a YouTube or Vimeo link.',
    },
  },
  labels: {
    singular: { pt: 'Webinar', en: 'Webinar' },
    plural: { pt: 'Webinars', en: 'Webinars' },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: 'order',
  fields: [
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
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true, label: { pt: 'Capa', en: 'Cover' } },
    {
      /* Texto, não data formatada. O legado escreve "Amanhã, 15:00" no primeiro
       * card — nenhum formatador produz isso, e trocar por data real mudaria o
       * que está no ar. Quem edita escreve o que quer que apareça. */
      name: 'dateLabel',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Data exibida', en: 'Displayed date' },
      admin: {
        description: {
          pt: 'Como aparece no card. Ex.: "Amanhã, 15:00" ou "10 de maio de 2026".',
          en: 'As shown on the card. E.g. "Tomorrow, 3pm" or "May 10, 2026".',
        },
      },
    },
    {
      /* A data de verdade, separada do rótulo: serve para ordenar, para saber o
       * que já passou e para dados estruturados. Opcional porque o legado não
       * tem — não vale bloquear a publicação por um campo que ninguém preencheu. */
      name: 'startsAt',
      type: 'date',
      label: { pt: 'Início (data real)', en: 'Starts at' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'duration',
      type: 'text',
      defaultValue: '45:00',
      label: { pt: 'Duração', en: 'Duration' },
      admin: { description: { pt: 'Aparece sobre a capa. Ex.: 45:00.', en: 'Shown over the cover. E.g. 45:00.' } },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: { pt: 'Link do vídeo', en: 'Video URL' },
      admin: {
        description: {
          pt: 'YouTube ou Vimeo. Vazio enquanto o webinar não foi gravado (D-11).',
          en: 'YouTube or Vimeo. Empty until the webinar has been recorded (D-11).',
        },
      },
    },
    {
      name: 'tags',
      type: 'array',
      localized: true,
      label: { pt: 'Tags', en: 'Tags' },
      fields: [{ name: 'name', type: 'text', required: true, label: { pt: 'Tag', en: 'Tag' } }],
    },
    {
      /* O legado ordena pela posição no array e o primeiro é o próximo evento.
       * Sem data real em todos, ordenar por `startsAt` deixaria a página à mercê
       * de campo vazio. */
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: { pt: 'Ordem', en: 'Order' },
      admin: { position: 'sidebar', description: { pt: 'Menor aparece primeiro.', en: 'Lower comes first.' } },
    },
    seoField,
  ],
}
