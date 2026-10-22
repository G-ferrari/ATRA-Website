import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { EXCLUSAO_ADIADA, RECRIACAO } from './20261022_013640_remove_cta_contact_photo'

/* A exclusão que `20261022_013640_remove_cta_contact_photo` deixou pronta e
 * adiada: a coluna `photo_id` do bloco "Contato com formulário" (`ctaContact`),
 * com a chave para `media` e o índice, nas sete tabelas do bloco — `pages`,
 * `partners`, `segments` e `solutions`, e as versões das que têm rascunho.
 *
 * Adiada para não tornar a volta do deploy impossível: o código de antes da
 * #173 lia a coluna em toda consulta àquelas collections. A #173 está no ar na
 * homologação desde 22/10 (publicada pela #175), então a versão para onde um
 * deploy reprovado volta já não declara o campo.
 *
 * Idempotente dos dois lados (`IF EXISTS` / `IF NOT EXISTS`). O `.json` é o
 * mesmo retrato da migração anterior: o config já não tinha o campo desde lá. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(EXCLUSAO_ADIADA)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  /* A coluna volta vazia: a foto mora no global Contato desde a #171. */
  await db.execute(RECRIACAO)
}
