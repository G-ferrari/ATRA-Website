'use client'

import { ArrowRight, Calendar, Search, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { ChipFilter, EntradaAnimada, SearchInput } from '@/components/ui'
import { categoriasComArtigo } from '@/lib/categorias-do-blog'
import type { Locale } from '@/lib/locales'
import { fatia, totalDePaginas } from '@/lib/paginacao'
import { hrefDaPagina, hrefDe } from '@/lib/routes'
import type { PostCard } from '@/types/content'

import { Paginacao } from './paginacao'

/* Listagem do blog — porte de `legacy/src/pages/Blog.tsx:88`.
 * Mesmo desenho de cases: o cabeçalho vem pronto do servidor e divide a linha
 * flex com a busca, que precisa de estado.
 *
 * Paginação (D-47). A ilha recebe **todos** os artigos e mostra uma fatia:
 * - sem busca nem filtro, a fatia é a da **rota** (`pagina`), e a numeração é
 *   feita de links — cada página é um endereço pré-montado;
 * - com busca ou filtro, a lista é o resultado, que só existe nesta tela, e a
 *   numeração vira botões com a página guardada em estado.
 * A busca vale para todos os artigos, e não só para os da página aberta: é por
 * isso que a lista inteira vem, e não só os 12. */

/** Âncora da lista: é para onde a numeração leva, e não para o topo da página. */
const ANCORA = 'artigos'

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
    paginacao: {
      navegacao: 'Páginas do blog',
      anterior: 'Página anterior',
      proxima: 'Próxima página',
      pagina: (n: number) => `Página ${n}`,
    },
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
    paginacao: {
      navegacao: 'Blog pages',
      anterior: 'Previous page',
      proxima: 'Next page',
      pagina: (n: number) => `Page ${n}`,
    },
  },
} as const

const TODOS = 'todos'

export function ListaDeArtigos({
  posts,
  pagina,
  porPagina,
  categorias,
  locale,
  cabecalho,
}: {
  /** Todos os artigos, do mais novo para o mais antigo — não só os desta página. */
  posts: PostCard[]
  /** A página da rota: 1 em `/blog`, N em `/blog/pagina/N`. */
  pagina: number
  porPagina: number
  categorias: string[]
  locale: Locale
  cabecalho: ReactNode
}) {
  const t = TEXTOS[locale]
  const [busca, setBuscaCrua] = useState('')
  const [categoria, setCategoriaCrua] = useState<string>(TODOS)
  const [paginaDoFiltro, setPaginaDoFiltro] = useState(1)

  /* Mudou a busca ou o filtro, o resultado é outro: volta para a primeira
     página dele. No próprio gesto, e não num efeito, para não desenhar um
     quadro com a lista nova na página velha. */
  const setBusca = (valor: string) => {
    setBuscaCrua(valor)
    setPaginaDoFiltro(1)
  }
  const setCategoria = (valor: string) => {
    setCategoriaCrua(valor)
    setPaginaDoFiltro(1)
  }

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

  // Só a categoria que tem artigo; sem nenhuma, a barra não aparece (ver o módulo).
  const comArtigo = useMemo(() => categoriasComArtigo(categorias, posts), [categorias, posts])
  const opcoes = [{ id: TODOS, label: t.todos }, ...comArtigo.map((c) => ({ id: c, label: c }))]

  const filtrando = busca.trim() !== '' || categoria !== TODOS
  const lista = filtrando ? filtrados : posts
  const total = totalDePaginas(lista.length, porPagina)
  const atual = filtrando ? Math.min(paginaDoFiltro, total) : pagina
  const visiveis = fatia(lista, atual, porPagina)

  const irParaAPaginaDoFiltro = (n: number) => {
    setPaginaDoFiltro(n)
    document.getElementById(ANCORA)?.scrollIntoView({ block: 'start' })
  }

  const formatarData = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(iso))

  return (
    <>
      {/* `scroll-mt` compensa o cabeçalho fixo: sem ele a âncora pararia com o
          título da lista escondido atrás do menu. */}
      <div id={ANCORA} className="scroll-mt-28 flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
        {cabecalho}
        <div className="flex items-center gap-3">
          <SearchInput value={busca} onChange={setBusca} placeholder={t.buscar} />
        </div>
      </div>

      {comArtigo.length > 0 && (
        <div className="mb-10">
          <ChipFilter
            label={t.categorias}
            options={opcoes}
            activeId={categoria}
            onChange={setCategoria}
            variante="blog"
          />
        </div>
      )}

      {lista.length === 0 ? (
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
          {visiveis.map((p, i) => (
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

      {/* Sem filtro, links: cada página é um endereço. A primeira leva a âncora
          porque `/blog` abre no destaque, e quem clicou em "1" quer a lista; as
          outras já começam nela. Com filtro, botões: o resultado não tem endereço. */}
      {filtrando ? (
        <Paginacao atual={atual} total={total} rotulos={t.paginacao} aoMudar={irParaAPaginaDoFiltro} />
      ) : (
        <Paginacao
          atual={atual}
          total={total}
          rotulos={t.paginacao}
          hrefDe={(n) => (n === 1 ? `${hrefDaPagina('blog', locale, 1)}#${ANCORA}` : hrefDaPagina('blog', locale, n))}
        />
      )}
    </>
  )
}
