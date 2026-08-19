'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { BlocoStickyPageNav } from '@/types/content'

/* Menu que acompanha a rolagem — porte de `legacy/src/pages/About.tsx:258`.
 *
 * Os itens **não são digitados**: vêm dos blocos que preencheram `anchor`
 * (blocos.md, regra 2), resolvidos no mapper. Menu apontando para seção que não
 * existe mais é justamente o que isso evita.
 *
 * O item ativo sai do `IntersectionObserver`, e não de cálculo de `scrollY`:
 * é o que o navegador já faz sozinho, sem ouvir todo evento de rolagem.
 *
 * ⚠️ Na captura da regressão visual o observer é substituído por um que reporta
 * tudo visível de uma vez (`e2e/support/stability.ts`), então o item ativo será
 * o **último** da lista. É determinístico dos dois lados, que é o que importa
 * ali — mas não confunda com o comportamento real. */
export function BlocoMenuDaPagina({ bloco }: { bloco: BlocoStickyPageNav }) {
  const [ativo, setAtivo] = useState<string | null>(bloco.items[0]?.anchor ?? null)
  const [grudado, setGrudado] = useState(false)

  useEffect(() => {
    const aoRolar = () => setGrudado(window.scrollY > 20)
    aoRolar()
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (bloco.items.length === 0) return

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtivo(e.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )

    for (const item of bloco.items) {
      const el = document.getElementById(item.anchor)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [bloco.items])

  if (bloco.items.length === 0) return null

  return (
    <div
      className={cn(
        'sticky z-30 w-full flex flex-col items-center px-3 sm:px-4 mb-8 sm:mb-10 pointer-events-none transition-all duration-300',
        grudado ? 'top-[58px] sm:top-[66px] md:top-[74px]' : 'top-[70px] sm:top-[80px] md:top-[88px]',
      )}
    >
      <nav
        className={cn(
          'pointer-events-auto w-full max-w-7xl mx-auto flex items-center py-2.5 sm:py-3.5 md:py-4.5 min-h-[46px] sm:min-h-[52px] md:min-h-[56px] px-3 sm:px-6 md:px-8 overflow-x-auto no-scrollbar justify-start md:justify-center transition-all duration-300 shadow-xl bg-surface-2 border border-slate-200/60 dark:border-white/5',
          grudado ? 'rounded-b-[6px] rounded-t-none' : 'rounded-[6px] mt-2',
        )}
      >
        <div className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap items-center shrink-0">
          {bloco.items.map((item) => (
            <a
              key={item.anchor}
              href={`#${item.anchor}`}
              aria-current={ativo === item.anchor ? 'true' : undefined}
              className={cn(
                'font-medium transition-all duration-200 text-xs sm:text-sm cursor-pointer py-1 px-1.5 shrink-0',
                ativo === item.anchor
                  ? 'text-primary font-semibold underline underline-offset-[8px] decoration-2'
                  : 'text-text-muted hover:text-text-main',
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
