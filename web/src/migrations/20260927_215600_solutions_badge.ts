import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**: a data é 27/09, mas ela nasceu em
 * 02/10, junto com o campo "Selo" da solução (D-52,
 * `20261002_212500_solutions_tabs_and_badge`).
 *
 * É a terceira vez da mesma armadilha (ver `…_partner_showcase_source` e
 * `…_locked_documents_press`): em banco novo, as migrações de dados antigas
 * rodam com a configuração **de hoje**. A de 28/09 cria a página do RC18 com
 * `payload.create` em `solutions`, e o Payload relê o documento com toda coluna
 * que o config conhece — inclusive `badge`, que só seria criada em 02/10.
 *
 * Por isso a coluna nasce aqui, antes da primeira migração de dados que grava
 * uma solução. Idempotente, como a de 02/10: onde a coluna já existe, nada
 * acontece. O valor novo do enum de categoria **não** precisa vir para cá:
 * nenhuma migração antiga grava a aba nova. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "solutions_locales" ADD COLUMN IF NOT EXISTS "badge" varchar;
  ALTER TABLE "_solutions_v_locales" ADD COLUMN IF NOT EXISTS "version_badge" varchar;`)
}

/* A volta é a da migração de 02/10, que apaga as colunas. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[solutions-badge] a coluna é desfeita por 20261002_212500_solutions_tabs_and_badge')
}
