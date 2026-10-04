import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**: a data é 27/09, mas ela nasceu em
 * 02/10, junto com a collection `press` (`20261002_165837_add_press`). É a
 * mesma armadilha de `20260927_215400_partner_showcase_source`, por outra porta.
 *
 * Toda collection nova ganha uma coluna em `payload_locked_documents_rels`, e o
 * Payload consulta essa tabela — com todas as colunas que o config **de hoje**
 * conhece — a cada `payload.update`, para saber se o documento está travado por
 * alguém no admin. Em banco novo (o do CI), a migração de 28/09 que cria a
 * página do RC18 faz um `update` logo depois do `create`, antes de a coluna
 * existir, e o migrate morria em "column ….press_id does not exist".
 *
 * Só a coluna nasce aqui. A chave estrangeira e o índice ficam na migração de
 * 02/10, porque dependem da tabela `press`, que só existe lá.
 *
 * ⚠️ Collection nova daqui em diante: mesmo cuidado, e o teste é `pnpm migrate`
 * num banco zerado — o CI faz isso a cada PR. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "press_id" integer;`)
}

/* A volta é a da migração de 02/10, que apaga a coluna. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[locked-documents-press] a coluna é desfeita por 20261002_165837_add_press')
}
