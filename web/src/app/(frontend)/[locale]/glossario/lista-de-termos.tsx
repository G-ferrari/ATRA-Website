'use client'

import { BookOpen, Search, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { agruparPorLetra, letraDe } from '@/lib/mappers/glossary'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { GlossaryTerm } from '@/types/content'

/* Glossário — porte de `legacy/src/pages/Glossary.tsx`.
 *
 * Tudo numa ilha só porque a busca vive **dentro** do herói no legado, e o
 * índice alfabético e as seções derivam do mesmo filtro. Separar em servidor +
 * ilha exigiria duplicar o cálculo dos dois lados. */

const TEXTOS = {
  pt: {
    selo: 'Dicionário Técnico',
    chip: 'Conceitos Fundamentais',
    titulo: 'Glossário de',
    tituloDestaque: 'Dados & IA',
    subtitulo:
      'Desmistifique termos técnicos de engenharia de dados, cloud computing, governança e inteligência artificial aplicados aos negócios.',
    buscar: 'Buscar termo técnico ou definição...',
    todos: 'Todos',
    indice: 'Índice Alfabético Rápido',
    vazioTitulo: 'Nenhum termo encontrado',
    vazioTexto: 'Tente buscar por outra palavra-chave.',
    limpar: 'Limpar Filtros',
  },
  en: {
    selo: 'Technical Dictionary',
    chip: 'Core Concepts',
    titulo: 'Glossary of',
    tituloDestaque: 'Data & AI',
    subtitulo:
      'Demystify technical terms from data engineering, cloud computing, governance and artificial intelligence applied to business.',
    buscar: 'Search a term or definition...',
    todos: 'All',
    indice: 'Quick alphabetical index',
    vazioTitulo: 'No term found',
    vazioTexto: 'Try another keyword.',
    limpar: 'Clear filters',
  },
} as const

const ancora = (termo: string) => `term-${termo.toLowerCase().replace(/\s+/g, '-')}`

export function ListaDeTermos({ termos, locale }: { termos: GlossaryTerm[]; locale: Locale }) {
  const t = TEXTOS[locale]
  const [busca, setBusca] = useState('')
  const [letra, setLetra] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return termos.filter((i) => {
      const casaBusca =
        termo === '' ||
        [i.term, i.definition, i.category].join(' ').toLowerCase().includes(termo)
      return casaBusca && (!letra || letraDe(i.term) === letra)
    })
  }, [termos, busca, letra])

  const grupos = useMemo(() => agruparPorLetra(filtrados), [filtrados])
  const letras = useMemo(() => Object.keys(grupos).sort(), [grupos])
  const todasAsLetras = useMemo(
    () => [...new Set(termos.map((i) => letraDe(i.term)))].sort(),
    [termos],
  )

  return (
    <div className="pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-10">
          <div className="rounded-[6px] bg-surface-2 dark:bg-linear-to-br dark:from-[#12151c] dark:via-[#1a2130] dark:to-[#0e1015] text-slate-900 dark:text-white p-6 sm:p-10 md:p-12 shadow-xl dark:shadow-2xl relative overflow-hidden vort-dot-grid text-center">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />

            <div className="max-w-2xl mx-auto relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <StatusBadge label={t.selo} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
                <MetricChip label={t.chip} variant="neutral" size="sm" />
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 font-light max-w-xl mx-auto mb-6">
                {t.subtitulo}
              </p>

              <div className="relative max-w-lg mx-auto">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" aria-hidden />
                <input
                  type="text"
                  placeholder={t.buscar}
                  aria-label={t.buscar}
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/10  rounded-[6px] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10">
          <button
            type="button"
            onClick={() => setLetra(null)}
            aria-pressed={letra === null}
            className={cn(
              'px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all cursor-pointer',
              letra === null
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-2 text-text-muted hover:text-text-main ',
            )}
          >
            {t.todos}
          </button>
          {todasAsLetras.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLetra(letra === l ? null : l)}
              aria-pressed={letra === l}
              className={cn(
                'w-8 h-8 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center',
                letra === l
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-2 text-text-muted hover:text-text-main  hover:bg-surface-3',
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <section className="bg-surface-2  rounded-[6px] p-6 mb-12 shadow-sm">
          <h2 className="text-sm font-bold text-text-main mb-6 flex items-center gap-2">
            <BookOpen size={16} className="text-primary" aria-hidden />
            <span>{t.indice}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {letras.map((l) => (
              <div key={l} className="flex flex-col">
                <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-[4px] bg-primary/10 flex items-center justify-center text-[10px]">{l}</span>
                  <span>({grupos[l].length})</span>
                </div>
                <ul className="space-y-1">
                  {grupos[l].map((i) => (
                    <li key={i.slug}>
                      <a
                        href={`#${ancora(i.term)}`}
                        className="text-text-muted hover:text-primary transition-colors text-xs font-light block truncate"
                      >
                        • {i.term}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {letras.length === 0 ? (
          <div className="text-center py-16 bg-surface-2  rounded-[6px] p-8">
            <BookOpen size={36} className="mx-auto text-text-muted mb-3" aria-hidden />
            <h3 className="text-base font-bold text-text-main mb-1">{t.vazioTitulo}</h3>
            <p className="text-xs text-text-muted font-light mb-4">{t.vazioTexto}</p>
            <button
              type="button"
              onClick={() => {
                setBusca('')
                setLetra(null)
              }}
              className="px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold cursor-pointer"
            >
              {t.limpar}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {letras.map((l, index) => (
              <motion.div
                key={l}
                id={`letter-${l}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="scroll-mt-32"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {l}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grupos[l].map((i) => (
                    <div
                      key={i.slug}
                      id={ancora(i.term)}
                      className="p-5 rounded-[6px] bg-surface-2  hover:border-primary/40 transition-all scroll-mt-32 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                            {i.term}
                          </h3>
                          <span className="px-2 py-0.5 rounded-[4px] bg-surface-1 text-text-muted text-[10px] font-medium ">
                            {i.category}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted font-light leading-relaxed">{i.definition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
