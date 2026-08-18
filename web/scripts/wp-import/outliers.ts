/* Converte os 4 posts fora do padrão (tabela e vídeo) — MIG-012. */
import { JSDOM } from 'jsdom'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '../../src/payload.config'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
const editorConfig = await editorConfigFactory.default({ config: await config })

const r = await fetch(
  'https://www.atra.com.br/wp-json/wp/v2/posts?per_page=100&_fields=slug,content',
  { headers: { 'user-agent': UA } },
)
const posts = (await r.json()).filter(
  (p: any) => /<table/i.test(p.content.rendered) || /<video|youtube\.com|vimeo\.com/i.test(p.content.rendered),
)

const texto = (n: any): string =>
  n.type === 'text' ? (n.text ?? '') : (n.children ?? []).map(texto).join('')
const tipos = (n: any, acc: any = {}) => {
  for (const c of n.children ?? []) { acc[c.type] = (acc[c.type] || 0) + 1; tipos(c, acc) }
  return acc
}
const limpar = (s: string) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()

for (const p of posts) {
  const origem = limpar(new JSDOM(p.content.rendered).window.document.body.textContent || '')
  const { root } = convertHTMLToLexical({ editorConfig, html: p.content.rendered, JSDOM })
  const destino = limpar(texto(root))
  const t = tipos(root)
  const temTabela = /<table/i.test(p.content.rendered)
  console.log(`\n${p.slug.slice(0, 60)}`)
  console.log(`  estrutura: ${temTabela ? 'TABELA' : 'vídeo'}`)
  console.log(`  texto: ${origem.length} → ${destino.length} (${(destino.length/origem.length*100).toFixed(1)}%)`)
  console.log(`  nós: ${Object.entries(t).map(([k,v])=>`${k}:${v}`).join(' ')}`)
  if (temTabela) {
    const linhas = (p.content.rendered.match(/<tr/gi) || []).length
    console.log(`  linhas <tr> na origem: ${linhas} | nós table no destino: ${t.table ?? 0}`)
  }
}
