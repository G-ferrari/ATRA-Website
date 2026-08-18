import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },

  collections: [Users],

  editor: lexicalEditor(),

  // D-07: português na raiz, inglês em /en, com slugs traduzidos.
  // Habilitado desde a fundação de propósito — adicionar localization depois
  // seria migração de banco em toda collection.
  localization: {
    locales: [
      { code: 'pt', label: 'Português' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'pt',
    fallback: true,
  },

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),

  // Gera os tamanhos no upload, não a cada requisição — ver
  // docs/04-infra/docker.md sobre o custo de CPU da otimização de imagem.
  sharp,

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
