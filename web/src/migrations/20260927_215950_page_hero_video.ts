import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* Antecipada, idempotente: as duas colunas do vídeo na "Mídia ao lado" da
 * abertura de página (09/10), criadas **antes** da primeira migração de dados.
 *
 * ⚠️ A mesma armadilha de `20260927_215400_partner_showcase_source`: em banco
 * novo, as migrações de dados de 27/09 em diante leem `pages`, `solutions`,
 * `segments` e `partners` pela Local API com o config de hoje, e o SELECT já
 * pede `video_file_id` e `video_url` — que só nasceriam em
 * `20261009_193535_page_hero_video`. Aqui vão só as colunas, que é o que o
 * SELECT exige; a chave estrangeira, o índice e a opção nova do seletor ficam
 * na de 09/10, que repete as colunas com `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "partners_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "partners_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "segments_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "segments_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_segments_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "_segments_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "solutions_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "solutions_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;`)
}

/* A volta é a da migração de 09/10, que apaga as colunas. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[page-hero-video] as colunas são desfeitas por 20261009_193535_page_hero_video')
}
