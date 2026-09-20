import type { Job } from '@/payload-types'
import type { Locale } from '@/lib/locales'
import type { Vaga, VagaDetalhe } from '@/types/content'
import { toSeo } from './seo'

const MODELO: Record<Job['locationType'], Record<Locale, string>> = {
  remote: { pt: 'Remoto', en: 'Remote' },
  hybrid: { pt: 'Híbrido', en: 'Hybrid' },
  onsite: { pt: 'Presencial', en: 'On site' },
}

export function toVaga(doc: Job, locale: Locale): Vaga {
  const modelo = MODELO[doc.locationType][locale]
  return {
    slug: doc.slug,
    title: doc.title,
    area: doc.area?.trim() || null,
    locationLabel: doc.location ? `${modelo} · ${doc.location}` : modelo,
  }
}

export function toVagaDetalhe(doc: Job, locale: Locale): VagaDetalhe {
  const base = toVaga(doc, locale)
  return {
    ...base,
    summary: doc.summary,
    id: doc.id,
    seo: toSeo(doc.seo, { titulo: base.title, descricao: doc.summary }),
    body: doc.body ?? null,
  }
}
