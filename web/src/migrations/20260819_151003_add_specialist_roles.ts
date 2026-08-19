import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_specialist_roles_level" AS ENUM('Senior', 'Pleno', 'Lead / Principal');
  CREATE TYPE "public"."enum_specialist_roles_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award');
  CREATE TABLE "specialist_roles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "specialist_roles_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "specialist_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"level" "enum_specialist_roles_level" NOT NULL,
  	"icon" "enum_specialist_roles_icon" DEFAULT 'sparkles' NOT NULL,
  	"allocated_projects" numeric,
  	"allocated_partners" numeric,
  	"total_team_size" numeric,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "specialist_roles_locales" (
  	"role" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "specialist_roles_id" integer;
  ALTER TABLE "specialist_roles_tags" ADD CONSTRAINT "specialist_roles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specialist_roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialist_roles_certifications" ADD CONSTRAINT "specialist_roles_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specialist_roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialist_roles_locales" ADD CONSTRAINT "specialist_roles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specialist_roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "specialist_roles_tags_order_idx" ON "specialist_roles_tags" USING btree ("_order");
  CREATE INDEX "specialist_roles_tags_parent_id_idx" ON "specialist_roles_tags" USING btree ("_parent_id");
  CREATE INDEX "specialist_roles_certifications_order_idx" ON "specialist_roles_certifications" USING btree ("_order");
  CREATE INDEX "specialist_roles_certifications_parent_id_idx" ON "specialist_roles_certifications" USING btree ("_parent_id");
  CREATE INDEX "specialist_roles_certifications_locale_idx" ON "specialist_roles_certifications" USING btree ("_locale");
  CREATE INDEX "specialist_roles_updated_at_idx" ON "specialist_roles" USING btree ("updated_at");
  CREATE INDEX "specialist_roles_created_at_idx" ON "specialist_roles" USING btree ("created_at");
  CREATE UNIQUE INDEX "specialist_roles_locales_locale_parent_id_unique" ON "specialist_roles_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specialist_roles_fk" FOREIGN KEY ("specialist_roles_id") REFERENCES "public"."specialist_roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_specialist_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("specialist_roles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "specialist_roles_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "specialist_roles_certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "specialist_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "specialist_roles_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "specialist_roles_tags" CASCADE;
  DROP TABLE "specialist_roles_certifications" CASCADE;
  DROP TABLE "specialist_roles" CASCADE;
  DROP TABLE "specialist_roles_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_specialist_roles_fk";
  
  DROP INDEX "payload_locked_documents_rels_specialist_roles_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "specialist_roles_id";
  DROP TYPE "public"."enum_specialist_roles_level";
  DROP TYPE "public"."enum_specialist_roles_icon";`)
}
