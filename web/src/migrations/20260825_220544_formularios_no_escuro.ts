import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_private_files_kind" AS ENUM('cv', 'material');
  ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'job-application';
  ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'material-download';
  CREATE TABLE "private_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"kind" "enum_private_files_kind" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "resources" ADD COLUMN "file_id" integer;
  ALTER TABLE "_resources_v" ADD COLUMN "version_file_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "confirmation_token" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "confirmed_at" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN "job_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "cv_id" integer;
  ALTER TABLE "form_submissions" ADD COLUMN "resource_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "private_files_id" integer;
  CREATE INDEX "private_files_updated_at_idx" ON "private_files" USING btree ("updated_at");
  CREATE INDEX "private_files_created_at_idx" ON "private_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "private_files_filename_idx" ON "private_files" USING btree ("filename");
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_private_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_file_id_private_files_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_cv_id_private_files_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_files_fk" FOREIGN KEY ("private_files_id") REFERENCES "public"."private_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE INDEX "_resources_v_version_version_file_idx" ON "_resources_v" USING btree ("version_file_id");
  CREATE INDEX "form_submissions_confirmation_token_idx" ON "form_submissions" USING btree ("confirmation_token");
  CREATE INDEX "form_submissions_job_idx" ON "form_submissions" USING btree ("job_id");
  CREATE INDEX "form_submissions_cv_idx" ON "form_submissions" USING btree ("cv_id");
  CREATE INDEX "form_submissions_resource_idx" ON "form_submissions" USING btree ("resource_id");
  CREATE INDEX "payload_locked_documents_rels_private_files_id_idx" ON "payload_locked_documents_rels" USING btree ("private_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "private_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "private_files" CASCADE;
  ALTER TABLE "resources" DROP CONSTRAINT "resources_file_id_private_files_id_fk";
  
  ALTER TABLE "_resources_v" DROP CONSTRAINT "_resources_v_version_file_id_private_files_id_fk";
  
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_job_id_jobs_id_fk";
  
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_cv_id_private_files_id_fk";
  
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_resource_id_resources_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_private_files_fk";
  
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_kind";
  CREATE TYPE "public"."enum_form_submissions_kind" AS ENUM('contact', 'newsletter', 'talent-pool');
  ALTER TABLE "form_submissions" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_form_submissions_kind" USING "kind"::"public"."enum_form_submissions_kind";
  DROP INDEX "resources_file_idx";
  DROP INDEX "_resources_v_version_version_file_idx";
  DROP INDEX "form_submissions_confirmation_token_idx";
  DROP INDEX "form_submissions_job_idx";
  DROP INDEX "form_submissions_cv_idx";
  DROP INDEX "form_submissions_resource_idx";
  DROP INDEX "payload_locked_documents_rels_private_files_id_idx";
  ALTER TABLE "resources" DROP COLUMN "file_id";
  ALTER TABLE "_resources_v" DROP COLUMN "version_file_id";
  ALTER TABLE "form_submissions" DROP COLUMN "confirmation_token";
  ALTER TABLE "form_submissions" DROP COLUMN "confirmed_at";
  ALTER TABLE "form_submissions" DROP COLUMN "job_id";
  ALTER TABLE "form_submissions" DROP COLUMN "cv_id";
  ALTER TABLE "form_submissions" DROP COLUMN "resource_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "private_files_id";
  DROP TYPE "public"."enum_private_files_kind";`)
}
