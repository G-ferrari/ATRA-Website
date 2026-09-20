import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "partners_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "partners_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "partners_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "pages_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "solutions_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "solutions_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "solutions_blocks_testimonial_carousel_items_locales" CASCADE;
  DROP TABLE "_solutions_v_blocks_home_hero_prompt_clients" CASCADE;
  DROP TABLE "_solutions_v_blocks_testimonial_carousel_items" CASCADE;
  DROP TABLE "_solutions_v_blocks_testimonial_carousel_items_locales" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "partners_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false
  );
  
  CREATE TABLE "partners_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "partners_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false
  );
  
  CREATE TABLE "solutions_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "solutions_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_solutions_v_blocks_home_hero_prompt_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"boost" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_testimonial_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_blocks_testimonial_carousel_items_locales" (
  	"text" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "partners_blocks_home_hero_prompt_clients" ADD CONSTRAINT "partners_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_home_hero_prompt_clients" ADD CONSTRAINT "partners_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_items" ADD CONSTRAINT "partners_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_items" ADD CONSTRAINT "partners_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "partners_blocks_testimonial_carousel_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_prompt_clients" ADD CONSTRAINT "pages_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_prompt_clients" ADD CONSTRAINT "pages_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_items" ADD CONSTRAINT "pages_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_items" ADD CONSTRAINT "pages_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "pages_blocks_testimonial_carousel_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_pages_v_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_pages_v_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_hero_prompt_clients" ADD CONSTRAINT "solutions_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_home_hero_prompt_clients" ADD CONSTRAINT "solutions_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_items" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_items" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "solutions_blocks_testimonial_carousel_items_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_solutions_v_blocks_home_hero_prompt_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_home_hero_prompt_clients" ADD CONSTRAINT "_solutions_v_blocks_home_hero_prompt_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_items" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_testimonial_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_blocks_testimonial_carousel_items_locales" ADD CONSTRAINT "_solutions_v_blocks_testimonial_carousel_items_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_blocks_testimonial_carousel_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "partners_blocks_home_hero_prompt_clients_order_idx" ON "partners_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "partners_blocks_home_hero_prompt_clients_parent_id_idx" ON "partners_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_home_hero_prompt_clients_logo_idx" ON "partners_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "partners_blocks_testimonial_carousel_items_order_idx" ON "partners_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "partners_blocks_testimonial_carousel_items_parent_id_idx" ON "partners_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "partners_blocks_testimonial_carousel_items_avatar_idx" ON "partners_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "partners_blocks_testimonial_carousel_items_locales_locale_pa" ON "partners_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_home_hero_prompt_clients_order_idx" ON "pages_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_prompt_clients_parent_id_idx" ON "pages_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_prompt_clients_logo_idx" ON "pages_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_items_order_idx" ON "pages_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_carousel_items_parent_id_idx" ON "pages_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_items_avatar_idx" ON "pages_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "pages_blocks_testimonial_carousel_items_locales_locale_paren" ON "pages_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_prompt_clients_order_idx" ON "_pages_v_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_prompt_clients_parent_id_idx" ON "_pages_v_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_prompt_clients_logo_idx" ON "_pages_v_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_items_order_idx" ON "_pages_v_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_items_parent_id_idx" ON "_pages_v_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_items_avatar_idx" ON "_pages_v_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonial_carousel_items_locales_locale_pa" ON "_pages_v_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_blocks_home_hero_prompt_clients_order_idx" ON "solutions_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "solutions_blocks_home_hero_prompt_clients_parent_id_idx" ON "solutions_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_home_hero_prompt_clients_logo_idx" ON "solutions_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "solutions_blocks_testimonial_carousel_items_order_idx" ON "solutions_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "solutions_blocks_testimonial_carousel_items_parent_id_idx" ON "solutions_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_blocks_testimonial_carousel_items_avatar_idx" ON "solutions_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "solutions_blocks_testimonial_carousel_items_locales_locale_p" ON "solutions_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_hero_prompt_clients_order_idx" ON "_solutions_v_blocks_home_hero_prompt_clients" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_home_hero_prompt_clients_parent_id_idx" ON "_solutions_v_blocks_home_hero_prompt_clients" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_home_hero_prompt_clients_logo_idx" ON "_solutions_v_blocks_home_hero_prompt_clients" USING btree ("logo_id");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_items_order_idx" ON "_solutions_v_blocks_testimonial_carousel_items" USING btree ("_order");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_items_parent_id_idx" ON "_solutions_v_blocks_testimonial_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_blocks_testimonial_carousel_items_avatar_idx" ON "_solutions_v_blocks_testimonial_carousel_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_solutions_v_blocks_testimonial_carousel_items_locales_local" ON "_solutions_v_blocks_testimonial_carousel_items_locales" USING btree ("_locale","_parent_id");`)
}
