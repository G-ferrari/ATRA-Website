'use client'

import { Cookie } from 'lucide-react'

import { pedirPreferencias } from '@/lib/consentimento'

/* MIG-152 (D-30) — a porta da revogação: "preferência persistida e revogável"
 * (spec de MIG-109). O link "Cookies" do rodapé traz o visitante até esta
 * página; este botão reabre o painel com a escolha atual pré-marcada.
 *
 * ⚠️ A página só monta este componente quando o banner existe
 * (`lerAvisoDeCookies` não-nulo) — sem isso a rota, que está sob o gate
 * visual, ganharia um elemento novo com a feature ainda desligada. */
export function GerenciarCookies({ rotulo }: { rotulo: string }) {
  return (
    <button
      type="button"
      onClick={pedirPreferencias}
      className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 dark:bg-[#181b22] border border-border-main text-text-main font-bold text-[11px] uppercase tracking-wider rounded-[6px] hover:border-primary/50 active:scale-[0.98] transition-all cursor-pointer"
    >
      <Cookie size={14} className="text-primary" aria-hidden />
      {rotulo}
    </button>
  )
}
