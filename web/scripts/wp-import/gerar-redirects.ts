/* MIG-086 — geração do `redirects.csv` a partir do que foi importado.
 *
 * Formato e regras em `docs/02-especificacao/seo-e-redirects.md`: `from` com
 * barra final (padrão do WP), `to` sem, 301 para movido, 410 para removido de
 * propósito, e **toda linha com `note`** — redirect sem justificativa vira
 * mistério em seis meses.
 *
 * ⚠️ O `to` sai do **banco**, não do WordPress. O hook de `slugField` normaliza
 * o slug na gravação, e um post do corpus tem `%c2%b2` no slug do WP, que vira
 * `-c2-b2`. Gerando a partir do WP, aquela linha mandaria o leitor para uma
 * rota que o site novo não serve — e seria a única errada entre 207, que é o
 * tipo de coisa que só aparece em produção.
 *
 * ⚠️ Linha que já está no arquivo e **não** é gerada por aqui é preservada: a
 * curadoria das ~30 URLs institucionais (soluções, segmentos, legal) é da Fase
 * 4c, e regenerar não pode apagá-la.
 *
 * Rodar com: pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/gerar-redirects.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { createWpClient } from './client'
import { slugify } from '../../src/fields/slug'

const ARQUIVO = path.resolve(process.cwd(), '../docs/02-especificacao/dados/redirects.csv')

type Linha = { from: string; to: string; status: number; note: string }

/* Curadoria das páginas institucionais (Fase 4c).
 *
 * Chave = slug da página no WordPress; valor = destino no site novo e a
 * justificativa. Fica aqui, e não escrito à mão no CSV, para a **conferência de
 * cobertura** no fim funcionar: toda página do WordPress precisa de linha, e o
 * gerador reprova se sobrar alguma. Foi assim que `/sample-page/` e
 * `/solucoes-atra/` apareceram — nenhuma das duas estava na lista de
 * `seo-e-redirects.md`.
 *
 * `410` é para o que sai de propósito. Nunca 302. */
