'use client'

import { createContext, useContext, useMemo, useState, type Dispatch, type SetStateAction } from 'react'

import type { Escolhidos } from '@/lib/consultores'

/* O carrinho de /consultores, compartilhado entre duas ilhas (task 013).
 *
 * A lista de perfis, onde o visitante escolhe, e o formulário, onde ele envia,
 * são ilhas separadas — e **entre elas** fica a seção de diferenciais, que
 * `page.tsx` renderiza no servidor. Nenhuma das duas é mãe da outra.
 *
 * ⚠️ É o primeiro `createContext` do repositório, e a escolha foi deliberada. As
 * alternativas eram passar os diferenciais como prop para dentro da ilha da
 * lista — acoplando uma seção institucional ao catálogo — ou um store em
 * módulo, que é estado global escondido. Server Component pode ser filho de
 * provedor cliente: `page.tsx` envolve as três seções, e qualquer ilha abaixo
 * lê o carrinho.
 *
 * ⚠️ O `setState` que sai daqui é o mesmo do `useState`, então vale a regra da
 * 009 e da 010: sempre na forma **funcional**, com o valor novo tirado de
 * `atual` — ver `ajustarQuantidade` em `lib/consultores.ts`. */

type Solicitacao = {
  escolhidos: Escolhidos
  setEscolhidos: Dispatch<SetStateAction<Escolhidos>>
}

const Contexto = createContext<Solicitacao | null>(null)

export function ProvedorDaSolicitacao({ children }: { children: React.ReactNode }) {
  const [escolhidos, setEscolhidos] = useState<Escolhidos>(new Map())
  /* Memorizado: sem isto, todo render do provedor criaria um objeto novo e
     re-renderizaria as duas ilhas mesmo com o carrinho igual. */
  const valor = useMemo(() => ({ escolhidos, setEscolhidos }), [escolhidos])
  return <Contexto value={valor}>{children}</Contexto>
}

export function useSolicitacao(): Solicitacao {
  const valor = useContext(Contexto)
  /* Falha alto: usar o carrinho fora do provedor é erro de montagem da página,
     e um carrinho vazio silencioso esconderia isso até alguém tentar enviar. */
  if (!valor) throw new Error('useSolicitacao() fora de <ProvedorDaSolicitacao> — ver consultores/page.tsx')
  return valor
}
