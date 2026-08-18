import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { slugField } from '@/fields/slug'

/* Glossário de dados e IA (MIG-040).
 *
 * Collection e não bloco de página: são 17 termos hoje e o glossário cresce
 * sozinho, item a item, sem passar por dev. `category` é texto livre no legado
 * — aqui vira relação com `topics`, que já é o vocabulário controlado do site
 * (mesma razão de D-23). */
export const GlossaryTerms: CollectionConfig = {
  slug: 'glossary-terms',
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'category', 'updatedAt'],
    listSearchableFields: ['term', 'definition'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Termos do glossário. Aparecem agrupados por letra em /glossario.',
      en: 'Glossary terms, grouped by letter on /glossary.',
    },
  },
  labels: {
    singular: { pt: 'Termo', en: 'Term' },
    plural: { pt: 'Glossário', en: 'Glossary' },
  },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  defaultSort: 'term',
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Termo', en: 'Term' },
    },
    slugField('term'),
    {
      name: 'definition',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Definição', en: 'Definition' },
      admin: {
        description: {
          pt: 'Uma explicação curta, para quem não é da área.',
          en: 'A short explanation, for a non-technical reader.',
        },
      },
    },
    {
      /* Texto e não relação com `topics`: as 8 categorias do glossário
       * ("Engenharia de Dados", "FinOps & Cloud") não são os assuntos que
       * filtram cases e blog, e misturar os dois vocabulários confundiria as
       * duas telas. Revisitar se surgir sobreposição real. */
      name: 'category',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      label: { pt: 'Categoria', en: 'Category' },
    },
  ],
}
