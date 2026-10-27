import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, como a
 * `20260927_215400_partner_showcase_source`: a data é 27/09, mas ela nasceu em
 * 27/10, com a trava "Inglês revisado à mão" (D-74,
 * `20261027_174059_traducao_automatica_do_ingles`).
 *
 * Em banco novo (o do CI), as migrações de dados de 27/09 em diante rodam com
 * o config **de hoje**: toda consulta a estas collections monta um SELECT com
 * `english_locked`, e sem a coluna o migrate morreria em "column ... does not
 * exist". Por isso ela nasce aqui, antes da primeira migração de dados que lê
 * as collections inteiras. Idempotente: em banco que já tem a coluna, nada
 * acontece.
 *
 * ⚠️ `press` e `forms` não entram: as tabelas delas nascem depois desta data,
 * e é por isso que as duas ficam fora da tradução automática
 * (`lib/traducao-automatica.ts`). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE IF EXISTS "topics" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "testimonials" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "cases" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_cases_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "jobs" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_jobs_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "pages" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_pages_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "posts" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_posts_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "resources" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_resources_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "webinars" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_webinars_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "partners" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "segments" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_segments_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "solutions" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_solutions_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "specialist_roles" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;`)
}

/* A volta é a da migração de 27/10, que apaga as colunas. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[trava-do-ingles] as colunas são desfeitas por 20261027_174059_traducao_automatica_do_ingles')
}
