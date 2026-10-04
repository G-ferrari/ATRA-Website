import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* D-52: a 4ª aba do menu de Soluções ("Serviços Especializados") e o campo
 * "Selo" da solução.
 *
 * ⚠️ `IF NOT EXISTS` escrito à mão sobre o que o gerador emitiu: as duas colunas
 * nascem antes, em `20260927_215600_solutions_badge`, para o `migrate` de um
 * banco novo não morrer nas migrações de dados antigas (a armadilha do
 * CLAUDE.md). Aqui elas só são criadas onde aquela não rodou. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_solutions_category" ADD VALUE IF NOT EXISTS 'specialized-services' BEFORE 'rc18';
  ALTER TYPE "public"."enum__solutions_v_version_category" ADD VALUE IF NOT EXISTS 'specialized-services' BEFORE 'rc18';
  ALTER TABLE "solutions_locales" ADD COLUMN IF NOT EXISTS "badge" varchar;
  ALTER TABLE "_solutions_v_locales" ADD COLUMN IF NOT EXISTS "version_badge" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_category";
  CREATE TYPE "public"."enum_solutions_category" AS ENUM('innovation-ai', 'data-bi', 'governance-culture', 'rc18');
  ALTER TABLE "solutions" ALTER COLUMN "category" SET DATA TYPE "public"."enum_solutions_category" USING "category"::"public"."enum_solutions_category";
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_version_category";
  CREATE TYPE "public"."enum__solutions_v_version_category" AS ENUM('innovation-ai', 'data-bi', 'governance-culture', 'rc18');
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__solutions_v_version_category" USING "version_category"::"public"."enum__solutions_v_version_category";
  ALTER TABLE "solutions_locales" DROP COLUMN "badge";
  ALTER TABLE "_solutions_v_locales" DROP COLUMN "version_badge";`)
}
