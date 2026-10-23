import type { MetadataRoute } from 'next'

import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales'
import { slugNoIdioma } from './mappers/idioma'
import { caminhoDe, ORIGEM, type Local } from './seo'

/* Montagem do sitemap (MIG-106). A consulta ao banco fica em `app/sitemap.ts`;
 * aqui está a parte que decide o que entra, que é onde há regra. */

export type Entrada = {
  local: Local
  /** ISO 8601 da última alteração, quando o documento tem. */
  atualizadoEm?: string | null
  prioridade?: number
  /** `false` deixa a URL inglesa de fora — ver `temIngles`. */
  ingles?: boolean
  /** O slug do documento no inglês, que pode não ser o do português (D-07).
   *  Sem ele, a URL inglesa sai com o slug do `local`. Ver `versaoInglesa`. */
  slugIngles?: string
}

/**
 * Um documento só conta como traduzido quando o inglês **existe e é diferente**
 * do português.
 *
 * ⚠️ As duas metades importam, e cada uma cobre um caso real. Os 207 artigos
 * do WordPress entraram só em português, mas **têm linha em `en`** — o slug
 * precisa existir nos dois idiomas ou `/en/blog/<slug>` dá 404 (a consulta bate
 * na coluna do locale, e `fallback` resolve leitura, não busca). Então "existe
 * linha em inglês" não prova tradução nenhuma. E os 4 cases, que vieram do
 * protótipo e não do WordPress, têm em `en` o **mesmo texto português** — o
 * legado traduz navegação, não conteúdo (P-08).
 *
 * Anunciar no sitemap uma URL inglesa que serve português é pedir para o Google
 * indexar conteúdo no idioma errado. Na dúvida a regra exclui, que é o erro
 * barato: URL de fora do sitemap continua sendo descoberta por link.
 */
export function temIngles(pt: string | null | undefined, en: string | null | undefined): boolean {
  const a = (pt ?? '').trim()
  const b = (en ?? '').trim()
  return b.length > 0 && b !== a
}

/**
 * Se um documento entra no sitemap em inglês, e com que slug.
 *
 * Duas condições, e as duas são necessárias. Traduzido (`temIngles`), para
 * não anunciar português como inglês. E com slug gravado no inglês (D-69),
 * que é o endereço: até 23/10 a URL inglesa saía com o slug **português**, e
 * as três que o sitemap da homologação anunciava davam 404 — dois segmentos e
 * a Customer 360, renomeados só no português, com o inglês ainda no slug
 * antigo.
 */
export function versaoInglesa(
  pt: { texto?: string | null },
  en: { texto?: string | null; slug?: string | null } | null | undefined,
): Pick<Entrada, 'ingles' | 'slugIngles'> {
  const slug = slugNoIdioma({ pt: {}, en }, 'en')
  return slug && temIngles(pt.texto, en?.texto) ? { ingles: true, slugIngles: slug } : { ingles: false }
}

export function paraSitemap(entradas: Entrada[]): MetadataRoute.Sitemap {
  return entradas.flatMap((e) => {
    const idiomas: Locale[] = e.ingles === false ? [DEFAULT_LOCALE] : [...LOCALES]
    const localEm = (locale: Locale): Local =>
      locale !== DEFAULT_LOCALE && e.slugIngles && 'secao' in e.local ? { ...e.local, slug: e.slugIngles } : e.local
    const url = (locale: Locale) => `${ORIGEM}${caminhoDe(localEm(locale), locale)}`

    return idiomas.map((locale) => ({
      url: url(locale),
      lastModified: e.atualizadoEm ? new Date(e.atualizadoEm) : undefined,
      priority: e.prioridade,
      /* `alternates` só lista o que de fato existe naquele idioma: com uma
       * entrada só, declarar um par seria a mesma mentira que a URL solta. */
      alternates:
        idiomas.length > 1
          ? { languages: Object.fromEntries(idiomas.map((l) => [l === 'pt' ? 'pt-BR' : l, url(l)])) }
          : undefined,
    }))
  })
}
