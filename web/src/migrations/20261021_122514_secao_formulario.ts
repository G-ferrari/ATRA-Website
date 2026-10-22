import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Task 051 — as tabelas da seção "Formulário" (`formSection`) em Páginas,
 * Soluções, Segmentos e Parceiros.
 *
 * Tudo com `IF NOT EXISTS`: em banco novo as tabelas já nasceram na antecipada
 * (`20260927_220000_secao_formulario_antecipada`), e o que fica para esta são
 * as chaves estrangeiras para `forms`, que lá ainda não existia. */
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
    ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_form_section_locales" ADD CONSTRAINT "pages_blocks_form_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_form_section" ADD CONSTRAINT "_pages_v_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
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
    ALTER TABLE "partners_blocks_form_section" ADD CONSTRAINT "partners_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
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
    ALTER TABLE "segments_blocks_form_section" ADD CONSTRAINT "segments_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
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
    ALTER TABLE "_segments_v_blocks_form_section" ADD CONSTRAINT "_segments_v_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
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
    ALTER TABLE "solutions_blocks_form_section" ADD CONSTRAINT "solutions_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
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
    ALTER TABLE "_solutions_v_blocks_form_section" ADD CONSTRAINT "_solutions_v_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
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

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_form_section" CASCADE;
  DROP TABLE "pages_blocks_form_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_locales" CASCADE;
  DROP TABLE "partners_blocks_form_section" CASCADE;
  DROP TABLE "partners_blocks_form_section_locales" CASCADE;
  DROP TABLE "segments_blocks_form_section" CASCADE;
  DROP TABLE "segments_blocks_form_section_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_form_section" CASCADE;
  DROP TABLE "_segments_v_blocks_form_section_locales" CASCADE;
  DROP TABLE "solutions_blocks_form_section" CASCADE;
  DROP TABLE "solutions_blocks_form_section_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_form_section" CASCADE;
  DROP TABLE "_solutions_v_blocks_form_section_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_form_section_layout";
  DROP TYPE "public"."enum_pages_blocks_form_section_borda";
  DROP TYPE "public"."enum_pages_blocks_form_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_form_section_theme";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_layout";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_borda";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_theme";
  DROP TYPE "public"."enum_partners_blocks_form_section_layout";
  DROP TYPE "public"."enum_partners_blocks_form_section_borda";
  DROP TYPE "public"."enum_partners_blocks_form_section_spacing";
  DROP TYPE "public"."enum_partners_blocks_form_section_theme";
  DROP TYPE "public"."enum_segments_blocks_form_section_layout";
  DROP TYPE "public"."enum_segments_blocks_form_section_borda";
  DROP TYPE "public"."enum_segments_blocks_form_section_spacing";
  DROP TYPE "public"."enum_segments_blocks_form_section_theme";
  DROP TYPE "public"."enum__segments_v_blocks_form_section_layout";
  DROP TYPE "public"."enum__segments_v_blocks_form_section_borda";
  DROP TYPE "public"."enum__segments_v_blocks_form_section_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_form_section_theme";
  DROP TYPE "public"."enum_solutions_blocks_form_section_layout";
  DROP TYPE "public"."enum_solutions_blocks_form_section_borda";
  DROP TYPE "public"."enum_solutions_blocks_form_section_spacing";
  DROP TYPE "public"."enum_solutions_blocks_form_section_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_form_section_layout";
  DROP TYPE "public"."enum__solutions_v_blocks_form_section_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_form_section_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_form_section_theme";`)
}
