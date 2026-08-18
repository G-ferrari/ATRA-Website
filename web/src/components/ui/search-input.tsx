'use client'

import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'

/* Extraído de markup repetido em 5 páginas do legado:
 * SuccessStories.tsx:113, Blog.tsx:116, Insights.tsx:413, Glossary.tsx:97 e
 * Consultants.tsx:449 — sempre o mesmo campo com lupa à esquerda e botão de
 * limpar à direita. Classes idênticas às do legado. */

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Rótulo para leitor de tela, já que o campo não tem <label> visível. */
  'aria-label'?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full sm:w-72', className)}>
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        size={16}
        aria-hidden
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="pl-10 pr-4 py-2.5 rounded-[6px] bg-surface-2 text-text-main border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:border-primary w-full transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
        >
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  )
}
