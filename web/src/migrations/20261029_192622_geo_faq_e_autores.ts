import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { up as antecipada } from './20260927_215970_geo_faq_e_autores_antecipada'

/* D-80 (GEO): a seção "Perguntas frequentes" nas quatro collections de blocos,
 * a collection `authors` e a relação `posts.authors`.
 *
 * O SQL mora em `20260927_215970_geo_faq_e_autores_antecipada`, idempotente:
 * em banco novo ela roda antes das migrações de dados e esta não faz nada;
 * em banco que já existe as duas rodam agora, a primeira cria e esta confere. */
export async function up(args: MigrateUpArgs): Promise<void> {
  await antecipada(args)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "segments_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_segments_v_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_faq_section_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_faq_section_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_faq_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "authors_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_section_items" CASCADE;
  DROP TABLE "pages_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_section" CASCADE;
  DROP TABLE "pages_blocks_faq_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "partners_blocks_faq_section_items" CASCADE;
  DROP TABLE "partners_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "partners_blocks_faq_section" CASCADE;
  DROP TABLE "partners_blocks_faq_section_locales" CASCADE;
  DROP TABLE "segments_blocks_faq_section_items" CASCADE;
  DROP TABLE "segments_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "segments_blocks_faq_section" CASCADE;
  DROP TABLE "segments_blocks_faq_section_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_faq_section_items" CASCADE;
  DROP TABLE "_segments_v_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_faq_section" CASCADE;
  DROP TABLE "_segments_v_blocks_faq_section_locales" CASCADE;
  DROP TABLE "solutions_blocks_faq_section_items" CASCADE;
  DROP TABLE "solutions_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_faq_section" CASCADE;
  DROP TABLE "solutions_blocks_faq_section_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_faq_section_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_faq_section" CASCADE;
  DROP TABLE "_solutions_v_blocks_faq_section_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_authors_fk";
  
  DROP INDEX "payload_locked_documents_rels_authors_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  DROP TYPE "public"."enum_pages_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum_pages_blocks_faq_section_borda";
  DROP TYPE "public"."enum_pages_blocks_faq_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_faq_section_theme";
  DROP TYPE "public"."enum__pages_v_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum__pages_v_blocks_faq_section_borda";
  DROP TYPE "public"."enum__pages_v_blocks_faq_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_faq_section_theme";
  DROP TYPE "public"."enum_partners_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum_partners_blocks_faq_section_borda";
  DROP TYPE "public"."enum_partners_blocks_faq_section_spacing";
  DROP TYPE "public"."enum_partners_blocks_faq_section_theme";
  DROP TYPE "public"."enum_segments_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum_segments_blocks_faq_section_borda";
  DROP TYPE "public"."enum_segments_blocks_faq_section_spacing";
  DROP TYPE "public"."enum_segments_blocks_faq_section_theme";
  DROP TYPE "public"."enum__segments_v_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum__segments_v_blocks_faq_section_borda";
  DROP TYPE "public"."enum__segments_v_blocks_faq_section_spacing";
  DROP TYPE "public"."enum__segments_v_blocks_faq_section_theme";
  DROP TYPE "public"."enum_solutions_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum_solutions_blocks_faq_section_borda";
  DROP TYPE "public"."enum_solutions_blocks_faq_section_spacing";
  DROP TYPE "public"."enum_solutions_blocks_faq_section_theme";
  DROP TYPE "public"."enum__solutions_v_blocks_faq_section_eyebrow_icon";
  DROP TYPE "public"."enum__solutions_v_blocks_faq_section_borda";
  DROP TYPE "public"."enum__solutions_v_blocks_faq_section_spacing";
  DROP TYPE "public"."enum__solutions_v_blocks_faq_section_theme";`)
}
