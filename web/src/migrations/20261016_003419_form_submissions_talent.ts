import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Task 044 (D-62): o perfil do banco de talentos em colunas próprias, para o
 * RD receber LinkedIn, área e senioridade cada um no seu campo — e não a
 * mensagem em texto livre. Nenhuma migração de dados lê `form-submissions`,
 * então não há armadilha de banco novo. Cadastros antigos ficam com as colunas
 * vazias, e não vão ao RD de qualquer jeito (corte da D-62 em
 * `lib/rd-marketing.ts`). */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN "talent_linkedin" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "talent_area" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "talent_seniority" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP COLUMN "talent_linkedin";
  ALTER TABLE "form_submissions" DROP COLUMN "talent_area";
  ALTER TABLE "form_submissions" DROP COLUMN "talent_seniority";`)
}
