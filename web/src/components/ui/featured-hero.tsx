'use client'

import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

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
   * (`FeaturedHero.tsx:130`), levando à página do evento. */
  acaoSecundaria?: { label: string; href: string }
  /** Intervalo da rotação automática, em ms. */
  intervalo?: number
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
}: FeaturedHeroProps) {
  const [indiceAtivo, setIndiceAtivo] = useState(0)

  useEffect(() => {
    if (congelado()) return // regressão visual: fixa no primeiro destaque
    const timer = setTimeout(() => {
      setIndiceAtivo((atual) => (atual + 1) % items.length)
    }, intervalo)
    return () => clearTimeout(timer)
  }, [indiceAtivo, items.length, intervalo])

  const ativo = items[indiceAtivo] ?? items[0]
  if (!ativo) return null

  return (
    <section className="bg-surface-1 text-text-main pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 relative overflow-hidden flex flex-col justify-center border-b border-border-main/40">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-5 leading-tight tracking-tight text-text-main font-display">
                {ativo.title}
              </h1>
              {ativo.description && (
                <p className="text-xs sm:text-base lg:text-lg text-text-muted mb-5 sm:mb-7 max-w-2xl leading-relaxed font-light">
                  {ativo.description}
                </p>
              )}
              {ativo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-7">
                  {ativo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href={ativo.href} className="pill-btn-primary py-3 px-6 text-xs sm:text-sm font-bold justify-center">
                  {actionIcon}
                  <span>{actionLabel}</span>
                  {!actionIcon && <ArrowRight size={16} aria-hidden />}
                </Link>
                {acaoSecundaria && (
                  <Link
                    href={acaoSecundaria.href}
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
                  'overflow-hidden shadow-xl sm:shadow-2xl relative w-full border border-slate-200 dark:border-white/10 rounded-[6px] bg-surface-2',
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 sm:p-6">
                    <div className="text-white font-bold text-base sm:text-lg uppercase tracking-widest opacity-90">
                      {rotuloDaCapa}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 md:mt-12 w-full flex overflow-x-auto no-scrollbar gap-3 sm:gap-6 pt-5 border-t border-border-main/30">
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
              <div className="h-1 w-full bg-slate-200 dark:bg-white/10 mb-3 overflow-hidden rounded-sm relative">
                {indiceAtivo === idx && (
                  <motion.div
                    key={indiceAtivo}
                    className="absolute top-0 left-0 h-full bg-primary origin-left w-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ ease: 'linear', duration: intervalo / 1000 }}
                  />
                )}
                {indiceAtivo > idx && (
                  <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-white/20 w-full" />
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-text-main mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              {item.thumbLabel && (
                <div className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-widest font-semibold">
                  {item.thumbLabel}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
