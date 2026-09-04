'use client'

import { useMemo, useState } from 'react'

import { ChipFilter, EmptyState, SearchInput, StatusBadge } from '@/components/ui'
import type { Fase, StatusDaTask, Task } from '@/lib/roadmap'

/* A parte interativa do /roadmap — regra 4: a página resolve os dados no
 * servidor e esta ilha só filtra o que recebeu pronto. Cada task é um
 * <details> nativo: acordeão sem estado próprio, e a busca continua achando o
 * conteúdo fechado porque o filtro roda sobre os dados, não sobre o DOM. */

const ROTULOS: Record<StatusDaTask, { label: string; variant: 'online' | 'beta' | 'secondary' | 'neutral' }> = {
  done: { label: 'feita', variant: 'online' },
  wip: { label: 'em curso', variant: 'beta' },
  todo: { label: 'prevista', variant: 'neutral' },
  blocked: { label: 'bloqueada', variant: 'secondary' },
  cancelada: { label: 'cancelada', variant: 'neutral' },
}

function CampoDaTask({ rotulo, valor, mono = false }: { rotulo: string; valor: string; mono?: boolean }) {
  if (!valor) return null
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{rotulo}</dt>
      <dd className={`text-xs text-text-subtle mt-0.5 ${mono ? 'font-mono' : 'font-light'}`}>
        {valor}
      </dd>
    </div>
  )
}

function LinhaDaTask({ t }: { t: Task }) {
  const temCorpo = t.criterio || t.nota || t.arquivos || t.dependencias || t.estimativa
  const cabecalho = (
    <span className="flex items-center gap-3 min-w-0">
      <span className="shrink-0 w-24 sm:w-28">
        <StatusBadge
          label={ROTULOS[t.status].label}
          variant={ROTULOS[t.status].variant}
          size="sm"
          pulse={t.status === 'wip'}
        />
      </span>
      <span className="text-xs font-mono text-text-muted shrink-0">{t.id}</span>
      {/* No mobile o título quebra linha: truncado, sobrariam ~140px e o texto
        * completo não aparece em lugar nenhum — o corpo do <details> não o repete. */}
      <span
        className={`text-sm min-w-0 sm:truncate ${t.status === 'cancelada' ? 'line-through text-text-muted' : 'text-text-main'}`}
      >
        {t.titulo}
      </span>
    </span>
  )

  if (!temCorpo) return <div className="py-2.5 px-2">{cabecalho}</div>

  return (
    <details className="group">
      <summary className="cursor-pointer select-none list-none py-2.5 px-2 rounded-[6px] hover:bg-surface-3/60 transition-colors flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        {cabecalho}
        <span className="text-text-muted text-xs shrink-0 transition-transform group-open:rotate-90" aria-hidden>
          ›
        </span>
      </summary>
      <dl className="mx-2 mb-3 mt-1 rounded-[6px] bg-surface-1 dark:bg-[#0e1015] border border-border-main p-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
        <CampoDaTask rotulo="Critério de aceite" valor={t.criterio} />
        <CampoDaTask rotulo="Como terminou" valor={t.nota} />
        <CampoDaTask rotulo="Arquivos" valor={t.arquivos} mono />
        <CampoDaTask rotulo="Depende de" valor={t.dependencias} mono />
        <CampoDaTask rotulo="Estimativa" valor={t.estimativa} />
      </dl>
    </details>
  )
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
  const visivel = (t: Task) =>
    (filtro === 'todas' || t.status === filtro) &&
    (termo === '' ||
      `${t.id} ${t.titulo} ${t.criterio} ${t.nota} ${t.arquivos}`.toLowerCase().includes(termo))

  const fasesVisiveis = fases
    .map((f) => ({ ...f, tasks: f.tasks.filter(visivel) }))
    .filter((f) => f.tasks.length > 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Buscar por id, título, critério, arquivo…"
          aria-label="Buscar task"
        />
        <ChipFilter label="Status" options={chips} activeId={filtro} onChange={setFiltro} />
      </div>

      {fasesVisiveis.length === 0 && (
        <EmptyState title="Nenhuma task encontrada" description="Ajuste a busca ou o filtro de status." />
      )}

      <div className="space-y-8">
        {fasesVisiveis.map((fase) => {
          const contaveis = fase.tasks.filter((t) => t.status !== 'cancelada')
          const feitas = contaveis.filter((t) => t.status === 'done').length
          return (
            <details key={fase.nome} open className="group/fase">
              <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-baseline justify-between gap-4 mb-1.5">
                  <h3 className="text-lg font-display font-medium text-text-main flex items-center gap-2">
                    <span
                      className="text-text-muted text-sm transition-transform group-open/fase:rotate-90"
                      aria-hidden
                    >
                      ›
                    </span>
                    {fase.nome}
                  </h3>
                  <span className="text-xs text-text-muted whitespace-nowrap tabular-nums">
                    {feitas}/{contaveis.length}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-surface-3 mb-2 overflow-hidden" aria-hidden>
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${contaveis.length ? Math.round((feitas / contaveis.length) * 100) : 0}%` }}
                  />
                </div>
              </summary>
              <div className="divide-y divide-border-main">
                {fase.tasks.map((t) => (
                  <LinhaDaTask key={t.id} t={t} />
                ))}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
