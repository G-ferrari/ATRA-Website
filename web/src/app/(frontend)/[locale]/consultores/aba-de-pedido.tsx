'use client'

import { ChevronDown, ChevronRight, ChevronUp, ClipboardList, Minus, Plus, X } from 'lucide-react'
import { useActionState, useEffect, useRef, useSyncExternalStore } from 'react'

import { solicitarConsultoresNoFormulario } from '@/actions/consultores'
import { ajustarQuantidade, alternarPerfil, itensEscolhidos, MAX_POR_PERFIL, totalDePessoas } from '@/lib/consultores'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { ConsultantRole } from '@/types/content'

import { FormularioDeSolicitacao } from './formulario-de-solicitacao'
import { gradienteDe } from './gradientes'
import { ID_ABA, ID_DESCRICAO, useSolicitacao } from './solicitacao-contexto'

/* Aba de pedido (task 018) — o carrinho e o formulário numa aba só, como a de
 * uma loja. Sobe de baixo no celular e desliza da direita no computador.
 *
 * Três estados: **expandida** (diálogo modal com a lista e o formulário),
 * **minimizada** (barra de resumo no rodapé, só com o carrinho cheio) e
 * **oculta** (carrinho vazio e aba recolhida). O primeiro "adicionar" da visita
 * expande; os seguintes só atualizam a barra — ver `aoAdicionar` no provedor.
 *
 * ⚠️ `<dialog>` nativo, e não uma `div` com `role="dialog"` como o detalhe do
 * perfil. O `showModal()` entrega de graça o que a `div` teria de reimplementar:
 * foco preso dentro, fundo inerte, `Esc` para fechar e a camada de cima da
 * página — acima da barra fixa do topo, sem guerra de `z-index`.
 *
 * ⚠️ E funciona **sem JavaScript**, que a 013 garantiu para o formulário e esta
 * task não pode perder:
 * - abrir: os botões que abrem a aba levam `commandfor`/`command` (comando
 *   nativo do HTML — ver `ABRE_A_ABA_SEM_JS`);
 * - minimizar: `<form method="dialog">`, que fecha o diálogo em qualquer
 *   navegador;
 * - a resposta do envio: a página volta do servidor com a aba **aberta** (ver
 *   `noServidor` abaixo), senão a confirmação ficaria dentro de um diálogo
 *   fechado e o visitante não veria nada.
 * Navegador sem o comando nativo e sem JavaScript fica sem a aba — e com o
 * painel de contatos da seção final, que é e-mail e WhatsApp. */

const TEXTOS = {
  pt: {
    titulo: 'Minha solicitação',
    resumo: (perfis: number, pessoas: number) =>
      `${perfis} ${perfis === 1 ? 'perfil' : 'perfis'} · ${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}`,
    vazio: 'Nenhum perfil escolhido ainda. Escolha na lista ou descreva abaixo o profissional que você procura.',
    minimizar: 'Minimizar',
    expandir: 'Revisar e enviar',
    menos: 'Diminuir a quantidade',
    mais: 'Aumentar a quantidade',
    remover: 'Remover da solicitação',
  },
  en: {
    titulo: 'My request',
    resumo: (perfis: number, pessoas: number) =>
      `${perfis} ${perfis === 1 ? 'profile' : 'profiles'} · ${pessoas} ${pessoas === 1 ? 'person' : 'people'}`,
    vazio: 'No profile picked yet. Pick from the list, or describe below the professional you are looking for.',
    minimizar: 'Minimize',
    expandir: 'Review and send',
    menos: 'Decrease the amount',
    mais: 'Increase the amount',
    remover: 'Remove from the request',
  },
} as const

const ID_TITULO = 'titulo-da-aba-de-pedido'

/* Assinatura que nunca notifica: o valor só difere entre servidor e cliente. */
const semAssinatura = () => () => {}

const BOTAO_QUANTIDADE =
  'w-6 h-6 rounded-[4px] bg-surface-2 text-text-main flex items-center justify-center transition-colors hover:bg-surface-3 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-surface-2 cursor-pointer'

