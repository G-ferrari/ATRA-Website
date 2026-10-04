/* Exporta posts do WordPress para dentro do repositório, para chegarem a um
 * ambiente **que já existe** por migração de dados (02/10).
 *
 * O importador (`import-posts.ts`) grava direto no banco em que roda, e só quem
 * tem acesso ao servidor consegue rodá-lo lá. Para os artigos publicados depois
 * da carga de 17/08, o caminho é o mesmo das soluções e dos segmentos: o texto
 * já convertido e as imagens entram em `src/migrations/arquivos/posts-wp/`, e a
 * migração `20261002_120000_posts_novos_do_wordpress` cria os posts no deploy.
 *
 * Não toca em banco nenhum: baixa, converte com o mesmo conversor do importador
 * (o editor do campo `posts.body`) e escreve arquivos.
 *
 * Rodar com: pnpm exec tsx scripts/wp-import/exportar-posts.ts --desde=2026-09-01
 *   --desde=AAAA-MM-DD  obrigatório: só posts publicados a partir desta data
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { slugify } from '../../src/fields/slug'
import type { ImagemExportada, PostExportado } from '../../src/migrations/arquivos/posts-wp/tipos'
import { createWpClient } from './client'
import { criarConversor, percorrer } from './convert'
import { indicePorUrl, limparHtml, nomeDeArquivo, resolverAlt } from './media'
import { decodificar, encurtar, textoPuro } from './texto'
import type { LexicalNode, WpMedia } from './types'

const DESDE = process.argv.slice(2).find((a) => a.startsWith('--desde='))?.split('=')[1]
if (!DESDE || !/^\d{4}-\d{2}-\d{2}$/.test(DESDE)) {
  console.error('✗ informe --desde=AAAA-MM-DD')
  process.exit(1)
}

const PASTA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src/migrations/arquivos/posts-wp')
mkdirSync(PASTA, { recursive: true })

/* `refresh`: o cache em disco não expira, e devolveria a lista de posts da
 * carga antiga — justamente sem os que este script existe para buscar. */
const cliente = createWpClient({ cacheMode: 'refresh' })

console.log('→ baixando do WordPress')
const [posts, midias] = await Promise.all([
  cliente.posts({ _fields: 'id,slug,date,title,content,excerpt,featured_media,link' }),
  cliente.media({ _fields: 'id,source_url,alt_text,caption,mime_type,media_details,title' }),
])
const alvo = posts.filter((p) => p.date.slice(0, 10) >= DESDE).sort((a, b) => a.date.localeCompare(b.date))
console.log(`  ${posts.length} posts no WordPress · ${alvo.length} a partir de ${DESDE}`)

// Todos os slugs, não só os exportados: é o que reescreve link interno para /blog/<slug>.
const converter = await criarConversor({ slugsDePost: new Set(posts.map((p) => p.slug)) })
const porId = new Map(midias.map((m) => [m.id, m]))
const porUrl = indicePorUrl(midias)
const baixadas = new Set<string>()

async function imagem(m: WpMedia, reserva: string): Promise<ImagemExportada> {
  const arquivo = nomeDeArquivo(m)
  if (!baixadas.has(arquivo)) {
    // O original, não o recorte: os tamanhos são gerados pelo Payload no upload.
    const bin = await cliente.fetchBinary(m.source_url)
    writeFileSync(path.join(PASTA, arquivo), bin.bytes)
    baixadas.add(arquivo)
    console.log(`    ↓ ${arquivo} (${Math.round(bin.bytes.length / 1024)} KB)`)
  }
  return {
    arquivo,
    chave: `wp-${m.id}-`,
    alt: resolverAlt(m, reserva).alt,
    legenda: limparHtml(m.caption?.rendered ?? '') || null,
    mime: m.mime_type ?? 'image/jpeg',
    origem: m.source_url,
  }
}

const saida: PostExportado[] = []
for (const post of alvo) {
  const titulo = decodificar(post.title.rendered).trim()
  console.log(`  ${post.date.slice(0, 10)} ${post.slug}`)
  const { raiz } = converter(post.content.rendered)

  const imagens = new Map<string, ImagemExportada>()
  if (!post.featured_media) throw new Error(`${post.slug}: sem imagem destacada`)
  const midiaDaCapa = porId.get(post.featured_media)
  if (!midiaDaCapa) throw new Error(`${post.slug}: capa ${post.featured_media} fora da biblioteca do WP`)
  const capa = await imagem(midiaDaCapa, titulo)
  imagens.set(capa.arquivo, capa)

  const pendentes: LexicalNode[] = []
  percorrer(raiz, (n) => {
    if (n.type === 'upload' && (n as { pending?: { src?: string } }).pending?.src) pendentes.push(n)
  })
  for (const no of pendentes) {
    const alvoDoNo = no as unknown as { pending: { src?: string; arquivo?: string } }
    const src = alvoDoNo.pending.src!
    const wpId = porUrl.get(src)
    const m = wpId ? porId.get(wpId) : undefined
    /* Mesma regra do importador: imagem fora da biblioteca derruba. Um `upload`
     * sem arquivo chegaria ao admin como imagem quebrada. */
    if (!m) throw new Error(`${post.slug}: imagem fora da biblioteca do WP: ${src}`)
    const img = await imagem(m, titulo)
    imagens.set(img.arquivo, img)
    alvoDoNo.pending = { arquivo: img.arquivo }
  }

  saida.push({
    slug: slugify(post.slug),
    titulo,
    resumo: encurtar(textoPuro(post.excerpt?.rendered ?? '') || textoPuro(post.content.rendered)),
    publicadoEm: post.date,
    origem: post.link ?? '',
    capa: capa.arquivo,
    imagens: [...imagens.values()],
    corpo: raiz,
  })
}

writeFileSync(path.join(PASTA, 'posts.json'), `${JSON.stringify(saida, null, 2)}\n`)
console.log(`\n✓ ${saida.length} posts e ${baixadas.size} imagens em ${path.relative(process.cwd(), PASTA)}`)
process.exit(0)
