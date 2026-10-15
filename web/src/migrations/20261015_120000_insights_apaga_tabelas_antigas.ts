import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { EXCLUSAO_ADIADA } from './20261005_223123_insights_automatica'

/* A exclusão que `20261005_223123_insights_automatica` deixou pronta e adiada:
 * as tabelas dos cartões escritos à mão da Insights (`items` e os tópicos
 * deles) e a contagem das pílulas (`formats.count`), em `pages`, `solutions`,
 * `segments` e `partners` e nas versões.
 *
 * Adiada para não tornar a volta do deploy impossível: o código de antes da
 * D-55 lia estas tabelas em toda consulta àquelas collections. Desde 06/10
 * houve várias publicações com o código que não as lê (#120 a #125), então a
 * versão para onde um deploy reprovado volta também não as conhece.
 *
 * Idempotente (`IF EXISTS`): no banco de quem aplicou a versão antiga da
 * migração de 05/10 elas já tinham saído. Sem `.json`: o retrato do schema não
 * muda, porque o config já não as tinha desde 05/10. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(EXCLUSAO_ADIADA)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  /* Não há o que recriar: os cartões escritos à mão saíram do site na D-55, e
     as linhas já eram lixo — nenhuma página as mostrava. */
}
