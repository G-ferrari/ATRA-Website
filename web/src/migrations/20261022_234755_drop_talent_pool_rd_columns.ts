import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { EXCLUSAO_ADIADA, RECRIACAO } from './20261022_181457_trabalhe_conosco_fora_do_rd'

/* A exclusão que `20261022_181457_trabalhe_conosco_fora_do_rd` deixou pronta e
 * adiada (D-67): as duas colunas do Trabalhe Conosco no global `integrations`
 * — o identificador de conversão e o aviso ao candidato — e as tags dele
 * gravadas em `integrations_texts`.
 *
 * Adiada para não tornar a volta do deploy impossível: o código de antes da
 * D-67 lia as colunas em toda consulta ao global. A D-67 está no ar na
 * homologação desde 22/10 (publicada pela #178), então a versão para onde um
 * deploy reprovado volta já não declara os campos.
 *
 * Idempotente dos dois lados (`IF EXISTS` / `IF NOT EXISTS`). O `.json` é o
 * mesmo retrato da migração anterior: o config já não tinha os campos desde lá. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(EXCLUSAO_ADIADA)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  /* As colunas voltam vazias (o identificador, com o padrão de antes). As
     tags apagadas não voltam; o código de antes cai no padrão, lista vazia. */
  await db.execute(RECRIACAO)
}
