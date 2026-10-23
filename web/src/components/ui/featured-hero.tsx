'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { congelado } from '@/lib/e2e'
import { cn } from '@/lib/utils'
import type { Image as Imagem } from '@/types/content'

/* Hero de destaques rotativos — porte de `legacy/src/components/FeaturedHero.tsx`.
 *
 * O legado decide texto de ação, ícone e subtexto por um `type` ('blog',
 * 'case', 'webinar', 'ebook', 'report'). Aqui esses valores chegam prontos por
 * prop: o componente não conhece o tipo de conteúdo nem o CMS
 * (contratos-de-dados.md). Quem compõe é a página, que já sabe o locale.
 *
 * Usado hoje só em cases; as outras 4 listagens do legado reusam o mesmo. */

export type FeaturedItem = {
  id: string
  title: string
  description: string | null
  tags: string[]
  image: Imagem
  href: string
  /** Linha superior, acima do título. Já formatada pela página. */
  eyebrow: string | null
  /** Legenda de cada miniatura na régua de baixo. */
  thumbLabel: string | null
  /* "ATRA na mídia" (D-49): o destaque leva para fora do site, e o texto do
   * botão depende do item — "Leia a matéria" ou "Assistir". Os dois são
   * opcionais; sem eles vale o comportamento de sempre. */
  /** O destino é outro site: abre em outra aba. */
  externo?: boolean
  /** Texto do botão só para este item; sem ele, vale o `actionLabel` do hero. */
  actionLabel?: string
}

export type FeaturedHeroProps = {
  items: FeaturedItem[]
  /* `cover` é o formato de material rico: capa 3/4 estreita com uma faixa
   * escura embaixo (`legacy/src/components/FeaturedHero.tsx:139`). `wide` é o
   * 16/10 de case e blog. */
  variante?: 'wide' | 'cover'
  /** Texto da faixa sobre a capa. Só em `cover`. */
  rotuloDaCapa?: string
  actionLabel: string
  eyebrowIcon: ReactNode
  /** Sem ícone próprio, o legado fecha o botão com uma seta. */
  actionIcon?: ReactNode
  /* Botão secundário. Só webinar tem um no legado
   * (`FeaturedHero.tsx:130`), levando à página do evento.
   *
   * ⚠️ Sem `href`: o destino é o do item **ativo**. Antes a página passava o
   * endereço do primeiro webinar, e "Ver detalhes" levava a ele mesmo com
   * outro destaque na tela. */
  acaoSecundaria?: { label: string }
  /** Intervalo da rotação automática, em ms. */
  intervalo?: number
  /** O carrossel abre a página (o normal): o título do item é o `h1` dela e o
   *  respiro de cima é o de abertura, sob o cabeçalho fixo. Com outro bloco
   *  acima (D-55, a editora decide a ordem), vira `h2` e respiro de seção. */
  abertura?: boolean
  /** Âncora da seção, quando o bloco tem uma. */
  id?: string
  /** Rótulos das setas da régua de miniaturas, no idioma da página. */
  rotulosDaRegua?: { anteriores: string; proximos: string }
}

/** Largura do esmaecido nas bordas da régua que têm mais miniaturas. */
const ESMAECIDO = 48

