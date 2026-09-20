import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_partners_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_pages_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum_solutions_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_insights_hub_formats_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TYPE "public"."enum__solutions_v_blocks_insights_hub_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_insights_hub_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_insights_hub_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "partners_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum_partners_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar
  );
  
  CREATE TABLE "partners_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum_pages_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum__pages_v_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum_solutions_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"icon" "enum__solutions_v_blocks_insights_hub_formats_icon" DEFAULT 'sparkles',
  	"count" numeric,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_formats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_cta_href" varchar,
  	"closing_secondary_href" varchar,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_insights_hub_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_insights_hub_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_insights_hub_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_locales" (
  	"badge" varchar,
  	"chip" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"portals_title" varchar,
  	"portals_description" varchar,
  	"newsletter_eyebrow" varchar,
  	"newsletter_title" varchar,
  	"newsletter_description" varchar,
  	"closing_title" varchar,
  	"closing_description" varchar,
  	"closing_cta_label" varchar,
  	"closing_secondary_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "partners_blocks_insights_hub_formats" ADD CONSTRAINT "partners_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_formats_locales" ADD CONSTRAINT "partners_blocks_insights_hub_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items_tags" ADD CONSTRAINT "partners_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "partners_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items" ADD CONSTRAINT "partners_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items" ADD CONSTRAINT "partners_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items_locales" ADD CONSTRAINT "partners_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub" ADD CONSTRAINT "partners_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_locales" ADD CONSTRAINT "partners_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_formats" ADD CONSTRAINT "pages_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_formats_locales" ADD CONSTRAINT "pages_blocks_insights_hub_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items_tags" ADD CONSTRAINT "pages_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "pages_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items" ADD CONSTRAINT "pages_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items" ADD CONSTRAINT "pages_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items_locales" ADD CONSTRAINT "pages_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub" ADD CONSTRAINT "pages_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_locales" ADD CONSTRAINT "pages_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_formats" ADD CONSTRAINT "_pages_v_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_formats_locales" ADD CONSTRAINT "_pages_v_blocks_insights_hub_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items_tags" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items_locales" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub" ADD CONSTRAINT "_pages_v_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_locales" ADD CONSTRAINT "_pages_v_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_formats" ADD CONSTRAINT "solutions_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_formats_locales" ADD CONSTRAINT "solutions_blocks_insights_hub_formats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items_tags" ADD CONSTRAINT "solutions_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "solutions_blocks_insights_hub_items_tags_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items" ADD CONSTRAINT "solutions_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items" ADD CONSTRAINT "solutions_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items_locales" ADD CONSTRAINT "solutions_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub" ADD CONSTRAINT "solutions_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_locales" ADD CONSTRAINT "solutions_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_formats" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_formats_locales" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_formats_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items_tags" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_tags_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items_locales" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_locales" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_insights_hub_formats_order_idx" ON "partners_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "partners_blocks_insights_hub_formats_parent_id_idx" ON "partners_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_insights_hub_formats_locales_locale_parent_i" ON "partners_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_items_tags_order_idx" ON "partners_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "partners_blocks_insights_hub_items_tags_parent_id_idx" ON "partners_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_insights_hub_items_tags_locales_locale_paren" ON "partners_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_items_order_idx" ON "partners_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_insights_hub_items_parent_id_idx" ON "partners_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_items_image_idx" ON "partners_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_insights_hub_items_locales_locale_parent_id_" ON "partners_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_order_idx" ON "partners_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "partners_blocks_insights_hub_parent_id_idx" ON "partners_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_path_idx" ON "partners_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_insights_hub_locales_locale_parent_id_unique" ON "partners_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_formats_order_idx" ON "pages_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_hub_formats_parent_id_idx" ON "pages_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_insights_hub_formats_locales_locale_parent_id_u" ON "pages_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_items_tags_order_idx" ON "pages_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_hub_items_tags_parent_id_idx" ON "pages_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_insights_hub_items_tags_locales_locale_parent_i" ON "pages_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_items_order_idx" ON "pages_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_hub_items_parent_id_idx" ON "pages_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_items_image_idx" ON "pages_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_insights_hub_items_locales_locale_parent_id_uni" ON "pages_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_order_idx" ON "pages_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_hub_parent_id_idx" ON "pages_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_path_idx" ON "pages_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_insights_hub_locales_locale_parent_id_unique" ON "pages_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_formats_order_idx" ON "_pages_v_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_hub_formats_parent_id_idx" ON "_pages_v_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_insights_hub_formats_locales_locale_parent_i" ON "_pages_v_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_tags_order_idx" ON "_pages_v_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_tags_parent_id_idx" ON "_pages_v_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_insights_hub_items_tags_locales_locale_paren" ON "_pages_v_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_order_idx" ON "_pages_v_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_parent_id_idx" ON "_pages_v_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_image_idx" ON "_pages_v_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_insights_hub_items_locales_locale_parent_id_" ON "_pages_v_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_order_idx" ON "_pages_v_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_hub_parent_id_idx" ON "_pages_v_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_path_idx" ON "_pages_v_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_insights_hub_locales_locale_parent_id_unique" ON "_pages_v_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_formats_order_idx" ON "solutions_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "solutions_blocks_insights_hub_formats_parent_id_idx" ON "solutions_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_insights_hub_formats_locales_locale_parent_" ON "solutions_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_items_tags_order_idx" ON "solutions_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "solutions_blocks_insights_hub_items_tags_parent_id_idx" ON "solutions_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_insights_hub_items_tags_locales_locale_pare" ON "solutions_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_items_order_idx" ON "solutions_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_insights_hub_items_parent_id_idx" ON "solutions_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_items_image_idx" ON "solutions_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_insights_hub_items_locales_locale_parent_id" ON "solutions_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_order_idx" ON "solutions_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "solutions_blocks_insights_hub_parent_id_idx" ON "solutions_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_path_idx" ON "solutions_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_insights_hub_locales_locale_parent_id_uniqu" ON "solutions_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_formats_order_idx" ON "_solutions_v_blocks_insights_hub_formats" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_insights_hub_formats_parent_id_idx" ON "_solutions_v_blocks_insights_hub_formats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_insights_hub_formats_locales_locale_pare" ON "_solutions_v_blocks_insights_hub_formats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_tags_order_idx" ON "_solutions_v_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_tags_parent_id_idx" ON "_solutions_v_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_insights_hub_items_tags_locales_locale_p" ON "_solutions_v_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_order_idx" ON "_solutions_v_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_parent_id_idx" ON "_solutions_v_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_image_idx" ON "_solutions_v_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_insights_hub_items_locales_locale_parent" ON "_solutions_v_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_order_idx" ON "_solutions_v_blocks_insights_hub" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_insights_hub_parent_id_idx" ON "_solutions_v_blocks_insights_hub" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_path_idx" ON "_solutions_v_blocks_insights_hub" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_insights_hub_locales_locale_parent_id_un" ON "_solutions_v_blocks_insights_hub_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "partners_blocks_insights_hub" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_locales" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "pages_blocks_insights_hub" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_locales" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_formats" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_formats_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_locales" CASCADE;
  DROP TYPE "public"."enum_partners_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum_partners_blocks_insights_hub_borda";
  DROP TYPE "public"."enum_partners_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum_partners_blocks_insights_hub_theme";
  DROP TYPE "public"."enum_pages_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum_pages_blocks_insights_hub_borda";
  DROP TYPE "public"."enum_pages_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum_pages_blocks_insights_hub_theme";
  DROP TYPE "public"."enum__pages_v_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum__pages_v_blocks_insights_hub_borda";
  DROP TYPE "public"."enum__pages_v_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_insights_hub_theme";
  DROP TYPE "public"."enum_solutions_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum_solutions_blocks_insights_hub_borda";
  DROP TYPE "public"."enum_solutions_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum_solutions_blocks_insights_hub_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_insights_hub_formats_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_insights_hub_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_insights_hub_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_insights_hub_theme";`)
}
