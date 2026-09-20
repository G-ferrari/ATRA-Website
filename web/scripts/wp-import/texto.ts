/* Texto vindo do WordPress: entidade HTML e resumo que não cabe no campo.
 *
 * Módulo à parte do importador porque o importador é um **script**: importar
 * `import-posts.ts` para testar uma função rodaria a importação inteira. */
import { JSDOM } from 'jsdom'

/** Máximo do campo `description` de `posts`. */
export const MAX_RESUMO = 220

const { window } = new JSDOM('')

/** Entidades HTML do WP (`&#8217;`, `&amp;`) viram o caractere. */
export function decodificar(html: string): string {
  const el = window.document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

/** Tira marcação, decodifica entidades e normaliza espaço. */
export function textoPuro(html: string): string {
  const el = window.document.createElement('div')
  el.innerHTML = html
  return decodificar(el.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * Corta no espaço, sem partir palavra, e fecha com reticências.
 *
 * ⚠️ **206 dos 207 resumos passam de 220 caracteres** (mediana 362), e eles não
 * são o começo do corpo: medido, só 2 coincidem — os outros 205 foram escritos.
 * Cortar perde texto autoral, e é a escolha certa mesmo assim: 220 é o limite do
 * campo, que existe porque o resumo alimenta o cartão e a descrição de busca, e
 * afrouxá-lo para caber o maior (448) enfraqueceria a regra para todo post novo.
 * O texto inteiro continua no WordPress; reescrever os que importam é do
 * marketing (D-22). Em `debito-tecnico.md`.
 */
export function encurtar(texto: string, max = MAX_RESUMO): string {
  const limpo = texto.replace(/\s*(\[\s*(…|\.\.\.)\s*\]|…|\.\.\.)\s*$/u, '').trim()
  if (limpo.length <= max) return limpo
  const corte = limpo.slice(0, max - 1)
  const espaco = corte.lastIndexOf(' ')
  return `${(espaco > max * 0.6 ? corte.slice(0, espaco) : corte).replace(/[,;:.\s]+$/, '')}…`
}
