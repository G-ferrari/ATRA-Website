import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* 05/10: o seletor "Tamanho do texto" da seção "Texto com imagem".
 *
 * ⚠️ Idempotente à mão sobre o que o gerador emitiu: os tipos e as colunas
 * nascem antes, em `20260927_215700_rich_text_body_size`, para o `migrate` de
 * um banco novo não morrer nas migrações de dados antigas (a armadilha do
 * CLAUDE.md). Aqui eles só são criados onde aquela não rodou. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_rich_text_section_body_size" AS ENUM('normal', 'large');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "pages_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum_pages_blocks_rich_text_section_body_size" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum__pages_v_blocks_rich_text_section_body_size" DEFAULT 'normal';
  ALTER TABLE "partners_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum_partners_blocks_rich_text_section_body_size" DEFAULT 'normal';
  ALTER TABLE "segments_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum_segments_blocks_rich_text_section_body_size" DEFAULT 'normal';
  ALTER TABLE "_segments_v_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum__segments_v_blocks_rich_text_section_body_size" DEFAULT 'normal';
  ALTER TABLE "solutions_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum_solutions_blocks_rich_text_section_body_size" DEFAULT 'normal';
  ALTER TABLE "_solutions_v_blocks_rich_text_section" ADD COLUMN IF NOT EXISTS "body_size" "enum__solutions_v_blocks_rich_text_section_body_size" DEFAULT 'normal';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_text_section" DROP COLUMN "body_size";
  ALTER TABLE "_pages_v_blocks_rich_text_section" DROP COLUMN "body_size";
  ALTER TABLE "partners_blocks_rich_text_section" DROP COLUMN "body_size";
  ALTER TABLE "segments_blocks_rich_text_section" DROP COLUMN "body_size";
  ALTER TABLE "_segments_v_blocks_rich_text_section" DROP COLUMN "body_size";
  ALTER TABLE "solutions_blocks_rich_text_section" DROP COLUMN "body_size";
  ALTER TABLE "_solutions_v_blocks_rich_text_section" DROP COLUMN "body_size";
  DROP TYPE "public"."enum_pages_blocks_rich_text_section_body_size";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_section_body_size";
  DROP TYPE "public"."enum_partners_blocks_rich_text_section_body_size";
  DROP TYPE "public"."enum_segments_blocks_rich_text_section_body_size";
  DROP TYPE "public"."enum__segments_v_blocks_rich_text_section_body_size";
  DROP TYPE "public"."enum_solutions_blocks_rich_text_section_body_size";
  DROP TYPE "public"."enum__solutions_v_blocks_rich_text_section_body_size";`)
}
