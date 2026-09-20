import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_section_image_position" AS ENUM('left', 'right', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_section_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_showcase_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_variant" AS ENUM('primary', 'subtle');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('pt', 'en');
  CREATE TYPE "public"."enum_site_settings_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TABLE "pages_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles'
  );
  
  CREATE TABLE "pages_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_icon_card_grid_columns" DEFAULT '4',
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum_pages_blocks_value_cards_items_glow_color" DEFAULT 'blue'
  );
  
  CREATE TABLE "pages_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_value_cards_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"variant" "enum_pages_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_page_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_page_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_sticky_page_nav_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_grid_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_grid_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_stats_grid_source" DEFAULT 'siteSettings',
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_stats_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_rich_text_section_image_position" DEFAULT 'right',
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_rich_text_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_section_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_icon_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_icon_card_grid_items_icon" DEFAULT 'sparkles',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_card_grid_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_icon_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_icon_card_grid_columns" DEFAULT '4',
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_icon_card_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_card_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_value_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_value_cards_items_icon" DEFAULT 'sparkles',
  	"glow_color" "enum__pages_v_blocks_value_cards_items_glow_color" DEFAULT 'blue',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_value_cards_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_value_cards_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_value_cards_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partner_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"grayscale" boolean DEFAULT true,
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_partner_showcase_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partner_showcase_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"variant" "enum__pages_v_blocks_cta_banner_variant" DEFAULT 'primary',
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_cta_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner_locales" (
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"partners_id" integer
  );
  
  CREATE TABLE "site_settings_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"icon" "enum_site_settings_metrics_icon" DEFAULT 'sparkles'
  );
  
  CREATE TABLE "site_settings_metrics_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"founded_year" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "pages_blocks_page_hero_ctas" ADD CONSTRAINT "pages_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_ctas_locales" ADD CONSTRAINT "pages_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero_locales" ADD CONSTRAINT "pages_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_page_nav" ADD CONSTRAINT "pages_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid_custom_items" ADD CONSTRAINT "pages_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "pages_blocks_stats_grid_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid" ADD CONSTRAINT "pages_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_section" ADD CONSTRAINT "pages_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_section" ADD CONSTRAINT "pages_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_section_locales" ADD CONSTRAINT "pages_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_card_grid_items" ADD CONSTRAINT "pages_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "pages_blocks_icon_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_card_grid" ADD CONSTRAINT "pages_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_card_grid_locales" ADD CONSTRAINT "pages_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_items" ADD CONSTRAINT "pages_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_items_locales" ADD CONSTRAINT "pages_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards" ADD CONSTRAINT "pages_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_locales" ADD CONSTRAINT "pages_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_showcase" ADD CONSTRAINT "pages_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_showcase_locales" ADD CONSTRAINT "pages_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD CONSTRAINT "pages_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_ctas" ADD CONSTRAINT "_pages_v_blocks_page_hero_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_ctas_locales" ADD CONSTRAINT "_pages_v_blocks_page_hero_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero_locales" ADD CONSTRAINT "_pages_v_blocks_page_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" ADD CONSTRAINT "_pages_v_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid_custom_items" ADD CONSTRAINT "_pages_v_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_grid_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid" ADD CONSTRAINT "_pages_v_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_section" ADD CONSTRAINT "_pages_v_blocks_rich_text_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_section" ADD CONSTRAINT "_pages_v_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_section_locales" ADD CONSTRAINT "_pages_v_blocks_rich_text_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" ADD CONSTRAINT "_pages_v_blocks_icon_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items_locales" ADD CONSTRAINT "_pages_v_blocks_icon_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_icon_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_card_grid" ADD CONSTRAINT "_pages_v_blocks_icon_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_locales" ADD CONSTRAINT "_pages_v_blocks_icon_card_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_icon_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_items" ADD CONSTRAINT "_pages_v_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_items_locales" ADD CONSTRAINT "_pages_v_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards" ADD CONSTRAINT "_pages_v_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_locales" ADD CONSTRAINT "_pages_v_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_showcase" ADD CONSTRAINT "_pages_v_blocks_partner_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_showcase_locales" ADD CONSTRAINT "_pages_v_blocks_partner_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD CONSTRAINT "_pages_v_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_metrics" ADD CONSTRAINT "site_settings_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_metrics_locales" ADD CONSTRAINT "site_settings_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_metrics"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_hero_ctas_order_idx" ON "pages_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_ctas_parent_id_idx" ON "pages_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_page_hero_ctas_locales_locale_parent_id_unique" ON "pages_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_page_hero_order_idx" ON "pages_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_parent_id_idx" ON "pages_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_path_idx" ON "pages_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_page_hero_locales_locale_parent_id_unique" ON "pages_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_sticky_page_nav_order_idx" ON "pages_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "pages_blocks_sticky_page_nav_parent_id_idx" ON "pages_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sticky_page_nav_path_idx" ON "pages_blocks_sticky_page_nav" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_grid_custom_items_order_idx" ON "pages_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_grid_custom_items_parent_id_idx" ON "pages_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_grid_custom_items_locales_locale_parent_i" ON "pages_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_grid_order_idx" ON "pages_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_grid_parent_id_idx" ON "pages_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_grid_path_idx" ON "pages_blocks_stats_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_section_order_idx" ON "pages_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_section_parent_id_idx" ON "pages_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_section_path_idx" ON "pages_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_section_image_idx" ON "pages_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_section_locales_locale_parent_id_uniq" ON "pages_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_icon_card_grid_items_order_idx" ON "pages_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_card_grid_items_parent_id_idx" ON "pages_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_icon_card_grid_items_locales_locale_parent_id_u" ON "pages_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_icon_card_grid_order_idx" ON "pages_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_card_grid_parent_id_idx" ON "pages_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_card_grid_path_idx" ON "pages_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_icon_card_grid_locales_locale_parent_id_unique" ON "pages_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_value_cards_items_order_idx" ON "pages_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_cards_items_parent_id_idx" ON "pages_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_value_cards_items_locales_locale_parent_id_uniq" ON "pages_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_value_cards_order_idx" ON "pages_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_cards_parent_id_idx" ON "pages_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_value_cards_path_idx" ON "pages_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_value_cards_locales_locale_parent_id_unique" ON "pages_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partner_showcase_order_idx" ON "pages_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_showcase_parent_id_idx" ON "pages_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partner_showcase_path_idx" ON "pages_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_partner_showcase_locales_locale_parent_id_uniqu" ON "pages_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_banner_locales_locale_parent_id_unique" ON "pages_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_partners_id_idx" ON "pages_rels" USING btree ("partners_id");
  CREATE INDEX "_pages_v_blocks_page_hero_ctas_order_idx" ON "_pages_v_blocks_page_hero_ctas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_ctas_parent_id_idx" ON "_pages_v_blocks_page_hero_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_hero_ctas_locales_locale_parent_id_uniq" ON "_pages_v_blocks_page_hero_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_order_idx" ON "_pages_v_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_parent_id_idx" ON "_pages_v_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_path_idx" ON "_pages_v_blocks_page_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_page_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_page_nav_order_idx" ON "_pages_v_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sticky_page_nav_parent_id_idx" ON "_pages_v_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_page_nav_path_idx" ON "_pages_v_blocks_sticky_page_nav" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_grid_custom_items_order_idx" ON "_pages_v_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_grid_custom_items_parent_id_idx" ON "_pages_v_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_grid_custom_items_locales_locale_paren" ON "_pages_v_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_grid_order_idx" ON "_pages_v_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_grid_parent_id_idx" ON "_pages_v_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_grid_path_idx" ON "_pages_v_blocks_stats_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_section_order_idx" ON "_pages_v_blocks_rich_text_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_section_parent_id_idx" ON "_pages_v_blocks_rich_text_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_section_path_idx" ON "_pages_v_blocks_rich_text_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_section_image_idx" ON "_pages_v_blocks_rich_text_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_text_section_locales_locale_parent_id_u" ON "_pages_v_blocks_rich_text_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_card_grid_items_order_idx" ON "_pages_v_blocks_icon_card_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_card_grid_items_parent_id_idx" ON "_pages_v_blocks_icon_card_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_icon_card_grid_items_locales_locale_parent_i" ON "_pages_v_blocks_icon_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_card_grid_order_idx" ON "_pages_v_blocks_icon_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_card_grid_parent_id_idx" ON "_pages_v_blocks_icon_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_card_grid_path_idx" ON "_pages_v_blocks_icon_card_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_icon_card_grid_locales_locale_parent_id_uniq" ON "_pages_v_blocks_icon_card_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_value_cards_items_order_idx" ON "_pages_v_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_cards_items_parent_id_idx" ON "_pages_v_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_cards_items_locales_locale_parent_id_u" ON "_pages_v_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_value_cards_order_idx" ON "_pages_v_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_cards_parent_id_idx" ON "_pages_v_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_value_cards_path_idx" ON "_pages_v_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_showcase_order_idx" ON "_pages_v_blocks_partner_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partner_showcase_parent_id_idx" ON "_pages_v_blocks_partner_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partner_showcase_path_idx" ON "_pages_v_blocks_partner_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_partner_showcase_locales_locale_parent_id_un" ON "_pages_v_blocks_partner_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_banner_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_partners_id_idx" ON "_pages_v_rels" USING btree ("partners_id");
  CREATE INDEX "site_settings_metrics_order_idx" ON "site_settings_metrics" USING btree ("_order");
  CREATE INDEX "site_settings_metrics_parent_id_idx" ON "site_settings_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_metrics_locales_locale_parent_id_unique" ON "site_settings_metrics_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_page_hero_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_hero_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_sticky_page_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_grid_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_grid_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_card_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_card_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partner_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partner_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_hero_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_hero_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_grid_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_grid_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_cards_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_partner_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_partner_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_metrics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "pages_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "pages_blocks_page_hero" CASCADE;
  DROP TABLE "pages_blocks_page_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "pages_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "pages_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_grid" CASCADE;
  DROP TABLE "pages_blocks_rich_text_section" CASCADE;
  DROP TABLE "pages_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "pages_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "pages_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "pages_blocks_icon_card_grid" CASCADE;
  DROP TABLE "pages_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_value_cards_items" CASCADE;
  DROP TABLE "pages_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "pages_blocks_value_cards" CASCADE;
  DROP TABLE "pages_blocks_value_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_partner_showcase" CASCADE;
  DROP TABLE "pages_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "pages_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_ctas" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_ctas_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_section" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_card_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_card_grid_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_card_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_partner_showcase_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "site_settings_metrics" CASCADE;
  DROP TABLE "site_settings_metrics_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_pages_blocks_page_hero_theme";
  DROP TYPE "public"."enum_pages_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum_pages_blocks_stats_grid_source";
  DROP TYPE "public"."enum_pages_blocks_stats_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum_pages_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum_pages_blocks_value_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_theme";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_theme";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum__pages_v_blocks_stats_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_stats_grid_theme";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_section_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_section_theme";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_theme";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_theme";
  DROP TYPE "public"."enum__pages_v_blocks_partner_showcase_theme";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_theme";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_site_settings_metrics_icon";`)
}
