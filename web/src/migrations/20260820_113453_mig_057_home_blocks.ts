import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_partners_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_pages_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_solutions_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_hero_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_hero_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_hero_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_logo_marquee_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_logo_marquee_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_logo_marquee_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_feature_tabs_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__solutions_v_blocks_feature_tabs_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_feature_tabs_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_feature_tabs_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "partners_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false
  );
  
  CREATE TABLE "partners_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer
  );
  
  CREATE TABLE "partners_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false
  );
  
  CREATE TABLE "solutions_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer
  );
  
  CREATE TABLE "solutions_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_home_hero_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_home_hero_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_home_hero_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_home_hero_locales" (
  	"title_prefix" varchar,
  	"description" varchar,
  	"scroll_label" varchar,
  	"prompt_title" varchar,
  	"prompt_placeholder" varchar,
  	"prompt_disclaimer" varchar,
  	"prompt_clients_title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_logo_marquee_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_logo_marquee_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_logo_marquee_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_logo_marquee_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_feature_tabs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_feature_tabs_items_icon" DEFAULT 'sparkles',
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_feature_tabs_items_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_feature_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_feature_tabs_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_feature_tabs_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_feature_tabs_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_feature_tabs_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "partners_blocks_home_hero_prompt_clients" ADD CONSTRAINT "partners_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_hero_prompt_clients" ADD CONSTRAINT "partners_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_hero" ADD CONSTRAINT "partners_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_hero_locales" ADD CONSTRAINT "partners_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_logo_marquee" ADD CONSTRAINT "partners_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_logo_marquee_locales" ADD CONSTRAINT "partners_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_feature_tabs_items" ADD CONSTRAINT "partners_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_feature_tabs_items" ADD CONSTRAINT "partners_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_feature_tabs_items_locales" ADD CONSTRAINT "partners_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_feature_tabs" ADD CONSTRAINT "partners_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_feature_tabs_locales" ADD CONSTRAINT "partners_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_prompt_clients" ADD CONSTRAINT "pages_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_prompt_clients" ADD CONSTRAINT "pages_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_locales" ADD CONSTRAINT "pages_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee" ADD CONSTRAINT "pages_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_locales" ADD CONSTRAINT "pages_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tabs_items" ADD CONSTRAINT "pages_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tabs_items" ADD CONSTRAINT "pages_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tabs_items_locales" ADD CONSTRAINT "pages_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tabs" ADD CONSTRAINT "pages_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tabs_locales" ADD CONSTRAINT "pages_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_pages_v_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_pages_v_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_locales" ADD CONSTRAINT "_pages_v_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_locales" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tabs_items" ADD CONSTRAINT "_pages_v_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tabs_items" ADD CONSTRAINT "_pages_v_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tabs_items_locales" ADD CONSTRAINT "_pages_v_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tabs" ADD CONSTRAINT "_pages_v_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tabs_locales" ADD CONSTRAINT "_pages_v_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_hero_prompt_clients" ADD CONSTRAINT "solutions_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_hero_prompt_clients" ADD CONSTRAINT "solutions_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_hero" ADD CONSTRAINT "solutions_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_hero_locales" ADD CONSTRAINT "solutions_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_logo_marquee" ADD CONSTRAINT "solutions_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_logo_marquee_locales" ADD CONSTRAINT "solutions_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_feature_tabs_items" ADD CONSTRAINT "solutions_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_feature_tabs_items" ADD CONSTRAINT "solutions_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_feature_tabs_items_locales" ADD CONSTRAINT "solutions_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_feature_tabs" ADD CONSTRAINT "solutions_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_feature_tabs_locales" ADD CONSTRAINT "solutions_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_solutions_v_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_solutions_v_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_hero" ADD CONSTRAINT "_solutions_v_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_hero_locales" ADD CONSTRAINT "_solutions_v_blocks_home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_logo_marquee" ADD CONSTRAINT "_solutions_v_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_logo_marquee_locales" ADD CONSTRAINT "_solutions_v_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_feature_tabs_items" ADD CONSTRAINT "_solutions_v_blocks_feature_tabs_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_feature_tabs_items" ADD CONSTRAINT "_solutions_v_blocks_feature_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_feature_tabs_items_locales" ADD CONSTRAINT "_solutions_v_blocks_feature_tabs_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_feature_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_feature_tabs" ADD CONSTRAINT "_solutions_v_blocks_feature_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_feature_tabs_locales" ADD CONSTRAINT "_solutions_v_blocks_feature_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_feature_tabs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_home_hero_prompt_clients_order_idx" ON "partners_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "partners_blocks_home_hero_prompt_clients_parent_id_idx" ON "partners_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_home_hero_prompt_clients_logo_idx" ON "partners_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "partners_blocks_home_hero_order_idx" ON "partners_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "partners_blocks_home_hero_parent_id_idx" ON "partners_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_home_hero_path_idx" ON "partners_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_home_hero_locales_locale_parent_id_unique" ON "partners_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_logo_marquee_order_idx" ON "partners_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "partners_blocks_logo_marquee_parent_id_idx" ON "partners_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_logo_marquee_path_idx" ON "partners_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_logo_marquee_locales_locale_parent_id_unique" ON "partners_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_feature_tabs_items_order_idx" ON "partners_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_feature_tabs_items_parent_id_idx" ON "partners_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_feature_tabs_items_image_idx" ON "partners_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_feature_tabs_items_locales_locale_parent_id_" ON "partners_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_feature_tabs_order_idx" ON "partners_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "partners_blocks_feature_tabs_parent_id_idx" ON "partners_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_feature_tabs_path_idx" ON "partners_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_feature_tabs_locales_locale_parent_id_unique" ON "partners_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_home_hero_prompt_clients_order_idx" ON "pages_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_prompt_clients_parent_id_idx" ON "pages_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_prompt_clients_logo_idx" ON "pages_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_home_hero_order_idx" ON "pages_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_parent_id_idx" ON "pages_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_path_idx" ON "pages_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_home_hero_locales_locale_parent_id_unique" ON "pages_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_order_idx" ON "pages_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_marquee_parent_id_idx" ON "pages_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_path_idx" ON "pages_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_logo_marquee_locales_locale_parent_id_unique" ON "pages_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_tabs_items_order_idx" ON "pages_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_tabs_items_parent_id_idx" ON "pages_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_tabs_items_image_idx" ON "pages_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_tabs_items_locales_locale_parent_id_uni" ON "pages_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_tabs_order_idx" ON "pages_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_tabs_parent_id_idx" ON "pages_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_tabs_path_idx" ON "pages_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_feature_tabs_locales_locale_parent_id_unique" ON "pages_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_prompt_clients_order_idx" ON "_pages_v_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_prompt_clients_parent_id_idx" ON "_pages_v_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_prompt_clients_logo_idx" ON "_pages_v_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_home_hero_order_idx" ON "_pages_v_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_parent_id_idx" ON "_pages_v_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_path_idx" ON "_pages_v_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_home_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_order_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_marquee_parent_id_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_path_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_logo_marquee_locales_locale_parent_id_unique" ON "_pages_v_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tabs_items_order_idx" ON "_pages_v_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_tabs_items_parent_id_idx" ON "_pages_v_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tabs_items_image_idx" ON "_pages_v_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_tabs_items_locales_locale_parent_id_" ON "_pages_v_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tabs_order_idx" ON "_pages_v_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_tabs_parent_id_idx" ON "_pages_v_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tabs_path_idx" ON "_pages_v_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_tabs_locales_locale_parent_id_unique" ON "_pages_v_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_home_hero_prompt_clients_order_idx" ON "solutions_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "solutions_blocks_home_hero_prompt_clients_parent_id_idx" ON "solutions_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_home_hero_prompt_clients_logo_idx" ON "solutions_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "solutions_blocks_home_hero_order_idx" ON "solutions_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "solutions_blocks_home_hero_parent_id_idx" ON "solutions_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_home_hero_path_idx" ON "solutions_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_home_hero_locales_locale_parent_id_unique" ON "solutions_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_logo_marquee_order_idx" ON "solutions_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "solutions_blocks_logo_marquee_parent_id_idx" ON "solutions_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_logo_marquee_path_idx" ON "solutions_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_logo_marquee_locales_locale_parent_id_uniqu" ON "solutions_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_feature_tabs_items_order_idx" ON "solutions_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_feature_tabs_items_parent_id_idx" ON "solutions_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_feature_tabs_items_image_idx" ON "solutions_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_feature_tabs_items_locales_locale_parent_id" ON "solutions_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_feature_tabs_order_idx" ON "solutions_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "solutions_blocks_feature_tabs_parent_id_idx" ON "solutions_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_feature_tabs_path_idx" ON "solutions_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_feature_tabs_locales_locale_parent_id_uniqu" ON "solutions_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_hero_prompt_clients_order_idx" ON "_solutions_v_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_home_hero_prompt_clients_parent_id_idx" ON "_solutions_v_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_hero_prompt_clients_logo_idx" ON "_solutions_v_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "_solutions_v_blocks_home_hero_order_idx" ON "_solutions_v_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_home_hero_parent_id_idx" ON "_solutions_v_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_hero_path_idx" ON "_solutions_v_blocks_home_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_home_hero_locales_locale_parent_id_uniqu" ON "_solutions_v_blocks_home_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_logo_marquee_order_idx" ON "_solutions_v_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_logo_marquee_parent_id_idx" ON "_solutions_v_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_logo_marquee_path_idx" ON "_solutions_v_blocks_logo_marquee" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_logo_marquee_locales_locale_parent_id_un" ON "_solutions_v_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_feature_tabs_items_order_idx" ON "_solutions_v_blocks_feature_tabs_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_feature_tabs_items_parent_id_idx" ON "_solutions_v_blocks_feature_tabs_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_feature_tabs_items_image_idx" ON "_solutions_v_blocks_feature_tabs_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_feature_tabs_items_locales_locale_parent" ON "_solutions_v_blocks_feature_tabs_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_feature_tabs_order_idx" ON "_solutions_v_blocks_feature_tabs" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_feature_tabs_parent_id_idx" ON "_solutions_v_blocks_feature_tabs" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_feature_tabs_path_idx" ON "_solutions_v_blocks_feature_tabs" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_feature_tabs_locales_locale_parent_id_un" ON "_solutions_v_blocks_feature_tabs_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "partners_blocks_home_hero" CASCADE;
  DROP TABLE "partners_blocks_home_hero_locales" CASCADE;
  DROP TABLE "partners_blocks_logo_marquee" CASCADE;
  DROP TABLE "partners_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "partners_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "partners_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "partners_blocks_feature_tabs" CASCADE;
  DROP TABLE "partners_blocks_feature_tabs_locales" CASCADE;
  DROP TABLE "pages_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "pages_blocks_home_hero" CASCADE;
  DROP TABLE "pages_blocks_home_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "pages_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_tabs" CASCADE;
  DROP TABLE "pages_blocks_feature_tabs_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tabs_locales" CASCADE;
  DROP TABLE "solutions_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "solutions_blocks_home_hero" CASCADE;
  DROP TABLE "solutions_blocks_home_hero_locales" CASCADE;
  DROP TABLE "solutions_blocks_logo_marquee" CASCADE;
  DROP TABLE "solutions_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "solutions_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "solutions_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_feature_tabs" CASCADE;
  DROP TABLE "solutions_blocks_feature_tabs_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_hero" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_hero_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_logo_marquee" CASCADE;
  DROP TABLE "_solutions_v_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_feature_tabs_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_feature_tabs_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_feature_tabs" CASCADE;
  DROP TABLE "_solutions_v_blocks_feature_tabs_locales" CASCADE;
  DROP TYPE "public"."enum_partners_blocks_home_hero_borda";
  DROP TYPE "public"."enum_partners_blocks_home_hero_spacing";
  DROP TYPE "public"."enum_partners_blocks_home_hero_theme";
  DROP TYPE "public"."enum_partners_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum_partners_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum_partners_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum_partners_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum_partners_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum_partners_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum_partners_blocks_feature_tabs_theme";
  DROP TYPE "public"."enum_pages_blocks_home_hero_borda";
  DROP TYPE "public"."enum_pages_blocks_home_hero_spacing";
  DROP TYPE "public"."enum_pages_blocks_home_hero_theme";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum_pages_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum_pages_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum_pages_blocks_feature_tabs_theme";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_borda";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_theme";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tabs_theme";
  DROP TYPE "public"."enum_solutions_blocks_home_hero_borda";
  DROP TYPE "public"."enum_solutions_blocks_home_hero_spacing";
  DROP TYPE "public"."enum_solutions_blocks_home_hero_theme";
  DROP TYPE "public"."enum_solutions_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum_solutions_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum_solutions_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum_solutions_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum_solutions_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum_solutions_blocks_feature_tabs_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_home_hero_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_home_hero_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_home_hero_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_logo_marquee_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_logo_marquee_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_logo_marquee_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_feature_tabs_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_feature_tabs_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_feature_tabs_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_feature_tabs_theme";`)
}
