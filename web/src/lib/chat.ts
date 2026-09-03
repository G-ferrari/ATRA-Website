/* Os tetos da conversa com a ATRA AI (MIG-141).
 *
 * O limite por IP e o teto diário (D-12, MIG-110) contam **requisições** — e
 * sem isto aqui, uma requisição podia carregar qualquer volume: quinhentas
 * mensagens de cem mil caracteres passavam pela cota "educada" de 20/hora e
 * viravam custo de token no Gemini. O orçamento protege a quantidade de
 * chamadas; estes tetos protegem o tamanho de cada uma.
 *
 * Validação estrutural junto: `role` fora de user/model e conteúdo que não é
 * string eram repassados ao modelo como viessem.
 */

export type Mensagem = { role: 'user' | 'model'; content: string }

/* O que uma conversa real usa, com folga. A ilha de chat manda o histórico
 * inteiro a cada envio, então o corte de histórico é **silencioso** — conversa
 * longa continua funcionando, só o começo dela sai do contexto. Mensagem
 * individual grande demais é outra coisa: recusa, porque não é uso real. */
export const MAX_MENSAGENS = 12
export const MAX_CHARS_POR_MENSAGEM = 2000
export const MAX_TOKENS_DE_SAIDA = 1024

type Resultado = { ok: true; mensagens: Mensagem[] } | { ok: false }

/* MIG-149 (D-29) — o recorte da conversa que acompanha o lead do chat.
 *
 * ⚠️ Só mensagens **do visitante**, nunca a resposta do modelo: é o combinado
 * de P-20 — a conversa não persiste; o que vai ao banco é o que o titular
 * digitou e envia conscientemente junto do formulário. A ilha monta o recorte
 * com isto e a action corta de novo no servidor, porque quem posta não é
 * obrigado a ser o nosso JavaScript. */
export const MAX_MENSAGENS_DO_CONTEXTO = 5
export const MAX_CHARS_POR_CONTEXTO = 500

export function contextoDoLead(mensagens: Mensagem[]): string {
  return mensagens
    .filter((m) => m.role === 'user')
    .slice(-MAX_MENSAGENS_DO_CONTEXTO)
    .map((m) => m.content.trim().slice(0, MAX_CHARS_POR_CONTEXTO))
    .filter(Boolean)
    .join('\n')
}

export function validarConversa(entrada: unknown): Resultado {
  if (!Array.isArray(entrada) || entrada.length === 0) return { ok: false }

  const mensagens: Mensagem[] = []
  for (const item of entrada) {
    if (typeof item !== 'object' || item === null) return { ok: false }
    const { role, content } = item as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'model') return { ok: false }
    if (typeof content !== 'string' || content.trim() === '') return { ok: false }
    if (content.length > MAX_CHARS_POR_MENSAGEM) return { ok: false }
    mensagens.push({ role, content })
  }

  return { ok: true, mensagens: mensagens.slice(-MAX_MENSAGENS) }
}
