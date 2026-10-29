import { Plus } from 'lucide-react'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { DadosEstruturados } from '@/components/layout/dados-estruturados'
import { perguntasFrequentes } from '@/lib/jsonld'
import { cn } from '@/lib/utils'
import type { BlocoFaqSection } from '@/types/content'

import { PilulaDeSecao } from './pilula-de-secao'

/* Perguntas frequentes (GEO, D-80).
 *
 * ⚠️ `<details>`, e não o acordeão de estado do `BlocoAcordeao`. Lá a resposta
 * fechada **não existe no HTML** (`{ativa && …}`), e é exatamente o texto que
 * o robô de IA precisa ler: ele não clica, e a maioria nem executa JavaScript.
 * Com `<details>` toda resposta sai no HTML do servidor, abre sem JavaScript e
 * o bloco nem precisa ser ilha cliente.
 *
 * O FAQPage do schema.org vai junto, dentro da seção. O Google deixou de
 * mostrar o destaque de FAQ em maio de 2026; a marcação fica porque é o
 * mesmo texto, legível por qualquer outro buscador, e não promete nada que a
 * página não mostre. */
export function BlocoPerguntasFrequentes({ bloco }: { bloco: BlocoFaqSection }) {
  if (bloco.items.length === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'scroll-mt-28 md:scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <DadosEstruturados dados={perguntasFrequentes(bloco.items)} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10 lg:mb-12">
          {bloco.eyebrow && <PilulaDeSecao texto={bloco.eyebrow} icone={bloco.eyebrowIcon} />}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-text-main leading-tight tracking-tight">
            {bloco.title}
          </h2>
          {bloco.description && <p className="text-base text-text-muted mt-2 max-w-2xl">{bloco.description}</p>}
        </div>

        <div className="space-y-3">
          {bloco.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-[6px] border border-slate-200 dark:border-white/5 bg-surface-1 open:border-primary/40 open:shadow-md transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold text-text-main group-open:text-primary transition-colors">
                  {item.question}
                </h3>
                <span
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 bg-surface-2 text-text-muted group-open:bg-primary/20 group-open:text-primary transition-[transform,background-color,color] group-open:rotate-45"
                  aria-hidden
                >
                  <Plus size={16} />
                </span>
              </summary>
              <p className="px-4 sm:px-5 pb-5 text-base text-text-muted leading-relaxed whitespace-pre-line">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
