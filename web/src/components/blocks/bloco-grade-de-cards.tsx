import type { ReactNode } from 'react'

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

/* Cor do traço do ícone; a caixa fica sempre azul-clara (bg-primary/10), como no
   legado — só o traço intercala azul/laranja (`accent`, injetado pela página). */
const COR_ICONE = { primary: 'text-primary', secondary: 'text-secondary' } as const

/* Agrupa título e descrição ao lado do ícone no cartão em linha; fora dele, os
 * devolve sem caixa nenhuma, e o cartão sai com o DOM de antes. Fora do
 * componente: a regra de lint proíbe criar componente dentro de outro. */
function Envolve({ quando, children }: { quando: boolean; children: ReactNode }) {
  return quando ? <div className="min-w-0 pt-0.5 md:pt-0">{children}</div> : <>{children}</>
}

export function BlocoGradeDeCards({ bloco }: { bloco: BlocoIconCardGrid }) {
  const compacto = bloco.variant === 'compact'
  /* Mesmo cartão do `card`, centralizado: ícone com `mx-auto` e texto no meio
   * (`Careers.tsx:566`). O `compact` também centraliza, mas não tem descrição. */
  const centrado = bloco.variant === 'card-centered'
  const emLinha = Boolean(bloco.compactoNoCelular) && bloco.variant === 'card'

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
          <div
            className={cn(
              'text-center mb-16',
              bloco.compactoNoCelular && 'mb-10 md:mb-16',
              bloco.headerWidth === 'narrow' && 'max-w-3xl mx-auto',
            )}
          >
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

        <div
          className={cn(
            'grid',
            compacto ? 'gap-4' : 'gap-6',
            emLinha && 'gap-3 md:gap-6',
            COLUNAS[bloco.variant][bloco.columns],
          )}
        >
          {bloco.items.map((item) => {
            const Icone = iconePorNome(item.icon)

            return compacto ? (
              <div
                key={item.title}
                className="p-5 bg-surface-1  rounded-[6px] hover:shadow-md motion-safe:hover:-translate-y-0.5 transition duration-200 flex flex-col justify-center items-center text-center group"
              >
                <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all">
                  <Icone
                    className={cn('w-5 h-5 group-hover:text-white transition-colors', COR_ICONE[item.accent ?? 'primary'])}
                    aria-hidden
                  />
                </div>
                <span className="text-xs font-semibold text-text-main group-hover:text-primary transition-colors leading-relaxed">
                  {item.title}
                </span>
              </div>
            ) : (
              <div
                key={item.title}
                className={cn(
                  /* ⚠️ Sombra de repouso (shadow-sm): sem ela o card `bg-surface-2`
                     some sobre uma seção `surface-2` no tema claro (#fff sobre #fff,
                     sem borda) — o gate só-escuro não pega. `shadow-sm` é a sombra
                     de repouso do sistema; hover sobe para `shadow-md`. O antigo
                     `hover:border-primary/30` era inerte (cor de borda sem largura). */
                  'bg-surface-2 rounded-[6px] p-6 group shadow-sm transition duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5',
                  centrado && 'text-center',
                  /* No celular, ícone ao lado do texto: o cartão perde a faixa do
                     ícone em cima e o respiro largo, e a seção encolhe pela metade. */
                  emLinha && 'flex items-start gap-4 p-4 md:block md:p-6',
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-[6px] bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all',
                    COR_ICONE[item.accent ?? 'primary'],
                    centrado && 'mx-auto',
                    emLinha && 'w-10 h-10 shrink-0 mb-0 md:w-12 md:h-12 md:mb-4',
                  )}
                >
                  <Icone size={centrado ? 22 : 20} aria-hidden />
                </div>
                <Envolve quando={emLinha}>
                {item.description ? (
                  <>
                    <h3
                      className={cn(
                        'text-sm font-bold text-text-main mb-2',
                        emLinha && 'mb-1 md:mb-2',
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
                </Envolve>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
