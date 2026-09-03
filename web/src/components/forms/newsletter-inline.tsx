'use client'

import { ArrowRight } from 'lucide-react'
import { useActionState, useEffect, useRef } from 'react'

import { enviarFormulario, type Resultado } from '@/actions/formularios'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'

/* MIG-103 — a caixa de newsletter da home, agora viva.
 *
 * ⚠️ A home está sob o gate visual, então o render inicial reproduz o markup
 * estático que estava aqui **classe por classe**: o `<form>` assume o
 * `flex mt-4` que era da `div`, o input perde só o `disabled` (e o
 * `disabled:opacity-100` que existia para o desabilitado parecer vivo), o
 * botão perde o `cursor-not-allowed`. Nada disso move pixel — cursor e
 * atributo não pintam. O estado de sucesso só existe depois de interação, que
 * a captura nunca faz.
 *
 * Os escondidos vêm antes dos visíveis (a lição do space-y de MIG-100 — aqui
 * não há space-y, mas o hábito é mais barato que a exceção). */
export function NewsletterInline({ placeholder }: { placeholder: string | null }) {
  const carimbo = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
  }, [])

  const [estado, acao, enviando] = useActionState(
    async (_a: Resultado | null, dados: FormData) => enviarFormulario(dados),
    null as Resultado | null,
  )

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. */
  useRastrearEnvio(Boolean(estado?.ok), 'form_submit', { form_type: 'newsletter' })

  if (estado?.ok) {
    return (
      <p role="status" className="mt-4 text-xs font-light text-emerald-500">
        Quase lá: enviamos um e-mail de confirmação. A inscrição só ativa depois do clique.
      </p>
    )
  }

  return (
    <form action={acao} aria-busy={enviando} className="flex mt-4">
      <input type="hidden" name="kind" value="newsletter" />
      <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />
      <input type="text" name={CAMPO_ISCA} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <input
        type="email"
        name="email"
        required
        placeholder={placeholder ?? undefined}
        aria-label={placeholder ?? 'E-mail'}
        className="flex-1 bg-surface-1 p-3 text-text-main border-r-0 focus:ring-1 focus:ring-primary outline-none text-xs rounded-l-[6px] font-light"
      />
      <button
        type="submit"
        disabled={enviando}
        aria-label="Inscrever-se"
        className="bg-secondary text-white px-4 transition-colors rounded-r-[6px] cursor-pointer"
      >
        <ArrowRight size={16} aria-hidden />
      </button>
    </form>
  )
}
