import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'custom-form';
  CREATE TABLE "form_submissions_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_id" varchar,
  	"label" varchar,
  	"value" varchar
  );
  
  ALTER TABLE "form_submissions" ADD COLUMN "form_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "communication_consent" boolean DEFAULT false;
  ALTER TABLE "form_submissions_answers" ADD CONSTRAINT "form_submissions_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "form_submissions_answers_order_idx" ON "form_submissions_answers" USING btree ("_order");
  CREATE INDEX "form_submissions_answers_parent_id_idx" ON "form_submissions_answers" USING btree ("_parent_id");
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions_answers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "form_submissions_answers" CASCADE;
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_form_id_forms_id_fk";
  
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_kind";
  CREATE TYPE "public"."enum_form_submissions_kind" AS ENUM('contact', 'chat-lead', 'newsletter', 'talent-pool', 'job-application', 'material-download', 'rc18-diagnostic', 'consultant-request', 'data-maturity-diagnostic');
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_form_submissions_kind" USING "kind"::"public"."enum_form_submissions_kind";
  DROP INDEX "form_submissions_form_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "form_id";
  ALTER TABLE "form_submissions" DROP COLUMN "communication_consent";`)
}
