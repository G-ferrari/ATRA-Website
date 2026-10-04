'use client'

import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { BORDAS } from '@/components/blocks/bordas'
import { congelado } from '@/lib/e2e'
import { TechCornerBraces, TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoFeatureTabs } from '@/types/content'

import { iconePorNome } from './icones'

/* "Soluções Integradas" — porte de `legacy/src/App.tsx:1438`.
 *
 * Lista de abas à esquerda e um cartão grande à direita que troca junto. As
 * abas giram sozinhas a cada 8s; `?e2e=1` prende na primeira, dos dois lados.
 *
 * Passar o mouse (ou o foco do teclado) já seleciona a aba — pedido do
 * G-ferrari em 28/09: só com clique, o card ficava com cara de selecionado no
 * hover e o painel da direita não acompanhava. O clique continua valendo, e é o
 * caminho do celular. ⚠️ A rotação pausa enquanto o ponteiro ou o foco estão na
 * lista: sem isso, o painel trocaria sozinho embaixo do cursor.
 *
 * Dois ajustes de 02/10, quando o marketing montou "Cases de sucesso" com este
 * bloco e só **2** itens (o gabarito tem 4):
 * - a lista só se distribui pela altura do painel a partir de
 *   `MINIMO_PARA_DISTRIBUIR` itens; com menos, fica alinhada em cima — dois
 *   cartões "distribuídos" eram um no topo e outro no rodapé;
 * - o painel tem a altura do **maior** item, e não a do item ativo: todos são
 *   desenhados empilhados na mesma célula, e só o ativo aparece. Antes a seção
 *   crescia e encolhia a cada troca, conforme o tamanho da descrição. */

/** Com 4 cartões (o desenho original) a distribuição preenche a altura do
 *  painel; com 3 ou menos sobram vãos maiores que os próprios cartões. */
const MINIMO_PARA_DISTRIBUIR = 4

export function BlocoAbasDeDestaque({ bloco }: { bloco: BlocoFeatureTabs }) {
  const [ativa, setAtiva] = useState(0)
  const [pausada, setPausada] = useState(false)

  useEffect(() => {
    if (congelado() || pausada) return
    const t = setInterval(() => setAtiva((i) => (i + 1) % bloco.items.length), 8000)
    return () => clearInterval(t)
  }, [bloco.items.length, pausada])

  if (bloco.items.length === 0) return null
  const distribuir = bloco.items.length >= MINIMO_PARA_DISTRIBUIR

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {/* Linhas decorativas da seção, na configuração do gabarito
          (`App.tsx:1490`). Só a home as tem. */}
      <TechHorizontalLine color="orange" align="right" side="top" delay={0.2} />
      <TechVerticalLine color="blue" align="right" alignY="bottom" delay={0.3} />
      <TechCornerBraces color="blue" position="bottom-left" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            {bloco.eyebrow && (
              /* `rounded-md`, não `rounded-[6px]`: é o valor do gabarito
                 (`App.tsx:1497`), e as duas medidas não coincidem. */
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} aria-hidden /> {bloco.eyebrow}
              </div>
            )}
            <h2 className="text-2xl md:text-4xl font-light font-display text-text-main leading-tight">
              {bloco.title}
            </h2>
          </div>
          {bloco.description && (
            <p className="text-text-muted font-light max-w-md text-xs md:text-sm">{bloco.description}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div
            className={cn(
              'lg:col-span-5 flex flex-col gap-2.5',
              distribuir ? 'justify-between lg:gap-0 lg:h-full' : 'justify-start',
            )}
            onMouseEnter={() => setPausada(true)}
            onMouseLeave={() => setPausada(false)}
            onFocus={() => setPausada(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setPausada(false)
            }}
          >
            {bloco.items.map((f, i) => {
              const Icone = iconePorNome(f.icon)
              const atual = i === ativa
              return (
                <button
                  key={f.title}
                  type="button"
                  onClick={() => setAtiva(i)}
                  onMouseEnter={() => setAtiva(i)}
                  onFocus={() => setAtiva(i)}
                  className={cn(
                    'w-full text-left p-4 sm:p-5 rounded-[6px] transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group border',
                    atual
                      ? 'bg-surface-2 shadow-md border-primary/40 text-text-main'
                      : 'bg-surface-2/60 hover:bg-surface-2 border-transparent',
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 border',
                        atual
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-surface-3 text-text-muted border-transparent group-hover:text-primary',
                      )}
                    >
                      <Icone size={18} aria-hidden />
                    </div>
                    <div>
                      {/* A numeração sai da ordem, com zero à esquerda — o
                          gabarito escreve `0{index + 1}` e por isso passa de
                          "09" para "010" na décima aba. Só há quatro. */}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-0.5">
                        0{i + 1} • {f.badge}
                      </span>
                      <h3 className="font-medium text-xs sm:text-sm md:text-base text-text-main">{f.title}</h3>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-transform duration-300',
                      atual
                        ? 'bg-primary/20 text-primary rotate-45'
                        : 'bg-surface-3 text-text-muted opacity-50 group-hover:opacity-100',
                    )}
                  >
                    <ArrowUpRight size={16} aria-hidden />
                  </div>
                </button>
              )
            })}
          </div>

          {/* ⚠️ Todos os painéis na **mesma célula** da grade (`col-start-1
              row-start-1`), e só o ativo visível: a célula fica com a altura do
              maior, e trocar de item não muda a altura da seção. `invisible`
              tira os outros do foco e do leitor de tela sem tirá-los do
              cálculo de altura — `hidden` os tiraria dos dois.

              A troca era `AnimatePresence` (sai um, entra o outro); com todos
              montados virou transição de CSS com o mesmo desenho: o que sai some
              em 150ms, e o que entra espera esses 150ms para aparecer. A
              `visibility` entra na transição para o que sai continuar visível
              enquanto esmaece. */}
          <div className="lg:col-span-7 grid">
            {bloco.items.map((item, i) => {
              const atual = i === ativa
              return (
                <div
                  key={item.title}
                  aria-hidden={!atual}
                  className={cn(
                    'col-start-1 row-start-1 vort-card dark:vort-card-dark h-full min-h-[380px] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden rounded-[6px] shadow-xl dark:shadow-2xl group',
                    'transition-[opacity,transform,visibility,background-color,border-color]',
                    atual
                      ? 'opacity-100 scale-100 visible duration-300 delay-150'
                      : 'opacity-0 scale-[0.98] invisible duration-150 pointer-events-none',
                  )}
                >
                  {item.image && (
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-surface-1 via-surface-1/90 to-surface-1/40 dark:from-[#0f1117] dark:via-[#0f1117]/90 dark:to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-xs font-bold uppercase tracking-wider text-primary mb-6">
                      {item.badge}
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-light font-display text-text-main dark:text-white mb-4 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-text-muted dark:text-white/70 font-light text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-border-main dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {bloco.footnote && (
                      <div className="flex items-center gap-2 text-xs text-text-muted dark:text-white/50 font-light">
                        <CheckCircle2 size={15} className="text-primary" aria-hidden /> {bloco.footnote}
                      </div>
                    )}
                    {bloco.cta && (
                      <Link href={bloco.cta.href} className="pill-btn-primary py-2.5 px-6 text-xs">
                        <span>{bloco.cta.label}</span>
                        <ArrowUpRight size={14} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
