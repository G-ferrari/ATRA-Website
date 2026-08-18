import { ArrowRight, ShieldCheck, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* Card de conteúdo — resolve a duplicação #9 do inventário de componentes.
 *
 * No legado o mesmo card era reimplementado em SuccessStories.tsx:181,
 * Blog.tsx:180, Reports.tsx:63 e Insights.tsx:481, com pequenas divergências
 * entre cópias. Aqui é um só, parametrizado. Markup e classes vêm do case, que
 * é a variante mais completa.
 *
 * Não importa `payload-types`: recebe dado já mapeado, conforme
 * docs/02-especificacao/contratos-de-dados.md. */

export type ContentCardProps = {
  href: string
  title: string
  summary: string
  image: { url: string; alt: string; width: number; height: number }
  /** Linha acima do título — no case é o cliente. */
  eyebrow?: string
  eyebrowIcon?: ReactNode
  /** Selo sobre a imagem. */
  badge?: { label: string; icon?: ReactNode }
  /** Métrica em destaque no canto da imagem. */
  highlight?: string
  tags?: string[]
  ctaLabel: string
  /** Prioriza o carregamento — usar nos primeiros cards visíveis. */
  priority?: boolean
  className?: string
}

export function ContentCard({
  href,
  title,
  summary,
  image,
  eyebrow,
  eyebrowIcon,
  badge,
  highlight,
  tags,
  ctaLabel,
  priority = false,
  className,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col bg-surface-2 border border-slate-200 dark:border-white/5 hover:border-primary/40 rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl hover:bg-surface-3 transition-all duration-300 w-full focus:outline-none',
        className,
      )}
    >
      <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9] overflow-hidden relative border-b border-slate-200 dark:border-white/5">
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {badge && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-[4px] bg-secondary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5">
              {badge.icon ?? <ShieldCheck size={12} aria-hidden />} {badge.label}
            </span>
          </div>
        )}

        {highlight && (
          <div className="absolute bottom-3 right-3 bg-surface-1/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-[4px] border border-white/10 text-[11px] font-bold text-emerald-400">
            {highlight}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
        <div>
          {eyebrow && (
            <div className="text-xs text-primary mb-3 flex items-center gap-2 font-bold uppercase tracking-widest">
              {eyebrowIcon}
              <span>{eyebrow}</span>
            </div>
          )}

          <h3 className="text-lg sm:text-xl font-bold font-display text-text-main mb-3 leading-snug group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-text-muted text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
            {summary}
          </p>
        </div>

        <div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-[4px] bg-surface-1 text-[11px] font-medium text-text-muted uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/5"
                >
                  <Tag size={11} className="text-primary/70" aria-hidden /> {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm group-hover:gap-3 transition-all">
              <span>{ctaLabel}</span>
              <ArrowRight size={15} aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
