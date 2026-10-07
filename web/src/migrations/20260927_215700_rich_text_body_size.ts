import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**: a data é 27/09, mas ela nasceu em
 * 05/10, junto com o seletor "Tamanho do texto" da seção "Texto com imagem"
 * (`20261005_205500_rich_text_body_size`).
 *
 * A quarta vez da mesma armadilha (ver `…_partner_showcase_source`,
 * `…_locked_documents_press` e `…_solutions_badge`): em banco novo, as
 * migrações de dados antigas rodam com a configuração **de hoje**. A do RC18
 * (28/09) e a das soluções novas (02/10) criam soluções com `payload.create`, e
 * o Payload relê o documento com um JOIN por tipo de bloco — inclusive a tabela
 * da seção de texto, com a coluna `body_size`, que só nasceria em 05/10.
 *
 * Por isso os tipos e as colunas nascem aqui, nas sete tabelas da seção.
 * Idempotente, como a de 05/10: onde já existem, nada acontece. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
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

/* A volta é a da migração de 05/10, que apaga as colunas e os tipos. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[rich-text-body-size] a coluna é desfeita por 20261005_205500_rich_text_body_size')
}
