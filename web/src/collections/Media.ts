import { APIError, type CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { cabecalhosDoArquivoExterno } from '@/lib/arquivo-externo'

const TETO_DO_VIDEO = 50 * 1024 * 1024

const WEBP = { format: 'webp' as const, options: { quality: 82 } }

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: { pt: 'Biblioteca', en: 'Library' },
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    listSearchableFields: ['alt', 'filename'],
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
  hooks: {
    beforeOperation: [
      /* ⚠️ Teto só para vídeo. O arquivo é servido pelo próprio site
       * (`/api/media/file/`), saindo do mesmo servidor que builda e roda o
       * banco: um vídeo de 500 MB na abertura de uma página é banda e disco de
       * uma VM de 8 GB. Vídeo longo vai para o YouTube, pelo campo de link. */
      ({ req, operation }) => {
        const arquivo = req.file
        if ((operation === 'create' || operation === 'update') && arquivo?.mimetype?.startsWith('video/') && arquivo.size > TETO_DO_VIDEO) {
          throw new APIError(
            `Vídeo de ${Math.ceil(arquivo.size / 1024 / 1024)} MB: o limite é ${TETO_DO_VIDEO / 1024 / 1024} MB. Para vídeo maior, publique no YouTube e use o link.`,
            400,
          )
        }
      },
    ],
  },
  upload: {
    /* MIG-144: raster enumerado, e não `image/*` — o curinga inclui
     * `image/svg+xml`, e SVG carrega script: um arquivo malicioso na
     * biblioteca viraria XSS armazenado servido por /api/media/file/. Só
     * editor autenticado sobe mídia, mas defesa em profundidade aqui custa uma
     * linha. O acervo é JPEG/PNG/WebP (tudo convertido a WebP no upload); a
     * lista restringe uploads novos e não toca no que já existe.
     *
     * Vídeo entrou em 09/10, para a "Mídia ao lado" da abertura de página: só
     * MP4 e WebM, que todo navegador toca sem conversão. O `formatOptions` e os
     * `imageSizes` abaixo não tocam neles — o Payload só redimensiona imagem,
     * como já era com o PDF. */
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf', 'video/mp4', 'video/webm'],
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
    /* P-31: o editor de imagem baixa o original pelo endereço do próprio site,
     * e na homologação a senha do Caddy barrava o download. Ver o módulo. */
    externalFileHeaderFilter: cabecalhosDoArquivoExterno,
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
