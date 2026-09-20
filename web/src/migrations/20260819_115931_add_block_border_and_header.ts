import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN "borda" "enum_pages_blocks_page_hero_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_sticky_page_nav" ADD COLUMN "borda" "enum_pages_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_stats_grid" ADD COLUMN "borda" "enum_pages_blocks_stats_grid_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_rich_text_section" ADD COLUMN "borda" "enum_pages_blocks_rich_text_section_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_icon_card_grid" ADD COLUMN "header_width" "enum_pages_blocks_icon_card_grid_header_width" DEFAULT 'full';
  ALTER TABLE "pages_blocks_icon_card_grid" ADD COLUMN "borda" "enum_pages_blocks_icon_card_grid_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_value_cards" ADD COLUMN "borda" "enum_pages_blocks_value_cards_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_value_cards_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_partner_showcase" ADD COLUMN "borda" "enum_pages_blocks_partner_showcase_borda" DEFAULT 'nenhuma';
  ALTER TABLE "pages_blocks_cta_banner" ADD COLUMN "borda" "enum_pages_blocks_cta_banner_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN "borda" "enum__pages_v_blocks_page_hero_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" ADD COLUMN "borda" "enum__pages_v_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_stats_grid" ADD COLUMN "borda" "enum__pages_v_blocks_stats_grid_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_rich_text_section" ADD COLUMN "borda" "enum__pages_v_blocks_rich_text_section_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_icon_card_grid" ADD COLUMN "header_width" "enum__pages_v_blocks_icon_card_grid_header_width" DEFAULT 'full';
  ALTER TABLE "_pages_v_blocks_icon_card_grid" ADD COLUMN "borda" "enum__pages_v_blocks_icon_card_grid_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_value_cards" ADD COLUMN "borda" "enum__pages_v_blocks_value_cards_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_value_cards_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_partner_showcase" ADD COLUMN "borda" "enum__pages_v_blocks_partner_showcase_borda" DEFAULT 'nenhuma';
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD COLUMN "borda" "enum__pages_v_blocks_cta_banner_borda" DEFAULT 'nenhuma';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_sticky_page_nav" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_stats_grid" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_rich_text_section" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_icon_card_grid" DROP COLUMN "header_width";
  ALTER TABLE "pages_blocks_icon_card_grid" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_value_cards" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_value_cards_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_partner_showcase" DROP COLUMN "borda";
  ALTER TABLE "pages_blocks_cta_banner" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_stats_grid" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_rich_text_section" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_icon_card_grid" DROP COLUMN "header_width";
  ALTER TABLE "_pages_v_blocks_icon_card_grid" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_value_cards" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_value_cards_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_partner_showcase" DROP COLUMN "borda";
  ALTER TABLE "_pages_v_blocks_cta_banner" DROP COLUMN "borda";
  DROP TYPE "public"."enum_pages_blocks_page_hero_borda";
  DROP TYPE "public"."enum_pages_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum_pages_blocks_stats_grid_borda";
  DROP TYPE "public"."enum_pages_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum_pages_blocks_value_cards_borda";
  DROP TYPE "public"."enum_pages_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_borda";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_borda";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum__pages_v_blocks_stats_grid_borda";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_borda";
  DROP TYPE "public"."enum__pages_v_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_borda";`)
}
