import { DEFAULT_LOCALE, type Locale } from './locales'

/* Caminhos de seção por idioma (D-07: `/sobre` → `/en/about`).
 *
 * O App Router tem um nome de pasta só, então o sistema de arquivos usa o
 * caminho em português — o idioma padrão — e o `proxy.ts` reescreve o alias em
 * inglês para ele. Quem monta link usa `hrefDe()` e nunca escreve caminho na mão.
 *
 * Cresce a cada rota portada na Fase 3. */
export const SECOES = {
  cases: { pt: 'cases-de-sucesso', en: 'success-stories' },
  // A página ainda não existe (Fase 3); o legado já linka para cá e o link
  // está quebrado lá também. Centralizado aqui para não nascer na mão.
  contato: { pt: 'contato', en: 'contact' },
  glossario: { pt: 'glossario', en: 'glossary' },
  relatorios: { pt: 'relatorios', en: 'reports' },
  ebooks: { pt: 'ebooks', en: 'ebooks' },
  webinars: { pt: 'webinars', en: 'webinars' },
  blog: { pt: 'blog', en: 'blog' },
  sobre: { pt: 'sobre', en: 'about' },
  carreiras: { pt: 'carreiras', en: 'careers' },
  consultores: { pt: 'consultores', en: 'consultants' },
  parceiros: { pt: 'parceiros', en: 'partners' },
} as const satisfies Record<string, Record<Locale, string>>

export type Secao = keyof typeof SECOES

/** Segmento canônico usado no sistema de arquivos (sempre o do idioma padrão). */
export function segmentoCanonico(secao: Secao): string {
  return SECOES[secao][DEFAULT_LOCALE]
}

/** URL pública de uma seção, ou de um documento dentro dela. */
export function hrefDe(secao: Secao, locale: Locale, slug?: string): string {
  const prefixo = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  const segmento = SECOES[secao][locale]
  return slug ? `${prefixo}/${segmento}/${slug}` : `${prefixo}/${segmento}`
}

/** Alias localizado → segmento canônico. Usado pelo proxy. */
export function canonizarSegmento(segmento: string, locale: Locale): string | null {
  for (const secao of Object.keys(SECOES) as Secao[]) {
    if (SECOES[secao][locale] === segmento) return segmentoCanonico(secao)
  }
  return null
}

/**
 * Segmento canônico acessado num idioma que tem alias próprio — ex.:
 * `/en/cases-de-sucesso`. Devolve o alias correto para redirecionar, evitando
 * duas URLs servindo o mesmo conteúdo.
 */
export function aliasEsperado(segmento: string, locale: Locale): string | null {
  if (locale === DEFAULT_LOCALE) return null
  for (const secao of Object.keys(SECOES) as Secao[]) {
    if (segmentoCanonico(secao) === segmento && SECOES[secao][locale] !== segmento) {
      return SECOES[secao][locale]
    }
  }
  return null
}
