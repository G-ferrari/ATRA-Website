import type { MetadataRoute } from 'next'

import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales'
import { slugNoIdioma, type Par } from './mappers/idioma'
import { caminhoDe, hreflangDe, ORIGEM, type Local, type SlugsPorIdioma } from './seo'

/* Montagem do sitemap (MIG-106). A consulta ao banco fica em `app/sitemap.ts`;
 * aqui está a parte que decide o que entra, que é onde há regra. */

export type Entrada = {
  local: Local
  /** ISO 8601 da última alteração, quando o documento tem. */
  atualizadoEm?: string | null
  prioridade?: number
  /** Página de item: o slug em cada idioma em que ela tem versão (`versoesDe`).
   *  Sem isto, a rota existe em todos os idiomas, com o caminho de `routes.ts`. */
  versoes?: SlugsPorIdioma
}

/**
 * Um documento só conta como traduzido quando o texto do idioma **existe e é
 * diferente** do português.
 *
 * ⚠️ As duas metades importam, e cada uma cobre um caso real. Os 207 artigos
 * do WordPress entraram só em português, mas **têm linha em `en`** — o slug
 * precisa existir nos dois idiomas ou `/en/blog/<slug>` dá 404 (a consulta bate
 * na coluna do locale, e `fallback` resolve leitura, não busca). Então "existe
 * linha no idioma" não prova tradução nenhuma. E os 4 cases, que vieram do
 * protótipo e não do WordPress, têm em `en` o **mesmo texto português** — o
 * legado traduz navegação, não conteúdo (P-08). O espanhol nasce do mesmo jeito
 * (D-77): o slug é copiado do português antes da tradução.
 *
 * ⚠️ No espanhol a regra erra mais para o lado seguro: título que se escreve
 * igual nas duas línguas ("Analytics Conversacional", "Data Mesh") deixa a
 * página traduzida fora do sitemap espanhol. Ela continua sendo descoberta por
 * link — é o erro barato.
 *
 * Anunciar no sitemap uma URL que serve português é pedir para o Google
 * indexar conteúdo no idioma errado. Na dúvida a regra exclui.
 */
export function temTraducao(pt: string | null | undefined, outro: string | null | undefined): boolean {
  const a = (pt ?? '').trim()
  const b = (outro ?? '').trim()
  return b.length > 0 && b !== a
}

/**
 * O slug de um documento em cada idioma em que ele tem versão, para o sitemap e
 * para o `hreflang` da página dele (`metadataDe`).
 *
 * Duas condições para um idioma entrar, e as duas são necessárias. Traduzido
 * (`temTraducao`), para não anunciar português como outro idioma. E com slug
 * gravado no idioma (D-69), que é o endereço: até 23/10 a URL inglesa saía com
 * o slug **português**, e as três que o sitemap da homologação anunciava davam
 * 404 — dois segmentos e a Customer 360, renomeados só no português, com o
 * inglês ainda no slug antigo.
 *
 * ⚠️ É de propósito a regra do sitemap, e não a das listagens
 * (`ondeExisteNoIdioma`). As duas declaram ao Google as versões de idioma de
 * uma URL e não podem se contradizer: o sitemap dizer que `/blog/x` não tem
 * inglês enquanto a página declara `/en/blog/x` é sinal trocado, e a URL
 * inglesa que serve português continua sendo indexação no idioma errado
 * (`seo-e-redirects.md`: página sem tradução não ganha `hreflang`). Que o item
 * abra no idioma é outra pergunta, que a listagem responde.
 */
export function versoesDe(par: Par<{ slug?: string | null; texto?: string | null }>): SlugsPorIdioma {
  const versoes: SlugsPorIdioma = {}
  const pt = slugNoIdioma(par, DEFAULT_LOCALE)
  if (pt) versoes[DEFAULT_LOCALE] = pt
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    const slug = slugNoIdioma(par, locale)
    if (slug && temTraducao(par.pt.texto, par[locale]?.texto)) versoes[locale] = slug
  }
  return versoes
}

export function paraSitemap(entradas: Entrada[]): MetadataRoute.Sitemap {
  return entradas.flatMap((e) => {
    const versoes = e.versoes
    const idiomas: Locale[] = versoes ? LOCALES.filter((l) => versoes[l]) : [...LOCALES]
    const localEm = (locale: Locale): Local =>
      versoes && 'secao' in e.local ? { ...e.local, slug: versoes[locale] } : e.local
    const url = (locale: Locale) => `${ORIGEM}${caminhoDe(localEm(locale), locale)}`

    return idiomas.map((locale) => ({
      url: url(locale),
      lastModified: e.atualizadoEm ? new Date(e.atualizadoEm) : undefined,
      priority: e.prioridade,
      /* `alternates` só lista o que de fato existe naquele idioma: com uma
       * entrada só, declarar um par seria a mesma mentira que a URL solta. */
      alternates:
        idiomas.length > 1
          ? { languages: Object.fromEntries(idiomas.map((l) => [hreflangDe(l), url(l)])) }
          : undefined,
    }))
  })
}
