import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners_blocks_value_cards_locales" ADD COLUMN "highlight" varchar;
  ALTER TABLE "pages_blocks_value_cards_locales" ADD COLUMN "highlight" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_locales" ADD COLUMN "highlight" varchar;
  ALTER TABLE "solutions_blocks_value_cards_locales" ADD COLUMN "highlight" varchar;
  ALTER TABLE "_solutions_v_blocks_value_cards_locales" ADD COLUMN "highlight" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners_blocks_value_cards_locales" DROP COLUMN "highlight";
  ALTER TABLE "pages_blocks_value_cards_locales" DROP COLUMN "highlight";
  ALTER TABLE "_pages_v_blocks_value_cards_locales" DROP COLUMN "highlight";
  ALTER TABLE "solutions_blocks_value_cards_locales" DROP COLUMN "highlight";
  ALTER TABLE "_solutions_v_blocks_value_cards_locales" DROP COLUMN "highlight";`)
}
