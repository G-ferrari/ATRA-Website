import { withPayload } from '@payloadcms/next/withPayload'
import { cpus } from 'node:os'
import path from 'node:path'
import type { NextConfig } from 'next'

import { lerRedirects, redirectsDoNext } from './src/lib/redirects'

/* ⚠️ Concorrência e tempo de build viraram assunto na Fase 4b.
 *
 * Até a importação do WordPress o build gerava ~77 páginas estáticas. Com os 207
 * artigos em dois idiomas são **491**, e o padrão do Next — `cpus - 1` workers,
 * 60s por página — passou a estourar: nove processos Node, cada um com uma
 * instância do Payload, disputando a mesma máquina que roda o Postgres, o MinIO
 * e os dois containers de app. As páginas não estavam quebradas; estavam na
 * fila. O build morria em "took more than 60 seconds".
 *
 * Metade dos núcleos deixa a máquina utilizável enquanto o build roda — a mesma
 * conta que `scripts/gate.mjs` faz para o container do Playwright. */
const WORKERS = Math.max(2, Math.floor(cpus().length / 2))

/* MIG-108 — os 261 redirects do WordPress, lidos do CSV versionado.
 *
 * ⚠️ Lido em **tempo de build**, e é o certo: são 258 linhas estáticas que não
 * mudam entre requisições, e resolvê-las no `proxy.ts` custaria uma busca por
 * requisição do site inteiro. Publicar um post novo não mexe nisto — os
 * permalinks antigos do WordPress são um conjunto fechado.
 *
 * ⚠️ O arquivo mora em `docs/`, fora de `web/`, porque é **especificação**: a
 * curadoria das ~30 URLs institucionais é decisão de negócio, não de código, e
 * quem revisa não abre o repositório do app. */
const CSV_DE_REDIRECTS = path.resolve(process.cwd(), '../docs/02-especificacao/dados/redirects.csv')

const nextConfig: NextConfig = {
  // Turbopack é o padrão no Next 16 — não precisa de flag.

  /* 60s é o padrão e era folgado para 77 páginas. Com 491 e menos workers, a
   * página que espera a vez precisa de margem — o custo real de uma delas, já
   * medido, é de dezenas de milissegundos. */
  staticPageGenerationTimeout: 180,

  experimental: { cpus: WORKERS },

  async redirects() {
    return redirectsDoNext(lerRedirects(CSV_DE_REDIRECTS))
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
