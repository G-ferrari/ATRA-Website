/* Formas mínimas do que a API do WordPress e o Lexical devolvem.
 * Suficiente para os scripts de importação; não é contrato de aplicação. */

/** Texto que o WP devolve já renderizado (com entidades HTML). */
export type WpRendered = { rendered: string }

/* ⚠️ Só `id`, `slug`, `date`, `title` e `content` são obrigatórios porque os
 * scripts pedem `_fields=…` para não trafegar 2,5 MB à toa — e o WP **omite** o
 * que não foi pedido em vez de devolver vazio. Marcar o resto como opcional
 * força quem consome a lembrar de incluir o campo no `_fields`. */
export type WpPost = {
  id: number
  slug: string
  date: string
  title: WpRendered
  content: WpRendered
  modified?: string
  status?: string
  /** URL pública no WP — é a origem dos redirects de MIG-086. */
  link?: string
  excerpt?: WpRendered
  /** id em `media`; 0 quando o post não tem imagem destacada. */
  featured_media?: number
  categories?: number[]
  tags?: number[]
  author?: number
}

/** As 6 vagas são páginas comuns, não um CPT (P-02 respondida por evidência). */
export type WpPage = {
  id: number
  slug: string
  date: string
  title: WpRendered
  content: WpRendered
  modified?: string
  status?: string
  link?: string
  excerpt?: WpRendered
  featured_media?: number
  /** id da página-mãe; 0 na raiz. Define a hierarquia de URL do WP. */
  parent?: number
  menu_order?: number
}

export type WpMedia = {
  id: number
  slug: string
  date: string
  title: WpRendered
  /** Arquivo original. As variantes vivem em `media_details.sizes`. */
  source_url: string
  /** ⚠️ Costuma vir vazio: o WP guarda `alt_text` só se alguém preencheu. */
  alt_text?: string
  caption?: WpRendered
  description?: WpRendered
  mime_type?: string
  media_type?: string
  media_details?: {
    width?: number
    height?: number
    file?: string
    sizes?: Record<string, { file?: string; width?: number; height?: number; source_url?: string }>
  }
  /** id do post que subiu o arquivo; 0 quando solto na biblioteca. */
  post?: number
}

export type WpTerm = {
  id: number
  slug: string
  name: string
  count?: number
  parent?: number
  description?: string
  taxonomy?: string
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
