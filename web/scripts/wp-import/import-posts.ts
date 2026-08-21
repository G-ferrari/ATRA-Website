/* MIG-083 — importação dos 207 posts do WordPress.
 *
 * Junta MIG-080 (cliente), MIG-081 (conversor) e MIG-082 (mídia): baixa os
 * posts, converte o corpo, resolve as imagens e grava em `posts`.
 *
 * Idempotente pelo slug — que é o **slug do WordPress**, não um derivado do
 * título: é ele que faz o redirect de MIG-086 ser 1:1.
 *
 * Rodar com: pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-posts.ts
 *   --limite=N          importa só os N primeiros (para conferir antes de tudo)
 *   --remover-fixtures  apaga os posts do protótipo que não vieram do WP
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { slugify } from '../../src/fields/slug'
import { createWpClient } from './client'
import { criarConversor, percorrer } from './convert'
import { criarImportadorDeMidia } from './media'
import { decodificar, encurtar, textoPuro } from './texto'
import type { LexicalNode, WpPost } from './types'

const args = process.argv.slice(2)
const LIMITE = Number(args.find((a) => a.startsWith('--limite='))?.split('=')[1] ?? 0)
const REMOVER_FIXTURES = args.includes('--remover-fixtures')

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ baixando do WordPress')
const [posts, midias] = await Promise.all([
  cliente.posts({ _fields: 'id,slug,date,title,content,excerpt,featured_media,link' }),
  cliente.media({ _fields: 'id,source_url,alt_text,caption,mime_type,media_details,title' }),
])
console.log(`  ${posts.length} posts · ${midias.length} mídias na biblioteca`)

const alvo = LIMITE ? posts.slice(0, LIMITE) : posts
const converter = await criarConversor({ slugsDePost: new Set(posts.map((p) => p.slug)) })
const midia = await criarImportadorDeMidia({ payload, cliente, midias })

/** Troca cada nó pendente pela relação real. Devolve quantas imagens resolveu. */
async function resolverImagens(raiz: LexicalNode, reserva: string): Promise<number> {
  const pendentes: LexicalNode[] = []
  percorrer(raiz, (n) => {
    if (n.type === 'upload' && (n as { pending?: { src?: string } }).pending?.src) pendentes.push(n)
  })

  for (const no of pendentes) {
    const alvo = no as unknown as {
      pending?: { src: string }
      relationTo?: string
      value?: number
      fields?: Record<string, unknown>
    }
    const src = alvo.pending!.src
    const wpId = midia.idDaUrl(src)
    /* ⚠️ Derruba em vez de deixar o nó pendente. Um `upload` sem `value` chega
     * ao admin como imagem quebrada e passa por conteúdo — e o `src` que sobra
     * aponta para o WordPress, que é justamente o que a migração desliga. */
    if (!wpId) throw new Error(`imagem fora da biblioteca do WP: ${src}`)

    alvo.value = await midia.garantir(wpId, reserva)
    alvo.relationTo = 'media'
    alvo.fields ??= {}
    delete alvo.pending
  }

  return pendentes.length
}

/** Ids que esta execução criou ou atualizou — é o que define o que é fixture. */
const tocados = new Set<number>()

