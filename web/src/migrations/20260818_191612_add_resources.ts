import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_kind" AS ENUM('report', 'ebook');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_version_kind" AS ENUM('report', 'ebook');
  CREATE TYPE "public"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_published_locale" AS ENUM('pt', 'en');
  CREATE TABLE "resources_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_resources_kind" DEFAULT 'report',
  	"cover_image_id" integer,
  	"pages" numeric,
  	"published_at" timestamp(3) with time zone,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "resources_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"body" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_resources_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__resources_v_version_kind" DEFAULT 'report',
  	"version_cover_image_id" integer,
  	"version_pages" numeric,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__resources_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_resources_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_body" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "resources_tags" ADD CONSTRAINT "resources_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_locales" ADD CONSTRAINT "resources_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_version_tags" ADD CONSTRAINT "_resources_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_locales" ADD CONSTRAINT "_resources_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "resources_tags_order_idx" ON "resources_tags" USING btree ("_order");
  CREATE INDEX "resources_tags_parent_id_idx" ON "resources_tags" USING btree ("_parent_id");
  CREATE INDEX "resources_tags_locale_idx" ON "resources_tags" USING btree ("_locale");
  CREATE INDEX "resources_kind_idx" ON "resources" USING btree ("kind");
  CREATE INDEX "resources_cover_image_idx" ON "resources" USING btree ("cover_image_id");
  CREATE INDEX "resources_seo_seo_og_image_idx" ON "resources" USING btree ("seo_og_image_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "resources" USING btree ("_status");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "resources_locales_locale_parent_id_unique" ON "resources_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_resources_v_version_tags_order_idx" ON "_resources_v_version_tags" USING btree ("_order");
  CREATE INDEX "_resources_v_version_tags_parent_id_idx" ON "_resources_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_version_tags_locale_idx" ON "_resources_v_version_tags" USING btree ("_locale");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_kind_idx" ON "_resources_v" USING btree ("version_kind");
  CREATE INDEX "_resources_v_version_version_cover_image_idx" ON "_resources_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_resources_v_version_seo_version_seo_og_image_idx" ON "_resources_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_snapshot_idx" ON "_resources_v" USING btree ("snapshot");
  CREATE INDEX "_resources_v_published_locale_idx" ON "_resources_v" USING btree ("published_locale");
  CREATE INDEX "_resources_v_latest_idx" ON "_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_resources_v_locales_locale_parent_id_unique" ON "_resources_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resources_tags" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_locales" CASCADE;
  DROP TABLE "_resources_v_version_tags" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "_resources_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resources_fk";
  
  DROP INDEX "payload_locked_documents_rels_resources_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resources_id";
  DROP TYPE "public"."enum_resources_kind";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum__resources_v_version_kind";
  DROP TYPE "public"."enum__resources_v_version_status";
  DROP TYPE "public"."enum__resources_v_published_locale";`)
}
