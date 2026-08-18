import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/* Cases de sucesso — a fatia vertical que define o padrão das outras 19 rotas.
 *
 * `drafts: true` por D-08: nada vai ao ar sem corpo. Página magra prejudica o
 * domínio inteiro, então rascunho não aparece em consulta pública. */
export const Cases: CollectionConfig = {
  slug: 'cases',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'publishedAt', '_status'],
    listSearchableFields: ['title', 'client', 'summary'],
    group: 'Conteúdo',
    description: {
      pt: 'Cases de sucesso. Rascunho não aparece no site — publique só com o conteúdo completo.',
      en: 'Success stories. Drafts are not visible on the site — publish only when complete.',
    },
  },
  labels: {
    singular: { pt: 'Case', en: 'Case' },
    plural: { pt: 'Cases', en: 'Cases' },
  },
  access: {
    // Rascunho fica fora da leitura pública; o site só enxerga publicado.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-publishedAt',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { pt: 'Conteúdo', en: 'Content' },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: { pt: 'Título', en: 'Title' },
            },
            {
              name: 'client',
              type: 'text',
              required: true,
              /* Não localizado: nome próprio não se traduz — mesmo critério de
               * `testimonials.company` e `partners.name`. */
              label: { pt: 'Cliente', en: 'Client' },
              admin: { description: { pt: 'Ex.: Banco ABC.', en: 'E.g. Banco ABC.' } },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              localized: true,
              maxLength: 220,
              label: { pt: 'Resumo', en: 'Summary' },
              admin: {
                description: {
                  pt: 'Até 220 caracteres. Aparece no card da listagem e como descrição para buscadores.',
                  en: 'Up to 220 characters. Used on the listing card and as the search description.',
                },
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: { pt: 'Imagem de capa', en: 'Cover image' },
            },
            {
              name: 'impact',
              type: 'text',
              localized: true,
              label: { pt: 'Métrica de destaque', en: 'Headline metric' },
              admin: {
                description: {
                  pt: 'Ex.: "51x mais rápido". Aparece sobre a imagem no card.',
                  en: 'E.g. "51x faster". Shown over the card image.',
                },
              },
            },
            {
              name: 'challenges',
              type: 'array',
              /* O ARRAY é localizado, não o campo interno. Com `text` localizado
               * dentro de um array compartilhado, o idioma ainda sem tradução
               * herda as linhas vazias e o documento fica inválido — cada locale
               * precisa da sua própria lista. Descoberto ao rodar o seed. */
              localized: true,
              label: { pt: 'Desafios', en: 'Challenges' },
              labels: {
                singular: { pt: 'Desafio', en: 'Challenge' },
                plural: { pt: 'Desafios', en: 'Challenges' },
              },
              fields: [
                { name: 'text', type: 'textarea', required: true, label: { pt: 'Desafio', en: 'Challenge' } },
              ],
            },
            {
              name: 'solution',
              type: 'richText',
              localized: true,
              label: { pt: 'Solução', en: 'Solution' },
            },
            {
              name: 'results',
              type: 'array',
              /* O ARRAY é localizado, não o campo interno. Com `text` localizado
               * dentro de um array compartilhado, o idioma ainda sem tradução
               * herda as linhas vazias e o documento fica inválido — cada locale
               * precisa da sua própria lista. Descoberto ao rodar o seed. */
              localized: true,
              label: { pt: 'Resultados', en: 'Results' },
              labels: {
                singular: { pt: 'Resultado', en: 'Result' },
                plural: { pt: 'Resultados', en: 'Results' },
              },
              fields: [
                { name: 'text', type: 'textarea', required: true, label: { pt: 'Resultado', en: 'Result' } },
              ],
            },
            {
              name: 'aboutClient',
              type: 'textarea',
              localized: true,
              label: { pt: 'Sobre o cliente', en: 'About the client' },
            },
          ],
        },
        {
          label: { pt: 'Relações', en: 'Relations' },
          fields: [
            {
              name: 'topics',
              type: 'relationship',
              relationTo: 'topics',
              hasMany: true,
              required: true,
              minRows: 1,
              label: { pt: 'Assuntos', en: 'Topics' },
              admin: {
                description: {
                  pt: 'Usados no filtro da listagem. Pelo menos um.',
                  en: 'Used by the listing filter. At least one.',
                },
              },
            },
            {
              name: 'technologies',
              type: 'array',
              label: { pt: 'Tecnologias', en: 'Technologies' },
              admin: {
                description: {
                  pt: 'Não são traduzidas: nome de produto.',
                  en: 'Not translated: product names.',
                },
              },
              fields: [{ name: 'name', type: 'text', required: true, label: { pt: 'Nome', en: 'Name' } }],
            },
            {
              name: 'partners',
              type: 'relationship',
              relationTo: 'partners',
              hasMany: true,
              label: { pt: 'Parceiros envolvidos', en: 'Partners involved' },
            },
            {
              name: 'testimonial',
              type: 'relationship',
              relationTo: 'testimonials',
              label: { pt: 'Depoimento', en: 'Testimonial' },
              admin: {
                description: {
                  pt: 'O mesmo depoimento pode aparecer aqui e na home.',
                  en: 'The same testimonial can appear here and on the home page.',
                },
              },
            },
            {
              name: 'clientLogo',
              type: 'upload',
              relationTo: 'media',
              label: { pt: 'Logo do cliente', en: 'Client logo' },
            },
          ],
        },
        { label: { pt: 'SEO', en: 'SEO' }, fields: [seoField] },
      ],
    },
    slugField('title'),
    {
      name: 'featured',
      type: 'checkbox',
      label: { pt: 'Destacar', en: 'Featured' },
      admin: {
        position: 'sidebar',
        description: {
          pt: 'Entra no carrossel da home e no hub de insights.',
          en: 'Appears in the home carousel and the insights hub.',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: { pt: 'Data de publicação', en: 'Published at' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
  ],
}
