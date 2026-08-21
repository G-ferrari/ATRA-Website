import { withPayload } from '@payloadcms/next/withPayload'
import { cpus } from 'node:os'
import type { NextConfig } from 'next'

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

const nextConfig: NextConfig = {
  // Turbopack é o padrão no Next 16 — não precisa de flag.

  /* 60s é o padrão e era folgado para 77 páginas. Com 491 e menos workers, a
   * página que espera a vez precisa de margem — o custo real de uma delas, já
   * medido, é de dezenas de milissegundos. */
  staticPageGenerationTimeout: 180,

  experimental: { cpus: WORKERS },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
