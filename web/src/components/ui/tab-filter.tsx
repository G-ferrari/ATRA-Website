'use client'

import { Icon } from '@iconify/react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

/* Portado de legacy/src/components/ui/tab-filter.tsx.
 *
 * No legado este componente existia e era usado só na vitrine /design-system —
 * as 5 páginas com filtro reimplementavam chips à mão (SuccessStories:137,
 * Blog:140, Insights:426, Consultants:481, Glossary:125). Aqui ele é o único
 * filtro: 5 reimplementações viram 1. Ver inventario-componentes.md, item 4. */

export type TabOption = {
  id: string
  label: string
  icon?: string
  count?: number
}

export type TabFilterProps = {
  options: TabOption[]
  activeId: string
  onChange: (id: string) => void
  /** Distingue a animação quando há mais de um TabFilter na mesma página. */
  layoutGroupId?: string
  className?: string
}

export function TabFilter({
  options,
  activeId,
  onChange,
  layoutGroupId = 'activeFilterTab',
  className,
}: TabFilterProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 p-1.5 rounded-[6px] bg-surface-3/70 dark:bg-[#222631]/70 border border-border-main backdrop-blur-sm',
        className,
      )}
      role="tablist"
    >
      {options.map((tab) => {
        const ativo = activeId === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={ativo}
            className={cn(
              'relative px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none',
              ativo
                ? 'text-white'
                : 'text-text-muted hover:text-text-main hover:bg-surface-2/50 dark:hover:bg-[#181b22]/50',
            )}
          >
            {ativo && (
              <motion.div
                layoutId={layoutGroupId}
                className="absolute inset-0 bg-primary rounded-[6px] shadow-sm shadow-primary/30 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {tab.icon && (
              <Icon
                icon={tab.icon}
                width={14}
                height={14}
                className={ativo ? 'text-white' : 'text-text-muted'}
              />
            )}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-[6px] font-mono',
                  ativo ? 'bg-white/20 text-white' : 'bg-surface-2 dark:bg-[#181b22] text-text-muted',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
