/* Inspeção qualitativa do resultado do piloto (MIG-012). */
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '../../src/payload.config'

const posts = JSON.parse(readFileSync('scripts/wp-import/.sample/posts.json', 'utf8'))
const editorConfig = await editorConfigFactory.default({ config: await config })

const post = posts.find((p: any) => p.content.rendered.includes('<img')) ?? posts[0]
const { root } = convertHTMLToLexical({ editorConfig, html: post.content.rendered, JSDOM })

console.log('post:', post.slug, '\n')

const achar = (node: any, tipo: string, acc: any[] = []) => {
  for (const c of node.children ?? []) {
    if (c.type === tipo) acc.push(c)
    achar(c, tipo, acc)
  }
  return acc
}

console.log('=== NÓ DE IMAGEM (upload) ===')
const up = achar(root, 'upload')[0]
console.log(JSON.stringify(up, null, 1).slice(0, 500))

console.log('\n=== NÍVEIS DE TÍTULO PRESERVADOS? ===')
const origem = [...post.content.rendered.matchAll(/<h([1-6])[^>]*>/gi)].map(m => 'h' + m[1])
const destino = achar(root, 'heading').map((h: any) => h.tag)
console.log('origem: ', origem.join(' '))
console.log('destino:', destino.join(' '))
console.log('iguais:', JSON.stringify(origem) === JSON.stringify(destino) ? 'SIM' : 'NÃO')

console.log('\n=== FORMATAÇÃO INLINE (negrito/itálico) ===')
const negritoOrigem = (post.content.rendered.match(/<(strong|b)\b/gi) || []).length
const comFormato = achar(root, 'text').filter((t: any) => t.format > 0)
console.log('origem <strong>/<b>:', negritoOrigem, '| nós de texto com formato:', comFormato.length)
if (comFormato[0]) console.log('exemplo:', JSON.stringify({ text: comFormato[0].text.slice(0,45), format: comFormato[0].format }))

console.log('\n=== LINK ===')
const lk = achar(root, 'link')[0]
if (lk) console.log(JSON.stringify(lk.fields, null, 1))
