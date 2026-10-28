import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'

/* Caminhos de seção por idioma (D-07: `/sobre` → `/en/about`).
 *
 * O App Router tem um nome de pasta só, então o sistema de arquivos usa o
 * caminho em português — o idioma padrão — e o `proxy.ts` reescreve o alias em
 * inglês para ele. Quem monta link usa `hrefDe()` e nunca escreve caminho na mão.
 *
 * Cresce a cada rota portada na Fase 3. */
export const SECOES = {
  cases: { pt: 'cases-de-sucesso', en: 'success-stories', es: 'casos-de-exito' },
  // A página ainda não existe (Fase 3); o legado já linka para cá e o link
  // está quebrado lá também. Centralizado aqui para não nascer na mão.
  contato: { pt: 'contato', en: 'contact', es: 'contacto' },
  glossario: { pt: 'glossario', en: 'glossary', es: 'glosario' },
  /* "ATRA na mídia": a seção que era `/relatorios` no protótipo. Mudou de nome e
     de endereço em 01/10 (D-43) e virou matérias de imprensa em 02/10 (D-49),
     com collection própria (`press`). `/relatorios` e `/en/reports` redirecionam
     para cá (`ROTAS_RENOMEADAS`, em `lib/redirects.ts`). */
  midia: { pt: 'atra-na-midia', en: 'atra-in-the-media', es: 'atra-en-los-medios' },
  ebooks: { pt: 'ebooks', en: 'ebooks', es: 'ebooks' },
  webinars: { pt: 'webinars', en: 'webinars', es: 'webinars' },
  blog: { pt: 'blog', en: 'blog', es: 'blog' },
  sobre: { pt: 'sobre', en: 'about', es: 'sobre-nosotros' },
  carreiras: { pt: 'carreiras', en: 'careers', es: 'carreras' },
  consultores: { pt: 'consultores', en: 'consultants', es: 'consultores' },
  parceiros: { pt: 'parceiros', en: 'partners', es: 'socios' },
  solucoes: { pt: 'solucoes', en: 'solutions', es: 'soluciones' },
  /* `segments`, tradução direta, e não `industries` ou `sectors`: as outras
     seções aqui traduzem o termo em vez de reinterpretá-lo, e escolher o
     vocabulário comercial em inglês é decisão de marketing (D-22). */
  segmentos: { pt: 'segmentos', en: 'segments', es: 'segmentos' },
  // A rota é MIG-061; o destino entra aqui antes porque a caixa de conversa da
  // home já aponta para ela, e link escrito à mão é o que a regra 6 proíbe.
  chat: { pt: 'chat', en: 'chat', es: 'chat' },
  insights: { pt: 'insights', en: 'insights', es: 'insights' },
  /* Diagnóstico de Maturidade de Dados (feature diagnostico-maturidade-dados,
     task 026), que substituiu o diagnóstico RC18 (D-35). O alias EN existe para
     o slug traduzido resolver: a rota em inglês serve o mesmo conteúdo em
     português, por decisão da feature. Os endereços do RC18 não voltam para
     cá — viraram redirect para esta seção (`ROTAS_APOSENTADAS`, em
     `lib/redirects.ts`). */
  diagnosticoMaturidade: { pt: 'diagnostico-maturidade', en: 'data-maturity-assessment', es: 'diagnostico-de-madurez' },
  /* MIG-094. O WordPress serve **uma** página para privacidade, termos e
     cookies (`/politicas-e-termos/`); o rodapé tem um link só para ela, com o
     nome da página. */
  politicas: { pt: 'politicas-e-termos', en: 'privacy-and-terms', es: 'privacidad-y-terminos' },
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

/** O trecho da URL que antecede o número da página: `/blog/pagina/2`.
 *  ⚠️ Em português nos dois idiomas, por ora: o proxy só traduz o primeiro
 *  segmento. Traduzir (`/en/blog/page/2`) entra com a tarefa de tradução. */
export const SEGMENTO_DE_PAGINA = 'pagina'

/** URL da página N de uma listagem paginada. A primeira é a própria seção —
 *  `/blog/pagina/1` seria um segundo endereço para o mesmo conteúdo. */
export function hrefDaPagina(secao: Secao, locale: Locale, pagina: number): string {
  return pagina <= 1 ? hrefDe(secao, locale) : hrefDe(secao, locale, `${SEGMENTO_DE_PAGINA}/${pagina}`)
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

/**
 * Para onde o `proxy.ts` manda, com 308, um caminho de idioma prefixado escrito
 * com o segmento português: `/en/solucoes/x` → `/en/solutions/x`. `null` quando
 * não há salto — português, segmento já traduzido, seção sem alias.
 *
 * ⚠️ É a regra do 308 **e** a dos links do site (`localizarHref`): um link que
 * pula o salto tem de cair exatamente onde o salto cairia. Mudar aqui muda os
 * dois. Como no proxy, só o primeiro segmento depois do idioma é traduzido.
 */
export function caminhoComAlias(caminho: string): string | null {
  const [vazio, prefixo, secao, ...resto] = caminho.split('/')
  if (vazio !== '' || !isLocale(prefixo) || prefixo === DEFAULT_LOCALE || !secao) return null
  const alias = aliasEsperado(secao, prefixo)
  return alias ? ['', prefixo, alias, ...resto].join('/') : null
}

/** Corta o endereço em caminho e sufixo (query e âncora, que passam intactas). */
function separar(href: string): { caminho: string; sufixo: string } {
  const corte = href.search(/[?#]/)
  return corte === -1 ? { caminho: href, sufixo: '' } : { caminho: href.slice(0, corte), sufixo: href.slice(corte) }
}

/**
 * Link com o caminho português debaixo do idioma (`/en/sobre`) sai com o
 * caminho do idioma (`/en/about`): o destino do 308 do proxy, sem o salto.
 * Âncora e query passam intactas; link externo e link já traduzido, também.
 *
 * Só olha o endereço, e por isso vale em página de qualquer idioma. O link
 * português **sem** prefixo é com `linkNoIdioma` (D-71).
 */
export function localizarHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const { caminho, sufixo } = separar(href)
  const destino = caminhoComAlias(caminho)
  return destino === null ? href : destino + sufixo
}

/** Seções cuja página de item é `/<seção>/<slug>`, com o slug do documento no
 *  idioma. De que collection vem cada uma, e com que filtro, está em
 *  `lib/traduzir-links.ts`. */
export const SECOES_COM_ITEM = [
  'cases',
  'solucoes',
  'parceiros',
  'segmentos',
  'blog',
  'webinars',
  'ebooks',
  'carreiras',
] as const satisfies readonly Secao[]
export type SecaoComItem = (typeof SECOES_COM_ITEM)[number]

const ehSecaoComItem = (secao: Secao): secao is SecaoComItem => (SECOES_COM_ITEM as readonly Secao[]).includes(secao)

/** O que pede um link interno português sem o prefixo do idioma. */
export type CaminhoPortugues =
  | { tipo: 'inicio'; sufixo: string }
  | { tipo: 'secao'; secao: Secao; sufixo: string }
  | { tipo: 'item'; secao: SecaoComItem; slug: string; sufixo: string }

/**
 * Lê um link português sem prefixo: a página inicial, uma seção da tabela
 * `SECOES` ou um item de seção (`/cases-de-sucesso/<slug>`). `null` para o
 * resto — externo, âncora solta, já com idioma (`/en/…`, `/pt/…`) e endereço
 * que a tabela não conhece (`/blog/pagina/2`, `/roadmap`): sem saber se a
 * página existe no inglês, o link fica como está.
 */
export function lerCaminhoPortugues(href: string): CaminhoPortugues | null {
  if (!href.startsWith('/') || href.startsWith('//')) return null
  const { caminho, sufixo } = separar(href)
  const segmentos = caminho.split('/').filter(Boolean)
  if (segmentos.length === 0) return { tipo: 'inicio', sufixo }
  if (isLocale(segmentos[0])) return null
  const secao = (Object.keys(SECOES) as Secao[]).find((s) => SECOES[s][DEFAULT_LOCALE] === segmentos[0])
  if (!secao) return null
  if (segmentos.length === 1) return { tipo: 'secao', secao, sufixo }
  if (segmentos.length === 2 && ehSecaoComItem(secao)) return { tipo: 'item', secao, slug: segmentos[1], sufixo }
  return null
}

/** O slug de um item no idioma da página, a partir do português; `null` quando
 *  o item não existe nesse idioma (D-69). */
export type SlugDoItem = (secao: SecaoComItem, slugPt: string) => string | null

const nenhumItem: SlugDoItem = () => null

/**
 * O destino de um link do admin numa página do idioma (D-71).
 *
 * - `/en/<português>` sai traduzido, em qualquer página (`localizarHref`).
 * - Na página em português, nada mais muda.
 * - Na página em inglês, o link português sem `/en` vai para o inglês **quando
 *   a página existe no inglês**: a inicial e as seções da tabela `SECOES`
 *   sempre (a rota é traduzida); o item, quando `slugDoItem` devolve o slug
 *   inglês dele. Sem isso — item só em português, endereço que a tabela não
 *   conhece —, o link continua levando ao português.
 *
 * Âncora e query passam intactas. Sem `slugDoItem`, todo item fica em
 * português: é o que o texto rico usa, que não consulta o banco.
 */
export function linkNoIdioma(href: string, locale: Locale, slugDoItem: SlugDoItem = nenhumItem): string {
  const localizado = localizarHref(href)
  if (locale === DEFAULT_LOCALE) return localizado
  const alvo = lerCaminhoPortugues(href)
  if (!alvo) return localizado
  switch (alvo.tipo) {
    case 'inicio':
      return `/${locale}${alvo.sufixo}`
    case 'secao':
      return hrefDe(alvo.secao, locale) + alvo.sufixo
    case 'item': {
      const slug = slugDoItem(alvo.secao, alvo.slug)
      return slug ? hrefDe(alvo.secao, locale, slug) + alvo.sufixo : href
    }
  }
}
