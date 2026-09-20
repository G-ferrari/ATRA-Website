import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* Extraído de markup repetido em SuccessStories.tsx:155, Blog.tsx:158 e
 * Glossary.tsx:172 — sempre o mesmo cartão de "nada encontrado" com ícone,
 * título, explicação e botão de limpar filtros. Classes idênticas. */

export type EmptyStateProps = {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  icon?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-surface-2 rounded-[6px] p-10 text-center max-w-md mx-auto',
        className,
      )}
    >
      {icon ?? <Search size={32} className="mx-auto text-text-muted mb-3" aria-hidden />}
      <h3 className="text-base font-bold text-text-main mb-1">{title}</h3>
      <p className="text-xs text-text-muted font-light mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
