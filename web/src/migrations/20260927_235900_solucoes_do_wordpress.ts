import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { PAGINAS_DO_WORDPRESS, type PaginaDoWordpress, type Secao, type Trecho } from './arquivos/solucoes-wp/conteudo'

/* Migração de **dados**, não de schema: monta as 11 páginas de solução que
 * vieram do WordPress (MIG-093) no padrão da Alocação de Consultores (PR #50),
 * com o texto de cada página do WordPress na íntegra. Pedido do G-ferrari em
 * 27/09: "trazer as is", sem cadastrar bloco a bloco no admin.
 *
 * Por que migração: é o mesmo motivo da Alocação. Roda sozinha no deploy — na
 * homologação e, depois, na produção —, e o resultado é igual ao de alguém ter
 * preenchido o admin: os blocos ficam editáveis lá, e a gravação entra no
 * histórico de versões de cada página.
 *
 * ⚠️ Só age numa página que ainda seja a da importação (`import-solutions.ts`):
 * exatamente herói + texto corrido + chamada. Qualquer outro layout quer dizer
 * que alguém já editou a página no admin, e aí ela não toca em nada — só avisa
 * no log. Conteúdo é do marketing (D-22).
 *
 * ⚠️ Grava só o português, como a Alocação: os blocos são compartilhados entre
 * os idiomas e os textos não, e com `fallback: true` o inglês lê o português
 * enquanto não houver tradução (P-08).
 *
 * ⚠️ A imagem sobe da pasta `arquivos/solucoes-wp/`, versionada, e não do
 * WordPress: na produção esta migração pode rodar depois de o domínio já
 * apontar para o site novo, e aí `atra.com.br/wp-content` não existe mais. O
 * estágio `migrator` do Dockerfile copia `web/` inteiro, então a pasta está lá.
 *
 * Sem snapshot `.json`: o schema não muda, e um snapshot aqui viraria a base do
 * próximo `migrate:create`. */

const LAYOUT_DA_IMPORTACAO = 'pageHero,richTextSection,ctaBanner'
const PASTA = path.resolve(process.cwd(), 'src/migrations/arquivos/solucoes-wp')

const no = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }
const texto = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })

function trechoParaNo(trecho: Trecho) {
  if ('h3' in trecho) return { ...no, type: 'heading', tag: 'h3', children: [texto(trecho.h3)] }
  if ('link' in trecho) {
    return {
      ...no,
      type: 'paragraph',
      textFormat: 0,
      children: [
        {
          ...no,
          type: 'link',
          version: 3,
          fields: { linkType: 'custom', url: trecho.link.url, newTab: true },
          children: [texto(trecho.link.texto)],
        },
      ],
    }
  }
  return { ...no, type: 'paragraph', textFormat: 0, children: [texto(trecho.p)] }
}

const ancora = (s: { ancora?: string; rotulo?: string }) =>
  s.ancora ? { anchor: s.ancora, navLabel: s.rotulo } : {}

function secaoParaBloco(secao: Secao) {
  if (secao.tipo === 'texto') {
    return {
      blockType: 'richTextSection' as const,
      ...ancora(secao),
      title: secao.titulo,
      body: { root: { ...no, type: 'root', children: secao.corpo.map(trechoParaNo) } },
      imagePosition: 'none' as const,
      ...(secao.cta ? { ctas: [secao.cta] } : {}),
    }
  }
  return {
    blockType: 'iconCardGrid' as const,
    ...ancora(secao),
    ...(secao.titulo ? { title: secao.titulo } : {}),
    columns: secao.colunas,
    variant: secao.variante,
    items: secao.itens.map((c) => ({ icon: c.icone, title: c.titulo, ...(c.descricao ? { description: c.descricao } : {}) })),
  }
}

/* O destaque do título segue a Alocação aprovada, que realça a última palavra
 * ("Alocação de **Consultores**"). Título de uma palavra só realça ela inteira. */
const ultimaPalavra = (titulo: string) => titulo.trim().split(/\s+/).at(-1)!

const layout = (pagina: PaginaDoWordpress, imagem: number, parceiros: number[]) => [
  {
    blockType: 'pageHero' as const,
    badge: 'Solução',
    title: pagina.titulo,
    highlight: [ultimaPalavra(pagina.titulo)],
    description: pagina.chamada,
    descriptionWidth: 'wide' as const,
    align: 'left' as const,
    mediaMode: 'image' as const,
    images: [imagem],
    ctaVariant: 'secondary' as const,
    ctas: [{ label: 'Quero saber mais', href: '#contato' }],
    metrics: [],
  },
  { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
  ...pagina.secoes.map(secaoParaBloco),
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

/* ⚠️ A busca é pelo nome do arquivo sem extensão, com `contains`: a `Media`
 * converte todo upload para WebP, e o `.jpg` vira `.webp` no `filename` (a
 * armadilha do `scripts/seed/midia.ts`). Por isso o prefixo `solucao-wp-` —
 * "cloud" sozinho casaria com o logo do Google Cloud. */
async function imagemDaSolucao(
  { payload, req }: Pick<MigrateUpArgs, 'payload' | 'req'>,
  pagina: PaginaDoWordpress,
): Promise<number> {
  const chave = pagina.imagem.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: chave } },
    limit: 1,
    depth: 0,
    req,
  })
  if (docs[0]) return docs[0].id

  const data = readFileSync(path.join(PASTA, pagina.imagem))
  const doc = await payload.create({
    collection: 'media',
    data: { alt: `Ilustração da solução ${pagina.titulo}`, credit: pagina.origem },
    file: { data, mimetype: 'image/jpeg', name: pagina.imagem, size: data.length },
    locale: 'pt',
    req,
  })
  return doc.id
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs: parceiros } = await payload.find({ collection: 'partners', sort: 'order', depth: 0, limit: 50, req })
  const idsDosParceiros = parceiros.map((p) => p.id)

  for (const pagina of PAGINAS_DO_WORDPRESS) {
    const { docs } = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: pagina.slug } },
      locale: 'pt',
      depth: 0,
      limit: 1,
      req,
    })
    const solucao = docs[0]
    if (!solucao) {
      payload.logger.warn(`[solucoes-wp] "${pagina.slug}" não existe neste banco — pulada`)
      continue
    }

    const atual = (solucao.layout ?? []).map((b) => b.blockType).join(',')
    if (atual !== LAYOUT_DA_IMPORTACAO) {
      payload.logger.warn(`[solucoes-wp] "${pagina.slug}" já editada no admin (${atual || 'vazio'}) — mantida`)
      continue
    }

    const imagem = await imagemDaSolucao({ payload, req }, pagina)
    await payload.update({
      collection: 'solutions',
      id: solucao.id,
      locale: 'pt',
      data: { layout: layout(pagina, imagem, idsDosParceiros) as never },
      req,
    })
    payload.logger.info(`[solucoes-wp] "${pagina.slug}" montada`)
  }
}

/* Sem volta automática, como na Alocação: a versão anterior fica no histórico
 * de versões de cada solução, e restaurar por lá é o caminho — uma migração
 * que reescreve conteúdo de volta apagaria o que tivesse sido editado depois. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[solucoes-wp] sem desfazer automático: restaurar pelo histórico de versões de cada solução, no admin')
}
