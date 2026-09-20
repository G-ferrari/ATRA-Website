import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  CREATE TYPE "public"."enum_pages_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  CREATE TYPE "public"."enum_solutions_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  CREATE TYPE "public"."enum__solutions_v_blocks_cta_contact_variant" AS ENUM('panel', 'photo');
  ALTER TABLE "partners_blocks_cta_contact" ADD COLUMN "variant" "enum_partners_blocks_cta_contact_variant" DEFAULT 'panel';
  ALTER TABLE "partners_blocks_cta_contact" ADD COLUMN "photo_id" integer;
  ALTER TABLE "pages_blocks_cta_contact" ADD COLUMN "variant" "enum_pages_blocks_cta_contact_variant" DEFAULT 'panel';
  ALTER TABLE "pages_blocks_cta_contact" ADD COLUMN "photo_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_contact" ADD COLUMN "variant" "enum__pages_v_blocks_cta_contact_variant" DEFAULT 'panel';
  ALTER TABLE "_pages_v_blocks_cta_contact" ADD COLUMN "photo_id" integer;
  ALTER TABLE "solutions_blocks_cta_contact" ADD COLUMN "variant" "enum_solutions_blocks_cta_contact_variant" DEFAULT 'panel';
  ALTER TABLE "solutions_blocks_cta_contact" ADD COLUMN "photo_id" integer;
  ALTER TABLE "_solutions_v_blocks_cta_contact" ADD COLUMN "variant" "enum__solutions_v_blocks_cta_contact_variant" DEFAULT 'panel';
  ALTER TABLE "_solutions_v_blocks_cta_contact" ADD COLUMN "photo_id" integer;
  ALTER TABLE "partners_blocks_cta_contact" ADD CONSTRAINT "partners_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_contact" ADD CONSTRAINT "pages_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_contact" ADD CONSTRAINT "_pages_v_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_cta_contact" ADD CONSTRAINT "solutions_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_cta_contact" ADD CONSTRAINT "_solutions_v_blocks_cta_contact_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners_blocks_cta_contact_photo_idx" ON "partners_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_cta_contact_photo_idx" ON "pages_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_cta_contact_photo_idx" ON "_pages_v_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX "solutions_blocks_cta_contact_photo_idx" ON "solutions_blocks_cta_contact" USING btree ("photo_id");
  CREATE INDEX "_solutions_v_blocks_cta_contact_photo_idx" ON "_solutions_v_blocks_cta_contact" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners_blocks_cta_contact" DROP CONSTRAINT "partners_blocks_cta_contact_photo_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_cta_contact" DROP CONSTRAINT "pages_blocks_cta_contact_photo_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta_contact" DROP CONSTRAINT "_pages_v_blocks_cta_contact_photo_id_media_id_fk";
  
  ALTER TABLE "solutions_blocks_cta_contact" DROP CONSTRAINT "solutions_blocks_cta_contact_photo_id_media_id_fk";
  
  ALTER TABLE "_solutions_v_blocks_cta_contact" DROP CONSTRAINT "_solutions_v_blocks_cta_contact_photo_id_media_id_fk";
  
  DROP INDEX "partners_blocks_cta_contact_photo_idx";
  DROP INDEX "pages_blocks_cta_contact_photo_idx";
  DROP INDEX "_pages_v_blocks_cta_contact_photo_idx";
  DROP INDEX "solutions_blocks_cta_contact_photo_idx";
  DROP INDEX "_solutions_v_blocks_cta_contact_photo_idx";
  ALTER TABLE "partners_blocks_cta_contact" DROP COLUMN "variant";
  ALTER TABLE "partners_blocks_cta_contact" DROP COLUMN "photo_id";
  ALTER TABLE "pages_blocks_cta_contact" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_cta_contact" DROP COLUMN "photo_id";
  ALTER TABLE "_pages_v_blocks_cta_contact" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_cta_contact" DROP COLUMN "photo_id";
  ALTER TABLE "solutions_blocks_cta_contact" DROP COLUMN "variant";
  ALTER TABLE "solutions_blocks_cta_contact" DROP COLUMN "photo_id";
  ALTER TABLE "_solutions_v_blocks_cta_contact" DROP COLUMN "variant";
  ALTER TABLE "_solutions_v_blocks_cta_contact" DROP COLUMN "photo_id";
  DROP TYPE "public"."enum_partners_blocks_cta_contact_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_contact_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_contact_variant";
  DROP TYPE "public"."enum_solutions_blocks_cta_contact_variant";
  DROP TYPE "public"."enum__solutions_v_blocks_cta_contact_variant";`)
}
