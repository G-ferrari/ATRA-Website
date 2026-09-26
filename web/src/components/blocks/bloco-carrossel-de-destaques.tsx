'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

import { BORDAS } from '@/components/blocks/bordas'
import { congelado } from '@/lib/e2e'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { BlocoHighlightCarousel } from '@/types/content'

/* Carrossel de destaques da home (reunião de 24/09): banners editáveis no
 * admin, abaixo dos números. Nasceu com a RC18 e recebe os próximos destaques
 * pelo CMS, sem código.
 *
 * Um banner por vez, trocado por `translateX` — o trilho tem a altura do
 * banner mais alto, então trocar não empurra a página. No celular a imagem vai
 * em cima (16:9) e o texto embaixo; no computador, lado a lado. Sem imagem, o
 * banner ocupa a largura com o gradiente da marca, em vez de reservar uma caixa
 * vazia.
 *
 * O avanço automático pausa com o mouse em cima ou o foco dentro, espera a aba
 * voltar a ficar visível, e não acontece com `prefers-reduced-motion` nem com
 * `?e2e=1` — o teste precisa do primeiro banner parado. */

const INTERVALO_MS = 7000
/** Deslocamento mínimo do dedo para contar como gesto, e não toque no botão. */
const LIMIAR_DO_GESTO_PX = 48

const TEXTOS = {
  pt: {
    rotulo: 'Destaques',
    anterior: 'Destaque anterior',
    proximo: 'Próximo destaque',
    irPara: (n: number) => `Ir para o destaque ${n}`,
    posicao: (n: number, total: number) => `${n} de ${total}`,
  },
  en: {
    rotulo: 'Highlights',
    anterior: 'Previous highlight',
    proximo: 'Next highlight',
    irPara: (n: number) => `Go to highlight ${n}`,
    posicao: (n: number, total: number) => `${n} of ${total}`,
  },
} as const

/* Link absoluto abre em nova aba, como no bloco de CTA. */
const propsExternas = (href: string) =>
  /^https?:\/\//i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}

