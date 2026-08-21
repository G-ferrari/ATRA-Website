import type { MetadataRoute } from 'next'

import { ORIGEM } from '@/lib/seo'

/* MIG-106 — `/robots.txt`.
 *
 * ⚠️ O que está bloqueado aqui é o que **não é conteúdo**: o admin do Payload,
 * a API e o preview. Bloquear conteúdo é trabalho da metatag `robots` de cada
 * página, e não deste arquivo — `Disallow` impede o robô de **ler**, e uma
 * página que ele não lê é uma página cujo `noindex` ele nunca vê. Página magra
 * que precisa sair do índice tem que ser rastreável para dizer isso (D-08).
 *
 * ⚠️ Fora de produção o site inteiro é bloqueado. Staging indexado compete com
 * `atra.com.br` pelo mesmo conteúdo, e durante o cutover os dois existem ao
 * mesmo tempo — o momento exato em que o estrago é possível.
 */
export default function robots(): MetadataRoute.Robots {
  const producao = ORIGEM.includes('atra.com.br')

  return {
    rules: producao
      ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/', '/chat'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${ORIGEM}/sitemap.xml`,
    host: ORIGEM,
  }
}
