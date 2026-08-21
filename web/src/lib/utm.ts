/* Atribuição de campanha, para o RD Station CRM (D-26).
 *
 * O formulário já grava `source` — o **caminho da página** onde o visitante
 * converteu. Isso responde "onde converteu", não "de onde veio", e é a segunda
 * pergunta que o CRM precisa para dizer qual campanha pagou o lead.
 *
 * ⚠️ **Por que a sessão, e não a URL do envio.** Os parâmetros só existem na URL
 * de **chegada**: o visitante entra em `/?utm_source=linkedin`, navega, e
 * converte em `/contato`, cuja URL não tem nada. Ler `location.search` na hora
 * do envio devolveria vazio em quase todo lead real. Por isso a captura
 * acontece na chegada, no layout, e o formulário lê o que ficou guardado.
 *
 * ⚠️ **Primeiro toque vence.** Se já houver algo na sessão, uma segunda URL com
 * UTM não sobrescreve — o crédito fica com a campanha que trouxe a pessoa, não
 * com o último link que ela clicou dentro do site.
 *
 * ⚠️ `sessionStorage` e não cookie nem `localStorage`: morre quando a aba
 * fecha, não atravessa sessões e não é lido por terceiro. Atribuição de uma
 * visita é o que o CRM precisa, e é o mínimo de dado que resolve — o resto
 * seria rastreamento com outro nome, e aí entra consentimento (P-14).
 *
 * ⚠️ **Sem JavaScript não há UTM**, e é aceito: o formulário é `<form action>`
 * de propósito, para funcionar com JS desligado (MIG-100). O lead entra
 * completo, só sem atribuição — a mesma degradação do `carimbo` do anti-spam.
 */

export const CHAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type ChaveUtm = (typeof CHAVES_UTM)[number]
export type Utm = Partial<Record<ChaveUtm, string>>

/** Onde a atribuição espera entre a chegada e a conversão. */
export const CHAVE_DE_SESSAO = 'atra:utm'

/* ⚠️ Teto por valor. A query string é escrita por quem clica no link, e nada
 * impede um `utm_campaign` de 8 KB — o campo é `text` no Postgres e aceitaria.
 * 200 cabe qualquer nome de campanha real e fecha a porta. */
export const MAX_POR_VALOR = 200

/** Extrai os cinco parâmetros de uma query string. Chave ausente ou vazia fica de fora. */
export function utmDaQueryString(busca: string): Utm {
  const parametros = new URLSearchParams(busca)
  const encontrado: Utm = {}

  for (const chave of CHAVES_UTM) {
    const valor = parametros.get(chave)?.trim()
    if (valor) encontrado[chave] = valor.slice(0, MAX_POR_VALOR)
  }

  return encontrado
}

/**
 * Guarda a atribuição da chegada, se houver alguma e se a sessão ainda estiver
 * vazia (primeiro toque vence).
 *
 * ⚠️ Tudo dentro de `try`: `sessionStorage` **lança** em navegação privada de
 * alguns navegadores e quando o usuário bloqueia armazenamento. Perder a
 * atribuição é aceitável; derrubar o layout do site por causa dela, não.
 */
export function guardarUtm(busca: string): void {
  const chegada = utmDaQueryString(busca)
  if (Object.keys(chegada).length === 0) return

  try {
    if (sessionStorage.getItem(CHAVE_DE_SESSAO)) return
    sessionStorage.setItem(CHAVE_DE_SESSAO, JSON.stringify(chegada))
  } catch {
    // Sem armazenamento, o lead entra sem atribuição. Ver a nota do topo.
  }
}

/** O que a chegada guardou, para o formulário mandar junto. */
export function lerUtmGuardado(): Utm {
  try {
    const cru = sessionStorage.getItem(CHAVE_DE_SESSAO)
    if (!cru) return {}

    /* Só as chaves conhecidas voltam: o valor vem de `sessionStorage`, que o
     * próprio visitante consegue editar no console. */
    const lido = JSON.parse(cru) as Record<string, unknown>
    const limpo: Utm = {}
    for (const chave of CHAVES_UTM) {
      const valor = lido[chave]
      if (typeof valor === 'string' && valor) limpo[chave] = valor.slice(0, MAX_POR_VALOR)
    }
    return limpo
  } catch {
    return {}
  }
}
