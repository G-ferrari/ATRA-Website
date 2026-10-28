import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, como a
 * `20260927_215960_trava_do_ingles_antecipada`: a data é 26/09, logo depois da
 * que cria o global do diagnóstico, mas ela nasceu em 28/10, com a página do
 * resultado (`20261028_195814_resultado_do_diagnostico`).
 *
 * Em banco novo (o do CI), as migrações de dados de 26/09 em diante rodam com
 * o config **de hoje**: a de 07/10 (`regulacoes_do_diagnostico`) lê o global
 * inteiro, e o SELECT já pede `send_result_email` — sem a coluna, o migrate
 * morre em "column ... does not exist". As duas de `form_submissions` vêm
 * junto pelo mesmo motivo. Idempotente: em banco que já tem as colunas, nada
 * acontece. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE IF EXISTS "data_maturity_diagnostic" ADD COLUMN IF NOT EXISTS "send_result_email" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "form_submissions" ADD COLUMN IF NOT EXISTS "diagnostic_locale" varchar;
  ALTER TABLE IF EXISTS "form_submissions" ADD COLUMN IF NOT EXISTS "diagnostic_result_token" varchar;`)
}

/* A volta é a da migração de 28/10, que apaga as colunas. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[resultado-do-diagnostico] as colunas são desfeitas por 20261028_195814_resultado_do_diagnostico')
}
