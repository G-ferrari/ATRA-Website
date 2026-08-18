'use client'

import { Sparkles, Landmark } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  ContentCard,
  EmptyState,
  GlowCard,
  MetricChip,
  SearchInput,
  StatusBadge,
  TabFilter,
} from '@/components/ui'

/* Bancada de verificação da Fase 2: exercita cada componente do design system
 * com as mesmas props que o legado usa, para comparar lado a lado com :3001.
 * Sai quando a home real entrar (MIG-059). */

const ABAS = [
  { id: 'todos', label: 'Todos', count: 4 },
  { id: 'governanca', label: 'Governança', count: 2 },
  { id: 'cloud', label: 'Cloud', count: 1 },
]

export default function Bancada() {
  const [dark, setDark] = useState(true)
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState('todos')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <main className="flex-1 p-8 sm:p-12 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display">
          Design system — <span className="text-gradient font-normal">fatia vertical</span>
        </h1>
        <button onClick={() => setDark((d) => !d)} className="pill-btn-outline">
          {dark ? 'Tema claro' : 'Tema escuro'}
        </button>
      </div>

      <section className="vort-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          StatusBadge · MetricChip
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="Histórias Reais de Sucesso" variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
          <MetricChip label="Grandes Instituições" variant="neutral" size="sm" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="online" variant="online" pulse />
          <StatusBadge label="secondary" variant="secondary" />
          <StatusBadge label="tech" variant="tech" />
          <MetricChip value="51x" label="mais rápido" variant="primary" trend="+300%" />
        </div>
      </section>

      <section className="vort-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          SearchInput · TabFilter
        </h2>
        <SearchInput value={busca} onChange={setBusca} placeholder="Pesquisar por cliente, tema..." />
        <TabFilter options={ABAS} activeId={aba} onChange={setAba} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">GlowCard</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <GlowCard glowColor="blue" customSize radius={6} className="p-6 bg-surface-2 text-text-main shadow-lg rounded-[6px]">
            <div>
              <StatusBadge label="Parceiros Oficiais" variant="primary" size="sm" />
              <h3 className="text-xl font-extrabold font-display text-text-main mt-3 mb-2">Ecossistema Global</h3>
              <p className="text-xs text-text-muted font-light">Passe o mouse para ver o brilho seguir o cursor.</p>
            </div>
          </GlowCard>
          <GlowCard glowColor="orange" customSize radius={6} className="p-6 bg-surface-2 text-text-main shadow-lg rounded-[6px]">
            <div>
              <StatusBadge label="Selos de Reconhecimento" variant="secondary" size="sm" />
              <h3 className="text-xl font-extrabold font-display text-text-main mt-3 mb-2">5x GPTW & LIPT</h3>
              <p className="text-xs text-text-muted font-light">Variante laranja.</p>
            </div>
          </GlowCard>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">ContentCard</h2>
        <ContentCard
          href="#"
          eyebrow="Banco ABC"
          eyebrowIcon={<Landmark size={15} aria-hidden />}
          title="Gerando valor através de Marketplace e Governança de dados"
          summary="Estabelecimento de fluxo de trabalho entre Informatica e GCP para democratizar dados corporativos com segurança e alta performance."
          image={{ url: '/verificacao/case.jpg', alt: 'Case de marketplace e governança', width: 1376, height: 768 }}
          badge={{ label: 'Case ATRA' }}
          highlight="+300% de adoção de dados"
          tags={['Governança', 'Marketplace', 'GCP']}
          ctaLabel="Ver estudo de caso completo"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">EmptyState</h2>
        <EmptyState
          title="Nenhum case encontrado"
          description='Tente buscar por outro termo ou selecione a categoria "Todos".'
          action={{ label: 'Resetar Filtros', onClick: () => { setBusca(''); setAba('todos') } }}
        />
      </section>
    </main>
  )
}
