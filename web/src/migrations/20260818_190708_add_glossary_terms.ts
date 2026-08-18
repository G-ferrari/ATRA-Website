import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "glossary_terms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "glossary_terms_locales" (
  	"term" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"definition" varchar NOT NULL,
  	"category" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_terms_id" integer;
  ALTER TABLE "glossary_terms_locales" ADD CONSTRAINT "glossary_terms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "glossary_terms_updated_at_idx" ON "glossary_terms" USING btree ("updated_at");
  CREATE INDEX "glossary_terms_created_at_idx" ON "glossary_terms" USING btree ("created_at");
  CREATE UNIQUE INDEX "glossary_terms_slug_idx" ON "glossary_terms_locales" USING btree ("slug","_locale");
  CREATE INDEX "glossary_terms_category_idx" ON "glossary_terms_locales" USING btree ("category","_locale");
  CREATE UNIQUE INDEX "glossary_terms_locales_locale_parent_id_unique" ON "glossary_terms_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_terms_fk" FOREIGN KEY ("glossary_terms_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_glossary_terms_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_terms_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "glossary_terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "glossary_terms_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "glossary_terms" CASCADE;
  DROP TABLE "glossary_terms_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_glossary_terms_fk";
  
  DROP INDEX "payload_locked_documents_rels_glossary_terms_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "glossary_terms_id";`)
}
