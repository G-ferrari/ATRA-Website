import type { Field } from 'payload'

import { OPCOES_DE_ICONE } from './icones'

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
    /* Rótulo no menu da página, quando ele difere do título da seção.
     *
     * O legado cura essa lista (`About.tsx:127`): a seção "História da ATRA"
     * aparece no menu como "Quem somos", e "Transformando Desafios em
     * Resultados" como "Nossas Soluções". A âncora continua derivada — só o
     * texto é escolhido, e vazio cai no título. */
    name: 'navLabel',
    type: 'text',
    localized: true,
    label: { pt: 'Rótulo no menu da página', en: 'Page nav label' },
    admin: {
      position: 'sidebar',
      condition: (_, irmaos) => Boolean(irmaos?.anchor),
      description: { pt: 'Vazio, usa o título da seção.', en: 'Empty falls back to the section title.' },
    },
  },
  {
    /* O legado alterna borda junto com o fundo, e não de um jeito só:
     * `nossos-valores` tem `border-y`, `nossas-solucoes` e o CTA final têm
     * `border-t`, `porque-escolher` não tem nenhuma. Reproduzir exige o campo.
     * Candidato a unificação depois do aceite visual. */
    name: 'borda',
    type: 'select',
    defaultValue: 'nenhuma',
    options: [
      { value: 'nenhuma', label: { pt: 'Sem borda', en: 'No border' } },
      { value: 'topo', label: { pt: 'Linha no topo', en: 'Top line' } },
      { value: 'ambas', label: { pt: 'Linha em cima e embaixo', en: 'Top and bottom lines' } },
    ],
    label: { pt: 'Borda', en: 'Border' },
    admin: { position: 'sidebar' },
  },
  {
    /* ⚠️ O respiro vertical **não** é constante entre páginas. /sobre usa
     * `py-16 md:py-20` nas oito seções; /carreiras usa `py-20 md:py-24` em seis
     * das sete, e `py-16 md:py-20` só em `premiacoes` (`Careers.tsx:306`).
     * São 32px a mais por seção no md — com seis seções, 384px de diferença,
     * muito além do limite de 0,1% do aceite visual. Daí o campo, com o valor
     * de /sobre como padrão para não mexer nos gabaritos já gravados. */
    name: 'spacing',
    type: 'select',
    defaultValue: 'normal',
    options: [
      { value: 'normal', label: { pt: 'Normal', en: 'Normal' } },
      { value: 'roomy', label: { pt: 'Amplo', en: 'Roomy' } },
    ],
    label: { pt: 'Respiro vertical', en: 'Vertical spacing' },
    admin: { position: 'sidebar' },
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

/* A lista de ícones mora em `./icones` (sem import nenhum, para o seletor do
 * admin, que é componente de cliente, poder ler). Reexportada aqui porque é
 * daqui que os blocos e as collections sempre a importaram. */
export { ICONES, OPCOES_DE_ICONE } from './icones'

/* O seletor visual: desenho de cada ícone, nome em português e busca, no lugar
 * da lista de nomes em inglês. Caminho relativo a `src/` (o `importMap.baseDir`
 * de `payload.config.ts`); mudar o arquivo de lugar pede
 * `pnpm payload generate:importmap`. */
export const SELETOR_DE_ICONE = '/components/admin/campo-de-icone#CampoDeIcone'

export const campoDeIcone: Field = {
  name: 'icon',
  type: 'select',
  required: true,
  defaultValue: 'sparkles',
  options: OPCOES_DE_ICONE,
  label: { pt: 'Ícone', en: 'Icon' },
  admin: { components: { Field: SELETOR_DE_ICONE } },
}
