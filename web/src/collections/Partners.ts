import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { seoField } from '@/fields/seo'
import { BLOCOS } from '@/blocks'
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
        /* ⚠️ O texto antigo pedia SVG, e o Media recusa SVG desde MIG-140. */
        description: {
          pt: 'PNG com fundo transparente, recortado rente ao logo (sem margem), com pelo menos 400px de largura. Margem no arquivo conta como logo e o deixa menor que os outros.',
          en: 'Transparent PNG, cropped tight to the logo (no margin), at least 400px wide. Margin in the file counts as logo and makes it smaller than the others.',
        },
      },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Logo para o tema escuro', en: 'Logo for the dark theme' },
      admin: {
        description: {
          pt: 'Opcional. Vazio, o logo acima vale nos dois temas. Mesmas regras de arquivo.',
          en: 'Optional. When empty, the logo above is used in both themes. Same file rules.',
        },
      },
    },
    {
      /* Ajuste fino do tamanho do logo, por marca.
       *
       * O legado fixava uma altura por logo (`About.tsx:384`) para compensar
       * proporção e margem dos arquivos. Desde 26/09 o site iguala o peso
       * visual sozinho, pela proporção do arquivo recortado (`lib/logo.ts`), e
       * isto só corrige o que o olho ainda pedir. */
      name: 'logoScale',
      type: 'select',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: { pt: 'Pequeno', en: 'Small' } },
        { value: 'md', label: { pt: 'Médio', en: 'Medium' } },
        { value: 'lg', label: { pt: 'Grande', en: 'Large' } },
      ],
      label: { pt: 'Tamanho do logo', en: 'Logo size' },
      admin: {
        position: 'sidebar',
        description: {
          pt: 'Ajuste fino. O site já equilibra os logos pela proporção; use só se um ainda parecer grande ou pequeno demais.',
          en: 'Fine-tuning. The site already balances logos by their proportions; use only if one still looks too big or too small.',
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
      /* A página do parceiro é montada por blocos, como /sobre — só aparece se
       * `hasPage`. O legado tinha um `PartnerPageBase` fixo; blocos dão a mesma
       * estrutura (herói, texto, grades, faixa) sem página nova por parceiro. */
      name: 'layout',
      type: 'blocks',
      blocks: BLOCOS,
      label: { pt: 'Seções da página', en: 'Page sections' },
      admin: { condition: (_, irmaos) => Boolean(irmaos?.hasPage) },
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
