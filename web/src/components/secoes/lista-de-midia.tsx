import { ArrowUpRight, Play } from 'lucide-react'
import Image from 'next/image'

import { EntradaAnimada } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { CabecalhoDaSecao, MateriaDaImprensa } from '@/types/content'

import { cabecalhoAberto, RESPIRO_DE_ABERTURA } from './cabecalho-aberto'
import { TEXTOS_DAS_SECOES } from './textos'

/* /atra-na-midia (D-49) dentro da página-mestra: o cabeçalho com os parágrafos
 * da página antiga e a grade de matérias.
 *
 * ⚠️ **Não há página por matéria.** O cartão abre a matéria no site do veículo,
 * em outra aba — como no site antigo (G-ferrari, 02/10). */

function dataDe(m: MateriaDaImprensa, locale: Locale): string | null {
  if (!m.publishedAt) return null
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(m.publishedAt))
}

/** Veículo e, quando há, a data: é o que identifica a matéria antes do título. */
export function origemDaMateria(m: MateriaDaImprensa, locale: Locale): string {
  const data = dataDe(m, locale)
  return data ? `${m.outlet} • ${data}` : m.outlet
}

export function ListaDeMidia({
  cabecalho,
  materias,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  materias: MateriaDaImprensa[]
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  const t = TEXTOS_DAS_SECOES[locale]
  const acaoDe = (m: MateriaDaImprensa) => (m.kind === 'video' ? t.midia.assistir : t.midia.ler)

  return (
    /* Sem o destaque acima (nenhuma matéria publicada, ou bloco removido), a
       seção é o topo da página e precisa do respiro que ele dava sob o
       cabeçalho fixo. */
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
          chave: 'cabecalho-midia',
          classeDaCaixa: 'mb-12 md:mb-16 max-w-3xl',
          classeDoTitulo:
            'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white leading-tight',
        })}

        {materias.length === 0 ? (
          <p className="text-sm text-text-muted font-light">{t.vazio.midia}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {materias.map((m, i) => (
              <EntradaAnimada
                key={m.id}
                index={i}
                escala
                className="group relative flex flex-col gap-5 bg-surface-2 dark:bg-[#181b22]  hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b]"
              >
                <div className="aspect-video rounded-[6px] overflow-hidden relative shadow-md">
                  <Image
                    src={m.image.url}
                    alt={m.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* O botão de play só aparece no que é vídeo: numa matéria
                      de jornal ele prometeria o que o clique não entrega. */}
                  {m.kind === 'video' && (
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-all flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all shadow-lg">
                        <Play className="text-white fill-white ml-1" size={20} aria-hidden />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[11px] text-primary mb-1.5 font-bold uppercase tracking-wider">
                    {origemDaMateria(m, locale)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-text-main dark:text-white group-hover:text-primary transition-colors leading-snug">
                    {/* Um link só por cartão, no título, com `after:inset-0`
                        cobrindo o cartão inteiro — o mesmo desenho de
                        /webinars. Abre em outra aba, e o leitor de tela é
                        avisado disso. */}
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-[6px] focus-visible:after:ring-2 focus-visible:after:ring-[#3C98FA]"
                    >
                      {m.title}
                      <span className="sr-only"> ({t.midia.novaAba})</span>
                    </a>
                  </h3>
                  <p className="mt-2 text-text-muted dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                    {m.description}
                  </p>
                  <div
                    aria-hidden
                    className="mt-4 inline-flex items-center gap-2 text-primary dark:text-[#3C98FA] font-bold text-xs sm:text-sm group-hover:gap-3 transition-all"
                  >
                    <span>{acaoDe(m)}</span>
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </EntradaAnimada>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
