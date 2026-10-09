import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { SETORES } from '../lib/diagnostico-maturidade/dados'
import { REGULACOES_PADRAO } from '../lib/diagnostico-maturidade/regulacoes'

/* Migração de **dados**: grava no global do diagnóstico a lista de regulações
 * de cada setor (07/10), para o admin **mostrar** o que está valendo.
 *
 * O campo novo tem a lista do Roger como `defaultValue`, mas o Payload só
 * aplica padrão a global que nunca foi salvo. Onde o global já existe — a
 * homologação —, os campos chegariam vazios: o site funcionaria (setor vazio
 * cai na lista do questionário, `resolverRegulacoes`), mas a editora abriria a
 * tela e não veria etiqueta nenhuma para conferir ou mudar.
 *
 * Trava: só preenche setor **vazio**. O que alguém já escolheu fica.
 *
 * ⚠️ A partir daqui quem manda é o admin. Se a base do Roger mudar a lista de
 * um setor numa versão nova, o admin não acompanha sozinho: conferir a tela. */

const SLUG = 'data-maturity-diagnostic' as const

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const atual = await payload.findGlobal({ slug: SLUG, depth: 0, req })
  const escolhidas = (atual.regulations ?? {}) as Partial<Record<string, string[] | null>>
  const vazios = SETORES.map((s) => s.valor).filter((setor) => !escolhidas[setor]?.length)
  if (vazios.length === 0) {
    payload.logger.info('[regulacoes-do-diagnostico] todos os setores já têm lista — nada a preencher')
    return
  }

  await payload.updateGlobal({
    slug: SLUG,
    data: {
      regulations: {
        ...escolhidas,
        ...Object.fromEntries(vazios.map((setor) => [setor, [...REGULACOES_PADRAO[setor]]])),
      },
    } as never,
    depth: 0,
    req,
  })
  payload.logger.info(`[regulacoes-do-diagnostico] lista do questionário gravada em ${vazios.length} setor(es): ${vazios.join(', ')}`)
}

/* Sem volta automática: esvaziar o campo de um setor no admin devolve a ele a
 * lista do questionário. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[regulacoes-do-diagnostico] sem desfazer automático: esvaziar o campo no admin volta à lista do questionário')
}
