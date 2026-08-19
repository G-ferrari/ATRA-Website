import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { BLOCOS } from '@/blocks'
import { campoDeIcone } from '@/blocks/shared'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Ofertas da ATRA (MIG-055).
 *
 * No legado é a literal `solutionsData` (`App.tsx:45-97`), lida em quatro
 * lugares — mega-menu desktop, submenu, gaveta mobile e rodapé. Collection e
 * não bloco de página porque D-09 dá URL própria a cada solução, e porque o
 * mega-menu precisa consultá-las: mantida como bloco, cada categoria do menu
 * dependeria de qual página estivesse sendo montada.
 *
 * As 6 de hoje viram 13 em MIG-093, com conteúdo vindo do WordPress. */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'hasPage', 'order'],
    listSearchableFields: ['title', 'shortDescription'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Ofertas da ATRA. Aparecem no menu de Soluções e no índice /solucoes.',
      en: 'ATRA offerings. Shown in the Solutions menu and on the /solucoes index.',
    },
  },
  labels: {
    singular: { pt: 'Solução', en: 'Solution' },
    plural: { pt: 'Soluções', en: 'Solutions' },
  },
  access: {
    // Rascunho fica fora da leitura pública; o site só enxerga publicado.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    slugField(),
    {
      /* As 3 categorias do mega-menu (`App.tsx:45`). `select` e não relacionamento
       * a `topics`: aquela taxonomia classifica conteúdo editorial (case, post,
       * glossário) e é curada pelo marketing. Estas três são a espinha do menu —
       * criar uma quarta muda a navegação do site, não a etiqueta de um artigo. */
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { value: 'innovation-ai', label: { pt: 'Inovação & IA', en: 'Innovation & AI' } },
        { value: 'data-bi', label: { pt: 'Dados, BI & Advanced Analytics', en: 'Data, BI & Advanced Analytics' } },
        { value: 'governance-culture', label: { pt: 'Governança & Cultura', en: 'Governance & Culture' } },
      ],
      label: { pt: 'Categoria', en: 'Category' },
    },
    {
      /* ⚠️ modelo-de-conteudo.md previa `text` com o nome do ícone Fluent
       * (`fluent:brain-circuit-24-regular`), como no legado. Fica no `select`
       * fechado de `campoDeIcone` pelo motivo que já vale para todo bloco: o
       * valor vira componente React, e nome livre inválido só apareceria como
       * buraco na página em produção. O legado usa Iconify, o app novo usa
       * Lucide — a troca de biblioteca já estava feita, e manter o nome Fluent
       * aqui guardaria um identificador que nada resolve. */
      ...campoDeIcone,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Descrição curta', en: 'Short description' },
      admin: {
        description: {
          pt: 'Uma frase. Usada no menu de Soluções e no card do índice.',
          en: 'One sentence. Used in the Solutions menu and on the index card.',
        },
      },
    },
    {
      /* 5 das 6 soluções do legado têm `link: "#"` — só IA tem página. O
       * checkbox preserva esse estado em vez de fingir que as outras existem:
       * sem ele, o índice ofereceria 5 links para 404. MIG-056 traz o template
       * da página e liga a de IA; MIG-093 escreve as demais. */
      name: 'hasPage',
      type: 'checkbox',
      label: { pt: 'Tem página própria', en: 'Has its own page' },
      admin: {
        description: {
          pt: 'Sem isto, a solução aparece no menu e no índice, mas não vira link.',
          en: 'Without this, the solution appears in the menu and index but is not a link.',
        },
      },
    },
    {
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
      admin: {
        position: 'sidebar',
        description: { pt: 'Ordem dentro da categoria.', en: 'Order within the category.' },
      },
    },
    seoField,
  ],
}
