import type { Metadata } from 'next'

import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales'
import { hrefDe, type Secao } from './routes'
import type { Seo } from '@/types/content'

/**
 * Página magra não é indexável (D-08).
 *
 * A regra vale para artigo, vaga e material rico: enquanto o corpo estiver
 * vazio, a página existe para quem tem o link e é invisível para busca. Página
 * magra não prejudica só a si — prejudica o domínio inteiro.
 *
 * `follow: true` de propósito: o robô não indexa a página, mas segue os links
 * dela, então o que estiver linkado ali continua sendo descoberto.
 *
 * ⚠️ Vivia repetida em quatro `generateMetadata`. Virou função quando a Fase 4b
 * levou embora as fixtures que a testavam: os 6 posts do protótipo estavam sem
 * corpo **de propósito**, e o `smoke.spec.ts` provava a regra neles. Com os 207
 * artigos reais importados não existe mais página sem corpo no banco, e a
 * asserção passaria a depender de qual banco rodou o teste. Aqui ela é testável
 * sem banco nenhum.
 */
export function robotsDeCorpo(corpo: unknown): Metadata['robots'] {
  return corpo ? undefined : { index: false, follow: true }
}

/**
 * Origem pública do site, para URL absoluta em canônica e Open Graph.
 *
 * ⚠️ Canônica **precisa** ser absoluta. Relativa, o Google resolve contra o
 * domínio que serviu a página — e durante o cutover são dois (staging e
 * `atra.com.br`), o que faria staging declarar-se canônica de si mesma e
 * competir com produção pelo mesmo conteúdo.
 *
 * `NEXT_PUBLIC_` é seguro aqui: é a URL do site, não segredo. A regra que o CI
 * aplica proíbe o prefixo junto de `KEY`, `SECRET`, `TOKEN` e `PASSWORD`.
 */
export const ORIGEM = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** Onde a página vive. `secao` monta a URL nos dois idiomas; `caminho` é para a raiz. */
export type Local = { secao: Secao; slug?: string } | { caminho: string }

/**
 * Caminho da página num idioma. Exportado porque o sitemap monta as mesmas
 * URLs — e URL montada em dois lugares diverge: a canônica saía `/` e o sitemap
 * saía sem a barra, o que para o Google são dois endereços.
 */
export function caminhoDe(local: Local, locale: Locale): string {
  if ('caminho' in local) {
    const prefixo = locale === DEFAULT_LOCALE ? '' : `/${locale}`
    return `${prefixo}${local.caminho === '/' ? '' : local.caminho}` || '/'
  }
  return hrefDe(local.secao, locale, local.slug)
}

export type Descricao = {
  locale: Locale
  local: Local
  /** Já resolvido por `mappers/seo.ts` — título, descrição e imagem finais. */
  seo: Seo
  /**
   * Corpo do documento, para a regra de página magra (D-08).
   *
   * Não passar significa "esta rota não tem corpo" — índice, listagem, home.
   * Passar `null` significa "tem campo de corpo e está vazio", que é o que
   * esconde a página dos buscadores.
   */
  corpo?: unknown
}

/**
 * Metadata de uma rota, com os fallbacks de `seo-e-redirects.md`:
 * `seo.metaTitle` → título; `seo.metaDescription` → descrição;
 * `seo.ogImage` → imagem da página.
 *
 * ⚠️ **`alternates.languages` não é enfeite.** D-07 dá slug traduzido a cada
 * rota, então `/sobre` e `/en/about` são a mesma página em dois idiomas. Sem
 * declarar o par, o Google escolhe uma das duas e trata a outra como conteúdo
 * duplicado — e a escolhida não é necessariamente a do idioma de quem busca.
 *
 * `x-default` aponta para o português: é o idioma do conteúdo e o do público.
 */
export function metadataDe({ locale, local, seo, corpo }: Descricao): Metadata {
  const caminho = caminhoDe(local, locale)
  const { title, image: og } = seo
  const description = seo.description || undefined

  const idiomas = Object.fromEntries(
    LOCALES.map((l) => [l === 'pt' ? 'pt-BR' : l, `${ORIGEM}${caminhoDe(local, l)}`]),
  )

  return {
    title,
    description,
    alternates: {
      canonical: `${ORIGEM}${caminho}`,
      languages: { ...idiomas, 'x-default': `${ORIGEM}${caminhoDe(local, DEFAULT_LOCALE)}` },
    },
    openGraph: {
      type: 'website',
      siteName: 'ATRA',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      url: `${ORIGEM}${caminho}`,
      title,
      description,
      images: og ? [{ url: og.url, alt: og.alt, width: og.width, height: og.height }] : undefined,
    },
    /* `noIndex` do editor vence; senão vale a regra de página magra. Nunca o
     * contrário: marcar a caixa é decisão explícita e corpo cheio é só o
     * estado normal.
     *
     * ⚠️ `undefined` e `null` significam coisas diferentes aqui, e escrever
     * `corpo ?? true` misturava as duas: rota sem campo de corpo **não passa**
     * `corpo`, enquanto artigo sem texto passa `null`. Com o `??`, o artigo
     * vazio caía em `true` e era indexado — exatamente o que D-08 proíbe. */
    robots: seo.noIndex
      ? { index: false, follow: true }
      : corpo === undefined
        ? undefined
        : robotsDeCorpo(corpo),
  }
}
