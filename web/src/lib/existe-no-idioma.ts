import type { Where } from 'payload'

import { DEFAULT_LOCALE, type Locale } from './locales'
import { soOsQueExistemNoIdioma } from './mappers/idioma'
import { getPayload } from './payload'

/* Listagem no inglês só com o que existe no inglês (decisão de 23/10, task
 * #52). A regra e o porquê estão em `mappers/idioma.ts`; aqui fica a consulta
 * que ela pede.
 *
 * Em português não há consulta a mais: é o idioma em que todo documento nasce.
 * Nos outros, a mesma consulta corre de novo **sem** fallback, só com o slug —
 * barata, e em paralelo com a da listagem. A da listagem continua com o
 * fallback: é ele que dá texto em português ao campo que ainda não foi
 * traduzido num documento que já existe no inglês (P-08). */

type Id = number | string

/** As collections listadas no site cujo endereço sai do slug do documento. */
export type ColecaoComSlug = 'solutions' | 'segments' | 'partners' | 'cases'

/**
 * Espera a consulta da listagem e tira dela o que não existe no idioma.
 *
 * `where` é o filtro da listagem. Repetido na consulta sem fallback para que
 * ela também só leia publicado: a Local API roda com `overrideAccess: true`
 * (regra 4 do CLAUDE.md).
 */
export async function existentesNoIdioma<T extends { id: Id; slug?: string | null }>(
  locale: Locale,
  collection: ColecaoComSlug,
  where: Where | undefined,
  consulta: Promise<{ docs: T[] }>,
): Promise<T[]> {
  if (locale === DEFAULT_LOCALE) return (await consulta).docs

  const payload = await getPayload()
  const [{ docs }, semReserva] = await Promise.all([
    consulta,
    payload.find({
      collection,
      locale,
      fallbackLocale: false,
      depth: 0,
      pagination: false,
      where,
      select: { slug: true },
    }),
  ])
  return soOsQueExistemNoIdioma(docs, semReserva.docs, locale)
}
