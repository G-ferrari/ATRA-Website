import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

import { TIPOS_RECOMENDAVEIS } from '../lib/mappers/catalogo-da-ia'
import { ehInstrucaoDoPrototipo, semOManualDoCartaoDeServico } from './arquivos/instrucao-da-atra-ai'

/* Migração de **dados** da D-60: a ATRA AI passa a recomendar o que está
 * publicado no site, e duas coisas precisam chegar a um global que já existe.
 *
 * 1. **O que a IA pode recomendar** (`recommends`). O campo nasce com todos os
 *    tipos ligados, mas `defaultValue` só vale para global que nunca foi salvo.
 *    Na homologação o global existe desde setembro: o campo chegaria vazio, e
 *    vazio é "nada ligado" — o assistente ficaria sem recomendar nada.
 *
 * 2. **O manual do cartão de serviço**, no texto da instrução. Só sai se o
 *    campo ainda for o texto do protótipo, caractere a caractere: texto que o
 *    marketing editou não é tocado (D-22). Nesse caso quem manda são as regras
 *    do código, que vêm depois do texto do admin e dizem para não usar a
 *    etiqueta antiga.
 *
 * Trava: banco sem o global (banco novo, antes do seed) é pulado — criá-lo aqui
 * exigiria inventar os campos obrigatórios, e o seed já grava as duas coisas. */

const SLUG = 'atra-ai' as const
const IDIOMAS = ['pt', 'en'] as const

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.execute(sql`SELECT "id" FROM "atra_ai" LIMIT 1`)
  if (rows.length === 0) {
    payload.logger.info('[atra-ai-recomenda] o global ainda não existe — o seed grava a lista e o texto')
    return
  }

  const atual = await payload.findGlobal({ slug: SLUG, depth: 0, locale: 'pt', req })
  if (!atual.recommends?.length) {
    await payload.updateGlobal({ slug: SLUG, depth: 0, locale: 'pt', req, data: { recommends: [...TIPOS_RECOMENDAVEIS] } })
    payload.logger.info(`[atra-ai-recomenda] tipos ligados: ${TIPOS_RECOMENDAVEIS.join(', ')}`)
  } else {
    payload.logger.info('[atra-ai-recomenda] a lista de tipos já foi escolhida — mantida')
  }

  for (const locale of IDIOMAS) {
    /* Sem fallback: o inglês vazio não pode ser lido como "igual ao português"
       e ganhar um texto que ninguém gravou ali. */
    const doIdioma = await payload.findGlobal({ slug: SLUG, depth: 0, locale, fallbackLocale: false, req })
    if (!ehInstrucaoDoPrototipo(doIdioma.systemPrompt)) {
      payload.logger.info(`[atra-ai-recomenda] instrução (${locale}) editada ou vazia — não tocada`)
      continue
    }
    await payload.updateGlobal({
      slug: SLUG,
      depth: 0,
      locale,
      req,
      data: { systemPrompt: semOManualDoCartaoDeServico(doIdioma.systemPrompt) },
    })
    payload.logger.info(`[atra-ai-recomenda] instrução (${locale}): o manual do cartão de serviço saiu`)
  }
}

/* Sem volta automática: o texto anterior está em
 * `arquivos/instrucao-da-atra-ai.ts`, e a lista de tipos se edita no admin. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[atra-ai-recomenda] sem desfazer automático')
}
