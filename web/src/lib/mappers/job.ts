import type { Job } from '@/payload-types'
import type { Locale } from '@/lib/locales'
import type { Vaga } from '@/types/content'

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
