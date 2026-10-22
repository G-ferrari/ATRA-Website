import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* D-67 (22/10) — o Trabalhe Conosco sai do RD Station, e o aviso de privacidade
 * do banco de talentos passa de Sistema → Integrações para Sistema → Contato →
 * Candidaturas.
 *
 * A coluna nova já pode existir — a antecipada
 * `20260929_222920_aviso_do_banco_de_talentos_antecipada` a cria em banco novo
 * —, então vai com `IF NOT EXISTS`.
 *
 * ⚠️ O aviso antigo **não é copiado**. O texto que o admin pedia ali era o de
 * um envio ao RD ("diga que o cadastro vai também ao RD Station"), e copiado
 * ele diria ao candidato uma coisa que deixou de ser verdade. Na homologação
 * estava vazio (conferido em /carreiras, 22/10); o RH escreve o novo.
 *
 * ⚠️ O gerador escreveu aqui a exclusão das duas colunas do Trabalhe Conosco em
 * `integrations` — e ela fica **adiada**, como a de
 * `20261022_013640_remove_cta_contact_photo`. O código que está no ar quando
 * esta publicação entra ainda declara os dois campos e os lê em toda consulta
 * ao global; se o deploy reprovar e voltar, sem as colunas ele cairia em
 * "column … does not exist". A publicação seguinte executa `EXCLUSAO_ADIADA`
 * no `up` e `RECRIACAO` no `down`; as duas são idempotentes. Até lá as
 * colunas ficam no banco, sem uso. */
export const EXCLUSAO_ADIADA = sql`
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_conversions_talent_pool";
  ALTER TABLE "integrations" DROP COLUMN IF EXISTS "rd_station_marketing_talent_pool_notice";
  DELETE FROM "integrations_texts" WHERE "path" = 'rdStationMarketing.tags.talentPool';
`

/* A volta da exclusão: as colunas vazias, com o padrão que o identificador
 * tinha — o que o código de antes precisa para consultar. As tags apagadas não
 * voltam (o código de antes cai no padrão, que era lista vazia). */
export const RECRIACAO = sql`
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_conversions_talent_pool" varchar DEFAULT 'site-trabalhe-conosco';
  ALTER TABLE "integrations" ADD COLUMN IF NOT EXISTS "rd_station_marketing_talent_pool_notice" varchar;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "job_applications_talent_pool_notice" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" DROP COLUMN IF EXISTS "job_applications_talent_pool_notice";`)
}
