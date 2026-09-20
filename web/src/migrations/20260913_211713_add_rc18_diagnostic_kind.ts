import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'rc18-diagnostic';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_kind";
  CREATE TYPE "public"."enum_form_submissions_kind" AS ENUM('contact', 'chat-lead', 'newsletter', 'talent-pool', 'job-application', 'material-download');
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_form_submissions_kind" USING "kind"::"public"."enum_form_submissions_kind";`)
}
