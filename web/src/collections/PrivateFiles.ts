import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '@/access'

/* Arquivos que o público NÃO lê (MIG-102/104): currículos de candidatos e os
 * PDFs de material rico.
 *
 * ⚠️ Collection própria, e **bucket próprio** (`S3_PRIVATE_BUCKET`), porque o
 * bucket da `media` tem download anônimo ligado — qualquer URL adivinhada é
 * pública, e a política do MinIO/R2 é por bucket, não por prefixo. Currículo é
 * dado pessoal (P-17): no bucket público ele estaria a um palpite de distância.
 *
 * Como cada tipo sai daqui:
 * - **Currículo**: só pelo admin, autenticado — o endpoint de arquivo do
 *   Payload respeita o `access.read` abaixo. Não há URL pública, assinada ou
 *   não.
 * - **Material rico**: por **URL pré-assinada** de 15 minutos, gerada na Server
 *   Action depois do formulário (`actions/materiais.ts`). A assinatura fala S3
 *   direto e não passa pelo Payload — por isso o `access.read` restrito aqui
 *   não atrapalha o download do visitante.
 */
export const PrivateFiles: CollectionConfig = {
  slug: 'private-files',
  admin: {
    group: { pt: 'Biblioteca', en: 'Library' },
    useAsTitle: 'label',
    defaultColumns: ['label', 'kind', 'filename', 'createdAt'],
    description: {
      pt: 'Currículos e arquivos de material rico. Nada daqui é público — currículo é dado pessoal.',
      en: 'CVs and gated-material files. Nothing here is public — CVs are personal data.',
    },
  },
  labels: {
    singular: { pt: 'Arquivo privado', en: 'Private file' },
    plural: { pt: 'Arquivos privados', en: 'Private files' },
  },
  access: {
    /* Editor lê (RH baixa currículo pelo admin); visitante nunca. `create` só
     * admin no painel — os uploads de verdade entram pela Local API das
     * actions, que roda com overrideAccess. */
    read: isEditorOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    /* Só PDF: é o que o formulário de vaga aceita e o que material rico usa.
     * Sem imageSizes — nada aqui é imagem. */
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: { pt: 'Descrição', en: 'Label' },
      admin: {
        description: {
          pt: 'De onde veio: "CV — Fulano (vaga X)" ou "PDF — nome do material".',
          en: 'Where it came from: "CV — name (job X)" or "PDF — material name".',
        },
      },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      label: { pt: 'Tipo', en: 'Kind' },
      options: [
        { value: 'cv', label: { pt: 'Currículo', en: 'CV' } },
        { value: 'material', label: { pt: 'Material rico', en: 'Gated material' } },
      ],
    },
  ],
}
