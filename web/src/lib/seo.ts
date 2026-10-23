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

/** URL de mídia vira absoluta. O Google recusa caminho relativo em `image`, e a
 *  imagem de compartilhamento relativa é pior ainda — ver `metadataDe`. */
export function absoluta(url: string): string {
  return url.startsWith('http') ? url : `${ORIGEM}${url}`
}

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

/** O slug de um documento em cada idioma em que ele tem versão — ver `versoesDe`,
 *  em `sitemap.ts`. Idioma ausente é idioma sem versão. */
export type SlugsPorIdioma = Partial<Record<Locale, string>>

/** O código do idioma no `hreflang`: o português é o do Brasil. */
export function hreflangDe(locale: Locale): string {
  return locale === 'pt' ? 'pt-BR' : locale
}

/**
 * As versões de idioma que a página declara (`hreflang`), ou `undefined` quando
 * não há par a declarar.
 *
 * Sem `versoes`, a rota é fixa ou de seção: `/sobre` e `/en/about` existem os
 * dois por construção, com o caminho traduzido de `routes.ts` (D-07).
 *
 * Com `versoes`, é página de item, e o slug muda com o idioma. ⚠️ Até 23/10 a
 * versão inglesa saía com o slug **português** — `/en/success-stories/<slug-pt>`,
 * que dá 404 (os 4 cases têm slug próprio no inglês), ou abre outro documento —,
 * e era declarada mesmo para o item que não tem inglês. Agora cada idioma usa o
 * seu slug, e só entra o idioma em que o item tem versão: a regra do sitemap.
 *
 * O par só sai com dois idiomas **e** a própria página entre eles. Um idioma só
 * não é par: a página inglesa de um item sem tradução declarar o português
 * seria par de mão única, que o Google descarta — e o português, que não a
 * declara de volta, diz o contrário. O mesmo vale para o `x-default`, que só
 * tem sentido como escolha entre versões.
 *
 * A própria página sai com o endereço da canônica: o Google pede que a
 * autorreferência e a canônica sejam a mesma URL.
 */
export function alternativasDe(
  local: Local,
  locale: Locale,
  versoes?: SlugsPorIdioma,
): Record<string, string> | undefined {
  const localEm = (l: Locale): Local | null => {
    if (!versoes || !('secao' in local)) return local
    if (!versoes[l]) return null
    return l === locale ? local : { ...local, slug: versoes[l] }
  }

  const existentes = LOCALES.flatMap((l) => {
    const em = localEm(l)
    return em ? [[l, `${ORIGEM}${caminhoDe(em, l)}`] as const] : []
  })
  if (existentes.length < 2 || !existentes.some(([l]) => l === locale)) return undefined

  const urls = Object.fromEntries(existentes) as Partial<Record<Locale, string>>
  /* `x-default` aponta para o português: é o idioma do conteúdo e o do público,
     e é o idioma em que todo documento nasce. */
  const padrao = urls[DEFAULT_LOCALE]
  return {
    ...Object.fromEntries(existentes.map(([l, url]) => [hreflangDe(l), url])),
    ...(padrao && { 'x-default': padrao }),
  }
}

export type Descricao = {
  locale: Locale
  local: Local
  /**
   * Página de item: o slug do documento em cada idioma em que ele tem versão
   * (`versoesDoItem`). É o que monta a versão do outro idioma com o slug
   * **dele**. Rota fixa ou de seção não passa — ver `alternativasDe`.
   */
  versoes?: SlugsPorIdioma
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
 * Quais versões entram, e com que endereço, é `alternativasDe`.
 */
export function metadataDe({ locale, local, versoes, seo, corpo }: Descricao): Metadata {
  const caminho = caminhoDe(local, locale)
  const { title, image: og } = seo
  const description = seo.description || undefined
  const idiomas = alternativasDe(local, locale, versoes)

  return {
    title,
    description,
    alternates: {
      canonical: `${ORIGEM}${caminho}`,
      ...(idiomas && { languages: idiomas }),
    },
    openGraph: {
      type: 'website',
      siteName: 'ATRA',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      url: `${ORIGEM}${caminho}`,
      title,
      description,
      /* ⚠️ Absoluta, com a origem do site. A mídia do CMS vem como caminho
       * (`/api/media/file/…`), e o Next completa caminho relativo com a
       * `metadataBase` — que, sem ninguém definir, é `http://localhost:3000`.
       * Foi assim até 02/10: todo artigo e case da homologação anunciava a
       * imagem de compartilhamento em `localhost`, e o link colado no LinkedIn
       * ou no WhatsApp saía sem imagem. A canônica nunca sofreu disso porque já
       * era montada com `ORIGEM`. */
      images: og ? [{ url: absoluta(og.url), alt: og.alt, width: og.width, height: og.height }] : undefined,
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
