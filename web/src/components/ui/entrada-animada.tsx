'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/* Animação de entrada dos cards em grade.
 *
 * O legado repete este bloco em praticamente toda listagem
 * (`Reports.tsx:56`, `Ebooks.tsx:49`, `Glossary.tsx:...`): opacidade e 20px de
 * deslocamento, disparados ao entrar na viewport, com atraso escalonado por
 * índice.
 *
 * ⚠️ Não é enfeite dispensável. Na captura da regressão visual o
 * `whileInView` não chega a disparar, e o conteúdo fica no estado **inicial** —
 * 20px abaixo. Sem este wrapper o card do app novo nasce 20px acima do
 * gabarito, e a diferença aparece em toda a grade. */

export function EntradaAnimada({
  children,
  index = 0,
  className,
  id,
}: {
  children: ReactNode
  index?: number
  className?: string
  id?: string
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
