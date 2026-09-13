'use client'

import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Icone } from '@/components/blocks/icones'
import { PainelDoMenu } from '@/components/layout/mega-menu'
import { TEXTOS_CASCA } from '@/lib/navegacao'
import { hrefDe } from '@/lib/routes'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { CategoriaDoMenu, Image as Imagem, Navegacao } from '@/types/content'

/* Menu fixo do topo — porte de `legacy/src/App.tsx:278`, com os 7 painéis do
 * megamenu e a gaveta mobile (MIG-072a).
 *
 * Ilha cliente porque abrir, fechar e trocar de categoria é estado. **Não busca
 * dado**: o `navegacao` chega resolvido pelo layout (blocos.md, regra 1).
 *
 * ⚠️ O estado **fechado** não mudou nesta task, de propósito: é ele que aparece
 * em toda captura da regressão visual, e mexer nele obrigaria a regravar os 9
 * gabaritos. Os painéis só existem depois do clique. */

export function SiteHeader({
  locale,
  navegacao,
  logo,
}: {
  locale: Locale
  navegacao: Navegacao
  logo: Imagem | null
}) {
  const t = TEXTOS_CASCA[locale]
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
  const [gavetaAberta, setGavetaAberta] = useState<string | null>(null)

  const categorias = navegacao.categorias
  /* O legado abre já com Soluções selecionada (`App.tsx:283`), então o painel
   * nunca aparece vazio. */
  const ativa = categorias.find((c) => c.label === categoriaAtiva) ?? categorias[0]
  const fechar = () => {
    setAberto(false)
    setCategoriaAtiva(null)
    setGavetaAberta(null)
  }

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 20)
    aoRolar()
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  const prefixo = locale === 'pt' ? '' : `/${locale}`

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex flex-col items-center pointer-events-none',
        rolou ? 'px-4 pt-2 md:pt-3' : 'px-4 pt-4 md:pt-5',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto w-full max-w-7xl mx-auto transition-all duration-500 flex flex-col px-6 md:px-8 relative z-40 rounded-[6px]',
          aberto
            ? 'bg-surface-2 shadow-2xl py-5 text-text-main'
            : rolou
              ? 'bg-surface-2 shadow-md py-2 md:py-2 text-text-main'
              : 'bg-transparent py-3 md:py-3 text-text-main dark:text-white',
        )}
        onMouseLeave={fechar}
      >
        <div className="w-full flex items-center justify-between relative">
          <Link href={prefixo || '/'} className="flex items-center gap-2" onClick={() => setAberto(false)}>
            {/* ⚠️ `<img>` cru, e não `next/image`: a caixa é `h-12 w-auto`, e o
                gabarito desenha o arquivo original. Passar pelo next/image
                reescalaria e mudaria a caixa. O `src` deixou de ser o hotlink do
                WordPress em MIG-073 — agora é a mídia do CMS. */}
            {logo && (
              /* eslint-disable-next-line @next/next/no-img-element -- ver acima */
              <img
                src={logo.url}
                alt={t.logo}
                decoding="async"
                fetchPriority="high"
                className="h-10 md:h-12 w-auto object-contain transition-all"
              />
            )}
          </Link>

          {/* ⚠️ O marcador vai aqui, e não no `motion.div` de dentro: o
              `motion/react` filtra `data-*` e o atributo nunca chega ao DOM —
              custou uma rodada inteira de testes a descobrir. */}
          <div
            data-testid="menu-categorias"
            className="flex items-center absolute left-1/2 -translate-x-1/2 h-full pointer-events-auto"
          >
            <AnimatePresence mode="wait">
              {!aberto ? (
                <motion.button
                  key="menu-fechado"
                  type="button"
                  initial={{ opacity: 0, scale: 0.9, y: -2 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 2 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="p-1.5 px-3.5 rounded-[6px] transition-all flex items-center gap-1.5 text-[13px] font-semibold tracking-normal cursor-pointer hover:scale-105 active:scale-95 bg-transparent text-text-main dark:text-white hover:opacity-80"
                  onClick={() => setAberto(true)}
                  aria-expanded={false}
                  aria-label={t.abrirMenu}
                >
                  <span>{t.menu}</span> <Menu size={14} className="text-primary" aria-hidden />
                </motion.button>
              ) : (
                <motion.div
                  key="menu-aberto"
                  initial={{ opacity: 0, scale: 0.98, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex items-center gap-3.5"
                >
                  {categorias.map((categoria) => {
                    const rotulo = categoria.label
                    const selecionada = ativa?.label === rotulo
                    return (
                      <div key={rotulo} className="relative py-1">
                        <Link
                          href={categoria.href ? `${prefixo}${categoria.href}` : '#'}
                          onClick={(e) => {
                            if (!categoria.href) e.preventDefault()
                            else fechar()
                          }}
                          onMouseEnter={() => setCategoriaAtiva(rotulo)}
                          className={cn(
                            'text-[13px] font-semibold transition-colors flex items-center gap-1 cursor-pointer relative pb-1 tracking-normal',
                            selecionada ? 'text-primary font-bold' : 'text-text-muted hover:text-text-main',
                          )}
                        >
                          <span>{rotulo}</span>
                          <ChevronDown
                            size={12}
                            aria-hidden
                            className={cn(
                              'transition-transform duration-300',
                              selecionada ? 'rotate-180 text-primary' : 'text-text-muted',
                            )}
                          />
                          {selecionada && (
                            <motion.div
                              layoutId="sublinhadoDoMenu"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-atra rounded-full"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 pointer-events-auto">
            <Link
              href={`${prefixo}/#fale-conosco`}
              className="hidden lg:flex items-center gap-2 rounded-[6px] text-sm font-normal transition-all shadow-md hover:shadow-lg capitalize border border-primary text-primary hover:bg-primary/10 bg-transparent px-5 py-2.5 active:scale-95 cursor-pointer"
            >
              {t.faleConosco} <ArrowRight size={16} aria-hidden />
            </Link>

            {aberto && (
              <button
                type="button"
                className="p-2 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 text-text-main md:hidden cursor-pointer"
                onClick={fechar}
                aria-label={t.fecharMenu}
              >
                <X size={20} aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Painel da categoria ativa. `hidden md:block` porque no celular a
            navegação é a gaveta abaixo, não o painel (`App.tsx:455`). */}
        <AnimatePresence>
          {aberto && ativa && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block w-full mt-4 overflow-hidden border-t border-slate-100 dark:border-white/5 pt-4"
            >
              <PainelDoMenu categoria={ativa} navegacao={navegacao} locale={locale} aoNavegar={fechar} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gaveta do celular: cartão separado abaixo da barra (`App.tsx:920`). */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full max-w-lg mt-2 bg-surface-2  rounded-xl shadow-2xl overflow-hidden relative z-40 mx-auto md:hidden max-h-[82vh] flex flex-col"
          >
            <div data-testid="menu-gaveta" className="overflow-y-auto no-scrollbar p-4 space-y-1.5 flex-1">
              {categorias.map((categoria) => {
                /* Só as categorias que têm o que listar expandem. No legado são
                   Soluções, Insights e Parceiros — aqui sai do formato do
                   painel, então uma categoria nova acerta sozinha. */
                const expansivel = categoria.panel !== 'split'
                const expandida = gavetaAberta === categoria.label

                return (
                  <div key={categoria.label} className="flex flex-col rounded-[6px] overflow-hidden">
                    <div
                      className="flex items-center justify-between py-3 px-3.5 hover:bg-slate-100 dark:hover:bg-white/5 active:bg-slate-200/60 dark:active:bg-white/10 rounded-[6px] transition-colors cursor-pointer"
                      onClick={() => (expansivel ? setGavetaAberta(expandida ? null : categoria.label) : fechar())}
                    >
                      <Link
                        href={categoria.href ? `${prefixo}${categoria.href}` : '#'}
                        className="text-sm font-semibold text-text-main capitalize tracking-wide flex items-center gap-2.5"
                        onClick={(e) => {
                          if (expansivel || !categoria.href) e.preventDefault()
                        }}
                      >
                        {categoria.label}
                      </Link>
                      {expansivel && (
                        <div className="p-1 rounded-md text-text-muted">
                          <ChevronDown
                            size={18}
                            aria-hidden
                            className={cn('transition-transform duration-200', expandida && 'rotate-180 text-primary')}
                          />
                        </div>
                      )}
                    </div>

                    {expansivel && expandida && (
                      <div className="overflow-hidden bg-surface-1/60 dark:bg-surface-1/40 rounded-[6px] mx-1 mb-2 ">
                        <div className="p-2.5 grid grid-cols-1 gap-1.5">
                          <ItensDaGaveta
                            categoria={categoria}
                            navegacao={navegacao}
                            locale={locale}
                            aoNavegar={fechar}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* Lista compacta de cada categoria expansível na gaveta (`App.tsx:977`).
 *
 * Em Soluções o legado mostra **uma linha por categoria de solução**, usando a
 * primeira solução de cada uma para ícone, destino e descrição
 * (`App.tsx:983-992`) — não uma linha por solução. Portado assim. */
function ItensDaGaveta({
  categoria,
  navegacao,
  locale,
  aoNavegar,
}: {
  categoria: CategoriaDoMenu
  navegacao: Navegacao
  locale: Locale
  aoNavegar: () => void
}) {
  const linha =
    'text-text-main hover:text-primary font-medium py-2 px-3 flex items-center gap-3 bg-surface-2/80 hover:bg-surface-2 rounded-[6px] hover:shadow-xs transition-all active:scale-[0.99]'
  const caixa = 'w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0'

  if (categoria.panel === 'solutions') {
    return (
      <>
        {navegacao.solucoes.map((grupo) => {
          const primeira = grupo.items[0]
          if (!primeira) return null
          const conteudo = (
            <>
              <div className={caixa}>
                <Icone nome={primeira.icon} size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold capitalize tracking-wide leading-tight">{grupo.title}</span>
                <span className="text-[10px] text-text-muted leading-tight mt-0.5 line-clamp-1">
                  {primeira.description}
                </span>
              </div>
            </>
          )
          return primeira.href ? (
            <Link key={grupo.title} href={primeira.href} className={cn(linha, 'py-2.5')} onClick={aoNavegar}>
              {conteudo}
            </Link>
          ) : (
            <div key={grupo.title} className={cn(linha, 'py-2.5 cursor-default')}>
              {conteudo}
            </div>
          )
        })}
      </>
    )
  }

  if (categoria.panel === 'partners') {
    return (
      <>
        {navegacao.parceiros.map((p) => (
          <Link key={p.slug} href={hrefDe('parceiros', locale, p.slug)} className={linha} onClick={aoNavegar}>
            <div className="w-8 h-8 rounded-md bg-white dark:bg-white/10 flex items-center justify-center text-primary shrink-0 p-1 relative">
              {p.logo && <Image src={p.logo.url} alt={p.logo.alt} fill sizes="32px" className="object-contain p-1" />}
            </div>
            <span className="text-xs font-semibold capitalize tracking-wide leading-tight">{p.name}</span>
          </Link>
        ))}
      </>
    )
  }

  return (
    <>
      {categoria.links.map((l) => (
        <Link key={l.href} href={l.href} className={linha} onClick={aoNavegar}>
          <div className={caixa}>
            <Icone nome={l.icon} size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold capitalize tracking-wide leading-tight">{l.label}</span>
            <span className="text-[10px] text-text-muted leading-tight line-clamp-1">{l.description}</span>
          </div>
        </Link>
      ))}
    </>
  )
}
