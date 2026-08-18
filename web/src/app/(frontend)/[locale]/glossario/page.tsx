import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { toGlossaryTerm } from '@/lib/mappers/glossary'
import { getPayload } from '@/lib/payload'
import { isLocale, LOCALES } from '@/lib/locales'

import { ListaDeTermos } from './lista-de-termos'

/* /glossario (MIG-040). Segue o padrão de cases: a página resolve o dado, a
 * ilha cuida de busca e filtro. */

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
  return META[isLocale(locale) ? locale : 'pt']
}

export default async function GlossarioPage() {
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
