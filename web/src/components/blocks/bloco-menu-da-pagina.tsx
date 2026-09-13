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

  const solucao = bloco.variant === 'solution'

  return (
    <div
      className={cn(
        'sticky w-full flex flex-col items-center pointer-events-none transition-all duration-300',
        solucao
          ? cn('z-50 px-4', grudado ? 'top-[62px] md:top-[74px]' : 'top-[76px] md:top-[88px]')
          : cn(
              'z-30 px-3 sm:px-4',
              /* ⚠️ O respiro abaixo é do menu de /sobre (`About.tsx:259`), não
                 do estilo institucional: /carreiras usa o mesmo menu sem ele
                 (`Careers.tsx:161`). Ver a nota do campo em `blocks/index.ts`. */
              bloco.bottomGap === 'normal' && 'mb-8 sm:mb-10',
              grudado ? 'top-[58px] sm:top-[66px] md:top-[74px]' : 'top-[70px] sm:top-[80px] md:top-[88px]',
            ),
      )}
    >
      <nav
        className={cn(
          'pointer-events-auto w-full max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar transition-all duration-300 shadow-xl bg-surface-2',
          solucao
            ? 'py-4 md:py-4.5 min-h-[52px] md:min-h-[56px] px-6 md:px-8 justify-center'
            : 'py-2.5 sm:py-3.5 md:py-4.5 min-h-[46px] sm:min-h-[52px] md:min-h-[56px] px-3 sm:px-6 md:px-8 justify-start md:justify-center ',
          grudado ? 'rounded-b-[6px] rounded-t-none' : 'rounded-[6px] mt-2',
        )}
      >
        {/* ⚠️ Sem `whitespace-nowrap` nem `shrink-0` na variante de solução, de
            propósito. O legado não os tem (`SolutionAI.tsx:191`), e no mobile
            os quatro rótulos se espremem em 311px e quebram em várias linhas —
            a faixa fica 96px alta em vez de 52px. É defeito do legado, e o
            aceite visual é contra ele (D-15). A variante institucional mantém
            os dois: lá o legado também tem. */}
        <div
          className={cn(
            'flex items-center',
            solucao ? 'gap-6 md:gap-8' : 'gap-4 sm:gap-6 md:gap-8 whitespace-nowrap shrink-0',
          )}
        >
          {bloco.items.map((item) => (
            <a
              key={item.anchor}
              href={`#${item.anchor}`}
              aria-current={ativo === item.anchor ? 'true' : undefined}
              /* ⚠️ O link também difere entre os dois menus do legado. O
                 institucional (`About.tsx:277`) tem `px-1.5 shrink-0` e
                 sublinhado a 8px; o de solução (`SolutionAI.tsx:205`) não tem
                 nenhum dos dois e sublinha a 10px. O `shrink-0` é o que pesa:
                 sem ele os 4 rótulos se espremem e quebram em linha no mobile,
                 e a faixa passa de 64px para 96px. */
              className={cn(
                'font-medium transition-all duration-200 text-xs sm:text-sm cursor-pointer py-1',
                !solucao && 'px-1.5 shrink-0',
                ativo === item.anchor
                  ? cn(
                      'text-primary font-semibold underline decoration-2',
                      solucao ? 'underline-offset-[10px]' : 'underline-offset-[8px]',
                    )
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
