import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Vídeo na "Mídia ao lado" da abertura de página (pedido de 08/10): a opção
 * "Um vídeo" no seletor, o arquivo (`video_file_id`) e o link (`video_url`).
 *
 * ⚠️ Idempotente à mão: as colunas já nascem em
 * `20260927_215950_page_hero_video`, antecipada para as migrações de dados
 * antigas não morrerem em banco novo. Só soma — nada aqui impede a volta do
 * deploy para a versão anterior, que não lê coluna nenhuma destas. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE "public"."enum__pages_v_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE "public"."enum_partners_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE "public"."enum_segments_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE "public"."enum__segments_v_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE "public"."enum_solutions_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TYPE "public"."enum__solutions_v_blocks_page_hero_media_mode" ADD VALUE IF NOT EXISTS 'video';
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "pages_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "partners_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "partners_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "segments_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "segments_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_segments_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "_segments_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "solutions_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "solutions_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_file_id" integer;
  ALTER TABLE "_solutions_v_blocks_page_hero" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "partners_blocks_page_hero" ADD CONSTRAINT "partners_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "segments_blocks_page_hero" ADD CONSTRAINT "segments_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_segments_v_blocks_page_hero" ADD CONSTRAINT "_segments_v_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "solutions_blocks_page_hero" ADD CONSTRAINT "solutions_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "_solutions_v_blocks_page_hero" ADD CONSTRAINT "_solutions_v_blocks_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_page_hero_video_file_idx" ON "pages_blocks_page_hero" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_page_hero_video_file_idx" ON "_pages_v_blocks_page_hero" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "partners_blocks_page_hero_video_file_idx" ON "partners_blocks_page_hero" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "segments_blocks_page_hero_video_file_idx" ON "segments_blocks_page_hero" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "_segments_v_blocks_page_hero_video_file_idx" ON "_segments_v_blocks_page_hero" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "solutions_blocks_page_hero_video_file_idx" ON "solutions_blocks_page_hero" USING btree ("video_file_id");
  CREATE INDEX IF NOT EXISTS "_solutions_v_blocks_page_hero_video_file_idx" ON "_solutions_v_blocks_page_hero" USING btree ("video_file_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_page_hero" DROP CONSTRAINT "pages_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_page_hero" DROP CONSTRAINT "_pages_v_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "partners_blocks_page_hero" DROP CONSTRAINT "partners_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "segments_blocks_page_hero" DROP CONSTRAINT "segments_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "_segments_v_blocks_page_hero" DROP CONSTRAINT "_segments_v_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "solutions_blocks_page_hero" DROP CONSTRAINT "solutions_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "_solutions_v_blocks_page_hero" DROP CONSTRAINT "_solutions_v_blocks_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum_pages_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "pages_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum_pages_blocks_page_hero_media_mode";
  ALTER TABLE "pages_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum_pages_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum_pages_blocks_page_hero_media_mode";
  ALTER TABLE "_pages_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "_pages_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_page_hero_media_mode";
  ALTER TABLE "_pages_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum__pages_v_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum__pages_v_blocks_page_hero_media_mode";
  ALTER TABLE "partners_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "partners_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_partners_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum_partners_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "partners_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum_partners_blocks_page_hero_media_mode";
  ALTER TABLE "partners_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum_partners_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum_partners_blocks_page_hero_media_mode";
  ALTER TABLE "segments_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "segments_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_segments_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum_segments_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "segments_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum_segments_blocks_page_hero_media_mode";
  ALTER TABLE "segments_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum_segments_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum_segments_blocks_page_hero_media_mode";
  ALTER TABLE "_segments_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "_segments_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__segments_v_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum__segments_v_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "_segments_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum__segments_v_blocks_page_hero_media_mode";
  ALTER TABLE "_segments_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum__segments_v_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum__segments_v_blocks_page_hero_media_mode";
  ALTER TABLE "solutions_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "solutions_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_solutions_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum_solutions_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "solutions_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum_solutions_blocks_page_hero_media_mode";
  ALTER TABLE "solutions_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum_solutions_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum_solutions_blocks_page_hero_media_mode";
  ALTER TABLE "_solutions_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE text;
  ALTER TABLE "_solutions_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__solutions_v_blocks_page_hero_media_mode";
  CREATE TYPE "public"."enum__solutions_v_blocks_page_hero_media_mode" AS ENUM('none', 'image', 'marquee');
  ALTER TABLE "_solutions_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DEFAULT 'none'::"public"."enum__solutions_v_blocks_page_hero_media_mode";
  ALTER TABLE "_solutions_v_blocks_page_hero" ALTER COLUMN "media_mode" SET DATA TYPE "public"."enum__solutions_v_blocks_page_hero_media_mode" USING "media_mode"::"public"."enum__solutions_v_blocks_page_hero_media_mode";
  DROP INDEX "pages_blocks_page_hero_video_file_idx";
  DROP INDEX "_pages_v_blocks_page_hero_video_file_idx";
  DROP INDEX "partners_blocks_page_hero_video_file_idx";
  DROP INDEX "segments_blocks_page_hero_video_file_idx";
  DROP INDEX "_segments_v_blocks_page_hero_video_file_idx";
  DROP INDEX "solutions_blocks_page_hero_video_file_idx";
  DROP INDEX "_solutions_v_blocks_page_hero_video_file_idx";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "pages_blocks_page_hero" DROP COLUMN "video_url";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "_pages_v_blocks_page_hero" DROP COLUMN "video_url";
  ALTER TABLE "partners_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "partners_blocks_page_hero" DROP COLUMN "video_url";
  ALTER TABLE "segments_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "segments_blocks_page_hero" DROP COLUMN "video_url";
  ALTER TABLE "_segments_v_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "_segments_v_blocks_page_hero" DROP COLUMN "video_url";
  ALTER TABLE "solutions_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "solutions_blocks_page_hero" DROP COLUMN "video_url";
  ALTER TABLE "_solutions_v_blocks_page_hero" DROP COLUMN "video_file_id";
  ALTER TABLE "_solutions_v_blocks_page_hero" DROP COLUMN "video_url";`)
}
