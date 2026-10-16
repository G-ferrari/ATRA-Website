import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Antecipada, idempotente: a coluna "Formato" do bloco "Etapas de processo"
 * (15/10), criada **antes** da primeira migração de dados.
 *
 * ⚠️ O bloco está no catálogo de `pages`, `solutions`, `segments` e `partners`,
 * e as migrações de dados antigas leem essas collections pela Local API com o
 * config de hoje — que põe `variant` no SELECT da tabela do bloco. Em banco novo
 * elas rodam antes de `20261016_201318`, e morreriam em "column does not exist"
 * (a armadilha do CLAUDE.md). A de 16/10 repete tudo com `IF NOT EXISTS`. */
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
  ALTER TABLE "_solutions_v_blocks_process_steps" ADD COLUMN IF NOT EXISTS "variant" "enum__solutions_v_blocks_process_steps_variant" DEFAULT 'cards';`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Quem desfaz é a de 15/10. */
}
