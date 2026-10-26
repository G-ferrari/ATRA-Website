import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* D-73 — a busca da ATRA AI no conteúdo do site, e a resposta para assunto de
 * fora dele.
 *
 * 1. `off_topic_message`: o campo do admin (gerado pelo Payload).
 * 2. A extensão `vector` e a tabela `ai_chunks`, em SQL escrito: o índice é
 *    derivado do conteúdo publicado e vive fora do Payload (o porquê está em
 *    `lib/busca-da-ia/banco.ts`). O retrato `.json` não a conhece, e é isso
 *    que impede o `migrate:create` seguinte de tentar apagá-la.
 *
 * ⚠️ A extensão exige o Postgres com pgvector (`infra/postgres/Dockerfile`).
 * Em produção, `deploy.sh` reconstrói o banco **antes** de migrar; contra a
 * imagem antiga esta migração falha no `CREATE EXTENSION`, e o deploy para
 * antes de trocar o site — que é o lado certo de falhar.
 *
 * ⚠️ Sem índice vetorial (HNSW), de propósito. São alguns milhares de trechos:
 * a varredura exata leva milissegundos e devolve sempre os mais próximos. O
 * HNSW filtra **depois** de achar os vizinhos, e com o filtro de idioma e de
 * tipo (o que o admin ligou) a busca podia voltar com menos trechos do que
 * pediu. Passando de ~100 mil trechos, a conta muda.
 *
 * Nasce vazia: quem a enche é a primeira conversa depois do deploy
 * (`lib/busca-da-ia/agenda.ts`), ou `scripts/indexar-busca-da-ia.ts`. Por isso
 * não há trava de migração de dados aqui. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "atra_ai_locales" ADD COLUMN IF NOT EXISTS "off_topic_message" varchar;

   CREATE EXTENSION IF NOT EXISTS vector;

   CREATE TABLE IF NOT EXISTS "ai_chunks" (
     "id" bigserial PRIMARY KEY,
     "code" varchar NOT NULL,
     "kind" varchar NOT NULL,
     "locale" varchar(2) NOT NULL,
     "position" integer NOT NULL,
     "content" text NOT NULL,
     "content_hash" varchar(64) NOT NULL,
     "embedding" vector(768) NOT NULL,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     CONSTRAINT "ai_chunks_code_locale_position_idx" UNIQUE ("code", "locale", "position")
   );

   CREATE INDEX IF NOT EXISTS "ai_chunks_locale_idx" ON "ai_chunks" ("locale");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  /* A extensão fica: outro objeto pode ter passado a usá-la, e ela não custa
     nada parada. */
  await db.execute(sql`
   DROP TABLE IF EXISTS "ai_chunks";
   ALTER TABLE "atra_ai_locales" DROP COLUMN IF EXISTS "off_topic_message";`)
}
