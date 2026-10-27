import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* D-74: a trava "Inglês revisado à mão" nas collections que se traduzem
 * sozinhas, e o interruptor em Sistema → Integrações.
 *
 * ⚠️ As colunas das collections já nascem em banco novo pela antecipada
 * `20260927_215960_trava_do_ingles_antecipada` (ver o porquê lá); daqui o
 * `IF NOT EXISTS`, para as duas conviverem no mesmo deploy. A do `integrations`
 * nasce só aqui: nenhuma migração de dados lê esse global pela Local API, e o
 * gancho da tradução só o consulta com `GEMINI_API_KEY` no ambiente, que o CI
 * e o migrador de produção não têm. */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "cases" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_jobs_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_resources_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "webinars" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_webinars_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "segments" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_segments_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "solutions" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "_solutions_v" ADD COLUMN IF NOT EXISTS "version_english_locked" boolean DEFAULT false;
  ALTER TABLE "specialist_roles" ADD COLUMN IF NOT EXISTS "english_locked" boolean DEFAULT false;
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "english_translation_enabled" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "topics" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "cases" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_cases_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "jobs" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_jobs_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "resources" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_resources_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "webinars" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_webinars_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "partners" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "segments" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_segments_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "solutions" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "_solutions_v" DROP COLUMN IF EXISTS "version_english_locked";
  ALTER TABLE "specialist_roles" DROP COLUMN IF EXISTS "english_locked";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "english_translation_enabled";`)
}
