import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Feature paginas-mestras: a etiqueta do bloco "Lista da seção" e o bloco
 * "Chamada para os webinars". Idempotente sobre o que o gerador emitiu — o
 * mesmo SQL roda antes, em `20260927_215800_paginas_mestras`, pelo motivo
 * explicado lá. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_webinar_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_webinar_teaser_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_webinar_teaser_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_webinar_teaser_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_webinar_teaser_spacing" AS ENUM('normal', 'roomy');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_webinar_teaser_theme" AS ENUM('surface-1', 'surface-2');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "pages_blocks_webinar_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_webinar_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum_pages_blocks_webinar_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum_pages_blocks_webinar_teaser_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_webinar_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"action_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_webinar_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_webinar_teaser_borda" DEFAULT 'nenhuma',
  	"spacing" "enum__pages_v_blocks_webinar_teaser_spacing" DEFAULT 'normal',
  	"theme" "enum__pages_v_blocks_webinar_teaser_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_webinar_teaser_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"action_label" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  ALTER TABLE "pages_blocks_section_listing_locales" ADD COLUMN IF NOT EXISTS "chip" varchar;
  ALTER TABLE "_pages_v_blocks_section_listing_locales" ADD COLUMN IF NOT EXISTS "chip" varchar;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_webinar_teaser" ADD CONSTRAINT "pages_blocks_webinar_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_webinar_teaser_locales" ADD CONSTRAINT "pages_blocks_webinar_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_webinar_teaser"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_webinar_teaser" ADD CONSTRAINT "_pages_v_blocks_webinar_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_webinar_teaser_locales" ADD CONSTRAINT "_pages_v_blocks_webinar_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_webinar_teaser"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_webinar_teaser_order_idx" ON "pages_blocks_webinar_teaser" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_webinar_teaser_parent_id_idx" ON "pages_blocks_webinar_teaser" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_webinar_teaser_path_idx" ON "pages_blocks_webinar_teaser" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_webinar_teaser_locales_locale_parent_id_unique" ON "pages_blocks_webinar_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_webinar_teaser_order_idx" ON "_pages_v_blocks_webinar_teaser" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_webinar_teaser_parent_id_idx" ON "_pages_v_blocks_webinar_teaser" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_webinar_teaser_path_idx" ON "_pages_v_blocks_webinar_teaser" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_blocks_webinar_teaser_locales_locale_parent_id_uniq" ON "_pages_v_blocks_webinar_teaser_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_webinar_teaser" CASCADE;
  DROP TABLE "pages_blocks_webinar_teaser_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_webinar_teaser" CASCADE;
  DROP TABLE "_pages_v_blocks_webinar_teaser_locales" CASCADE;
  ALTER TABLE "pages_blocks_section_listing_locales" DROP COLUMN "chip";
  ALTER TABLE "_pages_v_blocks_section_listing_locales" DROP COLUMN "chip";
  DROP TYPE "public"."enum_pages_blocks_webinar_teaser_borda";
  DROP TYPE "public"."enum_pages_blocks_webinar_teaser_spacing";
  DROP TYPE "public"."enum_pages_blocks_webinar_teaser_theme";
  DROP TYPE "public"."enum__pages_v_blocks_webinar_teaser_borda";
  DROP TYPE "public"."enum__pages_v_blocks_webinar_teaser_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_webinar_teaser_theme";`)
}
