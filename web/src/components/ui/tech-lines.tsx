'use client'

import { motion } from 'motion/react'

/* Linhas decorativas de seção — porte de
 * `legacy/src/components/TechDetails.tsx:17` e `:103`.
 *
 * ⚠️ Existem só na home, e em **todas** as suas seções. Não portá-las custava
 * ~68.000 pixels no aceite: são finas, mas aparecem oito vezes ao longo da
 * página, e o limite é de 0,1%.
 *
 * A prop `sectionName` do gabarito (`STATS_METRICS`, `CASE_LEDGER`…) não é
 * portada: ela existe na assinatura e o componente **nunca a desenha** — o JSX
 * que a mostraria foi removido lá e sobrou o parâmetro. Reproduzir o nome
 * exigiria inventar a marcação que o legado não tem. */

type Cor = 'blue' | 'orange' | 'mixed'

const FUNDO: Record<Cor, string> = {
  blue: 'bg-primary',
  orange: 'bg-secondary',
  mixed: 'bg-linear-to-r from-primary to-secondary',
}

const BRILHO: Record<Cor, string> = {
  blue: 'shadow-[0_0_8px_#3C98FA]',
  orange: 'shadow-[0_0_8px_#FF8B08]',
  mixed: 'shadow-[0_0_8px_#3C98FA]',
}

export function TechHorizontalLine({
  color = 'blue',
  delay = 0,
  align = 'left',
  side = 'top',
}: {
  color?: Cor
  delay?: number
  align?: 'left' | 'right'
  side?: 'top' | 'bottom'
}) {
  const esquerda = align === 'left'

  return (
    <div
      className={`absolute ${side === 'top' ? 'top-0' : 'bottom-0'} ${esquerda ? 'left-0' : 'right-0'} w-full pointer-events-none select-none z-10`}
      style={{ height: '32px' }}
    >
      <div className={`relative w-full h-full flex items-center ${esquerda ? 'justify-start' : 'justify-end'}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay, ease: [0.25, 1, 0.5, 1] }}
          style={{ originX: esquerda ? 0 : 1, width: '30%' }}
          className={`h-[1px] ${FUNDO[color]} opacity-60 relative`}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.8, duration: 0.3 }}
            className={`absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${esquerda ? 'right-0' : 'left-0'} ${FUNDO[color]} ${BRILHO[color]}`}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.5 }}
            className={`absolute top-1/2 -translate-y-1/2 text-[8px] text-text-muted ${esquerda ? 'left-4' : 'right-4'}`}
          >
            +
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export function TechVerticalLine({
  color = 'blue',
  delay = 0.1,
  align = 'left',
  alignY = 'top',
}: {
  color?: Cor
  delay?: number
  align?: 'left' | 'right'
  alignY?: 'top' | 'bottom'
}) {
  const esquerda = align === 'left'
  const cima = alignY === 'top'

  return (
    <div
      className={`absolute ${esquerda ? 'left-0' : 'right-0'} ${cima ? 'top-[10%]' : 'bottom-[10%]'} h-[30%] pointer-events-none select-none z-10`}
      style={{ width: '24px' }}
    >
      <div className="relative w-full h-full flex flex-col items-center">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay, ease: [0.25, 1, 0.5, 1] }}
          style={{ originY: cima ? 0 : 1, height: '100%' }}
          className={`w-[1px] ${color === 'mixed' ? 'bg-linear-to-b from-primary to-secondary' : FUNDO[color]} opacity-40 relative`}
        >
          {/* O nó que desliza pela linha roda em laço infinito; a captura o
              congela porque `stabilize()` zera a duração de toda animação. */}
          <motion.div
            animate={{ y: [0, 150, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ top: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className={`absolute left-1/2 -translate-x-1/2 w-[3px] h-[12px] rounded-full ${color === 'mixed' ? 'bg-primary' : FUNDO[color]} transform-gpu`}
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-[1px] bg-current opacity-30" />
          <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-[1px] bg-current opacity-30" />
        </motion.div>
      </div>
    </div>
  )
}
