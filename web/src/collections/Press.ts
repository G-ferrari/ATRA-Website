import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'

/* ATRA na mídia (D-49): as matérias, entrevistas e vídeos em que a ATRA aparece
 * na imprensa. Nasceu em 02/10, no lugar dos relatórios de exemplo do
 * protótipo, com o conteúdo da página `/atra-na-midia/` do WordPress.
 *
 * O molde é o dos webinars — lista com destaque no topo e grade de cartões —,
 * com uma diferença de propósito: **não há página interna por matéria**. O
 * cartão abre a matéria no veículo, em outra aba, como no site antigo. Uma
 * página nossa só teria o resumo e um botão, e o Google trata isso como página
 * magra (D-08). Por isso não há `slug` nem `seo` aqui. */

const ehUrl = (valor: unknown) =>
  (typeof valor === 'string' && /^https?:\/\/\S+$/i.test(valor.trim())) || 'Use o endereço completo, começando com https://'

export const Press: CollectionConfig = {
  slug: 'press',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'outlet', 'kind', 'order', '_status'],
    listSearchableFields: ['title', 'outlet', 'description'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Matérias, entrevistas e vídeos sobre a ATRA na imprensa. Cada item aparece em "ATRA na mídia" e abre no site do veículo.',
      en: 'Articles, interviews and videos about ATRA in the press. Each item shows on "ATRA in the media" and opens on the outlet\'s site.',
    },
  },
  labels: {
    singular: { pt: 'Matéria', en: 'Press item' },
    plural: { pt: 'ATRA na mídia', en: 'ATRA in the media' },
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
    {
      /* Sem `localized`: é o nome próprio do veículo, igual nos dois idiomas. */
      name: 'outlet',
      type: 'text',
      required: true,
      label: { pt: 'Veículo', en: 'Outlet' },
      admin: { description: { pt: 'Quem publicou. Ex.: Gazeta Mercantil Digital.', en: 'Who published it. E.g. Gazeta Mercantil Digital.' } },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 300,
      label: { pt: 'Resumo', en: 'Summary' },
    },
    {
      /* É também a identidade do item: a migração de carga e quem importar de
       * novo acham a matéria por aqui, e a mesma matéria não entra duas vezes. */
      name: 'url',
      type: 'text',
      required: true,
      unique: true,
      validate: ehUrl,
      label: { pt: 'Link da matéria', en: 'Article URL' },
      admin: {
        description: {
          pt: 'O endereço no site do veículo (ou do vídeo). É para onde o cartão leva, em outra aba.',
          en: "The address on the outlet's site (or the video's). It is where the card leads, in a new tab.",
        },
      },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true, label: { pt: 'Capa', en: 'Cover' } },
    {
      /* Só muda o desenho: vídeo ganha o botão de play sobre a capa e "Assistir"
       * no lugar de "Leia a matéria". No site antigo os dois diziam "Leia a
       * matéria", inclusive os do YouTube. */
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        { value: 'article', label: { pt: 'Matéria', en: 'Article' } },
        { value: 'video', label: { pt: 'Vídeo', en: 'Video' } },
      ],
      label: { pt: 'Tipo', en: 'Type' },
      admin: { position: 'sidebar' },
    },
    {
      /* Opcional: a página do WordPress não mostrava data, e nenhuma das seis
       * primeiras veio com uma. Preenchida, aparece no cartão. */
      name: 'publishedAt',
      type: 'date',
      label: { pt: 'Data da publicação', en: 'Published on' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      /* Mesma regra dos webinars: a ordem é de quem edita, e a primeira é o
       * destaque. Sem data em todas, ordenar por data deixaria a página à mercê
       * de campo vazio. */
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: { pt: 'Ordem', en: 'Order' },
      admin: { position: 'sidebar', description: { pt: 'Menor aparece primeiro.', en: 'Lower comes first.' } },
    },
  ],
}
