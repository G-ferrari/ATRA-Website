import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ai_usage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"requests" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ai_usage_id" integer;
  ALTER TABLE "atra_ai" ADD COLUMN "daily_request_cap" numeric DEFAULT 500;
  CREATE UNIQUE INDEX "ai_usage_day_idx" ON "ai_usage" USING btree ("day");
  CREATE INDEX "ai_usage_updated_at_idx" ON "ai_usage" USING btree ("updated_at");
  CREATE INDEX "ai_usage_created_at_idx" ON "ai_usage" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_usage_fk" FOREIGN KEY ("ai_usage_id") REFERENCES "public"."ai_usage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_ai_usage_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_usage_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ai_usage" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "ai_usage" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ai_usage_fk";
  
  DROP INDEX "payload_locked_documents_rels_ai_usage_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ai_usage_id";
  ALTER TABLE "atra_ai" DROP COLUMN "daily_request_cap";`)
}
