import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_webinars_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__webinars_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__webinars_v_published_locale" AS ENUM('pt', 'en');
  CREATE TABLE "webinars_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "webinars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"duration" varchar DEFAULT '45:00',
  	"video_url" varchar,
  	"order" numeric DEFAULT 0,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_webinars_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "webinars_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"date_label" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_webinars_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_webinars_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_image_id" integer,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_duration" varchar DEFAULT '45:00',
  	"version_video_url" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__webinars_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__webinars_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_webinars_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_date_label" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "webinars_id" integer;
  ALTER TABLE "webinars_tags" ADD CONSTRAINT "webinars_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "webinars" ADD CONSTRAINT "webinars_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars" ADD CONSTRAINT "webinars_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webinars_locales" ADD CONSTRAINT "webinars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_webinars_v_version_tags" ADD CONSTRAINT "_webinars_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_webinars_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_parent_id_webinars_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."webinars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v" ADD CONSTRAINT "_webinars_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_webinars_v_locales" ADD CONSTRAINT "_webinars_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_webinars_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "webinars_tags_order_idx" ON "webinars_tags" USING btree ("_order");
  CREATE INDEX "webinars_tags_parent_id_idx" ON "webinars_tags" USING btree ("_parent_id");
  CREATE INDEX "webinars_tags_locale_idx" ON "webinars_tags" USING btree ("_locale");
  CREATE INDEX "webinars_cover_image_idx" ON "webinars" USING btree ("cover_image_id");
  CREATE INDEX "webinars_seo_seo_og_image_idx" ON "webinars" USING btree ("seo_og_image_id");
  CREATE INDEX "webinars_updated_at_idx" ON "webinars" USING btree ("updated_at");
  CREATE INDEX "webinars_created_at_idx" ON "webinars" USING btree ("created_at");
  CREATE INDEX "webinars__status_idx" ON "webinars" USING btree ("_status");
  CREATE UNIQUE INDEX "webinars_slug_idx" ON "webinars_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "webinars_locales_locale_parent_id_unique" ON "webinars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_webinars_v_version_tags_order_idx" ON "_webinars_v_version_tags" USING btree ("_order");
  CREATE INDEX "_webinars_v_version_tags_parent_id_idx" ON "_webinars_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_webinars_v_version_tags_locale_idx" ON "_webinars_v_version_tags" USING btree ("_locale");
  CREATE INDEX "_webinars_v_parent_idx" ON "_webinars_v" USING btree ("parent_id");
  CREATE INDEX "_webinars_v_version_version_cover_image_idx" ON "_webinars_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_webinars_v_version_seo_version_seo_og_image_idx" ON "_webinars_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_webinars_v_version_version_updated_at_idx" ON "_webinars_v" USING btree ("version_updated_at");
  CREATE INDEX "_webinars_v_version_version_created_at_idx" ON "_webinars_v" USING btree ("version_created_at");
  CREATE INDEX "_webinars_v_version_version__status_idx" ON "_webinars_v" USING btree ("version__status");
  CREATE INDEX "_webinars_v_created_at_idx" ON "_webinars_v" USING btree ("created_at");
  CREATE INDEX "_webinars_v_updated_at_idx" ON "_webinars_v" USING btree ("updated_at");
  CREATE INDEX "_webinars_v_snapshot_idx" ON "_webinars_v" USING btree ("snapshot");
  CREATE INDEX "_webinars_v_published_locale_idx" ON "_webinars_v" USING btree ("published_locale");
  CREATE INDEX "_webinars_v_latest_idx" ON "_webinars_v" USING btree ("latest");
  CREATE INDEX "_webinars_v_version_version_slug_idx" ON "_webinars_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_webinars_v_locales_locale_parent_id_unique" ON "_webinars_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webinars_fk" FOREIGN KEY ("webinars_id") REFERENCES "public"."webinars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_webinars_id_idx" ON "payload_locked_documents_rels" USING btree ("webinars_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "webinars_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "webinars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "webinars_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_webinars_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "webinars_tags" CASCADE;
  DROP TABLE "webinars" CASCADE;
  DROP TABLE "webinars_locales" CASCADE;
  DROP TABLE "_webinars_v_version_tags" CASCADE;
  DROP TABLE "_webinars_v" CASCADE;
  DROP TABLE "_webinars_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_webinars_fk";
  
  DROP INDEX "payload_locked_documents_rels_webinars_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "webinars_id";
  DROP TYPE "public"."enum_webinars_status";
  DROP TYPE "public"."enum__webinars_v_version_status";
  DROP TYPE "public"."enum__webinars_v_published_locale";`)
}
