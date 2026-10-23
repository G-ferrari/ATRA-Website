import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

/* O campo `photo` do bloco "Contato com formulário" (`ctaContact`) sai do
 * config: desde a #171 a foto do painel mora no global Contato (`panelPhoto`),
 * e a migração `20261021_233937_foto_do_painel_de_contatos` levou para lá a
 * foto que a home usava. O gerador escreveu aqui a exclusão da coluna
 * `photo_id` — e ela fica **adiada**, como a da Insights em
 * `20261005_223123_insights_automatica`.
 *
 * ⚠️ Por quê: a #171 só **escondeu** o campo (`admin.hidden`), e campo
 * escondido continua no SELECT. O código da #172, que é para onde um deploy
 * reprovado volta, consulta `photo_id` em toda leitura de `pages`, `solutions`,
 * `segments` e `partners` — o bloco é o mesmo nas quatro. Medido em 21/10 numa
 * cópia do banco: sem a coluna, as quatro caem em "column
 * pages__blocks_ctaContact.photo_id does not exist"; com ela, o código novo (que
 * não a conhece) lê tudo normalmente. A exclusão vai numa publicação **depois**
 * desta, a primeira que já não declara o campo.
 *
 * Esta migração fica como passo vazio, para o histórico e o retrato do schema
 * (o `.json`) seguirem a ordem em que o schema mudou. Quem executa
 * `EXCLUSAO_ADIADA` no `up` e `RECRIACAO` no `down` é
 * `20261022_180731_drop_cta_contact_photo_column`, que entra na publicação
 * seguinte à #175; as duas são idempotentes. Até ela rodar, a coluna fica no
 * banco sem uso, e as linhas de bloco gravadas pelo código novo nascem com ela
 * nula. */
export const EXCLUSAO_ADIADA = sql`
  ALTER TABLE "pages_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "pages_blocks_cta_contact_photo_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_cta_contact_photo_id_media_id_fk";
  ALTER TABLE "partners_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "partners_blocks_cta_contact_photo_id_media_id_fk";
  ALTER TABLE "segments_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "segments_blocks_cta_contact_photo_id_media_id_fk";
  ALTER TABLE "_segments_v_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "_segments_v_blocks_cta_contact_photo_id_media_id_fk";
  ALTER TABLE "solutions_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "solutions_blocks_cta_contact_photo_id_media_id_fk";
  ALTER TABLE "_solutions_v_blocks_cta_contact" DROP CONSTRAINT IF EXISTS "_solutions_v_blocks_cta_contact_photo_id_media_id_fk";
  DROP INDEX IF EXISTS "pages_blocks_cta_contact_photo_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_cta_contact_photo_idx";
  DROP INDEX IF EXISTS "partners_blocks_cta_contact_photo_idx";
  DROP INDEX IF EXISTS "segments_blocks_cta_contact_photo_idx";
  DROP INDEX IF EXISTS "_segments_v_blocks_cta_contact_photo_idx";
  DROP INDEX IF EXISTS "solutions_blocks_cta_contact_photo_idx";
  DROP INDEX IF EXISTS "_solutions_v_blocks_cta_contact_photo_idx";
  ALTER TABLE "pages_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "_pages_v_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "partners_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "segments_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "_segments_v_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "solutions_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
  ALTER TABLE "_solutions_v_blocks_cta_contact" DROP COLUMN IF EXISTS "photo_id";
`

/* A volta da exclusão: a coluna vazia, com a chave para `media` e o índice — o
 * que o código de antes precisa para consultar. A foto não volta; ela está no
 * global Contato. */
export const RECRIACAO = sql`
  ALTER TABLE "pages_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "partners_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "segments_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "_segments_v_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "solutions_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  ALTER TABLE "_solutions_v_blocks_cta_contact" ADD COLUMN IF NOT EXISTS "photo_id" integer;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_cta_contact" ADD CONSTRAINT "pages_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_cta_contact" ADD CONSTRAINT "_pages_v_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_cta_contact" ADD CONSTRAINT "partners_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_cta_contact" ADD CONSTRAINT "segments_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_cta_contact" ADD CONSTRAINT "_segments_v_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_cta_contact" ADD CONSTRAINT "solutions_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_cta_contact" ADD CONSTRAINT "_solutions_v_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_contact_photo_idx" ON "pages_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_contact_photo_idx" ON "_pages_v_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_cta_contact_photo_idx" ON "partners_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_cta_contact_photo_idx" ON "segments_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_cta_contact_photo_idx" ON "_segments_v_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_cta_contact_photo_idx" ON "solutions_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_cta_contact_photo_idx" ON "_solutions_v_blocks_cta_contact" USING btree ("photo_id");
`

export async function up(_: MigrateUpArgs): Promise<void> {
  /* Vazio de propósito — ver acima. */
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Nada a desfazer. */
}
