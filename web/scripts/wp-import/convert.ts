/* MIG-081 — conversão do HTML do WordPress para Lexical.
 *
 * O trabalho pesado é do `convertHTMLToLexical` do Payload; o que está aqui é o
 * que ele não faz: coletar as imagens que ficaram pendentes, reescrever os
 * links internos para as rotas do site novo e recusar corpo vazio.
 *
 * ⚠️ A tabela **não** faz parte do conjunto padrão de features do Lexical. Sem
 * `EXPERIMENTAL_TableFeature` (ligada em `payload.config.ts`) os dois posts com
 * tabela do corpus convertem com 100% de retenção de texto e zero nós de
 * tabela: as 5 linhas viram parágrafos soltos. É o defeito que a métrica
 * principal não pega — o texto está todo lá e a relação tabular sumiu. Ver
 * `docs/03-plano/piloto-conversao-wp.md`.
 *
 * Nada daqui pode ser importado por `src/`: é ferramenta de importação. */
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { SanitizedServerEditorConfig } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { SanitizedConfig } from 'payload'

import config from '../../src/payload.config'
import type { LexicalNode } from './types'

/** Raiz do Lexical como o Payload a grava no campo `richText`. */
export type RaizLexical = LexicalNode & { type: 'root'; children: LexicalNode[] }

export type Convertido = {
  raiz: RaizLexical
  /** `src` das imagens em ordem de documento, uma entrada por nó `upload`. */
  imagens: string[]
  /** Quantos links foram reescritos para uma rota do site novo. */
  linksReescritos: number
  /** Quantos `<a>` sem `href` viraram texto comum. */
  linksDesfeitos: number
}

/** Corpo que converteu para nada — post vazio é erro, não resultado. */
export class CorpoVazio extends Error {
  constructor(readonly detalhe: string) {
    super(`[convert] corpo vazio: ${detalhe}`)
    this.name = 'CorpoVazio'
  }
}

/* ── Helpers puros, testáveis sem config do Payload ────────────────────────── */

/** Percorre a árvore em ordem de documento. */
export function percorrer(no: LexicalNode, visita: (n: LexicalNode) => void): void {
  visita(no)
  for (const filho of no.children ?? []) percorrer(filho, visita)
}

/**
 * `src` dos nós `upload` que o conversor deixou pendentes.
 *
 * O conversor **não baixa** a imagem: grava `pending: { src }` com a URL de
 * origem e nenhuma relação. Trocar isso pelo id da mídia é MIG-082.
 */
export function imagensPendentes(raiz: LexicalNode): string[] {
  const srcs: string[] = []
  percorrer(raiz, (n) => {
    if (n.type !== 'upload') return
    const src = (n as { pending?: { src?: string } }).pending?.src
    if (src) srcs.push(src)
  })
  return srcs
}

/**
 * Caminho novo de um link que aponta para um post do WordPress.
 *
 * O permalink do WP é `/AAAA/MM/DD/slug/` — 201 formatos distintos nos 207
 * posts, porque a data faz parte da URL. O site novo usa `/blog/slug`, então o
 * que casa é o **último segmento**, não o caminho inteiro.
 *
 * Devolve `null` para qualquer coisa que não seja um permalink de post: link
 * externo (112 hosts no corpus), página institucional do WP e âncora ficam como
 * estão — reescrevê-los às cegas mandaria o leitor para uma rota que não existe.
 */
export function caminhoDePost(url: string, slugsConhecidos: ReadonlySet<string>): string | null {
  let u: URL
  try {
    u = new URL(url, 'https://www.atra.com.br')
  } catch {
    return null
  }
  if (!u.hostname.endsWith('atra.com.br')) return null
  const m = u.pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/)
  if (!m) return null
  const slug = m[4]
  if (!slugsConhecidos.has(slug)) return null
  return `/blog/${slug}${u.hash}`
}

