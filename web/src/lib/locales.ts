/* D-07: português na raiz (sem prefixo), inglês em /en, com slugs traduzidos.
 * O código de locale é o mesmo do Payload — ver src/payload.config.ts. */

export const LOCALES = ['pt', 'en', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt'

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/** Prefixo de URL do idioma: PT fica na raiz, os demais ganham /<locale>. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

/** A etiqueta do idioma no `lang` do `<html>` e no `hreflang`. O português é o
 *  do Brasil; o espanhol é o neutro, para a América Latina (D-77), e por isso
 *  sem região: `es-419` só serviria se houvesse uma segunda versão espanhola. */
export const ETIQUETA_DO_IDIOMA: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es' }

/** O idioma das datas por extenso (`Intl.DateTimeFormat`). Inglês americano,
 *  como a tradução (`lib/traducao.ts`). */
export const FORMATO_DO_IDIOMA: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US', es: 'es' }
