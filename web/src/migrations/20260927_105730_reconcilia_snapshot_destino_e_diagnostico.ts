import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Migração **vazia de propósito** — só existe pelo snapshot `.json` ao lado.
 *
 * `20260926_184353_add_form_recipients` (PR #51) e
 * `20260926_193658_add_data_maturity_diagnostic` (feature do diagnóstico) foram
 * geradas em paralelo, cada uma a partir do snapshot da `migracao` de então. O
 * gerador compara o schema com o snapshot **mais recente por nome**, que é o do
 * diagnóstico — e ele não conhece as colunas `contact.form_recipients_*`. Sem
 * esta migração, o próximo `migrate:create` tentaria criá-las de novo, e o
 * deploy quebraria com "column already exists".
 *
 * O gerador propôs exatamente isso (5 × `ADD COLUMN form_recipients_*`); as
 * colunas já existem pela 184353, então o `up` não faz nada e o `.json` passa a
 * ser o schema real. Conferido: depois dela, `migrate:create --skip-empty` não
 * gera nada. */

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('[migração] reconciliação de snapshot — nenhuma alteração no banco')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('[migração] reconciliação de snapshot — nada a desfazer')
}
