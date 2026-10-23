import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* #171 (21/10) — a foto de fundo do painel "Nossos Contatos" passa a morar no
 * global Contato (`panelPhoto`), a mesma na home, em /contato e em consultores.
 *
 * A coluna já pode existir — a antecipada
 * `20260929_222900_foto_do_painel_de_contatos_antecipada` a cria em banco novo —,
 * então tudo vai com `IF NOT EXISTS`.
 *
 * Depois, a foto que a home usava — a do bloco "Contato com formulário" da
 * página `home` — vai para o global, para nada mudar no ar. Com trava: só se o
 * campo estiver vazio, e uma foto escolhida no admin não é tocada. Em banco novo
 * não há página ainda, e o seed grava a foto (`scripts/seed/globais.ts`). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "panel_photo_id" integer;
  DO $$ BEGIN
    ALTER TABLE "contact" ADD CONSTRAINT "contact_panel_photo_id_media_id_fk" FOREIGN KEY ("panel_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "contact_panel_photo_idx" ON "contact" USING btree ("panel_photo_id");
  UPDATE "contact" SET "panel_photo_id" = (
    SELECT b."photo_id" FROM "pages_blocks_cta_contact" b
    LEFT JOIN "pages_locales" l ON l."_parent_id" = b."_parent_id" AND l."_locale" = 'pt'
    WHERE b."photo_id" IS NOT NULL
    ORDER BY (l."slug" = 'home') DESC NULLS LAST, b."_parent_id", b."_order"
    LIMIT 1
  ) WHERE "panel_photo_id" IS NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" DROP CONSTRAINT IF EXISTS "contact_panel_photo_id_media_id_fk";
  DROP INDEX IF EXISTS "contact_panel_photo_idx";
  ALTER TABLE "contact" DROP COLUMN IF EXISTS "panel_photo_id";`)
}