export function AbaDePedido({
  perfis,
  locale,
  privacidadeHref,
}: {
  perfis: ConsultantRole[]
  locale: Locale
  /** Resolvido no servidor por `hrefDe` (regra 6): esta ilha não monta URL. */
  privacidadeHref: string
}) {
  const t = TEXTOS[locale]
  const { escolhidos, setEscolhidos, aba, abrirAba, fecharAba, tomarRetorno } = useSolicitacao()
  /* Por `itensEscolhidos`: perfil que saiu do catálogo não vai para o servidor
     nem aparece no resumo — e a soma de pessoas sai da mesma lista. */
  const itens = itensEscolhidos(perfis, escolhidos)
  const pessoas = totalDePessoas(itens)

  /* ⚠️ A própria Server Action, e não um embrulho — com embrulho o formulário
   * não envia sem JavaScript. Mora aqui, e não no formulário, porque o
   * `<dialog>` precisa do resultado: ver `noServidor`. */
  const [envio, acao, enviando] = useActionState(solicitarConsultoresNoFormulario, null)

  /* ⚠️ Verdadeiro só na renderização do servidor (e na hidratação, que a
   * repete). É o que deixa a aba **aberta** na página que responde a um envio
   * sem JavaScript: `envio` só chega preenchido ao servidor nesse caso. Depois
   * da hidratação vira falso e o atributo `open` sai das mãos do React — quem
   * abre e fecha é o `showModal()`. Se o React continuasse dono do `open`, a
   * próxima renderização reabriria como não modal um diálogo que o visitante
   * acabou de fechar. */
  const noServidor = useSyncExternalStore(semAssinatura, () => false, () => true)

  const dialogo = useRef<HTMLDialogElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const corpo = useRef<HTMLDivElement>(null)
  const barra = useRef<HTMLButtonElement>(null)
  /* Quem tinha o foco quando a aba abriu, para devolvê-lo ao recolher. */
  const origem = useRef<HTMLElement | null>(null)
  const focoPendente = useRef<HTMLElement | 'barra' | null>(null)

  /* O estado do provedor manda; o diálogo segue. */
  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (aba.aberta) {
      if (!d.open) {
        origem.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        d.showModal()
      }
      /* O `showModal()` foca o primeiro controle (o "Minimizar"); o título diz
         ao leitor de tela onde ele está, e o campo livre é o que a chamada
         "Não encontrou…" prometeu. */
      const alvo = aba.foco === 'descricao' ? document.getElementById(ID_DESCRICAO) : titulo.current
      alvo?.focus()
    } else if (d.open) {
      d.close()
    }
  }, [aba])

  /* Todo fechamento passa por aqui — "Minimizar" (`method="dialog"`), `Esc` e
     clique fora —, porque todos são o `close` nativo. */
  const aoFechar = () => {
    fecharAba()
    const pedido = tomarRetorno()
    /* ⚠️ O navegador já devolve o foco a quem tinha antes do `showModal()` — mas
       quem adicionou pelo detalhe do perfil tinha o foco num botão que sumiu
       com o detalhe, e o foco caía no `<body>`. Daí o pedido explícito de quem
       abriu, e a barra como último recurso. A barra só existe depois do render
       que recolhe a aba, então o foco espera o efeito abaixo. */
    const anterior = origem.current
    /* ⚠️ `<body>` não conta como origem. Quem abre pela barra perde a barra no
       mesmo render que abre a aba — quando o efeito anota a origem, o foco já
       caiu no `<body>`, e devolver para ele deixava o teclado no topo da
       página. */
    const valida = anterior?.isConnected && anterior !== document.body ? anterior : null
    focoPendente.current = pedido ?? valida ?? 'barra'
  }
  useEffect(() => {
    if (aba.aberta || !focoPendente.current) return
    const alvo = focoPendente.current === 'barra' ? barra.current : focoPendente.current
    focoPendente.current = null
    alvo?.focus()
  }, [aba.aberta])

  /* Com a aba expandida, a página atrás não rola. O fundo já é inerte pelo
     `showModal()`, mas a roda do mouse sobre o fundo ainda rolava a página. */
  useEffect(() => {
    if (!aba.aberta) return
    const html = document.documentElement
    const antes = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = antes
    }
  }, [aba.aberta])

  /* Depois de enviar, o topo da aba — onde está a confirmação. O botão de envio
     fica no fim, e a confirmação nasceria fora da vista. */
  useEffect(() => {
    if (envio?.ok) corpo.current?.scrollTo({ top: 0 })
  }, [envio])

  const barraVisivel = !aba.aberta && itens.length > 0

  /* ⚠️ A barra é fixa e cobriria o fim da página — a última linha do rodapé
     ficava embaixo dela. Enquanto ela existe, o `body` ganha o espaço. */
  useEffect(() => {
    if (!barraVisivel) return
    const antes = document.body.style.paddingBottom
    document.body.style.paddingBottom = '6rem'
    return () => {
      document.body.style.paddingBottom = antes
    }
  }, [barraVisivel])

  return (
    <>
      <dialog
        id={ID_ABA}
        ref={dialogo}
        aria-labelledby={ID_TITULO}
        open={noServidor && envio !== null ? true : undefined}
        onClose={aoFechar}
        /* Clique no fundo escurecido: o `::backdrop` entrega o evento ao próprio
           `<dialog>`, e o conteúdo cobre o diálogo inteiro — então alvo igual ao
           diálogo só acontece fora dele. */
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        className={cn(
          /* ⚠️ `z-[105]` só vale sem JavaScript. Modal, o diálogo vai para a
             camada de cima e `z-index` não importa; mas a resposta de um envio
             sem JavaScript o traz aberto **não modal**, no fluxo comum — e o
             cabeçalho fixo (`z-40`) e o botão de tema (`z-[100]`) passavam por
             cima dele. Abaixo do aviso de cookies (`z-[110]`), de propósito. */
          'fixed z-[105] m-0 p-0 border-0 max-w-none bg-surface-2 text-text-main shadow-2xl flex-col open:flex',
          /* Celular: sobe de baixo, até 85% da tela, e rola por dentro. */
          'inset-x-0 bottom-0 top-auto w-full max-h-[85dvh] rounded-t-[6px]',
          'translate-y-full open:translate-y-0 starting:open:translate-y-full',
          /* Computador: desliza da direita, na altura toda. */
          'md:inset-y-0 md:left-auto md:right-0 md:w-[440px] md:h-dvh md:max-h-none md:rounded-none md:rounded-l-[6px]',
          'md:translate-y-0 md:open:translate-y-0 md:starting:open:translate-y-0',
          'md:translate-x-full md:open:translate-x-0 md:starting:open:translate-x-full',
          /* `display` e `overlay` entram na transição para a saída também
             deslizar: sem eles o diálogo some no quadro em que fecha. */
          'transition-[translate,display,overlay] transition-discrete duration-300 ease-out motion-reduce:transition-none',
          'backdrop:bg-slate-950/60 backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
          'backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300 motion-reduce:backdrop:transition-none',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-white/5 shrink-0">
          <div className="min-w-0">
            <h2
              id={ID_TITULO}
              ref={titulo}
              tabIndex={-1}
              className="text-lg font-light font-display text-text-main leading-tight outline-none"
            >
              {t.titulo}
            </h2>
            {/* Anunciado: sem isto, apertar "+" não dizia nada ao leitor de tela. */}
            <p aria-live="polite" className="text-xs text-text-muted font-light mt-0.5">
              {t.resumo(itens.length, pessoas)}
            </p>
          </div>

          <form method="dialog" className="shrink-0">
            <button
              type="submit"
              aria-label={t.minimizar}
              title={t.minimizar}
              className="w-9 h-9 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronDown size={18} className="md:hidden" aria-hidden />
              <ChevronRight size={18} className="hidden md:block" aria-hidden />
            </button>
          </form>
        </div>

        <div ref={corpo} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5">
          {itens.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {itens.map(({ perfil: p, quantidade }) => (
                <li key={p.slug} className="bg-surface-1 rounded-[6px] p-3 flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-[4px] bg-linear-to-br flex items-center justify-center text-white font-bold text-[10px] shrink-0',
                      gradienteDe(p.gradient),
                    )}
                  >
                    {p.code}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-text-main truncate">{p.role}</div>
                    <div className="text-[11px] text-text-muted font-light">{p.level}</div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label={`${t.menos}: ${p.role}`}
                      /* ⚠️ `aria-disabled`, não `disabled`: botão desabilitado com
                         o foco nele solta o foco para o `<body>`. O limite é
                         garantido pelo `ajustarQuantidade`, que prende em 1..20 —
                         clique a mais não faz nada. */
                      aria-disabled={quantidade <= 1}
                      onClick={() => setEscolhidos((atual) => ajustarQuantidade(atual, p.slug, -1))}
                      className={BOTAO_QUANTIDADE}
                    >
                      <Minus size={12} aria-hidden />
                    </button>
                    <span className="w-7 text-center text-xs font-semibold text-text-main">{quantidade}</span>
                    <button
                      type="button"
                      aria-label={`${t.mais}: ${p.role}`}
                      aria-disabled={quantidade >= MAX_POR_PERFIL}
                      onClick={() => setEscolhidos((atual) => ajustarQuantidade(atual, p.slug, 1))}
                      className={BOTAO_QUANTIDADE}
                    >
                      <Plus size={12} aria-hidden />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`${t.remover}: ${p.role}`}
                    onClick={() => {
                      /* ⚠️ Remover desmonta o item, e o foco iria para o `<body>`
                         — que num diálogo modal volta ao primeiro controle, longe
                         de onde a pessoa estava. O título fica. */
                      titulo.current?.focus()
                      setEscolhidos((atual) => alternarPerfil(atual, p.slug))
                    }}
                    className="w-7 h-7 rounded-[4px] text-text-muted hover:text-text-main hover:bg-surface-2 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <X size={14} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted font-light leading-relaxed">{t.vazio}</p>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5">
            <FormularioDeSolicitacao
              itens={itens}
              locale={locale}
              privacidadeHref={privacidadeHref}
              envio={envio}
              acao={acao}
              enviando={enviando}
            />
          </div>
        </div>
      </dialog>

      {barraVisivel && (
        /* À esquerda do botão de tema no celular (`right-[60px]`) e centralizada
           a partir do tablet, onde o botão sobe para `bottom-12`. `z-40`, abaixo
           do detalhe do perfil (`z-50`): com o detalhe aberto, a barra fica
           atrás do véu dele. */
        <div className="fixed z-40 bottom-3 left-3 right-[60px] md:right-auto md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:w-md">
          <button
            ref={barra}
            type="button"
            aria-haspopup="dialog"
            aria-controls={ID_ABA}
            onClick={() => abrirAba('titulo')}
            className="w-full flex items-center gap-3 rounded-[6px] bg-surface-2 text-text-main shadow-xl border border-slate-200 dark:border-white/10 pl-2.5 pr-2 py-2 text-left cursor-pointer"
          >
            <span className="w-9 h-9 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ClipboardList size={18} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-text-main">{t.titulo}</span>
              <span className="block text-xs text-text-muted font-light truncate">
                {t.resumo(itens.length, pessoas)}
              </span>
            </span>
            <span className="shrink-0 inline-flex items-center gap-1 rounded-[6px] bg-primary text-white px-3 py-2 text-xs font-semibold">
              {t.expandir}
              <ChevronUp size={14} aria-hidden />
            </span>
          </button>
        </div>
      )}
      {/* Fora da barra, para existir antes dela: região viva que nasce já com o
          texto não é anunciada. Com a aba recolhida, é ela que diz que o
          "Solicitar" do card funcionou. */}
      <p aria-live="polite" className="sr-only">
        {barraVisivel ? t.resumo(itens.length, pessoas) : ''}
      </p>
    </>
  )
}
