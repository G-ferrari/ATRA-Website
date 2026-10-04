import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { CASES_INICIAIS, PAINEL } from './arquivos/painel-de-conversao'

/* Migração de **dados**: preenche o global `conversion-panel` — o painel fixo à
 * direita do menu de Soluções (D-51) — com o conteúdo da especificação.
 *
 * O painel só é desenhado quando tem título, e o deploy não roda seed: sem esta
 * migração o código iria ao ar com o menu igual ao de antes, à espera de alguém
 * digitar tudo no admin.
 *
 * Dois passos, cada um com a sua trava:
 *
 * 1. **Textos** — só num painel vazio (sem título, sem caminhos, sem prova
 *    social). O que alguém já escreveu no admin fica.
 * 2. **Cases de cada aba** — só se as três abas estiverem sem escolha, e só com
 *    os cases que existem e estão publicados. É separado do passo 1 por causa
 *    do banco novo: ali o `migrate` roda antes de existir case, o passo 1
 *    preenche os textos, e o passo 2 só consegue agir quando o seed chama esta
 *    mesma função de novo, depois de criar os cases (`migracoes-de-dados.ts`). */

type Ctx = Pick<MigrateUpArgs, 'payload' | 'req'>

const SLUG = 'conversion-panel' as const
const ABAS = ['innovationAi', 'dataBi', 'governanceCulture'] as const

export async function preencherPainelDeConversao({ payload, req }: Ctx): Promise<void> {
  const atual = await payload.findGlobal({ slug: SLUG, locale: 'pt', fallbackLocale: false, depth: 0, req })

  if (atual.title?.trim() || atual.paths?.length || atual.proof?.length) {
    payload.logger.warn('[painel-de-conversao] o painel já tem conteúdo — textos mantidos')
  } else {
    const pt = await payload.updateGlobal({
      slug: SLUG,
      locale: 'pt',
      data: { ...PAINEL.pt, paths: PAINEL.pt.paths.map((p) => ({ ...p })), proof: PAINEL.pt.proof.map((p) => ({ ...p })) },
      depth: 0,
      req,
    })

    /* O inglês reenvia o id de cada linha: sem ele o Payload trata a linha como
     * nova e o português fica órfão (a armadilha dos ids de todos os níveis). */
    await payload.updateGlobal({
      slug: SLUG,
      locale: 'en',
      data: {
        title: PAINEL.en.title,
        intro: PAINEL.en.intro,
        ctaLabel: PAINEL.en.ctaLabel,
        paths: (pt.paths ?? []).map((p, i) => ({ id: p.id, icon: p.icon, href: p.href, ...PAINEL.en.paths[i] })),
        proof: (pt.proof ?? []).map((p, i) => ({ id: p.id, ...PAINEL.en.proof[i] })),
      },
      depth: 0,
      req,
    })
    payload.logger.info('[painel-de-conversao] textos gravados (pt e en)')
  }

  if (ABAS.some((aba) => (atual.cases?.[aba] ?? []).length > 0)) {
    payload.logger.warn('[painel-de-conversao] já há case escolhido em alguma aba — escolha mantida')
    return
  }

  const slugs = ABAS.flatMap((aba) => [...CASES_INICIAIS[aba]])
  const { docs } = await payload.find({
    collection: 'cases',
    locale: 'pt',
    depth: 0,
    limit: slugs.length,
    where: { and: [{ slug: { in: slugs } }, { _status: { equals: 'published' } }] },
    select: { slug: true },
    req,
  })
  if (docs.length === 0) {
    payload.logger.warn('[painel-de-conversao] nenhum dos cases iniciais está publicado — as abas mostram os mais recentes')
    return
  }

  const idDe = new Map(docs.map((d) => [d.slug, d.id]))
  const cases = Object.fromEntries(
    ABAS.map((aba) => [aba, CASES_INICIAIS[aba].map((s) => idDe.get(s)).filter((id): id is number => id !== undefined)]),
  )
  await payload.updateGlobal({ slug: SLUG, locale: 'pt', data: { cases }, depth: 0, req })
  payload.logger.info(`[painel-de-conversao] cases das abas: ${docs.length} ligados`)
}

export async function up(ctx: MigrateUpArgs): Promise<void> {
  await preencherPainelDeConversao(ctx)
}

/* Sem volta automática: para tirar o painel do menu, apagar o título em
 * Sistema → Painel do menu de Soluções. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[painel-de-conversao] sem desfazer automático: apagar o título no admin tira o painel do menu')
}
