import type { Secao } from './routes'
import type { Locale } from './locales'

/* As páginas-mestras (feature paginas-mestras, D-55): a "home" de cada seção do
 * site, a página que abre quando se clica no link da seção. Cada uma é um
 * documento de `pages` marcado com a seção — é por essa marca que a rota acha a
 * página, e não pelo slug, que acompanha o idioma.
 *
 * O `id` é a chave da seção em `lib/routes.ts`: é o que dá o endereço da página
 * e das páginas internas dela. Seção nova aqui pede a rota e a migração de
 * conteúdo junto. */
export const PAGINAS_MESTRAS = [
  { id: 'solucoes', pt: 'Soluções', en: 'Solutions', es: 'Soluciones' },
  { id: 'segmentos', pt: 'Segmentos', en: 'Segments', es: 'Segmentos' },
  { id: 'consultores', pt: 'Consultores', en: 'Consultants', es: 'Consultores' },
  { id: 'insights', pt: 'Insights', en: 'Insights', es: 'Insights' },
  { id: 'blog', pt: 'Blog', en: 'Blog', es: 'Blog' },
  { id: 'webinars', pt: 'Webinars', en: 'Webinars', es: 'Webinars' },
  { id: 'cases', pt: 'Cases de sucesso', en: 'Success stories', es: 'Casos de éxito' },
  { id: 'midia', pt: 'ATRA na mídia', en: 'ATRA in the media', es: 'ATRA en los medios' },
  { id: 'ebooks', pt: 'E-books', en: 'E-books', es: 'E-books' },
  { id: 'carreiras', pt: 'Carreiras', en: 'Careers', es: 'Carreras' },
] as const satisfies readonly ({ id: Secao } & Record<Locale, string>)[]

export type SecaoMestra = (typeof PAGINAS_MESTRAS)[number]['id']

export const ehSecaoMestra = (valor: unknown): valor is SecaoMestra =>
  PAGINAS_MESTRAS.some((p) => p.id === valor)

export const nomeDaSecao = (secao: SecaoMestra, idioma: Locale = 'pt'): string =>
  PAGINAS_MESTRAS.find((p) => p.id === secao)![idioma]
