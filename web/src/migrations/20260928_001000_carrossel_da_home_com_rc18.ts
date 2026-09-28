import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/* Migração de **dados**, não de schema: põe o carrossel de destaques na home,
 * logo abaixo dos números, com o banner da RC18. Pedido do G-ferrari em 27/09.
 *
 * O bloco existe desde 26/09 (`add_highlight_carousel`), mas só o seed da home
 * o montava — e o deploy não roda seed, só migração. Na homologação a home
 * ficou sem ele, esperando alguém cadastrar pelo admin. O texto é o mesmo do
 * seed (`scripts/seed/home.ts`), tirado do herói da página da RC18; a redação
 * final é do marketing (D-22), e os próximos banners entram pelo admin.
 *
 * ⚠️ Só age se a home ainda não tiver carrossel de destaques. Se alguém já o
 * cadastrou no admin — com este banner ou com outros —, não toca em nada e só
 * avisa no log.
 *
 * ⚠️ O layout volta **inteiro**, lido com `depth: 0`, com os ids de todos os
 * níveis intactos: bloco reenviado sem id vira bloco novo, e o texto em inglês
 * dele fica órfão (a armadilha do `casarIds` no CLAUDE.md). O bloco novo entra
 * só em português; com `fallback: true` o inglês lê o português (P-08). */

const BANNER_DA_RC18 = {
  tag: 'Resolução Conjunta nº 18/2025',
  title: 'RC 18/2025: sua instituição está preparada para comprovar a qualidade dos dados?',
  description:
    'Prazo de adequação: 31 de dezembro de 2026. A exigência não termina na criação de uma política: é preciso processos, tecnologia e evidências capazes de demonstrar a qualidade das informações prestadas ao Banco Central.',
  cta: { label: 'Conhecer a solução', href: '/solucoes/rc18' },
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    locale: 'pt',
    depth: 0,
    limit: 1,
    req,
  })
  const home = docs[0]
  if (!home) {
    payload.logger.warn('[carrossel] a home não existe neste banco — nada a fazer')
    return
  }

  const layout = home.layout ?? []
  if (layout.some((b) => b.blockType === 'highlightCarousel')) {
    payload.logger.warn('[carrossel] a home já tem carrossel de destaques — mantida como está')
    return
  }

  /* Logo abaixo dos números (reunião de 24/09). Sem o bloco dos números, entra
   * depois do herói, que é o lugar mais próximo do combinado. */
  const numeros = layout.findIndex((b) => b.blockType === 'homeBento')
  const heroi = layout.findIndex((b) => b.blockType === 'homeHero')
  const depoisDe = numeros >= 0 ? numeros : heroi
  const carrossel = { blockType: 'highlightCarousel' as const, autoplay: true, items: [BANNER_DA_RC18] }

  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'pt',
    data: { layout: [...layout.slice(0, depoisDe + 1), carrossel, ...layout.slice(depoisDe + 1)] as never },
    req,
  })
  payload.logger.info(`[carrossel] carrossel com o banner da RC18 entrou na home, na posição ${depoisDe + 1}`)
}

/* Sem volta automática: a versão anterior fica no histórico de versões da
 * home, e restaurar por lá é o caminho. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[carrossel] sem desfazer automático: restaurar pelo histórico de versões da home, no admin')
}
