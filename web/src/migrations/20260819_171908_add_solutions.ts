import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_solutions_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  CREATE TYPE "public"."enum_solutions_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum_solutions_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum_solutions_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_variant" AS ENUM('compact', 'card');
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  CREATE TYPE "public"."enum_solutions_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum_solutions_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  CREATE TYPE "public"."enum_solutions_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_category" AS ENUM('innovation-ai', 'data-bi', 'governance-culture');
  CREATE TYPE "public"."enum_solutions_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum__solutions_v_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum__solutions_v_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_variant" AS ENUM('compact', 'card');
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  CREATE TYPE "public"."enum__solutions_v_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum__solutions_v_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_version_category" AS ENUM('innovation-ai', 'data-bi', 'governance-culture');
  CREATE TYPE "public"."enum__solutions_v_version_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_published_locale" AS ENUM('pt', 'en');
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'app';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'app';
  CREATE TABLE "solutions_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "solutions_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_mode" "enum_solutions_blocks_page_hero_media_mode" DEFAULT 'none',
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_page_hero_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "solutions_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_solutions_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_stats_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "solutions_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_solutions_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_rich_text_section_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles'
  );
  
  CREATE TABLE "solutions_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_solutions_blocks_icon_card_grid_columns" DEFAULT '4',
  	"variant" "enum_solutions_blocks_icon_card_grid_variant" DEFAULT 'compact',
  	"header_width" "enum_solutions_blocks_icon_card_grid_header_width" DEFAULT 'full',
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_icon_card_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum_solutions_blocks_value_cards_items_glow_color" DEFAULT 'blue'
  );
  
  CREATE TABLE "solutions_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_value_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_value_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_partner_showcase_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"variant" "enum_solutions_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_cta_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum_solutions_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_solutions_category",
  	"icon" "enum_solutions_icon" DEFAULT 'sparkles',
  	"has_page" boolean,
  	"order" numeric DEFAULT 0,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solutions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solutions_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "solutions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "_solutions_v_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_mode" "enum__solutions_v_blocks_page_hero_media_mode" DEFAULT 'none',
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_page_hero_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__solutions_v_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_stats_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__solutions_v_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_rich_text_section_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__solutions_v_blocks_icon_card_grid_columns" DEFAULT '4',
  	"variant" "enum__solutions_v_blocks_icon_card_grid_variant" DEFAULT 'compact',
  	"header_width" "enum__solutions_v_blocks_icon_card_grid_header_width" DEFAULT 'full',
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_icon_card_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum__solutions_v_blocks_value_cards_items_glow_color" DEFAULT 'blue',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_value_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_value_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_partner_showcase_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"variant" "enum__solutions_v_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_cta_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum__solutions_v_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category" "enum__solutions_v_version_category",
  	"version_icon" "enum__solutions_v_version_icon" DEFAULT 'sparkles',
  	"version_has_page" boolean,
  	"version_order" numeric DEFAULT 0,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__solutions_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_solutions_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_solutions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "solutions_blocks_page_hero_ctas" ADD CONSTRAINT "solutions_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_page_hero_ctas_locales" ADD CONSTRAINT "solutions_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_page_hero" ADD CONSTRAINT "solutions_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_page_hero_locales" ADD CONSTRAINT "solutions_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_sticky_page_nav" ADD CONSTRAINT "solutions_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_sticky_page_nav_locales" ADD CONSTRAINT "solutions_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_stats_grid_custom_items" ADD CONSTRAINT "solutions_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "solutions_blocks_stats_grid_custom_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_stats_grid" ADD CONSTRAINT "solutions_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_stats_grid_locales" ADD CONSTRAINT "solutions_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_rich_text_section_ctas" ADD CONSTRAINT "solutions_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "solutions_blocks_rich_text_section_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_rich_text_section" ADD CONSTRAINT "solutions_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_rich_text_section" ADD CONSTRAINT "solutions_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_rich_text_section_locales" ADD CONSTRAINT "solutions_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ADD CONSTRAINT "solutions_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "solutions_blocks_icon_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_icon_card_grid" ADD CONSTRAINT "solutions_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_icon_card_grid_locales" ADD CONSTRAINT "solutions_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_value_cards_items" ADD CONSTRAINT "solutions_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_value_cards_items_locales" ADD CONSTRAINT "solutions_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_value_cards" ADD CONSTRAINT "solutions_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_value_cards_locales" ADD CONSTRAINT "solutions_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_showcase" ADD CONSTRAINT "solutions_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_showcase_locales" ADD CONSTRAINT "solutions_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_seals_banner" ADD CONSTRAINT "solutions_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_seals_banner_locales" ADD CONSTRAINT "solutions_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_process_steps_steps" ADD CONSTRAINT "solutions_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_process_steps_steps_locales" ADD CONSTRAINT "solutions_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_process_steps" ADD CONSTRAINT "solutions_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_process_steps_locales" ADD CONSTRAINT "solutions_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_cta_contact" ADD CONSTRAINT "solutions_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_cta_contact_locales" ADD CONSTRAINT "solutions_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_jobs_list" ADD CONSTRAINT "solutions_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_jobs_list_locales" ADD CONSTRAINT "solutions_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_cta_banner" ADD CONSTRAINT "solutions_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_cta_banner_locales" ADD CONSTRAINT "solutions_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_locales" ADD CONSTRAINT "solutions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_texts" ADD CONSTRAINT "solutions_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_page_hero_ctas" ADD CONSTRAINT "_solutions_v_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_page_hero_ctas_locales" ADD CONSTRAINT "_solutions_v_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD CONSTRAINT "_solutions_v_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_page_hero_locales" ADD CONSTRAINT "_solutions_v_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav" ADD CONSTRAINT "_solutions_v_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav_locales" ADD CONSTRAINT "_solutions_v_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_stats_grid_custom_items" ADD CONSTRAINT "_solutions_v_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "_solutions_v_blocks_stats_grid_custom_items_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_stats_grid" ADD CONSTRAINT "_solutions_v_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_stats_grid_locales" ADD CONSTRAINT "_solutions_v_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_rich_text_section_ctas" ADD CONSTRAINT "_solutions_v_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "_solutions_v_blocks_rich_text_section_ctas_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_rich_text_section" ADD CONSTRAINT "_solutions_v_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_rich_text_section" ADD CONSTRAINT "_solutions_v_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_rich_text_section_locales" ADD CONSTRAINT "_solutions_v_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ADD CONSTRAINT "_solutions_v_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "_solutions_v_blocks_icon_card_grid_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid" ADD CONSTRAINT "_solutions_v_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_locales" ADD CONSTRAINT "_solutions_v_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ADD CONSTRAINT "_solutions_v_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_value_cards_items_locales" ADD CONSTRAINT "_solutions_v_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_value_cards" ADD CONSTRAINT "_solutions_v_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_value_cards_locales" ADD CONSTRAINT "_solutions_v_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_showcase" ADD CONSTRAINT "_solutions_v_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_showcase_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_seals_banner" ADD CONSTRAINT "_solutions_v_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_seals_banner_locales" ADD CONSTRAINT "_solutions_v_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_process_steps_steps" ADD CONSTRAINT "_solutions_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_process_steps_steps_locales" ADD CONSTRAINT "_solutions_v_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_process_steps" ADD CONSTRAINT "_solutions_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_process_steps_locales" ADD CONSTRAINT "_solutions_v_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_cta_contact" ADD CONSTRAINT "_solutions_v_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_cta_contact_locales" ADD CONSTRAINT "_solutions_v_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_jobs_list" ADD CONSTRAINT "_solutions_v_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_jobs_list_locales" ADD CONSTRAINT "_solutions_v_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_cta_banner" ADD CONSTRAINT "_solutions_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_cta_banner_locales" ADD CONSTRAINT "_solutions_v_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_locales" ADD CONSTRAINT "_solutions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_texts" ADD CONSTRAINT "_solutions_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solutions_blocks_page_hero_ctas_order_idx" ON "solutions_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "solutions_blocks_page_hero_ctas_parent_id_idx" ON "solutions_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_page_hero_ctas_locales_locale_parent_id_uni" ON "solutions_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_page_hero_order_idx" ON "solutions_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "solutions_blocks_page_hero_parent_id_idx" ON "solutions_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_page_hero_path_idx" ON "solutions_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_page_hero_locales_locale_parent_id_unique" ON "solutions_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_sticky_page_nav_order_idx" ON "solutions_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "solutions_blocks_sticky_page_nav_parent_id_idx" ON "solutions_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_sticky_page_nav_path_idx" ON "solutions_blocks_sticky_page_nav" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_sticky_page_nav_locales_locale_parent_id_un" ON "solutions_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_stats_grid_custom_items_order_idx" ON "solutions_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_stats_grid_custom_items_parent_id_idx" ON "solutions_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_stats_grid_custom_items_locales_locale_pare" ON "solutions_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_stats_grid_order_idx" ON "solutions_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "solutions_blocks_stats_grid_parent_id_idx" ON "solutions_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_stats_grid_path_idx" ON "solutions_blocks_stats_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_stats_grid_locales_locale_parent_id_unique" ON "solutions_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_rich_text_section_ctas_order_idx" ON "solutions_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "solutions_blocks_rich_text_section_ctas_parent_id_idx" ON "solutions_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_rich_text_section_ctas_locales_locale_paren" ON "solutions_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_rich_text_section_order_idx" ON "solutions_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "solutions_blocks_rich_text_section_parent_id_idx" ON "solutions_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_rich_text_section_path_idx" ON "solutions_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "solutions_blocks_rich_text_section_image_idx" ON "solutions_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_rich_text_section_locales_locale_parent_id_" ON "solutions_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_icon_card_grid_items_order_idx" ON "solutions_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_icon_card_grid_items_parent_id_idx" ON "solutions_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_icon_card_grid_items_locales_locale_parent_" ON "solutions_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_icon_card_grid_order_idx" ON "solutions_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "solutions_blocks_icon_card_grid_parent_id_idx" ON "solutions_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_icon_card_grid_path_idx" ON "solutions_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_icon_card_grid_locales_locale_parent_id_uni" ON "solutions_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_value_cards_items_order_idx" ON "solutions_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_value_cards_items_parent_id_idx" ON "solutions_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_value_cards_items_locales_locale_parent_id_" ON "solutions_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_value_cards_order_idx" ON "solutions_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "solutions_blocks_value_cards_parent_id_idx" ON "solutions_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_value_cards_path_idx" ON "solutions_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_value_cards_locales_locale_parent_id_unique" ON "solutions_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_partner_showcase_order_idx" ON "solutions_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "solutions_blocks_partner_showcase_parent_id_idx" ON "solutions_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_partner_showcase_path_idx" ON "solutions_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_partner_showcase_locales_locale_parent_id_u" ON "solutions_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_seals_banner_order_idx" ON "solutions_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "solutions_blocks_seals_banner_parent_id_idx" ON "solutions_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_seals_banner_path_idx" ON "solutions_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_seals_banner_locales_locale_parent_id_uniqu" ON "solutions_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_process_steps_steps_order_idx" ON "solutions_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "solutions_blocks_process_steps_steps_parent_id_idx" ON "solutions_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_process_steps_steps_locales_locale_parent_i" ON "solutions_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_process_steps_order_idx" ON "solutions_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "solutions_blocks_process_steps_parent_id_idx" ON "solutions_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_process_steps_path_idx" ON "solutions_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_process_steps_locales_locale_parent_id_uniq" ON "solutions_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_cta_contact_order_idx" ON "solutions_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "solutions_blocks_cta_contact_parent_id_idx" ON "solutions_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_cta_contact_path_idx" ON "solutions_blocks_cta_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_cta_contact_locales_locale_parent_id_unique" ON "solutions_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_jobs_list_order_idx" ON "solutions_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "solutions_blocks_jobs_list_parent_id_idx" ON "solutions_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_jobs_list_path_idx" ON "solutions_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_jobs_list_locales_locale_parent_id_unique" ON "solutions_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_cta_banner_order_idx" ON "solutions_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "solutions_blocks_cta_banner_parent_id_idx" ON "solutions_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_cta_banner_path_idx" ON "solutions_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_cta_banner_locales_locale_parent_id_unique" ON "solutions_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_seo_seo_og_image_idx" ON "solutions" USING btree ("seo_og_image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "solutions_locales_locale_parent_id_unique" ON "solutions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_texts_order_parent" ON "solutions_texts" USING btree ("order","parent_id");
  CREATE INDEX "solutions_texts_locale_parent" ON "solutions_texts" USING btree ("locale","parent_id");
  CREATE INDEX "solutions_rels_order_idx" ON "solutions_rels" USING btree ("order");
  CREATE INDEX "solutions_rels_parent_idx" ON "solutions_rels" USING btree ("parent_id");
  CREATE INDEX "solutions_rels_path_idx" ON "solutions_rels" USING btree ("path");
  CREATE INDEX "solutions_rels_media_id_idx" ON "solutions_rels" USING btree ("media_id");
  CREATE INDEX "solutions_rels_partners_id_idx" ON "solutions_rels" USING btree ("partners_id");
  CREATE INDEX "_solutions_v_blocks_page_hero_ctas_order_idx" ON "_solutions_v_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_page_hero_ctas_parent_id_idx" ON "_solutions_v_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_page_hero_ctas_locales_locale_parent_id_" ON "_solutions_v_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_page_hero_order_idx" ON "_solutions_v_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_page_hero_parent_id_idx" ON "_solutions_v_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_page_hero_path_idx" ON "_solutions_v_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_page_hero_locales_locale_parent_id_uniqu" ON "_solutions_v_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_sticky_page_nav_order_idx" ON "_solutions_v_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_sticky_page_nav_parent_id_idx" ON "_solutions_v_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_sticky_page_nav_path_idx" ON "_solutions_v_blocks_sticky_page_nav" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_sticky_page_nav_locales_locale_parent_id" ON "_solutions_v_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_stats_grid_custom_items_order_idx" ON "_solutions_v_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_stats_grid_custom_items_parent_id_idx" ON "_solutions_v_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_stats_grid_custom_items_locales_locale_p" ON "_solutions_v_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_stats_grid_order_idx" ON "_solutions_v_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_stats_grid_parent_id_idx" ON "_solutions_v_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_stats_grid_path_idx" ON "_solutions_v_blocks_stats_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_stats_grid_locales_locale_parent_id_uniq" ON "_solutions_v_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_rich_text_section_ctas_order_idx" ON "_solutions_v_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_rich_text_section_ctas_parent_id_idx" ON "_solutions_v_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_rich_text_section_ctas_locales_locale_pa" ON "_solutions_v_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_rich_text_section_order_idx" ON "_solutions_v_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_rich_text_section_parent_id_idx" ON "_solutions_v_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_rich_text_section_path_idx" ON "_solutions_v_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_rich_text_section_image_idx" ON "_solutions_v_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_rich_text_section_locales_locale_parent_" ON "_solutions_v_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_icon_card_grid_items_order_idx" ON "_solutions_v_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_icon_card_grid_items_parent_id_idx" ON "_solutions_v_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_icon_card_grid_items_locales_locale_pare" ON "_solutions_v_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_icon_card_grid_order_idx" ON "_solutions_v_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_icon_card_grid_parent_id_idx" ON "_solutions_v_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_icon_card_grid_path_idx" ON "_solutions_v_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_icon_card_grid_locales_locale_parent_id_" ON "_solutions_v_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_value_cards_items_order_idx" ON "_solutions_v_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_value_cards_items_parent_id_idx" ON "_solutions_v_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_value_cards_items_locales_locale_parent_" ON "_solutions_v_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_value_cards_order_idx" ON "_solutions_v_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_value_cards_parent_id_idx" ON "_solutions_v_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_value_cards_path_idx" ON "_solutions_v_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_value_cards_locales_locale_parent_id_uni" ON "_solutions_v_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_showcase_order_idx" ON "_solutions_v_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_partner_showcase_parent_id_idx" ON "_solutions_v_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_showcase_path_idx" ON "_solutions_v_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_partner_showcase_locales_locale_parent_i" ON "_solutions_v_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_seals_banner_order_idx" ON "_solutions_v_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_seals_banner_parent_id_idx" ON "_solutions_v_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_seals_banner_path_idx" ON "_solutions_v_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_seals_banner_locales_locale_parent_id_un" ON "_solutions_v_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_process_steps_steps_order_idx" ON "_solutions_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_process_steps_steps_parent_id_idx" ON "_solutions_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_process_steps_steps_locales_locale_paren" ON "_solutions_v_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_process_steps_order_idx" ON "_solutions_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_process_steps_parent_id_idx" ON "_solutions_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_process_steps_path_idx" ON "_solutions_v_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_process_steps_locales_locale_parent_id_u" ON "_solutions_v_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_cta_contact_order_idx" ON "_solutions_v_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_cta_contact_parent_id_idx" ON "_solutions_v_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_cta_contact_path_idx" ON "_solutions_v_blocks_cta_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_cta_contact_locales_locale_parent_id_uni" ON "_solutions_v_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_jobs_list_order_idx" ON "_solutions_v_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_jobs_list_parent_id_idx" ON "_solutions_v_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_jobs_list_path_idx" ON "_solutions_v_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_jobs_list_locales_locale_parent_id_uniqu" ON "_solutions_v_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_cta_banner_order_idx" ON "_solutions_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_cta_banner_parent_id_idx" ON "_solutions_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_cta_banner_path_idx" ON "_solutions_v_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_cta_banner_locales_locale_parent_id_uniq" ON "_solutions_v_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_seo_version_seo_og_image_idx" ON "_solutions_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_snapshot_idx" ON "_solutions_v" USING btree ("snapshot");
  CREATE INDEX "_solutions_v_published_locale_idx" ON "_solutions_v" USING btree ("published_locale");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE INDEX "_solutions_v_version_version_slug_idx" ON "_solutions_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_solutions_v_locales_locale_parent_id_unique" ON "_solutions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_texts_order_parent" ON "_solutions_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_solutions_v_texts_locale_parent" ON "_solutions_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_solutions_v_rels_order_idx" ON "_solutions_v_rels" USING btree ("order");
  CREATE INDEX "_solutions_v_rels_parent_idx" ON "_solutions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_rels_path_idx" ON "_solutions_v_rels" USING btree ("path");
  CREATE INDEX "_solutions_v_rels_media_id_idx" ON "_solutions_v_rels" USING btree ("media_id");
  CREATE INDEX "_solutions_v_rels_partners_id_idx" ON "_solutions_v_rels" USING btree ("partners_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_blocks_page_hero_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_page_hero_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_sticky_page_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_sticky_page_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_stats_grid_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_stats_grid_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_stats_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_stats_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_rich_text_section_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_rich_text_section_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_rich_text_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_icon_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_icon_card_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_icon_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_icon_card_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_value_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_value_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_value_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_partner_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_partner_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_seals_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_seals_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_process_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_cta_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_cta_contact_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_jobs_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_jobs_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_page_hero_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_page_hero_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_sticky_page_nav_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_stats_grid_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_stats_grid_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_stats_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_stats_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_rich_text_section_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_rich_text_section_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_rich_text_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_value_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_value_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_value_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_partner_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_partner_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_seals_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_seals_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_process_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_cta_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_cta_contact_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_jobs_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_jobs_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "solutions_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "solutions_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "solutions_blocks_page_hero" CASCADE;
  DROP TABLE "solutions_blocks_page_hero_locales" CASCADE;
  DROP TABLE "solutions_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "solutions_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "solutions_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "solutions_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_stats_grid" CASCADE;
  DROP TABLE "solutions_blocks_stats_grid_locales" CASCADE;
  DROP TABLE "solutions_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "solutions_blocks_rich_text_section_ctas_locales" CASCADE;
  DROP TABLE "solutions_blocks_rich_text_section" CASCADE;
  DROP TABLE "solutions_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "solutions_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "solutions_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_icon_card_grid" CASCADE;
  DROP TABLE "solutions_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "solutions_blocks_value_cards_items" CASCADE;
  DROP TABLE "solutions_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_value_cards" CASCADE;
  DROP TABLE "solutions_blocks_value_cards_locales" CASCADE;
  DROP TABLE "solutions_blocks_partner_showcase" CASCADE;
  DROP TABLE "solutions_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "solutions_blocks_seals_banner" CASCADE;
  DROP TABLE "solutions_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "solutions_blocks_process_steps_steps" CASCADE;
  DROP TABLE "solutions_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "solutions_blocks_process_steps" CASCADE;
  DROP TABLE "solutions_blocks_process_steps_locales" CASCADE;
  DROP TABLE "solutions_blocks_cta_contact" CASCADE;
  DROP TABLE "solutions_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "solutions_blocks_jobs_list" CASCADE;
  DROP TABLE "solutions_blocks_jobs_list_locales" CASCADE;
  DROP TABLE "solutions_blocks_cta_banner" CASCADE;
  DROP TABLE "solutions_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_locales" CASCADE;
  DROP TABLE "solutions_texts" CASCADE;
  DROP TABLE "solutions_rels" CASCADE;
  DROP TABLE "_solutions_v_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "_solutions_v_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_page_hero" CASCADE;
  DROP TABLE "_solutions_v_blocks_page_hero_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "_solutions_v_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_stats_grid" CASCADE;
  DROP TABLE "_solutions_v_blocks_stats_grid_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "_solutions_v_blocks_rich_text_section_ctas_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_rich_text_section" CASCADE;
  DROP TABLE "_solutions_v_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_icon_card_grid" CASCADE;
  DROP TABLE "_solutions_v_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_value_cards_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_value_cards" CASCADE;
  DROP TABLE "_solutions_v_blocks_value_cards_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_showcase" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_seals_banner" CASCADE;
  DROP TABLE "_solutions_v_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_solutions_v_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_process_steps" CASCADE;
  DROP TABLE "_solutions_v_blocks_process_steps_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_cta_contact" CASCADE;
  DROP TABLE "_solutions_v_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_jobs_list" CASCADE;
  DROP TABLE "_solutions_v_blocks_jobs_list_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_solutions_v_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "_solutions_v_locales" CASCADE;
  DROP TABLE "_solutions_v_texts" CASCADE;
  DROP TABLE "_solutions_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solutions_fk";
  
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_icon_card_grid_items_icon";
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_partners_blocks_icon_card_grid_items_icon";
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_value_cards_items_icon";
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_value_cards_items_icon" USING "icon"::"public"."enum_partners_blocks_value_cards_items_icon";
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_icon_card_grid_items_icon";
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_icon_card_grid_items_icon";
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_value_cards_items_icon";
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_value_cards_items_icon" USING "icon"::"public"."enum_pages_blocks_value_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_value_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" USING "icon"::"public"."enum__pages_v_blocks_value_cards_items_icon";
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_specialist_roles_icon";
  CREATE TYPE "public"."enum_specialist_roles_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_specialist_roles_icon";
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_specialist_roles_icon" USING "icon"::"public"."enum_specialist_roles_icon";
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_site_settings_metrics_icon";
  CREATE TYPE "public"."enum_site_settings_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_site_settings_metrics_icon";
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_site_settings_metrics_icon" USING "icon"::"public"."enum_site_settings_metrics_icon";
  DROP INDEX "payload_locked_documents_rels_solutions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solutions_id";
  DROP TYPE "public"."enum_solutions_blocks_page_hero_media_mode";
  DROP TYPE "public"."enum_solutions_blocks_page_hero_borda";
  DROP TYPE "public"."enum_solutions_blocks_page_hero_theme";
  DROP TYPE "public"."enum_solutions_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum_solutions_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum_solutions_blocks_stats_grid_source";
  DROP TYPE "public"."enum_solutions_blocks_stats_grid_borda";
  DROP TYPE "public"."enum_solutions_blocks_stats_grid_theme";
  DROP TYPE "public"."enum_solutions_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum_solutions_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum_solutions_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_variant";
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum_solutions_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum_solutions_blocks_value_cards_borda";
  DROP TYPE "public"."enum_solutions_blocks_value_cards_theme";
  DROP TYPE "public"."enum_solutions_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum_solutions_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum_solutions_blocks_seals_banner_borda";
  DROP TYPE "public"."enum_solutions_blocks_seals_banner_theme";
  DROP TYPE "public"."enum_solutions_blocks_process_steps_borda";
  DROP TYPE "public"."enum_solutions_blocks_process_steps_theme";
  DROP TYPE "public"."enum_solutions_blocks_cta_contact_borda";
  DROP TYPE "public"."enum_solutions_blocks_cta_contact_theme";
  DROP TYPE "public"."enum_solutions_blocks_jobs_list_borda";
  DROP TYPE "public"."enum_solutions_blocks_jobs_list_theme";
  DROP TYPE "public"."enum_solutions_blocks_cta_banner_variant";
  DROP TYPE "public"."enum_solutions_blocks_cta_banner_borda";
  DROP TYPE "public"."enum_solutions_blocks_cta_banner_theme";
  DROP TYPE "public"."enum_solutions_category";
  DROP TYPE "public"."enum_solutions_icon";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_media_mode";
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_stats_grid_source";
  DROP TYPE "public"."enum__solutions_v_blocks_stats_grid_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_stats_grid_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum__solutions_v_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_variant";
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum__solutions_v_blocks_value_cards_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_value_cards_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_seals_banner_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_seals_banner_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_process_steps_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_process_steps_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_cta_contact_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_cta_contact_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_jobs_list_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_jobs_list_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_cta_banner_variant";
  DROP TYPE "public"."enum__solutions_v_blocks_cta_banner_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_cta_banner_theme";
  DROP TYPE "public"."enum__solutions_v_version_category";
  DROP TYPE "public"."enum__solutions_v_version_icon";
  DROP TYPE "public"."enum__solutions_v_version_status";
  DROP TYPE "public"."enum__solutions_v_published_locale";`)
}