export function BlocoCarrosselDeDestaques({ bloco, locale }: { bloco: BlocoHighlightCarousel; locale: Locale }) {
  const t = TEXTOS[locale]
  const total = bloco.items.length
  const [atual, setAtual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const inicioDoGesto = useRef<number | null>(null)

  const irPara = (i: number) => setAtual(((i % total) + total) % total)

  /* `atual` nas dependências: navegar à mão reinicia a contagem, e o banner
     que a pessoa escolheu ganha os 7 segundos inteiros. */
  useEffect(() => {
    if (!bloco.autoplay || total < 2 || pausado || congelado()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setAtual((a) => (a + 1) % total)
    }, INTERVALO_MS)
    return () => window.clearInterval(id)
  }, [bloco.autoplay, total, pausado, atual])

  // Gesto só no toque: no computador as setas bastam, e arrastar com o mouse
  // brigaria com a seleção de texto.
  const aoTocar = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') inicioDoGesto.current = e.clientX
  }
  const aoSoltar = (e: PointerEvent) => {
    if (inicioDoGesto.current === null) return
    const delta = e.clientX - inicioDoGesto.current
    inicioDoGesto.current = null
    if (Math.abs(delta) > LIMIAR_DO_GESTO_PX) irPara(atual + (delta < 0 ? 1 : -1))
  }

  const fundoDoBanner = bloco.theme === 'surface-2' ? 'bg-surface-3' : 'bg-surface-2'

  /* ⚠️ Sem respiro próprio no fundo da página. Pedido do designer em 26/09:
     entre a seção de cima e a de baixo havia 192px de cada lado (96 da vizinha
     + 96 daqui, o ritmo `py-16 md:py-24` de seção), e ele pediu metade — que é
     exatamente o que as vizinhas já dão sozinhas. Em faixa de outra cor o
     banner encostaria na borda dela, então ali volta o ritmo de faixa do
     DESIGN.md (`py-10 md:py-14`). Por isso o campo "Espaçamento" comum aos
     blocos não vale para este. */
  const respiro = bloco.theme === 'surface-2' ? 'py-10 md:py-14' : 'py-0'

  return (
    <section
      id={bloco.anchor ?? undefined}
      aria-roledescription="carrossel"
      aria-label={bloco.title ?? t.rotulo}
      className={cn(
        'overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        respiro,
        BORDAS[bloco.borda],
      )}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {bloco.title && (
          <h2 className="text-3xl md:text-5xl font-light font-display text-text-main leading-tight mb-8 md:mb-12">
            {bloco.title}
          </h2>
        )}

        <div
          className="relative overflow-hidden rounded-[12px] shadow-sm touch-pan-y"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausado(false)
          }}
          onPointerDown={aoTocar}
          onPointerUp={aoSoltar}
          onPointerCancel={() => (inicioDoGesto.current = null)}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${atual * 100}%)` }}
            aria-live={bloco.autoplay && !pausado ? 'off' : 'polite'}
          >
            {bloco.items.map((item, i) => {
              const ativo = i === atual
              return (
                <div
                  key={`${item.title}-${i}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t.posicao(i + 1, total)}
                  aria-hidden={!ativo}
                  // Fora de vista, o botão do banner não pode receber foco.
                  inert={!ativo}
                  className="w-full shrink-0"
                >
                  <Banner item={item} fundo={fundoDoBanner} primeiro={i === 0} />
                </div>
              )
            })}
          </div>
        </div>

        {total > 1 && (
          <div className="mt-4 md:mt-5 flex items-center justify-between gap-6">
            <div className="flex items-center">
              {bloco.items.map((item, i) => (
                <button
                  key={`${item.title}-${i}`}
                  type="button"
                  onClick={() => irPara(i)}
                  aria-label={t.irPara(i + 1)}
                  aria-current={i === atual}
                  // A área de toque é o botão inteiro; a barra é só o desenho.
                  className="py-3 px-1 cursor-pointer group"
                >
                  <span
                    className={cn(
                      'block h-1 rounded-full transition-all duration-300',
                      i === atual
                        ? 'w-8 bg-primary'
                        : 'w-4 bg-slate-300 group-hover:bg-slate-400 dark:bg-white/20 dark:group-hover:bg-white/35',
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {([-1, 1] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => irPara(atual + d)}
                  aria-label={d === -1 ? t.anterior : t.proximo}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-[6px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all active:scale-90 cursor-pointer shadow-xs"
                >
                  {d === -1 ? <ChevronLeft size={20} aria-hidden /> : <ChevronRight size={20} aria-hidden />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Banner({
  item,
  fundo,
  primeiro,
}: {
  item: BlocoHighlightCarousel['items'][number]
  fundo: string
  primeiro: boolean
}) {
  const texto = (
    <div className="relative flex flex-col justify-center gap-4 p-6 sm:p-8 md:p-12">
      {item.tag && (
        <span className="self-start inline-flex items-center px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
          {item.tag}
        </span>
      )}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-light font-display text-text-main leading-tight max-w-2xl">
        {item.title}
      </h3>
      {item.description && (
        <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-xl">{item.description}</p>
      )}
      {item.cta && (
        <Link href={item.cta.href} {...propsExternas(item.cta.href)} className="pill-btn-primary self-start mt-2 group">
          {item.cta.label}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden />
        </Link>
      )}
    </div>
  )

  if (!item.image) {
    /* Sem imagem: o texto ocupa a largura, sobre o gradiente da marca. Os dois
       brilhos são a "corrente azul→laranja" do DESIGN.md, em baixa opacidade —
       pontuação, não parede. Par claro/escuro com o valor escuro por último. */
    return (
      <article className="relative h-full min-h-[320px] md:min-h-[380px] overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-[#12151c] dark:via-[#181b22] dark:to-[#18202e] flex items-center">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 md:h-[28rem] md:w-[28rem] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 right-1/4 h-56 w-56 md:h-72 md:w-72 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
        {texto}
      </article>
    )
  }

  return (
    <article className={cn('h-full grid md:grid-cols-2 md:min-h-[380px]', fundo)}>
      <div className="relative aspect-video md:aspect-auto md:order-2">
        <Image
          src={item.image.url}
          alt={item.image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={primeiro}
          className="object-cover"
        />
      </div>
      <div className="md:order-1 flex">{texto}</div>
    </article>
  )
}
