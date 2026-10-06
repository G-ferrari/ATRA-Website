import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_listing" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_section_listing" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_section_listing" DROP COLUMN "theme";
  ALTER TABLE "pages_blocks_section_featured" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_section_featured" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_section_featured" DROP COLUMN "theme";
  ALTER TABLE "pages_blocks_webinar_teaser" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_webinar_teaser" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_webinar_teaser" DROP COLUMN "theme";
  ALTER TABLE "_pages_v_blocks_section_listing" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_section_listing" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_section_listing" DROP COLUMN "theme";
  ALTER TABLE "_pages_v_blocks_section_featured" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_section_featured" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_section_featured" DROP COLUMN "theme";
  ALTER TABLE "_pages_v_blocks_webinar_teaser" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_webinar_teaser" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_webinar_teaser" DROP COLUMN "theme";
  DROP TYPE "public"."enum_pages_blocks_section_listing_borda";
  DROP TYPE "public"."enum_pages_blocks_section_listing_spacing";
  DROP TYPE "public"."enum_pages_blocks_section_listing_theme";
  DROP TYPE "public"."enum_pages_blocks_section_featured_borda";
  DROP TYPE "public"."enum_pages_blocks_section_featured_spacing";
  DROP TYPE "public"."enum_pages_blocks_section_featured_theme";
  DROP TYPE "public"."enum_pages_blocks_webinar_teaser_borda";
  DROP TYPE "public"."enum_pages_blocks_webinar_teaser_spacing";
  DROP TYPE "public"."enum_pages_blocks_webinar_teaser_theme";
  DROP TYPE "public"."enum__pages_v_blocks_section_listing_borda";
  DROP TYPE "public"."enum__pages_v_blocks_section_listing_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_section_listing_theme";
  DROP TYPE "public"."enum__pages_v_blocks_section_featured_borda";
  DROP TYPE "public"."enum__pages_v_blocks_section_featured_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_section_featured_theme";
  DROP TYPE "public"."enum__pages_v_blocks_webinar_teaser_borda";
  DROP TYPE "public"."enum__pages_v_blocks_webinar_teaser_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_webinar_teaser_theme";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_section_listing_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_section_listing_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_section_listing_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_section_featured_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_section_featured_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_section_featured_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_webinar_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_webinar_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_webinar_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_section_listing_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_section_listing_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_section_listing_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_section_featured_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_section_featured_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_section_featured_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_webinar_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_webinar_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_webinar_teaser_theme" AS ENUM('surface-1', 'surface-2');
  ALTER TABLE "pages_blocks_section_listing" ADD COLUMN "borda" "enum_pages_blocks_section_listing_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_section_listing" ADD COLUMN "spacing" "enum_pages_blocks_section_listing_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_section_listing" ADD COLUMN "theme" "enum_pages_blocks_section_listing_theme" DEFAULT 'surface-1';
  ALTER TABLE "pages_blocks_section_featured" ADD COLUMN "borda" "enum_pages_blocks_section_featured_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_section_featured" ADD COLUMN "spacing" "enum_pages_blocks_section_featured_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_section_featured" ADD COLUMN "theme" "enum_pages_blocks_section_featured_theme" DEFAULT 'surface-1';
  ALTER TABLE "pages_blocks_webinar_teaser" ADD COLUMN "borda" "enum_pages_blocks_webinar_teaser_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_webinar_teaser" ADD COLUMN "spacing" "enum_pages_blocks_webinar_teaser_spacing" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_webinar_teaser" ADD COLUMN "theme" "enum_pages_blocks_webinar_teaser_theme" DEFAULT 'surface-1';
  ALTER TABLE "_pages_v_blocks_section_listing" ADD COLUMN "borda" "enum__pages_v_blocks_section_listing_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_section_listing" ADD COLUMN "spacing" "enum__pages_v_blocks_section_listing_spacing" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_section_listing" ADD COLUMN "theme" "enum__pages_v_blocks_section_listing_theme" DEFAULT 'surface-1';
  ALTER TABLE "_pages_v_blocks_section_featured" ADD COLUMN "borda" "enum__pages_v_blocks_section_featured_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_section_featured" ADD COLUMN "spacing" "enum__pages_v_blocks_section_featured_spacing" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_section_featured" ADD COLUMN "theme" "enum__pages_v_blocks_section_featured_theme" DEFAULT 'surface-1';
  ALTER TABLE "_pages_v_blocks_webinar_teaser" ADD COLUMN "borda" "enum__pages_v_blocks_webinar_teaser_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_webinar_teaser" ADD COLUMN "spacing" "enum__pages_v_blocks_webinar_teaser_spacing" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_webinar_teaser" ADD COLUMN "theme" "enum__pages_v_blocks_webinar_teaser_theme" DEFAULT 'surface-1';`)
}
