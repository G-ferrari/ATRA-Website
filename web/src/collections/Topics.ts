import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { slugField } from '@/fields/slug'

/* Taxonomia única de assunto. Existe como collection, e não como array de
 * texto, porque tag livre já produziu "IA" vs "Inteligência Artificial" e
 * "Governança" vs "Governança & LGPD" no legado — ver inventario-conteudo.md. */
export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'showInFilter', 'filterOrder'],
    listSearchableFields: ['name', 'slug'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Assuntos usados para filtrar cases, artigos e materiais. Vocabulário controlado: prefira reaproveitar a criar.',
      en: 'Topics used to filter cases, posts and resources. Controlled vocabulary: prefer reusing over creating.',
    },
  },
  labels: {
    singular: { pt: 'Assunto', en: 'Topic' },
    plural: { pt: 'Assuntos', en: 'Topics' },
  },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Nome', en: 'Name' },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { pt: 'Descrição', en: 'Description' },
    },
    /* O legado tinha a barra de filtro escrita no código — 6 categorias fixas
     * em SuccessStories.tsx:20, e nem todas as tags apareciam lá. Mostrar todo
     * assunto em uso encheria a barra; deixar fixo no código repetiria o
     * problema que a migração existe para resolver. Daí o par de campos. */
    {
      name: 'showInFilter',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: { pt: 'Exibir no filtro das listagens', en: 'Show in listing filters' },
      admin: {
        description: {
          pt: 'Marque para o assunto virar um botão de categoria nas listagens.',
          en: 'Check to show this topic as a category button on listings.',
        },
      },
    },
    {
      name: 'filterOrder',
      type: 'number',
      defaultValue: 0,
      label: { pt: 'Ordem no filtro', en: 'Filter order' },
      admin: {
        condition: (_, irmaos) => Boolean(irmaos?.showInFilter),
        description: { pt: 'Menor aparece primeiro.', en: 'Lower comes first.' },
      },
    },
  ],
}
