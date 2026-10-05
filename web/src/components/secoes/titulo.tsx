import type { CabecalhoDaSecao } from '@/types/content'

/** Título com o trecho em destaque em azul logo depois — o desenho de todos os
 *  cabeçalhos de seção do site ("Todos os <span>cases de sucesso</span>"). */
export function TituloComDestaque({ cabecalho }: { cabecalho: CabecalhoDaSecao }) {
  return (
    <>
      {cabecalho.title}
      {cabecalho.highlight && (
        <>
          {cabecalho.title ? ' ' : ''}
          <span className="text-primary font-normal">{cabecalho.highlight}</span>
        </>
      )}
    </>
  )
}
