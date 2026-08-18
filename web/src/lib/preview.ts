import { DEFAULT_LOCALE, type Locale } from './locales'
import { hrefDe, type Secao } from './routes'

/* Endereços do modo rascunho (D-20).
 *
 * O editor precisa ver como ficou antes de publicar. Sem isto, "publique só com
 * o conteúdo completo" é um pedido sem ferramenta: a única forma de conferir
 * seria publicar e olhar. */

export const ROTA_DE_PREVIEW = '/api/preview'

/** Onde o documento aparece no site, com a URL pública correta do idioma. */
export function caminhoPublico(secao: Secao, locale: Locale, slug?: string): string {
  return hrefDe(secao, locale, slug)
}

/**
 * URL que liga o modo rascunho e cai na página.
 *
 * Mora sob `/api/`, que o `proxy.ts` já deixa passar sem reescrever para
 * `/pt/...` — uma rota de preview em qualquer outro lugar viraria 404.
 */
export function urlDePreview({
  secao,
  slug,
  locale = DEFAULT_LOCALE,
  base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
}: {
  secao: Secao
  slug?: string
  locale?: Locale
  base?: string
}): string {
  const url = new URL(ROTA_DE_PREVIEW, base)
  url.searchParams.set('caminho', caminhoPublico(secao, locale, slug))
  return url.toString()
}
