import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/* Migração de **dados**: tira o endereço da Av. Queiroz Filho do global
 * `contact`. A ATRA não tem mais endereço fixo (G-ferrari, 29/09), e o campo
 * deixou de ser obrigatório na migração anterior; vazio, ele some do rodapé, do
 * painel ao lado dos formulários e do JSON-LD.
 *
 * Trava: só apaga o endereço antigo. Se alguém já gravou outro no admin, é
 * escolha de quem edita, e fica. */

const ANTIGO = /queiroz filho/i

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const contato = await payload.findGlobal({ slug: 'contact', depth: 0, req })
  if (!contato.address || !ANTIGO.test(contato.address)) {
    payload.logger.warn(`[sem-endereco] endereço atual não é o antigo (${contato.address ? 'outro' : 'vazio'}) — mantido`)
    return
  }
  await payload.updateGlobal({ slug: 'contact', data: { address: null }, depth: 0, req })
  payload.logger.info('[sem-endereco] endereço antigo removido do global de contato')
}

/* Sem volta automática: o endereço antigo não existe mais, e regravá-lo
 * publicaria um lugar onde a ATRA não está. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[sem-endereco] sem desfazer automático: preencher o endereço em Sistema → Contato, se for o caso')
}
