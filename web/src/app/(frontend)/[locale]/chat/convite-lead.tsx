'use client'

import { Sparkles, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'

import { enviarLeadDoChat, type ResultadoLeadDoChat } from '@/actions/chat-lead'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import { contextoDoLead, type Mensagem } from '@/lib/chat'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'
import type { ConviteDeLead } from '@/types/content'

/* MIG-150 (D-29) — o cartão de convite dentro do fluxo do chat.
 *
 * Quem decide **quando** ele aparece é a `Conversa` (após N mensagens do
 * visitante); este componente só desenha os três estados: convite → formulário
 * enviado → sucesso, ou nada, se o visitante dispensar.
 *
 * ⚠️ Este componente nunca renderiza no estado inicial da página — a condição
 * da `Conversa` exige mensagens, e o gabarito do gate captura o chat vazio.
 * Nenhuma classe daqui pode vazar para aquele estado.
 *
 * Os escondidos (carimbo, UTM, isca) seguem o `Formulario` de MIG-100/101,
 * inclusive a ordem antes dos campos reais (a regra do `space-y` do Tailwind 4)
 * — a diferença é que aqui não há SSR do cartão, mas copiar o padrão é mais
 * barato que justificar a exceção. */
export function ConviteLead({
  convite,
  mensagens,
  locale,
}: {
  convite: ConviteDeLead
  mensagens: Mensagem[]
  locale: 'pt' | 'en'
}) {
  const [dispensado, setDispensado] = useState(false)
  const caminho = usePathname()
  const carimbo = useRef<HTMLInputElement>(null)
  const utm = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [])

  const [estado, acao, enviando] = useActionState(
    async (_anterior: ResultadoLeadDoChat | null, dados: FormData) => enviarLeadDoChat(dados),
    null as ResultadoLeadDoChat | null,
  )

  if (dispensado) return null

  const t =
    locale === 'pt'
      ? { nome: 'Nome', email: 'E-mail corporativo', empresa: 'Empresa', telefone: 'Telefone', enviar: 'Enviar contato', fechar: 'Dispensar convite' }
      : { nome: 'Name', email: 'Work e-mail', empresa: 'Company', telefone: 'Phone', enviar: 'Send contact', fechar: 'Dismiss invite' }

  return (
    <div
      data-testid="convite-lead"
      className="max-w-[95%] sm:max-w-[85%] rounded-[6px] rounded-tl-[2px] border border-primary/30 bg-surface-3 dark:bg-[#222631] p-4 sm:p-5 shadow-xs"
    >
      {estado?.ok ? (
        <p role="status" className="text-[13px] leading-relaxed text-text-main">
          {convite.sucesso}
        </p>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary shrink-0" aria-hidden />
              <h3 className="text-[13px] font-bold text-text-main tracking-tight">{convite.titulo}</h3>
            </div>
            <button
              type="button"
              onClick={() => setDispensado(true)}
              aria-label={t.fechar}
              className="text-text-muted hover:text-text-main transition-colors cursor-pointer shrink-0"
            >
              <X size={14} aria-hidden />
            </button>
          </div>

          <p className="text-[12px] text-text-muted leading-relaxed mb-3">{convite.mensagem}</p>

          <form action={acao} aria-busy={enviando} className="space-y-2.5">
            <input type="hidden" name="source" value={caminho ?? ''} />
            <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />
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
            {/* O recorte de P-20 vai num escondido comum: o valor é visível no
                DOM de propósito — é o que o visitante está enviando, não um
                segredo. A action corta de novo no servidor. */}
            <input type="hidden" name="chatContext" value={contextoDoLead(mensagens)} />
            <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor={`chat-${CAMPO_ISCA}`}>Não preencha este campo</label>
              <input id={`chat-${CAMPO_ISCA}`} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input type="text" name="name" placeholder={t.nome} aria-label={t.nome} className={CAMPO} />
              <input type="email" name="email" required placeholder={t.email} aria-label={t.email} className={CAMPO} />
              <input type="text" name="company" placeholder={t.empresa} aria-label={t.empresa} className={CAMPO} />
              <input type="tel" name="phone" placeholder={t.telefone} aria-label={t.telefone} className={CAMPO} />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full sm:w-auto px-4 py-2 bg-linear-to-r from-primary to-primary-dark text-white font-bold text-[11px] uppercase tracking-wider rounded-[6px] hover:shadow-md hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
            >
              {t.enviar}
            </button>

            {/* P-14: o visitante lê o destino do dado antes de enviar. */}
            <p className="text-[10px] text-text-muted leading-relaxed">{convite.consentimento}</p>

            {estado && !estado.ok && (
              <p role="alert" className="text-[11px] font-medium text-red-500 dark:text-red-400">
                {estado.erro}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}

const CAMPO =
  'w-full bg-surface-1 dark:bg-[#0e1015]  text-text-main placeholder:text-text-muted px-3 py-2 rounded-[6px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-[12px] shadow-inner'
