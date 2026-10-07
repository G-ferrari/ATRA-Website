import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Antecipada, idempotente: as tabelas do bloco "Mosaico de parceiros" (07/10),
 * criadas **antes** da primeira migração de dados.
 *
 * ⚠️ O bloco entra no catálogo de `pages`, `solutions`, `segments` e
 * `partners`, e as migrações de dados antigas leem essas collections pela
 * Local API com o config de hoje — que faz um JOIN em cada tabela de bloco. Em
 * banco novo elas rodam antes de `20261007_012347`, e morreriam em "relation
 * does not exist" (a armadilha do CLAUDE.md). A de 07/10 repete tudo com
 * `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_partner_mosaic_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_partner_mosaic_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_partner_mosaic_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "pages_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_partner_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_partner_mosaic_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_partner_mosaic_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_partner_mosaic_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_partner_mosaic_items" ADD CONSTRAINT "pages_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_partner_mosaic_items" ADD CONSTRAINT "pages_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "pages_blocks_partner_mosaic_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_partner_mosaic" ADD CONSTRAINT "pages_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_partner_mosaic_locales" ADD CONSTRAINT "pages_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_partner_mosaic_items" ADD CONSTRAINT "_pages_v_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_partner_mosaic_items" ADD CONSTRAINT "_pages_v_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "_pages_v_blocks_partner_mosaic_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_partner_mosaic" ADD CONSTRAINT "_pages_v_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_partner_mosaic_locales" ADD CONSTRAINT "_pages_v_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_partner_mosaic_items" ADD CONSTRAINT "partners_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_partner_mosaic_items" ADD CONSTRAINT "partners_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "partners_blocks_partner_mosaic_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_partner_mosaic" ADD CONSTRAINT "partners_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_partner_mosaic_locales" ADD CONSTRAINT "partners_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_partner_mosaic_items" ADD CONSTRAINT "segments_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_partner_mosaic_items" ADD CONSTRAINT "segments_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "segments_blocks_partner_mosaic_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_partner_mosaic" ADD CONSTRAINT "segments_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_partner_mosaic_locales" ADD CONSTRAINT "segments_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_partner_mosaic_items" ADD CONSTRAINT "_segments_v_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_partner_mosaic_items" ADD CONSTRAINT "_segments_v_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "_segments_v_blocks_partner_mosaic_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_partner_mosaic" ADD CONSTRAINT "_segments_v_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_partner_mosaic_locales" ADD CONSTRAINT "_segments_v_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_partner_mosaic_items" ADD CONSTRAINT "solutions_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_partner_mosaic_items" ADD CONSTRAINT "solutions_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "solutions_blocks_partner_mosaic_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_partner_mosaic" ADD CONSTRAINT "solutions_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_partner_mosaic_locales" ADD CONSTRAINT "solutions_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_partner_mosaic_items" ADD CONSTRAINT "_solutions_v_blocks_partner_mosaic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_partner_mosaic_items" ADD CONSTRAINT "_solutions_v_blocks_partner_mosaic_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_partner_mosaic_items_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_mosaic_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_mosaic_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_partner_mosaic" ADD CONSTRAINT "_solutions_v_blocks_partner_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_partner_mosaic_locales" ADD CONSTRAINT "_solutions_v_blocks_partner_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_partner_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_items_order_idx" ON "pages_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_items_parent_id_idx" ON "pages_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_items_image_idx" ON "pages_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_items_locales_locale_parent_id_u" ON "pages_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_order_idx" ON "pages_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_parent_id_idx" ON "pages_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_path_idx" ON "pages_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_partner_mosaic_locales_locale_parent_id_unique" ON "pages_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_items_order_idx" ON "_pages_v_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_items_parent_id_idx" ON "_pages_v_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_items_image_idx" ON "_pages_v_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_items_locales_locale_parent_i" ON "_pages_v_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_order_idx" ON "_pages_v_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_parent_id_idx" ON "_pages_v_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_path_idx" ON "_pages_v_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_partner_mosaic_locales_locale_parent_id_uniq" ON "_pages_v_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_items_order_idx" ON "partners_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_items_parent_id_idx" ON "partners_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_items_image_idx" ON "partners_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_items_locales_locale_parent_i" ON "partners_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_order_idx" ON "partners_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_parent_id_idx" ON "partners_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_path_idx" ON "partners_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "partners_blocks_partner_mosaic_locales_locale_parent_id_uniq" ON "partners_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_items_order_idx" ON "segments_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_items_parent_id_idx" ON "segments_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_items_image_idx" ON "segments_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_items_locales_locale_parent_i" ON "segments_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_order_idx" ON "segments_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_parent_id_idx" ON "segments_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_path_idx" ON "segments_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "segments_blocks_partner_mosaic_locales_locale_parent_id_uniq" ON "segments_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_items_order_idx" ON "_segments_v_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_items_parent_id_idx" ON "_segments_v_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_items_image_idx" ON "_segments_v_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_items_locales_locale_paren" ON "_segments_v_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_order_idx" ON "_segments_v_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_parent_id_idx" ON "_segments_v_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_path_idx" ON "_segments_v_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_segments_v_blocks_partner_mosaic_locales_locale_parent_id_u" ON "_segments_v_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_items_order_idx" ON "solutions_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_items_parent_id_idx" ON "solutions_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_items_image_idx" ON "solutions_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_items_locales_locale_parent_" ON "solutions_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_order_idx" ON "solutions_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_parent_id_idx" ON "solutions_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_path_idx" ON "solutions_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "solutions_blocks_partner_mosaic_locales_locale_parent_id_uni" ON "solutions_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_items_order_idx" ON "_solutions_v_blocks_partner_mosaic_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_items_parent_id_idx" ON "_solutions_v_blocks_partner_mosaic_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_items_image_idx" ON "_solutions_v_blocks_partner_mosaic_items" USING btree ("image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_items_locales_locale_pare" ON "_solutions_v_blocks_partner_mosaic_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_order_idx" ON "_solutions_v_blocks_partner_mosaic" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_parent_id_idx" ON "_solutions_v_blocks_partner_mosaic" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_path_idx" ON "_solutions_v_blocks_partner_mosaic" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_solutions_v_blocks_partner_mosaic_locales_locale_parent_id_" ON "_solutions_v_blocks_partner_mosaic_locales" USING btree ("_locale","_parent_id");`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Quem desfaz é a de 07/10. */
}
