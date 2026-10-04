import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { numeracao } from '@/lib/paginacao'
import { cn } from '@/lib/utils'

/* Numeração das páginas do blog (D-47).
 *
 * Duas formas com o mesmo desenho:
 * - **links** (`hrefDe`), quando a lista é a do site inteiro: cada página é um
 *   endereço, pré-montado, que o botão voltar e o Google entendem;
 * - **botões** (`aoMudar`), quando há busca ou filtro: o resultado só existe na
 *   tela de quem buscou, e não tem endereço para onde ir.
 *
 * O desenho dos quadrados é o da paginação decorativa do protótipo
 * (`Blog.tsx:246`), que tinha dois botões fixos e não fatiava nada. */

const QUADRADO =
  'min-w-9 h-9 px-2 rounded-[6px] flex items-center justify-center text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C98FA]'
const INATIVO = 'bg-surface-2 text-text-main hover:text-primary cursor-pointer'
const ATIVO = 'bg-primary text-white shadow-sm'
const DESLIGADO = 'bg-surface-2 text-text-muted opacity-40'

export type RotulosDaPaginacao = {
  navegacao: string
  anterior: string
  proxima: string
  pagina: (n: number) => string
}

export function Paginacao({
  atual,
  total,
  rotulos,
  hrefDe,
  aoMudar,
}: {
  atual: number
  total: number
  rotulos: RotulosDaPaginacao
  hrefDe?: (pagina: number) => string
  aoMudar?: (pagina: number) => void
}) {
  if (total <= 1) return null

  const ir = (pagina: number, conteudo: ReactNode, rotulo: string, classe: string, corrente = false) =>
    hrefDe ? (
      <Link href={hrefDe(pagina)} aria-label={rotulo} aria-current={corrente ? 'page' : undefined} className={classe}>
        {conteudo}
      </Link>
    ) : (
      <button type="button" onClick={() => aoMudar?.(pagina)} aria-label={rotulo} aria-current={corrente ? 'page' : undefined} className={classe}>
        {conteudo}
      </button>
    )

  /* Na ponta, a seta vira um quadrado apagado em vez de sumir: a numeração não
     muda de largura entre a primeira página e as outras. */
  const seta = (pagina: number, conteudo: ReactNode, rotulo: string) =>
    pagina < 1 || pagina > total ? (
      <span aria-hidden className={cn(QUADRADO, DESLIGADO)}>
        {conteudo}
      </span>
    ) : (
      ir(pagina, conteudo, rotulo, cn(QUADRADO, INATIVO, 'text-text-muted'))
    )

  return (
    <nav aria-label={rotulos.navegacao} className="mt-14 md:mt-16 flex justify-center items-center gap-2 sm:gap-3">
      {seta(atual - 1, <ChevronLeft size={16} aria-hidden />, rotulos.anterior)}
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {numeracao(atual, total).map((item, i) =>
          item === 'reticencias' ? (
            // A posição serve de chave: há no máximo duas, e nunca vizinhas.
            <li key={`r${i}`} aria-hidden className="w-5 text-center text-xs font-bold text-text-muted select-none">
              …
            </li>
          ) : (
            <li key={item}>{ir(item, item, rotulos.pagina(item), cn(QUADRADO, item === atual ? ATIVO : INATIVO), item === atual)}</li>
          ),
        )}
      </ol>
      {seta(atual + 1, <ChevronRight size={16} aria-hidden />, rotulos.proxima)}
    </nav>
  )
}
