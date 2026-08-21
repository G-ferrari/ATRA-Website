/* MIG-081 — verificação do conversor contra o corpus real.
 *
 * O critério de aceite pedia 12 posts do piloto + 4 outliers + 20 amostrados.
 * Isto roda nos **207**, que é mais barato do que parece (o cliente tem cache em
 * disco) e responde a pergunta que a amostra não responde: quantos posts, dos
 * que vão ao ar, perdem conteúdo.
 *
 * O teste unitário (`convert.test.ts`) cobre a lógica com fixture e não depende
 * de rede; isto aqui mede o corpus. São coisas diferentes e as duas são precisas.
 *
 * Rodar com: pnpm exec tsx scripts/wp-import/check-convert.ts */
import { JSDOM } from 'jsdom'

import { createWpClient } from './client'
import { criarConversor, CorpoVazio } from './convert'
import { textoDe, tiposDe, type WpPost } from './types'

/* ⚠️ A retenção é medida **sem espaço nenhum**, e não com espaço normalizado.
 *
 * `textContent` insere a quebra que existe entre as tags do HTML; os nós de
 * texto do Lexical vêm aparados. Comparando com espaço, dois posts apareciam
 * com 97,8% e 98,6% de "perda" — que era, caractere a caractere, a ausência do
 * espaço entre um parágrafo e o seguinte. Post curto com muitos blocos afunda a
 * métrica sem perder uma letra. */
const semEspaco = (s: string) => s.replace(/\s+/g, '')

const posts = await createWpClient().posts({ _fields: 'id,slug,date,title,content,link' })
const slugs = new Set(posts.map((p) => p.slug))
const converter = await criarConversor({ slugsDePost: slugs })

type Linha = {
  post: WpPost
  retencao: number
  imagensHtml: number
  imagensLex: number
  linksHtml: number
  linksLex: number
  reescritos: number
  desfeitos: number
  tabelasHtml: number
  tabelasLex: number
}

const linhas: Linha[] = []
const falhas: string[] = []

for (const post of posts) {
  const html = post.content.rendered
  try {
    const { raiz, imagens, linksReescritos, linksDesfeitos } = converter(html)
    const origem = semEspaco(new JSDOM(html).window.document.body.textContent ?? '')
    const destino = semEspaco(textoDe(raiz))
    const tipos = tiposDe(raiz)
    linhas.push({
      post,
      retencao: origem.length ? +((destino.length / origem.length) * 100).toFixed(1) : 0,
      imagensHtml: (html.match(/<img/gi) ?? []).length,
      imagensLex: imagens.length,
      linksHtml: (html.match(/<a\s[^>]*href="http/gi) ?? []).length,
      linksLex: tipos.link ?? 0,
      reescritos: linksReescritos,
      desfeitos: linksDesfeitos,
      tabelasHtml: (html.match(/<table/gi) ?? []).length,
      tabelasLex: tipos.table ?? 0,
    })
  } catch (erro) {
    falhas.push(`${post.slug}: ${erro instanceof CorpoVazio ? erro.detalhe : String(erro)}`)
  }
}

const soma = (f: (l: Linha) => number) => linhas.reduce((s, l) => s + f(l), 0)
const abaixoDe99 = linhas.filter((l) => l.retencao < 99)
const imagemFaltando = linhas.filter((l) => l.imagensLex < l.imagensHtml)
const linkFaltando = linhas.filter((l) => l.linksLex + l.desfeitos < l.linksHtml)
const comTabela = linhas.filter((l) => l.tabelasHtml > 0)
const tabelaPerdida = comTabela.filter((l) => l.tabelasLex < l.tabelasHtml)

console.log(`\n═══ ${linhas.length} posts convertidos ═══`)
console.log(`retenção de texto: mínima ${Math.min(...linhas.map((l) => l.retencao))}% · abaixo de 99%: ${abaixoDe99.length}`)
console.log(`imagens: ${soma((l) => l.imagensLex)}/${soma((l) => l.imagensHtml)} · posts com imagem perdida: ${imagemFaltando.length}`)
console.log(`links:   ${soma((l) => l.linksLex)}/${soma((l) => l.linksHtml)} · posts com link perdido: ${linkFaltando.length}`)
console.log(`links internos reescritos para /blog: ${soma((l) => l.reescritos)}`)
console.log(`<a> sem href desfeitos em texto: ${soma((l) => l.desfeitos)}`)
console.log(`tabelas: ${soma((l) => l.tabelasLex)}/${soma((l) => l.tabelasHtml)} em ${comTabela.length} posts`)

for (const l of comTabela) console.log(`  tabela · ${l.tabelasLex}/${l.tabelasHtml} · ${l.post.slug}`)
for (const l of abaixoDe99) console.log(`  ⚠ retenção ${l.retencao}% · ${l.post.slug}`)
for (const l of imagemFaltando) console.log(`  ⚠ imagens ${l.imagensLex}/${l.imagensHtml} · ${l.post.slug}`)
for (const l of linkFaltando) console.log(`  ⚠ links ${l.linksLex}/${l.linksHtml} · ${l.post.slug}`)
for (const f of falhas) console.log(`  ✗ ${f}`)

const reprovou = falhas.length > 0 || tabelaPerdida.length > 0 || abaixoDe99.length > 0
console.log(reprovou ? '\n✗ conversor reprovado' : '\n✓ conversor aprovado nos 207')
process.exit(reprovou ? 1 : 0)
