import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_specialist_roles_gradient" AS ENUM('blue-cyan', 'cyan-teal', 'indigo-blue', 'sky-indigo', 'purple-indigo', 'emerald-teal', 'amber-orange', 'blue-teal');
  ALTER TABLE "specialist_roles" ADD COLUMN "gradient" "enum_specialist_roles_gradient" DEFAULT 'blue-cyan' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "specialist_roles" DROP COLUMN "gradient";
  DROP TYPE "public"."enum_specialist_roles_gradient";`)
}
