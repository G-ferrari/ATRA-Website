import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* O segundo botão do painel do menu de Soluções (06/10). `IF NOT EXISTS` porque
 * a antecipada `20261002_202900_conversion_panel_secondary_cta` já cria as duas
 * colunas — ver o motivo lá. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conversion_panel" ADD COLUMN IF NOT EXISTS "secondary_cta_href" varchar DEFAULT '/diagnostico-maturidade';
  ALTER TABLE "conversion_panel_locales" ADD COLUMN IF NOT EXISTS "secondary_cta_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conversion_panel" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "conversion_panel_locales" DROP COLUMN "secondary_cta_label";`)
}
