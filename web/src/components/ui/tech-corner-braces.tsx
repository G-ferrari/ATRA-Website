'use client'

import { motion } from 'motion/react'

/* Cantoneiras em "L" que delimitam cards e seções.
 * Porte de `legacy/src/components/TechDetails.tsx:185`.
 *
 * Decoração pura — sem ela a regressão visual acusa, porque D-15 vale também
 * para o enfeite. `aria-hidden` porque não há nada a anunciar. */

export type TechCornerBracesProps = {
  color?: 'blue' | 'orange'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  delay?: number
  size?: number
}

export function TechCornerBraces({
  color = 'blue',
  position = 'top-left',
  delay = 0.2,
  size = 14,
}: TechCornerBracesProps) {
  const emCima = position.includes('top')
  const aEsquerda = position.includes('left')

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 0.8, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{
        [emCima ? 'top' : 'bottom']: '16px',
        [aEsquerda ? 'left' : 'right']: '16px',
      }}
      className="absolute pointer-events-none select-none z-15 flex flex-col gap-1"
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderTop: emCima ? '1.5px solid' : 'none',
          borderBottom: emCima ? 'none' : '1.5px solid',
          borderLeft: aEsquerda ? '1.5px solid' : 'none',
          borderRight: aEsquerda ? 'none' : '1.5px solid',
        }}
        className={`${color === 'blue' ? 'border-primary' : 'border-secondary'} opacity-65`}
      />
    </motion.div>
  )
}
