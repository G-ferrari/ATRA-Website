import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**: a data é 27/09, mas ela nasceu em
 * 29/09, junto com o campo "Quais parceiros" da vitrine
 * (`20260929_222024_optional_address_and_partner_source`).
 *
 * Em banco novo (o do CI), as migrações de dados de 27 e 28/09 rodam com a
 * configuração **de hoje**: `payload.find` em `partners` monta um SELECT com
 * toda coluna que o config conhece, inclusive `source`, que só seria criada em
 * 29/09 — e o migrate morria em "column partners__blocks_partnerShowcase.source
 * does not exist". As anteriores escapavam por sorte: filtram por slug, não
 * acham nada em banco vazio, e o Payload pula a consulta pesada.
 *
 * Por isso a coluna nasce aqui, logo depois das tabelas de bloco de 27/09 e
 * antes da primeira migração de dados que lê as collections inteiras. Tudo é
 * idempotente, assim como a de 29/09: em banco que já tem a coluna (a
 * homologação roda as duas no mesmo deploy), nada acontece.
 *
 * ⚠️ Campo novo em bloco daqui em diante: mesmo cuidado. O teste é
 * `pnpm migrate` num banco zerado — o CI faz isso a cada PR. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_partner_showcase_source" AS ENUM('all', 'selected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "pages_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum_pages_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "_pages_v_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum__pages_v_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "partners_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum_partners_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "segments_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum_segments_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "_segments_v_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum__segments_v_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "solutions_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum_solutions_blocks_partner_showcase_source" DEFAULT 'all';
  ALTER TABLE "_solutions_v_blocks_partner_showcase" ADD COLUMN IF NOT EXISTS "source" "enum__solutions_v_blocks_partner_showcase_source" DEFAULT 'all';`)
}

/* A volta é a da migração de 29/09, que apaga a coluna e os tipos. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[partner-source] a coluna é desfeita por 20260929_222024_optional_address_and_partner_source')
}
