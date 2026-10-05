import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**: a data é 27/09, mas ela nasceu em
 * 05/10, com a feature paginas-mestras (`20261005_213516_paginas_mestras`).
 *
 * A quinta vez da armadilha do banco novo (ver `…_partner_showcase_source`,
 * `…_locked_documents_press`, `…_solutions_badge`, `…_rich_text_body_size`): as
 * migrações de dados antigas leem `pages` com a configuração de hoje, e toda
 * consulta a `pages` passa a ler a coluna `master_of` e a fazer JOIN com as
 * tabelas dos dois blocos novos. Por isso tudo nasce aqui, idempotente; a de
 * 05/10 só cria o que esta não criou. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
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

/* A volta é a da migração de 05/10, que apaga as tabelas, a coluna e os tipos. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[paginas-mestras] o schema é desfeito por 20261005_213516_paginas_mestras')
}
