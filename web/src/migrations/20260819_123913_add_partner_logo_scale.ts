import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_logo_scale" AS ENUM('sm', 'md', 'lg');
  ALTER TABLE "partners" ADD COLUMN "logo_scale" "enum_partners_logo_scale" DEFAULT 'md';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP COLUMN "logo_scale";
  DROP TYPE "public"."enum_partners_logo_scale";`)
}
