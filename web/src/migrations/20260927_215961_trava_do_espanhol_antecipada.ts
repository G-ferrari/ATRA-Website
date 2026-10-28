import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, gêmea da
 * `20260927_215960_trava_do_ingles_antecipada`: a data é 27/09, mas ela nasceu
 * em 28/10, com a trava "Espanhol revisado à mão" (D-77,
 * `20261028_144743_espanhol`). Em banco novo, as migrações de dados de 27/09 em
 * diante consultam estas collections com o config de hoje, e o SELECT já leva
 * `spanish_locked`. Idempotente. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE IF EXISTS "topics" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "testimonials" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "cases" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_cases_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "jobs" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_jobs_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "pages" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_pages_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "posts" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_posts_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "resources" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_resources_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "webinars" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_webinars_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "partners" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "segments" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_segments_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "solutions" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "_solutions_v" ADD COLUMN IF NOT EXISTS "version_spanish_locked" boolean DEFAULT false;
  ALTER TABLE IF EXISTS "specialist_roles" ADD COLUMN IF NOT EXISTS "spanish_locked" boolean DEFAULT false;`)
}

/* A volta é a da migração de 28/10, que apaga as colunas. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[trava-do-espanhol] as colunas são desfeitas por 20261028_144743_espanhol')
}