/**
 * Troca a URL dos nós `link` pelo que `mapear` devolver. Devolve quantos mudaram.
 *
 * ⚠️ `newTab` fica como está, de propósito. Link interno abrindo em aba nova é
 * esquisito, mas mudar isso é decisão editorial (D-22) e não é o que a migração
 * está fazendo aqui: o que **precisa** mudar é a URL, que depois do cutover
 * apontaria para uma rota que o site novo não serve.
 */
export function reescreverLinks(raiz: LexicalNode, mapear: (url: string) => string | null): number {
  let n = 0
  percorrer(raiz, (no) => {
    if (no.type !== 'link') return
    const campos = no.fields as { url?: string } | undefined
    if (!campos?.url) return
    const novo = mapear(campos.url)
    if (!novo || novo === campos.url) return
    campos.url = novo
    n++
  })
  return n
}

/**
 * `<a>` sem `href` vira texto comum.
 *
 * Um post do corpus tem `<a><span>https://www.statista.com/…</span></a>` — uma
 * citação de rodapé em que o autor escreveu a URL sem linkar. O conversor porta
 * isso fielmente, como um nó `link` sem `url`, e o resultado é um link que não
 * leva a lugar nenhum. Desfazer o nó preserva o texto e não inventa um destino
 * que o autor não escreveu.
 */
export function desfazerLinksSemUrl(raiz: LexicalNode): number {
  let n = 0
  percorrer(raiz, (pai) => {
    if (!pai.children?.length) return
    pai.children = pai.children.flatMap((filho) => {
      const semUrl = filho.type === 'link' && !(filho.fields as { url?: string } | undefined)?.url
      if (!semUrl) return [filho]
      n++
      return filho.children ?? []
    })
  })
  return n
}

/** Texto concatenado da árvore, para provar que o corpo não ficou vazio. */
function temTexto(raiz: LexicalNode): boolean {
  let achou = false
  percorrer(raiz, (n) => {
    if (n.type === 'text' && (n.text ?? '').trim()) achou = true
    if (n.type === 'upload') achou = true
  })
  return achou
}

/* ── Conversor ─────────────────────────────────────────────────────────────── */

export type Conversor = (html: string) => Convertido

/**
 * Config do editor tirada do **próprio campo** que vai receber o resultado.
 *
 * ⚠️ Não usar `editorConfigFactory.default({ config })`. Apesar do nome, ele
 * devolve o editor *padrão* do Lexical, e não o que a config do projeto montou:
 * a `EXPERIMENTAL_TableFeature` de `payload.config.ts` não entra, e a conversão
 * volta a produzir parágrafos soltos no lugar da tabela — exatamente o defeito
 * que o piloto de MIG-012 mandou corrigir, de volta e silencioso, porque a
 * retenção de texto continua 100%.
 *
 * Lendo do campo, o conversor usa por construção o mesmo editor do admin: se
 * alguém ligar uma feature nova em `posts.body`, a importação acompanha.
 */
function configDoEditor(cfg: SanitizedConfig): SanitizedServerEditorConfig {
  const colecao = cfg.collections.find((c) => c.slug === 'posts')
  const campo = colecao?.fields.find((f) => 'name' in f && f.name === 'body')
  if (!campo || campo.type !== 'richText') {
    throw new Error('[convert] não achei o campo richText `posts.body` na config do Payload.')
  }
  return editorConfigFactory.fromField({ field: campo })
}

/** Monta o conversor uma vez. A config do editor é cara e não muda entre posts. */
export async function criarConversor(opts: { slugsDePost?: ReadonlySet<string> } = {}): Promise<Conversor> {
  const editorConfig = configDoEditor(await config)
  const slugs = opts.slugsDePost ?? new Set<string>()

  return (html: string): Convertido => {
    const { root } = convertHTMLToLexical({ editorConfig, html, JSDOM })
    const raiz = root as unknown as RaizLexical

    if (!temTexto(raiz)) throw new CorpoVazio(`${html.length} chars de HTML entraram, nada saiu`)

    return {
      raiz,
      imagens: imagensPendentes(raiz),
      linksReescritos: reescreverLinks(raiz, (url) => caminhoDePost(url, slugs)),
      linksDesfeitos: desfazerLinksSemUrl(raiz),
    }
  }
}
