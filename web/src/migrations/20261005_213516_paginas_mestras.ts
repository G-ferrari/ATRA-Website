import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Feature paginas-mestras (D-55): a marca "Página-mestra de" em `pages` e os
 * blocos "Lista da seção" e "Destaques da seção".
 *
 * ⚠️ Idempotente à mão sobre o que o gerador emitiu: tudo nasce antes, em
 * `20260927_215800_paginas_mestras`, porque toda consulta a `pages` lê a coluna
 * nova e faz JOIN com as tabelas dos blocos — e em banco novo as migrações de
 * dados antigas (a do carrossel da home, a do fim das páginas…) rodam antes
 * desta. Aqui só se cria o que aquela não criou. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_section_listing_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_section_listing_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_section_listing_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_section_featured_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_section_featured_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_section_featured_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_master_of" AS ENUM('solucoes', 'segmentos', 'consultores', 'insights', 'blog', 'webinars', 'cases', 'midia', 'ebooks', 'carreiras');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_section_listing_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_section_listing_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_section_listing_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_section_featured_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_section_featured_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_section_featured_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_version_master_of" AS ENUM('solucoes', 'segmentos', 'consultores', 'insights', 'blog', 'webinars', 'cases', 'midia', 'ebooks', 'carreiras');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "pages_blocks_section_listing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_section_listing_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_section_listing_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_section_listing_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_section_listing_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_section_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_section_featured_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_section_featured_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_section_featured_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_section_featured_locales" (
  	"action_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_listing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_section_listing_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_section_listing_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_section_listing_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_listing_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_section_featured_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_section_featured_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_section_featured_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_featured_locales" (
  	"action_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "master_of" "enum_pages_master_of";
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_master_of" "enum__pages_v_version_master_of";
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_section_listing" ADD CONSTRAINT "pages_blocks_section_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_section_listing_locales" ADD CONSTRAINT "pages_blocks_section_listing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_section_listing"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_section_featured" ADD CONSTRAINT "pages_blocks_section_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_section_featured_locales" ADD CONSTRAINT "pages_blocks_section_featured_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_section_featured"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_section_listing" ADD CONSTRAINT "_pages_v_blocks_section_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_section_listing_locales" ADD CONSTRAINT "_pages_v_blocks_section_listing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_section_listing"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_section_featured" ADD CONSTRAINT "_pages_v_blocks_section_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_section_featured_locales" ADD CONSTRAINT "_pages_v_blocks_section_featured_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_section_featured"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_listing_order_idx" ON "pages_blocks_section_listing" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_listing_parent_id_idx" ON "pages_blocks_section_listing" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_listing_path_idx" ON "pages_blocks_section_listing" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_section_listing_locales_locale_parent_id_unique" ON "pages_blocks_section_listing_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_featured_order_idx" ON "pages_blocks_section_featured" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_featured_parent_id_idx" ON "pages_blocks_section_featured" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_featured_path_idx" ON "pages_blocks_section_featured" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_section_featured_locales_locale_parent_id_uniqu" ON "pages_blocks_section_featured_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_listing_order_idx" ON "_pages_v_blocks_section_listing" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_listing_parent_id_idx" ON "_pages_v_blocks_section_listing" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_listing_path_idx" ON "_pages_v_blocks_section_listing" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_section_listing_locales_locale_parent_id_uni" ON "_pages_v_blocks_section_listing_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_featured_order_idx" ON "_pages_v_blocks_section_featured" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_featured_parent_id_idx" ON "_pages_v_blocks_section_featured" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_featured_path_idx" ON "_pages_v_blocks_section_featured" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_section_featured_locales_locale_parent_id_un" ON "_pages_v_blocks_section_featured_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_master_of_idx" ON "pages" USING btree ("master_of");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_master_of_idx" ON "_pages_v" USING btree ("version_master_of");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_listing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_section_listing_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_section_featured" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_section_featured_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_listing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_listing_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_featured" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_featured_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_section_listing" CASCADE;
  DROP TABLE "pages_blocks_section_listing_locales" CASCADE;
  DROP TABLE "pages_blocks_section_featured" CASCADE;
  DROP TABLE "pages_blocks_section_featured_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_section_listing" CASCADE;
  DROP TABLE "_pages_v_blocks_section_listing_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_section_featured" CASCADE;
  DROP TABLE "_pages_v_blocks_section_featured_locales" CASCADE;
  DROP INDEX "pages_master_of_idx";
  DROP INDEX "_pages_v_version_version_master_of_idx";
  ALTER TABLE "pages" DROP COLUMN "master_of";
  ALTER TABLE "_pages_v" DROP COLUMN "version_master_of";
  DROP TYPE "public"."enum_pages_blocks_section_listing_borda";
  DROP TYPE "public"."enum_pages_blocks_section_listing_spacing";
  DROP TYPE "public"."enum_pages_blocks_section_listing_theme";
  DROP TYPE "public"."enum_pages_blocks_section_featured_borda";
  DROP TYPE "public"."enum_pages_blocks_section_featured_spacing";
  DROP TYPE "public"."enum_pages_blocks_section_featured_theme";
  DROP TYPE "public"."enum_pages_master_of";
  DROP TYPE "public"."enum__pages_v_blocks_section_listing_borda";
  DROP TYPE "public"."enum__pages_v_blocks_section_listing_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_section_listing_theme";
  DROP TYPE "public"."enum__pages_v_blocks_section_featured_borda";
  DROP TYPE "public"."enum__pages_v_blocks_section_featured_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_section_featured_theme";
  DROP TYPE "public"."enum__pages_v_version_master_of";`)
}
