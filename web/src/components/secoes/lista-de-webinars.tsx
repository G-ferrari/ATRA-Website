import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { EntradaAnimada } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CabecalhoDaSecao, Webinar } from '@/types/content'

import { cabecalhoAberto, RESPIRO_DE_ABERTURA } from './cabecalho-aberto'

/* /webinars (MIG-042) — porte de `legacy/src/pages/Webinars.tsx`, dentro da
 * página-mestra: a grade de todos os webinars, com o cabeçalho do admin. */
export function ListaDeWebinars({
  cabecalho,
  webinars,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  webinars: Webinar[]
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  return (
    <section
      id={anchor ?? undefined}
      className={cn(
        'bg-surface-1 dark:bg-[#0e1015] scroll-mt-32',
        abertura ? `${RESPIRO_DE_ABERTURA} pb-20 md:pb-24` : 'py-20 md:py-24',
      )}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {cabecalhoAberto({
          cabecalho,
          abertura,
          chave: 'cabecalho-webinars',
          classeDaCaixa: 'mb-12 md:mb-16',
          classeDoTitulo: 'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white',
        })}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {webinars.map((w, i) => (
            <EntradaAnimada
              key={w.slug}
              index={i}
              escala
              className="group relative flex flex-col gap-5 bg-surface-2 dark:bg-[#181b22]  hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b]"
            >
              <div className="aspect-video rounded-[6px] overflow-hidden relative shadow-md group cursor-pointer ">
                <Image
                  src={w.image.url}
                  alt={w.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/15 transition-all flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all shadow-lg">
                    <Play className="text-white fill-white ml-1" size={20} aria-hidden />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="px-2.5 py-1 rounded-[4px] bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                    {w.duration}
                  </span>
                  {/* "HD" é literal no legado, igual nos três cards. */}
                  <span className="px-2.5 py-1 rounded-[4px] bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                    HD
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-primary mb-1.5 font-bold uppercase tracking-wider">{w.dateLabel}</div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-text-main dark:text-white group-hover:text-primary transition-colors leading-snug">
                  {/* ⚠️ O cartão inteiro leva ao webinar. No legado ele tinha
                      cursor de mão e hover, mas não era link — e foi portado
                      assim (D-15); em 30/09 o G-ferrari relatou como defeito.
                      O link fica no título, com `after:inset-0` cobrindo o
                      cartão: um link só por cartão, com o título como nome. */}
                  <Link
                    href={hrefDe('webinars', locale, w.slug)}
                    className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-[6px] focus-visible:after:ring-2 focus-visible:after:ring-[#3C98FA]"
                  >
                    {w.title}
                  </Link>
                </h3>
              </div>
            </EntradaAnimada>
          ))}
        </div>
      </div>
    </section>
  )
}
