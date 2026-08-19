import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_page_nav_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_grid_locales" (
  	"nav_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_page_hero_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "pages_blocks_rich_text_section_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "pages_blocks_icon_card_grid_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "pages_blocks_value_cards_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "pages_blocks_partner_showcase_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "_pages_v_blocks_page_hero_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "_pages_v_blocks_rich_text_section_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "_pages_v_blocks_icon_card_grid_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "_pages_v_blocks_value_cards_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "_pages_v_blocks_partner_showcase_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD COLUMN "nav_label" varchar;
  ALTER TABLE "pages_blocks_sticky_page_nav_locales" ADD CONSTRAINT "pages_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_grid_locales" ADD CONSTRAINT "pages_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_page_nav_locales" ADD CONSTRAINT "_pages_v_blocks_sticky_page_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sticky_page_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_grid_locales" ADD CONSTRAINT "_pages_v_blocks_stats_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_grid"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_sticky_page_nav_locales_locale_parent_id_unique" ON "pages_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_grid_locales_locale_parent_id_unique" ON "pages_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_sticky_page_nav_locales_locale_parent_id_uni" ON "_pages_v_blocks_sticky_page_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_grid_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_page_nav_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_grid_locales" CASCADE;
  ALTER TABLE "pages_blocks_page_hero_locales" DROP COLUMN "nav_label";
  ALTER TABLE "pages_blocks_rich_text_section_locales" DROP COLUMN "nav_label";
  ALTER TABLE "pages_blocks_icon_card_grid_locales" DROP COLUMN "nav_label";
  ALTER TABLE "pages_blocks_value_cards_locales" DROP COLUMN "nav_label";
  ALTER TABLE "pages_blocks_partner_showcase_locales" DROP COLUMN "nav_label";
  ALTER TABLE "pages_blocks_cta_banner_locales" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_page_hero_locales" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_rich_text_section_locales" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_icon_card_grid_locales" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_value_cards_locales" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_partner_showcase_locales" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" DROP COLUMN "nav_label";`)
}
