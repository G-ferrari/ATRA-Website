'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/* Contador que aceita o número **e o sufixo numa string só** ("5x", "150+") —
 * porte de `legacy/src/App.tsx:1096`.
 *
 * ⚠️ Diferente do `ContadorAnimado`, que recebe número e sufixo separados. Os
 * dois convivem porque o legado tem os dois: o do herói de solução declara
 * `end={70}` e `suffix="%"`, e o do bento da home escreve `value="15+"`. Unificar
 * exigiria decidir por um dos dois formatos no CMS, e o campo do bento é texto
 * livre justamente porque "5x" não é número com sufixo.
 *
 * Com `prefers-reduced-motion: reduce` mostra o valor final na hora — que é o
 * caso do aceite visual, cujo contexto do Playwright pede movimento reduzido. */
export function ContadorDeTexto({ value }: { value: string }) {
  const alvo = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const sufixo = value.replace(/[0-9]/g, '')
  const [atual, setAtual] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const visivel = useInView(ref, { once: true, amount: 0.1, margin: '0px 0px 50px 0px' })

  useEffect(() => {
    /* ⚠️ Com movimento reduzido a animação roda com **duração zero** em vez de
     * um `setAtual(alvo)` direto. O resultado na tela é o mesmo — o valor final
     * aparece de imediato —, mas `setState` síncrono no corpo de um efeito
     * dispara render em cascata, e o lint reprova com razão. */
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduzido && !visivel) return
    const controle = animate(0, alvo, {
      duration: reduzido ? 0 : 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setAtual(Math.round(v)),
    })
    return () => controle.stop()
  }, [visivel, alvo])

  /* Rede de segurança do gabarito: em navegador onde o observer demora, o
     número apareceria zerado para sempre. */
  useEffect(() => {
    const t = setTimeout(() => setAtual((p) => (p === 0 && alvo > 0 ? alvo : p)), 1500)
    return () => clearTimeout(t)
  }, [alvo])

  return (
    <span ref={ref}>
      {atual}
      {sufixo}
    </span>
  )
}
