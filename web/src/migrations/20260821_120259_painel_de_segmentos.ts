import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_navigation_categories_panel" ADD VALUE 'segments' BEFORE 'links';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation_categories" ALTER COLUMN "panel" SET DATA TYPE text;
  ALTER TABLE "navigation_categories" ALTER COLUMN "panel" SET DEFAULT 'split'::text;
  DROP TYPE "public"."enum_navigation_categories_panel";
  CREATE TYPE "public"."enum_navigation_categories_panel" AS ENUM('solutions', 'partners', 'links', 'split');
  ALTER TABLE "navigation_categories" ALTER COLUMN "panel" SET DEFAULT 'split'::"public"."enum_navigation_categories_panel";
  ALTER TABLE "navigation_categories" ALTER COLUMN "panel" SET DATA TYPE "public"."enum_navigation_categories_panel" USING "panel"::"public"."enum_navigation_categories_panel";`)
}
