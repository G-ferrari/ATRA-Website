/* O que o HTML dos posts realmente contém (MIG-012). */
import { readFileSync } from 'node:fs'

const posts = JSON.parse(readFileSync('scripts/wp-import/.sample/posts.json', 'utf8'))

const tags = {}, blocos = {}, classes = {}, achados = {}
const marca = (m, k) => (m[k] = (m[k] || 0) + 1)

for (const p of posts) {
  const html = p.content.rendered
  for (const m of html.matchAll(/<([a-z][a-z0-9]*)\b/gi)) marca(tags, m[1].toLowerCase())
  for (const m of html.matchAll(/<!--\s*\/?wp:([a-z0-9\/-]+)/gi)) marca(blocos, m[1])
  for (const m of html.matchAll(/class="([^"]+)"/gi))
    for (const c of m[1].split(/\s+/)) if (/^wp-|^has-|^is-/.test(c)) marca(classes, c)

  if (/<iframe/i.test(html)) marca(achados, 'iframe (embed)')
  if (/<table/i.test(html)) marca(achados, 'tabela')
  if (/<figure/i.test(html)) marca(achados, 'figure/figcaption')
  if (/style="/i.test(html)) marca(achados, 'style inline')
  if (/<img[^>]+srcset/i.test(html)) marca(achados, 'img com srcset')
  if (/data-[a-z-]+=/i.test(html)) marca(achados, 'atributo data-*')
  if (/<script/i.test(html)) marca(achados, 'script embutido')
  if (/&nbsp;/.test(html)) marca(achados, '&nbsp;')
  if (/<span/i.test(html)) marca(achados, 'span')
}

const tabela = (titulo, m, limite = 99) => {
  console.log(`\n### ${titulo}`)
  const e = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, limite)
  if (!e.length) return console.log('  (nenhum)')
  for (const [k, v] of e) console.log(`  ${String(v).padStart(4)}×  ${k}`)
}

console.log(`Amostra: ${posts.length} posts, ${posts.reduce((s,p)=>s+p.content.rendered.length,0).toLocaleString('pt-BR')} caracteres`)
tabela('Tags HTML', tags)
tabela('Blocos Gutenberg (comentários wp:)', blocos)
tabela('Classes do WordPress', classes, 12)
tabela('Estruturas que exigem atenção', achados)