async function importar(post: WpPost): Promise<'criado' | 'atualizado'> {
  const titulo = decodificar(post.title.rendered).trim()
  const { raiz } = converter(post.content.rendered)
  await resolverImagens(raiz, titulo)

  if (!post.featured_media) throw new Error('sem imagem destacada')
  const capa = await midia.garantir(post.featured_media, titulo)

  /* Um único post do corpus não tem resumo; o começo do corpo serve. */
  const resumo = encurtar(textoPuro(post.excerpt?.rendered ?? '') || textoPuro(post.content.rendered))

  /* ⚠️ Normaliza aqui em vez de deixar para o hook de `slugField`.
   *
   * Um post do corpus tem `%c2%b2` no slug do WP (um "²" percent-encoded), e o
   * `%` é **curinga** na checagem de unicidade do Payload: gravando o valor
   * bruto, a consulta casa com qualquer linha e o campo é recusado como
   * duplicado. Só esse post falhava, e só na gravação do segundo idioma — o
   * primeiro passa porque ainda não há linha com que colidir.
   *
   * Normalizado antes, o valor gravado é o mesmo que o hook produziria, e é o
   * que `gerar-redirects.ts` usa como destino. */
  const slug = slugify(post.slug)

  const dados = {
    title: titulo,
    slug,
    description: resumo,
    coverImage: capa,
    body: { root: raiz } as never,
    publishedAt: post.date,
    /* `tags` fica vazio: MIG-084 está parada em P-27. O WordPress tem **1**
     * categoria (`uncategorized`, com os 207) e **0** tags — não há taxonomia
     * para mapear, e classificar 207 artigos é decisão de conteúdo (D-22). */
    _status: 'published' as const,
  }

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const doc = docs[0]
    ? await payload.update({ collection: 'posts', id: docs[0].id, data: dados, locale: 'pt' })
    : await payload.create({ collection: 'posts', data: dados, locale: 'pt' })

  /* ⚠️ O **slug** precisa existir nos dois idiomas, mesmo com o artigo só em
   * português.
   *
   * `fallback: true` resolve a leitura — `/en` mostra o texto em PT —, mas não
   * a **consulta**: `where: { slug: { equals } }` bate na coluna do locale `en`,
   * que fica nula, e `generateStaticParams` do `/en` não lista nada. Sem esta
   * gravação os 207 artigos respondem 404 em `/en/blog/<slug>`, e só ali. Foi o
   * que o smoke pegou; o seed antigo já fazia isto e a importação não.
   *
   * O `body` fica de fora de propósito: aí o fallback funciona, e duplicar o
   * corpo em `en` esconderia a tradução que não existe (débito registrado). */
  await payload.update({
    collection: 'posts',
    id: doc.id,
    data: { title: dados.title, slug: dados.slug, description: dados.description },
    locale: 'en',
  })

  tocados.add(doc.id)
  return docs[0] ? 'atualizado' : 'criado'
}

console.log(`\n→ importando ${alvo.length} posts`)
let criados = 0
let atualizados = 0
const falhas: string[] = []

for (const [i, post] of alvo.entries()) {
  try {
    const r = await importar(post)
    if (r === 'criado') criados++
    else atualizados++
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${alvo.length}`)
  } catch (erro) {
    falhas.push(`${post.slug}: ${erro instanceof Error ? erro.message : String(erro)}`)
  }
}

const m = midia.resumo()
console.log(`\n  ${criados} criados · ${atualizados} atualizados · ${falhas.length} falhas`)
console.log(`  mídia: ${m.baixadas} baixadas · ${m.reaproveitadas} reaproveitadas`)
console.log(`  alt: ${m.alt.biblioteca} da biblioteca · ${m.alt.tituloDaMidia} do título da mídia · ${m.alt.tituloDoPost} do título do artigo`)
for (const f of falhas) console.log(`  ✗ ${f}`)

/* Os 6 posts do protótipo são fixture do aceite visual, não conteúdo: D-17
 * manda descartá-los. Só saem quando pedido — apagar conteúdo por padrão é o
 * tipo de coisa que não se descobre pelo log. */
/* ⚠️ O que sobrou é decidido pelos **ids que esta execução tocou**, e não por
 * comparar o slug com o do WordPress.
 *
 * O slug gravado nem sempre é o do WP: o hook de `slugField` normaliza, e um
 * post do corpus tem `%c2%b2` no slug (um "²" percent-encoded), que vira
 * `-c2-b2`. Comparando por slug, esse post era criado e apagado na mesma
 * corrida — 206 de 207, sem erro nenhum no log. Por id, o que a importação
 * acabou de gravar nunca entra na lista de remoção. */
const { docs: todos } = await payload.find({ collection: 'posts', limit: 500, locale: 'pt', depth: 0 })
const fixtures = LIMITE ? [] : todos.filter((d) => !tocados.has(d.id))

if (fixtures.length && !REMOVER_FIXTURES) {
  console.log(`\n  ⚠ ${fixtures.length} posts fora do WordPress (fixtures do protótipo):`)
  for (const f of fixtures) console.log(`      ${f.slug}`)
  console.log('      rode com --remover-fixtures para apagá-los (D-17)')
} else if (fixtures.length) {
  for (const f of fixtures) await payload.delete({ collection: 'posts', id: f.id })
  console.log(`\n  ${fixtures.length} fixtures do protótipo removidas (D-17)`)
}

console.log(falhas.length ? '\n✗ importação com falhas' : '\n✓ importação completa')
process.exit(falhas.length ? 1 : 0)
