import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  CREATE TYPE "public"."enum_pages_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  CREATE TYPE "public"."enum_solutions_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  CREATE TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_bottom_gap" AS ENUM('normal', 'none');
  ALTER TABLE "partners_blocks_sticky_page_nav" ADD COLUMN "bottom_gap" "enum_partners_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_sticky_page_nav" ADD COLUMN "bottom_gap" "enum_pages_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" ADD COLUMN "bottom_gap" "enum__pages_v_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal';
  ALTER TABLE "solutions_blocks_sticky_page_nav" ADD COLUMN "bottom_gap" "enum_solutions_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal';
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav" ADD COLUMN "bottom_gap" "enum__solutions_v_blocks_sticky_page_nav_bottom_gap" DEFAULT 'normal';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners_blocks_sticky_page_nav" DROP COLUMN "bottom_gap";
  ALTER TABLE "pages_blocks_sticky_page_nav" DROP COLUMN "bottom_gap";
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" DROP COLUMN "bottom_gap";
  ALTER TABLE "solutions_blocks_sticky_page_nav" DROP COLUMN "bottom_gap";
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav" DROP COLUMN "bottom_gap";
  DROP TYPE "public"."enum_partners_blocks_sticky_page_nav_bottom_gap";
  DROP TYPE "public"."enum_pages_blocks_sticky_page_nav_bottom_gap";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_page_nav_bottom_gap";
  DROP TYPE "public"."enum_solutions_blocks_sticky_page_nav_bottom_gap";
  DROP TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_bottom_gap";`)
}
