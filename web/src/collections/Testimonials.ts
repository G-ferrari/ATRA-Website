import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    /* `company` sozinho não identifica: o seed tem dois depoimentos do mesmo
     * autor na mesma empresa, e a lista mostrava "Banco ABC" duas vezes — bem
     * na tela em que o editor escolhe qual anexar a um case. `label` é montado
     * na gravação e junta autor, empresa e um trecho da citação. */
    useAsTitle: 'label',
    defaultColumns: ['label', 'company', 'authorRole', 'featured'],
    listSearchableFields: ['quote', 'company', 'authorName', 'authorRole'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Depoimentos de clientes. Aparecem na home e dentro dos cases.',
      en: 'Client testimonials. Shown on the home page and inside cases.',
    },
  },
  labels: {
    singular: { pt: 'Depoimento', en: 'Testimonial' },
    plural: { pt: 'Depoimentos', en: 'Testimonials' },
  },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  fields: [
    {
      /* Só para leitura humana na lista e no seletor de relacionamento.
       * Recalculado a cada gravação, então nunca fica velho. */
      name: 'label',
      type: 'text',
      localized: true,
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const d = siblingData as {
              quote?: string | null
              company?: string | null
              authorName?: string | null
            }
            const quem = [d.authorName, d.company].filter(Boolean).join(' — ')
            const trecho = (d.quote ?? '').trim().replace(/\s+/g, ' ').slice(0, 60)
            return [quem, trecho && `“${trecho}…”`].filter(Boolean).join(' · ') || undefined
          },
        ],
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Depoimento', en: 'Quote' },
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: { pt: 'Empresa', en: 'Company' },
      admin: { description: { pt: 'Não é traduzido: nome próprio.', en: 'Not translated: proper noun.' } },
    },
    {
      name: 'authorName',
      type: 'text',
      label: { pt: 'Nome de quem falou', en: 'Author name' },
      admin: {
        description: {
          pt: 'Opcional. Sem nome, o site mostra só o cargo e a empresa.',
          en: 'Optional. Without a name, the site shows role and company only.',
        },
      },
    },
    {
      name: 'authorRole',
      type: 'text',
      required: true,
      localized: true,
      label: { pt: 'Cargo', en: 'Role' },
    },
    {
      /* D-14: opcional de propósito. Os 4 depoimentos do protótipo usavam foto
       * de banco de imagem para representar pessoas reais de ABC Brasil e Banco
       * Carrefour. Sem foto, o site mostra monograma com as iniciais. */
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Foto', en: 'Photo' },
      admin: {
        description: {
          pt: 'Opcional. Use só foto real e autorizada — sem foto, o site mostra as iniciais.',
          en: 'Optional. Only use a real, authorised photo — without one the site shows initials.',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { pt: 'Destacar na home', en: 'Feature on the home page' },
    },
  ],
}
