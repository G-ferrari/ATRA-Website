/* MIG-012 — piloto de conversão HTML → Lexical.
 *
 * Diagnóstico, não entrega: mede o risco da migração dos 207 posts antes de
 * comprometer prazo. Resultado em docs/03-plano/piloto-conversao-wp.md.
 *
 * Rodar com: pnpm exec tsx scripts/wp-import/pilot.ts
 * (o strip de tipos do Node não resolve import de TS sem extensão) */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

import config from '../../src/payload.config'
import {
  limparTexto,
  textoDe,
  tiposDe,
  WP_API,
  WP_USER_AGENT,
  type ContagemPorTipo,
  type LexicalNode,
  type WpPost,
} from './types'

const AMOSTRA = 'scripts/wp-import/.sample/posts.json'

async function baixarAmostra(): Promise<WpPost[]> {
  // Espalhada no tempo: o uso do editor mudou ao longo de 6 anos.
  const posts: WpPost[] = []
  for (const ano of [2021, 2022, 2023, 2024, 2025, 2026]) {
    const r = await fetch(
      `${WP_API}/posts?per_page=2&after=${ano}-01-01T00:00:00&before=${ano}-12-31T23:59:59&orderby=date&order=asc`,
      { headers: { 'user-agent': WP_USER_AGENT } },
    )
    if (!r.ok) throw new Error(`WordPress respondeu ${r.status}`)
    posts.push(...((await r.json()) as WpPost[]))
  }
  mkdirSync('scripts/wp-import/.sample', { recursive: true })
  writeFileSync(AMOSTRA, JSON.stringify(posts, null, 2))
  return posts
}

let posts: WpPost[]
try {
  posts = JSON.parse(readFileSync(AMOSTRA, 'utf8')) as WpPost[]
} catch {
  posts = await baixarAmostra()
}

const editorConfig = await editorConfigFactory.default({ config: await config })

type Linha = {
  slug: string
  ano: string
  charsOrigem: number
  charsDestino: number
  retencao: number
  tipos: ContagemPorTipo
  imagens: { origem: number; destino: number }
  links: { origem: number; destino: number }
}

const linhas: Linha[] = []

for (const post of posts) {
  const html = post.content.rendered
  const origem = limparTexto(new JSDOM(html).window.document.body.textContent ?? '')
  const { root } = convertHTMLToLexical({ editorConfig, html, JSDOM })
  const raiz = root as unknown as LexicalNode
  const destino = limparTexto(textoDe(raiz))
  const tipos = tiposDe(raiz)

  linhas.push({
    slug: post.slug,
    ano: post.date.slice(0, 4),
    charsOrigem: origem.length,
    charsDestino: destino.length,
    retencao: origem.length ? +((destino.length / origem.length) * 100).toFixed(1) : 0,
    tipos,
    imagens: { origem: (html.match(/<img/gi) ?? []).length, destino: tipos.upload ?? 0 },
    links: { origem: (html.match(/<a\s/gi) ?? []).length, destino: tipos.link ?? 0 },
  })
}

console.log('\n═══ RETENÇÃO DE TEXTO ═══')
for (const l of linhas) {
  const marca = l.retencao >= 99 ? '✓' : l.retencao >= 90 ? '~' : '✗'
  console.log(
    `${l.ano}  ${String(l.charsOrigem).padStart(6)}→${String(l.charsDestino).padStart(6)}  ` +
      `${marca} ${String(l.retencao).padStart(5)}%  ${l.slug.slice(0, 45)}`,
  )
}

const soma = (f: (l: Linha) => number) => linhas.reduce((s, l) => s + f(l), 0)
console.log('\n═══ IMAGENS E LINKS ═══')
console.log(`imagens: ${soma((l) => l.imagens.origem)} → ${soma((l) => l.imagens.destino)} convertidas`)
console.log(`links:   ${soma((l) => l.links.origem)} → ${soma((l) => l.links.destino)} convertidos`)

const totais: ContagemPorTipo = {}
for (const l of linhas) for (const [t, n] of Object.entries(l.tipos)) totais[t] = (totais[t] ?? 0) + n
console.log('\n═══ NÓS LEXICAL GERADOS ═══')
for (const [t, n] of Object.entries(totais).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}×  ${t}`)
}

/* ⚠️ Tabela converte com 100% de retenção de texto e ZERO estrutura com o
 * conjunto padrão de features — as linhas viram parágrafos soltos e a métrica
 * acima não acusa. Corrigido com EXPERIMENTAL_TableFeature; ver o relatório. */
