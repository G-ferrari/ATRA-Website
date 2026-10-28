import { LOCALES, type Locale } from '../locales'

/* Quando um documento **existe** num idioma (D-69): tem slug gravado naquele
 * idioma, lido com `fallbackLocale: false`. A regra é a mesma das listagens do
 * site, que a aplicam no banco (`ondeExisteNoIdioma`, em `../existe-no-idioma`
 * — o porquê está lá). Aqui ela está escrita para quem já tem os dois idiomas
 * em mãos: o catálogo da ATRA AI (D-60), que lê o português e o inglês sem
 * fallback para montar o cartão. */

/** O mesmo documento em português e nos outros idiomas, estes lidos com
 *  `fallbackLocale: false`. O nome ficou de quando eram dois (D-77). */
export type Par<T> = { pt: T } & Partial<Record<Exclude<Locale, 'pt'>, T | null>>

/** O slug do documento no idioma, ou `null` quando ele não existe nesse idioma. */
export function slugNoIdioma(par: Par<{ slug?: string | null }>, locale: Locale): string | null {
  const doIdioma = par[locale]
  return doIdioma?.slug?.trim() || null
}

/**
 * Um documento lido com `locale: 'all'` vira o par de todos os idiomas, com o slug
 * e o texto que diz se o inglês é tradução (`temIngles`, no sitemap).
 *
 * Com `locale: 'all'` o Payload devolve cada campo localizado como objeto por
 * idioma — `{ pt: '…', en: '…' }` — só com o que está **gravado**: sem
 * fallback, idioma ausente é chave ausente. É o que deixa ler os dois idiomas
 * numa consulta só. Campo não localizado chega como valor simples e vale para
 * os dois.
 */
export function parDeTodosOsIdiomas(
  documento: object,
  campoDeTexto: string,
): Par<{ slug: string | null; texto: string | null }> {
  /* Os tipos gerados descrevem a leitura num idioma (`slug: string`); com
     `locale: 'all'` o formato é outro, e só este mapper o conhece. */
  const doc = documento as Record<string, unknown>
  const ler = (valor: unknown, locale: Locale): string | null => {
    if (typeof valor === 'string') return valor
    if (valor && typeof valor === 'object') {
      const doIdioma = (valor as Partial<Record<Locale, unknown>>)[locale]
      return typeof doIdioma === 'string' ? doIdioma : null
    }
    return null
  }
  const em = (locale: Locale) => ({ slug: ler(doc.slug, locale), texto: ler(doc[campoDeTexto], locale) })
  return Object.fromEntries(LOCALES.map((l) => [l, em(l)])) as Par<{ slug: string | null; texto: string | null }>
}
