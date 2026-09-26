import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import type { Image } from '@/types/content'

/* Logo com versão opcional para o tema escuro.
 *
 * A troca é só CSS (`dark:`), sem estado: não pisca ao alternar o tema nem na
 * hidratação. Sem versão escura, o mesmo arquivo vale nos dois temas — que é
 * como o site estava.
 *
 * `<img>` e não `next/image`: quem usa decide a caixa, e o next/image a fixaria
 * pelas dimensões declaradas do arquivo. */
export function LogoComTema({
  logo,
  logoDark,
  alt = logo.alt,
  className,
  style,
}: {
  logo: Image
  logoDark?: Image | null
  alt?: string
  className?: string
  style?: CSSProperties
}) {
  const comum = { loading: 'lazy', decoding: 'async', style } as const

  if (!logoDark) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo.url} alt={alt} {...comum} className={className} />
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.url} alt={alt} {...comum} className={cn(className, 'dark:hidden')} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoDark.url} alt={alt} {...comum} className={cn(className, 'hidden dark:block')} />
    </>
  )
}
