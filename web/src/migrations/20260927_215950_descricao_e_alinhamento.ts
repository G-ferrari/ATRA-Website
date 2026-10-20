import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Antecipada, idempotente: as colunas de `20261020_232303_descricao_e_alinhamento`
 * (#216 e #218), criadas antes das migrações de dados.
 *
 * ⚠️ As migrações de dados antigas leem `pages`, `solutions`, `segments` e
 * `partners` pela Local API com o config de hoje, que põe estas colunas no
 * SELECT das tabelas dos blocos. Em banco novo elas rodam antes de
 * `20261020_232303`, e morreriam em "column does not exist" (a armadilha do
 * CLAUDE.md). A de 20/10 repete tudo com `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_partners_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_segments_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__segments_v_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_solutions_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_feature_tabs_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__solutions_v_blocks_case_carousel_description_align" AS ENUM('left', 'right');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "pages_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum_pages_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "pages_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "pages_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum_pages_blocks_case_carousel_description_align" DEFAULT 'right';
  ALTER TABLE "_pages_v_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum__pages_v_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "_pages_v_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum__pages_v_blocks_case_carousel_description_align" DEFAULT 'right';
  ALTER TABLE "partners_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum_partners_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "partners_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "partners_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum_partners_blocks_case_carousel_description_align" DEFAULT 'right';
  ALTER TABLE "segments_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum_segments_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "segments_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "segments_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum_segments_blocks_case_carousel_description_align" DEFAULT 'right';
  ALTER TABLE "_segments_v_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum__segments_v_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "_segments_v_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "_segments_v_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum__segments_v_blocks_case_carousel_description_align" DEFAULT 'right';
  ALTER TABLE "solutions_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum_solutions_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "solutions_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "solutions_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum_solutions_blocks_case_carousel_description_align" DEFAULT 'right';
  ALTER TABLE "_solutions_v_blocks_feature_tabs" ADD COLUMN IF NOT EXISTS "description_align" "enum__solutions_v_blocks_feature_tabs_description_align" DEFAULT 'left';
  ALTER TABLE "_solutions_v_blocks_logo_marquee_locales" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "_solutions_v_blocks_case_carousel" ADD COLUMN IF NOT EXISTS "description_align" "enum__solutions_v_blocks_case_carousel_description_align" DEFAULT 'right';`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Quem desfaz é a de 20/10. */
}
