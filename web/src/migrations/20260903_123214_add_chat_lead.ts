import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'chat-lead' BEFORE 'newsletter';
  ALTER TABLE "form_submissions" ADD COLUMN "chat_context" varchar;
  ALTER TABLE "atra_ai" ADD COLUMN "lead_capture_enabled" boolean DEFAULT false;
  ALTER TABLE "atra_ai" ADD COLUMN "lead_capture_invite_after_user_messages" numeric DEFAULT 2 NOT NULL;
  ALTER TABLE "atra_ai_locales" ADD COLUMN "lead_capture_invite_title" varchar;
  ALTER TABLE "atra_ai_locales" ADD COLUMN "lead_capture_invite_message" varchar;
  ALTER TABLE "atra_ai_locales" ADD COLUMN "lead_capture_consent_notice" varchar;
  ALTER TABLE "atra_ai_locales" ADD COLUMN "lead_capture_success_message" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_kind";
  CREATE TYPE "public"."enum_form_submissions_kind" AS ENUM('contact', 'newsletter', 'talent-pool', 'job-application', 'material-download');
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_form_submissions_kind" USING "kind"::"public"."enum_form_submissions_kind";
  ALTER TABLE "form_submissions" DROP COLUMN "chat_context";
  ALTER TABLE "atra_ai" DROP COLUMN "lead_capture_enabled";
  ALTER TABLE "atra_ai" DROP COLUMN "lead_capture_invite_after_user_messages";
  ALTER TABLE "atra_ai_locales" DROP COLUMN "lead_capture_invite_title";
  ALTER TABLE "atra_ai_locales" DROP COLUMN "lead_capture_invite_message";
  ALTER TABLE "atra_ai_locales" DROP COLUMN "lead_capture_consent_notice";
  ALTER TABLE "atra_ai_locales" DROP COLUMN "lead_capture_success_message";`)
}
