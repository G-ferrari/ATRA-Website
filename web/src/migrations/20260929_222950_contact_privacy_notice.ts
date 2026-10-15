import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Antecipada, idempotente: a coluna do aviso de privacidade da candidatura
 * (15/10), criada antes de `20260929_223000_sem_endereco_fixo`.
 *
 * ⚠️ Aquela migração lê o global `contact` pela Local API com o config de hoje,
 * que põe `job_applications_privacy_notice` no SELECT. Em banco novo ela roda
 * antes de `20261015_113425`, e morreria em "column does not exist" (a
 * armadilha do CLAUDE.md). A de 15/10 repete com `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "job_applications_privacy_notice" varchar;`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Quem desfaz é a de 15/10. */
}
