import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoIconCardGrid } from '@/types/content'

import { iconePorNome } from './icones'

/* Grade de cards com ícone — porte de `legacy/src/pages/About.tsx:403` e `:434`.
 *
 * As duas ocorrências do legado usam a mesma grade com cards diferentes:
 * `About.tsx:403` é compacto e centralizado; `:434` é card alto alinhado à
 * esquerda. **Os dois só têm título** — a forma é escolha do bloco, não
 * consequência de haver descrição, como assumi em MIG-047. */

/* A rampa responsiva difere por variante, e não é detalhe: no mobile a grade
 * compacta fica em 2 colunas (`About.tsx:403`) e a de cards altos em **1**
 * (`:434`). Aplicar a mesma rampa às duas encurtava `porque-escolher` em 962px
 * no mobile — quase metade do buraco da página. */
const COLUNAS: Record<BlocoIconCardGrid['variant'], Record<2 | 3 | 4, string>> = {
  compact: {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  },
  card: {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  },
  /* E uma terceira rampa: "Vantagens de ser ATRA" (`Careers.tsx:559`) quebra em
   * **sm**, não em md — duas colunas já no celular grande. */
  'card-centered': {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  },
}

export function BlocoGradeDeCards({ bloco }: { bloco: BlocoIconCardGrid }) {
  const compacto = bloco.variant === 'compact'
  /* Mesmo cartão do `card`, centralizado: ícone com `mx-auto` e texto no meio
   * (`Careers.tsx:566`). O `compact` também centraliza, mas não tem descrição. */
  const centrado = bloco.variant === 'card-centered'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {(bloco.eyebrow || bloco.title) && (
          <div className={cn('text-center mb-16', bloco.headerWidth === 'narrow' && 'max-w-3xl mx-auto')}>
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2
                className={cn(
                  'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main',
                  /* ⚠️ 12px que decidem o aceite: /sobre fecha o `h2` com `mb-3`
                     (`About.tsx:398`), "Vantagens de ser ATRA" não (`:554`), e
                     como é o último filho do cabeçalho a margem vira altura. */
                  !centrado && 'mb-3',
                )}
              >
                {bloco.title}
              </h2>
            )}
          </div>
        )}

        <div className={cn('grid', compacto ? 'gap-4' : 'gap-6', COLUNAS[bloco.variant][bloco.columns])}>
          {bloco.items.map((item) => {
            const Icone = iconePorNome(item.icon)

            return compacto ? (
              <div
                key={item.title}
                className="p-5 bg-surface-1  rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-center items-center text-center group"
              >
                <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all">
                  <Icone className="w-5 h-5 text-primary group-hover:text-white transition-colors" aria-hidden />
                </div>
                <span className="text-xs font-semibold text-text-main group-hover:text-primary transition-colors leading-relaxed">
                  {item.title}
                </span>
              </div>
            ) : (
              <div
                key={item.title}
                className={cn(
                  'bg-surface-2  rounded-[6px] p-6 group hover:border-primary/30 transition-all',
                  centrado && 'text-center',
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all',
                    centrado && 'mx-auto',
                  )}
                >
                  <Icone size={centrado ? 22 : 20} aria-hidden />
                </div>
                {item.description ? (
                  <>
                    <h3
                      className={cn(
                        'text-sm font-bold text-text-main mb-2',
                        /* O cartão centralizado não pinta o título no hover
                           (`Careers.tsx:570`) — só a borda reage. */
                        !centrado && 'group-hover:text-primary transition-colors',
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted font-light leading-relaxed">{item.description}</p>
                  </>
                ) : (
                  /* Sem descrição o legado usa <p>, não <h3>: o texto é a frase
                   * inteira do card (`About.tsx:445`). */
                  <p className="text-xs text-text-muted font-light group-hover:text-text-main transition-colors leading-relaxed">
                    {item.title}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
