'use client'

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

/* Portado de legacy/src/components/ui/spotlight-card.tsx.
 *
 * Uma diferença de implementação, nenhuma de saída: o CSS do efeito saiu do
 * componente (onde era injetado por instância, 13× só na home) e foi para
 * globals.css, uma vez. Ver o bloco [data-glow] lá. */

type CorDoBrilho = 'blue' | 'purple' | 'green' | 'red' | 'orange'
type Tamanho = 'sm' | 'md' | 'lg'

const MATIZ: Record<CorDoBrilho, { base: number; spread: number }> = {
  blue: { base: 210, spread: 20 },
  orange: { base: 30, spread: 20 },
  purple: { base: 280, spread: 30 },
  green: { base: 140, spread: 30 },
  red: { base: 0, spread: 20 },
}

const TAMANHOS: Record<Tamanho, string> = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
}

export type GlowCardProps = {
  children: ReactNode
  className?: string
  glowColor?: CorDoBrilho
  size?: Tamanho
  width?: string | number
  height?: string | number
  /** Ignora `size` e deixa o dimensionamento para className / width / height. */
  customSize?: boolean
  /** Raio do canto, em pixels. */
  radius?: number
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  radius = 12,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ativo, setAtivo] = useState(false)

  const { base, spread } = MATIZ[glowColor]

  /* Toque não move o brilho: rastrear pointermove em touch bloqueia o scroll. */
  const aoMover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const card = ref.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    card.style.setProperty('--x', x.toFixed(2))
    card.style.setProperty('--xp', (x / r.width).toFixed(2))
    card.style.setProperty('--y', y.toFixed(2))
    card.style.setProperty('--yp', (y / r.height).toFixed(2))
  }

  const estilo = {
    '--base': base,
    '--spread': spread,
    '--radius': String(radius),
    '--border': '1',
    '--size': '250',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 1) * 1px)',
    '--spotlight-size': 'calc(var(--size, 250) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    '--saturation': '100',
    '--lightness': '60',
    '--bg-spot-opacity': ativo ? '0.12' : '0',
    '--border-spot-opacity': ativo ? '0.8' : '0',
    '--border-light-opacity': ativo ? '0.2' : '0',
    borderRadius: 'calc(var(--radius) * 1px)',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.12)), transparent
    )`,
    position: 'relative',
    touchAction: 'pan-y',
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
  } as CSSProperties

  return (
    <div
      ref={ref}
      data-glow
      style={estilo}
      onPointerMove={aoMover}
      onPointerEnter={() => setAtivo(true)}
      onPointerLeave={() => setAtivo(false)}
      /* ⚠️ Concatenação simples, não `cn()`.
       *
       * O legado concatena por template literal, então classes conflitantes
       * coexistem no atributo e o CSS decide pela ordem da folha de estilo.
       * `cn()` roda tailwind-merge, que DESCARTA a perdedora — e a vencedora
       * pode ser outra. Como o requisito é saída idêntica, replica-se o
       * comportamento do legado. Nos demais componentes o legado já usava
       * `cn()`, e lá ele foi mantido. */
      className={[
        !customSize ? TAMANHOS[size] : '',
        !customSize ? 'aspect-[3/4]' : '',
        'relative backdrop-blur-[5px] transition-all duration-300',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div data-glow />
      <div className="relative z-10 h-full w-full flex flex-col justify-between">{children}</div>
    </div>
  )
}
