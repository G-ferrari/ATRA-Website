/* Varre os 207 posts em busca de estruturas de risco (MIG-012).
 * O piloto converteu 12; isto verifica se a amostra é representativa. */
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
const BASE = 'https://www.atra.com.br/wp-json/wp/v2'

let pagina = 1, todos = []
while (true) {
  const r = await fetch(`${BASE}/posts?per_page=100&page=${pagina}&_fields=id,slug,date,content`, {
    headers: { 'user-agent': UA },
  })
  if (!r.ok) break
  const lote = await r.json()
  if (!lote.length) break
  todos.push(...lote)
  if (lote.length < 100) break
  pagina++
}

const risco = {
  'bloco Gutenberg (wp:)': /<!--\s*wp:/i,
  'iframe / embed': /<iframe/i,
  'tabela': /<table/i,
  'script embutido': /<script/i,
  'galeria': /wp-block-gallery|gallery/i,
  'colunas': /wp-block-columns/i,
  'shortcode não processado': /\[[a-z_]+[^\]]*\]/i,
  'vídeo': /<video|youtube\.com|vimeo\.com/i,
  'formulário': /<form/i,
  'SVG inline': /<svg/i,
}

const contagem = {}, exemplos = {}
let semCorpo = 0, totalChars = 0, totalImgs = 0
for (const p of todos) {
  const h = p.content?.rendered ?? ''
  totalChars += h.length
  totalImgs += (h.match(/<img/gi) || []).length
  if (h.trim().length < 200) semCorpo++
  for (const [nome, re] of Object.entries(risco)) {
    if (re.test(h)) {
      contagem[nome] = (contagem[nome] || 0) + 1
      if (!exemplos[nome]) exemplos[nome] = p.slug
    }
  }
}

console.log(`═══ VARREDURA COMPLETA: ${todos.length} posts ═══`)
console.log(`caracteres de HTML: ${totalChars.toLocaleString('pt-BR')}`)
console.log(`imagens no total:   ${totalImgs}`)
console.log(`posts com corpo < 200 chars: ${semCorpo}`)
console.log('\nestrutura                     posts   exemplo')
for (const [nome] of Object.entries(risco)) {
  const n = contagem[nome] || 0
  const pct = ((n / todos.length) * 100).toFixed(1)
  console.log(`${nome.padEnd(28)} ${String(n).padStart(4)} (${pct.padStart(5)}%)  ${exemplos[nome] ?? '—'}`.slice(0, 110))
}
