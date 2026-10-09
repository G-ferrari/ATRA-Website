import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_financeiro" AS ENUM('rc18', 'bcb', 'cmn5274', 'bcbs239', 'openfinance', 'ifrs9', 'pld', 'ifrs17', 'cvm', 'susep', 'anatel');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_capitais" AS ENUM('cvm', 'cvm244', 'anbima', 'pld', 'bcb', 'ifrs9', 'ifrs17', 'susep', 'anatel');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_seguros" AS ENUM('susep', 'sro', 'openinsurance', 'ifrs17', 'bcb', 'ifrs9', 'cvm', 'anatel');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_saude" AS ENUM('anvisa', 'cfm', 'ans', 'tiss', 'rnds', 'lgpd_saude', 'bcb', 'ifrs9', 'ifrs17', 'cvm', 'susep', 'anatel');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_telecom" AS ENUM('anatel', 'rgc', 'eca', 'marco_civil', 'bcb', 'ifrs9', 'ifrs17', 'cvm', 'susep');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_educacao" AS ENUM('mec', 'inep', 'fies', 'eca', 'bcb', 'ifrs9', 'ifrs17', 'cvm', 'susep', 'anatel');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_varejo" AS ENUM('cvm244', 'bcb', 'ifrs9', 'ifrs17', 'cvm', 'susep', 'anatel');
  CREATE TYPE "public"."enum_data_maturity_diagnostic_regulations_outros" AS ENUM('cvm244', 'bcb', 'ifrs9', 'ifrs17', 'cvm', 'susep', 'anatel');
  CREATE TABLE "data_maturity_diagnostic_regulations_financeiro" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_financeiro",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_capitais" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_capitais",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_seguros" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_seguros",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_saude" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_saude",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_telecom" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_telecom",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_educacao" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_educacao",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_varejo" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_varejo",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "data_maturity_diagnostic_regulations_outros" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_data_maturity_diagnostic_regulations_outros",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "data_maturity_diagnostic_regulations_financeiro" ADD CONSTRAINT "data_maturity_diagnostic_regulations_financeiro_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_capitais" ADD CONSTRAINT "data_maturity_diagnostic_regulations_capitais_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_seguros" ADD CONSTRAINT "data_maturity_diagnostic_regulations_seguros_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_saude" ADD CONSTRAINT "data_maturity_diagnostic_regulations_saude_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_telecom" ADD CONSTRAINT "data_maturity_diagnostic_regulations_telecom_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_educacao" ADD CONSTRAINT "data_maturity_diagnostic_regulations_educacao_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_varejo" ADD CONSTRAINT "data_maturity_diagnostic_regulations_varejo_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "data_maturity_diagnostic_regulations_outros" ADD CONSTRAINT "data_maturity_diagnostic_regulations_outros_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."data_maturity_diagnostic"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "data_maturity_diagnostic_regulations_financeiro_order_idx" ON "data_maturity_diagnostic_regulations_financeiro" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_financeiro_parent_idx" ON "data_maturity_diagnostic_regulations_financeiro" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_capitais_order_idx" ON "data_maturity_diagnostic_regulations_capitais" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_capitais_parent_idx" ON "data_maturity_diagnostic_regulations_capitais" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_seguros_order_idx" ON "data_maturity_diagnostic_regulations_seguros" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_seguros_parent_idx" ON "data_maturity_diagnostic_regulations_seguros" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_saude_order_idx" ON "data_maturity_diagnostic_regulations_saude" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_saude_parent_idx" ON "data_maturity_diagnostic_regulations_saude" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_telecom_order_idx" ON "data_maturity_diagnostic_regulations_telecom" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_telecom_parent_idx" ON "data_maturity_diagnostic_regulations_telecom" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_educacao_order_idx" ON "data_maturity_diagnostic_regulations_educacao" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_educacao_parent_idx" ON "data_maturity_diagnostic_regulations_educacao" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_varejo_order_idx" ON "data_maturity_diagnostic_regulations_varejo" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_varejo_parent_idx" ON "data_maturity_diagnostic_regulations_varejo" USING btree ("parent_id");
  CREATE INDEX "data_maturity_diagnostic_regulations_outros_order_idx" ON "data_maturity_diagnostic_regulations_outros" USING btree ("order");
  CREATE INDEX "data_maturity_diagnostic_regulations_outros_parent_idx" ON "data_maturity_diagnostic_regulations_outros" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "data_maturity_diagnostic_regulations_financeiro" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_capitais" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_seguros" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_saude" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_telecom" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_educacao" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_varejo" CASCADE;
  DROP TABLE "data_maturity_diagnostic_regulations_outros" CASCADE;
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_financeiro";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_capitais";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_seguros";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_saude";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_telecom";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_educacao";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_varejo";
  DROP TYPE "public"."enum_data_maturity_diagnostic_regulations_outros";`)
}
