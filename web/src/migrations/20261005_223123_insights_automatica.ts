import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

/* A Insights automática (D-55) deixou de usar os cartões escritos à mão
 * (`items`), a contagem das pílulas (`formats.count`) e os tópicos. O gerador
 * escreveu aqui a exclusão das tabelas — e ela foi **adiada** em 06/10, antes
 * da primeira publicação.
 *
 * ⚠️ Por quê: o deploy migra **antes** de trocar a versão, e a volta automática
 * (healthcheck reprovado) ou manual devolve o código antigo sem desfazer
 * migração. O código antigo lê estas tabelas em toda consulta a `pages`,
 * `solutions`, `segments` e `partners` — o adapter faz um JOIN por tipo de
 * bloco —, então voltar depois da exclusão derrubaria a home e as páginas
 * internas. Exclusão vai numa publicação **depois** da que parou de ler.
 *
 * Até lá as tabelas ficam no banco, sem uso: o código novo não as conhece, e
 * as linhas somem em cascata quando a página é salva de novo.
 *
 * Esta migração fica como passo vazio, para o histórico e o retrato do schema
 * (o `.json`) seguirem a ordem em que o schema mudou. A exclusão está pronta em
 * `EXCLUSAO_ADIADA`, idempotente: a migração seguinte só precisa executá-la.
 * (No banco de quem aplicou a versão anterior deste arquivo, as tabelas já
 * saíram — daí o `IF EXISTS`.) */
export const EXCLUSAO_ADIADA = sql`
  DROP TABLE IF EXISTS "pages_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE IF EXISTS "partners_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "partners_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "partners_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "partners_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE IF EXISTS "segments_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "segments_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "segments_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "segments_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_segments_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "_segments_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "_segments_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "_segments_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE IF EXISTS "solutions_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "solutions_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "solutions_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "solutions_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE IF EXISTS "_solutions_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE IF EXISTS "_solutions_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE IF EXISTS "_solutions_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE IF EXISTS "_solutions_v_blocks_insights_hub_items_locales" CASCADE;
  ALTER TABLE "pages_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
  ALTER TABLE "_pages_v_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
  ALTER TABLE "partners_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
  ALTER TABLE "segments_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
  ALTER TABLE "_segments_v_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
  ALTER TABLE "solutions_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
  ALTER TABLE "_solutions_v_blocks_insights_hub_formats" DROP COLUMN IF EXISTS "count";
`

export async function up(_: MigrateUpArgs): Promise<void> {
  /* Vazio de propósito — ver acima. */
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Nada a desfazer. */
}
