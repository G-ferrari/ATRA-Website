import type { Media } from '@/payload-types'
import type { Image, Seo } from '@/types/content'

import { toImageOpcional } from './shared'

/* O grupo `seo` que `fields/seo.ts` põe em toda collection com URL pública.
 *
 * ⚠️ Ele existia desde a Fase 1 e **nenhuma rota o lia** — o editor preenchia
 * "Título para buscadores" e o campo não saía do banco. O tipo `Seo` de
 * apresentação também estava declarado e sem consumidor. MIG-105 liga os dois. */

type GrupoSeo =
  | {
      metaTitle?: string | null
      metaDescription?: string | null
      ogImage?: number | Media | null
      noIndex?: boolean | null
    }
  | null
  | undefined

/** O que a página oferece quando o editor não preencheu o SEO. */
export type Reserva = {
  titulo: string
  descricao?: string | null
  imagem?: Image | null
}

/**
 * Resolve os fallbacks aqui, e não no `generateMetadata` de cada rota.
 *
 * A ordem é a de `seo-e-redirects.md`, e a razão de ser um lugar só é que ela
 * já estava escrita em quatro rotas com três resultados diferentes: uma usava
 * `title`, outra `ATRA / ${title}`, outra nada.
 */
export function toSeo(grupo: GrupoSeo, reserva: Reserva): Seo {
  return {
    title: grupo?.metaTitle?.trim() || reserva.titulo,
    description: grupo?.metaDescription?.trim() || reserva.descricao?.trim() || '',
    /* Opcional de verdade: `ogImage` vazio é o caso comum, e cair aqui não pode
     * derrubar a página — quem exige imagem é o cartão, não a metatag. */
    image: toImageOpcional(grupo?.ogImage, 'seo.ogImage') ?? reserva.imagem ?? null,
    noIndex: Boolean(grupo?.noIndex),
  }
}
