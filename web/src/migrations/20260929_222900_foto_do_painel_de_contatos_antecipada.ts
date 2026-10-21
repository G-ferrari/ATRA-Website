import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* ⚠️ Migração **fora de ordem de propósito**, idempotente: a coluna da foto do
 * painel de contatos no global `contact` (#171, 21/10), criada **antes** de
 * `20260929_223000_sem_endereco_fixo`.
 *
 * Aquela migração lê e grava o global pela Local API, com o config de hoje — que
 * faz o SELECT com todas as colunas que ele conhece. Em banco novo ela rodaria
 * antes de `20261021_233937_foto_do_painel_de_contatos` e morreria em "column … panel_photo_id does not exist" (a
 * armadilha do CLAUDE.md). A mídia já existe aqui, então a chave estrangeira vem
 * junto; a migração da foto repete tudo com `IF NOT EXISTS`. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "panel_photo_id" integer;
  DO $$ BEGIN
    ALTER TABLE "contact" ADD CONSTRAINT "contact_panel_photo_id_media_id_fk" FOREIGN KEY ("panel_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "contact_panel_photo_idx" ON "contact" USING btree ("panel_photo_id");`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[foto-do-painel-antecipada] a coluna é desfeita pela migração da foto do painel')
}
