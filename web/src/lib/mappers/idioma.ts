import type { Locale } from '../locales'

/* Quando um documento **existe** num idioma (D-69): tem slug gravado naquele
 * idioma, lido com `fallbackLocale: false`. A regra é a mesma das listagens do
 * site, que a aplicam no banco (`ondeExisteNoIdioma`, em `../existe-no-idioma`
 * — o porquê está lá). Aqui ela está escrita para quem já tem os dois idiomas
 * em mãos: o catálogo da ATRA AI (D-60), que lê o português e o inglês sem
 * fallback para montar o cartão. */

/** O mesmo documento nos dois idiomas; `en` vem com `fallbackLocale: false`. */
export type Par<T> = { pt: T; en?: T | null }

/** O slug do documento no idioma, ou `null` quando ele não existe nesse idioma. */
export function slugNoIdioma(par: Par<{ slug?: string | null }>, locale: Locale): string | null {
  const doIdioma = locale === 'pt' ? par.pt : par.en
  return doIdioma?.slug?.trim() || null
}
