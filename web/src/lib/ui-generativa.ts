/* Tokenizador da "UI generativa" do chat — porte de `legacy/src/pages/Chat.tsx:17`.
 *
 * O system prompt (global `atra-ai`, D-12) manda o modelo injetar tags
 * `[UI_SERVICE:…]`, `[UI_PARTNER:…]`, `[UI_CHART:…]` e `[UI_CONTACT]` no meio
 * da resposta, e o cliente as troca por cartões. Este módulo é só o recorte
 * texto→tokens; quem desenha é `chat/ui-generativa.tsx`.
 *
 * ⚠️ As regexes são as do legado, caractere a caractere — inclusive as
 * limitações: descrição de serviço não pode conter `:`; tag que o modelo variar
 * de formato começa com `[UI_` e não casa com nenhum padrão, e o legado a
 * **engole** em vez de mostrar (Chat.tsx:47). O débito "quebra silenciosamente
 * se o modelo variar o formato" está registrado em debito-tecnico.md e vem
 * junto no porte (D-15). */

export type TokenDeUi =
  | { tipo: 'texto'; texto: string }
  | { tipo: 'contato' }
  | { tipo: 'servico'; titulo: string; descricao: string; icone: string }
  | { tipo: 'parceiro'; nome: string }
  | { tipo: 'grafico'; grafico: string }

export function tokenizarUiGenerativa(texto: string): TokenDeUi[] {
  const partes = texto.split(/(\[UI_[A-Z]+(?:[^\]]*)?\])/g)
  const tokens: TokenDeUi[] = []

  for (const parte of partes) {
    /* O split com grupo de captura devolve `''` entre duas tags adjacentes. */
    if (parte === '') continue

    if (parte.startsWith('[UI_CONTACT]')) {
      tokens.push({ tipo: 'contato' })
      continue
    }

    if (parte.startsWith('[UI_SERVICE:')) {
      const m = parte.match(/\[UI_SERVICE:([^:]+):([^:]+)(?:(?:[:])([^\]]+))?\]/)
      if (m) {
        tokens.push({ tipo: 'servico', titulo: m[1], descricao: m[2], icone: m[3] || '' })
        continue
      }
    }

    if (parte.startsWith('[UI_PARTNER:')) {
      const m = parte.match(/\[UI_PARTNER:([^\]]+)\]/)
      if (m) {
        tokens.push({ tipo: 'parceiro', nome: m[1] })
        continue
      }
    }

    if (parte.startsWith('[UI_CHART:')) {
      const m = parte.match(/\[UI_CHART:([^\]]+)\]/)
      if (m) {
        tokens.push({ tipo: 'grafico', grafico: m[1] })
        continue
      }
    }

    if (parte.startsWith('[UI_')) continue

    tokens.push({ tipo: 'texto', texto: parte })
  }

  return tokens
}
