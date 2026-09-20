import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_section_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_section_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_rich_text_section_ctas" ADD CONSTRAINT "pages_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "pages_blocks_rich_text_section_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_section_ctas" ADD CONSTRAINT "_pages_v_blocks_rich_text_section_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_section_ctas_locales" ADD CONSTRAINT "_pages_v_blocks_rich_text_section_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text_section_ctas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_section_ctas_order_idx" ON "pages_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_section_ctas_parent_id_idx" ON "pages_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_section_ctas_locales_locale_parent_id" ON "pages_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_section_ctas_order_idx" ON "_pages_v_blocks_rich_text_section_ctas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_section_ctas_parent_id_idx" ON "_pages_v_blocks_rich_text_section_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_text_section_ctas_locales_locale_parent" ON "_pages_v_blocks_rich_text_section_ctas_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "pages_blocks_rich_text_section_ctas_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_section_ctas" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_section_ctas_locales" CASCADE;`)
}
