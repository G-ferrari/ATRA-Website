import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE, LOCALES, isLocale } from '@/lib/locales'
import { aliasEsperado, canonizarSegmento } from '@/lib/routes'

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

  // Idioma com prefixo (hoje só /en): passa direto, mas traduzindo o segmento
  // de seção para o nome canônico do sistema de arquivos.
  // Ex.: /en/success-stories/x → /en/cases-de-sucesso/x (a URL não muda).
  const prefixado = LOCALES.filter((l) => l !== DEFAULT_LOCALE).find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  )
  if (prefixado) {
    const [, , secao, ...resto] = pathname.split('/')

    // O segmento canônico não deve ser acessível num idioma que tem alias:
    // /en/cases-de-sucesso e /en/success-stories serviriam o mesmo conteúdo.
    const alias = secao && isLocale(prefixado) ? aliasEsperado(secao, prefixado) : null
    if (alias) {
      const url = request.nextUrl.clone()
      url.pathname = ['', prefixado, alias, ...resto].join('/')
      return NextResponse.redirect(url, 308)
    }

    const canonico = secao && isLocale(prefixado) ? canonizarSegmento(secao, prefixado) : null
    if (canonico && canonico !== secao) {
      const url = request.nextUrl.clone()
      url.pathname = ['', prefixado, canonico, ...resto].join('/')
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

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
