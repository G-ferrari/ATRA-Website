'use client'

import { useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

import { congelado } from '@/lib/e2e'

/* Contador que sobe até o número — porte de
 * `legacy/src/components/ui/animated-counter.tsx`.
 *
 * ⚠️ Com `?e2e=1` começa **no valor final**, sem mola. Sem isso o número
 * capturado depende de quando a mola assentou, e varia entre execuções — a
 * mesma classe de corrida da animação de entrada dos cards. O legado recebeu a
 * mesma trava, senão a assimetria seria criada por este porte.
 *
 * Escreve via `ref` em vez de estado: o valor muda a cada quadro e re-renderizar
 * o React 60×/s por número na tela é desperdício — é o que o legado faz. */
export function ContadorAnimado({
  ate,
  sufixo = '',
  className,
}: {
  ate: number
  sufixo?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inicial = congelado() ? ate : 0
  const valor = useMotionValue(inicial)
  const mola = useSpring(valor, { damping: 50, stiffness: 100 })

  useEffect(() => {
    if (congelado()) return
    valor.set(ate)
  }, [valor, ate])

  useEffect(() => {
    return mola.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${sufixo}`
    })
  }, [mola, sufixo])

  return (
    <span ref={ref} className={className}>
      {inicial}
      {sufixo}
    </span>
  )
}
