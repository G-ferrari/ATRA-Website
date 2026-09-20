import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "topics" ADD COLUMN "show_in_filter" boolean DEFAULT false;
  ALTER TABLE "topics" ADD COLUMN "filter_order" numeric DEFAULT 0;
  CREATE INDEX "topics_show_in_filter_idx" ON "topics" USING btree ("show_in_filter");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "topics_show_in_filter_idx";
  ALTER TABLE "topics" DROP COLUMN "show_in_filter";
  ALTER TABLE "topics" DROP COLUMN "filter_order";`)
}
