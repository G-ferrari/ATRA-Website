import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Task 046: o "Identificador no RD" de cada material, na tabela e nas versões.
 * Nasce vazio — vazio vale `ebook-<slug>`. Nenhuma migração de dados lê
 * `resources` pela Local API, então não há armadilha de banco novo. */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" ADD COLUMN "rd_conversion_identifier" varchar;
  ALTER TABLE "_resources_v" ADD COLUMN "version_rd_conversion_identifier" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DROP COLUMN "rd_conversion_identifier";
  ALTER TABLE "_resources_v" DROP COLUMN "version_rd_conversion_identifier";`)
}
