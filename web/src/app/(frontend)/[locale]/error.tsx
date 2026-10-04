'use client'

import * as Sentry from '@sentry/nextjs'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

/* Limite de erro (MIG-062).
 *
 * Precisa ser componente cliente — é exigência do Next para `error.tsx`.
 *
 * ⚠️ Não mostra a mensagem do erro. Ela pode conter caminho de arquivo, trecho
 * de consulta ou nome de coluna, e página pública não é lugar para isso. O
 * `digest` é o identificador que o Next gera; com ele dá para achar o erro
 * inteiro no log do servidor sem expor nada a quem visita.
 *
 * Sem `locale` aqui: este limite pode disparar antes de o segmento de idioma
 * resolver, e um erro dentro do tratador de erro deixaria o visitante na tela
 * branca do navegador. O texto fica em português, o idioma padrão do site. */
export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    /* O servidor já capturou o erro inteiro pelo `onRequestError`; este é o
     * mesmo erro visto do navegador, ligado pelo `digest`. Sem DSN é inerte. */
    Sentry.captureException(error)
    console.error('[erro na página]', error.digest ?? error.message)
  }, [error])

  return (
    <main className="pt-32 md:pt-44 pb-24 min-h-screen bg-surface-1 text-text-main">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
        <div className="w-16 h-16 rounded-[6px] bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-8">
          <AlertTriangle size={32} aria-hidden />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold font-display mb-4 leading-tight">
          Algo deu errado ao carregar esta página
        </h1>
        <p className="text-sm md:text-base text-text-muted font-light leading-relaxed mb-10">
          O problema foi registrado e será investigado. Tentar de novo costuma resolver quando é
          uma falha passageira.
        </p>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-[6px] font-bold text-sm transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          <RotateCcw size={16} aria-hidden /> Tentar de novo
        </button>

        {error.digest && (
          <p className="mt-10 text-[11px] text-text-muted font-mono">
            Código do erro: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}
