import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cases_locales" ADD COLUMN "hero_subtitle" varchar;
  ALTER TABLE "_cases_v_locales" ADD COLUMN "version_hero_subtitle" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cases_locales" DROP COLUMN "hero_subtitle";
  ALTER TABLE "_cases_v_locales" DROP COLUMN "version_hero_subtitle";`)
}
