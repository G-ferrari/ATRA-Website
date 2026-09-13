'use client'

import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Search, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { ChipFilter, EntradaAnimada, SearchInput } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { PostCard } from '@/types/content'

/* Listagem do blog — porte de `legacy/src/pages/Blog.tsx:88`.
 * Mesmo desenho de cases: o cabeçalho vem pronto do servidor e divide a linha
 * flex com a busca, que precisa de estado. */

const TEXTOS = {
  pt: {
    buscar: 'Pesquisar artigos...',
    todos: 'Todos',
    categorias: 'Categorias:',
    selo: 'Artigo',
    cta: 'Continuar lendo',
    vazioTitulo: 'Nenhum artigo encontrado',
    vazioTexto: 'Tente buscar por outro termo ou selecione a categoria "Todos".',
    limpar: 'Resetar Filtros',
  },
  en: {
    buscar: 'Search posts...',
    todos: 'All',
    categorias: 'Categories:',
    selo: 'Post',
    cta: 'Keep reading',
    vazioTitulo: 'No post found',
    vazioTexto: 'Try another term or pick the "All" category.',
    limpar: 'Reset filters',
  },
} as const

const TODOS = 'todos'

export function ListaDeArtigos({
  posts,
  categorias,
  locale,
  cabecalho,
}: {
  posts: PostCard[]
  categorias: string[]
  locale: Locale
  cabecalho: ReactNode
}) {
  const t = TEXTOS[locale]
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<string>(TODOS)
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return posts.filter((p) => {
      const casaCategoria =
        categoria === TODOS || p.tags.some((tag) => tag.toLowerCase() === categoria.toLowerCase())
      const casaBusca =
        termo === '' ||
        [p.title, p.description, ...p.tags].join(' ').toLowerCase().includes(termo)
      return casaCategoria && casaBusca
    })
  }, [posts, busca, categoria])

  const opcoes = [
    { id: TODOS, label: t.todos },
    ...categorias.map((c) => ({ id: c, label: c })),
  ]

  const formatarData = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(iso))

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
        {cabecalho}
        <div className="flex items-center gap-3">
          <SearchInput value={busca} onChange={setBusca} placeholder={t.buscar} />
        </div>
      </div>

      <div className="mb-10">
        <ChipFilter
          label={t.categorias}
          options={opcoes}
          activeId={categoria}
          onChange={setCategoria}
          variante="blog"
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-surface-2  rounded-[6px] p-10 text-center max-w-md mx-auto">
          <Search size={32} className="mx-auto text-text-muted mb-3" aria-hidden />
          <h3 className="text-base font-bold text-text-main mb-1">{t.vazioTitulo}</h3>
          <p className="text-xs text-text-muted font-light mb-4">{t.vazioTexto}</p>
          <button
            type="button"
            onClick={() => {
              setCategoria(TODOS)
              setBusca('')
            }}
            className="px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
          >
            {t.limpar}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filtrados.map((p, i) => (
            <EntradaAnimada
              key={p.slug}
              index={i}
              className="group flex flex-col bg-surface-2  hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden relative border-b border-slate-200 dark:border-white/10">
                <Image
                  src={p.image.url}
                  alt={p.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-950/20 dark:bg-black/40 group-hover:bg-transparent transition-all" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                    {t.selo}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[11px] text-text-muted mb-3 flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-primary" aria-hidden />
                    <span>{formatarData(p.publishedAt)}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold font-display text-text-main mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-text-muted text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-6">
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-[4px] bg-surface-1 text-[10px] font-medium text-text-muted uppercase flex items-center gap-1 "
                      >
                        <Tag size={10} className="text-primary/70" aria-hidden /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <Link
                      href={hrefDe('blog', locale, p.slug)}
                      className="inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm group-hover:gap-3 transition-all"
                    >
                      <span>{t.cta}</span>
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </EntradaAnimada>
          ))}
        </div>
      )}

      {/* ⚠️ Paginação decorativa, portada como está.
          No legado `currentPage` muda mas a lista nunca é fatiada
          (`Blog.tsx:68` e `:246`): os botões não fazem nada, e são fixos em duas
          páginas para 6 posts. Com os 207 do WordPress (Fase 4b) isso precisa
          virar paginação de verdade — registrado em debito-tecnico.md. */}
      <div className="mt-14 md:mt-16 flex justify-center items-center gap-3">
        <button
          type="button"
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          aria-label="Página anterior"
          className="w-9 h-9 rounded-[6px]  bg-surface-2 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all cursor-pointer"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <div className="flex items-center gap-2">
          {[1, 2].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPagina(n)}
              aria-current={pagina === n ? 'page' : undefined}
              className={cn(
                'w-9 h-9 rounded-[6px] font-bold text-xs cursor-pointer transition-all',
                pagina === n
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-2  text-text-main hover:border-primary',
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPagina((p) => Math.min(2, p + 1))}
          aria-label="Próxima página"
          className="w-9 h-9 rounded-[6px]  bg-surface-2 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all cursor-pointer"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </>
  )
}
