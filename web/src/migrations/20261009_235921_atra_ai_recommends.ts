import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_atra_ai_recommends" AS ENUM('solutions', 'segments', 'cases', 'webinars', 'ebooks', 'posts', 'pages');
  CREATE TABLE "atra_ai_recommends" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_atra_ai_recommends",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "atra_ai_recommends" ADD CONSTRAINT "atra_ai_recommends_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."atra_ai"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "atra_ai_recommends_order_idx" ON "atra_ai_recommends" USING btree ("order");
  CREATE INDEX "atra_ai_recommends_parent_idx" ON "atra_ai_recommends" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "atra_ai_recommends" CASCADE;
  DROP TYPE "public"."enum_atra_ai_recommends";`)
}
