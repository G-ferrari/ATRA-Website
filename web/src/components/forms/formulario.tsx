'use client'

import { useActionState } from 'react'

import { enviarFormulario, type Resultado } from '@/actions/formularios'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'

import { CamposOcultos } from './campos-ocultos'

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
  const [estado, acao, enviando] = useActionState(
    async (_anterior: Resultado | null, dados: FormData) => enviarFormulario(dados),
    null as Resultado | null,
  )

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. */
  useRastrearEnvio(Boolean(estado?.ok), 'form_submit', { form_type: kind })

  if (estado?.ok) {
    /* Inline, não modal — é o que `formularios-e-integracoes.md` especifica. */
    return (
      <p role="status" className="text-sm text-emerald-500">
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
      {/* Origem, carimbo, campanha e isca — ver `campos-ocultos.tsx`. Aqui,
          antes dos campos de verdade, pela regra do `space-y` acima. */}
      <CamposOcultos />

      {children}

      {estado && !estado.ok && (
        <p role="alert" className="text-sm text-red-500">
          {estado.erro}
        </p>
      )}
    </form>
  )
}
