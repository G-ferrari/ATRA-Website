import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* A página do resultado de cada lead (28/10): idioma e token no envio, e a
 * chave do e-mail do site no global. `IF NOT EXISTS` porque em banco novo as
 * colunas já nasceram em `20260926_193700_resultado_do_diagnostico_antecipado`.
 *
 * ⚠️ `send_result_email` nasce **falso** também nos bancos que já existem: a
 * produção para de mandar o e-mail do site, e o resultado passa a sair só pela
 * automação do RD. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "diagnostic_locale" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "diagnostic_result_token" varchar;
  ALTER TABLE "data_maturity_diagnostic" ADD COLUMN IF NOT EXISTS "send_result_email" boolean DEFAULT false;
  CREATE INDEX IF NOT EXISTS "form_submissions_diagnostic_diagnostic_result_token_idx" ON "form_submissions" USING btree ("diagnostic_result_token");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "form_submissions_diagnostic_diagnostic_result_token_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_locale";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_result_token";
  ALTER TABLE "data_maturity_diagnostic" DROP COLUMN "send_result_email";`)
}
