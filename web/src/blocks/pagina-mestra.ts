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
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
    {
      name: 'chip',
      type: 'text',
      localized: true,
      label: { pt: 'Etiqueta', en: 'Chip' },
      admin: {
        description: {
          pt: 'A etiqueta ao lado do selo. Em Soluções e Segmentos ela vem depois da contagem automática ("8 verticais").',
          en: 'The chip next to the badge. In Solutions and Segments it follows the automatic count ("8 verticals").',
        },
      },
    },
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

/* A chamada para os webinars que fecha o Blog (`Blog.tsx:283` no legado): texto
 * do admin, capa automática — a do webinar mais recente — e o botão leva a
 * /webinars. Bloco próprio para a editora poder tirar, mover ou reescrever. */
export const WebinarTeaser: Block = {
  slug: 'webinarTeaser',
  labels: {
    singular: { pt: 'Chamada para os webinars', en: 'Webinars teaser' },
    plural: { pt: 'Chamadas para os webinars', en: 'Webinars teasers' },
  },
  admin: { group: { pt: 'Página-mestra', en: 'Section page' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'highlight', type: 'text', localized: true, label: { pt: 'Trecho em destaque', en: 'Highlight' } },
    {
      name: 'titleEnd',
      type: 'text',
      localized: true,
      label: { pt: 'Fim do título', en: 'Title end' },
      admin: { description: { pt: 'Depois do trecho em destaque, na cor normal.', en: 'After the highlight, in the regular colour.' } },
    },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Texto', en: 'Text' } },
    { name: 'actionLabel', type: 'text', localized: true, label: { pt: 'Texto do botão', en: 'Button label' } },
    ...camposComuns,
  ],
}

export const BLOCOS_DE_PAGINA_MESTRA: Block[] = [SectionListing, SectionFeatured, WebinarTeaser].map((b) => ({
  ...b,
  admin: {
    ...b.admin,
    images: { thumbnail: { url: `/miniaturas-de-blocos/${b.slug}.webp`, alt: `Como fica a seção "${(b.labels!.singular as { pt: string }).pt}" no site` } },
  },
}))
