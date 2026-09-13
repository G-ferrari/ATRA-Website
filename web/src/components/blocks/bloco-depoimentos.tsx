'use client'

import { ChevronLeft, ChevronRight, Quote, ShieldCheck, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

import { BORDAS } from '@/components/blocks/bordas'
import { TechCornerBraces } from '@/components/ui'
import { congelado } from '@/lib/e2e'
import { cn } from '@/lib/utils'
import type { BlocoTestimonialCarousel } from '@/types/content'

/* Iniciais de quem falou, para o monograma. Duas letras quando há nome e
 * sobrenome; a primeira da empresa quando o depoimento é anônimo. */
function iniciais(d: { authorName: string | null; company: string }): string {
  const base = d.authorName?.trim() || d.company
  const partes = base.split(/\s+/).filter(Boolean)
  return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? (partes[partes.length - 1][0] ?? '') : '')).toUpperCase()
}

/* Depoimentos — porte de `legacy/src/App.tsx:1922`.
 *
 * ⚠️ Os depoimentos ficam **todos no DOM**, empilhados na mesma célula de grade,
 * e a troca é opacidade e escala. Não é detalhe de animação: a caixa tem a
 * altura do **maior** depoimento, e um deles tem 600 caracteres. Renderizar só o
 * ativo encolheria a seção conforme o texto, e a página inteira andaria junto. */
export function BlocoDepoimentos({ bloco }: { bloco: BlocoTestimonialCarousel }) {
  const [ativo, setAtivo] = useState(0)
  const total = bloco.items.length

  useEffect(() => {
    if (congelado()) return
    const t = setInterval(() => setAtivo((i) => (i + 1) % total), 8000)
    return () => clearInterval(t)
  }, [total])

  if (total === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <TechCornerBraces color="orange" position="bottom-right" />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10 max-w-7xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-display mb-10 text-text-main">
          {bloco.title}
        </h2>

        <div className="max-w-3xl mx-auto bg-surface-3 p-6 md:p-10 rounded-[6px] shadow-xl relative flex flex-col items-center justify-center">
          <Quote size={32} className="text-primary/40 mb-4" aria-hidden />

          <div className="flex gap-1 justify-center mb-4 text-amber-400">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={16} fill="currentColor" aria-hidden />
            ))}
          </div>

          <div className="flex items-center justify-between w-full gap-2 sm:gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => setAtivo((i) => (i - 1 + total) % total)}
              className="flex w-8 h-8 sm:w-10 sm:h-10 rounded-[6px]  items-center justify-center text-text-muted hover:text-white hover:bg-primary transition-all shrink-0 cursor-pointer active:scale-95"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>

            <div className="relative w-full overflow-hidden flex-1 grid grid-cols-1 grid-rows-1 items-center px-1 sm:px-4">
              {bloco.items.map((d, i) => (
                <div
                  key={`${d.company}-${d.authorRole}`}
                  className={cn(
                    'col-start-1 row-start-1 w-full transition-all duration-500 ease-out flex flex-col items-center',
                    i === ativo
                      ? 'opacity-100 scale-100 pointer-events-auto z-10 translate-y-0'
                      : 'opacity-0 scale-95 pointer-events-none z-0 translate-y-4',
                  )}
                >
                  <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed mb-5 sm:mb-6 text-text-main italic">
                    &quot;{d.quote}&quot;
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    {d.photo ? (
                      /* ⚠️ `<img>` direto, com as classes no próprio elemento —
                         não um wrapper `relative` com `next/image fill`. Os
                         quatro depoimentos ficam empilhados na mesma célula da
                         grade, e o wrapper mudava a altura de cada um o
                         bastante para os avatares pararem em alturas
                         diferentes: no gabarito as quatro máscaras se sobrepõem
                         numa barra só, no porte apareciam separadas. */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.photo.url}
                        alt={d.authorName ?? d.authorRole}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-primary/40 shadow-sm shrink-0"
                      />
                    ) : (
                      /* D-14: sem foto, iniciais em círculo com a cor da marca.
                         O gabarito usa retrato de banco de imagens para
                         representar pessoas reais de ABC Brasil e Banco
                         Carrefour — a decisão foi descartar essas 4 URLs em vez
                         de apresentar rosto de desconhecido como cliente.
                         Mesma caixa de 40/44px, então o layout não muda. */
                      <div
                        aria-hidden
                        data-mascara
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-primary/40 shadow-sm shrink-0 bg-primary/15 text-primary flex items-center justify-center text-[11px] sm:text-xs font-bold tracking-wide"
                      >
                        {iniciais(d)}
                      </div>
                    )}
                    <div className="flex flex-col items-start justify-center text-left">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] bg-primary/20 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck size={12} aria-hidden /> {d.authorRole}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-text-main mt-0.5">
                        {d.authorName ? `${d.authorName} · ${d.company}` : d.company}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAtivo((i) => (i + 1) % total)}
              className="flex w-8 h-8 sm:w-10 sm:h-10 rounded-[6px]  items-center justify-center text-text-muted hover:text-white hover:bg-primary transition-all shrink-0 cursor-pointer active:scale-95"
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>

          <div className="flex gap-2 justify-center mt-8">
            {bloco.items.map((d, i) => (
              <button
                key={`ponto-${d.company}-${d.authorRole}`}
                type="button"
                onClick={() => setAtivo(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                  i === ativo ? 'w-6 bg-primary' : 'w-2 bg-text-muted/30 hover:bg-text-muted',
                )}
                aria-label={`Ir para depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
