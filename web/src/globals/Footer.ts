import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'

/* Rodapé do site (MIG-072) — porte de `legacy/src/App.tsx:2450`.
 *
 * As colunas são um array em vez de três campos fixos (`solucoes`,
 * `institucional`, `legal`) porque no legado elas já são a mesma coisa desenhada
 * três vezes, e o editor precisa poder renomear um título ou trocar a ordem sem
 * PR. `kind` existe para a coluna de contato: ela não tem links próprios —
 * desenha telefone, e-mail e endereço do global `contact`, com ícone.
 *
 * ⚠️ O texto dos títulos e o "sobre a ATRA" são **conteúdo** e vêm daqui. O que
 * ficou em `lib/navegacao.ts` é só cromo da interface (rótulo do botão de menu,
 * `alt` do logo, "Alternar tema") — string que nenhum editor de marketing vai
 * querer mudar e que não muda de página para página. */
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: { pt: 'Rodapé', en: 'Footer' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Colunas, textos e links do rodapé. Aparece em todas as páginas menos /chat.',
      en: 'Footer columns, text and links. Shown on every page except /chat.',
    },
  },
  access: { read: isPublic, update: isEditorOrAdmin },
  fields: [
    {
      name: 'about',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Sobre a ATRA', en: 'About ATRA' },
      admin: {
        description: {
          pt: 'Parágrafo curto embaixo do logo.',
          en: 'Short paragraph under the logo.',
        },
      },
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      label: { pt: 'Colunas', en: 'Columns' },
      admin: {
        description: {
          pt: 'A ordem aqui é a ordem no rodapé. A coluna do logo não entra: ela é fixa.',
          en: 'The order here is the footer order. The logo column is fixed and not listed.',
        },
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'links',
          label: { pt: 'Conteúdo', en: 'Content' },
          options: [
            { value: 'links', label: { pt: 'Lista de links', en: 'Link list' } },
            { value: 'contact', label: { pt: 'Dados de contato', en: 'Contact details' } },
          ],
          admin: {
            description: {
              pt: '“Dados de contato” ignora os links e desenha o global Contato.',
              en: '“Contact details” ignores the links and renders the Contact global.',
            },
          },
        },
        {
          name: 'links',
          type: 'array',
          label: { pt: 'Links', en: 'Links' },
          admin: { condition: (_, irmao) => irmao?.kind !== 'contact' },
          fields: [
            { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Rótulo', en: 'Label' } },
            {
              name: 'href',
              type: 'text',
              label: { pt: 'Destino', en: 'Target' },
              admin: {
                description: {
                  /* Os 3 links legais e as 3 soluções apontavam para `#` no
                   * legado. Hoje nenhum link do rodapé está vazio, mas o campo
                   * continua aceitando. */
                  pt: 'Vazio ou “#”: o link não leva a lugar nenhum, como no protótipo.',
                  en: 'Empty or “#”: the link goes nowhere, as in the prototype.',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Direitos autorais', en: 'Copyright' },
      admin: { position: 'sidebar' },
    },
  ],
}
