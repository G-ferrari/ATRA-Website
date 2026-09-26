import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { toGlossaryTerm } from '@/lib/mappers/glossary'
import { getPayload } from '@/lib/payload'
import { isLocale, LOCALES } from '@/lib/locales'

import { ListaDeTermos } from './lista-de-termos'
import { metadataDe } from '@/lib/seo'

/* /glossario (MIG-040). Segue o padrão de cases: a página resolve o dado, a
 * ilha cuida de busca e filtro. */

/* ⚠️ Fora do ar desde 26/09/2026 (D-36): a reunião de 24/09 pediu o glossário
 * escondido. Página e termos continuam no CMS — voltar é trocar para `true`,
 * repor os links no admin e devolver a rota a `ROTAS_COM_GABARITO`.
 *
 * 404, e não 410: 404 é "agora não", e o robô volta a olhar; 410 tiraria a URL
 * do índice como coisa que deixou de existir. */
const NO_AR = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const META = {
  pt: {
    title: 'Glossário de Dados & IA',
    description:
      'Termos de engenharia de dados, cloud, governança e inteligência artificial explicados para quem toma decisão de negócio.',
  },
  en: {
    title: 'Data & AI Glossary',
    description:
      'Data engineering, cloud, governance and AI terms explained for people making business decisions.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const { title, description } = META[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'glossario' },
    seo: { title, description, image: null, noIndex: false },
  })
}

export default async function GlossarioPage() {
  if (!NO_AR) notFound()

  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'glossary-terms',
    locale,
    depth: 0,
    limit: 500,
    sort: 'term',
    draft: rascunho,
  })

  return <ListaDeTermos termos={docs.map(toGlossaryTerm)} locale={locale} />
}
