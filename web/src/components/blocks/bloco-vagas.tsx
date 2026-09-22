import { ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { BancoDeTalentos } from './banco-de-talentos'
import { cn } from '@/lib/utils'
import { hrefDe } from '@/lib/routes'
import type { VagaAberta } from '@/lib/atrair'
import type { BlocoJobsList } from '@/types/content'
import type { Locale } from '@/lib/locales'

/* Lista de vagas — porte de `legacy/src/pages/Careers.tsx:410`.
 *
 * A seção tem **duas partes**: a grade de vagas e, sob ela, o cartão do banco de
 * talentos. No legado os cards apontam para a âncora desse cartão; aqui levam
 * para `/carreiras/[slug]` (MIG-051), que é o único desvio deliberado.
 *
 * ⚠️ O card mostra **só o título**. Área e local existem na collection e não
 * entram: a linha extra sobe cada card em 16px, e com seis cards em duas
 * colunas eram 48px de diferença contra o gabarito. Informação a mais é
 * melhoria, e melhoria não entra junto com migração (D-15). */
export function BlocoVagas({
  bloco,
  locale,
  vagasAbertas,
}: {
  bloco: BlocoJobsList
  locale: Locale
  /* As vagas abertas no ATRAIR — só para o formulário do banco de talentos. A
   * GRADE acima continua vindo do CMS: ela é conteúdo de marketing, com página
   * própria por vaga (MIG-051), e trocá-la é decisão do marketing (D-22). */
  vagasAbertas?: VagaAberta[]
}) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'relative overflow-hidden scroll-mt-32',
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
          <div className={cn('grid md:grid-cols-2 gap-4 max-w-5xl mx-auto', bloco.talentBank && 'mb-20')}>
            {bloco.vagas.map((v) => (
              <Link
                key={v.slug}
                href={hrefDe('carreiras', locale, v.slug)}
                className="group flex items-center justify-between p-5 bg-surface-1  rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase size={18} aria-hidden />
                  </div>
                  <span className="font-semibold text-text-main text-xs sm:text-sm group-hover:text-primary transition-colors">
                    {v.title}
                  </span>
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

        {bloco.talentBank && <BancoDeTalentos banco={bloco.talentBank} locale={locale} vagasAbertas={vagasAbertas} />}
      </div>
    </section>
  )
}
