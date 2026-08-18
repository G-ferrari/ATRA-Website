import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'

const WEBP = { format: 'webp' as const, options: { quality: 82 } }

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Biblioteca',
    useAsTitle: 'alt',
  },
  labels: {
    singular: { pt: 'Mídia', en: 'Media' },
    plural: { pt: 'Mídia', en: 'Media' },
  },
  access: {
    // Imagem de site é conteúdo público; alterar exige estar autenticado (D-18).
    read: isPublic,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    // Tamanhos gerados no upload, uma vez, em vez de a cada requisição.
    // É o que mantém o custo de CPU proporcional ao número de uploads e não
    // ao tráfego — ver docs/04-infra/docker.md.
    // ⚠️ formatOptions no nível do upload converte só o arquivo original.
    // Os imageSizes precisam do seu próprio formatOptions, senão saem em JPEG
    // — e são justamente eles que chegam ao visitante. Verificado na prática:
    // sem isto, anbima.webp convivia com anbima-400x400.jpg.
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'card', width: 768, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'hero', width: 1600, withoutEnlargement: true, formatOptions: WEBP },
    ],
    formatOptions: WEBP,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Texto alternativo', en: 'Alt text' },
      admin: {
        description: {
          pt: 'Descreva a imagem para quem usa leitor de tela. Obrigatório.',
          en: 'Describe the image for screen reader users. Required.',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: { pt: 'Legenda', en: 'Caption' },
    },
    {
      name: 'credit',
      type: 'text',
      label: { pt: 'Crédito', en: 'Credit' },
      admin: {
        description: {
          pt: 'Fonte ou autoria da imagem, quando houver.',
          en: 'Image source or authorship, when applicable.',
        },
      },
    },
  ],
}
