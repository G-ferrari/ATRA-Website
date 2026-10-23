import type { Where } from 'payload'

import { DEFAULT_LOCALE, type Locale } from './locales'

/* No inglês, listagem só com o que existe no inglês (D-69, task #52).
 *
 * Existe quando tem slug gravado **naquele** idioma. A rota `/en/<seção>/<slug>`
 * consulta a coluna do inglês, e o fallback resolve leitura, não busca: um
 * documento criado no admin só em português chega a uma consulta em inglês com
 * o slug português emprestado, e o link montado com ele responde 404. Foi o
 * achado de 07/10 no menu de Soluções, e a mesma conta valia para segmentos,
 * parceiros, artigos, webinars, e-books, cases e vagas.
 *
 * O corte vai no `where`, e não num filtro depois da consulta: condição sobre
 * campo localizado bate na coluna do idioma pedido, **sem** fallback — a mesma
 * armadilha que dava o 404, usada a favor. A leitura continua com o fallback,
 * que dá o texto em português ao campo ainda não traduzido de um documento que
 * já existe no inglês (P-08). Uma consulta só, e o `limit` conta o que aparece:
 * os três primeiros da Insights são três que abrem.
 *
 * É a regra do catálogo da ATRA AI (`slugNoIdioma`, em `mappers/idioma.ts`),
 * escrita para o banco.
 *
 * ⚠️ Não é o `temIngles` do sitemap, e a diferença é de propósito. Lá a
 * pergunta é se o inglês é **outro texto**: anunciar ao Google uma URL inglesa
 * que serve português é pedir indexação no idioma errado. Aqui a pergunta é se
 * o endereço **abre**. As 18 soluções da D-52 nasceram com o inglês copiado do
 * português, de propósito, para a rota existir — pelo `temIngles` todas
 * sairiam do menu inglês. */

const comSlugNoIdioma = (): Where => ({ slug: { exists: true } })

/**
 * O `where` de uma listagem com o corte do idioma. Em português volta como
 * veio: é o idioma em que todo documento nasce.
 *
 * Só para collection cujo endereço sai do slug (`slugField`, localizado).
 */
export function ondeExisteNoIdioma(locale: Locale, where?: Where): Where | undefined {
  if (locale === DEFAULT_LOCALE) return where
  if (!where || Object.keys(where).length === 0) return comSlugNoIdioma()
  return { and: [where, comSlugNoIdioma()] }
}
