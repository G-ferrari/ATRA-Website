import * as Sentry from '@sentry/nextjs'

/* Ponto de entrada do Next para instrumentação (roda uma vez por processo).
 *
 * ⚠️ Importação dinâmica por runtime, como a documentação do Next manda: o SDK
 * do Node não existe no edge e vice-versa, e importar no topo quebraria um dos
 * dois. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('./lib/sentry/servidor')
  if (process.env.NEXT_RUNTIME === 'edge') await import('./lib/sentry/edge')
}

/* Erro em Server Component, rota ou action chega aqui com o contexto da
 * requisição — é o gancho que o `error.tsx` do cliente não vê, porque ele só
 * recebe o `digest`. */
export const onRequestError = Sentry.captureRequestError
