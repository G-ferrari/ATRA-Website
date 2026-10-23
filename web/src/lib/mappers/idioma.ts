import type { Locale } from '../locales'

/* Quando um documento **existe** num idioma — a regra do catálogo da ATRA AI
 * (D-60) e, desde a decisão do G-ferrari de 23/10 (task #52), também das
 * listagens do site: no inglês, o que não tem versão inglesa não aparece.
 *
 * Existe quando tem slug gravado **naquele** idioma, lido com
 * `fallbackLocale: false`. A rota `/en/<seção>/<slug>` consulta a coluna do
 * inglês, e o fallback resolve leitura, não busca: um documento criado no
 * admin só em português chega a uma consulta em inglês com o slug português
 * emprestado, e o link montado com ele responde 404. Foi o achado de 07/10 no
 * menu de Soluções (Master Data Management, Privacidade & LGPD).
 *
 * ⚠️ Não é o `temIngles` do sitemap, e a diferença é de propósito. Lá a
 * pergunta é se o inglês é **outro texto**: anunciar ao Google uma URL inglesa
 * que serve português é pedir indexação no idioma errado. Aqui a pergunta é se
 * o endereço **abre**. As 18 soluções da D-52 nasceram com o inglês copiado do
 * português, de propósito, para a rota existir (P-08) — pelo `temIngles` todas
 * sairiam do menu inglês, e passaria por "traduzida" justamente a que tem o
 * inglês desatualizado (título diferente do português porque ficou o antigo). */

/** O mesmo documento nos dois idiomas; `en` vem com `fallbackLocale: false`. */
export type Par<T> = { pt: T; en?: T | null }

type Id = number | string

/** O slug do documento no idioma, ou `null` quando ele não existe nesse idioma. */
export function slugNoIdioma(par: Par<{ slug?: string | null }>, locale: Locale): string | null {
  const doIdioma = locale === 'pt' ? par.pt : par.en
  return doIdioma?.slug?.trim() || null
}

/**
 * Os documentos de uma listagem que existem no idioma, na ordem em que vieram.
 *
 * `docs` é a consulta da listagem, como sempre foi (com o fallback, que dá o
 * texto em português ao que ainda não foi traduzido). `semReserva` é a mesma
 * consulta no idioma com `fallbackLocale: false` — vazia em português, onde
 * todo documento existe porque é o idioma em que ele nasce.
 */
export function soOsQueExistemNoIdioma<T extends { id: Id; slug?: string | null }>(
  docs: T[],
  semReserva: { id: Id; slug?: string | null }[],
  locale: Locale,
): T[] {
  const noIdioma = new Map(semReserva.map((doc) => [doc.id, doc]))
  return docs.filter((doc) => slugNoIdioma({ pt: doc, en: noIdioma.get(doc.id) }, locale) !== null)
}
