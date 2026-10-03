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
export function SeloPrazo({ prazo, grande, className }: { prazo: string; grande?: boolean; className?: string }) {
  /* `grande`: a versão que ocupa a coluna da direita do herói a partir de `lg`
     (ver `bloco-hero.tsx`) — rótulo em cima, data em corpo de título. Abaixo de
     `lg` é o selo de sempre, numa linha só: as classes da versão grande são
     todas `lg:`. */
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-[6px] bg-secondary/10 dark:bg-secondary/15 px-4 py-2.5',
        grande && 'lg:flex lg:w-full lg:flex-col lg:items-start lg:gap-3 lg:p-6 xl:p-7',
        className,
      )}
    >
      <span className={cn('contents', grande && 'lg:flex lg:items-center lg:gap-2.5')}>
        <CalendarClock size={18} className={cn('text-secondary shrink-0', grande && 'lg:size-5')} aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70">
          Prazo de adequação
        </span>
      </span>
      <span
        className={cn(
          'text-base sm:text-lg font-bold text-slate-900 dark:text-white',
          /* xl em `lg`: em 1024px a coluna tem ~330px, e a data maior quebrava em duas
             linhas. A partir de 1280px cabe em 3xl. */
          grande && 'lg:text-xl xl:text-3xl lg:font-extrabold lg:font-display lg:leading-tight',
        )}
      >
        {prazo}
      </span>
    </div>
  )
}
