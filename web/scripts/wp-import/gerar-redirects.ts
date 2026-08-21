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

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ lendo WordPress e banco')
const [wpPosts, wpPaginas, { docs: posts }, { docs: vagas }] = await Promise.all([
  cliente.posts({ _fields: 'id,slug,link' }),
  cliente.pages({ _fields: 'id,slug,link,content' }),
  payload.find({ collection: 'posts', limit: 500, locale: 'pt', depth: 0, select: { slug: true } }),
  payload.find({ collection: 'jobs', limit: 200, locale: 'pt', depth: 0, select: { slug: true } }),
])

const slugsDePost = new Set(posts.map((p) => p.slug))
const slugsDeVaga = new Set(vagas.map((v) => v.slug))

/** Caminho da URL do WP, sempre com barra final. */
function caminho(link: string | undefined, slug: string): string {
  if (!link) return `/${slug}/`
  const p = new URL(link).pathname
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

/* Preserva o que foi curado à mão (Fase 4c). */
const preservadas: Linha[] = []
if (existsSync(ARQUIVO)) {
  const gerado = new Set(geradas.map((l) => l.from))
  for (const linha of readFileSync(ARQUIVO, 'utf8').split('\n').slice(1)) {
    const [from, to, status, ...resto] = linha.split(',')
    if (!from?.trim() || gerado.has(from)) continue
    preservadas.push({ from, to: to ?? '', status: Number(status) || 301, note: resto.join(',') })
  }
}

const todas = [...preservadas, ...geradas].sort((a, b) => a.from.localeCompare(b.from))
const csv = ['from,to,status,note', ...todas.map((l) => `${l.from},${l.to},${l.status},${l.note}`)].join('\n')

mkdirSync(path.dirname(ARQUIVO), { recursive: true })
writeFileSync(ARQUIVO, `${csv}\n`)

const posts301 = geradas.filter((l) => l.to.startsWith('/blog/')).length
console.log(`\n  ${posts301} posts · ${geradas.length - posts301} vagas · ${preservadas.length} preservadas do arquivo`)
console.log(`  ${todas.length} linhas em ${path.relative(process.cwd(), ARQUIVO)}`)
for (const s of semDestino) console.log(`  ✗ ${s}`)

/* Validação possível hoje: destino existe no banco e `from`/`to` seguem a regra
 * do formato. Bater 301/200 contra staging é da Fase 5 (MIG-110), que é quando
 * o `next.config.ts` passa a consumir o arquivo e o CI ganha o teste. */
/* ⚠️ Vírgula na `note` quebra o arquivo: são 4 colunas sem aspas, e um
 * `next.config.ts` que fizer `split(',')` lê a metade da justificativa como uma
 * quinta coluna. */
const malFormadas = todas.filter(
  (l) => !l.from.endsWith('/') || (l.to && l.to.endsWith('/')) || !l.note.trim() || l.note.includes(','),
)
for (const l of malFormadas) console.log(`  ✗ fora do formato: ${l.from} → ${l.to} (${l.note})`)

const reprovou = semDestino.length > 0 || malFormadas.length > 0 || posts301 !== wpPosts.length
console.log(reprovou ? '\n✗ geração com pendências' : `\n✓ ${posts301} posts e ${geradas.length - posts301} vagas, todos com destino no banco`)
process.exit(reprovou ? 1 : 0)
