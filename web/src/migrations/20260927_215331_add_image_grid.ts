import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_partners_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_partners_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_partners_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_segments_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_segments_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_segments_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__segments_v_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__segments_v_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__segments_v_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_solutions_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_solutions_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum_solutions_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__solutions_v_blocks_image_grid_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__solutions_v_blocks_image_grid_spacing" AS ENUM('normal', 'roomy');
  CREATE TYPE "public"."enum__solutions_v_blocks_image_grid_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "pages_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "partners_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "partners_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "segments_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "segments_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "solutions_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "solutions_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_image_grid_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_image_grid_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_image_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"boxed" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_image_grid_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_image_grid_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_image_grid_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_image_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_image_grid_images" ADD CONSTRAINT "pages_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_images" ADD CONSTRAINT "pages_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_images_locales" ADD CONSTRAINT "pages_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid" ADD CONSTRAINT "pages_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_grid_locales" ADD CONSTRAINT "pages_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_grid_images" ADD CONSTRAINT "_pages_v_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_grid_images" ADD CONSTRAINT "_pages_v_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_grid_images_locales" ADD CONSTRAINT "_pages_v_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_grid" ADD CONSTRAINT "_pages_v_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_grid_locales" ADD CONSTRAINT "_pages_v_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_image_grid_images" ADD CONSTRAINT "partners_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_image_grid_images" ADD CONSTRAINT "partners_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_image_grid_images_locales" ADD CONSTRAINT "partners_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_image_grid" ADD CONSTRAINT "partners_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_image_grid_locales" ADD CONSTRAINT "partners_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_image_grid_images" ADD CONSTRAINT "segments_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_image_grid_images" ADD CONSTRAINT "segments_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_image_grid_images_locales" ADD CONSTRAINT "segments_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_image_grid" ADD CONSTRAINT "segments_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_image_grid_locales" ADD CONSTRAINT "segments_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_image_grid_images" ADD CONSTRAINT "_segments_v_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_image_grid_images" ADD CONSTRAINT "_segments_v_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_image_grid_images_locales" ADD CONSTRAINT "_segments_v_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_image_grid" ADD CONSTRAINT "_segments_v_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_image_grid_locales" ADD CONSTRAINT "_segments_v_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_image_grid_images" ADD CONSTRAINT "solutions_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_image_grid_images" ADD CONSTRAINT "solutions_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_image_grid_images_locales" ADD CONSTRAINT "solutions_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_image_grid" ADD CONSTRAINT "solutions_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_image_grid_locales" ADD CONSTRAINT "solutions_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_image_grid_images" ADD CONSTRAINT "_solutions_v_blocks_image_grid_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_image_grid_images" ADD CONSTRAINT "_solutions_v_blocks_image_grid_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_image_grid_images_locales" ADD CONSTRAINT "_solutions_v_blocks_image_grid_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_image_grid_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_image_grid" ADD CONSTRAINT "_solutions_v_blocks_image_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_image_grid_locales" ADD CONSTRAINT "_solutions_v_blocks_image_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_image_grid"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_grid_images_order_idx" ON "pages_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_grid_images_parent_id_idx" ON "pages_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_grid_images_image_idx" ON "pages_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_image_grid_images_locales_locale_parent_id_uniq" ON "pages_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_image_grid_order_idx" ON "pages_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_grid_parent_id_idx" ON "pages_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_grid_path_idx" ON "pages_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_image_grid_locales_locale_parent_id_unique" ON "pages_blocks_image_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_grid_images_order_idx" ON "_pages_v_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_grid_images_parent_id_idx" ON "_pages_v_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_grid_images_image_idx" ON "_pages_v_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_grid_images_locales_locale_parent_id_u" ON "_pages_v_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_grid_order_idx" ON "_pages_v_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_grid_parent_id_idx" ON "_pages_v_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_grid_path_idx" ON "_pages_v_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_image_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_image_grid_images_order_idx" ON "partners_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "partners_blocks_image_grid_images_parent_id_idx" ON "partners_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_image_grid_images_image_idx" ON "partners_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_image_grid_images_locales_locale_parent_id_u" ON "partners_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_image_grid_order_idx" ON "partners_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "partners_blocks_image_grid_parent_id_idx" ON "partners_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_image_grid_path_idx" ON "partners_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "partners_blocks_image_grid_locales_locale_parent_id_unique" ON "partners_blocks_image_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_image_grid_images_order_idx" ON "segments_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "segments_blocks_image_grid_images_parent_id_idx" ON "segments_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_image_grid_images_image_idx" ON "segments_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_image_grid_images_locales_locale_parent_id_u" ON "segments_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_image_grid_order_idx" ON "segments_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "segments_blocks_image_grid_parent_id_idx" ON "segments_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_image_grid_path_idx" ON "segments_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "segments_blocks_image_grid_locales_locale_parent_id_unique" ON "segments_blocks_image_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_image_grid_images_order_idx" ON "_segments_v_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_image_grid_images_parent_id_idx" ON "_segments_v_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_image_grid_images_image_idx" ON "_segments_v_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_image_grid_images_locales_locale_parent_i" ON "_segments_v_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_image_grid_order_idx" ON "_segments_v_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_image_grid_parent_id_idx" ON "_segments_v_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_image_grid_path_idx" ON "_segments_v_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_segments_v_blocks_image_grid_locales_locale_parent_id_uniqu" ON "_segments_v_blocks_image_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_image_grid_images_order_idx" ON "solutions_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "solutions_blocks_image_grid_images_parent_id_idx" ON "solutions_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_image_grid_images_image_idx" ON "solutions_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_image_grid_images_locales_locale_parent_id_" ON "solutions_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_image_grid_order_idx" ON "solutions_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "solutions_blocks_image_grid_parent_id_idx" ON "solutions_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_image_grid_path_idx" ON "solutions_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "solutions_blocks_image_grid_locales_locale_parent_id_unique" ON "solutions_blocks_image_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_image_grid_images_order_idx" ON "_solutions_v_blocks_image_grid_images" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_image_grid_images_parent_id_idx" ON "_solutions_v_blocks_image_grid_images" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_image_grid_images_image_idx" ON "_solutions_v_blocks_image_grid_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_image_grid_images_locales_locale_parent_" ON "_solutions_v_blocks_image_grid_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_image_grid_order_idx" ON "_solutions_v_blocks_image_grid" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_image_grid_parent_id_idx" ON "_solutions_v_blocks_image_grid" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_image_grid_path_idx" ON "_solutions_v_blocks_image_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_solutions_v_blocks_image_grid_locales_locale_parent_id_uniq" ON "_solutions_v_blocks_image_grid_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_image_grid_images" CASCADE;
  DROP TABLE "pages_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "pages_blocks_image_grid" CASCADE;
  DROP TABLE "pages_blocks_image_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image_grid_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_image_grid_locales" CASCADE;
  DROP TABLE "partners_blocks_image_grid_images" CASCADE;
  DROP TABLE "partners_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "partners_blocks_image_grid" CASCADE;
  DROP TABLE "partners_blocks_image_grid_locales" CASCADE;
  DROP TABLE "segments_blocks_image_grid_images" CASCADE;
  DROP TABLE "segments_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "segments_blocks_image_grid" CASCADE;
  DROP TABLE "segments_blocks_image_grid_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_image_grid_images" CASCADE;
  DROP TABLE "_segments_v_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_image_grid" CASCADE;
  DROP TABLE "_segments_v_blocks_image_grid_locales" CASCADE;
  DROP TABLE "solutions_blocks_image_grid_images" CASCADE;
  DROP TABLE "solutions_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "solutions_blocks_image_grid" CASCADE;
  DROP TABLE "solutions_blocks_image_grid_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_image_grid_images" CASCADE;
  DROP TABLE "_solutions_v_blocks_image_grid_images_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_image_grid" CASCADE;
  DROP TABLE "_solutions_v_blocks_image_grid_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_image_grid_borda";
  DROP TYPE "public"."enum_pages_blocks_image_grid_spacing";
  DROP TYPE "public"."enum_pages_blocks_image_grid_theme";
  DROP TYPE "public"."enum__pages_v_blocks_image_grid_borda";
  DROP TYPE "public"."enum__pages_v_blocks_image_grid_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_image_grid_theme";
  DROP TYPE "public"."enum_partners_blocks_image_grid_borda";
  DROP TYPE "public"."enum_partners_blocks_image_grid_spacing";
  DROP TYPE "public"."enum_partners_blocks_image_grid_theme";
  DROP TYPE "public"."enum_segments_blocks_image_grid_borda";
  DROP TYPE "public"."enum_segments_blocks_image_grid_spacing";
  DROP TYPE "public"."enum_segments_blocks_image_grid_theme";
  DROP TYPE "public"."enum__segments_v_blocks_image_grid_borda";
  DROP TYPE "public"."enum__segments_v_blocks_image_grid_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_image_grid_theme";
  DROP TYPE "public"."enum_solutions_blocks_image_grid_borda";
  DROP TYPE "public"."enum_solutions_blocks_image_grid_spacing";
  DROP TYPE "public"."enum_solutions_blocks_image_grid_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_image_grid_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_image_grid_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_image_grid_theme";`)
}
