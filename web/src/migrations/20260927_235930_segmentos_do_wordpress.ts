import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { PAGINAS_DE_SEGMENTO, type PaginaDeSegmento } from './arquivos/segmentos-wp/conteudo'

/* Migração de **dados**, não de schema: remonta as 8 páginas de segmento no
 * padrão das páginas de solução (Alocação, PR #50; as 11 do WordPress, PR #73),
 * com o texto de cada página do WordPress na íntegra. Pedido do G-ferrari em
 * 27/09, junto com as soluções.
 *
 * O que a importação de agosto (`import-segments.ts`, MIG-092) já trazia —
 * frase de abertura, cabeçalho da grade e os itens em cartões — continua,
 * literal. O que entra: a manchete do WordPress no herói, o submenu, a faixa
 * de parceiros, o botão "Quero saber mais" com o formulário no fim da página
 * (a importação o trocava por "Fale com a gente" para /contato), e o link da
 * RC18 no herói de Bancos (D-37).
 *
 * ⚠️ Só age num segmento que ainda seja o da importação: exatamente herói +
 * cartões + chamada. Qualquer outro layout quer dizer que alguém já editou a
 * página no admin, e aí ela não toca em nada — só avisa no log (D-22).
 *
 * ⚠️ Grava só o português: com `fallback: true` o inglês lê o português
 * enquanto não houver tradução (P-08).
 *
 * ⚠️ As funções de montagem são cópia das de `…_solucoes_do_wordpress`, e não
 * importação: migração é retrato do momento em que foi escrita, e mexer num
 * helper compartilhado mudaria o que uma migração antiga faz num banco novo.
 *
 * Fora daqui, de propósito: o botão do Diagnóstico de Maturidade em cada
 * segmento espera a validação jurídica do texto das normas. */

const LAYOUT_DA_IMPORTACAO = 'pageHero,iconCardGrid,ctaBanner'

const no = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }
const paragrafo = (t: string) => ({
  ...no,
  type: 'paragraph',
  textFormat: 0,
  children: [{ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
})

/* Mesmo destaque das soluções: a última palavra do título. */
const ultimaPalavra = (titulo: string) => titulo.trim().split(/\s+/).at(-1)!

const layout = (pagina: PaginaDeSegmento, parceiros: number[]) => [
  {
    blockType: 'pageHero' as const,
    badge: 'Segmento',
    title: pagina.titulo,
    highlight: [ultimaPalavra(pagina.titulo)],
    description: pagina.chamada,
    descriptionWidth: 'wide' as const,
    align: 'left' as const,
    mediaMode: 'none' as const,
    ctaVariant: 'secondary' as const,
    ctas: [...(pagina.ctasExtras ?? []), { label: 'Quero saber mais', href: '#contato' }],
    metrics: [],
  },
  { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
  {
    blockType: 'richTextSection' as const,
    anchor: 'visao-geral',
    navLabel: 'Visão geral',
    title: pagina.grade.titulo,
    body: { root: { ...no, type: 'root', children: [paragrafo(pagina.grade.intro)] } },
    imagePosition: 'none' as const,
  },
  ...pagina.grupos.map((g) => ({
    blockType: 'iconCardGrid' as const,
    ...(g.ancora ? { anchor: g.ancora, navLabel: g.rotulo } : {}),
    ...(g.titulo ? { title: g.titulo } : {}),
    columns: g.colunas,
    variant: 'card' as const,
    items: g.cards.map((c) => ({ icon: c.icone, title: c.titulo, description: c.descricao })),
  })),
  ...(pagina.fechamento
    ? [{ blockType: 'richTextSection' as const, title: pagina.fechamento, imagePosition: 'none' as const }]
    : []),
  {
    blockType: 'partnerShowcase' as const,
    anchor: 'parceiros',
    navLabel: 'Parceiros',
    title: 'Somos parceiros das maiores empresas de tecnologia',
    partners: parceiros,
    grayscale: true,
  },
  {
    blockType: 'ctaBanner' as const,
    variant: 'dark' as const,
    title: 'Entre em contato com nossa equipe de especialistas',
    cta: { label: 'Quero saber mais', href: '#contato' },
  },
  {
    blockType: 'ctaContact' as const,
    anchor: 'contato',
    navLabel: 'Contato',
    variant: 'panel' as const,
    title: 'Quero saber mais',
    showContactCard: true,
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs: parceiros } = await payload.find({ collection: 'partners', sort: 'order', depth: 0, limit: 50, req })
  const idsDosParceiros = parceiros.map((p) => p.id)

  for (const pagina of PAGINAS_DE_SEGMENTO) {
    const { docs } = await payload.find({
      collection: 'segments',
      where: { slug: { equals: pagina.slug } },
      locale: 'pt',
      depth: 0,
      limit: 1,
      req,
    })
    const segmento = docs[0]
    if (!segmento) {
      payload.logger.warn(`[segmentos-wp] "${pagina.slug}" não existe neste banco — pulado`)
      continue
    }

    const atual = (segmento.layout ?? []).map((b) => b.blockType).join(',')
    if (atual !== LAYOUT_DA_IMPORTACAO) {
      payload.logger.warn(`[segmentos-wp] "${pagina.slug}" já editado no admin (${atual || 'vazio'}) — mantido`)
      continue
    }

    await payload.update({
      collection: 'segments',
      id: segmento.id,
      locale: 'pt',
      data: { layout: layout(pagina, idsDosParceiros) as never },
      req,
    })
    payload.logger.info(`[segmentos-wp] "${pagina.slug}" montado`)
  }
}

/* Sem volta automática, como nas soluções: a versão anterior fica no histórico
 * de versões de cada segmento, e restaurar por lá é o caminho. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[segmentos-wp] sem desfazer automático: restaurar pelo histórico de versões de cada segmento, no admin')
}
