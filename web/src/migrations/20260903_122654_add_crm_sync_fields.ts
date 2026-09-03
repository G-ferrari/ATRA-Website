import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN "crm_contact_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "crm_deal_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "crm_synced_at" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN "crm_error" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP COLUMN "crm_contact_id";
  ALTER TABLE "form_submissions" DROP COLUMN "crm_deal_id";
  ALTER TABLE "form_submissions" DROP COLUMN "crm_synced_at";
  ALTER TABLE "form_submissions" DROP COLUMN "crm_error";`)
}
