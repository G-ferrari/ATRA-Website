import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'data-maturity-diagnostic';
  CREATE TABLE "data_maturity_diagnostic" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"agenda_url" varchar,
  	"whatsapp_url" varchar DEFAULT 'https://api.whatsapp.com/send/?phone=5511963060267&text=Oi+Fabio+vamos+agendar+um+papo&type=phone_number&app_absent=0',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "data_maturity_diagnostic_locales" (
  	"title" varchar DEFAULT 'Em 5 minutos, descubra onde sua empresa está na jornada de dados e nos reguladores de 2026-2027.',
  	"intro" varchar DEFAULT 'Três informações nos ajudam a mostrar apenas as perguntas relevantes para o seu setor e regulação.',
  	"done_message" varchar DEFAULT 'Em breve você recebe por e-mail a leitura completa. Se preferir, um especialista da ATRA pode comentar os resultados com você agora.',
  	"email_subject" varchar DEFAULT 'Seu Diagnóstico de Maturidade de Dados — ATRA',
  	"email_intro" varchar DEFAULT 'Obrigado por responder ao Diagnóstico de Maturidade de Dados da ATRA. Abaixo está a leitura das suas respostas: o nível de maturidade, os pilares que pedem mais atenção e um roteiro de próximos passos.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_sector" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_size" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_role" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_average" numeric;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_level" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_pillars" jsonb;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_dama" jsonb;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_gaps" jsonb;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_top_gaps" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_answers" jsonb;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_roadmap" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_version" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "diagnostic_duration_seconds" numeric;
  ALTER TABLE "form_submissions" ADD COLUMN "result_sent_at" timestamp(3) with time zone;
  ALTER TABLE "data_maturity_diagnostic_locales" ADD CONSTRAINT "data_maturity_diagnostic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "data_maturity_diagnostic_locales_locale_parent_id_unique" ON "data_maturity_diagnostic_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "data_maturity_diagnostic" CASCADE;
  DROP TABLE "data_maturity_diagnostic_locales" CASCADE;
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_kind";
  CREATE TYPE "public"."enum_form_submissions_kind" AS ENUM('contact', 'chat-lead', 'newsletter', 'talent-pool', 'job-application', 'material-download', 'rc18-diagnostic', 'consultant-request');
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_form_submissions_kind" USING "kind"::"public"."enum_form_submissions_kind";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_sector";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_size";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_role";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_average";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_level";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_pillars";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_dama";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_gaps";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_top_gaps";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_answers";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_roadmap";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_version";
  ALTER TABLE "form_submissions" DROP COLUMN "diagnostic_duration_seconds";
  ALTER TABLE "form_submissions" DROP COLUMN "result_sent_at";`)
}
