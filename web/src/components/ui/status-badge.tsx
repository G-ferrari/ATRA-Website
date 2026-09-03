import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* Portado de legacy/src/components/ui/badge-status.tsx.
 * Usado em 7 rotas do legado. Saída idêntica — as classes são as mesmas.
 *
 * ⚠️ `icon` aceita só ReactNode, nunca string (MIG-157). O `<Icon>` do
 * `@iconify/react` busca o SVG em api.iconify.design em tempo de execução —
 * requisição a terceiro sem consentimento, o que a D-30 proíbe. */

type Variante = 'online' | 'beta' | 'primary' | 'secondary' | 'neutral' | 'tech'
type Tamanho = 'sm' | 'md'

const VARIANTES: Record<Variante, string> = {
  online: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:text-emerald-400',
  beta: 'bg-primary/10 text-primary border-primary/20',
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  neutral: 'bg-surface-3 dark:bg-[#222631] text-text-muted border-border-main',
  tech: 'bg-surface-2 dark:bg-[#181b22] text-text-main border-border-main hover:border-primary/40',
}

const TAMANHOS: Record<Tamanho, string> = {
  sm: 'text-[10px] px-2 py-0.5 rounded-[6px] gap-1',
  md: 'text-xs px-2.5 py-1 rounded-[6px] gap-1.5',
}

/** Cor do ponto pulsante, por variante. */
const corDoPulso = (variante: Variante) =>
  variante === 'online' ? 'emerald' : variante === 'secondary' ? 'secondary' : 'primary'

export type StatusBadgeProps = {
  label: string
  variant?: Variante
  pulse?: boolean
  size?: Tamanho
  icon?: ReactNode
  className?: string
}

export function StatusBadge({
  label,
  variant = 'primary',
  pulse = false,
  size = 'md',
  icon,
  className,
}: StatusBadgeProps) {
  const cor = corDoPulso(variant)
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border tracking-wide transition-colors',
        VARIANTES[variant],
        TAMANHOS[size],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              cor === 'emerald' ? 'bg-emerald-400' : cor === 'secondary' ? 'bg-secondary' : 'bg-primary',
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              cor === 'emerald' ? 'bg-emerald-500' : cor === 'secondary' ? 'bg-secondary' : 'bg-primary',
            )}
          />
        </span>
      )}

      {icon}

      <span>{label}</span>
    </span>
  )
}

export type MetricChipProps = {
  value?: string
  label: string
  trend?: string
  variant?: 'primary' | 'secondary' | 'neutral'
  size?: Tamanho
  className?: string
}

export function MetricChip({
  value,
  label,
  trend,
  variant = 'neutral',
  size = 'md',
  className,
}: MetricChipProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-[6px] border border-border-main shadow-xs',
        size === 'sm' ? 'gap-1.5 px-2.5 py-1 text-[10px]' : 'gap-2.5 px-3 py-1.5 text-xs',
        variant === 'primary'
          ? 'bg-primary/10 text-primary border-primary/20'
          : variant === 'secondary'
            ? 'bg-secondary/10 text-secondary border-secondary/20'
            : 'bg-surface-2 dark:bg-[#181b22] text-text-muted',
        className,
      )}
    >
      {value && <span className="font-extrabold text-primary font-mono">{value}</span>}
      <span className="font-medium text-text-muted">{label}</span>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-[6px]">
          {trend} <ArrowUpRight size={10} />
        </span>
      )}
    </div>
  )
}
