import type { Contato, Image, Seo } from '@/types/content'
import { ORIGEM } from './seo'

/* MIG-107 — dados estruturados schema.org.
 *
 * O que o Google faz com isto: entende que a ATRA é uma organização (e junta o
 * painel de conhecimento com o LinkedIn e o YouTube), que um artigo tem data e
 * autor, e que uma solução é um serviço prestado por ela. Sem isto, tudo é
 * "página com texto".
 *
 * ⚠️ Nada aqui é conteúdo novo: é o que a página já mostra, num formato que a
 * máquina lê. Anunciar dado que a página não exibe é o que o Google chama de
 * markup enganoso, e a penalidade é a desindexação do recurso.
 *
 * ⚠️ Não desenha nada — vai num `<script type="application/ld+json">`, invisível.
 * Por isso não move um pixel do aceite visual.
 */

/** `@id` estável da organização, para os outros nós apontarem sem repetir tudo. */
export const ID_DA_ORGANIZACAO = `${ORIGEM}/#organizacao`

export type JsonLd = Record<string, unknown>

export function organizacao(args: { contato: Contato; logo: Image | null; fundadaEm?: number | null }): JsonLd {
  const { contato, logo, fundadaEm } = args

  /* `sameAs` é o que liga esta organização aos perfis dela. Só entram os que
   * existem: um `null` viraria a string "null" no JSON. */
  const redes = [contato.redes.linkedin, contato.redes.instagram, contato.redes.youtube].filter(
    (u): u is string => Boolean(u),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ID_DA_ORGANIZACAO,
    name: 'ATRA',
    url: `${ORIGEM}/`,
    ...(logo ? { logo: { '@type': 'ImageObject', url: absoluta(logo.url), width: logo.width, height: logo.height } } : {}),
    ...(fundadaEm ? { foundingDate: String(fundadaEm) } : {}),
    email: contato.email,
    telephone: contato.telefone,
    address: { '@type': 'PostalAddress', streetAddress: contato.endereco, addressCountry: 'BR' },
    ...(redes.length ? { sameAs: redes } : {}),
  }
}

export function artigo(args: {
  seo: Seo
  url: string
  publicadoEm: string
  atualizadoEm?: string | null
}): JsonLd {
  const { seo, url, publicadoEm, atualizadoEm } = args
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.title,
    description: seo.description || undefined,
    ...(seo.image ? { image: [absoluta(seo.image.url)] } : {}),
    datePublished: publicadoEm,
    dateModified: atualizadoEm ?? publicadoEm,
    /* ⚠️ Sem `author` de pessoa: o WordPress não traz autoria por artigo, e o
     * schema aceita organização como autor. Inventar um nome seria markup
     * enganoso. */
    author: { '@id': ID_DA_ORGANIZACAO },
    publisher: { '@id': ID_DA_ORGANIZACAO },
    mainEntityOfPage: url,
  }
}

export function servico(args: { seo: Seo; url: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.seo.title,
    description: args.seo.description || undefined,
    ...(args.seo.image ? { image: [absoluta(args.seo.image.url)] } : {}),
    provider: { '@id': ID_DA_ORGANIZACAO },
    url: args.url,
  }
}

/** URL de mídia vira absoluta: o Google recusa caminho relativo em `image`. */
function absoluta(url: string): string {
  return url.startsWith('http') ? url : `${ORIGEM}${url}`
}
