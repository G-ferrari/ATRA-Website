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

export const StatsGrid: Block = {
  slug: 'statsGrid',
  labels: { singular: { pt: 'Números', en: 'Stats grid' }, plural: { pt: 'Números', en: 'Stats grids' } },
  fields: [
    {
      /* `siteSettings` é o padrão de propósito: o número institucional tem que
       * ser o mesmo no site inteiro, e foi por duas páginas divergirem que P-01
       * existe. `custom` fica para grade que não é institucional. */
      name: 'source',
      type: 'select',
      defaultValue: 'siteSettings',
      options: [
        { value: 'siteSettings', label: { pt: 'Dados institucionais', en: 'Site settings' } },
        { value: 'custom', label: { pt: 'Números próprios deste bloco', en: 'Custom to this block' } },
      ],
      label: { pt: 'Origem dos números', en: 'Figures from' },
    },
    {
      name: 'customItems',
      type: 'array',
      label: { pt: 'Números', en: 'Figures' },
      admin: { condition: (_, irmaos) => irmaos?.source === 'custom' },
      fields: [
        { name: 'value', type: 'number', required: true, label: { pt: 'Número', en: 'Value' } },
        { name: 'suffix', type: 'text', label: { pt: 'Sufixo', en: 'Suffix' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Rótulo', en: 'Label' } },
      ],
    },
    ...camposComuns,
  ],
}

export const SealsBanner: Block = {
  slug: 'sealsBanner',
  labels: { singular: { pt: 'Faixa de selos', en: 'Seals banner' }, plural: { pt: 'Faixas de selos', en: 'Seals banners' } },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    ...camposComuns,
  ],
}

export const ValueCards: Block = {
  slug: 'valueCards',
  labels: { singular: { pt: 'Cards de valores', en: 'Value cards' }, plural: { pt: 'Cards de valores', en: 'Value cards' } },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Valores', en: 'Values' },
      fields: [
        campoDeIcone,
        {
          name: 'glowColor',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { value: 'blue', label: { pt: 'Azul', en: 'Blue' } },
            { value: 'orange', label: { pt: 'Laranja', en: 'Orange' } },
          ],
          label: { pt: 'Cor do brilho', en: 'Glow colour' },
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    ...camposComuns,
  ],
}

export const StickyPageNav: Block = {
  slug: 'stickyPageNav',
  labels: { singular: { pt: 'Menu da página', en: 'Page nav' }, plural: { pt: 'Menus da página', en: 'Page navs' } },
  /* Sem campo de itens: eles são **derivados** dos blocos que preencheram
   * `anchor` (blocos.md, regra 2). Deixar o editor digitar a lista à mão
   * garantiria menu apontando para seção que não existe mais — o erro que este
   * bloco existe para não ter. Ele só marca **onde** o menu aparece. */
  fields: [...camposComuns],
}

export const BLOCOS = [
  PageHero,
  StickyPageNav,
  StatsGrid,
  RichTextSection,
  IconCardGrid,
  ValueCards,
  SealsBanner,
  CtaBanner,
]
