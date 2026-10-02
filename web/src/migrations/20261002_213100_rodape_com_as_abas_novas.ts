import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { ABAS_DE_SOLUCOES } from '../lib/abas-de-solucoes'

import { abasEmIngles, comAsAbasNovas, INDICE } from './arquivos/rodape-solucoes'

/* Migração de **dados**: a coluna "Soluções" do rodapé passa a listar as quatro
 * abas novas do menu (D-52), no lugar das três antigas.
 *
 * A regra mora em `arquivos/rodape-solucoes.ts`, com teste: só age na coluna
 * que ainda tem exatamente os três nomes antigos. O português vai primeiro; o
 * inglês recebe os nomes pelas linhas que o português gravou — relido sem
 * fallback, para não congelar português dentro dele. Se o inglês do rodapé
 * estiver incompleto, fica o aviso no log e os nomes aparecem em português.
 *
 * Banco novo não precisa dela: o seed (`globais.ts`) já nasce com as quatro. */

type Rodape = { columns?: { links?: { id?: string | null; label?: string | null; href?: string | null }[] | null }[] | null }

async function ler({ payload, req }: Pick<MigrateUpArgs, 'payload' | 'req'>, locale: 'pt' | 'en') {
  // Sem os campos de sistema: o que volta para o `updateGlobal` é só conteúdo.
  const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...conteudo } = (await payload.findGlobal({
    slug: 'footer',
    locale,
    fallbackLocale: false,
    depth: 0,
    req,
  })) as unknown as Record<string, unknown>
  return conteudo as Rodape
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const pt = await ler({ payload, req }, 'pt')
  const { colunas, mudou } = comAsAbasNovas(pt.columns ?? [])
  if (!mudou) {
    payload.logger.warn('[rodape-solucoes] a coluna de soluções do rodapé não é mais a das três abas antigas — mantida')
    return
  }

  const gravado = (await payload.updateGlobal({
    slug: 'footer',
    locale: 'pt',
    data: { ...pt, columns: colunas } as never,
    depth: 0,
    req,
  })) as unknown as Rodape
  payload.logger.info('[rodape-solucoes] coluna de soluções do rodapé com as 4 abas novas')

  /* As linhas das abas, na ordem: a coluna que agora tem os quatro nomes. */
  const nomes = ABAS_DE_SOLUCOES.map((a) => a.pt as string)
  const coluna = (gravado.columns ?? []).find(
    (c) => (c.links ?? []).length === nomes.length && (c.links ?? []).every((l, i) => l.label === nomes[i] && l.href === INDICE),
  )
  const ids = (coluna?.links ?? []).map((l) => l.id)

  try {
    const en = await ler({ payload, req }, 'en')
    await payload.updateGlobal({
      slug: 'footer',
      locale: 'en',
      data: { ...en, columns: abasEmIngles(en.columns ?? [], ids) } as never,
      depth: 0,
      req,
    })
    payload.logger.info('[rodape-solucoes] nomes das abas em inglês gravados')
  } catch (erro) {
    payload.logger.warn(`[rodape-solucoes] nomes em inglês não gravados: ${(erro as Error).message}`)
  }
}

/* Sem volta automática: os nomes antigos voltam pelo admin (Sistema → Rodapé). */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[rodape-solucoes] sem desfazer automático: editar a coluna em Sistema → Rodapé, se for o caso')
}
