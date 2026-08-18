'use client'

import { cn } from '@/lib/utils'

/* Barra de chips de categoria.
 *
 * É o filtro que o legado usa nas 5 listagens (cases, blog, webinars, ebooks,
 * relatórios) — markup idêntico ao de `legacy/src/pages/SuccessStories.tsx:135`,
 * extraído aqui para existir uma vez só.
 *
 * Não confundir com `TabFilter`: aquele é outro componente do legado, usado em
 * `/design-system`, com outro desenho. Trocar um pelo outro quebra a paridade
 * visual — foi o que aconteceu na primeira versão desta página. */

export type ChipOption = { id: string; label: string }

export type ChipFilterProps = {
  label: string
  options: ChipOption[]
  activeId: string
  onChange: (id: string) => void
  /* ⚠️ O blog usa `dark:text-gray-300` (#d1d5db) no chip inativo onde as outras
   * listagens usam `text-text-muted` (#9ca3af no escuro) — cores diferentes,
   * numa das 9 duplicações divergentes do legado. Como a comparação roda no
   * tema escuro, reproduzir é obrigatório (D-15). Unificar é decisão de design
   * para depois do aceite; registrado em debito-tecnico.md. */
  variante?: 'padrao' | 'blog'
}

export function ChipFilter({
  label,
  options,
  activeId,
  onChange,
  variante = 'padrao',
}: ChipFilterProps) {
  const inativo =
    variante === 'blog'
      ? 'bg-surface-2 text-text-muted dark:text-gray-300 hover:text-text-main dark:hover:text-white border border-slate-200 dark:border-white/5 hover:bg-surface-3'
      : 'bg-surface-2 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3'

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
      <span className="text-[11px] font-bold text-text-muted uppercase mr-1 shrink-0">{label}</span>
      {options.map((opcao) => (
        <button
          key={opcao.id}
          type="button"
          onClick={() => onChange(opcao.id)}
          aria-pressed={activeId === opcao.id}
          className={cn(
            'px-3 py-1 rounded-[4px] text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
            activeId === opcao.id ? 'bg-primary text-white font-semibold shadow-xs' : inativo,
          )}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  )
}
