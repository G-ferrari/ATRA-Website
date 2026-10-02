import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { juntarLinksDePoliticas, renomear, ROTULO } from './arquivos/rodape-legal'

/* Migração de **dados**: no rodapé, os três links legais — Privacidade, Termos
 * de Uso e Cookies, todos para `/politicas-e-termos` — viram um só, "Políticas
 * e Termos" (pedido do G-ferrari em 02/10).
 *
 * O rodapé é um global do CMS, e o deploy não roda seed: sem migração, a
 * homologação e a produção continuariam com os três.
 *
 * A regra mora em `arquivos/rodape-legal.ts`, com teste. Só age onde há mais de
 * um link para a página de políticas na mesma coluna; rodapé já arrumado no
 * admin não é tocado, e rodar de novo não grava nada.
 *
 * O português vai primeiro e decide: as linhas do array são as mesmas nos dois
 * idiomas, então juntar em português já tira as duas linhas do inglês. O inglês
 * só recebe o rótulo do link que ficou — relido sem fallback, para não congelar
 * português dentro dele; se o inglês do rodapé estiver incompleto, fica o aviso
 * no log e o link aparece com o rótulo que a primeira linha já tinha.
 *
 * Banco novo não precisa dela: o seed (`globais.ts`) já nasce com um link. */

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
  const { colunas, mantidos } = juntarLinksDePoliticas(pt.columns ?? [], ROTULO.pt)
  if (mantidos.length === 0) {
    payload.logger.warn('[rodape-legal] o rodapé não tem mais de um link para a página de políticas — nada a juntar')
    return
  }

  await payload.updateGlobal({ slug: 'footer', locale: 'pt', data: { ...pt, columns: colunas } as never, depth: 0, req })
  payload.logger.info('[rodape-legal] links legais do rodapé juntos em "Políticas e Termos"')

  try {
    const en = await ler({ payload, req }, 'en')
    await payload.updateGlobal({
      slug: 'footer',
      locale: 'en',
      data: { ...en, columns: renomear(en.columns ?? [], mantidos, ROTULO.en) } as never,
      depth: 0,
      req,
    })
    payload.logger.info(`[rodape-legal] rótulo em inglês: "${ROTULO.en}"`)
  } catch (erro) {
    payload.logger.warn(`[rodape-legal] rótulo em inglês não gravado: ${(erro as Error).message}`)
  }
}

/* Sem volta automática: os três links voltam pelo admin (Sistema → Rodapé), se
 * for o caso. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[rodape-legal] sem desfazer automático: recriar os links em Sistema → Rodapé, se for o caso')
}
