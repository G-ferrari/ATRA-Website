'use client'

import { ArrowRight, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { GlowCard, SearchInput } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ConsultantRole } from '@/types/content'
import type { Locale } from '@/lib/locales'

/* Catálogo de consultores — porte de `legacy/src/pages/Consultants.tsx:521`.
 *
 * Ilha cliente: busca e filtro por especialidade/senioridade rodam no cliente,
 * como no legado. Recebe os perfis prontos — não consulta o CMS. O modal de
 * detalhe do legado fica de fora por ora (é MIG-052 só o catálogo); o botão
 * "Solicitar" leva ao contato. */

const TEXTOS = {
  pt: {
    buscar: 'Buscar por cargo, tecnologia...',
    todasEsp: 'Todas',
    todasSen: 'Todos',
    titulo: 'Perfis Especializados Disponíveis',
    exibindo: (n: number) => `Exibindo ${n} ${n === 1 ? 'perfil especializado' : 'perfis especializados'}`,
    vazioTitulo: 'Nenhum perfil encontrado',
    vazioTexto: 'Não encontramos perfis com os filtros aplicados. Tente alterar os critérios de busca.',
    limpar: 'Resetar Filtros',
    pronto: 'Pronto em < 48h',
    ecossistema: 'no ecossistema',
    solicitar: 'Solicitar',
  },
  en: {
    buscar: 'Search by role, technology...',
    todasEsp: 'All',
    todasSen: 'All',
    titulo: 'Available specialist profiles',
    exibindo: (n: number) => `Showing ${n} ${n === 1 ? 'profile' : 'profiles'}`,
    vazioTitulo: 'No profile found',
    vazioTexto: 'No profiles match the filters. Try changing the search criteria.',
    limpar: 'Reset filters',
    pronto: 'Ready in < 48h',
    ecossistema: 'in the ecosystem',
    solicitar: 'Request',
  },
} as const

const GRADIENTES: Record<string, string> = {
  'blue-cyan': 'from-blue-600 to-cyan-500',
  'cyan-teal': 'from-cyan-500 to-teal-400',
  'indigo-blue': 'from-indigo-600 to-blue-500',
  'sky-indigo': 'from-sky-500 to-indigo-500',
  'purple-indigo': 'from-purple-600 to-indigo-500',
  'emerald-teal': 'from-emerald-500 to-teal-600',
  'amber-orange': 'from-amber-500 to-orange-600',
  'blue-teal': 'from-blue-500 to-teal-500',
}

const TODOS = '__todos__'

export function ListaDeConsultores({
  perfis,
  contatoHref,
  locale,
}: {
  perfis: ConsultantRole[]
  contatoHref: string
  locale: Locale
}) {
  const t = TEXTOS[locale]
  const [busca, setBusca] = useState('')
  const [especialidade, setEspecialidade] = useState(TODOS)
  const [senioridade, setSenioridade] = useState(TODOS)

  const especialidades = useMemo(
    () => [...new Set(perfis.flatMap((p) => p.tags))].sort(),
    [perfis],
  )
  const senioridades = useMemo(
    () => [...new Set(perfis.map((p) => p.level))],
    [perfis],
  )

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return perfis.filter((p) => {
      const casaEsp = especialidade === TODOS || p.tags.includes(especialidade)
      const casaSen = senioridade === TODOS || p.level === senioridade
      const casaBusca =
        termo === '' ||
        [p.role, p.description, ...p.tags].join(' ').toLowerCase().includes(termo)
      return casaEsp && casaSen && casaBusca
    })
  }, [perfis, busca, especialidade, senioridade])

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 mb-8">
        <SearchInput value={busca} onChange={setBusca} placeholder={t.buscar} className="lg:w-96" />
        <div className="flex gap-3 flex-1">
          <select
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            aria-label="Especialidade"
            className="flex-1 py-2.5 px-3 rounded-[6px] bg-surface-2 text-text-main border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:border-primary"
          >
            <option value={TODOS}>{t.todasEsp}</option>
            {especialidades.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={senioridade}
            onChange={(e) => setSenioridade(e.target.value)}
            aria-label="Senioridade"
            className="flex-1 py-2.5 px-3 rounded-[6px] bg-surface-2 text-text-main border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:border-primary"
          >
            <option value={TODOS}>{t.todasSen}</option>
            {senioridades.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold font-display text-text-main">{t.titulo}</h2>
        <p className="text-xs text-text-muted font-light mt-0.5">{t.exibindo(filtrados.length)}</p>
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-8 text-center max-w-md mx-auto">
          <Users size={32} className="mx-auto text-text-muted mb-2" aria-hidden />
          <h3 className="text-sm font-bold text-text-main mb-1">{t.vazioTitulo}</h3>
          <p className="text-xs text-text-muted font-light mb-4">{t.vazioTexto}</p>
          <button
            type="button"
            onClick={() => {
              setEspecialidade(TODOS)
              setSenioridade(TODOS)
              setBusca('')
            }}
            className="px-3.5 py-1.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
          >
            {t.limpar}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {filtrados.map((p) => (
            <GlowCard
              key={p.slug}
              glowColor="blue"
              className="p-5 sm:p-6 md:p-7 bg-surface-2 text-text-main shadow-sm flex flex-col justify-between h-full rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        'w-10 h-10 sm:w-11 sm:h-11 rounded-[6px] bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0',
                        GRADIENTES[p.gradient] ?? GRADIENTES['blue-cyan'],
                      )}
                    >
                      {p.code}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-text-main leading-snug group-hover:text-primary transition-colors truncate">
                          {p.role}
                        </h3>
                        <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-primary/10 text-primary border border-primary/20 shrink-0">
                          {p.level}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t.pronto}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted bg-surface-1 px-3 py-1 rounded-[4px] border border-slate-200 dark:border-white/5 font-semibold shrink-0">
                    <Users size={12} className="text-primary" aria-hidden />
                    <span>
                      {p.ecosystem} {t.ecossistema}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-4 line-clamp-2">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.slice(0, 7).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setEspecialidade(tag)}
                      className={cn(
                        'text-[11px] px-2.5 py-1 rounded-[4px] transition-colors font-medium cursor-pointer',
                        tag === especialidade
                          ? 'bg-primary text-white font-semibold shadow-xs'
                          : 'bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5 hover:text-text-main',
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                  {p.tags.length > 7 && (
                    <span className="text-[11px] px-2 py-1 rounded-[4px] bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5">
                      +{p.tags.length - 7}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-end gap-3">
                <a
                  href={contatoHref}
                  className="py-2 px-4 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs shadow-primary/20"
                >
                  <span>{t.solicitar}</span>
                  <ArrowRight size={14} aria-hidden />
                </a>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </>
  )
}
