import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_solutions_category" ADD VALUE 'rc18';
  ALTER TYPE "public"."enum__solutions_v_version_category" ADD VALUE 'rc18';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_solutions_category";
  CREATE TYPE "public"."enum_solutions_category" AS ENUM('innovation-ai', 'data-bi', 'governance-culture');
  ALTER TABLE "solutions" ALTER COLUMN "category" SET DATA TYPE "public"."enum_solutions_category" USING "category"::"public"."enum_solutions_category";
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__solutions_v_version_category";
  CREATE TYPE "public"."enum__solutions_v_version_category" AS ENUM('innovation-ai', 'data-bi', 'governance-culture');
  ALTER TABLE "_solutions_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__solutions_v_version_category" USING "version_category"::"public"."enum__solutions_v_version_category";`)
}
