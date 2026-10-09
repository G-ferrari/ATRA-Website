/* Atribuição de campanha, para o RD Station (D-26; Marketing desde a D-54) — **opt-in desde D-30**.
 *
 * O formulário já grava `source` — o **caminho da página** onde o visitante
 * converteu. Isso responde "onde converteu", não "de onde veio", e é a segunda
 * pergunta que o RD precisa para dizer qual campanha pagou o lead.
 *
 * ⚠️ **Por que a sessão, e não a URL do envio.** Os parâmetros só existem na URL
 * de **chegada**: o visitante entra em `/?utm_source=linkedin`, navega, e
 * converte em `/contato`, cuja URL não tem nada. Ler `location.search` na hora
 * do envio devolveria vazio em quase todo lead real. Por isso a captura
 * acontece na chegada, no layout, e o formulário lê o que ficou guardado.
 *
 * ⚠️ **D-30 reclassificou: categoria marketing, atrás do banner.** A versão
 * anterior deste comentário argumentava que sessionStorage de primeira parte
 * ficava "abaixo da linha do consentimento" — mas o dado vai ao RD Station
 * junto do lead, e dado que viaja a terceiro pergunta primeiro. O arranjo:
 * a UTM da chegada espera em **memória de módulo** (não é armazenamento — nada
 * persiste nem sai da aba), e só toca o `sessionStorage` quando o consentimento
 * de marketing existe. A memória sobrevive à navegação client-side do App
 * Router e morre no hard reload — quem recarregar a página entre chegar e
 * aceitar perde a atribuição, e a perda é aceitável: o lead entra do mesmo
 * jeito, só sem campanha.
 *
 * ⚠️ **Primeiro toque vence.** Se já houver algo na sessão, uma segunda URL com
 * UTM não sobrescreve — o crédito fica com a campanha que trouxe a pessoa, não
 * com o último link que ela clicou dentro do site.
 *
 * ⚠️ **Sem JavaScript não há UTM**, e é aceito: o formulário é `<form action>`
 * de propósito, para funcionar com JS desligado (MIG-100). O lead entra
 * completo, só sem atribuição — a mesma degradação do `carimbo` do anti-spam.
 */

import { lerConsentimento } from './consentimento'

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

/* A UTM da chegada esperando o consentimento (D-30). Memória, não storage:
 * nada persiste nem sai da aba enquanto o visitante não responde ao banner. */
let utmDaChegada: Utm | null = null

/**
 * Captura a atribuição da chegada. Sem consentimento de marketing ela fica só
 * em memória; com ele, vai para a sessão (primeiro toque vence).
 *
 * ⚠️ Tudo dentro de `try`: `sessionStorage` **lança** em navegação privada de
 * alguns navegadores e quando o usuário bloqueia armazenamento. Perder a
 * atribuição é aceitável; derrubar o layout do site por causa dela, não.
 */
export function guardarUtm(busca: string): void {
  const chegada = utmDaQueryString(busca)
  if (Object.keys(chegada).length > 0 && !utmDaChegada) utmDaChegada = chegada

  if (lerConsentimento()?.marketing) efetivarUtmSeConsentido()
}

/** Move a UTM da memória para a sessão — chamada na chegada (se o cookie já
 * autoriza) e quando o aceite de marketing chega depois dela. */
export function efetivarUtmSeConsentido(): void {
  if (!utmDaChegada) return
  if (!lerConsentimento()?.marketing) return
  try {
    if (sessionStorage.getItem(CHAVE_DE_SESSAO)) return
    sessionStorage.setItem(CHAVE_DE_SESSAO, JSON.stringify(utmDaChegada))
  } catch {
    // Sem armazenamento, o lead entra sem atribuição. Ver a nota do topo.
  }
}

/** Revogação de marketing: o que estava guardado sai. A memória fica — se a
 * pessoa reconsentir na mesma visita, a atribuição da chegada ainda vale. */
export function limparUtmGuardado(): void {
  try {
    sessionStorage.removeItem(CHAVE_DE_SESSAO)
  } catch {
    // nada a limpar onde não há armazenamento
  }
}

/** Só para teste: zera a memória de módulo entre casos. */
export function esquecerUtmDaChegada(): void {
  utmDaChegada = null
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
