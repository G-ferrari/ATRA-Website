import { existsSync } from 'node:fs'
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
/* ⚠️ Dois caminhos, porque o app roda em dois lugares. Nativo (`pnpm dev`) o
 * repositório inteiro está no disco e `docs/` é irmã de `web/`; no contêiner só
 * `web/` está montado em `/app`, e `docs/` entra em `/docs`. */
const CSV_DE_REDIRECTS = [path.resolve(process.cwd(), '../docs'), '/docs']
  .map((raiz) => path.join(raiz, '02-especificacao/dados/redirects.csv'))
  .find(existsSync) ?? path.resolve(process.cwd(), '../docs/02-especificacao/dados/redirects.csv')

const nextConfig: NextConfig = {
  // Turbopack é o padrão no Next 16 — não precisa de flag.

  /* Imagem de produção enxuta: o Next copia para `.next/standalone` só o que o
   * tracing provou ser necessário, com um `server.js` próprio — ~200 MB em vez
   * do `node_modules` inteiro perto de 1 GB.
   *
   * ⚠️ O `Dockerfile` da raiz depende desta linha. Sem ela `.next/standalone`
   * não é gerado, o `COPY` do estágio final não acha nada e a imagem sai sem o
   * `server.js` que o `CMD` executa. */
  output: 'standalone',

  /* MIG-120. A mídia do Payload saía com **ttl=0**: os mesmos logos e selos —
   * ~438 KB, presentes em toda página — eram re-baixados a cada visita, e o
   * Lighthouse cobrava exatamente isso (`cache-insight`). Um ano e `immutable`
   * porque o filename do Payload é efetivamente imutável: upload com nome
   * repetido ganha sufixo, nunca substitui o arquivo. Trocar a imagem no admin
   * gera URL nova, então cache longo não segura versão velha. */
  async headers() {
    return [
      {
        source: '/api/media/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  /* O mesmo problema na saída do `next/image`: o padrão são 60s de cache para
   * a variante otimizada. A origem é a mídia imutável de cima — a variante
   * pode viver o mesmo ano. */
  images: { minimumCacheTTL: 31536000 },

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
