import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN "utm_source" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "utm_medium" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "utm_campaign" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "utm_term" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "utm_content" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP COLUMN "utm_source";
  ALTER TABLE "form_submissions" DROP COLUMN "utm_medium";
  ALTER TABLE "form_submissions" DROP COLUMN "utm_campaign";
  ALTER TABLE "form_submissions" DROP COLUMN "utm_term";
  ALTER TABLE "form_submissions" DROP COLUMN "utm_content";`)
}
