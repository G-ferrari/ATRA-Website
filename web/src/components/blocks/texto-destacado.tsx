import React, { Fragment } from 'react'

/* Pinta um trecho do título, como o legado faz com `<span>` no JSX
 * (`About.tsx:175`). O editor não escreve HTML: informa o trecho, e ele é
 * localizado no título.
 *
 * Trecho que não existe no título devolve o título inteiro sem destaque — sem
 * erro e sem texto duplicado, que é o que aconteceria ao concatenar às cegas. */
export function TextoDestacado({
  texto,
  destaque,
  className = 'text-primary font-normal',
}: {
  texto: string
  /** Um trecho, vários, ou nenhum. */
  destaque?: string | string[] | null
  className?: string
}) {
  const trechos = (Array.isArray(destaque) ? destaque : destaque ? [destaque] : []).filter(Boolean)
  if (trechos.length === 0) return <>{texto}</>

  /* Percorre o texto uma vez procurando o próximo trecho a destacar, em vez de
   * aplicar um por vez: destacar em passes separados quebraria o texto já
   * marcado e duplicaria pedaços. */
  const partes: React.ReactNode[] = []
  let resto = texto
  let chave = 0

  while (resto.length > 0) {
    let melhor: { i: number; trecho: string } | null = null
    for (const t of trechos) {
      const i = resto.indexOf(t)
      if (i !== -1 && (melhor === null || i < melhor.i)) melhor = { i, trecho: t }
    }
    if (!melhor) {
      partes.push(resto)
      break
    }
    if (melhor.i > 0) partes.push(resto.slice(0, melhor.i))
    partes.push(
      <span key={chave++} className={className}>
        {melhor.trecho}
      </span>,
    )
    resto = resto.slice(melhor.i + melhor.trecho.length)
  }

  return <Fragment>{partes}</Fragment>
}
