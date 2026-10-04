import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conversion_panel_paths_icon" AS ENUM('sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart', 'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check', 'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book', 'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server', 'code', 'headset');
  CREATE TABLE "conversion_panel_paths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_conversion_panel_paths_icon" DEFAULT 'sparkles' NOT NULL,
  	"href" varchar DEFAULT '/diagnostico-maturidade' NOT NULL
  );
  
  CREATE TABLE "conversion_panel_paths_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "conversion_panel_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "conversion_panel_proof_locales" (
  	"value" varchar NOT NULL,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "conversion_panel" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar DEFAULT '/contato',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "conversion_panel_locales" (
  	"title" varchar,
  	"intro" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "conversion_panel_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cases_id" integer
  );
  
  ALTER TABLE "conversion_panel_paths" ADD CONSTRAINT "conversion_panel_paths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversion_panel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversion_panel_paths_locales" ADD CONSTRAINT "conversion_panel_paths_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversion_panel_paths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversion_panel_proof" ADD CONSTRAINT "conversion_panel_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversion_panel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversion_panel_proof_locales" ADD CONSTRAINT "conversion_panel_proof_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversion_panel_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversion_panel_locales" ADD CONSTRAINT "conversion_panel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversion_panel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversion_panel_rels" ADD CONSTRAINT "conversion_panel_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."conversion_panel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversion_panel_rels" ADD CONSTRAINT "conversion_panel_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conversion_panel_paths_order_idx" ON "conversion_panel_paths" USING btree ("_order");
  CREATE INDEX "conversion_panel_paths_parent_id_idx" ON "conversion_panel_paths" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "conversion_panel_paths_locales_locale_parent_id_unique" ON "conversion_panel_paths_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "conversion_panel_proof_order_idx" ON "conversion_panel_proof" USING btree ("_order");
  CREATE INDEX "conversion_panel_proof_parent_id_idx" ON "conversion_panel_proof" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "conversion_panel_proof_locales_locale_parent_id_unique" ON "conversion_panel_proof_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "conversion_panel_locales_locale_parent_id_unique" ON "conversion_panel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "conversion_panel_rels_order_idx" ON "conversion_panel_rels" USING btree ("order");
  CREATE INDEX "conversion_panel_rels_parent_idx" ON "conversion_panel_rels" USING btree ("parent_id");
  CREATE INDEX "conversion_panel_rels_path_idx" ON "conversion_panel_rels" USING btree ("path");
  CREATE INDEX "conversion_panel_rels_cases_id_idx" ON "conversion_panel_rels" USING btree ("cases_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "conversion_panel_paths" CASCADE;
  DROP TABLE "conversion_panel_paths_locales" CASCADE;
  DROP TABLE "conversion_panel_proof" CASCADE;
  DROP TABLE "conversion_panel_proof_locales" CASCADE;
  DROP TABLE "conversion_panel" CASCADE;
  DROP TABLE "conversion_panel_locales" CASCADE;
  DROP TABLE "conversion_panel_rels" CASCADE;
  DROP TYPE "public"."enum_conversion_panel_paths_icon";`)
}