const CURADAS: Record<string, { to: string; status?: number; note: string }> = {
  /* Índices que existem dos dois lados. */
  blog: { to: '/blog', note: 'indice 1:1' },
  contato: { to: '/contato', note: 'indice 1:1 - valida D-10' },
  'case-de-sucesso': { to: '/cases-de-sucesso', note: 'indice 1:1' },
  solucoes: { to: '/solucoes', note: 'indice 1:1' },
  segmentos: { to: '/segmentos', note: 'indice 1:1 (a pagina do WP esta vazia)' },
  'segmentos-atra': { to: '/segmentos', note: 'indice N:1 - o WP tem duas paginas de indice' },
  'solucoes-atra': { to: '/solucoes', note: 'indice N:1 - o WP tem duas paginas de indice' },
  'politicas-e-termos': { to: '/politicas-e-termos', note: 'pagina legal 1:1 (MIG-094)' },

  /* Os 4 cases, com o slug que o protótipo já usava. */
  'case-criacao-de-dashboards-estrategico-para-financeira': { to: '/cases-de-sucesso/dashboards-estrategicos', note: 'case 1:1' },
  'case-gerando-valor-atraves-de-marketplace-e-governanca': { to: '/cases-de-sucesso/marketplace-governanca-dados', note: 'case 1:1' },
  'case-ingestao-impulsionando-a-eficiencia-em-processos-de-risco-com-gcp': { to: '/cases-de-sucesso/eficiencia-processos-risco', note: 'case 1:1' },
  'case-migrando-cargas-de-trabalho-legadas-para-google-cloud': { to: '/cases-de-sucesso/migracao-legado-gcp', note: 'case 1:1' },

  /* Institucionais: o WordPress tem quatro páginas para o mesmo assunto. */
  'quem-somos': { to: '/sobre', note: 'N:1 institucional' },
  sobre: { to: '/sobre', note: 'N:1 institucional' },
  'conheca-atra': { to: '/sobre', note: 'N:1 institucional' },
  'nossas-conquistas': { to: '/sobre', note: 'N:1 institucional - os selos vivem em /sobre' },
  clientes: { to: '/sobre', note: 'N:1 - os logos de cliente vivem na home e em /sobre' },
  /* ⚠️ Não há índice de parceiros: só `/parceiros/[slug]`. Mandar para a página
   * de um parceiro específico seria pior do que mandar para a vitrine. */
  parceiros: { to: '/sobre', note: 'N:1 - a vitrine de parceiros vive em /sobre; nao ha indice' },

  /* Carreiras: três páginas, um destino. */
  carreiras: { to: '/carreiras', note: 'N:1 carreiras' },
  'trabalhe-conosco': { to: '/carreiras', note: 'N:1 carreiras' },
  'programa-de-trainee': { to: '/carreiras', note: 'N:1 carreiras - o trainee e uma secao de /carreiras' },

  /* ⚠️ Estas 12 linhas são **rede de segurança**, não o caminho normal.
   *
   * Com P-16 respondida (publicar), as 12 soluções do WordPress têm página e a
   * checagem acima já as manda 1:1. Elas continuam aqui para o caso de alguém
   * despublicar uma: em vez de a geração reprovar por "página sem destino", a
   * URL cai no índice `/solucoes`, que é a degradação certa. */
  'inteligencia-artificial': { to: '/solucoes/inteligencia-artificial', note: 'solucao 1:1 - a unica com pagina no ar' },
  cloud: { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'data-integration': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'data-analytics': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'master-data-management': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'data-discovery': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'customer-360': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'governanca-de-dados': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  treinamento: { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'alocacao-de-consultores': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'fabrica-de-transformacao-de-dados': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'sustentacao-remota': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },
  'assessoria-em-produtos': { to: '/solucoes', note: 'N:1 - so vale se a solucao for despublicada' },

  /* Sem destino, e sai de propósito. */
  'em-manutencao': { to: '', status: 410, note: 'pagina tecnica do WordPress' },
  'health-check': { to: '', status: 410, note: 'pagina tecnica do WordPress' },
  /* ⚠️ Não é 410: o WordPress a tem marcada como **página inicial**, e é ela que
   * responde em `atra.com.br/`. O WP já 301 o slug para a raiz; o site novo
   * serve a própria home ali. Mandar 410 aqui apagaria a home do WordPress dos
   * índices durante o cutover. */
  'sample-page': { to: '/', note: 'e a pagina inicial do WordPress - o WP ja 301 o slug para a raiz' },
  eventos: { to: '/insights', note: 'N:1 - nao ha rota de eventos; o hub de conteudo e o mais proximo' },
}

/** Taxonomia vazia do WP: 1 categoria com os 207 posts, 0 tags (P-27). */
const CURADAS_FORA_DAS_PAGINAS: Linha[] = [
  { from: '/category/uncategorized/', to: '', status: 410, note: 'taxonomia vazia - o WP tem 1 categoria e 0 tags' },
]

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ lendo WordPress e banco')
const [wpPosts, wpPaginas, { docs: posts }, { docs: vagas }, { docs: segmentos }, { docs: solucoes }] = await Promise.all([
  cliente.posts({ _fields: 'id,slug,link' }),
  cliente.pages({ _fields: 'id,slug,link,content' }),
  payload.find({ collection: 'posts', limit: 500, locale: 'pt', depth: 0, select: { slug: true } }),
  payload.find({ collection: 'jobs', limit: 200, locale: 'pt', depth: 0, select: { slug: true } }),
  payload.find({ collection: 'segments', limit: 200, locale: 'pt', depth: 0, select: { slug: true } }),
  payload.find({
    collection: 'solutions',
    limit: 200,
    locale: 'pt',
    depth: 0,
    where: { _status: { equals: 'published' }, hasPage: { equals: true } },
    select: { slug: true },
  }),
])

const slugsDePost = new Set(posts.map((p) => p.slug))
const slugsDeVaga = new Set(vagas.map((v) => v.slug))
const slugsDeSegmento = new Set(segmentos.map((v) => v.slug))
const slugsDeSolucao = new Set(solucoes.map((v) => v.slug))

/** Caminho da URL do WP, sempre com barra final. */
function caminho(link: string | undefined, slug: string): string {
  if (!link) return `/${slug}/`
  const p = new URL(link).pathname
  /* ⚠️ O WordPress devolve `/` como `link` da página marcada como **página
   * inicial** — é o caso de `sample-page`. Aceitar isso gerava a linha
   * `/,,410`, que manda a home do site novo responder "410 Gone".
   *
   * O arquivo é consumido pelo `next.config.ts`: seria o site inteiro fora do
   * ar por uma página de exemplo que o WordPress cria sozinho. A conferência de
   * cobertura não pegou porque ela verifica que **toda página tem destino**, não
   * que o destino faz sentido. */
  if (p === '/' || p === '') return `/${slug}/`
  return p.endsWith('/') ? p : `${p}/`
}

const geradas: Linha[] = []
const semDestino: string[] = []

for (const p of wpPosts) {
  const destino = slugify(p.slug)
  if (!slugsDePost.has(destino)) {
    semDestino.push(`post ${p.slug} → /blog/${destino} (não está no banco)`)
    continue
  }
  geradas.push({
    from: caminho(p.link, p.slug),
    to: `/blog/${destino}`,
    status: 301,
    note: destino === p.slug ? 'post 1:1' : 'post 1:1 com slug normalizado',
  })
}

/* As vagas do WP têm URL de raiz (`/key-account-manager-pl-sr/`). Mandá-las para
 * `/carreiras` levaria o candidato à lista, não à vaga — daí `/carreiras/[slug]`
 * (modelo-de-conteudo.md). */
for (const pg of wpPaginas.filter((p) => /#vemserATRA/i.test(p.content?.rendered ?? ''))) {
  const destino = slugify(pg.slug)
  if (!slugsDeVaga.has(destino)) {
    semDestino.push(`vaga ${pg.slug} → /carreiras/${destino} (não está no banco)`)
    continue
  }
  geradas.push({ from: caminho(pg.link, pg.slug), to: `/carreiras/${destino}`, status: 301, note: 'vaga 1:1' })
}

/* As institucionais da tabela curada. */
const slugsDePaginaDeVaga = new Set(
  wpPaginas.filter((p) => /#vemserATRA/i.test(p.content?.rendered ?? '')).map((p) => p.slug),
)
const semCuradoria: string[] = []

for (const pg of wpPaginas) {
  if (slugsDePaginaDeVaga.has(pg.slug)) continue

  /* As 8 verticais saem do banco, 1:1, como os posts e as vagas: o slug do WP é
   * o slug do segmento (MIG-092). Escrevê-las na tabela curada duplicaria a
   * lista e envelheceria na primeira vertical nova. */
  const comoSegmento = slugify(pg.slug)
  if (slugsDeSegmento.has(comoSegmento)) {
    geradas.push({ from: caminho(pg.link, pg.slug), to: `/segmentos/${comoSegmento}`, status: 301, note: 'segmento 1:1' })
    continue
  }

  /* Idem para as soluções, e é aqui que P-16 aparece no arquivo: enquanto as 12
   * estavam em rascunho, cada uma caía na tabela curada e ia para o índice
   * (N:1); publicadas, viram 1:1 sozinhas. O gerador lê o banco, então a
   * resposta de uma pendência de conteúdo não exige editar redirect à mão. */
  const comoSolucao = slugify(pg.slug)
  if (slugsDeSolucao.has(comoSolucao)) {
    geradas.push({ from: caminho(pg.link, pg.slug), to: `/solucoes/${comoSolucao}`, status: 301, note: 'solucao 1:1' })
    continue
  }

  const curada = CURADAS[pg.slug]
  if (!curada) {
    semCuradoria.push(pg.slug)
    continue
  }
  geradas.push({ from: caminho(pg.link, pg.slug), to: curada.to, status: curada.status ?? 301, note: curada.note })
}

geradas.push(...CURADAS_FORA_DAS_PAGINAS)

/* Preserva qualquer linha que já esteja no arquivo e não venha daqui — o CSV é
 * versionado, e alguém pode acrescentar um redirect de URL que só aparece no
 * Search Console (as de tráfego real, que o sitemap não lista). */
const preservadas: Linha[] = []
if (existsSync(ARQUIVO)) {
  const gerado = new Set(geradas.map((l) => l.from))
  for (const linha of readFileSync(ARQUIVO, 'utf8').split('\n').slice(1)) {
    const [from, to, status, ...resto] = linha.split(',')
    /* ⚠️ Linha na raiz nunca é preservada. O arquivo já ganhou uma `/,,410`
     * — a página inicial do WordPress virando 410 — e sem esta guarda a
     * preservação a ressuscitaria a cada geração, mesmo depois de corrigida a
     * causa. Regenerar tem que curar o arquivo, não repetir o defeito. */
    if (!from?.trim() || from === '/' || gerado.has(from)) continue
    preservadas.push({ from, to: to ?? '', status: Number(status) || 301, note: resto.join(',') })
  }
}

const todas = [...preservadas, ...geradas].sort((a, b) => a.from.localeCompare(b.from))
const csv = ['from,to,status,note', ...todas.map((l) => `${l.from},${l.to},${l.status},${l.note}`)].join('\n')

mkdirSync(path.dirname(ARQUIVO), { recursive: true })
writeFileSync(ARQUIVO, `${csv}\n`)

const posts301 = geradas.filter((l) => l.to.startsWith('/blog/')).length
const vagas301 = geradas.filter((l) => l.to.startsWith('/carreiras/')).length
const segmentos301 = geradas.filter((l) => l.to.startsWith('/segmentos/')).length
const solucoes301 = geradas.filter((l) => l.to.startsWith('/solucoes/')).length
console.log(
  `\n  ${posts301} posts · ${vagas301} vagas · ${segmentos301} segmentos · ${solucoes301} soluções · ` +
    `${geradas.length - posts301 - vagas301 - segmentos301 - solucoes301} institucionais · ${preservadas.length} preservadas`,
)
console.log(`  ${todas.length} linhas em ${path.relative(process.cwd(), ARQUIVO)}`)
for (const s of semDestino) console.log(`  ✗ ${s}`)

/* Validação possível hoje: destino existe no banco e `from`/`to` seguem a regra
 * do formato. Bater 301/200 contra staging é da Fase 5 (MIG-110), que é quando
 * o `next.config.ts` passa a consumir o arquivo e o CI ganha o teste. */
/* ⚠️ Vírgula na `note` quebra o arquivo: são 4 colunas sem aspas, e um
 * `next.config.ts` que fizer `split(',')` lê a metade da justificativa como uma
 * quinta coluna. */
const malFormadas = todas.filter(
  (l) =>
    !l.from.endsWith('/') ||
    /* `to` sem barra final — menos a raiz, que é só a barra. */
    (l.to && l.to !== '/' && l.to.endsWith('/')) ||
    !l.note.trim() ||
    l.note.includes(','),
)
for (const l of malFormadas) console.log(`  ✗ fora do formato: ${l.from} → ${l.to} (${l.note})`)

/* O critério de aceite da Fase 4c: **nenhuma URL do WordPress sem destino**.
 * Página nova no WP sem linha aqui reprova a geração em vez de sumir. */
for (const slug of semCuradoria) console.log(`  ✗ pagina sem destino curado: /${slug}/`)

/* ⚠️ Redirect na raiz é sempre engano, e o preço é o site inteiro: uma linha
 * `/,,410` tira a home do ar, e `/`→qualquer coisa faz laço infinito. Vale a
 * conferência mesmo parecendo impossível — foi exatamente o que a página
 * inicial do WordPress produziu, sem nenhum aviso. */
const naRaiz = todas.filter((l) => l.from === '/' || l.from === '')
for (const l of naRaiz) console.log(`  ✗ redirect na raiz: ${l.from} → ${l.to || '(410)'}`)

const reprovou =
  semDestino.length > 0 ||
  malFormadas.length > 0 ||
  semCuradoria.length > 0 ||
  naRaiz.length > 0 ||
  posts301 !== wpPosts.length

console.log(
  reprovou
    ? '\n✗ geração com pendências'
    : `\n✓ ${todas.length} linhas · ${wpPosts.length} posts, ${vagas301} vagas e ${wpPaginas.length - vagas301} páginas do WordPress, todas com destino`,
)
process.exit(reprovou ? 1 : 0)
