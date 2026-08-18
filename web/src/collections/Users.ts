import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
  },
  labels: {
    singular: { pt: 'Usuário', en: 'User' },
    plural: { pt: 'Usuários', en: 'Users' },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { pt: 'Nome', en: 'Name' },
    },
  ],
}
