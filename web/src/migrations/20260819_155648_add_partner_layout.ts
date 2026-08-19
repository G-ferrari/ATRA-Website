import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  CREATE TYPE "public"."enum_partners_blocks_page_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_sticky_page_nav_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum_partners_blocks_stats_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum_partners_blocks_rich_text_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_variant" AS ENUM('compact', 'card');
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_header_width" AS ENUM('full', 'narrow');
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum_partners_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum_partners_blocks_value_cards_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_partner_showcase_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  CREATE TYPE "public"."enum_partners_blocks_cta_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "partners_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "partners_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_mode" "enum_partners_blocks_page_hero_media_mode" DEFAULT 'none',
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_page_hero_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_sticky_page_nav_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "partners_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_partners_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_stats_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "partners_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_partners_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_rich_text_section_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles'
  );
  
  CREATE TABLE "partners_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_partners_blocks_icon_card_grid_columns" DEFAULT '4',
  	"variant" "enum_partners_blocks_icon_card_grid_variant" DEFAULT 'compact',
  	"header_width" "enum_partners_blocks_icon_card_grid_header_width" DEFAULT 'full',
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_icon_card_grid_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum_partners_blocks_value_cards_items_glow_color" DEFAULT 'blue'
  );
  
  CREATE TABLE "partners_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_value_cards_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_value_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_partner_showcase_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"variant" "enum_partners_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_cta_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum_partners_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "partners_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer
  );
  
  ALTER TABLE "partners_blocks_page_hero_ctas" ADD CONSTRAINT "partners_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_page_hero_ctas_locales" ADD CONSTRAINT "partners_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_page_hero" ADD CONSTRAINT "partners_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_page_hero_locales" ADD CONSTRAINT "partners_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_sticky_page_nav" ADD CONSTRAINT "partners_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_sticky_page_nav_locales" ADD CONSTRAINT "partners_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_stats_grid_custom_items" ADD CONSTRAINT "partners_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "partners_blocks_stats_grid_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_stats_grid" ADD CONSTRAINT "partners_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_stats_grid_locales" ADD CONSTRAINT "partners_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_rich_text_section_ctas" ADD CONSTRAINT "partners_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "partners_blocks_rich_text_section_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_rich_text_section" ADD CONSTRAINT "partners_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_rich_text_section" ADD CONSTRAINT "partners_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_rich_text_section_locales" ADD CONSTRAINT "partners_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_icon_card_grid_items" ADD CONSTRAINT "partners_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "partners_blocks_icon_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_icon_card_grid" ADD CONSTRAINT "partners_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_icon_card_grid_locales" ADD CONSTRAINT "partners_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_value_cards_items" ADD CONSTRAINT "partners_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_value_cards_items_locales" ADD CONSTRAINT "partners_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_value_cards" ADD CONSTRAINT "partners_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_value_cards_locales" ADD CONSTRAINT "partners_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_showcase" ADD CONSTRAINT "partners_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_showcase_locales" ADD CONSTRAINT "partners_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_seals_banner" ADD CONSTRAINT "partners_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_seals_banner_locales" ADD CONSTRAINT "partners_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_process_steps_steps" ADD CONSTRAINT "partners_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_process_steps_steps_locales" ADD CONSTRAINT "partners_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_process_steps" ADD CONSTRAINT "partners_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_process_steps_locales" ADD CONSTRAINT "partners_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_cta_contact" ADD CONSTRAINT "partners_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_cta_contact_locales" ADD CONSTRAINT "partners_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_jobs_list" ADD CONSTRAINT "partners_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_jobs_list_locales" ADD CONSTRAINT "partners_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_cta_banner" ADD CONSTRAINT "partners_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_cta_banner_locales" ADD CONSTRAINT "partners_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_texts" ADD CONSTRAINT "partners_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_page_hero_ctas_order_idx" ON "partners_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "partners_blocks_page_hero_ctas_parent_id_idx" ON "partners_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_page_hero_ctas_locales_locale_parent_id_uniq" ON "partners_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_page_hero_order_idx" ON "partners_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "partners_blocks_page_hero_parent_id_idx" ON "partners_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_page_hero_path_idx" ON "partners_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_page_hero_locales_locale_parent_id_unique" ON "partners_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_sticky_page_nav_order_idx" ON "partners_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "partners_blocks_sticky_page_nav_parent_id_idx" ON "partners_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_sticky_page_nav_path_idx" ON "partners_blocks_sticky_page_nav" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_sticky_page_nav_locales_locale_parent_id_uni" ON "partners_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_stats_grid_custom_items_order_idx" ON "partners_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_stats_grid_custom_items_parent_id_idx" ON "partners_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_stats_grid_custom_items_locales_locale_paren" ON "partners_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_stats_grid_order_idx" ON "partners_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "partners_blocks_stats_grid_parent_id_idx" ON "partners_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_stats_grid_path_idx" ON "partners_blocks_stats_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_stats_grid_locales_locale_parent_id_unique" ON "partners_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_rich_text_section_ctas_order_idx" ON "partners_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "partners_blocks_rich_text_section_ctas_parent_id_idx" ON "partners_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_rich_text_section_ctas_locales_locale_parent" ON "partners_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_rich_text_section_order_idx" ON "partners_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "partners_blocks_rich_text_section_parent_id_idx" ON "partners_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_rich_text_section_path_idx" ON "partners_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "partners_blocks_rich_text_section_image_idx" ON "partners_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_rich_text_section_locales_locale_parent_id_u" ON "partners_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_icon_card_grid_items_order_idx" ON "partners_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_icon_card_grid_items_parent_id_idx" ON "partners_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_icon_card_grid_items_locales_locale_parent_i" ON "partners_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_icon_card_grid_order_idx" ON "partners_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "partners_blocks_icon_card_grid_parent_id_idx" ON "partners_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_icon_card_grid_path_idx" ON "partners_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_icon_card_grid_locales_locale_parent_id_uniq" ON "partners_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_value_cards_items_order_idx" ON "partners_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_value_cards_items_parent_id_idx" ON "partners_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_value_cards_items_locales_locale_parent_id_u" ON "partners_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_value_cards_order_idx" ON "partners_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "partners_blocks_value_cards_parent_id_idx" ON "partners_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_value_cards_path_idx" ON "partners_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_value_cards_locales_locale_parent_id_unique" ON "partners_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_partner_showcase_order_idx" ON "partners_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "partners_blocks_partner_showcase_parent_id_idx" ON "partners_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_partner_showcase_path_idx" ON "partners_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_partner_showcase_locales_locale_parent_id_un" ON "partners_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_seals_banner_order_idx" ON "partners_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "partners_blocks_seals_banner_parent_id_idx" ON "partners_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_seals_banner_path_idx" ON "partners_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_seals_banner_locales_locale_parent_id_unique" ON "partners_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_process_steps_steps_order_idx" ON "partners_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "partners_blocks_process_steps_steps_parent_id_idx" ON "partners_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_process_steps_steps_locales_locale_parent_id" ON "partners_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_process_steps_order_idx" ON "partners_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "partners_blocks_process_steps_parent_id_idx" ON "partners_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_process_steps_path_idx" ON "partners_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_process_steps_locales_locale_parent_id_uniqu" ON "partners_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_cta_contact_order_idx" ON "partners_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "partners_blocks_cta_contact_parent_id_idx" ON "partners_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_cta_contact_path_idx" ON "partners_blocks_cta_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_cta_contact_locales_locale_parent_id_unique" ON "partners_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_jobs_list_order_idx" ON "partners_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "partners_blocks_jobs_list_parent_id_idx" ON "partners_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_jobs_list_path_idx" ON "partners_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_jobs_list_locales_locale_parent_id_unique" ON "partners_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_cta_banner_order_idx" ON "partners_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "partners_blocks_cta_banner_parent_id_idx" ON "partners_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_cta_banner_path_idx" ON "partners_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_cta_banner_locales_locale_parent_id_unique" ON "partners_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_texts_order_parent" ON "partners_texts" USING btree ("order","parent_id");
  CREATE INDEX "partners_texts_locale_parent" ON "partners_texts" USING btree ("locale","parent_id");
  CREATE INDEX "partners_rels_order_idx" ON "partners_rels" USING btree ("order");
  CREATE INDEX "partners_rels_parent_idx" ON "partners_rels" USING btree ("parent_id");
  CREATE INDEX "partners_rels_path_idx" ON "partners_rels" USING btree ("path");
  CREATE INDEX "partners_rels_media_id_idx" ON "partners_rels" USING btree ("media_id");
  CREATE INDEX "partners_rels_partners_id_idx" ON "partners_rels" USING btree ("partners_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "partners_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "partners_blocks_page_hero" CASCADE;
  DROP TABLE "partners_blocks_page_hero_locales" CASCADE;
  DROP TABLE "partners_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "partners_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "partners_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "partners_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "partners_blocks_stats_grid" CASCADE;
  DROP TABLE "partners_blocks_stats_grid_locales" CASCADE;
  DROP TABLE "partners_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "partners_blocks_rich_text_section_ctas_locales" CASCADE;
  DROP TABLE "partners_blocks_rich_text_section" CASCADE;
  DROP TABLE "partners_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "partners_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "partners_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "partners_blocks_icon_card_grid" CASCADE;
  DROP TABLE "partners_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "partners_blocks_value_cards_items" CASCADE;
  DROP TABLE "partners_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "partners_blocks_value_cards" CASCADE;
  DROP TABLE "partners_blocks_value_cards_locales" CASCADE;
  DROP TABLE "partners_blocks_partner_showcase" CASCADE;
  DROP TABLE "partners_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "partners_blocks_seals_banner" CASCADE;
  DROP TABLE "partners_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "partners_blocks_process_steps_steps" CASCADE;
  DROP TABLE "partners_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "partners_blocks_process_steps" CASCADE;
  DROP TABLE "partners_blocks_process_steps_locales" CASCADE;
  DROP TABLE "partners_blocks_cta_contact" CASCADE;
  DROP TABLE "partners_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "partners_blocks_jobs_list" CASCADE;
  DROP TABLE "partners_blocks_jobs_list_locales" CASCADE;
  DROP TABLE "partners_blocks_cta_banner" CASCADE;
  DROP TABLE "partners_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "partners_texts" CASCADE;
  DROP TABLE "partners_rels" CASCADE;
  DROP TYPE "public"."enum_partners_blocks_page_hero_media_mode";
  DROP TYPE "public"."enum_partners_blocks_page_hero_borda";
  DROP TYPE "public"."enum_partners_blocks_page_hero_theme";
  DROP TYPE "public"."enum_partners_blocks_sticky_page_nav_borda";
  DROP TYPE "public"."enum_partners_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum_partners_blocks_stats_grid_source";
  DROP TYPE "public"."enum_partners_blocks_stats_grid_borda";
  DROP TYPE "public"."enum_partners_blocks_stats_grid_theme";
  DROP TYPE "public"."enum_partners_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum_partners_blocks_rich_text_section_borda";
  DROP TYPE "public"."enum_partners_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_variant";
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_header_width";
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_borda";
  DROP TYPE "public"."enum_partners_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum_partners_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum_partners_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum_partners_blocks_value_cards_borda";
  DROP TYPE "public"."enum_partners_blocks_value_cards_theme";
  DROP TYPE "public"."enum_partners_blocks_partner_showcase_borda";
  DROP TYPE "public"."enum_partners_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum_partners_blocks_seals_banner_borda";
  DROP TYPE "public"."enum_partners_blocks_seals_banner_theme";
  DROP TYPE "public"."enum_partners_blocks_process_steps_borda";
  DROP TYPE "public"."enum_partners_blocks_process_steps_theme";
  DROP TYPE "public"."enum_partners_blocks_cta_contact_borda";
  DROP TYPE "public"."enum_partners_blocks_cta_contact_theme";
  DROP TYPE "public"."enum_partners_blocks_jobs_list_borda";
  DROP TYPE "public"."enum_partners_blocks_jobs_list_theme";
  DROP TYPE "public"."enum_partners_blocks_cta_banner_variant";
  DROP TYPE "public"."enum_partners_blocks_cta_banner_borda";
  DROP TYPE "public"."enum_partners_blocks_cta_banner_theme";`)
}
