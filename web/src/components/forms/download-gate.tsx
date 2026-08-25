'use client'

import { Download } from 'lucide-react'
import { useActionState, useEffect, useRef } from 'react'

import { baixarMaterial, type ResultadoDownload } from '@/actions/materiais'
import { CAMPO_ISCA } from '@/lib/anti-spam'

/* MIG-104 — o formulário que troca contato por download, na página do material.
 *
 * Só é montado quando o material tem PDF (`resources.file`), decisão da página.
 * O sucesso mostra o botão com a URL pré-assinada — que expira em 15 minutos,
 * então o texto avisa para baixar agora, não guardar o link.
 *
 * Mesmos padrões de `formulario.tsx`: carimbo por ref, escondidos antes dos
 * reais, sem fieldset. */

const CAMPO = 'w-full bg-surface-2 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[6px] px-4 py-3 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary/60'

export function DownloadGate({ resourceId }: { resourceId: number }) {
  const carimbo = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
  }, [])

  const [estado, acao, enviando] = useActionState(
    async (_a: ResultadoDownload | null, dados: FormData) => baixarMaterial(dados),
    null as ResultadoDownload | null,
  )

  if (estado?.ok) {
    return (
      <div role="status" className="space-y-3">
        <a href={estado.url} className="pill-btn-primary inline-flex" download>
          <Download size={16} aria-hidden /> Baixar o PDF
        </a>
        <p className="text-xs font-light text-text-muted">
          O link vale por 15 minutos — baixe agora em vez de guardar.
        </p>
      </div>
    )
  }

  return (
    <form action={acao} aria-busy={enviando} className="space-y-3 max-w-md">
      <input type="hidden" name="resourceId" value={resourceId} />
      <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />
      <input type="text" name={CAMPO_ISCA} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <input name="name" placeholder="Seu nome" aria-label="Nome" className={CAMPO} />
      <input name="email" type="email" required placeholder="E-mail corporativo" aria-label="E-mail" className={CAMPO} />
      <input name="company" placeholder="Empresa (opcional)" aria-label="Empresa" className={CAMPO} />

      {estado && !estado.ok && (
        <p role="alert" className="text-sm font-light text-red-400">
          {estado.erro}
        </p>
      )}

      <button type="submit" className="pill-btn-primary" disabled={enviando}>
        {enviando ? 'Liberando…' : 'Receber o material'}
      </button>
    </form>
  )
}
