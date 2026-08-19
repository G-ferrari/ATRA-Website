import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum_pages_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_contact_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_contact_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TYPE "public"."enum__pages_v_blocks_jobs_list_borda" AS ENUM('nenhuma', 'topo', 'ambas');
  CREATE TYPE "public"."enum__pages_v_blocks_jobs_list_theme" AS ENUM('surface-1', 'surface-2');
  CREATE TABLE "pages_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum_pages_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"theme" "enum_pages_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_contact_card" boolean DEFAULT true,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_cta_contact_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_cta_contact_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"borda" "enum__pages_v_blocks_jobs_list_borda" DEFAULT 'nenhuma',
  	"theme" "enum__pages_v_blocks_jobs_list_theme" DEFAULT 'surface-1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_jobs_list_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"empty_text" varchar,
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_cta_contact" ADD CONSTRAINT "pages_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_contact_locales" ADD CONSTRAINT "pages_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_jobs_list" ADD CONSTRAINT "pages_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_jobs_list_locales" ADD CONSTRAINT "pages_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_contact" ADD CONSTRAINT "_pages_v_blocks_cta_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_contact_locales" ADD CONSTRAINT "_pages_v_blocks_cta_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jobs_list" ADD CONSTRAINT "_pages_v_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_jobs_list_locales" ADD CONSTRAINT "_pages_v_blocks_jobs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_jobs_list"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_contact_order_idx" ON "pages_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_contact_parent_id_idx" ON "pages_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_contact_path_idx" ON "pages_blocks_cta_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_contact_locales_locale_parent_id_unique" ON "pages_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_jobs_list_order_idx" ON "pages_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_jobs_list_parent_id_idx" ON "pages_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_jobs_list_path_idx" ON "pages_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_jobs_list_locales_locale_parent_id_unique" ON "pages_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_contact_order_idx" ON "_pages_v_blocks_cta_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_contact_parent_id_idx" ON "_pages_v_blocks_cta_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_contact_path_idx" ON "_pages_v_blocks_cta_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_contact_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_jobs_list_order_idx" ON "_pages_v_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_jobs_list_parent_id_idx" ON "_pages_v_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_jobs_list_path_idx" ON "_pages_v_blocks_jobs_list" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_jobs_list_locales_locale_parent_id_unique" ON "_pages_v_blocks_jobs_list_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_cta_contact" CASCADE;
  DROP TABLE "pages_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "pages_blocks_jobs_list" CASCADE;
  DROP TABLE "pages_blocks_jobs_list_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_contact_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_jobs_list" CASCADE;
  DROP TABLE "_pages_v_blocks_jobs_list_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_cta_contact_borda";
  DROP TYPE "public"."enum_pages_blocks_cta_contact_theme";
  DROP TYPE "public"."enum_pages_blocks_jobs_list_borda";
  DROP TYPE "public"."enum_pages_blocks_jobs_list_theme";
  DROP TYPE "public"."enum__pages_v_blocks_cta_contact_borda";
  DROP TYPE "public"."enum__pages_v_blocks_cta_contact_theme";
  DROP TYPE "public"."enum__pages_v_blocks_jobs_list_borda";
  DROP TYPE "public"."enum__pages_v_blocks_jobs_list_theme";`)
}
