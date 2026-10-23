import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, idempotente: as tabelas da seção
 * "Formulário" (task 051, 21/10), criadas **antes** da primeira migração de
 * dados.
 *
 * O bloco entra no catálogo de `pages`, `solutions`, `segments` e
 * `partners`, e as migrações de dados antigas leem essas collections pela
 * Local API com o config de hoje — que faz um JOIN em cada tabela de bloco. Em
 * banco novo elas rodam antes de `20261021_122514_secao_formulario` e
 * morreriam em "relation does not exist" (a armadilha do CLAUDE.md, e a mesma
 * saída do mosaico de parceiros).
 *
 * Sem as chaves estrangeiras para `forms`: a tabela da collection só nasce
 * em 20/10 (`20261021_012219_formularios_do_admin`). Elas ficam na migração
 * da seção, que repete o resto com `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_form_section_layout" AS ENUM('centered', 'side');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_form_section_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_form_section_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_form_section_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "pages_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum_pages_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_form_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum__pages_v_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_form_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum_partners_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum_partners_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_partners_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum_partners_blocks_form_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "partners_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum_segments_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum_segments_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_segments_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum_segments_blocks_form_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "segments_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum__segments_v_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum__segments_v_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__segments_v_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum__segments_v_blocks_form_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_segments_v_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum_solutions_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum_solutions_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_solutions_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum_solutions_blocks_form_section_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "solutions_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"layout" "enum__solutions_v_blocks_form_section_layout" DEFAULT 'centered',
  	"anchor" varchar,
  	"borda" "enum__solutions_v_blocks_form_section_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__solutions_v_blocks_form_section_spacing" DEFAULT 'normal',
  	"theme" "enum__solutions_v_blocks_form_section_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_solutions_v_blocks_form_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_form_section_locales" ADD CONSTRAINT "pages_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_form_section" ADD CONSTRAINT "_pages_v_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_form_section_locales" ADD CONSTRAINT "_pages_v_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_form_section" ADD CONSTRAINT "partners_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_form_section_locales" ADD CONSTRAINT "partners_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_form_section" ADD CONSTRAINT "segments_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_form_section_locales" ADD CONSTRAINT "segments_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_form_section" ADD CONSTRAINT "_segments_v_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_form_section_locales" ADD CONSTRAINT "_segments_v_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_form_section" ADD CONSTRAINT "solutions_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_form_section_locales" ADD CONSTRAINT "solutions_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_form_section" ADD CONSTRAINT "_solutions_v_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_form_section_locales" ADD CONSTRAINT "_solutions_v_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_section_order_idx" ON "pages_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_section_parent_id_idx" ON "pages_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_section_path_idx" ON "pages_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_section_form_idx" ON "pages_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_form_section_locales_locale_parent_id_unique" ON "pages_blocks_form_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_section_order_idx" ON "_pages_v_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_section_parent_id_idx" ON "_pages_v_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_section_path_idx" ON "_pages_v_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_section_form_idx" ON "_pages_v_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_form_section_locales_locale_parent_id_unique" ON "_pages_v_blocks_form_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_form_section_order_idx" ON "partners_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "partners_blocks_form_section_parent_id_idx" ON "partners_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_form_section_path_idx" ON "partners_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "partners_blocks_form_section_form_idx" ON "partners_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "partners_blocks_form_section_locales_locale_parent_id_unique" ON "partners_blocks_form_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_form_section_order_idx" ON "segments_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "segments_blocks_form_section_parent_id_idx" ON "segments_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_form_section_path_idx" ON "segments_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "segments_blocks_form_section_form_idx" ON "segments_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "segments_blocks_form_section_locales_locale_parent_id_unique" ON "segments_blocks_form_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_form_section_order_idx" ON "_segments_v_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_form_section_parent_id_idx" ON "_segments_v_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_form_section_path_idx" ON "_segments_v_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_form_section_form_idx" ON "_segments_v_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_segments_v_blocks_form_section_locales_locale_parent_id_uni" ON "_segments_v_blocks_form_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_form_section_order_idx" ON "solutions_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_form_section_parent_id_idx" ON "solutions_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_form_section_path_idx" ON "solutions_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_form_section_form_idx" ON "solutions_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "solutions_blocks_form_section_locales_locale_parent_id_uniqu" ON "solutions_blocks_form_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_form_section_order_idx" ON "_solutions_v_blocks_form_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_form_section_parent_id_idx" ON "_solutions_v_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_form_section_path_idx" ON "_solutions_v_blocks_form_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_form_section_form_idx" ON "_solutions_v_blocks_form_section" USING btree ("form_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_solutions_v_blocks_form_section_locales_locale_parent_id_un" ON "_solutions_v_blocks_form_section_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[secao-formulario-antecipada] as tabelas são desfeitas pela migração da seção')
}
