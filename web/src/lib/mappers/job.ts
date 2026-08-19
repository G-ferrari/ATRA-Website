import type { Job } from '@/payload-types'
import type { Locale } from '@/lib/locales'
import type { Vaga, VagaDetalhe } from '@/types/content'

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
    area: doc.area,
    locationLabel: doc.location ? `${modelo} · ${doc.location}` : modelo,
  }
}

export function toVagaDetalhe(doc: Job, locale: Locale): VagaDetalhe {
  return {
    ...toVaga(doc, locale),
    summary: doc.summary,
    body: doc.body ?? null,
  }
}
