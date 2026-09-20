import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cookie_consent" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cookie_consent_locales" (
  	"banner_title" varchar,
  	"banner_message" varchar,
  	"accept_label" varchar,
  	"reject_label" varchar,
  	"preferences_label" varchar,
  	"save_label" varchar,
  	"panel_title" varchar,
  	"panel_message" varchar,
  	"necessary_name" varchar,
  	"necessary_description" varchar,
  	"analytics_name" varchar,
  	"analytics_description" varchar,
  	"marketing_name" varchar,
  	"marketing_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "cookie_consent_locales" ADD CONSTRAINT "cookie_consent_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cookie_consent"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "cookie_consent_locales_locale_parent_id_unique" ON "cookie_consent_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cookie_consent" CASCADE;
  DROP TABLE "cookie_consent_locales" CASCADE;`)
}
