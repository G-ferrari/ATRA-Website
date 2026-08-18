/* Varre os 207 posts em busca de estruturas de risco (MIG-012).
 * O piloto converte 12; isto verifica se a amostra é representativa.
 *
 * Rodar com: pnpm exec tsx scripts/wp-import/scan-corpus.ts */
import { WP_API, WP_USER_AGENT, type WpPost } from './types'

const posts: WpPost[] = []
for (let pagina = 1; ; pagina++) {
  const r = await fetch(`${WP_API}/posts?per_page=100&page=${pagina}&_fields=id,slug,date,content`, {
    headers: { 'user-agent': WP_USER_AGENT },
  })
  if (!r.ok) break
  const lote = (await r.json()) as WpPost[]
  posts.push(...lote)
  if (lote.length < 100) break
}

const RISCOS: Record<string, RegExp> = {
  'bloco Gutenberg (wp:)': /<!--\s*wp:/i,
  'iframe / embed': /<iframe/i,
  tabela: /<table/i,
  'script embutido': /<script/i,
  galeria: /wp-block-gallery|gallery/i,
  colunas: /wp-block-columns/i,
  'shortcode não processado': /\[[a-z_]+[^\]]*\]/i,
  vídeo: /<video|youtube\.com|vimeo\.com/i,
  formulário: /<form/i,
  'SVG inline': /<svg/i,
}

const contagem: Record<string, number> = {}
const exemplo: Record<string, string> = {}
let semCorpo = 0
let chars = 0
let imagens = 0

for (const p of posts) {
  const html = p.content?.rendered ?? ''
  chars += html.length
  imagens += (html.match(/<img/gi) ?? []).length
  if (html.trim().length < 200) semCorpo++
  for (const [nome, re] of Object.entries(RISCOS)) {
    if (!re.test(html)) continue
    contagem[nome] = (contagem[nome] ?? 0) + 1
    exemplo[nome] ??= p.slug
  }
}

console.log(`═══ ${posts.length} posts · ${chars.toLocaleString('pt-BR')} chars · ${imagens} imagens ═══`)
console.log(`posts com corpo < 200 chars: ${semCorpo}\n`)
for (const nome of Object.keys(RISCOS)) {
  const n = contagem[nome] ?? 0
  const pct = ((n / posts.length) * 100).toFixed(1)
  console.log(`${nome.padEnd(28)} ${String(n).padStart(4)} (${pct.padStart(5)}%)  ${exemplo[nome] ?? '—'}`)
}
