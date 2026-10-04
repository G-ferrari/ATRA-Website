import * as Sentry from '@sentry/nextjs'

import { ERROS_IGNORADOS, ambienteDoSentry, semDadoPessoal } from './comum'

/* Sentry no Node (Server Components, rotas de API, actions e o Payload).
 * Carregado por `instrumentation.ts` só quando `NEXT_RUNTIME` é `nodejs`. */
Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  environment: ambienteDoSentry(process.env.NEXT_PUBLIC_SITE_URL),
  /* O SHA do deploy, gravado na imagem pelo `deploy.sh`: é o que liga um erro
   * novo ao commit que o trouxe. Sem ele (dev, CI) fica indefinido. */
  release: process.env.SENTRY_RELEASE || undefined,
  /* 0.1 é o número da spec: amostra de performance sem inflar a cota. */
  tracesSampleRate: 0.1,
  ignoreErrors: ERROS_IGNORADOS,
  beforeSend: (evento) => semDadoPessoal(evento),
})
