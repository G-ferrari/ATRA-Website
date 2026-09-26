import { cn } from '@/lib/utils'

/* Barra de progresso das etapas (FEATURE §8.2), no desenho da barra do
 * carrossel de cases — trilho fino de ponta arredondada e preenchimento azul
 * sólido. Sem o gradiente do HTML do Roger: o acento é pontuação (DESIGN.md), e
 * a barra aparece em toda tela do questionário. 6 px de altura, como no HTML.
 *
 * Não é ilha: não tem estado, e quem a desenha é o questionário.
 *
 * ⚠️ `aria-valuetext` carrega o rótulo da etapa ("Pergunta 4 de 17"). Sem ele o
 * leitor de tela anuncia só "35 por cento", que não diz onde a pessoa está. */
export function BarraDeProgresso({
  valor,
  rotuladoPor,
  textoDoValor,
  className,
}: {
  /** 0 a 100; fora disso é cortado. */
  valor: number
  /** id do elemento que dá nome à barra. */
  rotuladoPor: string
  textoDoValor?: string
  className?: string
}) {
  const percentual = Math.min(100, Math.max(0, Math.round(valor)))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentual}
      aria-valuetext={textoDoValor}
      aria-labelledby={rotuladoPor}
      /* Trilho em `white/10` no escuro, e não o `slate-800` do carrossel: lá a
         barra fica sobre o fundo da página; aqui, dentro do cartão grafite
         elevado, o `slate-800` some. */
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10', className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${percentual}%` }}
      />
    </div>
  )
}
