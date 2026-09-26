'use client'

import { useRef, useState, type FocusEvent, type KeyboardEvent, type Ref } from 'react'

import { cn } from '@/lib/utils'

/* As alternativas de uma pergunta como grupo de rádio (FEATURE §8.2).
 *
 * `role="radio"` num `<button>`, como o HTML do Roger — o botão já traz o que o
 * rádio precisa de graça: foco, clique, Enter e Espaço.
 *
 * ⚠️ As setas **só movem o foco**; quem escolhe é Enter/Espaço (ou o clique).
 * O padrão da APG faz a seta marcar também, mas aqui marcar dispara o avanço
 * automático de 350 ms: percorrer as quatro opções com a seta pularia a
 * pergunta na primeira tecla.
 *
 * ⚠️ Foco visível no `<span>` de dentro, e não no botão. O `globals.css` herdado
 * do legado zera `outline` **e** `box-shadow` de todo `button`/`[tabindex]` em
 * foco, com `!important` (débito de a11y registrado, D-15) — `focus-visible:ring`
 * no próprio botão não aparece. O filho não está em foco, a regra não o pega, e
 * `group-focus-visible` desenha o anel nele. */

const LETRAS = 'ABCDE'

export function OpcaoDoQuestionario({
  letra,
  texto,
  selecionada,
  focavel,
  desabilitada = false,
  atalhos,
  onEscolher,
  onFocus,
  ref,
}: {
  letra: string
  texto: string
  selecionada: boolean
  /** A parada de Tab do grupo (roving tabindex): só uma opção por vez é `true`. */
  focavel: boolean
  desabilitada?: boolean
  /** Teclas que escolhem esta opção (`aria-keyshortcuts`), só se quem desenha
   * o grupo as implementa. */
  atalhos?: string
  onEscolher: () => void
  onFocus?: () => void
  ref?: Ref<HTMLButtonElement>
}) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selecionada}
      aria-keyshortcuts={atalhos}
      tabIndex={focavel ? 0 : -1}
      disabled={desabilitada}
      onClick={onEscolher}
      onFocus={onFocus}
      className="group block w-full cursor-pointer rounded-[6px] text-left disabled:cursor-not-allowed"
    >
      {/* Sem borda (Regra Sem-Borda): a opção se separa do cartão pelo tom
          recuado e, escolhida, pelo azul tonal com a letra cheia — a letra
          cheia também diz "escolhida" para quem não distingue a cor. */}
      <span
        className={cn(
          'flex min-h-11 items-start gap-3 rounded-[6px] px-4 py-3.5 text-[15px] leading-relaxed transition-[background-color,box-shadow,color] duration-200 motion-reduce:transition-none',
          'group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-primary',
          'group-disabled:opacity-50',
          selecionada
            ? 'bg-primary/10 text-text-main'
            : 'bg-surface-1 text-text-subtle group-hover:bg-surface-3 group-hover:text-text-main group-hover:shadow-md',
        )}
      >
        <span
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-[6px] text-xs font-bold transition-colors duration-200 motion-reduce:transition-none',
            selecionada ? 'bg-primary text-white' : 'bg-primary/10 text-primary-dark dark:text-primary',
          )}
        >
          {letra}
        </span>
        <span className="pt-0.5">{texto}</span>
      </span>
    </button>
  )
}

export function GrupoDeAlternativas({
  alternativas,
  escolhida,
  onEscolher,
  rotuladoPor,
  descritoPor,
  comAtalhos = false,
  className,
}: {
  alternativas: readonly { texto: string }[]
  /** Índice da alternativa escolhida, ou `undefined` sem resposta. */
  escolhida: number | undefined
  onEscolher: (indice: number) => void
  /** id do enunciado, que dá nome ao grupo. */
  rotuladoPor: string
  descritoPor?: string
  /** Quem desenha o grupo trata A–D e 1–4 (o questionário trata no cartão
   * inteiro, como o HTML); aqui só se declara, para o leitor de tela. */
  comAtalhos?: boolean
  className?: string
}) {
  const botoes = useRef<(HTMLButtonElement | null)[]>([])
  /* Com o foco fora do grupo, o Tab entra pela escolhida (ou pela primeira);
     dentro, a parada acompanha o foco. `null` = foco fora. */
  const [focada, setFocada] = useState<number | null>(null)
  const parada = focada ?? escolhida ?? 0

  const focar = (indice: number) => {
    const total = alternativas.length
    botoes.current[((indice % total) + total) % total]?.focus()
  }

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const destinos: Record<string, number> = {
      ArrowDown: parada + 1,
      ArrowRight: parada + 1,
      ArrowUp: parada - 1,
      ArrowLeft: parada - 1,
      Home: 0,
      End: alternativas.length - 1,
    }
    if (!Object.hasOwn(destinos, e.key)) return
    const destino = destinos[e.key]
    e.preventDefault()
    focar(destino)
  }

  const aoSair = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocada(null)
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={rotuladoPor}
      aria-describedby={descritoPor}
      onKeyDown={aoTeclar}
      onBlur={aoSair}
      className={cn('grid gap-2.5', className)}
    >
      {alternativas.map((alternativa, i) => (
        <OpcaoDoQuestionario
          key={i}
          ref={(el) => {
            botoes.current[i] = el
          }}
          letra={LETRAS[i]}
          texto={alternativa.texto}
          selecionada={escolhida === i}
          focavel={parada === i}
          atalhos={comAtalhos ? `${LETRAS[i]} ${i + 1}` : undefined}
          onEscolher={() => onEscolher(i)}
          onFocus={() => setFocada(i)}
        />
      ))}
    </div>
  )
}
