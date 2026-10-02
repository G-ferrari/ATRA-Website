import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

/* O selo do cartão de solução em destaque (D-52) — "Diferencial ATRA" em
 * Analytics Conversacional. Um componente só para o menu e o índice
 * `/solucoes`, que desenham o mesmo cartão em dois tamanhos.
 *
 * Sem `'use client'`: o índice é Server Component e o menu é ilha cliente, e o
 * selo serve aos dois. O texto vem do campo "Selo" da solução. */
export function SeloDeSolucao({ texto, className }: { texto: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 shrink-0 rounded-full bg-secondary/15 text-secondary-dark dark:text-secondary px-2 py-0.5 text-[10px] font-semibold leading-none whitespace-nowrap',
        className,
      )}
    >
      <Star size={10} className="fill-current" aria-hidden />
      {texto}
    </span>
  )
}
