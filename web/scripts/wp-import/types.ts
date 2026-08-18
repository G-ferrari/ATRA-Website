/* Formas mínimas do que a API do WordPress e o Lexical devolvem.
 * Suficiente para os scripts de importação; não é contrato de aplicação. */

export type WpPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  content: { rendered: string }
}

export type LexicalNode = {
  type: string
  text?: string
  tag?: string
  format?: number | string
  fields?: Record<string, unknown>
  children?: LexicalNode[]
}

export type ContagemPorTipo = Record<string, number>

/** Texto concatenado de uma subárvore. */
export function textoDe(node: LexicalNode | undefined): string {
  if (!node) return ''
  if (node.type === 'text') return node.text ?? ''
  return (node.children ?? []).map(textoDe).join('')
}

/** Quantos nós de cada tipo existem na subárvore. */
export function tiposDe(node: LexicalNode, acc: ContagemPorTipo = {}): ContagemPorTipo {
  for (const filho of node.children ?? []) {
    acc[filho.type] = (acc[filho.type] ?? 0) + 1
    tiposDe(filho, acc)
  }
  return acc
}

/** Normaliza espaço para comparar texto de origem e destino. */
export function limparTexto(s: string): string {
  return s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
}

/** ⚠️ A API do WP responde 302 sem user-agent de browser. */
export const WP_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
export const WP_API = 'https://www.atra.com.br/wp-json/wp/v2'
