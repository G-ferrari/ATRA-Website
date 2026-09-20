import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_partners_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_partners_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_partners_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_partners_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum_partners_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_pages_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_pages_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_pages_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum_pages_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__pages_v_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__pages_v_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__pages_v_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum__pages_v_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_solutions_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_solutions_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_solutions_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_solutions_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum_solutions_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_bento_metrics_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_bento_metrics_color" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_bento_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_bento_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_home_bento_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_case_carousel_items_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__solutions_v_blocks_case_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_case_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_case_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_testimonial_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_testimonial_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_testimonial_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_content_teaser_cards_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__solutions_v_blocks_content_teaser_cards_column" AS ENUM('first', 'second');
  CREATE TYPE "public"."enum__solutions_v_blocks_content_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_content_teaser_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_content_teaser_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "partners_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "partners_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum_partners_blocks_home_bento_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "partners_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar
  );
  
  CREATE TABLE "partners_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "partners_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum_partners_blocks_content_teaser_cards_column" DEFAULT 'first'
  );
  
  CREATE TABLE "partners_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum_pages_blocks_home_bento_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar
  );
  
  CREATE TABLE "pages_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum_pages_blocks_content_teaser_cards_column" DEFAULT 'first'
  );
  
  CREATE TABLE "pages_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum__pages_v_blocks_home_bento_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum__pages_v_blocks_content_teaser_cards_column" DEFAULT 'first',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "solutions_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum_solutions_blocks_home_bento_metrics_color" DEFAULT 'primary'
  );
  
  CREATE TABLE "solutions_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar
  );
  
  CREATE TABLE "solutions_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "solutions_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_solutions_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum_solutions_blocks_content_teaser_cards_column" DEFAULT 'first'
  );
  
  CREATE TABLE "solutions_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_home_bento_partner_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_home_bento_partner_card_items_locales" (
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_home_bento_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_home_bento_metrics_icon" DEFAULT 'sparkles',
  	"value" varchar,
  	"color" "enum__solutions_v_blocks_home_bento_metrics_color" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_home_bento_metrics_locales" (
  	"tag" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_home_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"seals_card_counter" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_home_bento_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_home_bento_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_home_bento_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_home_bento_locales" (
  	"partner_card_eyebrow" varchar,
  	"partner_card_title" varchar,
  	"partner_card_description" varchar,
  	"seals_card_eyebrow" varchar,
  	"seals_card_title" varchar,
  	"seals_card_description" varchar,
  	"seals_card_badge" varchar,
  	"seals_card_footnote" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_case_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_case_carousel_items_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_case_carousel_items_locales" (
  	"company" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_case_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_case_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_case_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_case_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_case_carousel_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"read_label" varchar,
  	"cta_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_testimonial_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_testimonial_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_testimonial_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_testimonial_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_content_teaser_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__solutions_v_blocks_content_teaser_cards_icon" DEFAULT 'sparkles',
  	"href" varchar,
  	"image_id" integer,
  	"column" "enum__solutions_v_blocks_content_teaser_cards_column" DEFAULT 'first',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_content_teaser_cards_locales" (
  	"category" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_content_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_href" varchar,
  	"featured_image_id" integer,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_content_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_content_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_content_teaser_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_content_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"featured_category" varchar,
  	"featured_title" varchar,
  	"featured_cta_label" varchar,
  	"newsletter_title" varchar,
  	"newsletter_placeholder" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "partners_blocks_home_bento_partner_card_items" ADD CONSTRAINT "partners_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_bento_partner_card_items" ADD CONSTRAINT "partners_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "partners_blocks_home_bento_partner_card_items_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_bento_metrics" ADD CONSTRAINT "partners_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_bento_metrics_locales" ADD CONSTRAINT "partners_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_bento" ADD CONSTRAINT "partners_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_bento_locales" ADD CONSTRAINT "partners_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_case_carousel_items" ADD CONSTRAINT "partners_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_case_carousel_items" ADD CONSTRAINT "partners_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_case_carousel_items_locales" ADD CONSTRAINT "partners_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_case_carousel" ADD CONSTRAINT "partners_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_case_carousel_locales" ADD CONSTRAINT "partners_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_items" ADD CONSTRAINT "partners_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_items" ADD CONSTRAINT "partners_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "partners_blocks_testimonial_carousel_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel" ADD CONSTRAINT "partners_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_locales" ADD CONSTRAINT "partners_blocks_testimonial_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_content_teaser_cards" ADD CONSTRAINT "partners_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_content_teaser_cards" ADD CONSTRAINT "partners_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_content_teaser_cards_locales" ADD CONSTRAINT "partners_blocks_content_teaser_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_content_teaser" ADD CONSTRAINT "partners_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_content_teaser" ADD CONSTRAINT "partners_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_content_teaser_locales" ADD CONSTRAINT "partners_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento_partner_card_items" ADD CONSTRAINT "pages_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento_partner_card_items" ADD CONSTRAINT "pages_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "pages_blocks_home_bento_partner_card_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento_metrics" ADD CONSTRAINT "pages_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento_metrics_locales" ADD CONSTRAINT "pages_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento" ADD CONSTRAINT "pages_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_bento_locales" ADD CONSTRAINT "pages_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_carousel_items" ADD CONSTRAINT "pages_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_carousel_items" ADD CONSTRAINT "pages_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_carousel_items_locales" ADD CONSTRAINT "pages_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_carousel" ADD CONSTRAINT "pages_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_carousel_locales" ADD CONSTRAINT "pages_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_items" ADD CONSTRAINT "pages_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_items" ADD CONSTRAINT "pages_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "pages_blocks_testimonial_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel" ADD CONSTRAINT "pages_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_locales" ADD CONSTRAINT "pages_blocks_testimonial_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_teaser_cards" ADD CONSTRAINT "pages_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_teaser_cards" ADD CONSTRAINT "pages_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_teaser_cards_locales" ADD CONSTRAINT "pages_blocks_content_teaser_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_teaser" ADD CONSTRAINT "pages_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_teaser" ADD CONSTRAINT "pages_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_teaser_locales" ADD CONSTRAINT "pages_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento_partner_card_items" ADD CONSTRAINT "_pages_v_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento_partner_card_items" ADD CONSTRAINT "_pages_v_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "_pages_v_blocks_home_bento_partner_card_items_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento_metrics" ADD CONSTRAINT "_pages_v_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento_metrics_locales" ADD CONSTRAINT "_pages_v_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento" ADD CONSTRAINT "_pages_v_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_bento_locales" ADD CONSTRAINT "_pages_v_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_carousel_items" ADD CONSTRAINT "_pages_v_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_carousel_items" ADD CONSTRAINT "_pages_v_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_carousel_items_locales" ADD CONSTRAINT "_pages_v_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_carousel" ADD CONSTRAINT "_pages_v_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_carousel_locales" ADD CONSTRAINT "_pages_v_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_locales" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_teaser_cards" ADD CONSTRAINT "_pages_v_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_teaser_cards" ADD CONSTRAINT "_pages_v_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_teaser_cards_locales" ADD CONSTRAINT "_pages_v_blocks_content_teaser_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_teaser" ADD CONSTRAINT "_pages_v_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_teaser" ADD CONSTRAINT "_pages_v_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_teaser_locales" ADD CONSTRAINT "_pages_v_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento_partner_card_items" ADD CONSTRAINT "solutions_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento_partner_card_items" ADD CONSTRAINT "solutions_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "solutions_blocks_home_bento_partner_card_items_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento_metrics" ADD CONSTRAINT "solutions_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento_metrics_locales" ADD CONSTRAINT "solutions_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento" ADD CONSTRAINT "solutions_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_bento_locales" ADD CONSTRAINT "solutions_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_case_carousel_items" ADD CONSTRAINT "solutions_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_case_carousel_items" ADD CONSTRAINT "solutions_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_case_carousel_items_locales" ADD CONSTRAINT "solutions_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_case_carousel" ADD CONSTRAINT "solutions_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_case_carousel_locales" ADD CONSTRAINT "solutions_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_items" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_items" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_items_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_locales" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_content_teaser_cards" ADD CONSTRAINT "solutions_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_content_teaser_cards" ADD CONSTRAINT "solutions_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_content_teaser_cards_locales" ADD CONSTRAINT "solutions_blocks_content_teaser_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_content_teaser" ADD CONSTRAINT "solutions_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_content_teaser" ADD CONSTRAINT "solutions_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_content_teaser_locales" ADD CONSTRAINT "solutions_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento_partner_card_items" ADD CONSTRAINT "_solutions_v_blocks_home_bento_partner_card_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento_partner_card_items" ADD CONSTRAINT "_solutions_v_blocks_home_bento_partner_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento_partner_card_items_locales" ADD CONSTRAINT "_solutions_v_blocks_home_bento_partner_card_items_locales_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_bento_partner_card_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento_metrics" ADD CONSTRAINT "_solutions_v_blocks_home_bento_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento_metrics_locales" ADD CONSTRAINT "_solutions_v_blocks_home_bento_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_bento_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento" ADD CONSTRAINT "_solutions_v_blocks_home_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_bento_locales" ADD CONSTRAINT "_solutions_v_blocks_home_bento_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_case_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_case_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_case_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_case_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_case_carousel_items_locales" ADD CONSTRAINT "_solutions_v_blocks_case_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_case_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_case_carousel" ADD CONSTRAINT "_solutions_v_blocks_case_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_case_carousel_locales" ADD CONSTRAINT "_solutions_v_blocks_case_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_case_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_items_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_locales" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_content_teaser_cards" ADD CONSTRAINT "_solutions_v_blocks_content_teaser_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_content_teaser_cards" ADD CONSTRAINT "_solutions_v_blocks_content_teaser_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_content_teaser_cards_locales" ADD CONSTRAINT "_solutions_v_blocks_content_teaser_cards_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_content_teaser_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_content_teaser" ADD CONSTRAINT "_solutions_v_blocks_content_teaser_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_content_teaser" ADD CONSTRAINT "_solutions_v_blocks_content_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_content_teaser_locales" ADD CONSTRAINT "_solutions_v_blocks_content_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_content_teaser"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_home_bento_partner_card_items_order_idx" ON "partners_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_home_bento_partner_card_items_parent_id_idx" ON "partners_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_home_bento_partner_card_items_logo_idx" ON "partners_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partners_blocks_home_bento_partner_card_items_locales_locale" ON "partners_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_home_bento_metrics_order_idx" ON "partners_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "partners_blocks_home_bento_metrics_parent_id_idx" ON "partners_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_home_bento_metrics_locales_locale_parent_id_" ON "partners_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_home_bento_order_idx" ON "partners_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "partners_blocks_home_bento_parent_id_idx" ON "partners_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_home_bento_path_idx" ON "partners_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_home_bento_locales_locale_parent_id_unique" ON "partners_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_case_carousel_items_order_idx" ON "partners_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_case_carousel_items_parent_id_idx" ON "partners_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_case_carousel_items_image_idx" ON "partners_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_case_carousel_items_locales_locale_parent_id" ON "partners_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_case_carousel_order_idx" ON "partners_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "partners_blocks_case_carousel_parent_id_idx" ON "partners_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_case_carousel_path_idx" ON "partners_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_case_carousel_locales_locale_parent_id_uniqu" ON "partners_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_testimonial_carousel_items_order_idx" ON "partners_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_testimonial_carousel_items_parent_id_idx" ON "partners_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_testimonial_carousel_items_avatar_idx" ON "partners_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "partners_blocks_testimonial_carousel_items_locales_locale_pa" ON "partners_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_testimonial_carousel_order_idx" ON "partners_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "partners_blocks_testimonial_carousel_parent_id_idx" ON "partners_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_testimonial_carousel_path_idx" ON "partners_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_testimonial_carousel_locales_locale_parent_i" ON "partners_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_content_teaser_cards_order_idx" ON "partners_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "partners_blocks_content_teaser_cards_parent_id_idx" ON "partners_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_content_teaser_cards_image_idx" ON "partners_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_content_teaser_cards_locales_locale_parent_i" ON "partners_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_content_teaser_order_idx" ON "partners_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "partners_blocks_content_teaser_parent_id_idx" ON "partners_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_content_teaser_path_idx" ON "partners_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "partners_blocks_content_teaser_featured_featured_image_idx" ON "partners_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "partners_blocks_content_teaser_locales_locale_parent_id_uniq" ON "partners_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_home_bento_partner_card_items_order_idx" ON "pages_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_bento_partner_card_items_parent_id_idx" ON "pages_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_bento_partner_card_items_logo_idx" ON "pages_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "pages_blocks_home_bento_partner_card_items_locales_locale_pa" ON "pages_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_home_bento_metrics_order_idx" ON "pages_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_bento_metrics_parent_id_idx" ON "pages_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_home_bento_metrics_locales_locale_parent_id_uni" ON "pages_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_home_bento_order_idx" ON "pages_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_bento_parent_id_idx" ON "pages_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_bento_path_idx" ON "pages_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_home_bento_locales_locale_parent_id_unique" ON "pages_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_case_carousel_items_order_idx" ON "pages_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_carousel_items_parent_id_idx" ON "pages_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_carousel_items_image_idx" ON "pages_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_case_carousel_items_locales_locale_parent_id_un" ON "pages_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_case_carousel_order_idx" ON "pages_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_carousel_parent_id_idx" ON "pages_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_carousel_path_idx" ON "pages_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_case_carousel_locales_locale_parent_id_unique" ON "pages_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_items_order_idx" ON "pages_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_carousel_items_parent_id_idx" ON "pages_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_items_avatar_idx" ON "pages_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "pages_blocks_testimonial_carousel_items_locales_locale_paren" ON "pages_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_order_idx" ON "pages_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_carousel_parent_id_idx" ON "pages_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_path_idx" ON "pages_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_testimonial_carousel_locales_locale_parent_id_u" ON "pages_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_teaser_cards_order_idx" ON "pages_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_teaser_cards_parent_id_idx" ON "pages_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_teaser_cards_image_idx" ON "pages_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_content_teaser_cards_locales_locale_parent_id_u" ON "pages_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_teaser_order_idx" ON "pages_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_teaser_parent_id_idx" ON "pages_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_teaser_path_idx" ON "pages_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_teaser_featured_featured_image_idx" ON "pages_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "pages_blocks_content_teaser_locales_locale_parent_id_unique" ON "pages_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_bento_partner_card_items_order_idx" ON "_pages_v_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_bento_partner_card_items_parent_id_idx" ON "_pages_v_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_bento_partner_card_items_logo_idx" ON "_pages_v_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_home_bento_partner_card_items_locales_locale" ON "_pages_v_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_bento_metrics_order_idx" ON "_pages_v_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_bento_metrics_parent_id_idx" ON "_pages_v_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_home_bento_metrics_locales_locale_parent_id_" ON "_pages_v_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_bento_order_idx" ON "_pages_v_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_bento_parent_id_idx" ON "_pages_v_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_bento_path_idx" ON "_pages_v_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_home_bento_locales_locale_parent_id_unique" ON "_pages_v_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_case_carousel_items_order_idx" ON "_pages_v_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_carousel_items_parent_id_idx" ON "_pages_v_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_carousel_items_image_idx" ON "_pages_v_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_case_carousel_items_locales_locale_parent_id" ON "_pages_v_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_case_carousel_order_idx" ON "_pages_v_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_carousel_parent_id_idx" ON "_pages_v_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_carousel_path_idx" ON "_pages_v_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_case_carousel_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_items_order_idx" ON "_pages_v_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_items_parent_id_idx" ON "_pages_v_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_items_avatar_idx" ON "_pages_v_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonial_carousel_items_locales_locale_pa" ON "_pages_v_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_order_idx" ON "_pages_v_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_parent_id_idx" ON "_pages_v_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_path_idx" ON "_pages_v_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonial_carousel_locales_locale_parent_i" ON "_pages_v_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_teaser_cards_order_idx" ON "_pages_v_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_teaser_cards_parent_id_idx" ON "_pages_v_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_teaser_cards_image_idx" ON "_pages_v_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_teaser_cards_locales_locale_parent_i" ON "_pages_v_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_teaser_order_idx" ON "_pages_v_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_teaser_parent_id_idx" ON "_pages_v_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_teaser_path_idx" ON "_pages_v_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_teaser_featured_featured_image_idx" ON "_pages_v_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_teaser_locales_locale_parent_id_uniq" ON "_pages_v_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_home_bento_partner_card_items_order_idx" ON "solutions_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_home_bento_partner_card_items_parent_id_idx" ON "solutions_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_home_bento_partner_card_items_logo_idx" ON "solutions_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "solutions_blocks_home_bento_partner_card_items_locales_local" ON "solutions_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_home_bento_metrics_order_idx" ON "solutions_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "solutions_blocks_home_bento_metrics_parent_id_idx" ON "solutions_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_home_bento_metrics_locales_locale_parent_id" ON "solutions_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_home_bento_order_idx" ON "solutions_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "solutions_blocks_home_bento_parent_id_idx" ON "solutions_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_home_bento_path_idx" ON "solutions_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_home_bento_locales_locale_parent_id_unique" ON "solutions_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_case_carousel_items_order_idx" ON "solutions_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_case_carousel_items_parent_id_idx" ON "solutions_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_case_carousel_items_image_idx" ON "solutions_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_case_carousel_items_locales_locale_parent_i" ON "solutions_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_case_carousel_order_idx" ON "solutions_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "solutions_blocks_case_carousel_parent_id_idx" ON "solutions_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_case_carousel_path_idx" ON "solutions_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_case_carousel_locales_locale_parent_id_uniq" ON "solutions_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_testimonial_carousel_items_order_idx" ON "solutions_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_testimonial_carousel_items_parent_id_idx" ON "solutions_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_testimonial_carousel_items_avatar_idx" ON "solutions_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "solutions_blocks_testimonial_carousel_items_locales_locale_p" ON "solutions_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_testimonial_carousel_order_idx" ON "solutions_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "solutions_blocks_testimonial_carousel_parent_id_idx" ON "solutions_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_testimonial_carousel_path_idx" ON "solutions_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_testimonial_carousel_locales_locale_parent_" ON "solutions_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_content_teaser_cards_order_idx" ON "solutions_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "solutions_blocks_content_teaser_cards_parent_id_idx" ON "solutions_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_content_teaser_cards_image_idx" ON "solutions_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_content_teaser_cards_locales_locale_parent_" ON "solutions_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_content_teaser_order_idx" ON "solutions_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "solutions_blocks_content_teaser_parent_id_idx" ON "solutions_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_content_teaser_path_idx" ON "solutions_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "solutions_blocks_content_teaser_featured_featured_image_idx" ON "solutions_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "solutions_blocks_content_teaser_locales_locale_parent_id_uni" ON "solutions_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_bento_partner_card_items_order_idx" ON "_solutions_v_blocks_home_bento_partner_card_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_home_bento_partner_card_items_parent_id_idx" ON "_solutions_v_blocks_home_bento_partner_card_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_bento_partner_card_items_logo_idx" ON "_solutions_v_blocks_home_bento_partner_card_items" USING btree ("logo_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_home_bento_partner_card_items_locales_lo" ON "_solutions_v_blocks_home_bento_partner_card_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_bento_metrics_order_idx" ON "_solutions_v_blocks_home_bento_metrics" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_home_bento_metrics_parent_id_idx" ON "_solutions_v_blocks_home_bento_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_home_bento_metrics_locales_locale_parent" ON "_solutions_v_blocks_home_bento_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_bento_order_idx" ON "_solutions_v_blocks_home_bento" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_home_bento_parent_id_idx" ON "_solutions_v_blocks_home_bento" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_bento_path_idx" ON "_solutions_v_blocks_home_bento" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_home_bento_locales_locale_parent_id_uniq" ON "_solutions_v_blocks_home_bento_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_case_carousel_items_order_idx" ON "_solutions_v_blocks_case_carousel_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_case_carousel_items_parent_id_idx" ON "_solutions_v_blocks_case_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_case_carousel_items_image_idx" ON "_solutions_v_blocks_case_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_case_carousel_items_locales_locale_paren" ON "_solutions_v_blocks_case_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_case_carousel_order_idx" ON "_solutions_v_blocks_case_carousel" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_case_carousel_parent_id_idx" ON "_solutions_v_blocks_case_carousel" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_case_carousel_path_idx" ON "_solutions_v_blocks_case_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_case_carousel_locales_locale_parent_id_u" ON "_solutions_v_blocks_case_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_items_order_idx" ON "_solutions_v_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_items_parent_id_idx" ON "_solutions_v_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_items_avatar_idx" ON "_solutions_v_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_testimonial_carousel_items_locales_local" ON "_solutions_v_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_order_idx" ON "_solutions_v_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_parent_id_idx" ON "_solutions_v_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_path_idx" ON "_solutions_v_blocks_testimonial_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_testimonial_carousel_locales_locale_pare" ON "_solutions_v_blocks_testimonial_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_content_teaser_cards_order_idx" ON "_solutions_v_blocks_content_teaser_cards" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_content_teaser_cards_parent_id_idx" ON "_solutions_v_blocks_content_teaser_cards" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_content_teaser_cards_image_idx" ON "_solutions_v_blocks_content_teaser_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_content_teaser_cards_locales_locale_pare" ON "_solutions_v_blocks_content_teaser_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_content_teaser_order_idx" ON "_solutions_v_blocks_content_teaser" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_content_teaser_parent_id_idx" ON "_solutions_v_blocks_content_teaser" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_content_teaser_path_idx" ON "_solutions_v_blocks_content_teaser" USING btree ("_path");
  CREATE INDEX "_solutions_v_blocks_content_teaser_featured_featured_ima_idx" ON "_solutions_v_blocks_content_teaser" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_content_teaser_locales_locale_parent_id_" ON "_solutions_v_blocks_content_teaser_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "partners_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "partners_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "partners_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "partners_blocks_home_bento" CASCADE;
  DROP TABLE "partners_blocks_home_bento_locales" CASCADE;
  DROP TABLE "partners_blocks_case_carousel_items" CASCADE;
  DROP TABLE "partners_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "partners_blocks_case_carousel" CASCADE;
  DROP TABLE "partners_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "partners_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "partners_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "partners_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "partners_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "partners_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "partners_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "partners_blocks_content_teaser" CASCADE;
  DROP TABLE "partners_blocks_content_teaser_locales" CASCADE;
  DROP TABLE "pages_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "pages_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "pages_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "pages_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "pages_blocks_home_bento" CASCADE;
  DROP TABLE "pages_blocks_home_bento_locales" CASCADE;
  DROP TABLE "pages_blocks_case_carousel_items" CASCADE;
  DROP TABLE "pages_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "pages_blocks_case_carousel" CASCADE;
  DROP TABLE "pages_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "pages_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "pages_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_content_teaser" CASCADE;
  DROP TABLE "pages_blocks_content_teaser_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bento" CASCADE;
  DROP TABLE "_pages_v_blocks_home_bento_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_case_carousel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_case_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content_teaser" CASCADE;
  DROP TABLE "_pages_v_blocks_content_teaser_locales" CASCADE;
  DROP TABLE "solutions_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "solutions_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "solutions_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "solutions_blocks_home_bento" CASCADE;
  DROP TABLE "solutions_blocks_home_bento_locales" CASCADE;
  DROP TABLE "solutions_blocks_case_carousel_items" CASCADE;
  DROP TABLE "solutions_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_case_carousel" CASCADE;
  DROP TABLE "solutions_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "solutions_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "solutions_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "solutions_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "solutions_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "solutions_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "solutions_blocks_content_teaser" CASCADE;
  DROP TABLE "solutions_blocks_content_teaser_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_bento_partner_card_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_bento_partner_card_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_bento_metrics" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_bento_metrics_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_bento" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_bento_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_case_carousel_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_case_carousel_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_case_carousel" CASCADE;
  DROP TABLE "_solutions_v_blocks_case_carousel_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "_solutions_v_blocks_testimonial_carousel_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_content_teaser_cards" CASCADE;
  DROP TABLE "_solutions_v_blocks_content_teaser_cards_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_content_teaser" CASCADE;
  DROP TABLE "_solutions_v_blocks_content_teaser_locales" CASCADE;
  DROP TYPE "public"."enum_partners_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum_partners_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum_partners_blocks_home_bento_borda";
  DROP TYPE "public"."enum_partners_blocks_home_bento_spacing";
  DROP TYPE "public"."enum_partners_blocks_home_bento_theme";
  DROP TYPE "public"."enum_partners_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum_partners_blocks_case_carousel_borda";
  DROP TYPE "public"."enum_partners_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum_partners_blocks_case_carousel_theme";
  DROP TYPE "public"."enum_partners_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum_partners_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum_partners_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum_partners_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum_partners_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum_partners_blocks_content_teaser_borda";
  DROP TYPE "public"."enum_partners_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum_partners_blocks_content_teaser_theme";
  DROP TYPE "public"."enum_pages_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum_pages_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum_pages_blocks_home_bento_borda";
  DROP TYPE "public"."enum_pages_blocks_home_bento_spacing";
  DROP TYPE "public"."enum_pages_blocks_home_bento_theme";
  DROP TYPE "public"."enum_pages_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum_pages_blocks_case_carousel_borda";
  DROP TYPE "public"."enum_pages_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum_pages_blocks_case_carousel_theme";
  DROP TYPE "public"."enum_pages_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum_pages_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum_pages_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum_pages_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum_pages_blocks_content_teaser_borda";
  DROP TYPE "public"."enum_pages_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum_pages_blocks_content_teaser_theme";
  DROP TYPE "public"."enum__pages_v_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum__pages_v_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum__pages_v_blocks_home_bento_borda";
  DROP TYPE "public"."enum__pages_v_blocks_home_bento_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_home_bento_theme";
  DROP TYPE "public"."enum__pages_v_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_case_carousel_borda";
  DROP TYPE "public"."enum__pages_v_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_case_carousel_theme";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum__pages_v_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum__pages_v_blocks_content_teaser_borda";
  DROP TYPE "public"."enum__pages_v_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_content_teaser_theme";
  DROP TYPE "public"."enum_solutions_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum_solutions_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum_solutions_blocks_home_bento_borda";
  DROP TYPE "public"."enum_solutions_blocks_home_bento_spacing";
  DROP TYPE "public"."enum_solutions_blocks_home_bento_theme";
  DROP TYPE "public"."enum_solutions_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum_solutions_blocks_case_carousel_borda";
  DROP TYPE "public"."enum_solutions_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum_solutions_blocks_case_carousel_theme";
  DROP TYPE "public"."enum_solutions_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum_solutions_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum_solutions_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum_solutions_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum_solutions_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum_solutions_blocks_content_teaser_borda";
  DROP TYPE "public"."enum_solutions_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum_solutions_blocks_content_teaser_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_home_bento_metrics_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_home_bento_metrics_color";
  DROP TYPE "public"."enum__solutions_v_blocks_home_bento_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_home_bento_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_home_bento_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_case_carousel_items_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_case_carousel_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_case_carousel_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_case_carousel_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_testimonial_carousel_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_testimonial_carousel_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_testimonial_carousel_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_content_teaser_cards_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_content_teaser_cards_column";
  DROP TYPE "public"."enum__solutions_v_blocks_content_teaser_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_content_teaser_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_content_teaser_theme";`)
}
