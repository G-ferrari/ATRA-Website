import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**: a data é 27/09, mas ela nasceu em
 * 20/10, junto com a collection `forms` (task 048, criador de formulários). É a
 * armadilha de `20260927_215500_locked_documents_press`, pela mesma porta.
 *
 * Toda collection nova ganha uma coluna em `payload_locked_documents_rels`, e o
 * Payload consulta essa tabela — com todas as colunas que o config **de hoje**
 * conhece — a cada `payload.update`. Em banco novo (o do CI), as migrações de
 * dados de 28/09 em diante fazem `update` antes de a migração da collection
 * existir, e o migrate morreria em "column ….forms_id does not exist".
 *
 * Só a coluna nasce aqui. A chave estrangeira e o índice ficam na migração da
 * collection, porque dependem da tabela `forms`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "forms_id" integer;`)
}

/* A volta é a da migração da collection, que apaga a coluna. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[locked-documents-forms] a coluna é desfeita pela migração da collection forms')
}
