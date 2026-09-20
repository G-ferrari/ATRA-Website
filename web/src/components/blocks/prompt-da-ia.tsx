'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { hrefDe } from '@/lib/routes'
import type { Locale } from '@/lib/locales'
import type { BlocoHomeHero } from '@/types/content'

/* Caixa de conversa com a ATRA AI e a esteira de logos de cliente — porte de
 * `legacy/src/App.tsx:2065`.
 *
 * Renderiza **dentro** do herói, sobre o mesmo canvas: no legado é `children` de
 * `AetherFlowHero`. Ver a nota do campo `prompt` em `blocks/index.ts`.
 *
 * O envio leva para /chat com a mensagem digitada, como no gabarito. A rota
 * ainda não existe (MIG-061); até lá o `push` cai no 404 desenhado, que é o
 * mesmo destino que o legado dá a quem tem JavaScript desligado. */
export function PromptDaIa({
  prompt,
  clientes,
  locale,
}: {
  prompt: NonNullable<BlocoHomeHero['prompt']>
  clientes: BlocoHomeHero['clientes']
  locale: Locale
}) {
  const [texto, setTexto] = useState('')
  const router = useRouter()

  const enviar = () => {
    const limpo = texto.trim()
    if (!limpo) return
    router.push(`${hrefDe('chat', locale)}?q=${encodeURIComponent(limpo)}`)
  }

  /* A esteira leva a lista **duplicada**: é o que faz a emenda não saltar, já
     que a animação vai de 0 a -50%. Mesmo truque da vitrine vertical de /sobre. */
  const esteira = [...clientes, ...clientes]

  return (
    <div className="relative z-10 w-full">
      <section className="py-10 md:py-12 bg-transparent overflow-hidden border-b border-border-main/50 relative z-20">
        {/* Linhas decorativas da seção, na configuração do gabarito
            (`App.tsx:2069`). */}
        <TechHorizontalLine color="orange" align="right" side="top" delay={0.2} />
        <TechVerticalLine color="blue" align="left" alignY="bottom" delay={0.3} />

        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center mb-8">
          {prompt.title && (
            /* `min-h-[50px] sm:h-[90px]` com `flex items-center`: a altura é
               fixa e o título centraliza dentro dela, quebre em uma linha ou
               em duas. */
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-normal font-display text-text-main mb-6 min-h-[50px] sm:h-[90px] flex items-center justify-center tracking-tight leading-tight">
              {prompt.title}
            </h2>
          )}

          <div className="w-full max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                enviar()
              }}
              className="w-full"
            >
              <div className="bg-surface-2 dark:bg-[#141720] rounded-[12px] p-3 sm:p-4 flex flex-col gap-2 shadow-lg focus-within:ring-1 focus-within:ring-primary/50 transition-all text-left">
                <div className="w-full px-1">
                  <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        enviar()
                      }
                    }}
                    placeholder={prompt.placeholder ?? undefined}
                    aria-label={prompt.placeholder ?? 'Mensagem'}
                    rows={2}
                    className="w-full bg-transparent text-text-main dark:text-white text-xs sm:text-sm focus:outline-none placeholder:text-text-muted/60 font-light resize-none h-11 sm:h-12 border-0 focus:ring-0 p-0 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/5">
                  <span className="text-[11px] sm:text-xs font-semibold text-text-muted select-none pl-1">
                    ATRA AI
                  </span>
                  <button
                    type="submit"
                    disabled={!texto.trim()}
                    title="Enviar mensagem"
                    aria-label="Enviar mensagem"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 disabled:hover:bg-primary active:scale-95 transition-all shadow-xs cursor-pointer"
                  >
                    <ArrowRight size={14} aria-hidden />
                  </button>
                </div>
              </div>
            </form>

            {prompt.disclaimer && (
              <p className="text-[10px] md:text-xs text-text-muted tracking-wide mt-3 text-center">
                {prompt.disclaimer}
              </p>
            )}
          </div>
        </div>

        {clientes.length > 0 && (
          <div className="w-full max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200/40 dark:border-slate-800/80">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex-shrink-0 flex items-center gap-6 justify-center md:justify-start w-full md:w-auto">
                {prompt.clientsTitle && (
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest max-w-[180px] leading-relaxed text-center md:text-left whitespace-normal">
                    {prompt.clientsTitle}
                  </span>
                )}
                <div className="hidden md:block w-[1px] h-8 bg-slate-300 dark:bg-slate-700" />
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="w-full py-2 bg-transparent overflow-hidden">
                  <div
                    className="w-full overflow-hidden"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                    }}
                  >
                    <div className="animate-marquee-horizontal py-1">
                      {esteira.map((c, i) => (
                        <div
                          key={`${c.name}-${i}`}
                          className="flex items-center justify-center bg-white dark:bg-white px-4 py-2.5 rounded-[6px] h-14 w-[156px] mx-3.5 shrink-0 shadow-xs hover:scale-105 transition-transform duration-200 cursor-default"
                        >
                          {/* A caixa é fixa e a imagem se ajusta por `max-h`; o
                              next/image fixaria a caixa pelas dimensões do
                              arquivo, e os sete logos têm proporções diferentes. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.logo.url}
                            alt={`Logo ${c.name}`}
                            loading="lazy"
                            decoding="async"
                            className={`${c.enlarge ? 'max-h-10 scale-110' : 'max-h-8'} max-w-full object-contain pointer-events-none opacity-90 hover:opacity-100 transition-all`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
