'use client'

import { ArrowRight } from 'lucide-react'

import { ABRE_A_ABA_SEM_JS, useSolicitacao } from './solicitacao-contexto'

/* O botão da seção final que abre a aba de pedido (task 018). Ilha à parte
 * porque a seção é do servidor e só este botão precisa do provedor.
 *
 * Sem JavaScript, o comando nativo abre a aba (`ABRE_A_ABA_SEM_JS`); com ele, o
 * clique é cancelado e quem abre é o provedor — um estado só. */
export function AbrirPedido({ rotulo }: { rotulo: string }) {
  const { abrirAba } = useSolicitacao()
  return (
    <div>
      {/* Mesma cor do antigo "Verificar Disponibilidade" da seção, que o legado
          tem e o aceite visual comparava. */}
      <button
        type="button"
        {...ABRE_A_ABA_SEM_JS}
        aria-haspopup="dialog"
        onClick={(evento) => {
          evento.preventDefault()
          abrirAba('titulo')
        }}
        className="bg-primary text-white dark:bg-white dark:text-[#12151c] py-3 px-6 rounded-[6px] text-sm font-medium transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
      >
        <span>{rotulo}</span>
        <ArrowRight size={16} aria-hidden />
      </button>
    </div>
  )
}
