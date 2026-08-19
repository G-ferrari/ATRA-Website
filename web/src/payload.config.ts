import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { pt } from '@payloadcms/translations/languages/pt'
import {
  EXPERIMENTAL_TableFeature,
  defaultEditorFeatures,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Cases } from './collections/Cases'
import { GlossaryTerms } from './collections/GlossaryTerms'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { Resources } from './collections/Resources'
import { Testimonials } from './collections/Testimonials'
import { Topics } from './collections/Topics'
import { Users } from './collections/Users'
import { Webinars } from './collections/Webinars'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },

    /* Live Preview (D-20): o editor vê a página se montando enquanto digita,
     * dentro do próprio admin.
     *
     * Os três tamanhos são os mesmos da regressão visual — se o gate compara
     * nesses breakpoints, é neles que o editor precisa conferir. */
    livePreview: {
      breakpoints: [
        // O rótulo é string simples (não aceita objeto por idioma). Os nomes
        // são os mesmos dos projetos do Playwright, de propósito: o editor e o
        // gate falam dos mesmos três tamanhos.
        { name: 'mobile', label: 'Mobile', width: 375, height: 812 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1280, height: 800 },
      ],
    },
  },

  collections: [Users, Media, Topics, Testimonials, Partners, Cases, GlossaryTerms, Pages, Posts, Resources, Webinars],

  /* Idioma da INTERFACE do admin (botões, menus, validação) — diferente de
   * `localization`, que é o idioma do CONTEÚDO. São independentes: dá para
   * editar conteúdo em inglês com a interface em português, que é o caso de
   * uso real do time da ATRA. Ver D-20. */
  i18n: {
    supportedLanguages: { pt, en },
    fallbackLanguage: 'pt',
  },

  /* Tabela precisa de feature explícita, e a ausência dela falha em silêncio.
   *
   * O piloto de conversão do WordPress (MIG-012) mediu: com o conjunto padrão,
   * uma tabela converte com **100% do texto e zero estrutura** — as linhas
   * viram parágrafos soltos e nenhuma métrica de retenção acusa. Com a feature
   * ligada, os mesmos posts convertem íntegros (table/tablerow/tablecell).
   *
   * Ligada aqui, e não só no script de importação, porque quem edita depois
   * precisa conseguir mexer na tabela que foi importada. */
  editor: lexicalEditor({
    features: [...defaultEditorFeatures, EXPERIMENTAL_TableFeature()],
  }),

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

    /* Migrações versionadas, não push automático.
     *
     * Com `push` ligado (o padrão em dev), toda mudança que o Drizzle considera
     * destrutiva — trocar um campo para localizado, por exemplo — para o servidor
     * num prompt "Accept warnings and push schema?" e TODA requisição pendura até
     * alguém responder. Aconteceu duas vezes ao modelar os cases.
     *
     * Fluxo: `pnpm migrate:create` gera o arquivo, `pnpm migrate` aplica.
     * É o que docs/04-infra/ambientes.md já prescrevia. */
    push: false,
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
