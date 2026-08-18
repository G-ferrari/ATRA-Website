/* MIG-012 — piloto de conversão HTML → Lexical.
 *
 * Diagnóstico, não entrega. Existe para medir cedo o maior risco imprevisto do
 * projeto: os 207 posts do WordPress dependem deste conversor. */
import { readFileSync, writeFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

import config from '../../src/payload.config'

const posts = JSON.parse(readFileSync('scripts/wp-import/.sample/posts.json', 'utf8'))

/* Usa a config real do projeto: as features do Lexical (link, upload) leem
 * `collections` e os defaults de link — stub não serve.
 * `buildConfig` já devolve config sanitizado; sanitizar de novo duplica as
 * collections internas do Payload. Rodar com `tsx`. */
const editorConfig = await editorConfigFactory.default({ config: await config })

const textoDe = (node) => {
  if (!node) return ''
  if (node.type === 'text') return node.text ?? ''
  return (node.children ?? []).map(textoDe).join('')
}

const tiposDe = (node, acc = {}) => {
  for (const c of node.children ?? []) {
    acc[c.type] = (acc[c.type] || 0) + 1
    tiposDe(c, acc)
  }
  return acc
}

const limparTexto = (s) =>
  s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()

const relatorio = []

for (const p of posts) {
  const html = p.content.rendered
  const origem = limparTexto(new JSDOM(html).window.document.body.textContent || '')

  let lexical, erro = null
  try {
    lexical = convertHTMLToLexical({ editorConfig, html, JSDOM })
  } catch (e) {
    erro = e.message
  }

  if (erro) {
    relatorio.push({ slug: p.slug, erro })
    continue
  }

  const destino = limparTexto(textoDe(lexical.root))
  const tipos = tiposDe(lexical.root)
  const imagensOrigem = (html.match(/<img/gi) || []).length
  const linksOrigem = (html.match(/<a\s/gi) || []).length

  relatorio.push({
    slug: p.slug,
    ano: p.date.slice(0, 4),
    charsOrigem: origem.length,
    charsDestino: destino.length,
    retencaoTexto: origem.length ? +(destino.length / origem.length * 100).toFixed(1) : 0,
    tipos,
    imagens: { origem: imagensOrigem, destino: tipos.upload ?? tipos.image ?? 0 },
    links: { origem: linksOrigem, destino: tipos.link ?? tipos.autolink ?? 0 },
  })
}

writeFileSync('scripts/wp-import/.sample/relatorio.json', JSON.stringify(relatorio, null, 2))

console.log('\n═══ RETENÇÃO DE TEXTO ═══')
console.log('ano   origem→destino (chars)   retenção   post')
for (const r of relatorio) {
  if (r.erro) { console.log(`  ERRO  ${r.slug}: ${r.erro.slice(0, 60)}`); continue }
  const flag = r.retencaoTexto >= 99 ? '✓' : r.retencaoTexto >= 90 ? '~' : '✗'
  console.log(`${r.ano}  ${String(r.charsOrigem).padStart(6)}→${String(r.charsDestino).padStart(6)}   ${flag} ${String(r.retencaoTexto).padStart(5)}%   ${r.slug.slice(0, 42)}`)
}

const tot = relatorio.filter(r => !r.erro)
console.log('\n═══ IMAGENS E LINKS ═══')
console.log(`imagens: ${tot.reduce((s,r)=>s+r.imagens.origem,0)} na origem → ${tot.reduce((s,r)=>s+r.imagens.destino,0)} convertidas`)
console.log(`links:   ${tot.reduce((s,r)=>s+r.links.origem,0)} na origem → ${tot.reduce((s,r)=>s+r.links.destino,0)} convertidos`)

const todosTipos = {}
for (const r of tot) for (const [t, n] of Object.entries(r.tipos)) todosTipos[t] = (todosTipos[t]||0)+n
console.log('\n═══ NÓS LEXICAL GERADOS ═══')
for (const [t, n] of Object.entries(todosTipos).sort((a,b)=>b[1]-a[1])) console.log(`  ${String(n).padStart(4)}×  ${t}`)
