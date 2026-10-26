import type { Mensagem } from '../chat'

/* As partes da busca (D-73) que não dependem de banco: o texto que vira a
 * pergunta e a lista de códigos que vai ao SQL. */

/**
 * O que se busca: a última mensagem do visitante, com a anterior dele na
 * frente. "E quanto tempo leva?" não acha nada sozinha; com "vocês fazem
 * migração para o BigQuery?" antes, acha o case certo.
 */
export function consultaDaConversa(mensagens: readonly Mensagem[]): string {
  return mensagens
    .filter((m) => m.role === 'user')
    .slice(-2)
    .map((m) => m.content.trim())
    .filter(Boolean)
    .join('\n')
    .slice(-2000)
}

/** A lista como um parâmetro só, no formato de array do Postgres (`{S12,C3}`).
 *  O código só tem letra, número e hífen (`S12`, `P-CONTATO`); o que fugir
 *  disso não é código do catálogo e fica de fora, em vez de ir ao SQL. */
export function comoLista(codigos: readonly string[]): string {
  return `{${codigos.filter((c) => /^[A-Z0-9-]+$/.test(c)).join(',')}}`
}
