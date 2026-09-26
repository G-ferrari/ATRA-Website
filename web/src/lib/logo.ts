/* Tamanho ótico de logo de parceiro.
 *
 * Numa caixa fixa, preencher a caixa (`object-contain`) deixa o logo compacto
 * gigante ao lado do comprido: o IBM (2,5:1) ocupava a altura inteira e o
 * Google Cloud (6,3:1) virava um risco. Igualar a **área** faz os dois pesarem
 * o mesmo — o comprido usa a largura, o compacto fica mais alto e mais estreito.
 *
 * ⚠️ Pressupõe arquivo recortado rente ao logo. A proporção sai do arquivo, e
 * margem transparente conta como logo: o Google Cloud original era 86% margem e
 * aparecia a um sétimo do tamanho dos outros.
 *
 * O `logoScale` do cadastro deixa de compensar a margem e vira ajuste fino
 * sobre a área. */

/** O logo mais comprido da casa (Google Cloud, Databricks) usa a largura inteira. */
const PROPORCAO_DE_REFERENCIA = 6

const AREA = { sm: 0.7, md: 1, lg: 1.4 } as const

export type EscalaDeLogo = keyof typeof AREA

/** Largura do logo como fração da caixa, de 0 a 1. `alturaSobreLargura` é a
 *  proporção da caixa: o logo nunca passa da altura dela. */
export function larguraOtica(
  logo: { width: number; height: number },
  escala: EscalaDeLogo,
  alturaSobreLargura: number,
): number {
  const proporcao = logo.width / logo.height
  const pelaArea = Math.sqrt((proporcao / PROPORCAO_DE_REFERENCIA) * AREA[escala])
  return Math.min(1, pelaArea, alturaSobreLargura * proporcao)
}

/** A mesma largura, pronta para `style.width`. */
export function larguraOticaCss(...args: Parameters<typeof larguraOtica>): string {
  return `${(larguraOtica(...args) * 100).toFixed(1)}%`
}
