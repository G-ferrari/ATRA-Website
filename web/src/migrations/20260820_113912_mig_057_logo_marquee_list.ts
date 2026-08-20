import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "partners_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "solutions_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "_solutions_v_blocks_logo_marquee_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "partners_blocks_logo_marquee_partners" ADD CONSTRAINT "partners_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_logo_marquee_partners" ADD CONSTRAINT "partners_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_partners" ADD CONSTRAINT "pages_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_partners" ADD CONSTRAINT "pages_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_partners" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_partners" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_logo_marquee_partners" ADD CONSTRAINT "solutions_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_logo_marquee_partners" ADD CONSTRAINT "solutions_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_logo_marquee_partners" ADD CONSTRAINT "_solutions_v_blocks_logo_marquee_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_logo_marquee_partners" ADD CONSTRAINT "_solutions_v_blocks_logo_marquee_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_logo_marquee_partners_order_idx" ON "partners_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "partners_blocks_logo_marquee_partners_parent_id_idx" ON "partners_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_logo_marquee_partners_logo_idx" ON "partners_blocks_logo_marquee_partners" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_marquee_partners_order_idx" ON "pages_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_marquee_partners_parent_id_idx" ON "pages_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_partners_logo_idx" ON "pages_blocks_logo_marquee_partners" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_partners_order_idx" ON "_pages_v_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_marquee_partners_parent_id_idx" ON "_pages_v_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_partners_logo_idx" ON "_pages_v_blocks_logo_marquee_partners" USING btree ("logo_id");
  CREATE INDEX "solutions_blocks_logo_marquee_partners_order_idx" ON "solutions_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "solutions_blocks_logo_marquee_partners_parent_id_idx" ON "solutions_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_logo_marquee_partners_logo_idx" ON "solutions_blocks_logo_marquee_partners" USING btree ("logo_id");
  CREATE INDEX "_solutions_v_blocks_logo_marquee_partners_order_idx" ON "_solutions_v_blocks_logo_marquee_partners" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_logo_marquee_partners_parent_id_idx" ON "_solutions_v_blocks_logo_marquee_partners" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_logo_marquee_partners_logo_idx" ON "_solutions_v_blocks_logo_marquee_partners" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_logo_marquee_partners" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee_partners" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee_partners" CASCADE;
  DROP TABLE "solutions_blocks_logo_marquee_partners" CASCADE;
  DROP TABLE "_solutions_v_blocks_logo_marquee_partners" CASCADE;`)
}
