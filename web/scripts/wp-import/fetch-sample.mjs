/* Baixa uma amostra de posts do WordPress para o piloto (MIG-012).
 * ⚠️ A API responde 302 sem user-agent de browser. */
import { writeFileSync, mkdirSync } from 'node:fs'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
const BASE = 'https://www.atra.com.br/wp-json/wp/v2'

const get = async (path) => {
  const r = await fetch(`${BASE}${path}`, { headers: { 'user-agent': UA } })
  if (!r.ok) throw new Error(`${r.status} em ${path}`)
  return r.json()
}

// Amostra espalhada no tempo: o uso do Gutenberg mudou ao longo de 6 anos.
const anos = [2021, 2022, 2023, 2024, 2025, 2026]
const amostra = []
for (const ano of anos) {
  const posts = await get(
    `/posts?per_page=2&after=${ano}-01-01T00:00:00&before=${ano}-12-31T23:59:59&orderby=date&order=asc`,
  )
  amostra.push(...posts)
}

mkdirSync('scripts/wp-import/.sample', { recursive: true })
writeFileSync('scripts/wp-import/.sample/posts.json', JSON.stringify(amostra, null, 2))
console.log(`${amostra.length} posts salvos`)
for (const p of amostra) {
  console.log(`  ${p.date.slice(0, 10)}  ${String(p.content.rendered.length).padStart(6)} chars  ${p.slug.slice(0, 55)}`)
}
