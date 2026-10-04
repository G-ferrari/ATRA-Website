'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

/* O último limite de erro: pega o que estourar no próprio layout raiz, onde o
 * `error.tsx` do segmento não alcança. Substitui o layout inteiro, por isso
 * carrega `html` e `body` e não pode contar com o CSS do site — os estilos
 * vão inline. Mesma regra do `error.tsx`: nada da mensagem do erro na tela. */
export default function ErroGlobal({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0e1015', color: '#e5e7eb' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: '0 0 12px' }}>Algo deu errado ao carregar o site</h1>
            <p style={{ color: '#9ca3af', margin: '0 0 28px' }}>
              O problema foi registrado e será investigado. Tentar de novo costuma resolver quando é uma falha passageira.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{ background: '#2563eb', color: '#fff', border: 0, borderRadius: 6, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
            >
              Tentar de novo
            </button>
            {error.digest && <p style={{ marginTop: 32, fontSize: 11, color: '#6b7280', fontFamily: 'monospace' }}>Código do erro: {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  )
}