/** Rolagem suave, menos para quem pediu ao sistema menos movimento. */
function rolagem(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/* O esmaecido é máscara, e não um degradê pintado por cima: o fundo do herói
   tem manchas coloridas, e uma faixa da cor da página apareceria sobre elas. */
function mascaraDaRegua(sobra: { antes: boolean; depois: boolean }): CSSProperties | undefined {
  if (!sobra.antes && !sobra.depois) return undefined
  const mascara = `linear-gradient(to right, transparent 0, #000 ${sobra.antes ? ESMAECIDO : 0}px, #000 calc(100% - ${sobra.depois ? ESMAECIDO : 0}px), transparent 100%)`
  return { maskImage: mascara, WebkitMaskImage: mascara }
}

export function FeaturedHero({
  items,
  actionLabel,
  eyebrowIcon,
  actionIcon,
  acaoSecundaria,
  variante = 'wide',
  rotuloDaCapa,
  intervalo = 5000,
  abertura = true,
  id,
  rotulosDaRegua = { anteriores: 'Destaques anteriores', proximos: 'Próximos destaques' },
}: FeaturedHeroProps) {
  const Titulo = abertura ? 'h1' : 'h2'
  const [indiceAtivo, setIndiceAtivo] = useState(0)
  const [pausado, setPausado] = useState(false)
  const reguaRef = useRef<HTMLDivElement>(null)
  /** Se há miniatura escondida antes e depois da parte visível da régua. */
  const [sobra, setSobra] = useState({ antes: false, depois: false })

  useEffect(() => {
    if (congelado() || pausado) return // regressão visual: fixa no primeiro destaque
    const timer = setTimeout(() => {
      setIndiceAtivo((atual) => (atual + 1) % items.length)
    }, intervalo)
    return () => clearTimeout(timer)
  }, [indiceAtivo, items.length, intervalo, pausado])

  const medirRegua = useCallback(() => {
    const el = reguaRef.current
    if (!el) return
    // 1px de folga: o `scrollLeft` sai fracionado com zoom do navegador.
    const antes = el.scrollLeft > 1
    const depois = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    setSobra((s) => (s.antes === antes && s.depois === depois ? s : { antes, depois }))
  }, [])

  useEffect(() => {
    const el = reguaRef.current
    if (!el) return
    medirRegua()
    const observador = new ResizeObserver(medirRegua)
    observador.observe(el)
    return () => observador.disconnect()
  }, [medirRegua, items.length])

  /* A régua acompanha o destaque ativo, inclusive na rotação automática. Conta
     feita à mão, e não `scrollIntoView`: aquele rola também a página, e o
     visitante que desceu para a lista seria puxado de volta ao topo. */
  useEffect(() => {
    const el = reguaRef.current
    const miniatura = el?.children[indiceAtivo] as HTMLElement | undefined
    if (!el || !miniatura) return
    const inicio = miniatura.offsetLeft
    const fim = inicio + miniatura.offsetWidth
    if (inicio < el.scrollLeft) el.scrollTo({ left: Math.max(0, inicio - ESMAECIDO), behavior: rolagem() })
    else if (fim > el.scrollLeft + el.clientWidth)
      el.scrollTo({ left: fim - el.clientWidth + ESMAECIDO, behavior: rolagem() })
  }, [indiceAtivo])

  const rolarRegua = (direcao: -1 | 1) => {
    const el = reguaRef.current
    el?.scrollBy({ left: direcao * el.clientWidth * 0.75, behavior: rolagem() })
  }

  const ativo = items[indiceAtivo] ?? items[0]
  if (!ativo) return null

  return (
    <section
      id={id}
      className={cn(
        'bg-surface-1 text-text-main pb-10 sm:pb-14 relative overflow-hidden flex flex-col justify-center border-b border-border-main/40 scroll-mt-32',
        abertura ? 'pt-28 sm:pt-36 md:pt-44' : 'pt-16 md:pt-20',
      )}
    >
      {/* Decoração: manchas de gradiente. Porte fiel — D-15. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-surface-1">
        <div
          className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.7) 0%, rgba(147, 197, 253, 0) 60%)' }}
        />
        <div
          className="absolute top-[10%] -right-[15%] w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.6) 0%, rgba(253, 186, 116, 0) 60%)' }}
        />
        <div
          className="absolute -bottom-[20%] left-[25%] w-[75vw] h-[75vw] md:w-[45vw] md:h-[45vw] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(191, 219, 254, 0.8) 0%, rgba(191, 219, 254, 0) 60%)' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={ativo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16"
          >
            <div className="w-full">
              {ativo.eyebrow && (
                <div className="text-xs sm:text-sm font-bold text-primary mb-3 sm:mb-5 flex items-center gap-2 uppercase tracking-widest">
                  {eyebrowIcon}
                  <span>{ativo.eyebrow}</span>
                </div>
              )}
              <Titulo className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-5 leading-tight tracking-tight text-text-main font-display">
                {ativo.title}
              </Titulo>
              {ativo.description && (
                <p className="text-base lg:text-lg text-text-muted mb-5 sm:mb-7 max-w-2xl leading-relaxed">
                  {ativo.description}
                </p>
              )}
              {ativo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-7">
                  {ativo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-surface-2 rounded-[6px] text-xs font-semibold uppercase tracking-wider text-primary shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href={ativo.href}
                  {...(ativo.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="pill-btn-primary py-3 px-6 text-xs sm:text-sm font-bold justify-center"
                >
                  {actionIcon}
                  <span>{ativo.actionLabel ?? actionLabel}</span>
                  {!actionIcon && <ArrowRight size={16} aria-hidden />}
                </Link>
                {acaoSecundaria && (
                  <Link
                    href={ativo.href}
                    className="pill-btn-outline py-3 px-6 text-xs sm:text-sm font-bold justify-center"
                  >
                    {acaoSecundaria.label}
                  </Link>
                )}
              </div>
            </div>

            <div className="w-full flex justify-center lg:justify-end relative group">
              <div
                className={cn(
                  'overflow-hidden shadow-xl sm:shadow-2xl relative w-full rounded-[6px] bg-surface-2',
                  variante === 'cover' ? 'aspect-[3/4] max-w-xs sm:max-w-sm p-2' : 'aspect-[16/10]',
                )}
              >
                {/* Invólucro relativo em vez de `fill` direto no contêiner:
                    `fill` é `absolute inset-0` e **ignora padding**, então na
                    variante `cover` a imagem cobria os 8px de `p-2` que no
                    legado aparecem como moldura. */}
                <div className="relative w-full h-full">
                  <Image
                    src={ativo.image.url}
                    alt={ativo.image.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[6px]"
                  />
                </div>

                {variante === 'cover' && rotuloDaCapa && (
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 sm:p-6">
                    <div className="text-white font-bold text-base sm:text-lg uppercase tracking-widest opacity-90">
                      {rotuloDaCapa}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* A régua de miniaturas (#32). Com mais de 4 destaques — webinars e
            e-books entram todos — ela passa da largura. Era `no-scrollbar`, uma
            classe que o Tailwind 4 não tem: aparecia a barra nativa, e o que
            passava da borda ficava cortado sem aviso. Agora a barra some, a
            borda com mais itens esmaece, as setas rolam (do `sm` para cima; no
            celular é o dedo) e a régua acompanha o destaque ativo. Com o
            ponteiro ou o foco nela, a rotação para — senão o destaque trocaria
            embaixo de quem está escolhendo. */}
        <div
          className="relative mt-8 md:mt-12 pt-5 border-t border-border-main/30"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPausado(false)
          }}
        >
          <div
            ref={reguaRef}
            onScroll={medirRegua}
            className="relative w-full flex overflow-x-auto gap-3 sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={mascaraDaRegua(sobra)}
          >
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndiceAtivo(idx)}
                className={cn(
                  'text-left opacity-50 hover:opacity-100 transition-all cursor-pointer group min-w-[200px] sm:min-w-[240px] flex-1',
                  indiceAtivo === idx && 'opacity-100',
                )}
              >
                <div className="h-1 w-full bg-slate-200 dark:bg-white/10 mb-3 overflow-hidden rounded-[4px] relative">
                  {indiceAtivo === idx &&
                    (pausado ? (
                      <div className="absolute top-0 left-0 h-full bg-primary w-full" />
                    ) : (
                      <motion.div
                        key={indiceAtivo}
                        className="absolute top-0 left-0 h-full bg-primary origin-left w-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ ease: 'linear', duration: intervalo / 1000 }}
                      />
                    ))}
                  {indiceAtivo > idx && (
                    <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-white/20 w-full" />
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-text-main mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                {item.thumbLabel && (
                  <div className="text-xs text-text-muted uppercase tracking-widest font-semibold">
                    {item.thumbLabel}
                  </div>
                )}
              </button>
            ))}
          </div>

          {(
            [
              [-1, sobra.antes, rotulosDaRegua.anteriores, 'left-0', ChevronLeft],
              [1, sobra.depois, rotulosDaRegua.proximos, 'right-0', ChevronRight],
            ] as const
          ).map(([direcao, visivel, rotulo, lado, Seta]) =>
            visivel ? (
              <button
                key={direcao}
                type="button"
                onClick={() => rolarRegua(direcao)}
                aria-label={rotulo}
                className={cn(
                  'hidden sm:flex absolute top-7 z-10 w-9 h-9 items-center justify-center rounded-[6px] bg-surface-2 text-text-main shadow-md hover:bg-primary hover:text-white active:scale-95 transition-all cursor-pointer',
                  lado,
                )}
              >
                <Seta size={18} aria-hidden />
              </button>
            ) : null,
          )}
        </div>
      </div>
    </section>
  )
}
