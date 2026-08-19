import type { Field } from 'payload'

/* Campos que **todo** bloco aceita (blocos.md, regra 2).
 *
 * `anchor` alimenta o `stickyPageNav` das páginas longas; `theme` reproduz a
 * alternância de fundo que o legado faz seção a seção. Ficam aqui, e não
 * repetidos em cada bloco, porque a regra é sobre o conjunto: bloco que não
 * aceitasse os dois quebraria a navegação ou a listra de fundo da página. */
export const camposComuns: Field[] = [
  {
    name: 'anchor',
    type: 'text',
    label: { pt: 'Âncora', en: 'Anchor' },
    admin: {
      position: 'sidebar',
      description: {
        pt: 'Preenchido, o bloco entra no menu lateral da página. Ex.: quem-somos.',
        en: 'When filled, the block joins the page side nav. E.g. who-we-are.',
      },
    },
  },
  {
    name: 'theme',
    type: 'select',
    defaultValue: 'surface-1',
    options: [
      { value: 'surface-1', label: { pt: 'Fundo padrão', en: 'Default background' } },
      { value: 'surface-2', label: { pt: 'Fundo alternado', en: 'Alternate background' } },
    ],
    label: { pt: 'Fundo', en: 'Background' },
    admin: { position: 'sidebar' },
  },
]

/* Ícones disponíveis para os blocos.
 *
 * Lista fechada, e não texto livre: o valor vira um componente React, e nome
 * inválido só apareceria como buraco na página em produção. Crescer a lista é
 * uma linha aqui e uma no registro de `components/blocks/icones.ts` — os dois
 * ficam juntos de propósito, para não divergirem. */
export const ICONES = [
  'sparkles',
  'target',
  'shield',
  'rocket',
  'users',
  'database',
  'cloud',
  'brain',
  'chart',
  'lock',
  'workflow',
  'award',
] as const

export const campoDeIcone: Field = {
  name: 'icon',
  type: 'select',
  required: true,
  defaultValue: 'sparkles',
  options: ICONES.map((v) => ({ value: v, label: v })),
  label: { pt: 'Ícone', en: 'Icon' },
}
