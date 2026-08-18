import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { pt } from '@payloadcms/translations/languages/pt'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Cases } from './collections/Cases'
import { Media } from './collections/Media'
import { Partners } from './collections/Partners'
import { Testimonials } from './collections/Testimonials'
import { Topics } from './collections/Topics'
import { Users } from './collections/Users'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },

  collections: [Users, Media, Topics, Testimonials, Partners, Cases],

  /* Idioma da INTERFACE do admin (botões, menus, validação) — diferente de
   * `localization`, que é o idioma do CONTEÚDO. São independentes: dá para
   * editar conteúdo em inglês com a interface em português, que é o caso de
   * uso real do time da ATRA. Ver D-20. */
  i18n: {
    supportedLanguages: { pt, en },
    fallbackLanguage: 'pt',
  },

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

  plugins: [
    // MinIO no desenvolvimento, R2 em produção — mesma API S3.
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        // MinIO não suporta bucket como subdomínio; sem isto o upload
        // tenta http://atra-media.localhost:9000 e falha na resolução.
        forcePathStyle: true,
      },
    }),
  ],

  // Gera os tamanhos no upload, não a cada requisição — ver
  // docs/04-infra/docker.md sobre o custo de CPU da otimização de imagem.
  sharp,

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
