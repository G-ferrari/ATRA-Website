import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { casarIds } from '../../scripts/seed/ids'
import { COMUNS_RC18, EN_RC18, PT_RC18, SLUG_RC18, layoutRc18 } from '../../scripts/seed/rc18-conteudo'

/* Migração de **dados**: cria a página de solução RC18 onde ela não existe.
 *
 * ⚠️ Em 28/09 a página **não existia na homologação**. Ela nasce do seed
 * `solucoes-rc18.ts`, e o deploy roda migração, não seed — o mesmo buraco do
 * carrossel da home (`20260928_001000`). Com isso, o banner da home e o botão
 * "Conheça a RC18" de Bancos levavam a 404, e a migração de 26/09 que ajustava
 * a página (`20260926_220000`) rodou em 14ms sem ter o que ajustar.
 *
 * Só **cria**: se já existe uma solução com o slug `rc18` — publicada, em
 * rascunho, editada no admin —, não toca em nada e só avisa no log. O conteúdo
 * é o do seed (`scripts/seed/rc18-conteudo.ts`, uma fonte só para os dois), que
 * espelha a landing oficial da RC18 aprovada com o dono (14/09) e já leva ao
 * diagnóstico de maturidade (D-35). Fica fora do menu de Soluções pela D-37.
 *
 * Grava o português e depois o inglês (stub em português, decisão PT-only da
 * v1) com `casarIds`: sem os ids de todos os níveis o texto dos cards some no
 * segundo idioma (armadilha do CLAUDE.md). */

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: SLUG_RC18 } },
    locale: 'pt',
    depth: 0,
    limit: 1,
    draft: true,
    req,
  })
  if (totalDocs > 0) {
    payload.logger.warn('[rc18] a página já existe neste banco — mantida como está')
    return
  }

  const criada = await payload.create({
    collection: 'solutions',
    locale: 'pt',
    data: { ...COMUNS_RC18, ...PT_RC18.base, slug: SLUG_RC18, layout: layoutRc18(PT_RC18) } as never,
    req,
  })

  const gravada = await payload.findByID({ collection: 'solutions', id: criada.id, locale: 'pt', depth: 0, req })
  await payload.update({
    collection: 'solutions',
    id: criada.id,
    locale: 'en',
    data: {
      ...COMUNS_RC18,
      ...EN_RC18.base,
      slug: SLUG_RC18,
      layout: casarIds(layoutRc18(EN_RC18), gravada.layout),
    } as never,
    req,
  })
  payload.logger.info('[rc18] página criada e publicada: /solucoes/rc18 (e /en/solutions/rc18)')
}

/* Sem volta automática: apagar a página derrubaria os links que levam a ela, e
 * quem quiser tirá-la do ar despublica pelo admin. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[rc18] sem desfazer automático: despublicar pelo admin, se for o caso')
}
