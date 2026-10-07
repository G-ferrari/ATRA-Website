import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* D-54 — o alvo da sincronização de leads passa do RD Station CRM para o RD
 * Station Marketing.
 *
 * Escrita à mão, e não pelo `migrate:create`: a remoção das colunas `crm_*`
 * vira pergunta interativa do drizzle, que não roda sem TTY (ver "Armadilhas"
 * no CLAUDE.md). As quatro colunas estão vazias em todo ambiente — o token do
 * CRM nunca foi provisionado —, então removê-las não perde dado; o `down`
 * recria-as vazias.
 *
 * Idempotente (`IF NOT EXISTS` / `IF EXISTS`) pelo mesmo motivo das outras
 * migrações de 27/09: em banco novo as migrações de dados consultam a
 * collection com o config de hoje, e a coluna precisa existir antes. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "rd_event_uuid" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "rd_synced_at" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "rd_error" varchar;
  ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "crm_contact_id";
  ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "crm_deal_id";
  ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "crm_synced_at";
  ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "crm_error";
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_enabled" boolean DEFAULT true;
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_custom_fields" boolean DEFAULT false;
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_contact" varchar DEFAULT 'site-contato';
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_chat_lead" varchar DEFAULT 'site-chat';
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_newsletter" varchar DEFAULT 'site-newsletter';
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_material_download" varchar DEFAULT 'site-download-material';
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_consultant_request" varchar DEFAULT 'site-solicitacao-consultores';
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_data_maturity_diagnostic" varchar DEFAULT 'site-diagnostico-maturidade';
  ALTER TABLE "tracking" ADD COLUMN IF NOT EXISTS "rd_station_loader_id" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "rd_event_uuid";
  ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "rd_synced_at";
  ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "rd_error";
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "crm_contact_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "crm_deal_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "crm_synced_at" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "crm_error" varchar;
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_enabled";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_custom_fields";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_contact";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_chat_lead";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_newsletter";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_material_download";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_consultant_request";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_data_maturity_diagnostic";
  ALTER TABLE "tracking" DROP COLUMN IF EXISTS "rd_station_loader_id";`)
}
