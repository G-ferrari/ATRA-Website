import * as Sentry from '@sentry/nextjs'

import { ERROS_IGNORADOS, URLS_IGNORADAS, ambienteDoSentry, semDadoPessoal, vemDeExtensao } from './lib/sentry/comum'

/* Sentry no navegador. O Next carrega este arquivo antes de hidratar.
 *
 * ⚠️ `NEXT_PUBLIC_SENTRY_DSN` e não `SENTRY_DSN`: só o prefixo chega ao
 * bundle. DSN não é segredo (é um endereço de ingestão, com limite por
 * projeto), por isso passa na checagem do CI que reprova KEY/SECRET/TOKEN com
 * o prefixo. `NEXT_PUBLIC_SITE_URL` vem gravada no build, como em todo lugar. */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  environment: ambienteDoSentry(process.env.NEXT_PUBLIC_SITE_URL),
  tracesSampleRate: 0.1,
  ignoreErrors: ERROS_IGNORADOS,
  denyUrls: URLS_IGNORADAS,
  beforeSend: (evento) => (vemDeExtensao(evento) ? null : semDadoPessoal(evento)),
})

/* Navegação entre rotas vira transação de performance; sem isto o lado do
 * cliente só manda erro. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
