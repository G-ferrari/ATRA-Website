import { ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

import { BORDAS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import { hrefDe } from '@/lib/routes'
import type { BlocoJobsList } from '@/types/content'
import type { Locale } from '@/lib/locales'

/* Lista de vagas — porte de `legacy/src/pages/Careers.tsx:410`.
 *
 * A lista do legado é hardcoded; aqui vem da collection `jobs`. Cada vaga leva
 * para `/carreiras/[slug]` (MIG-051), não para uma âncora de formulário. */
export function BlocoVagas({ bloco, locale }: { bloco: BlocoJobsList; locale: Locale }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-20 md:py-24 relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {(bloco.eyebrow || bloco.title || bloco.description) && (
          <div className="text-center mb-16">
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
                {bloco.title}
              </h2>
            )}
            {bloco.description && (
              <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light">
                {bloco.description}
              </p>
            )}
          </div>
        )}

        {bloco.vagas.length === 0 ? (
          <p className="text-center text-text-muted text-sm font-light max-w-2xl mx-auto">
            {bloco.emptyText ?? 'Nenhuma vaga aberta no momento. Volte em breve.'}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {bloco.vagas.map((v) => (
              <Link
                key={v.slug}
                href={hrefDe('carreiras', locale, v.slug)}
                className="group flex items-center justify-between p-5 bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase size={18} aria-hidden />
                  </div>
                  <div>
                    <span className="font-semibold text-text-main text-xs sm:text-sm group-hover:text-primary transition-colors block">
                      {v.title}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {v.area} · {v.locationLabel}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
