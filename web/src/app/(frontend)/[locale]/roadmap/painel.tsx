'use client'

import { useMemo, useState } from 'react'

import { ChipFilter, EmptyState, SearchInput, StatusBadge } from '@/components/ui'
import type { Fase, StatusDaTask } from '@/lib/roadmap'

/* A parte interativa do /roadmap — regra 4: a página resolve os dados no
 * servidor e esta ilha só filtra o que recebeu pronto. */

const ROTULOS: Record<StatusDaTask, { label: string; variant: 'online' | 'beta' | 'secondary' | 'neutral' }> = {
  done: { label: 'feita', variant: 'online' },
  wip: { label: 'em curso', variant: 'beta' },
  todo: { label: 'prevista', variant: 'neutral' },
  blocked: { label: 'bloqueada', variant: 'secondary' },
  cancelada: { label: 'cancelada', variant: 'neutral' },
}

export function Painel({ fases }: { fases: Fase[] }) {
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')

  const todas = useMemo(() => fases.flatMap((f) => f.tasks), [fases])
  const porStatus = (s: StatusDaTask) => todas.filter((t) => t.status === s).length

  const chips = [
    { id: 'todas', label: `Todas (${todas.length})` },
    { id: 'done', label: `Feitas (${porStatus('done')})` },
    ...(porStatus('wip') > 0 ? [{ id: 'wip', label: `Em curso (${porStatus('wip')})` }] : []),
    { id: 'todo', label: `Previstas (${porStatus('todo')})` },
    ...(porStatus('blocked') > 0 ? [{ id: 'blocked', label: `Bloqueadas (${porStatus('blocked')})` }] : []),
    { id: 'cancelada', label: `Canceladas (${porStatus('cancelada')})` },
  ]

  const termo = busca.trim().toLowerCase()
  const visivel = (t: Fase['tasks'][number]) =>
    (filtro === 'todas' || t.status === filtro) &&
    (termo === '' || `${t.id} ${t.titulo} ${t.criterio}`.toLowerCase().includes(termo))

  const fasesVisiveis = fases
    .map((f) => ({ ...f, tasks: f.tasks.filter(visivel) }))
    .filter((f) => f.tasks.length > 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Buscar por id, título ou critério…"
          aria-label="Buscar task"
        />
        <ChipFilter label="Status" options={chips} activeId={filtro} onChange={setFiltro} />
      </div>

      {fasesVisiveis.length === 0 && (
        <EmptyState title="Nenhuma task encontrada" description="Ajuste a busca ou o filtro de status." />
      )}

      <div className="space-y-10">
        {fasesVisiveis.map((fase) => {
          const contaveis = fase.tasks.filter((t) => t.status !== 'cancelada')
          const feitas = contaveis.filter((t) => t.status === 'done').length
          return (
            <section key={fase.nome}>
              <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <h3 className="text-lg font-display font-medium text-text-main">{fase.nome}</h3>
                <span className="text-xs text-text-muted whitespace-nowrap tabular-nums">
                  {feitas}/{contaveis.length}
                </span>
              </div>
              <div className="h-1 rounded-full bg-surface-3 mb-4 overflow-hidden" aria-hidden>
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${contaveis.length ? Math.round((feitas / contaveis.length) * 100) : 0}%` }}
                />
              </div>
              <ul className="divide-y divide-border-main">
                {fase.tasks.map((t) => (
                  <li key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1">
                    <div className="flex items-center gap-3 shrink-0 sm:w-44">
                      <StatusBadge
                        label={ROTULOS[t.status].label}
                        variant={ROTULOS[t.status].variant}
                        size="sm"
                        pulse={t.status === 'wip'}
                      />
                      <span className="text-xs font-mono text-text-muted">{t.id}</span>
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm text-text-main ${t.status === 'cancelada' ? 'line-through text-text-muted' : ''}`}
                      >
                        {t.titulo}
                      </p>
                      {t.criterio && <p className="text-xs text-text-muted font-light mt-0.5">{t.criterio}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
