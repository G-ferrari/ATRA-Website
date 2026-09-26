import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_highlight_carousel_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_highlight_carousel_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_highlight_carousel_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "pages_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar
  );
  
  CREATE TABLE "pages_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar
  );
  
  CREATE TABLE "partners_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar
  );
  
  CREATE TABLE "segments_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar
  );
  
  CREATE TABLE "solutions_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_highlight_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_highlight_carousel_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_highlight_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_highlight_carousel_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_highlight_carousel_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_highlight_carousel_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_highlight_carousel_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_highlight_carousel_items" ADD CONSTRAINT "pages_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_carousel_items" ADD CONSTRAINT "pages_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "pages_blocks_highlight_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_carousel" ADD CONSTRAINT "pages_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_carousel_locales" ADD CONSTRAINT "pages_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_carousel_items" ADD CONSTRAINT "_pages_v_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_carousel_items" ADD CONSTRAINT "_pages_v_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "_pages_v_blocks_highlight_carousel_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_carousel" ADD CONSTRAINT "_pages_v_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_carousel_locales" ADD CONSTRAINT "_pages_v_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_highlight_carousel_items" ADD CONSTRAINT "partners_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_highlight_carousel_items" ADD CONSTRAINT "partners_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "partners_blocks_highlight_carousel_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_highlight_carousel" ADD CONSTRAINT "partners_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_highlight_carousel_locales" ADD CONSTRAINT "partners_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_highlight_carousel_items" ADD CONSTRAINT "segments_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_highlight_carousel_items" ADD CONSTRAINT "segments_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "segments_blocks_highlight_carousel_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_highlight_carousel" ADD CONSTRAINT "segments_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_highlight_carousel_locales" ADD CONSTRAINT "segments_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_highlight_carousel_items" ADD CONSTRAINT "_segments_v_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_highlight_carousel_items" ADD CONSTRAINT "_segments_v_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "_segments_v_blocks_highlight_carousel_items_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_highlight_carousel" ADD CONSTRAINT "_segments_v_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_highlight_carousel_locales" ADD CONSTRAINT "_segments_v_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_highlight_carousel_items" ADD CONSTRAINT "solutions_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_highlight_carousel_items" ADD CONSTRAINT "solutions_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "solutions_blocks_highlight_carousel_items_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_highlight_carousel" ADD CONSTRAINT "solutions_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_highlight_carousel_locales" ADD CONSTRAINT "solutions_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_highlight_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_highlight_carousel_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_highlight_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_highlight_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_highlight_carousel_items_locales" ADD CONSTRAINT "_solutions_v_blocks_highlight_carousel_items_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_highlight_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_highlight_carousel" ADD CONSTRAINT "_solutions_v_blocks_highlight_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_highlight_carousel_locales" ADD CONSTRAINT "_solutions_v_blocks_highlight_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_highlight_carousel"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_highlight_carousel_items_order_idx" ON "pages_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlight_carousel_items_parent_id_idx" ON "pages_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlight_carousel_items_image_idx" ON "pages_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_highlight_carousel_items_locales_locale_parent_" ON "pages_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_highlight_carousel_order_idx" ON "pages_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlight_carousel_parent_id_idx" ON "pages_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlight_carousel_path_idx" ON "pages_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_highlight_carousel_locales_locale_parent_id_uni" ON "pages_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_carousel_items_order_idx" ON "_pages_v_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlight_carousel_items_parent_id_idx" ON "_pages_v_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_carousel_items_image_idx" ON "_pages_v_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_highlight_carousel_items_locales_locale_pare" ON "_pages_v_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_carousel_order_idx" ON "_pages_v_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlight_carousel_parent_id_idx" ON "_pages_v_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_carousel_path_idx" ON "_pages_v_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_highlight_carousel_locales_locale_parent_id_" ON "_pages_v_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_highlight_carousel_items_order_idx" ON "partners_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_highlight_carousel_items_parent_id_idx" ON "partners_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_highlight_carousel_items_image_idx" ON "partners_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_highlight_carousel_items_locales_locale_pare" ON "partners_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_highlight_carousel_order_idx" ON "partners_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "partners_blocks_highlight_carousel_parent_id_idx" ON "partners_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_highlight_carousel_path_idx" ON "partners_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_highlight_carousel_locales_locale_parent_id_" ON "partners_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_highlight_carousel_items_order_idx" ON "segments_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_highlight_carousel_items_parent_id_idx" ON "segments_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_highlight_carousel_items_image_idx" ON "segments_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_highlight_carousel_items_locales_locale_pare" ON "segments_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_highlight_carousel_order_idx" ON "segments_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "segments_blocks_highlight_carousel_parent_id_idx" ON "segments_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_highlight_carousel_path_idx" ON "segments_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_highlight_carousel_locales_locale_parent_id_" ON "segments_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_highlight_carousel_items_order_idx" ON "_segments_v_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_highlight_carousel_items_parent_id_idx" ON "_segments_v_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_highlight_carousel_items_image_idx" ON "_segments_v_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_highlight_carousel_items_locales_locale_p" ON "_segments_v_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_highlight_carousel_order_idx" ON "_segments_v_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_highlight_carousel_parent_id_idx" ON "_segments_v_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_highlight_carousel_path_idx" ON "_segments_v_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_highlight_carousel_locales_locale_parent_" ON "_segments_v_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_highlight_carousel_items_order_idx" ON "solutions_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_highlight_carousel_items_parent_id_idx" ON "solutions_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_highlight_carousel_items_image_idx" ON "solutions_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_highlight_carousel_items_locales_locale_par" ON "solutions_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_highlight_carousel_order_idx" ON "solutions_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "solutions_blocks_highlight_carousel_parent_id_idx" ON "solutions_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_highlight_carousel_path_idx" ON "solutions_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_highlight_carousel_locales_locale_parent_id" ON "solutions_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_highlight_carousel_items_order_idx" ON "_solutions_v_blocks_highlight_carousel_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_highlight_carousel_items_parent_id_idx" ON "_solutions_v_blocks_highlight_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_highlight_carousel_items_image_idx" ON "_solutions_v_blocks_highlight_carousel_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_highlight_carousel_items_locales_locale_" ON "_solutions_v_blocks_highlight_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_highlight_carousel_order_idx" ON "_solutions_v_blocks_highlight_carousel" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_highlight_carousel_parent_id_idx" ON "_solutions_v_blocks_highlight_carousel" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_highlight_carousel_path_idx" ON "_solutions_v_blocks_highlight_carousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_highlight_carousel_locales_locale_parent" ON "_solutions_v_blocks_highlight_carousel_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "pages_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "pages_blocks_highlight_carousel" CASCADE;
  DROP TABLE "pages_blocks_highlight_carousel_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_carousel_locales" CASCADE;
  DROP TABLE "partners_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "partners_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "partners_blocks_highlight_carousel" CASCADE;
  DROP TABLE "partners_blocks_highlight_carousel_locales" CASCADE;
  DROP TABLE "segments_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "segments_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "segments_blocks_highlight_carousel" CASCADE;
  DROP TABLE "segments_blocks_highlight_carousel_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "_segments_v_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_highlight_carousel" CASCADE;
  DROP TABLE "_segments_v_blocks_highlight_carousel_locales" CASCADE;
  DROP TABLE "solutions_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "solutions_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_highlight_carousel" CASCADE;
  DROP TABLE "solutions_blocks_highlight_carousel_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_highlight_carousel_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_highlight_carousel_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_highlight_carousel" CASCADE;
  DROP TABLE "_solutions_v_blocks_highlight_carousel_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum_pages_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum_pages_blocks_highlight_carousel_theme";
  DROP TYPE "public"."enum__pages_v_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum__pages_v_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_highlight_carousel_theme";
  DROP TYPE "public"."enum_partners_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum_partners_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum_partners_blocks_highlight_carousel_theme";
  DROP TYPE "public"."enum_segments_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum_segments_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum_segments_blocks_highlight_carousel_theme";
  DROP TYPE "public"."enum__segments_v_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum__segments_v_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_highlight_carousel_theme";
  DROP TYPE "public"."enum_solutions_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum_solutions_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum_solutions_blocks_highlight_carousel_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_highlight_carousel_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_highlight_carousel_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_highlight_carousel_theme";`)
}
