'use client'

import { Landmark } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ContentCard, EmptyState, SearchInput, TabFilter } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { CaseCard, Topic } from '@/types/content'

/* Ilha interativa: busca e filtro rodam no cliente, como no legado.
 * Recebe dado pronto — não consulta o CMS (contratos-de-dados.md). */

const TEXTOS = {
  pt: {
    buscar: 'Pesquisar por cliente, tema...',
    todos: 'Todos',
    categorias: 'Categorias:',
    vazioTitulo: 'Nenhum case encontrado',
    vazioDescricao: 'Tente buscar por outro termo ou selecione a categoria "Todos".',
    limpar: 'Resetar Filtros',
    cta: 'Ver estudo de caso completo',
    selo: 'Case ATRA',
  },
  en: {
    buscar: 'Search by client, topic...',
    todos: 'All',
    categorias: 'Categories:',
    vazioTitulo: 'No case found',
    vazioDescricao: 'Try another term or pick the "All" category.',
    limpar: 'Reset filters',
    cta: 'Read the full case study',
    selo: 'ATRA Case',
  },
} as const

export function ListaDeCases({
  cases,
  topics,
  locale,
}: {
  cases: CaseCard[]
  topics: Topic[]
  locale: Locale
}) {
  const t = TEXTOS[locale]
  const [busca, setBusca] = useState('')
  const [topico, setTopico] = useState('todos')

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return cases.filter((c) => {
      const casaTopico = topico === 'todos' || c.topics.some((tp) => tp.slug === topico)
      const casaBusca =
        termo === '' ||
        [c.title, c.client, c.summary, ...c.topics.map((tp) => tp.name)]
          .join(' ')
          .toLowerCase()
          .includes(termo)
      return casaTopico && casaBusca
    })
  }, [cases, busca, topico])

  const abas = [
    { id: 'todos', label: t.todos, count: cases.length },
    ...topics.map((tp) => ({
      id: tp.slug,
      label: tp.name,
      count: cases.filter((c) => c.topics.some((x) => x.slug === tp.slug)).length,
    })),
  ]

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <SearchInput value={busca} onChange={setBusca} placeholder={t.buscar} />
      </div>

      <div className="mb-8">
        <TabFilter options={abas} activeId={topico} onChange={setTopico} />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          title={t.vazioTitulo}
          description={t.vazioDescricao}
          action={{
            label: t.limpar,
            onClick: () => {
              setBusca('')
              setTopico('todos')
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filtrados.map((c, i) => (
            <ContentCard
              key={c.slug}
              href={hrefDe('cases', locale, c.slug)}
              eyebrow={c.client}
              eyebrowIcon={<Landmark size={15} aria-hidden />}
              title={c.title}
              summary={c.summary}
              image={c.image}
              badge={{ label: t.selo }}
              highlight={c.impact ?? undefined}
              tags={c.topics.map((tp) => tp.name)}
              ctaLabel={t.cta}
              priority={i < 2}
            />
          ))}
        </div>
      )}
    </>
  )
}
