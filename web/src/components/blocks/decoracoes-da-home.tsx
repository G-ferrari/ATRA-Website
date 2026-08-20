'use client'

import { motion, useScroll, useTransform } from 'motion/react'

import { congelado } from '@/lib/e2e'
import type { ReactNode } from 'react'

/* Camada decorativa da home — porte de
 * `legacy/src/components/Decorations.tsx:102`.
 *
 * Oito formas — dois orbes de gradiente, três losangos de vidro, dois anéis de
 * traço e um brilho no fim — distribuídas por percentual ao longo da página
 * inteira, cada uma subindo mais devagar que a rolagem.
 *
 * ⚠️ Não é bloco do CMS. Não tem conteúdo editável, existe só nesta rota e no
 * legado também é código: virar bloco daria ao editor oito posições em
 * percentual para configurar, e a primeira mudança desalinharia o gabarito.
 *
 * `-z-10` com `pointer-events-none`: a camada fica **atrás** de tudo e não
 * intercepta clique. O `main` precisa ser `relative overflow-hidden` para
 * conter o `inset-0` e cortar o que passa da borda. */

function FormaEmParallax({
  velocidade = 0.15,
  rotacao = 0.05,
  className = '',
  children,
}: {
  velocidade?: number
  rotacao?: number
  className?: string
  children: ReactNode
}) {
  const { scrollY } = useScroll()
  /* Faixa de 8000px: o gabarito mapeia a rolagem inteira de uma vez em vez de
     usar `offset` por elemento, então o deslocamento é linear e previsível.
     
     ⚠️ Com `?e2e=1` as formas ficam paradas na posição inicial. A captura de
     página inteira rola a página, então a posição de cada forma dependeria de
     onde a rolagem estava no instante de cada faixa capturada — e as duas
     capturas nunca coincidiriam. O legado recebeu a mesma trava. */
  const parado = congelado()
  const y = useTransform(scrollY, [0, 8000], parado ? [0, 0] : [0, 8000 * -velocidade])
  const rotate = useTransform(scrollY, [0, 8000], parado ? [0, 0] : [0, 8000 * rotacao])

  return (
    <motion.div style={{ y, rotate }} className={`absolute pointer-events-none select-none ${className}`}>
      {children}
    </motion.div>
  )
}

export function DecoracoesDaHome() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 w-full">
      <FormaEmParallax velocidade={0.05} rotacao={0} className="top-[12%] left-[-10%] w-[500px] h-[500px] transform-gpu">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(60,152,250,0.12)_0%,rgba(60,152,250,0)_70%)] dark:bg-[radial-gradient(circle,rgba(60,152,250,0.08)_0%,rgba(60,152,250,0)_70%)]" />
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.15} rotacao={0.04} className="top-[18%] right-[8%] z-10 transform-gpu">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-[22%] bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 shadow-lg" />
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.1} rotacao={-0.05} className="top-[28%] left-[6%] z-10 transform-gpu">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[22%] bg-gradient-to-br from-secondary/15 to-primary/10 border border-white/5 shadow-md" />
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.18} rotacao={0.03} className="top-[38%] right-[12%] transform-gpu">
        <svg className="w-24 h-24 md:w-32 md:h-32 text-primary/15 dark:text-primary/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="currentColor" strokeWidth="1" />
        </svg>
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.08} rotacao={0} className="top-[52%] right-[-5%] w-[450px] h-[450px] transform-gpu">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,139,8,0.12)_0%,rgba(255,139,8,0)_70%)] dark:bg-[radial-gradient(circle,rgba(255,139,8,0.06)_0%,rgba(255,139,8,0)_70%)]" />
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.12} rotacao={0.01} className="top-[58%] left-[8%] opacity-35 dark:opacity-20 transform-gpu">
        <svg className="w-36 h-36 md:w-48 md:h-48 text-slate-400 dark:text-slate-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.25" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.2} rotacao={0.08} className="top-[72%] right-[6%] transform-gpu">
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-[22%] bg-gradient-to-br from-primary/15 to-secondary/15 border border-white/10 shadow-lg" />
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.14} rotacao={-0.04} className="top-[82%] left-[10%] transform-gpu">
        <svg className="w-28 h-28 md:w-36 md:h-36 text-secondary/20 dark:text-secondary/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="15 30" />
          <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </FormaEmParallax>

      <FormaEmParallax velocidade={0.05} rotacao={0} className="top-[88%] left-[20%] w-[400px] h-[400px] transform-gpu">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(60,152,250,0.12)_0%,rgba(60,152,250,0)_70%)] dark:bg-[radial-gradient(circle,rgba(60,152,250,0.06)_0%,rgba(60,152,250,0)_70%)]" />
      </FormaEmParallax>
    </div>
  )
}
