'use client'

import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { CATEGORIAS, LOGO_ATRA, TEXTOS_CASCA } from '@/lib/navegacao'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'

/* Menu fixo do topo — porte de `legacy/src/App.tsx:278`.
 *
 * Fica só a casca: logo, botão Menu, fileira de categorias e "Fale Conosco".
 * Os 7 painéis de megamenu (635 linhas de layout sob medida, uma por categoria)
 * ficam para MIG-072, junto com o global `navigation` que os alimenta —
 * escrevê-los à mão agora seria construir a navegação hardcoded que a migração
 * existe para eliminar, e apontando para rotas que só nascem na Fase 3. */

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = TEXTOS_CASCA[locale]
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)

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
        onMouseLeave={() => {
          setAberto(false)
          setCategoriaAtiva(null)
        }}
      >
        <div className="w-full flex items-center justify-between relative">
          <Link href={prefixo || '/'} className="flex items-center gap-2" onClick={() => setAberto(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- hotlink do
                WordPress, igual ao do legado: os dois precisam renderizar o
                mesmo arquivo enquanto a mídia não migra (MIG-071). Passar pelo
                next/image reescalaria e mudaria a caixa. */}
            <img
              src={LOGO_ATRA}
              alt={t.logo}
              decoding="async"
              fetchPriority="high"
              className="h-10 md:h-12 w-auto object-contain transition-all"
            />
          </Link>

          <div className="flex items-center absolute left-1/2 -translate-x-1/2 h-full pointer-events-auto">
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
                  <span>{t.menu}</span> <Menu size={14} className="text-primary animate-pulse" aria-hidden />
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
                  {CATEGORIAS.map((categoria) => {
                    const rotulo = categoria.label[locale]
                    const selecionada = categoriaAtiva === rotulo
                    return (
                      <div key={rotulo} className="relative py-1">
                        <Link
                          href={categoria.href === '#' ? '#' : `${prefixo}${categoria.href}`}
                          onClick={(e) => {
                            if (categoria.href === '#') e.preventDefault()
                            else setAberto(false)
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
                onClick={() => setAberto(false)}
                aria-label={t.fecharMenu}
              >
                <X size={20} aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
