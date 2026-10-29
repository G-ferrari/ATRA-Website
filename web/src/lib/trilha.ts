import { trilha, type JsonLd } from './jsonld'
import type { Locale } from './locales'
import { hrefDe, type Secao } from './routes'
import { caminhoDe, ORIGEM } from './seo'

/* Trilha de navegação das páginas de item (D-80): Início → seção → página.
 *
 * Só dados estruturados: o site não desenha trilha na tela, e ela não entra
 * no visual. O Google exige que a marcação corresponda ao que a página mostra,
 * e os três degraus são isso — o menu leva à seção, a seção lista o item.
 *
 * Os nomes são texto de interface, como os `TEXTOS` das rotas: o título das
 * páginas-mestras é do admin, mas buscá-lo aqui custaria uma consulta por
 * página de item para dizer "Blog". */
const NOMES = {
  inicio: { pt: 'Início', en: 'Home', es: 'Inicio' },
  blog: { pt: 'Blog', en: 'Blog', es: 'Blog' },
  cases: { pt: 'Cases de sucesso', en: 'Success stories', es: 'Casos de éxito' },
  solucoes: { pt: 'Soluções', en: 'Solutions', es: 'Soluciones' },
  segmentos: { pt: 'Segmentos', en: 'Segments', es: 'Segmentos' },
  carreiras: { pt: 'Carreiras', en: 'Careers', es: 'Carreras' },
  webinars: { pt: 'Webinars', en: 'Webinars', es: 'Webinars' },
  ebooks: { pt: 'E-books', en: 'E-books', es: 'E-books' },
} as const satisfies Record<string, Record<Locale, string>>

export type SecaoComTrilha = Exclude<keyof typeof NOMES, 'inicio'> & Secao

export function trilhaDoItem(secao: SecaoComTrilha, locale: Locale, slug: string, titulo: string): JsonLd {
  return trilha([
    { nome: NOMES.inicio[locale], url: `${ORIGEM}${caminhoDe({ caminho: '/' }, locale)}` },
    { nome: NOMES[secao][locale], url: `${ORIGEM}${hrefDe(secao, locale)}` },
    { nome: titulo, url: `${ORIGEM}${hrefDe(secao, locale, slug)}` },
  ])
}
