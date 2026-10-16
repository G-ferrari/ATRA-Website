import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* O "Formato" do bloco "Etapas de processo" (15/10): cartões ou linha do tempo.
 *
 * Idempotente porque a antecipada `20260927_215950_process_steps_variant` já
 * cria tudo isto em banco novo (a armadilha do CLAUDE.md).
 *
 * Até aqui a linha do tempo só existia na RC18, ligada pela rota de solução
 * (`if (slug === 'rc18')`). A regra saiu do código, então os blocos de etapas da
 * RC18 passam a guardar `timeline` — e a página fica como estava. Vai por SQL e
 * não por `payload.update`: com rascunho pendente no admin, o update publicaria o
 * rascunho (armadilha do CLAUDE.md). Entra nas versões também, para restaurar uma
 * versão antiga não voltar aos cartões. Em banco novo a RC18 nasce de
 * `20260928_120000_pagina_rc18` já com `timeline`, e o UPDATE não muda nada. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_process_steps_variant" AS ENUM('cards', 'timeline');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "pages_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum_pages_blocks_process_steps_variant" DEFAULT 'cards';
  ALTER TABLE "_pages_v_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum__pages_v_blocks_process_steps_variant" DEFAULT 'cards';
  ALTER TABLE "partners_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum_partners_blocks_process_steps_variant" DEFAULT 'cards';
  ALTER TABLE "segments_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum_segments_blocks_process_steps_variant" DEFAULT 'cards';
  ALTER TABLE "_segments_v_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum__segments_v_blocks_process_steps_variant" DEFAULT 'cards';
  ALTER TABLE "solutions_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum_solutions_blocks_process_steps_variant" DEFAULT 'cards';
  ALTER TABLE "_solutions_v_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum__solutions_v_blocks_process_steps_variant" DEFAULT 'cards';

  UPDATE "solutions_blocks_process_steps" SET "variant" = 'timeline'
    WHERE "_parent_id" IN (SELECT "_parent_id" FROM "solutions_locales" WHERE "slug" = 'rc18');
  UPDATE "_solutions_v_blocks_process_steps" SET "variant" = 'timeline'
    WHERE "_parent_id" IN (
      SELECT v."id" FROM "_solutions_v" v
      WHERE v."parent_id" IN (SELECT "_parent_id" FROM "solutions_locales" WHERE "slug" = 'rc18')
    );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "_pages_v_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "partners_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "segments_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "_segments_v_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "solutions_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  ALTER TABLE "_solutions_v_blocks_process_steps" DROP COLUMN IF EXISTS "variant";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_process_steps_variant";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_process_steps_variant";
  DROP TYPE IF EXISTS "public"."enum_partners_blocks_process_steps_variant";
  DROP TYPE IF EXISTS "public"."enum_segments_blocks_process_steps_variant";
  DROP TYPE IF EXISTS "public"."enum__segments_v_blocks_process_steps_variant";
  DROP TYPE IF EXISTS "public"."enum_solutions_blocks_process_steps_variant";
  DROP TYPE IF EXISTS "public"."enum__solutions_v_blocks_process_steps_variant";`)
}
