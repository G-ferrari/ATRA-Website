import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, idempotente: a coluna do aviso de
 * privacidade do banco de talentos no global `contact` (D-67, 22/10), criada
 * **antes** de `20260929_223000_sem_endereco_fixo`.
 *
 * Aquela migração lê e grava o global pela Local API, com o config de hoje — que
 * faz o SELECT com todas as colunas que ele conhece. Em banco novo ela rodaria
 * antes de `20261022_181457_trabalhe_conosco_fora_do_rd` e morreria em
 * "column … job_applications_talent_pool_notice does not exist" (a armadilha do
 * CLAUDE.md; a mesma da foto do painel em
 * `20260929_222900_foto_do_painel_de_contatos_antecipada`). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "job_applications_talent_pool_notice" varchar;`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[aviso-do-banco-de-talentos-antecipada] a coluna é desfeita pela migração da D-67')
}
