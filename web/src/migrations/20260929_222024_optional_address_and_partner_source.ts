import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Pedidos de 29/09 (G-ferrari):
 * - `contact.address` deixa de ser obrigatório — a ATRA não tem mais endereço
 *   fixo. A migração seguinte apaga o endereço antigo.
 * - A vitrine de parceiros ganha "Quais parceiros". ⚠️ O `DEFAULT 'all'` põe
 *   **toda vitrine existente** em "Todos os cadastrados", inclusive a de
 *   /sobre, que mostrava 4 escolhidos: foi a decisão ("Todas, inclusive
 *   /sobre"). A lista gravada em cada bloco fica no banco, ignorada, para quem
 *   quiser voltar um bloco para "Escolher". */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum__pages_v_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum_partners_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum_segments_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum__segments_v_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum_solutions_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum__solutions_v_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  ALTER TABLE "contact" ALTER COLUMN "address" DROP NOT NULL;
  ALTER TABLE "pages_blocks_partner_showcase" ADD COLUMN "source" "enum_pages_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "_pages_v_blocks_partner_showcase" ADD COLUMN "source" "enum__pages_v_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "partners_blocks_partner_showcase" ADD COLUMN "source" "enum_partners_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "segments_blocks_partner_showcase" ADD COLUMN "source" "enum_segments_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "_segments_v_blocks_partner_showcase" ADD COLUMN "source" "enum__segments_v_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "solutions_blocks_partner_showcase" ADD COLUMN "source" "enum_solutions_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "_solutions_v_blocks_partner_showcase" ADD COLUMN "source" "enum__solutions_v_blocks_partner_showcase_source" DEFAULT 'all';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" ALTER COLUMN "address" SET NOT NULL;
  ALTER TABLE "pages_blocks_partner_showcase" DROP COLUMN "source";
  ALTER TABLE "_pages_v_blocks_partner_showcase" DROP COLUMN "source";
  ALTER TABLE "partners_blocks_partner_showcase" DROP COLUMN "source";
  ALTER TABLE "segments_blocks_partner_showcase" DROP COLUMN "source";
  ALTER TABLE "_segments_v_blocks_partner_showcase" DROP COLUMN "source";
  ALTER TABLE "solutions_blocks_partner_showcase" DROP COLUMN "source";
  ALTER TABLE "_solutions_v_blocks_partner_showcase" DROP COLUMN "source";
  DROP TYPE "public"."enum_pages_blocks_partner_showcase_source";
  DROP TYPE "public"."enum__pages_v_blocks_partner_showcase_source";
  DROP TYPE "public"."enum_partners_blocks_partner_showcase_source";
  DROP TYPE "public"."enum_segments_blocks_partner_showcase_source";
  DROP TYPE "public"."enum__segments_v_blocks_partner_showcase_source";
  DROP TYPE "public"."enum_solutions_blocks_partner_showcase_source";
  DROP TYPE "public"."enum__solutions_v_blocks_partner_showcase_source";`)
}
