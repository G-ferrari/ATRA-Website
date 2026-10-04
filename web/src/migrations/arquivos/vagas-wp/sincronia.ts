import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { VagaExportada } from './tipos'

/* A sincronia das vagas com o WordPress (03/10) — as regras da migração
 * `20261003_120000_vagas_do_wordpress`, separadas dela para terem teste.
 *
 * Até a virada o WordPress é a fonte das vagas: é lá que o RH abre e fecha. A
 * carga de 25/08 trouxe 7, e em 03/10 o WordPress tinha 9 — 4 das 7 tinham
 * fechado e 6 eram novas. */

const PASTA = path.resolve(process.cwd(), 'src/migrations/arquivos/vagas-wp')

export const lerVagasExportadas = (): VagaExportada[] => JSON.parse(readFileSync(path.join(PASTA, 'vagas.json'), 'utf8'))

/** A prova de que este banco tem a carga de vagas do WordPress (25/08). Banco
 *  novo (CI, dev) tem as vagas de teste do seed, e lá a migração não age. */
export const PROVA_DA_CARGA = 'analista-de-sistemas-net-sr'

/** Até aqui a vaga é a da carga de 25/08, intocada. Alterada depois disso, foi
 *  editada no admin — e o que alguém escreveu lá não é sobrescrito. */
export const FIM_DA_CARGA = '2026-08-26T00:00:00.000Z'

/** As vagas da carga de 25/08 que **fecharam** no WordPress até 03/10. Lista
 *  fechada: vaga cadastrada no admin nunca entra aqui por engano. */
export const VAGAS_FECHADAS = [
  'analista-de-sistemas-net-sr',
  'analytics-engineer-sr-gcp-dbt-looker-plataform',
  'engenheiro-de-dados-sr-oracle-cloud-oci',
  'engenheiroa-de-dados-sr-azure-databricks',
] as const

/** A vaga não foi tocada no admin desde a carga — pode receber o texto novo. */
export const intocada = (updatedAt: string | null | undefined) => !!updatedAt && updatedAt < FIM_DA_CARGA
