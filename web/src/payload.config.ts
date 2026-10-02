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
import { buildConfig, type CollectionConfig } from 'payload'

import { revalidarSite } from './hooks/revalidar'
import sharp from 'sharp'

import { Cases } from './collections/Cases'
import { Clients } from './collections/Clients'
import { GlossaryTerms } from './collections/GlossaryTerms'
import { Jobs } from './collections/Jobs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { PrivateFiles } from './collections/PrivateFiles'
import { Resources } from './collections/Resources'
import { AiUsage } from './collections/AiUsage'
import { FormSubmissions } from './collections/FormSubmissions'
import { Segments } from './collections/Segments'
import { Solutions } from './collections/Solutions'
import { SpecialistRoles } from './collections/SpecialistRoles'
import { Testimonials } from './collections/Testimonials'
import { Topics } from './collections/Topics'
import { Users } from './collections/Users'
import { Press } from './collections/Press'
import { Webinars } from './collections/Webinars'
import { AtraAi } from './globals/AtraAi'
import { Contact } from './globals/Contact'
import { ConversionPanel } from './globals/ConversionPanel'
import { CookieConsent } from './globals/CookieConsent'
import { DiagnosticoDeMaturidade } from './globals/DiagnosticoDeMaturidade'
import { Footer } from './globals/Footer'
import { Integrations } from './globals/Integrations'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { Tracking } from './globals/Tracking'

const dirname = path.dirname(fileURLToPath(import.meta.url))

function comRevalidacao(collections: CollectionConfig[], fora: string[]): CollectionConfig[] {
  return collections.map((c) =>
    fora.includes(c.slug)
      ? c
      : {
          ...c,
          hooks: {
            ...c.hooks,
            afterChange: [...(c.hooks?.afterChange ?? []), () => revalidarSite()],
            afterDelete: [...(c.hooks?.afterDelete ?? []), () => revalidarSite()],
          },
        },
  )
}

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

  /* MIG-143: toda mudança de conteúdo invalida as páginas pré-renderizadas —
   * ver `hooks/revalidar.ts`. Aplicado aqui, programaticamente, e não
   * collection a collection: são 16 arquivos que esqueceriam o hook um a um.
   *
   * ⚠️ As três exclusões não são otimização, são correção: `ai-usage` grava a
   * CADA requisição do chat e `form-submissions` a cada lead — com o hook, cada
   * visitante do chat esvaziaria o cache do site inteiro. `users` não desenha
   * página nenhuma. */
  collections: comRevalidacao(
    [
      Users, Media, Topics, Testimonials,
      Cases, GlossaryTerms, Jobs, Pages, Posts, Press, Resources, Webinars,
      Clients, Partners, Segments, Solutions, SpecialistRoles,
      AiUsage, FormSubmissions, PrivateFiles,
    ],
    ['users', 'ai-usage', 'form-submissions', 'private-files'],
  ),

  globals: [AtraAi, Contact, ConversionPanel, CookieConsent, DiagnosticoDeMaturidade, Footer, Integrations, Navigation, SiteSettings, Tracking].map((g) => ({
    ...g,
    hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), () => revalidarSite()] },
  })),

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
    /* Segundo bucket, mesma API: `private-files` NÃO pode morar no bucket da
     * media, que tem download anônimo — e política de anonimato é por bucket.
     * Currículo em bucket público estaria a uma URL adivinhada de distância. */
    s3Storage({
      collections: { 'private-files': true },
      bucket: process.env.S3_PRIVATE_BUCKET || 'atra-privado',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
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
