import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* #216 e #218 (20/10): a descrição da "Faixa de logos" e o alinhamento do texto
 * ao lado do título nas "Abas de destaque" e no "Carrossel de cases". Só
 * acrescenta: cada alinhamento nasce com o que o bloco já mostrava (abas à
 * esquerda, cases à direita), e a descrição nasce vazia.
 *
 * Idempotente porque a antecipada `20260927_215950_descricao_e_alinhamento` já
 * cria tudo isto em banco novo: as migrações de dados antigas leem `pages`,
 * `solutions`, `segments` e `partners` com o config de hoje, que põe as colunas
 * novas no SELECT (a armadilha do CLAUDE.md). */
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

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "pages_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "pages_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "_pages_v_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "_pages_v_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "_pages_v_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "partners_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "partners_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "partners_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "segments_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "segments_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "segments_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "_segments_v_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "_segments_v_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "_segments_v_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "solutions_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "solutions_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "solutions_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "_solutions_v_blocks_feature_tabs" DROP COLUMN IF EXISTS "description_align";
  ALTER TABLE "_solutions_v_blocks_logo_marquee_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "_solutions_v_blocks_case_carousel" DROP COLUMN IF EXISTS "description_align";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_case_carousel_description_align";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_case_carousel_description_align";
  DROP TYPE IF EXISTS "public"."enum_partners_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum_partners_blocks_case_carousel_description_align";
  DROP TYPE IF EXISTS "public"."enum_segments_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum_segments_blocks_case_carousel_description_align";
  DROP TYPE IF EXISTS "public"."enum__segments_v_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum__segments_v_blocks_case_carousel_description_align";
  DROP TYPE IF EXISTS "public"."enum_solutions_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum_solutions_blocks_case_carousel_description_align";
  DROP TYPE IF EXISTS "public"."enum__solutions_v_blocks_feature_tabs_description_align";
  DROP TYPE IF EXISTS "public"."enum__solutions_v_blocks_case_carousel_description_align";`)
}
