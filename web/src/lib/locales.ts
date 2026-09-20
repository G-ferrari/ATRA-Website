/* D-07: português na raiz (sem prefixo), inglês em /en, com slugs traduzidos.
 * O código de locale é o mesmo do Payload — ver src/payload.config.ts. */

export const LOCALES = ['pt', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt'

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/** Prefixo de URL do idioma: PT fica na raiz, os demais ganham /<locale>. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}
