import type { Block } from 'payload'

import { campoDeIcone, camposComuns } from './shared'

/* Blocos de página (MIG-047).
 *
 * Regra 3 de blocos.md: **bloco novo exige justificativa no PR** — por que
 * nenhum dos existentes serve. É o que impede 20 rotas virarem 20 dialetos. */

export const PageHero: Block = {
  slug: 'pageHero',
  labels: { singular: { pt: 'Abertura de página', en: 'Page hero' }, plural: { pt: 'Aberturas', en: 'Page heroes' } },
  fields: [
    { name: 'badge', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
    { name: 'chip', type: 'text', localized: true, label: { pt: 'Etiqueta', en: 'Chip' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* O legado destaca trechos do título em azul e laranja com `<span>`
       * (`About.tsx:175`). Como o editor não escreve HTML, o destaque vira
       * campo: o texto aqui é procurado no título e recebe a cor. */
      name: 'highlight',
      type: 'text',
      localized: true,
      label: { pt: 'Trecho destacado', en: 'Highlighted text' },
      admin: {
        description: {
          pt: 'Um trecho do título que aparece em azul. Deve existir no título.',
          en: 'A slice of the title shown in blue. Must appear in the title.',
        },
      },
    },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      label: { pt: 'Botões', en: 'Buttons' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', required: true, label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    ...camposComuns,
  ],
}

export const RichTextSection: Block = {
  slug: 'richTextSection',
  labels: { singular: { pt: 'Texto com imagem', en: 'Text with image' }, plural: { pt: 'Textos', en: 'Text sections' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'body', type: 'richText', localized: true, label: { pt: 'Texto', en: 'Body' } },
    { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Imagem', en: 'Image' } },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { value: 'left', label: { pt: 'À esquerda', en: 'Left' } },
        { value: 'right', label: { pt: 'À direita', en: 'Right' } },
        { value: 'none', label: { pt: 'Sem imagem', en: 'No image' } },
      ],
      label: { pt: 'Posição da imagem', en: 'Image position' },
    },
    ...camposComuns,
  ],
}

export const IconCardGrid: Block = {
  slug: 'iconCardGrid',
  labels: { singular: { pt: 'Grade de cards', en: 'Icon card grid' }, plural: { pt: 'Grades', en: 'Icon card grids' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: ['2', '3', '4'].map((v) => ({ value: v, label: v })),
      label: { pt: 'Colunas', en: 'Columns' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Cards', en: 'Cards' },
      fields: [
        campoDeIcone,
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        {
          /* Opcional porque o legado usa a mesma grade de dois jeitos: uma só
           * com rótulo (`About.tsx:403`) e outra com título e texto (`:434`).
           * O card muda de forma conforme o preenchimento, em vez de virarem
           * dois blocos quase idênticos. */
          name: 'description',
          type: 'textarea',
          localized: true,
          label: { pt: 'Descrição', en: 'Description' },
          admin: {
            description: {
              pt: 'Vazio, o card fica compacto e centralizado.',
              en: 'Left empty, the card renders compact and centred.',
            },
          },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  labels: { singular: { pt: 'Faixa de chamada', en: 'CTA banner' }, plural: { pt: 'Faixas', en: 'CTA banners' } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'highlight', type: 'text', localized: true, label: { pt: 'Trecho destacado', en: 'Highlighted text' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão', en: 'Button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { value: 'primary', label: { pt: 'Azul', en: 'Primary' } },
        { value: 'subtle', label: { pt: 'Discreta', en: 'Subtle' } },
      ],
      label: { pt: 'Estilo', en: 'Style' },
    },
    ...camposComuns,
  ],
}

export const BLOCOS = [PageHero, RichTextSection, IconCardGrid, CtaBanner]
