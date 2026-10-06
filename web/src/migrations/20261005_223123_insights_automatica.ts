import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items" CASCADE;
  DROP TABLE "pages_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items" CASCADE;
  DROP TABLE "partners_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items" CASCADE;
  DROP TABLE "segments_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE "_segments_v_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items" CASCADE;
  DROP TABLE "solutions_blocks_insights_hub_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items_tags" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items_tags_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_insights_hub_items_locales" CASCADE;
  ALTER TABLE "pages_blocks_insights_hub_formats" DROP COLUMN "count";
  ALTER TABLE "_pages_v_blocks_insights_hub_formats" DROP COLUMN "count";
  ALTER TABLE "partners_blocks_insights_hub_formats" DROP COLUMN "count";
  ALTER TABLE "segments_blocks_insights_hub_formats" DROP COLUMN "count";
  ALTER TABLE "_segments_v_blocks_insights_hub_formats" DROP COLUMN "count";
  ALTER TABLE "solutions_blocks_insights_hub_formats" DROP COLUMN "count";
  ALTER TABLE "_solutions_v_blocks_insights_hub_formats" DROP COLUMN "count";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "partners_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "segments_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_segments_v_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "solutions_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items_tags_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_insights_hub_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"category" varchar,
  	"meta" varchar,
  	"date" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "_pages_v_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "partners_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "segments_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "_segments_v_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "solutions_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "_solutions_v_blocks_insights_hub_formats" ADD COLUMN "count" numeric;
  ALTER TABLE "pages_blocks_insights_hub_items_tags" ADD CONSTRAINT "pages_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "pages_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items" ADD CONSTRAINT "pages_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items" ADD CONSTRAINT "pages_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_hub_items_locales" ADD CONSTRAINT "pages_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items_tags" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_hub_items_locales" ADD CONSTRAINT "_pages_v_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items_tags" ADD CONSTRAINT "partners_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "partners_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items" ADD CONSTRAINT "partners_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items" ADD CONSTRAINT "partners_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_insights_hub_items_locales" ADD CONSTRAINT "partners_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items_tags" ADD CONSTRAINT "segments_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "segments_blocks_insights_hub_items_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items" ADD CONSTRAINT "segments_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items" ADD CONSTRAINT "segments_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "segments_blocks_insights_hub_items_locales" ADD CONSTRAINT "segments_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."segments_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_tags" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_tags_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_segments_v_blocks_insights_hub_items_locales" ADD CONSTRAINT "_segments_v_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_segments_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items_tags" ADD CONSTRAINT "solutions_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "solutions_blocks_insights_hub_items_tags_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items" ADD CONSTRAINT "solutions_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items" ADD CONSTRAINT "solutions_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_insights_hub_items_locales" ADD CONSTRAINT "solutions_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items_tags" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items_tags_locales" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_tags_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_items_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_insights_hub_items_locales" ADD CONSTRAINT "_solutions_v_blocks_insights_hub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_insights_hub_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_insights_hub_items_tags_order_idx" ON "pages_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_hub_items_tags_parent_id_idx" ON "pages_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_insights_hub_items_tags_locales_locale_parent_i" ON "pages_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_items_order_idx" ON "pages_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_hub_items_parent_id_idx" ON "pages_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_insights_hub_items_image_idx" ON "pages_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_insights_hub_items_locales_locale_parent_id_uni" ON "pages_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_tags_order_idx" ON "_pages_v_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_tags_parent_id_idx" ON "_pages_v_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_insights_hub_items_tags_locales_locale_paren" ON "_pages_v_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_order_idx" ON "_pages_v_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_parent_id_idx" ON "_pages_v_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_hub_items_image_idx" ON "_pages_v_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_insights_hub_items_locales_locale_parent_id_" ON "_pages_v_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_items_tags_order_idx" ON "partners_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "partners_blocks_insights_hub_items_tags_parent_id_idx" ON "partners_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_blocks_insights_hub_items_tags_locales_locale_paren" ON "partners_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_items_order_idx" ON "partners_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_insights_hub_items_parent_id_idx" ON "partners_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_insights_hub_items_image_idx" ON "partners_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "partners_blocks_insights_hub_items_locales_locale_parent_id_" ON "partners_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_items_tags_order_idx" ON "segments_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "segments_blocks_insights_hub_items_tags_parent_id_idx" ON "segments_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "segments_blocks_insights_hub_items_tags_locales_locale_paren" ON "segments_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_items_order_idx" ON "segments_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "segments_blocks_insights_hub_items_parent_id_idx" ON "segments_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "segments_blocks_insights_hub_items_image_idx" ON "segments_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "segments_blocks_insights_hub_items_locales_locale_parent_id_" ON "segments_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_tags_order_idx" ON "_segments_v_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_tags_parent_id_idx" ON "_segments_v_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_insights_hub_items_tags_locales_locale_pa" ON "_segments_v_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_order_idx" ON "_segments_v_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_parent_id_idx" ON "_segments_v_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "_segments_v_blocks_insights_hub_items_image_idx" ON "_segments_v_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_segments_v_blocks_insights_hub_items_locales_locale_parent_" ON "_segments_v_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_items_tags_order_idx" ON "solutions_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "solutions_blocks_insights_hub_items_tags_parent_id_idx" ON "solutions_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_blocks_insights_hub_items_tags_locales_locale_pare" ON "solutions_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_items_order_idx" ON "solutions_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_insights_hub_items_parent_id_idx" ON "solutions_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_insights_hub_items_image_idx" ON "solutions_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "solutions_blocks_insights_hub_items_locales_locale_parent_id" ON "solutions_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_tags_order_idx" ON "_solutions_v_blocks_insights_hub_items_tags" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_tags_parent_id_idx" ON "_solutions_v_blocks_insights_hub_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_insights_hub_items_tags_locales_locale_p" ON "_solutions_v_blocks_insights_hub_items_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_order_idx" ON "_solutions_v_blocks_insights_hub_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_parent_id_idx" ON "_solutions_v_blocks_insights_hub_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_insights_hub_items_image_idx" ON "_solutions_v_blocks_insights_hub_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_insights_hub_items_locales_locale_parent" ON "_solutions_v_blocks_insights_hub_items_locales" USING btree ("_locale","_parent_id");`)
}
