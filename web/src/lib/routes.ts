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
  /* "ATRA na mídia": a seção que era `/relatorios` no protótipo. Mudou de nome e
     de endereço em 01/10 (D-43) e virou matérias de imprensa em 02/10 (D-49),
     com collection própria (`press`). `/relatorios` e `/en/reports` redirecionam
     para cá (`ROTAS_RENOMEADAS`, em `lib/redirects.ts`). */
  midia: { pt: 'atra-na-midia', en: 'atra-in-the-media' },
  ebooks: { pt: 'ebooks', en: 'ebooks' },
  webinars: { pt: 'webinars', en: 'webinars' },
  blog: { pt: 'blog', en: 'blog' },
  sobre: { pt: 'sobre', en: 'about' },
  carreiras: { pt: 'carreiras', en: 'careers' },
  consultores: { pt: 'consultores', en: 'consultants' },
  parceiros: { pt: 'parceiros', en: 'partners' },
  solucoes: { pt: 'solucoes', en: 'solutions' },
  /* `segments`, tradução direta, e não `industries` ou `sectors`: as outras
     seções aqui traduzem o termo em vez de reinterpretá-lo, e escolher o
     vocabulário comercial em inglês é decisão de marketing (D-22). */
  segmentos: { pt: 'segmentos', en: 'segments' },
  // A rota é MIG-061; o destino entra aqui antes porque a caixa de conversa da
  // home já aponta para ela, e link escrito à mão é o que a regra 6 proíbe.
  chat: { pt: 'chat', en: 'chat' },
  insights: { pt: 'insights', en: 'insights' },
  /* Diagnóstico de Maturidade de Dados (feature diagnostico-maturidade-dados,
     task 026), que substituiu o diagnóstico RC18 (D-35). O alias EN existe para
     o slug traduzido resolver: a rota em inglês serve o mesmo conteúdo em
     português, por decisão da feature. Os endereços do RC18 não voltam para
     cá — viraram redirect para esta seção (`ROTAS_APOSENTADAS`, em
     `lib/redirects.ts`). */
  diagnosticoMaturidade: { pt: 'diagnostico-maturidade', en: 'data-maturity-assessment' },
  /* MIG-094. O WordPress serve **uma** página para privacidade, termos e
     cookies (`/politicas-e-termos/`); os 3 links do rodapé apontam todos para
     ela, que é o que já acontece lá. */
  politicas: { pt: 'politicas-e-termos', en: 'privacy-and-terms' },
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
