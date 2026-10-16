import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* O aviso de privacidade da candidatura (P-17, 15/10), em Contato →
 * Candidaturas. Nasce vazio: o texto é do RH e do jurídico.
 *
 * Idempotente porque a antecipada `20260929_222950_contact_privacy_notice` já
 * cria a coluna em banco novo — `20260929_223000_sem_endereco_fixo` lê o global
 * `contact` com o config de hoje, e sem a coluna morreria (armadilha do
 * CLAUDE.md). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "job_applications_privacy_notice" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" DROP COLUMN IF EXISTS "job_applications_privacy_notice";`)
}
