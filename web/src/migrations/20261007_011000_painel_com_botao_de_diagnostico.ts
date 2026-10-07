import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { SEGUNDO_BOTAO, semOCaminhoQueViraBotao } from './arquivos/painel-de-conversao'

/* Migração de **dados**: no painel do menu de Soluções, o terceiro caminho
 * ("Cortar custo e risco em nuvem") vira o segundo botão, "Faça seu diagnóstico
 * agora", ao lado de "Falar com um especialista" (06/10, pedido da Karen).
 *
 * Travas:
 * - segundo botão já preenchido → nada a fazer (rodou, ou alguém o escreveu);
 * - painel sem título → não existe ainda, nada a ajustar;
 * - o caminho só sai se ainda tiver o título de 02/10. Reescrito no admin, ele
 *   fica, e o botão entra do mesmo jeito.
 *
 * Em banco novo roda logo depois de `20261002_203000`, que acabou de gravar os
 * três caminhos — então o painel do CI nasce igual ao da homologação. */

const SLUG = 'conversion-panel' as const

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const pt = await payload.findGlobal({ slug: SLUG, locale: 'pt', fallbackLocale: false, depth: 0, req })
  if (!pt.title?.trim()) {
    payload.logger.warn('[painel-botao] painel sem título — nada a ajustar')
    return
  }
  if (pt.secondaryCtaLabel?.trim()) {
    payload.logger.warn('[painel-botao] o segundo botão já tem texto — mantido')
    return
  }

  const restantes = semOCaminhoQueViraBotao(pt.paths ?? [])
  if (!restantes) payload.logger.warn('[painel-botao] o terceiro caminho já foi reescrito no admin — os caminhos ficam como estão')

  /* As linhas que ficam vão com o id: é o que preserva o inglês de cada uma. */
  await payload.updateGlobal({
    slug: SLUG,
    locale: 'pt',
    data: {
      ...SEGUNDO_BOTAO.pt,
      secondaryCtaHref: SEGUNDO_BOTAO.secondaryCtaHref,
      ...(restantes ? { paths: restantes } : {}),
    },
    depth: 0,
    req,
  })

  try {
    await payload.updateGlobal({ slug: SLUG, locale: 'en', data: { ...SEGUNDO_BOTAO.en }, depth: 0, req })
  } catch (erro) {
    /* Inglês incompleto em algum caminho obrigatório: o botão cai no português
       pelo fallback, e o resto do painel não é tocado. */
    payload.logger.warn(`[painel-botao] texto em inglês não gravado (${(erro as Error).message})`)
  }
  payload.logger.info(`[painel-botao] segundo botão gravado${restantes ? ', terceiro caminho retirado' : ''}`)
}

/* Sem volta automática: o botão sai apagando o texto dele no admin, e o
 * caminho volta por "Adicionar" na lista de caminhos. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[painel-botao] sem desfazer automático: apagar o texto do segundo botão no admin')
}
