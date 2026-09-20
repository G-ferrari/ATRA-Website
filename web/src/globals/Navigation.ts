import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { campoDeIcone, ICONES } from '@/blocks/shared'

/* Navegação do topo: as 7 categorias e o conteúdo dos painéis (MIG-072a).
 *
 * ⚠️ Global, e não collection: é **uma** navegação, e o editor precisa ver a
 * ordem das sete de uma vez. Cada painel é um formato diferente no legado
 * (`App.tsx:458-880`), então o tipo escolhe o que aparece no admin.
 *
 * Três painéis **não têm conteúdo aqui**, de propósito: `solutions`, `partners`
 * e `segments` leem as collections de mesmo nome. Digitá-los aqui recriaria a
 * duplicação que o legado tem — lá a lista de parceiros existe em três lugares
 * — e uma vertical nova teria que ser cadastrada duas vezes. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: { pt: 'Menu do topo', en: 'Top navigation' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'As 7 categorias do menu e o conteúdo de cada painel.',
      en: 'The 7 menu categories and each panel’s content.',
    },
  },
  access: { read: isPublic, update: isEditorOrAdmin },
  fields: [
    {
      name: 'categories',
      type: 'array',
      /* ⚠️ Eram 7 — as do protótipo — e viraram 8 quando `/segmentos` entrou no
       * menu. O teto não é burocracia: a fileira é `hidden md:flex` e começa a
       * apertar em 768px, então cada categoria nova custa largura de todas as
       * outras. Subir daqui exige olhar o cabeçalho nos três viewports do gate,
       * não só o admin aceitar. */
      maxRows: 8,
      label: { pt: 'Categorias', en: 'Categories' },
      admin: {
        description: {
          pt: 'A ordem aqui é a ordem na fileira do menu.',
          en: 'The order here is the order in the menu row.',
        },
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Rótulo', en: 'Label' } },
        {
          name: 'href',
          type: 'text',
          label: { pt: 'Destino', en: 'Target' },
          admin: {
            description: {
              pt: 'Vazio: a categoria só abre o painel, sem virar link. É o caso de Soluções e Parceiros no legado.',
              en: 'Empty: the category only opens its panel. That is how Solutions and Partners behave.',
            },
          },
        },
        {
          name: 'panel',
          type: 'select',
          required: true,
          defaultValue: 'split',
          options: [
            { value: 'solutions', label: { pt: 'Soluções (da collection)', en: 'Solutions (from collection)' } },
            { value: 'partners', label: { pt: 'Parceiros (da collection)', en: 'Partners (from collection)' } },
            { value: 'segments', label: { pt: 'Segmentos (da collection)', en: 'Segments (from collection)' } },
            { value: 'links', label: { pt: 'Grade de atalhos', en: 'Shortcut grid' } },
            { value: 'split', label: { pt: 'Texto + cartão', en: 'Text + card' } },
          ],
          label: { pt: 'Formato do painel', en: 'Panel layout' },
        },
        {
          name: 'links',
          type: 'array',
          maxRows: 5,
          label: { pt: 'Atalhos', en: 'Shortcuts' },
          admin: { condition: (_, irmaos) => irmaos?.panel === 'links' },
          fields: [
            { ...campoDeIcone },
            { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
            { name: 'description', type: 'text', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
            { name: 'href', type: 'text', required: true, label: { pt: 'Destino', en: 'Target' } },
          ],
        },
        {
          name: 'intro',
          type: 'textarea',
          localized: true,
          label: { pt: 'Texto de abertura', en: 'Intro text' },
          admin: { condition: (_, irmaos) => irmaos?.panel === 'split' },
        },
        {
          name: 'highlights',
          type: 'array',
          maxRows: 2,
          label: { pt: 'Destaques', en: 'Highlights' },
          admin: { condition: (_, irmaos) => irmaos?.panel === 'split' },
          fields: [
            { ...campoDeIcone },
            {
              /* Cada destaque do legado tem uma cor própria — esmeralda e roxo
               * em Consultores, índigo e rosa em Carreiras, laranja e azul em
               * Sobre, âmbar em Glossário. Lista fechada porque o valor vira
               * classe do Tailwind, que não enxerga classe montada em runtime. */
              name: 'color',
              type: 'select',
              defaultValue: 'primary',
              options: ['primary', 'emerald', 'purple', 'indigo', 'pink', 'orange', 'blue', 'amber'].map((v) => ({
                value: v,
                label: v,
              })),
              label: { pt: 'Cor', en: 'Colour' },
            },
            { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
            { name: 'description', type: 'text', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
          ],
        },
        {
          name: 'card',
          type: 'group',
          label: { pt: 'Cartão à direita', en: 'Right-hand card' },
          admin: { condition: (_, irmaos) => irmaos?.panel === 'split' },
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: ICONES.map((v) => ({ value: v, label: v })),
              label: { pt: 'Ícone', en: 'Icon' },
            },
            { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
            {
              name: 'bullets',
              type: 'array',
              maxRows: 4,
              label: { pt: 'Itens', en: 'Bullets' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { pt: 'Item', en: 'Item' } }],
            },
            { name: 'ctaLabel', type: 'text', localized: true, label: { pt: 'Texto do link', en: 'Link label' } },
            { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
          ],
        },
      ],
    },
  ],
}
