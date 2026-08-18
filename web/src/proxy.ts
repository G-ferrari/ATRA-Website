import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE, LOCALES } from '@/lib/locales'

/* Roteamento de idioma (D-07).
 *
 * O site tem português na raiz e inglês em /en, mas o App Router precisa de um
 * segmento [locale] para os dois. A ponte é aqui:
 *
 *   /sobre        → reescreve para /pt/sobre   (a URL continua /sobre)
 *   /en/about     → passa direto
 *   /pt/sobre     → redireciona 308 para /sobre
 *
 * A última regra existe para não haver duas URLs servindo o mesmo conteúdo em
 * português, que é conteúdo duplicado aos olhos do Google.
 *
 * Next 16: o arquivo se chama proxy.ts (era middleware.ts) e a função exportada
 * é `proxy`. O runtime é nodejs e não é configurável.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /pt/... não deve existir publicamente: o português mora na raiz.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || '/'
    return NextResponse.redirect(url, 308)
  }

  // Idioma com prefixo (hoje só /en) segue direto para o segmento [locale].
  const hasLocalePrefix = LOCALES.some(
    (l) => l !== DEFAULT_LOCALE && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)),
  )
  if (hasLocalePrefix) return NextResponse.next()

  // Todo o resto é português: reescreve mantendo a URL visível intacta.
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  /* Fora do roteamento de idioma:
   *  - admin e api → grupo (payload), que não vive sob [locale]
   *  - _next, arquivos estáticos e assets com extensão */
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
