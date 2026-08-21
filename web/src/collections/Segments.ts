import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { BLOCOS } from '@/blocks'
import { campoDeIcone } from '@/blocks/shared'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Verticais de mercado (MIG-090).
 *
 * Entra por D-17: existem **só no WordPress**, em 8 páginas, e não têm
 * equivalente no protótipo. É a mesma forma de `solutions` — a diferença é
 * semântica, e é ela que justifica duas collections em vez de um campo:
 * solução é **o que** a ATRA faz, segmento é **para quem**. A mesma oferta
 * aparece em vários segmentos, e o mesmo segmento compra várias ofertas.
 *
 * ⚠️ `relatedCases` e `clients` fazem a página se montar sozinha à medida que
 * case e cliente são cadastrados — o case do Banco ABC aparece em "Bancos"
 * porque está ligado a ele, não porque alguém repetiu o texto aqui.
 *
 * ⚠️ Sem `hasPage`, ao contrário de `solutions`. Lá o checkbox existe porque o
 * legado tem 5 ofertas que não são link; aqui as 8 páginas existem no ar hoje,
 * e uma vertical sem página seria a exceção, não a regra. Vertical que não
 * deve aparecer fica em rascunho. */
export const Segments: CollectionConfig = {
  slug: 'segments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', '_status'],
    listSearchableFields: ['name', 'shortDescription'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Verticais de mercado atendidas. Aparecem no índice /segmentos.',
      en: 'Market verticals served. Shown on the /segmentos index.',
    },
  },
  labels: {
    singular: { pt: 'Segmento', en: 'Segment' },
    plural: { pt: 'Segmentos', en: 'Segments' },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: { pt: 'Nome', en: 'Name' } },
    slugField('name'),
    { ...campoDeIcone },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Descrição curta', en: 'Short description' },
      admin: {
        description: {
          pt: 'Uma frase. Usada no card do índice /segmentos.',
          en: 'One sentence. Used on the /segmentos index card.',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: BLOCOS,
      label: { pt: 'Seções da página', en: 'Page sections' },
    },
    {
      type: 'collapsible',
      label: { pt: 'Ligações', en: 'Connections' },
      admin: {
        description: {
          pt: 'O que a página mostra sozinha. Nada aqui é obrigatório.',
          en: 'What the page assembles on its own. None of this is required.',
        },
      },
      fields: [
        {
          name: 'relatedSolutions',
          type: 'relationship',
          relationTo: 'solutions',
          hasMany: true,
          label: { pt: 'Soluções para esta vertical', en: 'Solutions for this vertical' },
        },
        {
          name: 'relatedCases',
          type: 'relationship',
          relationTo: 'cases',
          hasMany: true,
          label: { pt: 'Cases desta vertical', en: 'Cases in this vertical' },
        },
        {
          name: 'clients',
          type: 'relationship',
          relationTo: 'clients',
          hasMany: true,
          label: { pt: 'Clientes desta vertical', en: 'Clients in this vertical' },
        },
      ],
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
