import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* A collection `press` — "ATRA na mídia" (D-49).
 *
 * ⚠️ O `ADD COLUMN "press_id"` em `payload_locked_documents_rels` tem
 * `IF NOT EXISTS`, posto à mão: em banco novo a coluna já veio de
 * `20260927_215500_locked_documents_press`. Ver o porquê lá. */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_press_kind" AS ENUM('article', 'video');
  CREATE TYPE "public"."enum_press_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__press_v_version_kind" AS ENUM('article', 'video');
  CREATE TYPE "public"."enum__press_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__press_v_published_locale" AS ENUM('pt', 'en');
  CREATE TABLE "press" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"outlet" varchar,
  	"url" varchar,
  	"cover_image_id" integer,
  	"kind" "enum_press_kind" DEFAULT 'article',
  	"published_at" timestamp(3) with time zone,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_press_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "press_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_press_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_outlet" varchar,
  	"version_url" varchar,
  	"version_cover_image_id" integer,
  	"version_kind" "enum__press_v_version_kind" DEFAULT 'article',
  	"version_published_at" timestamp(3) with time zone,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__press_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__press_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_press_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "press_id" integer;
  ALTER TABLE "press" ADD CONSTRAINT "press_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "press_locales" ADD CONSTRAINT "press_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."press"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_press_v" ADD CONSTRAINT "_press_v_parent_id_press_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."press"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_press_v" ADD CONSTRAINT "_press_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_press_v_locales" ADD CONSTRAINT "_press_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_press_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "press_url_idx" ON "press" USING btree ("url");
  CREATE INDEX "press_cover_image_idx" ON "press" USING btree ("cover_image_id");
  CREATE INDEX "press_updated_at_idx" ON "press" USING btree ("updated_at");
  CREATE INDEX "press_created_at_idx" ON "press" USING btree ("created_at");
  CREATE INDEX "press__status_idx" ON "press" USING btree ("_status");
  CREATE UNIQUE INDEX "press_locales_locale_parent_id_unique" ON "press_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_press_v_parent_idx" ON "_press_v" USING btree ("parent_id");
  CREATE INDEX "_press_v_version_version_url_idx" ON "_press_v" USING btree ("version_url");
  CREATE INDEX "_press_v_version_version_cover_image_idx" ON "_press_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_press_v_version_version_updated_at_idx" ON "_press_v" USING btree ("version_updated_at");
  CREATE INDEX "_press_v_version_version_created_at_idx" ON "_press_v" USING btree ("version_created_at");
  CREATE INDEX "_press_v_version_version__status_idx" ON "_press_v" USING btree ("version__status");
  CREATE INDEX "_press_v_created_at_idx" ON "_press_v" USING btree ("created_at");
  CREATE INDEX "_press_v_updated_at_idx" ON "_press_v" USING btree ("updated_at");
  CREATE INDEX "_press_v_snapshot_idx" ON "_press_v" USING btree ("snapshot");
  CREATE INDEX "_press_v_published_locale_idx" ON "_press_v" USING btree ("published_locale");
  CREATE INDEX "_press_v_latest_idx" ON "_press_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_press_v_locales_locale_parent_id_unique" ON "_press_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_fk" FOREIGN KEY ("press_id") REFERENCES "public"."press"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_press_id_idx" ON "payload_locked_documents_rels" USING btree ("press_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "press" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "press_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_press_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_press_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "press" CASCADE;
  DROP TABLE "press_locales" CASCADE;
  DROP TABLE "_press_v" CASCADE;
  DROP TABLE "_press_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_press_fk";
  
  DROP INDEX "payload_locked_documents_rels_press_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "press_id";
  DROP TYPE "public"."enum_press_kind";
  DROP TYPE "public"."enum_press_status";
  DROP TYPE "public"."enum__press_v_version_kind";
  DROP TYPE "public"."enum__press_v_version_status";
  DROP TYPE "public"."enum__press_v_published_locale";`)
}
