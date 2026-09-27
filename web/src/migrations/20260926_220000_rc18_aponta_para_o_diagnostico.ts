import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Migração de **dados**, não de schema: a página `/solucoes/rc18` passa a
 * mandar para o diagnóstico de maturidade e perde o formulário de contato.
 *
 * Por quê: a ata de 24/09 pediu para "substituir dentro dessa página da RC18" —
 * quem chega à RC18 vai para o diagnóstico, não para um formulário genérico. A
 * D-35 aposentou o quick check (`/diagnostico-rc18`, hoje só um redirect) e pôs
 * no lugar o diagnóstico de maturidade, que já abre no setor financeiro com
 * `?setor=financeiro`. O que muda no conteúdo:
 * - o CTA "Verificar diagnóstico" do herói (e qualquer outro `href` do
 *   diagnóstico antigo no layout) vai direto para a rota nova, sem passar pelo
 *   redirect;
 * - o bloco `ctaContact` sai, e com ele o item "Contato" do submenu — o
 *   `stickyPageNav` monta os itens das âncoras dos outros blocos
 *   (`ancorasDe`, em `lib/mappers/blocks.ts`), então some sozinho.
 *
 * Por que migração, e não roteiro para o admin: decisão do G-ferrari em 26/09,
 * no mesmo padrão de `20260926_171500_alocacao_de_consultores.ts`. A migração
 * roda sozinha no deploy — na homologação e, depois, na produção — e ninguém
 * precisa lembrar de refazer a mão o que já foi conferido aqui.
 *
 * ⚠️ Só age se a página ainda for a do seed (`scripts/seed/solucoes-rc18.ts`):
 * os tipos dos blocos, em ordem, exatamente os de lá, e o herói ainda com o CTA
 * para `/diagnostico-rc18`. Qualquer outro formato quer dizer que alguém já
 * editou a página no admin, e aí ela não toca em nada — só avisa no log.
 * Conteúdo é do marketing (D-22); a migração não sobrescreve decisão de ninguém.
 *
 * ⚠️ Reenvia o layout **lido**, alterado só onde precisa, com os `id` de todos
 * os níveis (blocos, `ctas`, `items`, `steps`). O Payload casa as linhas pelo
 * `id` para manter o texto dos outros idiomas; layout reenviado sem eles deixa
 * o inglês em branco (ver `casarIds` e o CLAUDE.md). Grava em `pt`, e basta:
 * os blocos e o `href` não são `localized`, então a troca vale para os dois
 * idiomas, e os textos — os únicos campos localizados — não mudam.
 *
 * Sem snapshot `.json`: o schema não muda, e um snapshot aqui viraria a base do
 * próximo `migrate:create`. */

const SLUG = 'rc18'
const LAYOUT_DO_SEED =
  'pageHero,stickyPageNav,audienceSplit,iconCardGrid,accordionSteps,audienceSplit,processSteps,processSteps,ctaBanner,ctaContact'
const HREF_ANTIGO = '/diagnostico-rc18'
const HREF_NOVO = '/diagnostico-maturidade?setor=financeiro'

/* Troca o `href` do diagnóstico antigo em qualquer nível do layout. Percorre o
 * objeto inteiro em vez de só o herói porque o link pode ter sido repetido em
 * outro botão; tudo o que não é esse `href` volta idêntico, com os `id`. */
function trocarHrefs<T>(valor: T): T {
  if (Array.isArray(valor)) return valor.map(trocarHrefs) as T
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor).map(([chave, v]) => [chave, chave === 'href' && v === HREF_ANTIGO ? HREF_NOVO : trocarHrefs(v)]),
    ) as T
  }
  return valor
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: SLUG } },
    locale: 'pt',
    depth: 0,
    limit: 1,
    req,
  })
  const solucao = docs[0]
  if (!solucao) {
    payload.logger.warn(`[rc18] "${SLUG}" não existe neste banco — nada a fazer`)
    return
  }

  const layout = solucao.layout ?? []
  const atual = layout.map((b) => b.blockType).join(',')
  if (atual !== LAYOUT_DO_SEED) {
    payload.logger.warn(`[rc18] layout já editado no admin (${atual || 'vazio'}) — mantido como está`)
    return
  }

  const heroi = layout[0]
  if (heroi?.blockType !== 'pageHero' || !heroi.ctas?.some((c) => c.href === HREF_ANTIGO)) {
    payload.logger.warn(`[rc18] o herói não tem mais o CTA para ${HREF_ANTIGO} — editado no admin, mantido como está`)
    return
  }

  await payload.update({
    collection: 'solutions',
    id: solucao.id,
    locale: 'pt',
    data: { layout: trocarHrefs(layout.filter((b) => b.blockType !== 'ctaContact')) },
    req,
  })
  payload.logger.info(`[rc18] CTA de diagnóstico → ${HREF_NOVO}; formulário de contato removido`)
}

/* Sem volta automática: a versão anterior fica no histórico de versões da
 * solução, e restaurar por lá é o caminho — uma migração que reescreve conteúdo
 * de volta apagaria o que tivesse sido editado depois. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[rc18] sem desfazer automático: restaurar pelo histórico de versões da solução, no admin')
}
