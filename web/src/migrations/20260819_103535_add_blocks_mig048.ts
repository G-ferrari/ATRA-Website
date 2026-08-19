import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_page_nav_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_grid_source" AS ENUM('siteSettings', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_items_glow_color" AS ENUM('blue', 'orange');
  CREATE TYPE "public"."enum__pages_v_blocks_value_cards_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_site_settings_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
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
  
  CREATE TABLE "pages_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum_pages_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_seals_banner_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
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
  
  CREATE TABLE "_pages_v_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"theme" "enum__pages_v_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seals_banner_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "site_settings_seals" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"founded_year" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_sticky_page_nav" ADD CONSTRAINT "pages_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid_custom_items" ADD CONSTRAINT "pages_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "pages_blocks_stats_grid_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid" ADD CONSTRAINT "pages_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_items" ADD CONSTRAINT "pages_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_items_locales" ADD CONSTRAINT "pages_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards" ADD CONSTRAINT "pages_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_cards_locales" ADD CONSTRAINT "pages_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seals_banner" ADD CONSTRAINT "pages_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seals_banner_locales" ADD CONSTRAINT "pages_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_page_nav" ADD CONSTRAINT "_pages_v_blocks_sticky_page_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid_custom_items" ADD CONSTRAINT "_pages_v_blocks_stats_grid_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid_custom_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_grid_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_grid_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid" ADD CONSTRAINT "_pages_v_blocks_stats_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_items" ADD CONSTRAINT "_pages_v_blocks_value_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_items_locales" ADD CONSTRAINT "_pages_v_blocks_value_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards" ADD CONSTRAINT "_pages_v_blocks_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_cards_locales" ADD CONSTRAINT "_pages_v_blocks_value_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seals_banner" ADD CONSTRAINT "_pages_v_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seals_banner_locales" ADD CONSTRAINT "_pages_v_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_metrics" ADD CONSTRAINT "site_settings_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_metrics_locales" ADD CONSTRAINT "site_settings_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_seals" ADD CONSTRAINT "site_settings_seals_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_seals" ADD CONSTRAINT "site_settings_seals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_sticky_page_nav_order_idx" ON "pages_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "pages_blocks_sticky_page_nav_parent_id_idx" ON "pages_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sticky_page_nav_path_idx" ON "pages_blocks_sticky_page_nav" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_grid_custom_items_order_idx" ON "pages_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_grid_custom_items_parent_id_idx" ON "pages_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_grid_custom_items_locales_locale_parent_i" ON "pages_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_grid_order_idx" ON "pages_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_grid_parent_id_idx" ON "pages_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_grid_path_idx" ON "pages_blocks_stats_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_value_cards_items_order_idx" ON "pages_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_cards_items_parent_id_idx" ON "pages_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_value_cards_items_locales_locale_parent_id_uniq" ON "pages_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_value_cards_order_idx" ON "pages_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_cards_parent_id_idx" ON "pages_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_value_cards_path_idx" ON "pages_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_value_cards_locales_locale_parent_id_unique" ON "pages_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_seals_banner_order_idx" ON "pages_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_seals_banner_parent_id_idx" ON "pages_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seals_banner_path_idx" ON "pages_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_seals_banner_locales_locale_parent_id_unique" ON "pages_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_page_nav_order_idx" ON "_pages_v_blocks_sticky_page_nav" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sticky_page_nav_parent_id_idx" ON "_pages_v_blocks_sticky_page_nav" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_page_nav_path_idx" ON "_pages_v_blocks_sticky_page_nav" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_grid_custom_items_order_idx" ON "_pages_v_blocks_stats_grid_custom_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_grid_custom_items_parent_id_idx" ON "_pages_v_blocks_stats_grid_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_grid_custom_items_locales_locale_paren" ON "_pages_v_blocks_stats_grid_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_grid_order_idx" ON "_pages_v_blocks_stats_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_grid_parent_id_idx" ON "_pages_v_blocks_stats_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_grid_path_idx" ON "_pages_v_blocks_stats_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_value_cards_items_order_idx" ON "_pages_v_blocks_value_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_cards_items_parent_id_idx" ON "_pages_v_blocks_value_cards_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_cards_items_locales_locale_parent_id_u" ON "_pages_v_blocks_value_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_value_cards_order_idx" ON "_pages_v_blocks_value_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_cards_parent_id_idx" ON "_pages_v_blocks_value_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_value_cards_path_idx" ON "_pages_v_blocks_value_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_value_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_seals_banner_order_idx" ON "_pages_v_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seals_banner_parent_id_idx" ON "_pages_v_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seals_banner_path_idx" ON "_pages_v_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_seals_banner_locales_locale_parent_id_unique" ON "_pages_v_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_metrics_order_idx" ON "site_settings_metrics" USING btree ("_order");
  CREATE INDEX "site_settings_metrics_parent_id_idx" ON "site_settings_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_metrics_locales_locale_parent_id_unique" ON "site_settings_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_seals_order_idx" ON "site_settings_seals" USING btree ("_order");
  CREATE INDEX "site_settings_seals_parent_id_idx" ON "site_settings_seals" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seals_image_idx" ON "site_settings_seals" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "pages_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "pages_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_grid" CASCADE;
  DROP TABLE "pages_blocks_value_cards_items" CASCADE;
  DROP TABLE "pages_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "pages_blocks_value_cards" CASCADE;
  DROP TABLE "pages_blocks_value_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_seals_banner" CASCADE;
  DROP TABLE "pages_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_page_nav" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid_custom_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid_custom_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_value_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_seals_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "site_settings_metrics" CASCADE;
  DROP TABLE "site_settings_metrics_locales" CASCADE;
  DROP TABLE "site_settings_seals" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum_pages_blocks_stats_grid_source";
  DROP TYPE "public"."enum_pages_blocks_stats_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum_pages_blocks_value_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_seals_banner_theme";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_page_nav_theme";
  DROP TYPE "public"."enum__pages_v_blocks_stats_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_stats_grid_theme";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_items_glow_color";
  DROP TYPE "public"."enum__pages_v_blocks_value_cards_theme";
  DROP TYPE "public"."enum__pages_v_blocks_seals_banner_theme";
  DROP TYPE "public"."enum_site_settings_metrics_icon";`)
}
