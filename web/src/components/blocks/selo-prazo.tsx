import { CalendarClock } from 'lucide-react'

import { cn } from '@/lib/utils'

/* Selo de prazo em destaque.
 *
 * A data-limite da RC 18/2025 (31/12/2026, Art. 12) é o gatilho de urgência da
 * conversão, então ganha um selo próprio — ícone + rótulo + data em negrito — no
 * herói e na faixa final da /solucoes/rc18. Componente único para os dois lugares
 * manterem o mesmo desenho.
 *
 * Acento laranja é pontuação (Regra do Acento Escasso): o fundo é um tom leve de
 * laranja e o ícone é laranja, mas a **data** fica em alto contraste (Regra do
 * Par, valor escuro por último) para ser legível nos dois temas. */
export function SeloPrazo({ prazo, className }: { prazo: string; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-[6px] bg-secondary/10 dark:bg-secondary/15 px-4 py-2.5',
        className,
      )}
    >
      <CalendarClock size={18} className="text-secondary shrink-0" aria-hidden />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70">
        Prazo de adequação
      </span>
      <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{prazo}</span>
    </div>
  )
}
