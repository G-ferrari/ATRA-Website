import type { Block } from 'payload'

import { camposComuns } from './shared'

/* Os dois blocos das páginas-mestras (feature paginas-mestras, D-55).
 *
 * São a parte **automática** de cada seção — a lista e o carrossel de destaques
 * —, postas dentro do layout da página para a editora decidir a ordem e o que
 * vai em volta. Nenhum deles escolhe a seção: ela vem da página-mestra em que o
 * bloco está. Em página comum, os dois não desenham nada.
 *
 * Só entram na collection `pages` (`Pages.ts`), e não no catálogo `BLOCOS`, que
 * soluções, segmentos e parceiros também usam: lá eles não teriam o que listar,
 * e cada coleção a mais seria mais uma tabela que toda consulta lê. */

export const SectionListing: Block = {
  slug: 'sectionListing',
  labels: { singular: { pt: 'Lista da seção', en: 'Section listing' }, plural: { pt: 'Listas da seção', en: 'Section listings' } },
  admin: {
    group: { pt: 'Página-mestra', en: 'Section page' },
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { pt: 'Título', en: 'Title' },
      admin: {
        description: {
          pt: 'Opcional, acima da lista. A lista em si é automática: mostra o que está publicado na seção, com os filtros e a busca dela.',
          en: 'Optional, above the listing. The listing itself is automatic: it shows what is published in the section.',
        },
      },
    },
    {
      name: 'highlight',
      type: 'text',
      localized: true,
      label: { pt: 'Trecho em destaque', en: 'Highlight' },
      admin: {
        description: {
          pt: 'Aparece em azul, logo depois do título.',
          en: 'Shown in blue, right after the title.',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { pt: 'Texto de abertura', en: 'Intro text' },
      admin: {
        description: {
          pt: 'Opcional. Uma linha em branco separa os parágrafos.',
          en: 'Optional. A blank line separates paragraphs.',
        },
      },
    },
    ...camposComuns,
  ],
}

export const SectionFeatured: Block = {
  slug: 'sectionFeatured',
  labels: {
    singular: { pt: 'Destaques da seção', en: 'Section highlights' },
    plural: { pt: 'Destaques da seção', en: 'Section highlights' },
  },
  admin: {
    group: { pt: 'Página-mestra', en: 'Section page' },
  },
  fields: [
    {
      name: 'actionLabel',
      type: 'text',
      localized: true,
      label: { pt: 'Texto do botão', en: 'Button label' },
      admin: {
        description: {
          pt: 'O botão de cada destaque. Vazio, usa o texto padrão da seção ("Ler artigo", "Ver case"…).',
          en: 'Each highlight’s button. Empty uses the section default.',
        },
      },
    },
    ...camposComuns,
  ],
}

export const BLOCOS_DE_PAGINA_MESTRA: Block[] = [SectionListing, SectionFeatured].map((b) => ({
  ...b,
  admin: {
    ...b.admin,
    images: { thumbnail: { url: `/miniaturas-de-blocos/${b.slug}.webp`, alt: `Como fica a seção "${(b.labels!.singular as { pt: string }).pt}" no site` } },
  },
}))
