import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum_partners_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum_pages_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum_solutions_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_split_right_column" AS ENUM('image', 'checklist', 'specGrid');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_split_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_split_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_split_theme" AS ENUM('surface-1', 'surface-2');
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_value_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_method_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_method_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_method_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_items_footer_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_items_footer_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_items_footer_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_audience_split_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_audience_split_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_audience_split_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_partners_blocks_cta_banner_variant" ADD VALUE 'dark-centered';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_value_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_method_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_method_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_method_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_items_footer_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_items_footer_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_items_footer_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_audience_split_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_audience_split_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_audience_split_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_pages_blocks_cta_banner_variant" ADD VALUE 'dark-centered';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_method_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_method_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_method_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_items_footer_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_items_footer_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_items_footer_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_audience_split_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_audience_split_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_audience_split_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_banner_variant" ADD VALUE 'dark-centered';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_value_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_method_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_method_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_method_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_items_footer_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_items_footer_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_items_footer_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_audience_split_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_audience_split_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_audience_split_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_solutions_blocks_cta_banner_variant" ADD VALUE 'dark-centered';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_solutions_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_items_footer_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_items_footer_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_items_footer_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" ADD VALUE 'dark-centered';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum__solutions_v_version_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_specialist_roles_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_navigation_categories_links_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_navigation_categories_links_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_navigation_categories_links_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_navigation_categories_highlights_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_navigation_categories_highlights_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_navigation_categories_highlights_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_navigation_categories_card_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_navigation_categories_card_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_navigation_categories_card_icon" ADD VALUE 'headset';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'server';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'code';
  ALTER TYPE "public"."enum_site_settings_metrics_icon" ADD VALUE 'headset';
  CREATE TABLE "partners_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "partners_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"right_column" "enum_partners_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "pages_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"right_column" "enum_pages_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"right_column" "enum__pages_v_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "solutions_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"right_column" "enum_solutions_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_hero_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_hero_awards_locales" (
  	"top_text" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_partner_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_partner_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_partner_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_split_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_split_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_split_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_split_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"right_column" "enum__solutions_v_blocks_partner_split_right_column" DEFAULT 'image',
  	"image_id" integer,
  	"logo_id" integer,
  	"cta_href" varchar,
  	"link_cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_partner_split_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_partner_split_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_partner_split_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_partner_split_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_label" varchar,
  	"cta_label" varchar,
  	"link_cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "partners_blocks_partner_hero_awards" ADD CONSTRAINT "partners_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_hero_awards_locales" ADD CONSTRAINT "partners_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_hero" ADD CONSTRAINT "partners_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_hero" ADD CONSTRAINT "partners_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_hero_locales" ADD CONSTRAINT "partners_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split_body" ADD CONSTRAINT "partners_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split_body_locales" ADD CONSTRAINT "partners_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split_items" ADD CONSTRAINT "partners_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split_items_locales" ADD CONSTRAINT "partners_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split" ADD CONSTRAINT "partners_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split" ADD CONSTRAINT "partners_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split" ADD CONSTRAINT "partners_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split_locales" ADD CONSTRAINT "partners_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_hero_awards" ADD CONSTRAINT "pages_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_hero_awards_locales" ADD CONSTRAINT "pages_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_hero" ADD CONSTRAINT "pages_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_hero" ADD CONSTRAINT "pages_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_hero_locales" ADD CONSTRAINT "pages_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split_body" ADD CONSTRAINT "pages_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split_body_locales" ADD CONSTRAINT "pages_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split_items" ADD CONSTRAINT "pages_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split_items_locales" ADD CONSTRAINT "pages_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split" ADD CONSTRAINT "pages_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split" ADD CONSTRAINT "pages_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split" ADD CONSTRAINT "pages_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split_locales" ADD CONSTRAINT "pages_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_hero_awards" ADD CONSTRAINT "_pages_v_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_hero_awards_locales" ADD CONSTRAINT "_pages_v_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_hero" ADD CONSTRAINT "_pages_v_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_hero" ADD CONSTRAINT "_pages_v_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_hero_locales" ADD CONSTRAINT "_pages_v_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split_body" ADD CONSTRAINT "_pages_v_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split_body_locales" ADD CONSTRAINT "_pages_v_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split_items" ADD CONSTRAINT "_pages_v_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split_items_locales" ADD CONSTRAINT "_pages_v_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split" ADD CONSTRAINT "_pages_v_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split" ADD CONSTRAINT "_pages_v_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split" ADD CONSTRAINT "_pages_v_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split_locales" ADD CONSTRAINT "_pages_v_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_hero_awards" ADD CONSTRAINT "solutions_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_hero_awards_locales" ADD CONSTRAINT "solutions_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_hero" ADD CONSTRAINT "solutions_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_hero" ADD CONSTRAINT "solutions_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_hero_locales" ADD CONSTRAINT "solutions_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split_body" ADD CONSTRAINT "solutions_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split_body_locales" ADD CONSTRAINT "solutions_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split_items" ADD CONSTRAINT "solutions_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split_items_locales" ADD CONSTRAINT "solutions_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split" ADD CONSTRAINT "solutions_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split" ADD CONSTRAINT "solutions_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split" ADD CONSTRAINT "solutions_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split_locales" ADD CONSTRAINT "solutions_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_hero_awards" ADD CONSTRAINT "_solutions_v_blocks_partner_hero_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_hero_awards_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_hero_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_hero_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_hero" ADD CONSTRAINT "_solutions_v_blocks_partner_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_hero" ADD CONSTRAINT "_solutions_v_blocks_partner_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_hero_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split_body" ADD CONSTRAINT "_solutions_v_blocks_partner_split_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split_body_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_split_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_split_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split_items" ADD CONSTRAINT "_solutions_v_blocks_partner_split_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split_items_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_split_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_split_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split" ADD CONSTRAINT "_solutions_v_blocks_partner_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split" ADD CONSTRAINT "_solutions_v_blocks_partner_split_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split" ADD CONSTRAINT "_solutions_v_blocks_partner_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_split_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_split"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_partner_hero_awards_order_idx" ON "partners_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "partners_blocks_partner_hero_awards_parent_id_idx" ON "partners_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_partner_hero_awards_locales_locale_parent_id" ON "partners_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_partner_hero_order_idx" ON "partners_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "partners_blocks_partner_hero_parent_id_idx" ON "partners_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_partner_hero_path_idx" ON "partners_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "partners_blocks_partner_hero_logo_idx" ON "partners_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partners_blocks_partner_hero_locales_locale_parent_id_unique" ON "partners_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_partner_split_body_order_idx" ON "partners_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "partners_blocks_partner_split_body_parent_id_idx" ON "partners_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_partner_split_body_locales_locale_parent_id_" ON "partners_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_partner_split_items_order_idx" ON "partners_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_partner_split_items_parent_id_idx" ON "partners_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_partner_split_items_locales_locale_parent_id" ON "partners_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_partner_split_order_idx" ON "partners_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "partners_blocks_partner_split_parent_id_idx" ON "partners_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_partner_split_path_idx" ON "partners_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "partners_blocks_partner_split_image_idx" ON "partners_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "partners_blocks_partner_split_logo_idx" ON "partners_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partners_blocks_partner_split_locales_locale_parent_id_uniqu" ON "partners_blocks_partner_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partner_hero_awards_order_idx" ON "pages_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_hero_awards_parent_id_idx" ON "pages_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_partner_hero_awards_locales_locale_parent_id_un" ON "pages_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partner_hero_order_idx" ON "pages_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_hero_parent_id_idx" ON "pages_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partner_hero_path_idx" ON "pages_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_partner_hero_logo_idx" ON "pages_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "pages_blocks_partner_hero_locales_locale_parent_id_unique" ON "pages_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partner_split_body_order_idx" ON "pages_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_split_body_parent_id_idx" ON "pages_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_partner_split_body_locales_locale_parent_id_uni" ON "pages_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partner_split_items_order_idx" ON "pages_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_split_items_parent_id_idx" ON "pages_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_partner_split_items_locales_locale_parent_id_un" ON "pages_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partner_split_order_idx" ON "pages_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_split_parent_id_idx" ON "pages_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partner_split_path_idx" ON "pages_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_partner_split_image_idx" ON "pages_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_partner_split_logo_idx" ON "pages_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "pages_blocks_partner_split_locales_locale_parent_id_unique" ON "pages_blocks_partner_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_hero_awards_order_idx" ON "_pages_v_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_hero_awards_parent_id_idx" ON "_pages_v_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_hero_awards_locales_locale_parent_id" ON "_pages_v_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_hero_order_idx" ON "_pages_v_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_hero_parent_id_idx" ON "_pages_v_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_hero_path_idx" ON "_pages_v_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partner_hero_logo_idx" ON "_pages_v_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_split_body_order_idx" ON "_pages_v_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_split_body_parent_id_idx" ON "_pages_v_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_split_body_locales_locale_parent_id_" ON "_pages_v_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_split_items_order_idx" ON "_pages_v_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_split_items_parent_id_idx" ON "_pages_v_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_split_items_locales_locale_parent_id" ON "_pages_v_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_split_order_idx" ON "_pages_v_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_split_parent_id_idx" ON "_pages_v_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_split_path_idx" ON "_pages_v_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_partner_split_image_idx" ON "_pages_v_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_partner_split_logo_idx" ON "_pages_v_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_split_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_partner_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_partner_hero_awards_order_idx" ON "solutions_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "solutions_blocks_partner_hero_awards_parent_id_idx" ON "solutions_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_partner_hero_awards_locales_locale_parent_i" ON "solutions_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_partner_hero_order_idx" ON "solutions_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "solutions_blocks_partner_hero_parent_id_idx" ON "solutions_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_partner_hero_path_idx" ON "solutions_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "solutions_blocks_partner_hero_logo_idx" ON "solutions_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "solutions_blocks_partner_hero_locales_locale_parent_id_uniqu" ON "solutions_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_partner_split_body_order_idx" ON "solutions_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "solutions_blocks_partner_split_body_parent_id_idx" ON "solutions_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_partner_split_body_locales_locale_parent_id" ON "solutions_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_partner_split_items_order_idx" ON "solutions_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_partner_split_items_parent_id_idx" ON "solutions_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_partner_split_items_locales_locale_parent_i" ON "solutions_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_partner_split_order_idx" ON "solutions_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "solutions_blocks_partner_split_parent_id_idx" ON "solutions_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_partner_split_path_idx" ON "solutions_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "solutions_blocks_partner_split_image_idx" ON "solutions_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "solutions_blocks_partner_split_logo_idx" ON "solutions_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "solutions_blocks_partner_split_locales_locale_parent_id_uniq" ON "solutions_blocks_partner_split_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_hero_awards_order_idx" ON "_solutions_v_blocks_partner_hero_awards" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_partner_hero_awards_parent_id_idx" ON "_solutions_v_blocks_partner_hero_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_partner_hero_awards_locales_locale_paren" ON "_solutions_v_blocks_partner_hero_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_hero_order_idx" ON "_solutions_v_blocks_partner_hero" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_partner_hero_parent_id_idx" ON "_solutions_v_blocks_partner_hero" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_hero_path_idx" ON "_solutions_v_blocks_partner_hero" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_partner_hero_logo_idx" ON "_solutions_v_blocks_partner_hero" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_partner_hero_locales_locale_parent_id_un" ON "_solutions_v_blocks_partner_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_split_body_order_idx" ON "_solutions_v_blocks_partner_split_body" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_partner_split_body_parent_id_idx" ON "_solutions_v_blocks_partner_split_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_partner_split_body_locales_locale_parent" ON "_solutions_v_blocks_partner_split_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_split_items_order_idx" ON "_solutions_v_blocks_partner_split_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_partner_split_items_parent_id_idx" ON "_solutions_v_blocks_partner_split_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_partner_split_items_locales_locale_paren" ON "_solutions_v_blocks_partner_split_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_split_order_idx" ON "_solutions_v_blocks_partner_split" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_partner_split_parent_id_idx" ON "_solutions_v_blocks_partner_split" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_partner_split_path_idx" ON "_solutions_v_blocks_partner_split" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_partner_split_image_idx" ON "_solutions_v_blocks_partner_split" USING btree ("image_id");
  CREATE INDEX "_solutions_v_blocks_partner_split_logo_idx" ON "_solutions_v_blocks_partner_split" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_partner_split_locales_locale_parent_id_u" ON "_solutions_v_blocks_partner_split_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "partners_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "partners_blocks_partner_hero" CASCADE;
  DROP TABLE "partners_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "partners_blocks_partner_split_body" CASCADE;
  DROP TABLE "partners_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "partners_blocks_partner_split_items" CASCADE;
  DROP TABLE "partners_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "partners_blocks_partner_split" CASCADE;
  DROP TABLE "partners_blocks_partner_split_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "pages_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_hero" CASCADE;
  DROP TABLE "pages_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_split_body" CASCADE;
  DROP TABLE "pages_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_split_items" CASCADE;
  DROP TABLE "pages_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_split" CASCADE;
  DROP TABLE "pages_blocks_partner_split_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_split_body" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_split_items" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_split" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_split_locales" CASCADE;
  DROP TABLE "solutions_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "solutions_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "solutions_blocks_partner_hero" CASCADE;
  DROP TABLE "solutions_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "solutions_blocks_partner_split_body" CASCADE;
  DROP TABLE "solutions_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "solutions_blocks_partner_split_items" CASCADE;
  DROP TABLE "solutions_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_partner_split" CASCADE;
  DROP TABLE "solutions_blocks_partner_split_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_hero_awards" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_hero_awards_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_hero" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_hero_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_split_body" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_split_body_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_split_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_split_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_split" CASCADE;
  DROP TABLE "_solutions_v_blocks_partner_split_locales" CASCADE;
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_icon_card_grid_items_icon";
  ALTER TABLE "partners_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_partners_blocks_icon_card_grid_items_icon";
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_value_cards_items_icon";
  ALTER TABLE "partners_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_value_cards_items_icon" USING "icon"::"public"."enum_partners_blocks_value_cards_items_icon";
  ALTER TABLE "partners_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_method_cards_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_method_cards_items_icon";
  ALTER TABLE "partners_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_method_cards_items_icon" USING "icon"::"public"."enum_partners_blocks_method_cards_items_icon";
  ALTER TABLE "partners_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon";
  CREATE TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_partners_blocks_method_cards_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_partners_blocks_method_cards_eyebrow_icon";
  ALTER TABLE "partners_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_bento_grid_items_icon" USING "icon"::"public"."enum_partners_blocks_bento_grid_items_icon";
  ALTER TABLE "partners_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_bento_grid_items_footer_icon";
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE "public"."enum_partners_blocks_bento_grid_items_footer_icon" USING "footer_icon"::"public"."enum_partners_blocks_bento_grid_items_footer_icon";
  ALTER TABLE "partners_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon";
  CREATE TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_partners_blocks_bento_grid_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_partners_blocks_bento_grid_eyebrow_icon";
  ALTER TABLE "partners_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_partners_blocks_audience_split_items_icon";
  CREATE TYPE "public"."enum_partners_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_partners_blocks_audience_split_items_icon";
  ALTER TABLE "partners_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_partners_blocks_audience_split_items_icon" USING "icon"::"public"."enum_partners_blocks_audience_split_items_icon";
  ALTER TABLE "partners_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon";
  CREATE TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_partners_blocks_audience_split_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_partners_blocks_audience_split_eyebrow_icon";
  ALTER TABLE "partners_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon";
  CREATE TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_partners_blocks_accordion_steps_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_partners_blocks_accordion_steps_eyebrow_icon";
  ALTER TABLE "partners_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon";
  CREATE TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "partners_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE "public"."enum_partners_blocks_accordion_steps_image_badge_icon" USING "image_badge_icon"::"public"."enum_partners_blocks_accordion_steps_image_badge_icon";
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_partners_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum_partners_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark');
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_partners_blocks_cta_banner_variant";
  ALTER TABLE "partners_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_partners_blocks_cta_banner_variant" USING "variant"::"public"."enum_partners_blocks_cta_banner_variant";
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_icon_card_grid_items_icon";
  ALTER TABLE "pages_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_icon_card_grid_items_icon";
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_value_cards_items_icon";
  ALTER TABLE "pages_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_value_cards_items_icon" USING "icon"::"public"."enum_pages_blocks_value_cards_items_icon";
  ALTER TABLE "pages_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_method_cards_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_method_cards_items_icon";
  ALTER TABLE "pages_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_method_cards_items_icon" USING "icon"::"public"."enum_pages_blocks_method_cards_items_icon";
  ALTER TABLE "pages_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon";
  CREATE TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_pages_blocks_method_cards_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_pages_blocks_method_cards_eyebrow_icon";
  ALTER TABLE "pages_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_bento_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_bento_grid_items_icon";
  ALTER TABLE "pages_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_bento_grid_items_footer_icon";
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE "public"."enum_pages_blocks_bento_grid_items_footer_icon" USING "footer_icon"::"public"."enum_pages_blocks_bento_grid_items_footer_icon";
  ALTER TABLE "pages_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon";
  CREATE TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_pages_blocks_bento_grid_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_pages_blocks_bento_grid_eyebrow_icon";
  ALTER TABLE "pages_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_pages_blocks_audience_split_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_pages_blocks_audience_split_items_icon";
  ALTER TABLE "pages_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_audience_split_items_icon" USING "icon"::"public"."enum_pages_blocks_audience_split_items_icon";
  ALTER TABLE "pages_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon";
  CREATE TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_pages_blocks_audience_split_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_pages_blocks_audience_split_eyebrow_icon";
  ALTER TABLE "pages_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon";
  CREATE TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_pages_blocks_accordion_steps_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_pages_blocks_accordion_steps_eyebrow_icon";
  ALTER TABLE "pages_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon";
  CREATE TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "pages_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE "public"."enum_pages_blocks_accordion_steps_image_badge_icon" USING "image_badge_icon"::"public"."enum_pages_blocks_accordion_steps_image_badge_icon";
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark');
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_pages_blocks_cta_banner_variant";
  ALTER TABLE "pages_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_cta_banner_variant" USING "variant"::"public"."enum_pages_blocks_cta_banner_variant";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_value_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" USING "icon"::"public"."enum__pages_v_blocks_value_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_method_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_method_cards_items_icon" USING "icon"::"public"."enum__pages_v_blocks_method_cards_items_icon";
  ALTER TABLE "_pages_v_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__pages_v_blocks_method_cards_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__pages_v_blocks_method_cards_eyebrow_icon";
  ALTER TABLE "_pages_v_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_bento_grid_items_icon" USING "icon"::"public"."enum__pages_v_blocks_bento_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_items_footer_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE "public"."enum__pages_v_blocks_bento_grid_items_footer_icon" USING "footer_icon"::"public"."enum__pages_v_blocks_bento_grid_items_footer_icon";
  ALTER TABLE "_pages_v_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__pages_v_blocks_bento_grid_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__pages_v_blocks_bento_grid_eyebrow_icon";
  ALTER TABLE "_pages_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__pages_v_blocks_audience_split_items_icon";
  ALTER TABLE "_pages_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_audience_split_items_icon" USING "icon"::"public"."enum__pages_v_blocks_audience_split_items_icon";
  ALTER TABLE "_pages_v_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__pages_v_blocks_audience_split_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__pages_v_blocks_audience_split_eyebrow_icon";
  ALTER TABLE "_pages_v_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__pages_v_blocks_accordion_steps_eyebrow_icon";
  ALTER TABLE "_pages_v_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_pages_v_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE "public"."enum__pages_v_blocks_accordion_steps_image_badge_icon" USING "image_badge_icon"::"public"."enum__pages_v_blocks_accordion_steps_image_badge_icon";
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark');
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum__pages_v_blocks_cta_banner_variant";
  ALTER TABLE "_pages_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_cta_banner_variant" USING "variant"::"public"."enum__pages_v_blocks_cta_banner_variant";
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_blocks_icon_card_grid_items_icon";
  ALTER TABLE "solutions_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum_solutions_blocks_icon_card_grid_items_icon";
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_blocks_value_cards_items_icon";
  ALTER TABLE "solutions_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_value_cards_items_icon" USING "icon"::"public"."enum_solutions_blocks_value_cards_items_icon";
  ALTER TABLE "solutions_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_blocks_method_cards_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_blocks_method_cards_items_icon";
  ALTER TABLE "solutions_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_method_cards_items_icon" USING "icon"::"public"."enum_solutions_blocks_method_cards_items_icon";
  ALTER TABLE "solutions_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon";
  CREATE TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_solutions_blocks_method_cards_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_solutions_blocks_method_cards_eyebrow_icon";
  ALTER TABLE "solutions_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_bento_grid_items_icon" USING "icon"::"public"."enum_solutions_blocks_bento_grid_items_icon";
  ALTER TABLE "solutions_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_items_footer_icon";
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE "public"."enum_solutions_blocks_bento_grid_items_footer_icon" USING "footer_icon"::"public"."enum_solutions_blocks_bento_grid_items_footer_icon";
  ALTER TABLE "solutions_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon";
  CREATE TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_solutions_blocks_bento_grid_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_solutions_blocks_bento_grid_eyebrow_icon";
  ALTER TABLE "solutions_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_blocks_audience_split_items_icon";
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_blocks_audience_split_items_icon";
  ALTER TABLE "solutions_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_blocks_audience_split_items_icon" USING "icon"::"public"."enum_solutions_blocks_audience_split_items_icon";
  ALTER TABLE "solutions_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon";
  CREATE TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_solutions_blocks_audience_split_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_solutions_blocks_audience_split_eyebrow_icon";
  ALTER TABLE "solutions_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon";
  CREATE TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum_solutions_blocks_accordion_steps_eyebrow_icon" USING "eyebrow_icon"::"public"."enum_solutions_blocks_accordion_steps_eyebrow_icon";
  ALTER TABLE "solutions_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon";
  CREATE TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE "public"."enum_solutions_blocks_accordion_steps_image_badge_icon" USING "image_badge_icon"::"public"."enum_solutions_blocks_accordion_steps_image_badge_icon";
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_solutions_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum_solutions_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark');
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_solutions_blocks_cta_banner_variant";
  ALTER TABLE "solutions_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_solutions_blocks_cta_banner_variant" USING "variant"::"public"."enum_solutions_blocks_cta_banner_variant";
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_solutions_icon";
  CREATE TYPE "public"."enum_solutions_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_solutions_icon";
  ALTER TABLE "solutions" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_solutions_icon" USING "icon"::"public"."enum_solutions_icon";
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_solutions_v_blocks_icon_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_icon_card_grid_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_icon_card_grid_items_icon";
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_blocks_value_cards_items_icon";
  ALTER TABLE "_solutions_v_blocks_value_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_value_cards_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_value_cards_items_icon";
  ALTER TABLE "_solutions_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_blocks_method_cards_items_icon";
  ALTER TABLE "_solutions_v_blocks_method_cards_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_method_cards_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_method_cards_items_icon";
  ALTER TABLE "_solutions_v_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_method_cards" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__solutions_v_blocks_method_cards_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__solutions_v_blocks_method_cards_eyebrow_icon";
  ALTER TABLE "_solutions_v_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_bento_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_bento_grid_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_bento_grid_items_icon";
  ALTER TABLE "_solutions_v_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_items_footer_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_items_footer_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_bento_grid_items" ALTER COLUMN "footer_icon" SET DATA TYPE "public"."enum__solutions_v_blocks_bento_grid_items_footer_icon" USING "footer_icon"::"public"."enum__solutions_v_blocks_bento_grid_items_footer_icon";
  ALTER TABLE "_solutions_v_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_bento_grid" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__solutions_v_blocks_bento_grid_eyebrow_icon";
  ALTER TABLE "_solutions_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_blocks_audience_split_items_icon";
  ALTER TABLE "_solutions_v_blocks_audience_split_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__solutions_v_blocks_audience_split_items_icon" USING "icon"::"public"."enum__solutions_v_blocks_audience_split_items_icon";
  ALTER TABLE "_solutions_v_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_audience_split" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__solutions_v_blocks_audience_split_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__solutions_v_blocks_audience_split_eyebrow_icon";
  ALTER TABLE "_solutions_v_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_accordion_steps" ALTER COLUMN "eyebrow_icon" SET DATA TYPE "public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon" USING "eyebrow_icon"::"public"."enum__solutions_v_blocks_accordion_steps_eyebrow_icon";
  ALTER TABLE "_solutions_v_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon";
  CREATE TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v_blocks_accordion_steps" ALTER COLUMN "image_badge_icon" SET DATA TYPE "public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon" USING "image_badge_icon"::"public"."enum__solutions_v_blocks_accordion_steps_image_badge_icon";
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_cta_banner_variant";
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle', 'dark');
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum__solutions_v_blocks_cta_banner_variant";
  ALTER TABLE "_solutions_v_blocks_cta_banner" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__solutions_v_blocks_cta_banner_variant" USING "variant"::"public"."enum__solutions_v_blocks_cta_banner_variant";
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DATA TYPE text;
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum__solutions_v_version_icon";
  CREATE TYPE "public"."enum__solutions_v_version_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DEFAULT 'sparkles'::"public"."enum__solutions_v_version_icon";
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_icon" SET DATA TYPE "public"."enum__solutions_v_version_icon" USING "version_icon"::"public"."enum__solutions_v_version_icon";
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_specialist_roles_icon";
  CREATE TYPE "public"."enum_specialist_roles_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_specialist_roles_icon";
  ALTER TABLE "specialist_roles" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_specialist_roles_icon" USING "icon"::"public"."enum_specialist_roles_icon";
  ALTER TABLE "navigation_categories_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "navigation_categories_links" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_navigation_categories_links_icon";
  CREATE TYPE "public"."enum_navigation_categories_links_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "navigation_categories_links" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_navigation_categories_links_icon";
  ALTER TABLE "navigation_categories_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_navigation_categories_links_icon" USING "icon"::"public"."enum_navigation_categories_links_icon";
  ALTER TABLE "navigation_categories_highlights" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "navigation_categories_highlights" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_navigation_categories_highlights_icon";
  CREATE TYPE "public"."enum_navigation_categories_highlights_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "navigation_categories_highlights" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_navigation_categories_highlights_icon";
  ALTER TABLE "navigation_categories_highlights" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_navigation_categories_highlights_icon" USING "icon"::"public"."enum_navigation_categories_highlights_icon";
  ALTER TABLE "navigation_categories" ALTER COLUMN "card_icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_navigation_categories_card_icon";
  CREATE TYPE "public"."enum_navigation_categories_card_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "navigation_categories" ALTER COLUMN "card_icon" SET DATA TYPE "public"."enum_navigation_categories_card_icon" USING "card_icon"::"public"."enum_navigation_categories_card_icon";
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_site_settings_metrics_icon";
  CREATE TYPE "public"."enum_site_settings_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee');
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_site_settings_metrics_icon";
  ALTER TABLE "site_settings_metrics" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_site_settings_metrics_icon" USING "icon"::"public"."enum_site_settings_metrics_icon";
  DROP TYPE "public"."enum_partners_blocks_partner_hero_borda";
  DROP TYPE "public"."enum_partners_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum_partners_blocks_partner_hero_theme";
  DROP TYPE "public"."enum_partners_blocks_partner_split_right_column";
  DROP TYPE "public"."enum_partners_blocks_partner_split_borda";
  DROP TYPE "public"."enum_partners_blocks_partner_split_spacing";
  DROP TYPE "public"."enum_partners_blocks_partner_split_theme";
  DROP TYPE "public"."enum_pages_blocks_partner_hero_borda";
  DROP TYPE "public"."enum_pages_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum_pages_blocks_partner_hero_theme";
  DROP TYPE "public"."enum_pages_blocks_partner_split_right_column";
  DROP TYPE "public"."enum_pages_blocks_partner_split_borda";
  DROP TYPE "public"."enum_pages_blocks_partner_split_spacing";
  DROP TYPE "public"."enum_pages_blocks_partner_split_theme";
  DROP TYPE "public"."enum__pages_v_blocks_partner_hero_borda";
  DROP TYPE "public"."enum__pages_v_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_partner_hero_theme";
  DROP TYPE "public"."enum__pages_v_blocks_partner_split_right_column";
  DROP TYPE "public"."enum__pages_v_blocks_partner_split_borda";
  DROP TYPE "public"."enum__pages_v_blocks_partner_split_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_partner_split_theme";
  DROP TYPE "public"."enum_solutions_blocks_partner_hero_borda";
  DROP TYPE "public"."enum_solutions_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum_solutions_blocks_partner_hero_theme";
  DROP TYPE "public"."enum_solutions_blocks_partner_split_right_column";
  DROP TYPE "public"."enum_solutions_blocks_partner_split_borda";
  DROP TYPE "public"."enum_solutions_blocks_partner_split_spacing";
  DROP TYPE "public"."enum_solutions_blocks_partner_split_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_hero_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_hero_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_hero_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_split_right_column";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_split_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_split_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_split_theme";`)
}
