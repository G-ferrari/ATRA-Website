import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Antecipada, idempotente: as colunas do segundo botão do painel do menu de
 * Soluções (06/10), criadas **antes** da migração de dados
 * `20261002_203000_painel_de_conversao`.
 *
 * ⚠️ Aquela migração lê e grava o global `conversion-panel` pela Local API, com
 * o config de hoje — que já seleciona estas colunas. Em banco novo ela roda
 * antes de `20261007_010701`, e morreria em "column does not exist" (a
 * armadilha do CLAUDE.md, paga pela sexta vez). A data fica entre a que cria a
 * tabela (`202832`) e a de dados (`203000`); a de 07/10 repete com
 * `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conversion_panel" ADD COLUMN IF NOT EXISTS "secondary_cta_href" varchar DEFAULT '/diagnostico-maturidade';
  ALTER TABLE "conversion_panel_locales" ADD COLUMN IF NOT EXISTS "secondary_cta_label" varchar;`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Quem desfaz é a de 07/10. */
}
