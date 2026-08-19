import { Fragment } from 'react'

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
  destaque?: string | null
  className?: string
}) {
  if (!destaque) return <>{texto}</>

  const i = texto.indexOf(destaque)
  if (i === -1) return <>{texto}</>

  return (
    <Fragment>
      {texto.slice(0, i)}
      <span className={className}>{destaque}</span>
      {texto.slice(i + destaque.length)}
    </Fragment>
  )
}
