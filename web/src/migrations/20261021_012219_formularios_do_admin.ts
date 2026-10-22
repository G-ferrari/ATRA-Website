import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('name', 'email', 'phone', 'company', 'jobTitle', 'shortText', 'longText', 'select', 'checkbox');
  CREATE TYPE "public"."enum_forms_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_forms_after_submit" AS ENUM('message', 'page');
  CREATE TYPE "public"."enum_forms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__forms_v_version_fields_type" AS ENUM('name', 'email', 'phone', 'company', 'jobTitle', 'shortText', 'longText', 'select', 'checkbox');
  CREATE TYPE "public"."enum__forms_v_version_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum__forms_v_version_after_submit" AS ENUM('message', 'page');
  CREATE TYPE "public"."enum__forms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__forms_v_published_locale" AS ENUM('pt', 'en');
  CREATE TABLE "forms_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "forms_fields_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_forms_fields_type" DEFAULT 'shortText',
  	"width" "enum_forms_fields_width" DEFAULT 'full',
  	"required" boolean DEFAULT false,
  	"consent" boolean DEFAULT false,
  	"rd_field" varchar
  );
  
  CREATE TABLE "forms_fields_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"after_submit" "enum_forms_after_submit" DEFAULT 'message',
  	"redirect_path" varchar,
  	"rd_conversion_identifier" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_forms_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_label" varchar,
  	"notice" varchar,
  	"success_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_forms_v_version_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_version_fields_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_forms_v_version_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__forms_v_version_fields_type" DEFAULT 'shortText',
  	"width" "enum__forms_v_version_fields_width" DEFAULT 'full',
  	"required" boolean DEFAULT false,
  	"consent" boolean DEFAULT false,
  	"rd_field" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_version_fields_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_forms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_after_submit" "enum__forms_v_version_after_submit" DEFAULT 'message',
  	"version_redirect_path" varchar,
  	"version_rd_conversion_identifier" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__forms_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__forms_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_forms_v_locales" (
  	"version_submit_label" varchar,
  	"version_notice" varchar,
  	"version_success_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_forms_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  -- ⚠️ IF NOT EXISTS: a coluna já nasce em 20260927_215510_locked_documents_forms, que roda antes em banco novo.
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "forms_id" integer;
  ALTER TABLE "forms_fields_options" ADD CONSTRAINT "forms_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_options_locales" ADD CONSTRAINT "forms_fields_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_locales" ADD CONSTRAINT "forms_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_texts" ADD CONSTRAINT "forms_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_version_fields_options" ADD CONSTRAINT "_forms_v_version_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_version_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_version_fields_options_locales" ADD CONSTRAINT "_forms_v_version_fields_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_version_fields_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_version_fields" ADD CONSTRAINT "_forms_v_version_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_version_fields_locales" ADD CONSTRAINT "_forms_v_version_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_version_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v" ADD CONSTRAINT "_forms_v_parent_id_forms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_forms_v_locales" ADD CONSTRAINT "_forms_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_texts" ADD CONSTRAINT "_forms_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_fields_options_order_idx" ON "forms_fields_options" USING btree ("_order");
  CREATE INDEX "forms_fields_options_parent_id_idx" ON "forms_fields_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_fields_options_locales_locale_parent_id_unique" ON "forms_fields_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_fields_locales_locale_parent_id_unique" ON "forms_fields_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms__status_idx" ON "forms" USING btree ("_status");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_texts_order_parent" ON "forms_texts" USING btree ("order","parent_id");
  CREATE INDEX "_forms_v_version_fields_options_order_idx" ON "_forms_v_version_fields_options" USING btree ("_order");
  CREATE INDEX "_forms_v_version_fields_options_parent_id_idx" ON "_forms_v_version_fields_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_forms_v_version_fields_options_locales_locale_parent_id_uni" ON "_forms_v_version_fields_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_forms_v_version_fields_order_idx" ON "_forms_v_version_fields" USING btree ("_order");
  CREATE INDEX "_forms_v_version_fields_parent_id_idx" ON "_forms_v_version_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_forms_v_version_fields_locales_locale_parent_id_unique" ON "_forms_v_version_fields_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_forms_v_parent_idx" ON "_forms_v" USING btree ("parent_id");
  CREATE INDEX "_forms_v_version_version_updated_at_idx" ON "_forms_v" USING btree ("version_updated_at");
  CREATE INDEX "_forms_v_version_version_created_at_idx" ON "_forms_v" USING btree ("version_created_at");
  CREATE INDEX "_forms_v_version_version__status_idx" ON "_forms_v" USING btree ("version__status");
  CREATE INDEX "_forms_v_created_at_idx" ON "_forms_v" USING btree ("created_at");
  CREATE INDEX "_forms_v_updated_at_idx" ON "_forms_v" USING btree ("updated_at");
  CREATE INDEX "_forms_v_snapshot_idx" ON "_forms_v" USING btree ("snapshot");
  CREATE INDEX "_forms_v_published_locale_idx" ON "_forms_v" USING btree ("published_locale");
  CREATE INDEX "_forms_v_latest_idx" ON "_forms_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_forms_v_locales_locale_parent_id_unique" ON "_forms_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_forms_v_texts_order_parent" ON "_forms_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_fields_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_fields_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_version_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_version_fields_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_version_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_version_fields_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_fields_options" CASCADE;
  DROP TABLE "forms_fields_options_locales" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms_fields_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "forms_texts" CASCADE;
  DROP TABLE "_forms_v_version_fields_options" CASCADE;
  DROP TABLE "_forms_v_version_fields_options_locales" CASCADE;
  DROP TABLE "_forms_v_version_fields" CASCADE;
  DROP TABLE "_forms_v_version_fields_locales" CASCADE;
  DROP TABLE "_forms_v" CASCADE;
  DROP TABLE "_forms_v_locales" CASCADE;
  DROP TABLE "_forms_v_texts" CASCADE;
  -- ⚠️ IF EXISTS: o DROP TABLE "forms" CASCADE acima já levou a chave estrangeira, e sem isto a volta falhava.
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_forms_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_forms_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "forms_id";
  DROP TYPE "public"."enum_forms_fields_type";
  DROP TYPE "public"."enum_forms_fields_width";
  DROP TYPE "public"."enum_forms_after_submit";
  DROP TYPE "public"."enum_forms_status";
  DROP TYPE "public"."enum__forms_v_version_fields_type";
  DROP TYPE "public"."enum__forms_v_version_fields_width";
  DROP TYPE "public"."enum__forms_v_version_after_submit";
  DROP TYPE "public"."enum__forms_v_version_status";
  DROP TYPE "public"."enum__forms_v_published_locale";`)
}
