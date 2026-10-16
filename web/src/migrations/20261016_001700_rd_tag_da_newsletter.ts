import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

import { TAGS_PADRAO } from '../lib/formatos-de-integracao'

/* Migração de **dados** da task 043: a newsletter chega ao RD com a tag
 * `newsletter`, que é como o marketing segmenta os envios (Taci, 14/10).
 *
 * O campo nasce com a tag, mas `defaultValue` só vale para global nunca salvo.
 * Na homologação o global `integrations` existe desde 29/09 (D-41): a lista
 * chegaria vazia, e vazia é "sem tag".
 *
 * Trava: só grava se a lista da newsletter estiver vazia — tag que alguém já
 * pôs no admin não é tocada. Banco sem o global (banco novo, antes de alguém
 * salvar) é pulado: ali o mapper já usa o padrão. */

const SLUG = 'integrations' as const

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.execute(sql`SELECT "id" FROM "integrations" LIMIT 1`)
  if (rows.length === 0) {
    payload.logger.info('[rd-tag-newsletter] o global ainda não existe — o padrão do campo vale')
    return
  }

  const atual = await payload.findGlobal({ slug: SLUG, depth: 0, req })
  const rd = atual.rdStationMarketing ?? {}
  if (rd.tags?.newsletter?.length) {
    payload.logger.info('[rd-tag-newsletter] a newsletter já tem tag — mantida')
    return
  }

  /* O grupo inteiro de volta, com a tag acrescentada: mandar só a tag deixaria
     a escrita depender de como o Payload funde grupos aninhados. */
  await payload.updateGlobal({
    slug: SLUG,
    depth: 0,
    req,
    data: { rdStationMarketing: { ...rd, tags: { ...rd.tags, newsletter: [...TAGS_PADRAO.newsletter] } } },
  })
  payload.logger.info(`[rd-tag-newsletter] newsletter com a tag: ${TAGS_PADRAO.newsletter.join(', ')}`)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Nada a desfazer: a tag fica editável no admin, e a migração de schema
     anterior apaga a tabela inteira no down dela. */
}
