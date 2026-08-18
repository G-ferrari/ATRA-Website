import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Sistema',
    description: {
      pt: 'Quem tem acesso ao painel. Só administradores gerenciam usuários.',
      en: 'Who can access the panel. Only admins manage users.',
    },
  },
  labels: {
    singular: { pt: 'Usuário', en: 'User' },
    plural: { pt: 'Usuários', en: 'Users' },
  },
  access: {
    // Gestão de usuários é exclusiva de admin.
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
    // Leitura autenticada: o Payload precisa disso para a sessão do próprio
    // usuário funcionar no admin.
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { pt: 'Nome', en: 'Name' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: { pt: 'Papel', en: 'Role' },
      options: [
        { label: { pt: 'Editor', en: 'Editor' }, value: 'editor' },
        { label: { pt: 'Administrador', en: 'Admin' }, value: 'admin' },
      ],
      admin: {
        description: {
          pt: 'Editor publica conteúdo. Administrador também altera navegação, rodapé, a IA e usuários.',
          en: 'Editors publish content. Admins also change navigation, footer, the AI and users.',
        },
      },
      // Sem isto, um editor vira admin editando o próprio perfil.
      access: { update: isAdminFieldLevel },
    },
  ],
}
