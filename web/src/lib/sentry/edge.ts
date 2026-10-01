import * as Sentry from '@sentry/nextjs'

import { ERROS_IGNORADOS, ambienteDoSentry, semDadoPessoal } from './comum'

/* Sentry no runtime edge — hoje só o `proxy.ts`. Mesmas opções do servidor;
 * arquivo separado porque o SDK do Node não carrega aqui. */
Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  environment: ambienteDoSentry(process.env.NEXT_PUBLIC_SITE_URL),
  release: process.env.SENTRY_RELEASE || undefined,
  tracesSampleRate: 0.1,
  ignoreErrors: ERROS_IGNORADOS,
  beforeSend: (evento) => semDadoPessoal(evento),
})
