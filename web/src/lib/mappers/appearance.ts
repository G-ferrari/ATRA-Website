import type { Appearance } from '@/payload-types'
import type { Aparencia } from '@/types/content'

/** O peso de cada opção do admin (#215, D-65).
 *
 * Negrito é 600, e não 700: o mesmo controle vale do título de cartão (18 px)
 * ao da abertura da home (72 px), e a Mona Sans a 700 nesse tamanho fecha os
 * vãos das letras. 600 já lê como negrito em toda a faixa. */
export const PESO_DOS_TITULOS = { bold: 600, normal: 400, light: 300 } as const

/** Mapper do global `appearance`. Global ainda não salvo (ou opção fora da
 *  lista) cai no Fino, que é o desenho original. */
export function toAparencia(doc: Pick<Appearance, 'headingWeight'>): Aparencia {
  const peso = PESO_DOS_TITULOS[doc.headingWeight as keyof typeof PESO_DOS_TITULOS]
  return { pesoDosTitulos: peso ?? PESO_DOS_TITULOS.light }
}
