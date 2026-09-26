'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* Lista de tags que recolhe quando é extensa (task 019) — o filtro de
 * especialidades e as tecnologias de cada card.
 *
 * Recolhida, mostra as primeiras e agrupa o resto numa tag "+N ⌄"; aberta,
 * mostra todas e troca a tag por "Mostrar menos ⌃".
 *
 * ⚠️ O limite é **por faixa de largura**, em classes, e não medido em
 * JavaScript. Quantas tags cabem numa linha muda com a largura — 4 no celular,
 * 18 no computador —, e o servidor não sabe a largura de ninguém. Medir depois
 * da hidratação faria o filtro nascer com todas as tags e encolher na frente do
 * visitante. Com classes, o HTML do servidor já sai recolhido certo em toda
 * largura, e o gate captura sempre a mesma coisa.
 *
 * ⚠️ Tag em `fixos` nunca recolhe: é a tag marcada no filtro. Sem isso, marcar
 * uma que cai no "+N" escondia justamente o que o visitante escolheu. */

const FAIXAS = ['base', 'sm', 'md', 'lg', 'xl'] as const
type Faixa = (typeof FAIXAS)[number]

/** Quantas tags ficam à mostra recolhido: um número para toda largura, ou um
 *  por faixa do Tailwind (`base` é abaixo de `sm`). */
export type Limite = number | Record<Faixa, number>

/* ⚠️ Classes por extenso, uma a uma. O Tailwind gera CSS só do que encontra
 * escrito no código-fonte: `${faixa}:hidden` montado em tempo de execução não
 * geraria regra nenhuma, e a tag nunca sumiria. */
const ESCONDE: Record<Faixa, string> = { base: 'hidden', sm: 'sm:hidden', md: 'md:hidden', lg: 'lg:hidden', xl: 'xl:hidden' }
const MOSTRA_BLOCO: Record<Faixa, string> = {
  base: '',
  sm: 'sm:inline-block',
  md: 'md:inline-block',
  lg: 'lg:inline-block',
  xl: 'xl:inline-block',
}
const MOSTRA_FLEX: Record<Faixa, string> = {
  base: '',
  sm: 'sm:inline-flex',
  md: 'md:inline-flex',
  lg: 'lg:inline-flex',
  xl: 'xl:inline-flex',
}
const MOSTRA_INLINE: Record<Faixa, string> = { base: '', sm: 'sm:inline', md: 'md:inline', lg: 'lg:inline', xl: 'xl:inline' }

/** Classes que mostram o elemento só nas faixas marcadas. Parte de "visível" e
 *  só escreve classe onde o estado muda de uma faixa para a seguinte. */
function visibilidade(visivel: Record<Faixa, boolean>, mostra: Record<Faixa, string>): string {
  const classes: string[] = []
  let anterior = true
  for (const faixa of FAIXAS) {
    if (visivel[faixa] !== anterior) classes.push(visivel[faixa] ? mostra[faixa] : ESCONDE[faixa])
    anterior = visivel[faixa]
  }
  return classes.join(' ')
}

function porFaixa<T>(valor: (faixa: Faixa) => T): Record<Faixa, T> {
  return Object.fromEntries(FAIXAS.map((f) => [f, valor(f)])) as Record<Faixa, T>
}

/** O "+N" de cada faixa, com faixas vizinhas de mesmo número juntas: um card,
 *  que recolhe igual em toda largura, sai com um número só — e não com cinco
 *  cópias, quatro delas escondidas. */
function numerosPorFaixa(escondidos: Record<Faixa, number>): { n: number; classe: string }[] {
  const trechos: { n: number; faixas: Set<Faixa> }[] = []
  let anterior: number | null = null
  for (const f of FAIXAS) {
    const n = escondidos[f]
    if (n > 0 && n === anterior) trechos.at(-1)!.faixas.add(f)
    else if (n > 0) trechos.push({ n, faixas: new Set([f]) })
    anterior = n
  }
  return trechos.map(({ n, faixas }) => ({ n, classe: visibilidade(porFaixa((f) => faixas.has(f)), MOSTRA_INLINE) }))
}

export function TagsRecolhiveis({
  itens,
  limite,
  fixos,
  antes,
  item,
  mais,
  menos,
  className,
  classeDoControle,
}: {
  itens: readonly string[]
  limite: Limite
  /** Nunca recolhem — as tags marcadas no filtro. */
  fixos?: ReadonlySet<string>
  /** O que vem antes da lista e nunca recolhe (o "Todas" do filtro). */
  antes?: ReactNode
  /** Desenha uma tag. `visivel` são as classes que a escondem nas faixas em que
   *  ela recolhe — o chamador junta ao próprio `className`. */
  item: (valor: string, visivel: string) => ReactNode
  /** Texto só para leitor de tela depois do "+N" — "especialidades a mais". O
   *  nome do controle fica "+24 especialidades a mais", e contém o texto
   *  visível (WCAG 2.5.3). */
  mais: string
  /** Rótulo do controle aberto. */
  menos: ReactNode
  className?: string
  classeDoControle: string
}) {
  const [aberto, setAberto] = useState(false)
  const id = useId()

  const lim = typeof limite === 'number' ? porFaixa(() => limite) : limite
  const recolhe = (valor: string, i: number, faixa: Faixa) => i >= lim[faixa] && !fixos?.has(valor)
  const escondidos = porFaixa((f) => itens.filter((v, i) => recolhe(v, i, f)).length)
  const temControle = porFaixa((f) => escondidos[f] > 0)

  return (
    <div id={id} className={className}>
      {antes}
      {itens.map((valor, i) =>
        item(valor, aberto ? '' : visibilidade(porFaixa((f) => !recolhe(valor, i, f)), MOSTRA_BLOCO)),
      )}
      {FAIXAS.some((f) => temControle[f]) && (
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={id}
          onClick={() => setAberto((atual) => !atual)}
          /* Some nas faixas em que nada recolhe — lá não há o que abrir. */
          className={cn(classeDoControle, 'inline-flex items-center gap-0.5', visibilidade(temControle, MOSTRA_FLEX))}
        >
          {aberto ? (
            <>
              {menos}
              <ChevronUp size={12} className="shrink-0" aria-hidden />
            </>
          ) : (
            <>
              {numerosPorFaixa(escondidos).map(({ n, classe }) => (
                <span key={`${n}-${classe}`} className={classe || undefined}>
                  +{n}
                </span>
              ))}
              <span className="sr-only"> {mais}</span>
              <ChevronDown size={12} className="shrink-0" aria-hidden />
            </>
          )}
        </button>
      )}
    </div>
  )
}
