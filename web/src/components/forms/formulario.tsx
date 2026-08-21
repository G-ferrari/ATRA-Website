'use client'

import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { enviarFormulario, type Resultado } from '@/actions/formularios'
import { CAMPO_ISCA } from '@/lib/anti-spam'

/* Casca cliente dos formulários do site (MIG-100 / MIG-101).
 *
 * ⚠️ Envolve o markup existente **sem mudá-lo**. Os formulários foram portados
 * desabilitados, e o porte teve o cuidado de deixar o estado desabilitado
 * visualmente idêntico ao ativo (`disabled:opacity-100` nos campos, e nos
 * botões só `cursor-not-allowed`, que não aparece em captura). Ligar o envio,
 * portanto, não move um pixel — e a home e `/insights`, que têm formulário, são
 * rotas sob gate visual.
 *
 * ⚠️ `<form action={...}>` com Server Action, e não `onSubmit` com `fetch`: o
 * formulário continua funcionando **sem JavaScript**. Num formulário de contato
 * isso não é purismo — é a única forma de um visitante falar com a empresa.
 */

export function Formulario({
  kind,
  children,
  className,
  sucesso,
}: {
  kind: 'contact' | 'newsletter' | 'talent-pool'
  children: React.ReactNode
  className?: string
  /** Mensagem de confirmação, no idioma da página. */
  sucesso: string
}) {
  /* De onde o lead veio sai daqui, e não de uma prop: o mesmo bloco de contato
   * é desenhado na home e em `/contato`, e quem monta o bloco não sabe em qual
   * página está. */
  const caminho = usePathname()

  /* ⚠️ O carimbo é marcado **depois da montagem**, não durante o render.
   *
   * `Date.now()` no corpo do componente é função impura, e o React avisa: o
   * valor mudaria a cada re-render e o HTML do servidor não bateria com o do
   * cliente. Em efeito, o servidor manda `0` — que `conferir` trata como
   * "sem carimbo" e deixa passar, que é justamente o comportamento desejado
   * para quem está com JavaScript desligado.
   *
   * Escrito no DOM por `ref`, e não por `setState`: efeito existe para
   * sincronizar com sistema externo, e `setState` dentro dele dispara um render
   * em cascata que o lint recusa — com razão, já que ninguém precisa
   * re-renderizar por causa de um campo escondido. */
  const carimbo = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
  }, [])

  const [estado, acao, enviando] = useActionState(
    async (_anterior: Resultado | null, dados: FormData) => enviarFormulario(dados),
    null as Resultado | null,
  )

  if (estado?.ok) {
    /* Inline, não modal — é o que `formularios-e-integracoes.md` especifica. */
    return (
      <p role="status" className="text-sm font-light text-emerald-500">
        {sucesso}
      </p>
    )
  }

  return (
    <form action={acao} className={className} aria-busy={enviando}>
      {/* ⚠️ Os campos reais vêm **primeiro**, e não é estética.
       *
       * Os formulários do gabarito usam `space-y-6`, que em Tailwind é
       * `> :not([hidden]) ~ :not([hidden]) { margin-top }` — margem em todo
       * filho que tenha um irmão antes. Pondo os campos escondidos na frente,
       * o primeiro campo de verdade deixa de ser o primeiro filho e ganha 24px
       * de margem: a home inteira desceu. Depois deles, a margem cai em
       * elemento `display:none` ou `absolute`, que não empurra nada.
       *
       * ⚠️ E **sem `<fieldset>` em volta**. Ele parecia inofensivo com
       * `display: contents`, mas o seletor de irmãos anda pelo DOM e não pelo
       * layout: com o fieldset no meio, `form > * + *` passava a casar o
       * fieldset e nenhum dos campos — o `space-y-6` sumia inteiro. Desabilitar
       * durante o envio é o que se perde, e o botão já cobre o clique duplo. */}
      {children}

      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="source" value={caminho ?? ''} />
      {/* Carimbo de quando a página montou: a armadilha de tempo de MIG-101. */}
      <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />

      {/* ⚠️ Campo isca. Escondido por CSS e **não** por `type="hidden"`: robô
          que lê o HTML pula campo oculto declarado, e o que preenche às cegas
          cai aqui. `aria-hidden` e `tabIndex={-1}` mantêm quem navega por
          teclado ou leitor de tela longe dele. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={CAMPO_ISCA}>Não preencha este campo</label>
        <input id={CAMPO_ISCA} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {estado && !estado.ok && (
        <p role="alert" className="text-sm font-light text-red-500">
          {estado.erro}
        </p>
      )}
    </form>
  )
}
