'use client'

import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { enviarFormulario, type Resultado } from '@/actions/formularios'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'

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

  /* A atribuição de campanha vem da sessão, guardada na chegada por
   * `CapturaDeUtm` — ver a nota no topo de `lib/utm.ts` sobre por que ela não
   * pode ser lida da URL do envio. Preenchida por `ref` pelo mesmo motivo do
   * carimbo: `sessionStorage` não existe no servidor, e ler durante o render
   * faria o HTML dos dois lados divergir. */
  const utm = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())

    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [])

  const [estado, acao, enviando] = useActionState(
    async (_anterior: Resultado | null, dados: FormData) => enviarFormulario(dados),
    null as Resultado | null,
  )

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. */
  useRastrearEnvio(Boolean(estado?.ok), 'form_submit', { form_type: kind })

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
      {/* ⚠️ Os campos escondidos vêm **antes** dos reais, e a ordem é a única
       * coisa que separa isto de somar 24px à altura da página.
       *
       * O Tailwind 4 mudou `space-y-*`: era `margin-top` em `> * + *` e virou
       * `margin-bottom` em `> :not(:last-child)`. Com os escondidos no fim, o
       * **último campo de verdade deixa de ser o último filho** e ganha um
       * espaço que não existia — 24px no formulário da home, que é rota sob
       * gate. Antes deles, a margem cai em elemento `display:none` ou
       * `absolute`, que não empurra nada.
       *
       * ⚠️ E **sem `<fieldset>` em volta dos campos**. Com `display: contents`
       * ele parece inofensivo, mas o seletor de irmãos anda pelo DOM e não pelo
       * layout: o fieldset passa a ser o único filho, e o `space-y-6` some
       * inteiro. Desabilitar durante o envio é o que se perde — `aria-busy`
       * comunica o estado, e o clique duplo não chega a criar dois registros
       * porque a ação é idempotente do ponto de vista do visitante. */}
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="source" value={caminho ?? ''} />
      {/* Carimbo de quando a página montou: a armadilha de tempo de MIG-101. */}
      <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />

      {/* Campanha de origem (D-26). Vazios quando não houve UTM na chegada ou
          quando o visitante está sem JavaScript — o lead entra do mesmo jeito,
          só sem atribuição. Aqui em cima junto dos outros escondidos, pela
          regra do `space-y` explicada logo acima. */}
      {CHAVES_UTM.map((chave, i) => (
        <input
          key={chave}
          ref={(el) => {
            if (el) utm.current[i] = el
          }}
          type="hidden"
          name={chave}
          defaultValue=""
        />
      ))}

      {/* ⚠️ Campo isca. Escondido por CSS e **não** por `type="hidden"`: robô
          que lê o HTML pula campo oculto declarado, e o que preenche às cegas
          cai aqui. `aria-hidden` e `tabIndex={-1}` mantêm quem navega por
          teclado ou leitor de tela longe dele. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={CAMPO_ISCA}>Não preencha este campo</label>
        <input id={CAMPO_ISCA} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {children}

      {estado && !estado.ok && (
        <p role="alert" className="text-sm font-light text-red-500">
          {estado.erro}
        </p>
      )}
    </form>
  )
}
