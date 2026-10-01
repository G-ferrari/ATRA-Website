/* "Relatórios" vira "ATRA na mídia" (01/10) — a regra de troca da migração
 * `20261001_120000_relatorios_vira_atra_na_midia`, separada dela para ter teste.
 *
 * Troca duas coisas no conteúdo gravado no CMS, e só elas:
 * - o **nome**, onde ele é rótulo de menu ou de categoria (`label`,
 *   `category`) e é exatamente "Relatórios" ou "Reports";
 * - o **destino** (`href` e afins) que aponta para `/relatorios`.
 *
 * ⚠️ Não mexe em frase: "relatórios de mercado" no meio de uma descrição é
 * texto de marketing (D-22), e fica para quem edita. */

const NOMES: Record<string, string> = { Relatórios: 'ATRA na mídia', Reports: 'ATRA in the media' }
const CAMPOS_DE_NOME = new Set(['label', 'category'])
const CAMPOS_DE_DESTINO = new Set(['href', 'ctaHref', 'secondaryHref'])

const ANTIGO = '/relatorios'
const NOVO = '/atra-na-midia'

function destino(valor: string): string {
  if (valor === ANTIGO) return NOVO
  return valor.startsWith(`${ANTIGO}/`) || valor.startsWith(`${ANTIGO}?`) || valor.startsWith(`${ANTIGO}#`)
    ? NOVO + valor.slice(ANTIGO.length)
    : valor
}

/** Devolve uma cópia com o nome e o destino trocados; o original não muda. */
export function comAtraNaMidia<T>(valor: T): T {
  if (Array.isArray(valor)) return valor.map(comAtraNaMidia) as T
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor).map(([campo, v]) => {
        if (typeof v === 'string' && CAMPOS_DE_NOME.has(campo) && NOMES[v]) return [campo, NOMES[v]]
        if (typeof v === 'string' && CAMPOS_DE_DESTINO.has(campo)) return [campo, destino(v)]
        return [campo, comAtraNaMidia(v)]
      }),
    ) as T
  }
  return valor
}

/** Há o que trocar? Evita gravar (e criar versão) onde nada mudaria. */
export const mudaAlgo = (valor: unknown) => JSON.stringify(comAtraNaMidia(valor)) !== JSON.stringify(valor)
