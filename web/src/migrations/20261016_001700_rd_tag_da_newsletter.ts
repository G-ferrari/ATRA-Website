import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

/* Migração de **dados** da task 043: a newsletter chega ao RD com a tag
 * `newsletter`, que é como o marketing segmenta os envios (Taci, 14/10).
 *
 * O campo nasce com a tag, mas `defaultValue` só vale para global nunca salvo.
 * Na homologação o global `integrations` existe desde 29/09 (D-41): a lista
 * chegaria vazia, e vazia é "sem tag".
 *
 * ⚠️ SQL, e não `findGlobal`/`updateGlobal`. A Local API usa o config **de
 * hoje** e revalida o global inteiro: um campo que o futuro acrescente a
 * `integrations`, ou uma validação que fique mais rígida, faria esta migração
 * morrer em qualquer banco que a rode atrasado (backup restaurado, produção
 * clonada da homologação) — e o deploy migra antes de trocar.
 *
 * Trava: grava só se a newsletter não tiver tag nenhuma — tag que alguém já
 * pôs no admin não é tocada. Sem linha do global (banco novo, antes de alguém
 * salvar) o `INSERT ... SELECT` não acha pai e não grava nada: ali o mapper
 * já usa o padrão. O caminho é o que o adapter grava em `path` para o campo
 * `rdStationMarketing.tags.newsletter` (conferido em 15/10 salvando pelo
 * Payload num banco de teste). */
export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.execute(sql`
    INSERT INTO "integrations_texts" ("order", "parent_id", "path", "text")
    SELECT 1, i."id", 'rdStationMarketing.tags.newsletter', 'newsletter'
    FROM "integrations" i
    WHERE NOT EXISTS (
      SELECT 1 FROM "integrations_texts" t
      WHERE t."parent_id" = i."id" AND t."path" = 'rdStationMarketing.tags.newsletter'
    )
    RETURNING "parent_id"`)
  payload.logger.info(
    rows.length
      ? '[rd-tag-newsletter] newsletter com a tag: newsletter'
      : '[rd-tag-newsletter] sem global ou já com tag — nada a fazer',
  )
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Nada a desfazer: a tag fica editável no admin, e a migração de schema
     anterior apaga a tabela inteira no down dela. */
}
