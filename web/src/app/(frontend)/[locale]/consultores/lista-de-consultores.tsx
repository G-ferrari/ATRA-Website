'use client'

import { Award, ArrowRight, Filter, GraduationCap, HelpCircle, Search, UserCheck, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { GlowCard } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { ConsultantRole } from '@/types/content'

/* Filtros e catálogo — porte de `legacy/src/pages/Consultants.tsx:438` e `:521`.
 *
 * Ilha cliente: busca, senioridade e especialidade rodam no cliente, como no
 * legado. Recebe os perfis prontos — não consulta o CMS.
 *
 * ⚠️ A especialidade é uma **pílula**, não um `select`. A primeira versão desta
 * ilha usou dois `select` lado a lado, o que muda a altura da seção em ~300px e
 * foi parte dos 57% que faltavam na rota.
 *
 * O modal de "Detalhes" nasce fechado, então não entra na regressão visual —
 * mas o **botão** entra, e sem ele o rodapé de cada card ficava mais estreito. */

const TEXTOS = {
  pt: {
    filtrar: 'Filtre por Especialidade & Tecnologia',
    buscar: 'Buscar cargo, tag ou tecnologia...',
    senioridade: 'Senioridade:',
    todas: 'Todas',
    todos: 'Todos',
    titulo: 'Perfis Especializados Disponíveis',
    exibindo: (n: number) => `Exibindo ${n} ${n === 1 ? 'perfil especializado' : 'perfis especializados'}`,
    ativos: 'Filtros ativos:',
    limpar: 'Limpar filtros',
    vazioTitulo: 'Nenhum perfil encontrado',
    vazioTexto: 'Não encontramos perfis com os filtros aplicados. Tente alterar os critérios de busca.',
    resetar: 'Resetar Filtros',
    pronto: 'Pronto em < 48h',
    ecossistema: 'no ecossistema',
    noTime: 'no time',
    solicitar: 'Solicitar',
    detalhes: 'Detalhes',
    nivel: 'Nível',
    disponivel: 'Disponível em < 48 horas',
    certificacoes: 'Certificações do time ATRA neste Perfil',
    tecnologias: 'Tecnologias de Domínio',
    fechar: 'Fechar',
    solicitarPerfil: 'Solicitar este Profissional',
  },
  en: {
    filtrar: 'Filter by specialty & technology',
    buscar: 'Search role, tag or technology...',
    senioridade: 'Seniority:',
    todas: 'All',
    todos: 'All',
    titulo: 'Available specialist profiles',
    exibindo: (n: number) => `Showing ${n} ${n === 1 ? 'profile' : 'profiles'}`,
    ativos: 'Active filters:',
    limpar: 'Clear filters',
    vazioTitulo: 'No profile found',
    vazioTexto: 'No profiles match the filters. Try changing the search criteria.',
    resetar: 'Reset filters',
    pronto: 'Ready in < 48h',
    ecossistema: 'in the ecosystem',
    noTime: 'on the team',
    solicitar: 'Request',
    detalhes: 'Details',
    nivel: 'Level',
    disponivel: 'Available in < 48 hours',
    certificacoes: 'ATRA team certifications for this profile',
    tecnologias: 'Core technologies',
    fechar: 'Close',
    solicitarPerfil: 'Request this professional',
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

/* ⚠️ Ordem fixa, espelhando as opções do `level` em `collections/SpecialistRoles.ts`
 * — e **não** derivada dos perfis semeados. O legado lista as três sempre
 * (`Consultants.tsx:59`), e hoje nenhum perfil é "Pleno": derivar dos dados
 * fazia a pílula sumir, o que é uma melhoria, mas muda o pixel. Mesmo caso de
 * `GRADIENTES`, que também espelha um `select` do schema. */
const SENIORIDADES = ['Senior', 'Pleno', 'Lead / Principal'] as const

const PILULA_ATIVA = 'bg-primary text-white font-semibold shadow-xs'
const PILULA_INATIVA =
  'bg-surface-1 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5'

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
  const [aberto, setAberto] = useState<ConsultantRole | null>(null)
  const [especialidade, setEspecialidade] = useState(TODOS)
  const [senioridade, setSenioridade] = useState(TODOS)

  /* A lista de especialidades **é** derivada dos perfis: no legado é uma
   * literal de 36 tags (`Consultants.tsx:50`) que sai de sincronia na primeira
   * vez que alguém acrescenta um perfil pelo admin, e as tags semeadas dão
   * exatamente o mesmo conjunto. */
  const especialidades = useMemo(() => [...new Set(perfis.flatMap((p) => p.tags))].sort(), [perfis])
  const senioridades = SENIORIDADES

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return perfis.filter((p) => {
      const casaEsp = especialidade === TODOS || p.tags.includes(especialidade)
      const casaSen = senioridade === TODOS || p.level === senioridade
      const casaBusca =
        termo === '' || [p.role, p.description, ...p.tags].join(' ').toLowerCase().includes(termo)
      return casaEsp && casaSen && casaBusca
    })
  }, [perfis, busca, especialidade, senioridade])

  const limpar = () => {
    setEspecialidade(TODOS)
    setSenioridade(TODOS)
    setBusca('')
  }
  const temFiltro = especialidade !== TODOS || senioridade !== TODOS || busca !== ''

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-primary" aria-hidden />
              <h2 className="text-xs sm:text-sm font-bold text-text-main">{t.filtrar}</h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden
              />
              <input
                type="text"
                placeholder={t.buscar}
                aria-label={t.buscar}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-1 border border-slate-200 dark:border-white/10 rounded-[6px] text-xs font-normal text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold text-text-muted uppercase mr-1 shrink-0">
              {t.senioridade}
            </span>
            {[TODOS, ...senioridades].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSenioridade(s)}
                className={cn(
                  'px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer',
                  senioridade === s ? PILULA_ATIVA : cn(PILULA_INATIVA, 'hover:bg-surface-3'),
                )}
              >
                {s === TODOS ? t.todos : s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
            {[TODOS, ...especialidades].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEspecialidade(e)}
                className={cn(
                  'px-2 py-0.5 rounded-[4px] text-[10.5px] transition-all duration-200 cursor-pointer whitespace-nowrap',
                  especialidade === e ? PILULA_ATIVA : cn(PILULA_INATIVA, 'hover:bg-surface-3'),
                )}
              >
                {e === TODOS ? t.todas : e}
              </button>
            ))}
          </div>

          {temFiltro && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span>
                {t.ativos}{' '}
                {especialidade !== TODOS && (
                  <strong className="text-primary font-semibold mr-2">{especialidade}</strong>
                )}
                {senioridade !== TODOS && (
                  <strong className="text-secondary font-semibold mr-2">[{senioridade}]</strong>
                )}
                {busca && <span className="text-amber-400 font-semibold">&quot;{busca}&quot;</span>}
              </span>
              <button
                type="button"
                onClick={limpar}
                className="text-primary hover:underline font-medium cursor-pointer text-xs"
              >
                {t.limpar}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold font-display text-text-main">{t.titulo}</h2>
            <p className="text-xs text-text-muted font-light mt-0.5">{t.exibindo(filtrados.length)}</p>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-8 text-center max-w-md mx-auto">
            <UserCheck size={32} className="mx-auto text-text-muted mb-2" aria-hidden />
            <h3 className="text-sm font-bold text-text-main mb-1">{t.vazioTitulo}</h3>
            <p className="text-xs text-text-muted font-light mb-4">{t.vazioTexto}</p>
            <button
              type="button"
              onClick={limpar}
              className="px-3.5 py-1.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
            >
              {t.resetar}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {filtrados.map((p) => (
              <GlowCard
                key={p.slug}
                glowColor="blue"
                customSize
                radius={6}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {t.pronto}
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
                      <span
                        key={tag}
                        className={cn(
                          'text-[11px] px-2.5 py-1 rounded-[4px] transition-colors font-medium',
                          tag === especialidade
                            ? PILULA_ATIVA
                            : 'bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5 hover:text-text-main',
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                    {p.tags.length > 7 && (
                      <span className="text-[11px] px-2 py-1 rounded-[4px] bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5">
                        +{p.tags.length - 7}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
                  <span className="sm:hidden text-xs text-text-muted flex items-center gap-1.5">
                    <Users size={12} className="text-primary" aria-hidden /> {p.ecosystem} {t.noTime}
                  </span>

                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => setAberto(p)}
                      className="py-2 px-3.5 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-main border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle size={14} className="text-primary" aria-hidden />
                      <span>{t.detalhes}</span>
                    </button>

                    <Link
                      href={contatoHref}
                      className="py-2 px-4 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs shadow-primary/20"
                    >
                      <span>{t.solicitar}</span>
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </section>

      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={aberto.role}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <button
            type="button"
            aria-label={t.fechar}
            onClick={() => setAberto(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs cursor-default"
          />

          <div className="relative w-full max-w-2xl bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              aria-label={t.fechar}
              onClick={() => setAberto(null)}
              className="absolute top-6 right-6 p-2 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-muted hover:text-text-main transition-colors cursor-pointer border border-slate-200 dark:border-white/5"
            >
              <X size={18} aria-hidden />
            </button>

            <div className="flex items-start gap-4 mb-6 pr-10">
              <div
                className={cn(
                  'w-12 h-12 rounded-[6px] bg-gradient-to-br flex items-center justify-center text-white font-bold text-base shadow-md shrink-0',
                  GRADIENTES[aberto.gradient] ?? GRADIENTES['blue-cyan'],
                )}
              >
                {aberto.code}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main leading-tight">
                  {aberto.role}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                    {t.nivel} {aberto.level}
                  </span>
                  <span className="text-xs text-emerald-500 font-semibold">{t.disponivel}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-6 bg-surface-1 p-4 rounded-[6px] border border-slate-200 dark:border-white/5">
              {aberto.description}
            </p>

            {/* ⚠️ Sem "Entregáveis" e "Escopo de Responsabilidade": o legado os
                tem (`Consultants.tsx:1000` e `:1016`), mas a collection não
                modela os dois campos. Como o modal nasce fechado, isso não
                aparece na regressão visual — está em debito-tecnico.md. */}
            {aberto.certifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  <GraduationCap size={16} className="text-primary" aria-hidden />
                  <span>{t.certificacoes}</span>
                </div>
                <div className="space-y-1.5">
                  {aberto.certifications.map((c) => (
                    <div
                      key={c}
                      className="text-xs text-text-main font-medium flex items-center gap-2 bg-surface-1 p-2 rounded-[6px] border border-slate-200 dark:border-white/5"
                    >
                      <Award size={14} className="text-amber-400 shrink-0" aria-hidden />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                {t.tecnologias}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aberto.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-[6px] bg-surface-1 border border-slate-200 dark:border-white/5 text-text-muted font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
              <button
                type="button"
                onClick={() => setAberto(null)}
                className="px-5 py-2.5 rounded-[6px] text-xs font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                {t.fechar}
              </button>
              <Link
                href={contatoHref}
                className="px-6 py-2.5 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.solicitarPerfil}</span>
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
