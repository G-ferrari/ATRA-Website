import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Task 043 (RD nos formulários): o identificador do Trabalhe Conosco e as tags
 * por formulário, em Sistema → Integrações.
 *
 * O identificador entra com `DEFAULT`, então o Postgres o grava também na
 * linha do global que já existe — sem isso a coluna nasceria `null`, que o
 * mapper lê como "apagado no admin" e desligaria o formulário. As tags moram
 * em `integrations_texts` e não têm esse atalho: a tag `newsletter` vem da
 * migração de dados seguinte. Nenhuma migração de dados antiga lê este global,
 * então não há armadilha de banco novo. */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "integrations_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "integrations" ADD COLUMN "rd_station_marketing_conversions_talent_pool" varchar DEFAULT 'site-trabalhe-conosco';
  ALTER TABLE "integrations_texts" ADD CONSTRAINT "integrations_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "integrations_texts_order_parent" ON "integrations_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "integrations_texts" CASCADE;
  ALTER TABLE "integrations" DROP COLUMN "rd_station_marketing_conversions_talent_pool";`)
}
