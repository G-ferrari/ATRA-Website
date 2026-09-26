import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" ADD COLUMN "form_recipients_contact" varchar;
  ALTER TABLE "contact" ADD COLUMN "form_recipients_consultants" varchar;
  ALTER TABLE "contact" ADD COLUMN "form_recipients_diagnostic" varchar;
  ALTER TABLE "contact" ADD COLUMN "form_recipients_careers" varchar;
  ALTER TABLE "contact" ADD COLUMN "form_recipients_chat" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" DROP COLUMN "form_recipients_contact";
  ALTER TABLE "contact" DROP COLUMN "form_recipients_consultants";
  ALTER TABLE "contact" DROP COLUMN "form_recipients_diagnostic";
  ALTER TABLE "contact" DROP COLUMN "form_recipients_careers";
  ALTER TABLE "contact" DROP COLUMN "form_recipients_chat";`)
}
