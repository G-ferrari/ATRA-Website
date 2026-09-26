'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

import type { Escolhidos } from '@/lib/consultores'

/* O carrinho de /consultores e a aba de pedido, compartilhados entre ilhas
 * (tasks 013 e 018).
 *
 * A lista de perfis, onde o visitante escolhe, a chamada "Não encontrou…", a
 * seção final e a aba de pedido, onde ele envia, são ilhas separadas — e entre
 * elas há seções que `page.tsx` renderiza no servidor. Nenhuma é mãe da outra.
 *
 * ⚠️ É o primeiro `createContext` do repositório, e a escolha foi deliberada. As
 * alternativas eram passar as seções do servidor como prop para dentro de uma
 * ilha só — acoplando conteúdo institucional ao catálogo — ou um store em
 * módulo, que é estado global escondido. Server Component pode ser filho de
 * provedor cliente: `page.tsx` envolve as seções, e qualquer ilha abaixo lê o
 * carrinho e abre a aba.
 *
 * ⚠️ O `setState` que sai daqui é o mesmo do `useState`, então vale a regra da
 * 009 e da 010: sempre na forma **funcional**, com o valor novo tirado de
 * `atual` — ver `alternarPerfil` em `lib/consultores.ts`. */

/** Onde o foco pousa quando a aba abre: no título (quem veio escolher perfis) ou
 *  no campo livre (quem veio da chamada "Não encontrou…"). */
export type FocoDaAba = 'titulo' | 'descricao'

type Solicitacao = {
  escolhidos: Escolhidos
  setEscolhidos: Dispatch<SetStateAction<Escolhidos>>
  /** Expandida ou não. Recolhida com itens no carrinho, a aba vira a barra de
   *  resumo; sem itens, some. */
  aba: { aberta: boolean; foco: FocoDaAba }
  abrirAba: (foco?: FocoDaAba, retorno?: () => HTMLElement | null) => void
  fecharAba: () => void
  /** Chamar depois de **acrescentar** um perfil. Só a primeira vez abre a aba
   *  (task 018): dali em diante o visitante já sabe onde ela está, e reabrir a
   *  cada perfil custaria um clique para voltar à lista. */
  aoAdicionar: (retorno?: () => HTMLElement | null) => void
  /** Para onde o foco volta quando a aba recolhe, se quem abriu pediu um lugar
   *  específico. Devolve e esquece: vale para um fechamento só. */
  tomarRetorno: () => HTMLElement | null
}

const Contexto = createContext<Solicitacao | null>(null)

/** Id do campo de descrição do formulário. Constante compartilhada porque duas
 *  ilhas precisam dele: o formulário o declara, e a aba o foca quando a chamada
 *  "Não encontrou um consultor nesta lista?" a abre. */
export const ID_DESCRICAO = 'descricao-da-solicitacao'

/** Id do `<dialog>` da aba de pedido. */
export const ID_ABA = 'aba-de-pedido'

/** Atributos que abrem a aba **sem JavaScript**: comando nativo do HTML
 *  (`commandfor` + `command`), que o navegador executa sozinho no clique.
 *
 *  ⚠️ Em minúsculas e por espalhamento: o React 19.2 não conhece estas props —
 *  `commandFor` sairia com aviso de prop desconhecida —, mas repassa atributo
 *  minúsculo desconhecido como está. Com JavaScript, quem usa isto **tem** de
 *  chamar `preventDefault()` no clique e abrir pelo provedor: clique cancelado
 *  não executa o comando, e o estado da aba continua sendo um só. */
export const ABRE_A_ABA_SEM_JS: Record<string, string> = { commandfor: ID_ABA, command: 'show-modal' }

export function ProvedorDaSolicitacao({ children }: { children: React.ReactNode }) {
  const [escolhidos, setEscolhidos] = useState<Escolhidos>(new Set())
  const [aba, setAba] = useState<{ aberta: boolean; foco: FocoDaAba }>({ aberta: false, foco: 'titulo' })
  /* Refs, e não estado: nenhum dos dois aparece na tela, e mudar qualquer um não
     deve re-renderizar as ilhas. */
  const jaAbriu = useRef(false)
  const retornoDaAba = useRef<(() => HTMLElement | null) | null>(null)

  const abrirAba = useCallback((foco: FocoDaAba = 'titulo', retorno?: () => HTMLElement | null) => {
    jaAbriu.current = true
    retornoDaAba.current = retorno ?? null
    setAba({ aberta: true, foco })
  }, [])
  const fecharAba = useCallback(() => setAba((atual) => (atual.aberta ? { ...atual, aberta: false } : atual)), [])
  const tomarRetorno = useCallback(() => {
    const retorno = retornoDaAba.current
    retornoDaAba.current = null
    return retorno?.() ?? null
  }, [])
  const aoAdicionar = useCallback(
    (retorno?: () => HTMLElement | null) => {
      if (!jaAbriu.current) abrirAba('titulo', retorno)
    },
    [abrirAba],
  )

  /* Memorizado: sem isto, todo render do provedor criaria um objeto novo e
     re-renderizaria todas as ilhas mesmo com carrinho e aba iguais. */
  const valor = useMemo(
    () => ({ escolhidos, setEscolhidos, aba, abrirAba, fecharAba, aoAdicionar, tomarRetorno }),
    [escolhidos, aba, abrirAba, fecharAba, aoAdicionar, tomarRetorno],
  )
  return <Contexto value={valor}>{children}</Contexto>
}

export function useSolicitacao(): Solicitacao {
  const valor = useContext(Contexto)
  /* Falha alto: usar o carrinho fora do provedor é erro de montagem da página,
     e um carrinho vazio silencioso esconderia isso até alguém tentar enviar. */
  if (!valor) throw new Error('useSolicitacao() fora de <ProvedorDaSolicitacao> — ver consultores/page.tsx')
  return valor
}
