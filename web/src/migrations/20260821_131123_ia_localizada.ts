import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "atra_ai_locales" (
  	"system_prompt" varchar NOT NULL,
  	"unavailable_message" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "atra_ai_locales" ADD CONSTRAINT "atra_ai_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."atra_ai"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "atra_ai_locales_locale_parent_id_unique" ON "atra_ai_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "atra_ai" DROP COLUMN "system_prompt";
  ALTER TABLE "atra_ai" DROP COLUMN "unavailable_message";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "atra_ai_locales" CASCADE;
  ALTER TABLE "atra_ai" ADD COLUMN "system_prompt" varchar NOT NULL;
  ALTER TABLE "atra_ai" ADD COLUMN "unavailable_message" varchar NOT NULL;`)
}
