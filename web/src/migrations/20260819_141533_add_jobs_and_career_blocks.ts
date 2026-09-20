import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_jobs_location_type" AS ENUM('remote', 'hybrid', 'onsite');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_location_type" AS ENUM('remote', 'hybrid', 'onsite');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_published_locale" AS ENUM('pt', 'en');
  CREATE TYPE "public"."enum_pages_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_seals_banner_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_seals_banner_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_process_steps_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_process_steps_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"location_type" "enum_jobs_location_type" DEFAULT 'remote',
  	"published_at" timestamp(3) with time zone,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "jobs_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"area" varchar,
  	"location" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_location_type" "enum__jobs_v_version_location_type" DEFAULT 'remote',
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__jobs_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_jobs_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_area" varchar,
  	"version_location" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_seals_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_seals_banner_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_seals_banner_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seals_banner_locales" (
  	"title" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_process_steps_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_process_steps_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_seals" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "jobs_id" integer;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_locales" ADD CONSTRAINT "jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_locales" ADD CONSTRAINT "_jobs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seals_banner" ADD CONSTRAINT "pages_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seals_banner_locales" ADD CONSTRAINT "pages_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps" ADD CONSTRAINT "pages_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps_locales" ADD CONSTRAINT "pages_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps" ADD CONSTRAINT "pages_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_locales" ADD CONSTRAINT "pages_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seals_banner" ADD CONSTRAINT "_pages_v_blocks_seals_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seals_banner_locales" ADD CONSTRAINT "_pages_v_blocks_seals_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seals_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps_locales" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_locales" ADD CONSTRAINT "_pages_v_blocks_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_seals" ADD CONSTRAINT "site_settings_seals_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_seals" ADD CONSTRAINT "site_settings_seals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "jobs_seo_seo_og_image_idx" ON "jobs" USING btree ("seo_og_image_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "jobs_locales_locale_parent_id_unique" ON "jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_seo_version_seo_og_image_idx" ON "_jobs_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_snapshot_idx" ON "_jobs_v" USING btree ("snapshot");
  CREATE INDEX "_jobs_v_published_locale_idx" ON "_jobs_v" USING btree ("published_locale");
  CREATE INDEX "_jobs_v_latest_idx" ON "_jobs_v" USING btree ("latest");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "_jobs_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_jobs_v_locales_locale_parent_id_unique" ON "_jobs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_seals_banner_order_idx" ON "pages_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_seals_banner_parent_id_idx" ON "pages_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seals_banner_path_idx" ON "pages_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_seals_banner_locales_locale_parent_id_unique" ON "pages_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_process_steps_steps_order_idx" ON "pages_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_steps_parent_id_idx" ON "pages_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_process_steps_steps_locales_locale_parent_id_un" ON "pages_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_process_steps_order_idx" ON "pages_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_parent_id_idx" ON "pages_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_path_idx" ON "pages_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_process_steps_locales_locale_parent_id_unique" ON "pages_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_seals_banner_order_idx" ON "_pages_v_blocks_seals_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seals_banner_parent_id_idx" ON "_pages_v_blocks_seals_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seals_banner_path_idx" ON "_pages_v_blocks_seals_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_seals_banner_locales_locale_parent_id_unique" ON "_pages_v_blocks_seals_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_order_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_parent_id_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_steps_steps_locales_locale_parent_id" ON "_pages_v_blocks_process_steps_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_order_idx" ON "_pages_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_parent_id_idx" ON "_pages_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_path_idx" ON "_pages_v_blocks_process_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_steps_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_seals_order_idx" ON "site_settings_seals" USING btree ("_order");
  CREATE INDEX "site_settings_seals_parent_id_idx" ON "site_settings_seals" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seals_image_idx" ON "site_settings_seals" USING btree ("image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_seals_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_seals_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_seals_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_seals_banner_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_steps_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_seals" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "jobs_locales" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "_jobs_v_locales" CASCADE;
  DROP TABLE "pages_blocks_seals_banner" CASCADE;
  DROP TABLE "pages_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_process_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_seals_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_seals_banner_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_locales" CASCADE;
  DROP TABLE "site_settings_seals" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_jobs_fk";
  
  DROP INDEX "payload_locked_documents_rels_jobs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "jobs_id";
  DROP TYPE "public"."enum_jobs_location_type";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum__jobs_v_version_location_type";
  DROP TYPE "public"."enum__jobs_v_version_status";
  DROP TYPE "public"."enum__jobs_v_published_locale";
  DROP TYPE "public"."enum_pages_blocks_seals_banner_borda";
  DROP TYPE "public"."enum_pages_blocks_seals_banner_theme";
  DROP TYPE "public"."enum_pages_blocks_process_steps_borda";
  DROP TYPE "public"."enum_pages_blocks_process_steps_theme";
  DROP TYPE "public"."enum__pages_v_blocks_seals_banner_borda";
  DROP TYPE "public"."enum__pages_v_blocks_seals_banner_theme";
  DROP TYPE "public"."enum__pages_v_blocks_process_steps_borda";
  DROP TYPE "public"."enum__pages_v_blocks_process_steps_theme";`)
}
