import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import type { BlocoCtaBanner } from '@/types/content'

import { TextoDestacado } from './texto-destacado'

/* Faixa de chamada — porte de `legacy/src/components/CaseDetailBase.tsx:185`,
 * a mesma caixa que fecha `About.tsx:456`.
 *
 * Sem o bloco de telefone e e-mail que a versão do case tem: aquele é o
 * `ctaContact` (MIG-053), que carrega formulário. Aqui é só a faixa. */
export function BlocoCta({ bloco }: { bloco: BlocoCtaBanner }) {
  const azul = bloco.variant === 'primary'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn('py-24 scroll-mt-32', bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-slate-50')}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            'rounded-[6px] p-8 md:p-16 text-center relative overflow-hidden',
            azul
              ? 'bg-primary text-white shadow-xl shadow-primary/20'
              : 'bg-surface-2 text-text-main border border-slate-200 dark:border-white/10',
          )}
        >
          {azul && (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </>
          )}

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              <TextoDestacado
                texto={bloco.title}
                destaque={bloco.highlight}
                className={azul ? 'text-secondary' : 'text-primary font-normal'}
              />
            </h2>

            {bloco.description && (
              <p className={cn('text-lg mb-12', azul ? 'text-white/80' : 'text-text-muted')}>
                {bloco.description}
              </p>
            )}

            {bloco.cta && (
              <Link
                href={bloco.cta.href}
                className={cn(
                  'inline-flex items-center gap-3 px-10 py-5 rounded-[6px] font-bold text-lg transition-all hover:-translate-y-1 shadow-lg',
                  azul ? 'bg-secondary hover:bg-orange-600 text-white' : 'bg-primary hover:bg-primary-dark text-white',
                )}
              >
                {bloco.cta.label} <ArrowRight size={20} aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
