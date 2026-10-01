'use client'

import { ArrowRight, UserSearch } from 'lucide-react'

import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'

import { ABRE_A_ABA_SEM_JS, useSolicitacao } from './solicitacao-contexto'

/* Chamada "Não encontrou um consultor nesta lista?" — a saída para quem não se
 * identifica com nenhum dos arquétipos (task 014), agora em dois lugares com
 * dois pesos (task 017):
 *
 * - `destaque`: dentro da seção de diferenciais, com o gradiente da marca. É o
 *   único bloco da página com ele, de propósito — pedido do dono de 21/09:
 *   "componente diferente dos outros para chamar a atenção".
 * - `discreta`: no estado vazio do filtro, embaixo de "Resetar Filtros". Ali o
 *   visitante não vê a seção de diferenciais, e é o beco sem saída exato.
 *
 * Desde a task 018 ela **abre a aba de pedido** com o foco no campo livre — até
 * então era uma âncora que rolava até o formulário, que saiu da página. Por isso
 * é `<button>`, e não mais `<a>`: abre um diálogo, não navega.
 *
 * ⚠️ Com cara de link, e não `pill-btn-*`: aquelas classes são `uppercase
 * tracking-wider`, e a cópia do dono tem mais de 70 caracteres — em caixa-alta
 * espaçada, dentro de um botão, não se lê.
 *
 * ⚠️ **Não esvazia o carrinho.** O caso esperado é o carrinho já vazio (nada
 * serviu); quem escolheu dois perfis e quer descrever um terceiro perderia os
 * dois sem ter pedido.
 *
 * Sem JavaScript, o comando nativo abre a aba (`ABRE_A_ABA_SEM_JS`). Com ele, o
 * foco vai ao campo livre — consequência do clique da própria pessoa, então não
 * rouba foco de ninguém, e o leitor de tela anuncia o rótulo do campo. */

const TEXTOS = {
  pt: {
    naoEncontrou: 'Não encontrou um consultor nesta lista?',
    pedirSobMedida: 'Clique aqui e solicite que vamos encontrar um candidato ideal para você.',
  },
  en: {
    naoEncontrou: "Couldn't find a consultant on this list?",
    pedirSobMedida: 'Click here and request one — we will find the ideal candidate for you.',
  },
} as const

/* ⚠️ Par claro/escuro. `text-primary` sozinho mediu 2,97:1 sobre a superfície
   clara — abaixo do AA, justo no convite. `primary-dark` no claro dá 4,72:1, e
   o escuro, que o gabarito captura, fica igual. */
const COR_DO_LINK = 'text-primary-dark dark:text-primary'

export function ChamadaSobMedida({
  locale,
  variante,
  className,
}: {
  locale: Locale
  variante: 'destaque' | 'discreta'
  className?: string
}) {
  const t = TEXTOS[locale]
  const { abrirAba } = useSolicitacao()
  const abrir = (evento: React.MouseEvent<HTMLButtonElement>) => {
    /* Cancelar o clique cancela o comando nativo: quem abre é o provedor, e o
       estado da aba continua sendo um só. */
    evento.preventDefault()
    abrirAba('descricao')
  }

  if (variante === 'discreta') {
    return (
      <div className={className}>
        <p className="text-sm font-semibold text-text-main">{t.naoEncontrou}</p>
        <button
          type="button"
          {...ABRE_A_ABA_SEM_JS}
          onClick={abrir}
          className={cn(
            'mt-1 inline-flex items-center gap-1.5 text-sm underline underline-offset-2 hover:no-underline cursor-pointer',
            COR_DO_LINK,
          )}
        >
          {t.pedirSobMedida}
          <ArrowRight size={14} className="shrink-0" aria-hidden />
        </button>
      </div>
    )
  }

  /* Borda de 1px com o gradiente da marca: o contêiner de fora pinta o
     gradiente, e o de dentro cobre tudo menos o `p-px`. O cartão inteiro é
     clicável — o `after:` do botão se estende sobre ele —, mas o alvo continua
     sendo um controle só, com um nome só para o leitor de tela. */
  return (
    <div
      className={cn(
        'group relative rounded-[6px] p-px bg-gradient-atra shadow-md hover:shadow-lg transition-shadow',
        className,
      )}
    >
      {/* Miolo branco no claro e grafite da página no escuro: nos dois temas ele
          se separa da caixa da seção, que é `surface-2`. */}
      <div className="relative rounded-[5px] bg-surface-2 dark:bg-surface-1 overflow-hidden">
        {/* Véu do mesmo gradiente, bem fraco, para o miolo não ficar igual aos
            cartões de diferencial.
            ⚠️ 4% no claro, e sem reforço no hover. O link passa por cima do véu
            de ponta a ponta no celular, e `primary-dark` sobre branco já é
            4,72:1: com 7% o fundo escurecia até ~4,2:1, abaixo do AA. Medido no
            pixel em 21/09: 4,55:1 no claro, 5,33:1 no escuro com o hover de 12%. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-atra opacity-[0.04] dark:opacity-[0.07] dark:group-hover:opacity-[0.12] transition-opacity"
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-5 sm:p-6">
          <div
            aria-hidden
            className="w-11 h-11 rounded-[6px] bg-gradient-atra text-white flex items-center justify-center shrink-0 shadow-md"
          >
            <UserSearch size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-light font-display text-text-main leading-snug">
              {t.naoEncontrou}
            </h3>
            <button
              type="button"
              {...ABRE_A_ABA_SEM_JS}
              onClick={abrir}
              className={cn(
                'mt-1 inline-flex items-center gap-1.5 text-left text-sm font-semibold cursor-pointer after:absolute after:inset-0 after:content-[""]',
                COR_DO_LINK,
              )}
            >
              {t.pedirSobMedida}
              <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
