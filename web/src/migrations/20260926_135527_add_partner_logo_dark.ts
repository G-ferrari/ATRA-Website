import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "pages_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "_pages_v_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "_pages_v_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "partners_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "partners_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "partners" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "segments_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "segments_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "_segments_v_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "_segments_v_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "solutions_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "solutions_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "_solutions_v_blocks_partner_hero" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "_solutions_v_blocks_partner_split" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "pages_blocks_partner_hero" ADD CONSTRAINT "pages_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_split" ADD CONSTRAINT "pages_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_hero" ADD CONSTRAINT "_pages_v_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partner_split" ADD CONSTRAINT "_pages_v_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_hero" ADD CONSTRAINT "partners_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_partner_split" ADD CONSTRAINT "partners_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_hero" ADD CONSTRAINT "segments_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_partner_split" ADD CONSTRAINT "segments_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_hero" ADD CONSTRAINT "_segments_v_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_partner_split" ADD CONSTRAINT "_segments_v_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_hero" ADD CONSTRAINT "solutions_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_partner_split" ADD CONSTRAINT "solutions_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_hero" ADD CONSTRAINT "_solutions_v_blocks_partner_hero_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_partner_split" ADD CONSTRAINT "_solutions_v_blocks_partner_split_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_partner_hero_logo_dark_idx" ON "pages_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "pages_blocks_partner_split_logo_dark_idx" ON "pages_blocks_partner_split" USING btree ("logo_dark_id");
  CREATE INDEX "_pages_v_blocks_partner_hero_logo_dark_idx" ON "_pages_v_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "_pages_v_blocks_partner_split_logo_dark_idx" ON "_pages_v_blocks_partner_split" USING btree ("logo_dark_id");
  CREATE INDEX "partners_blocks_partner_hero_logo_dark_idx" ON "partners_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "partners_blocks_partner_split_logo_dark_idx" ON "partners_blocks_partner_split" USING btree ("logo_dark_id");
  CREATE INDEX "partners_logo_dark_idx" ON "partners" USING btree ("logo_dark_id");
  CREATE INDEX "segments_blocks_partner_hero_logo_dark_idx" ON "segments_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "segments_blocks_partner_split_logo_dark_idx" ON "segments_blocks_partner_split" USING btree ("logo_dark_id");
  CREATE INDEX "_segments_v_blocks_partner_hero_logo_dark_idx" ON "_segments_v_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "_segments_v_blocks_partner_split_logo_dark_idx" ON "_segments_v_blocks_partner_split" USING btree ("logo_dark_id");
  CREATE INDEX "solutions_blocks_partner_hero_logo_dark_idx" ON "solutions_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "solutions_blocks_partner_split_logo_dark_idx" ON "solutions_blocks_partner_split" USING btree ("logo_dark_id");
  CREATE INDEX "_solutions_v_blocks_partner_hero_logo_dark_idx" ON "_solutions_v_blocks_partner_hero" USING btree ("logo_dark_id");
  CREATE INDEX "_solutions_v_blocks_partner_split_logo_dark_idx" ON "_solutions_v_blocks_partner_split" USING btree ("logo_dark_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_partner_hero" DROP CONSTRAINT "pages_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_partner_split" DROP CONSTRAINT "pages_blocks_partner_split_logo_dark_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_partner_hero" DROP CONSTRAINT "_pages_v_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_partner_split" DROP CONSTRAINT "_pages_v_blocks_partner_split_logo_dark_id_media_id_fk";
  
  ALTER TABLE "partners_blocks_partner_hero" DROP CONSTRAINT "partners_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "partners_blocks_partner_split" DROP CONSTRAINT "partners_blocks_partner_split_logo_dark_id_media_id_fk";
  
  ALTER TABLE "partners" DROP CONSTRAINT "partners_logo_dark_id_media_id_fk";
  
  ALTER TABLE "segments_blocks_partner_hero" DROP CONSTRAINT "segments_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "segments_blocks_partner_split" DROP CONSTRAINT "segments_blocks_partner_split_logo_dark_id_media_id_fk";
  
  ALTER TABLE "_segments_v_blocks_partner_hero" DROP CONSTRAINT "_segments_v_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "_segments_v_blocks_partner_split" DROP CONSTRAINT "_segments_v_blocks_partner_split_logo_dark_id_media_id_fk";
  
  ALTER TABLE "solutions_blocks_partner_hero" DROP CONSTRAINT "solutions_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "solutions_blocks_partner_split" DROP CONSTRAINT "solutions_blocks_partner_split_logo_dark_id_media_id_fk";
  
  ALTER TABLE "_solutions_v_blocks_partner_hero" DROP CONSTRAINT "_solutions_v_blocks_partner_hero_logo_dark_id_media_id_fk";
  
  ALTER TABLE "_solutions_v_blocks_partner_split" DROP CONSTRAINT "_solutions_v_blocks_partner_split_logo_dark_id_media_id_fk";
  
  DROP INDEX "pages_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "pages_blocks_partner_split_logo_dark_idx";
  DROP INDEX "_pages_v_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "_pages_v_blocks_partner_split_logo_dark_idx";
  DROP INDEX "partners_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "partners_blocks_partner_split_logo_dark_idx";
  DROP INDEX "partners_logo_dark_idx";
  DROP INDEX "segments_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "segments_blocks_partner_split_logo_dark_idx";
  DROP INDEX "_segments_v_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "_segments_v_blocks_partner_split_logo_dark_idx";
  DROP INDEX "solutions_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "solutions_blocks_partner_split_logo_dark_idx";
  DROP INDEX "_solutions_v_blocks_partner_hero_logo_dark_idx";
  DROP INDEX "_solutions_v_blocks_partner_split_logo_dark_idx";
  ALTER TABLE "pages_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "pages_blocks_partner_split" DROP COLUMN "logo_dark_id";
  ALTER TABLE "_pages_v_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "_pages_v_blocks_partner_split" DROP COLUMN "logo_dark_id";
  ALTER TABLE "partners_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "partners_blocks_partner_split" DROP COLUMN "logo_dark_id";
  ALTER TABLE "partners" DROP COLUMN "logo_dark_id";
  ALTER TABLE "segments_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "segments_blocks_partner_split" DROP COLUMN "logo_dark_id";
  ALTER TABLE "_segments_v_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "_segments_v_blocks_partner_split" DROP COLUMN "logo_dark_id";
  ALTER TABLE "solutions_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "solutions_blocks_partner_split" DROP COLUMN "logo_dark_id";
  ALTER TABLE "_solutions_v_blocks_partner_hero" DROP COLUMN "logo_dark_id";
  ALTER TABLE "_solutions_v_blocks_partner_split" DROP COLUMN "logo_dark_id";`)
}
