import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* D-62 (task 044): o aviso ao candidato em Sistema → Integrações, e a cópia
 * dele em cada cadastro do banco de talentos — sem ela o cadastro não vai ao
 * RD. Os dois nascem vazios: o texto é do RH e do jurídico. Nenhuma migração
 * de dados lê `integrations` ou `form-submissions`, então não há armadilha de
 * banco novo. */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN "talent_privacy_notice" varchar;
  ALTER TABLE "integrations" ADD COLUMN "rd_station_marketing_talent_pool_notice" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP COLUMN "talent_privacy_notice";
  ALTER TABLE "integrations" DROP COLUMN "rd_station_marketing_talent_pool_notice";`)
}
