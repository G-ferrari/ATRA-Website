import { Award, Handshake, Star, Trophy } from 'lucide-react'

import { BORDAS } from '@/components/blocks/bordas'
import { GlowCard, TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoHomeBento } from '@/types/content'

import { ContadorDeTexto } from './contador-de-texto'
import { iconePorNome } from './icones'

/* Bento da home — porte de `legacy/src/App.tsx:1132`.
 *
 * Dois cartões largos em cima (parceiros e selos) e quatro de número embaixo.
 *
 * ⚠️ Não confundir com o `bentoGrid` de MIG-056, que é o da página de solução:
 * aquele tem cards de anatomia própria numa grade de 12 colunas com alturas
 * variáveis; este são seis cartões com três formatos.
 *
 * ⚠️ Os logos de nuvem do primeiro cartão são `<img>` do acervo. No gabarito são
 * ícones do `@iconify/react` buscados em `api.iconify.design` em tempo de
 * execução — e o pacote de ícones `logos` **não está instalado** lá. Dentro do
 * container do aceite, sem rede, o legado renderiza `<span></span>` vazio nos
 * três. Servir o logo real é o produto certo; a diferença fica nas três caixas
 * de 28px e está registrada em debito-tecnico.md. */
export function BlocoBentoDaHome({ bloco }: { bloco: BlocoHomeBento }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 relative z-20 scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {/* Linhas decorativas da seção, na configuração do gabarito
          (`App.tsx:1144`). Só a home as tem. */}
      <TechHorizontalLine color="blue" align="left" side="bottom" delay={0.2} />
      <TechVerticalLine color="orange" align="right" alignY="top" delay={0.3} />

      <div className="container mx-auto px-4 max-w-7xl touch-pan-y">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 touch-pan-y">
          {bloco.partnerCard && (
            <div className="md:col-span-12 lg:col-span-5 h-full touch-pan-y">
              <GlowCard
                glowColor="blue"
                customSize
                radius={6}
                className="p-6 sm:p-7 bg-surface-2 text-text-main shadow-lg h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 rounded-[6px] touch-pan-y"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {bloco.partnerCard.eyebrow && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        <Handshake size={14} aria-hidden /> {bloco.partnerCard.eyebrow}
                      </div>
                    )}
                  </div>
                  {bloco.partnerCard.title && (
                    <h3 className="text-xl sm:text-2xl font-extrabold font-display text-text-main mb-2">
                      {bloco.partnerCard.title}
                    </h3>
                  )}
                  {bloco.partnerCard.description && (
                    <p className="text-sm text-text-muted leading-relaxed mb-5 font-light">
                      {bloco.partnerCard.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2.5 mt-2">
                  {bloco.partnerCard.items.map((i) => (
                    <div
                      key={i.name}
                      className="p-2.5 rounded-[6px] flex items-center gap-2.5 hover:bg-surface-1/70 transition-all group/item bg-surface-1/40"
                    >
                      <div className="w-7 h-7 rounded-[6px] bg-white/10 dark:bg-white/5 flex items-center justify-center shrink-0">
                        {i.logo && (
                          // eslint-disable-next-line @next/next/no-img-element -- caixa fixa de 20px, largura pelo aspecto
                          <img src={i.logo.url} alt={i.logo.alt} width={20} className="shrink-0 object-contain" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-text-main truncate group-hover/item:text-primary transition-colors">
                          {i.name}
                        </p>
                        {i.subtitle && <p className="text-[9px] text-text-muted truncate">{i.subtitle}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>
          )}

          {bloco.sealsCard && (
            <div className="md:col-span-12 lg:col-span-7 h-full">
              <GlowCard
                glowColor="orange"
                customSize
                radius={6}
                className="p-6 sm:p-8 bg-surface-2 text-text-main shadow-lg h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 rounded-[6px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {bloco.sealsCard.eyebrow && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                        <Trophy size={14} aria-hidden /> {bloco.sealsCard.eyebrow}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 my-2">
                    {bloco.sealsCard.seals.length > 0 && (
                      /* Os dois selos dividem **uma** caixa branca, com um
                         divisor de 1px entre eles — não são duas caixas. */
                      <div className="flex items-center justify-center gap-4 shrink-0 bg-white p-3 sm:p-3.5 rounded-[6px] shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                        {bloco.sealsCard.seals.map((s, i) => (
                          <div key={s.url} className="flex items-center gap-4">
                            {i > 0 && <div className="w-[1px] h-20 sm:h-24 bg-slate-200" />}
                            {/* eslint-disable-next-line @next/next/no-img-element -- altura fixa, largura pelo aspecto */}
                            <img
                              src={s.url}
                              alt={s.alt}
                              loading="lazy"
                              decoding="async"
                              className={cn(
                                'w-auto object-contain shrink-0',
                                i === 0 ? 'h-28 sm:h-32' : 'h-22 sm:h-26',
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-center sm:text-left flex-1">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-text-main tracking-tight leading-none mb-2">
                        {bloco.sealsCard.counter && <ContadorDeTexto value={bloco.sealsCard.counter} />}{' '}
                        {bloco.sealsCard.title}
                      </h3>
                      {bloco.sealsCard.description && (
                        <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light">
                          {bloco.sealsCard.description}
                        </p>
                      )}
                      {bloco.sealsCard.badge && (
                        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-[4px] bg-amber-400/10 text-amber-500 text-xs font-bold">
                          <Star size={12} className="fill-amber-400 text-amber-400" aria-hidden />
                          <span>{bloco.sealsCard.badge}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {bloco.sealsCard.footnote && (
                  <div className="mt-6 pt-4 border-t border-border-main/60 flex items-center justify-between text-xs text-text-muted font-light">
                    <span>{bloco.sealsCard.footnote}</span>
                    <Award size={18} className="text-secondary shrink-0" aria-hidden />
                  </div>
                )}
              </GlowCard>
            </div>
          )}

          {bloco.metrics.length > 0 && (
            <div className="md:col-span-12 lg:col-span-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-5">
              {bloco.metrics.map((m) => {
                const Icone = iconePorNome(m.icon)
                const laranja = m.color === 'secondary'
                return (
                  <div key={m.label}>
                    <GlowCard
                      glowColor={laranja ? 'orange' : 'blue'}
                      customSize
                      radius={6}
                      className="p-4 sm:p-5 bg-surface-2 text-text-main shadow-md flex flex-col justify-between gap-4 h-full rounded-[6px]"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0',
                            laranja ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary',
                          )}
                        >
                          <Icone size={18} aria-hidden />
                        </div>
                        <span
                          className={cn(
                            'text-[10px] font-bold uppercase tracking-wider',
                            laranja ? 'text-secondary' : 'text-primary',
                          )}
                        >
                          {m.tag}
                        </span>
                      </div>
                      {/* `pl-[1px]` é do gabarito (`App.tsx:1312`): 1px de
                          alinhamento ótico do número contra o ícone acima. */}
                      <div className="mt-5 mb-5 pl-[1px]">
                        <h4 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-main leading-none mb-1">
                          <ContadorDeTexto value={m.value} />
                        </h4>
                        <p className="text-[11px] sm:text-xs font-normal text-text-muted leading-relaxed">{m.label}</p>
                      </div>
                    </GlowCard>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
