'use client'

import { useState } from 'react'

import { ChipFilter, EmptyState, SearchInput, TabFilter } from '@/components/ui'

/* A parte da bancada que precisa de estado — regra 4: a página resolve tudo no
 * servidor e a interatividade vira ilha. Os filtros aqui são os mesmos que as
 * listagens usam; mexer neles e ver o comportamento é o propósito da página. */
export function Bancada() {
  const [aba, setAba] = useState('todos')
  const [chip, setChip] = useState('todos')
  const [busca, setBusca] = useState('')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
          TabFilter — o seletor de abas das listagens
        </p>
        <TabFilter
          options={[
            { id: 'todos', label: 'Todos', count: 12 },
            { id: 'cases', label: 'Cases', count: 4 },
            { id: 'artigos', label: 'Artigos', count: 7 },
          ]}
          activeId={aba}
          onChange={setAba}
          layoutGroupId="bancada-tabs"
        />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
          ChipFilter — o filtro que unificou as 5 reimplementações de chip (MIG-025)
        </p>
        <ChipFilter
          label="Assunto"
          options={[
            { id: 'todos', label: 'Todos' },
            { id: 'ia', label: 'IA Generativa' },
            { id: 'cloud', label: 'Google Cloud' },
            { id: 'gov', label: 'Governança' },
          ]}
          activeId={chip}
          onChange={setChip}
        />
      </div>

      <div className="max-w-md">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
          SearchInput — com o botão de limpar à direita
        </p>
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Digite para testar…"
          aria-label="Campo de demonstração de busca"
        />
      </div>

      {busca !== '' && (
        <EmptyState
          title="Nenhum resultado"
          description="O EmptyState que as listagens mostram quando o filtro não encontra nada — aqui, qualquer busca cai nele de propósito."
        />
      )}
    </div>
  )
}
