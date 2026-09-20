import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_icon_card_grid_variant" AS ENUM('compact', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_grid_variant" AS ENUM('compact', 'card');
  ALTER TABLE "pages_blocks_icon_card_grid" ADD COLUMN "variant" "enum_pages_blocks_icon_card_grid_variant" DEFAULT 'compact';
  ALTER TABLE "_pages_v_blocks_icon_card_grid" ADD COLUMN "variant" "enum__pages_v_blocks_icon_card_grid_variant" DEFAULT 'compact';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_icon_card_grid" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_icon_card_grid" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_icon_card_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_grid_variant";`)
}
