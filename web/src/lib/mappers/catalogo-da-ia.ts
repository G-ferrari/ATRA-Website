import type { AtraAi } from '@/payload-types'
import type { ConteudoRecomendavel, TipoDeConteudoDaIa } from '@/types/content'

import type { Locale } from '../locales'
import { hrefDe, type Secao } from '../routes'

import { slugNoIdioma, type Par } from './idioma'

/* Mapper do catálogo da ATRA AI (D-60): documento do CMS → item que o
 * assistente pode recomendar. É o único lugar que sabe de que campo sai o
 * título, o resumo e o endereço de cada tipo.
 *
 * ⚠️ O endereço nunca é montado à mão (regra 6): sai de `hrefDe`, com o slug do
 * idioma da conversa. E **em inglês só entra o que tem slug em inglês** — a rota
 * `/en/<seção>/<slug>` consulta a coluna do idioma, e documento sem slug lá
 * responde 404 mesmo com o fallback ligado (armadilha do CLAUDE.md). É por isso
 * que cada função recebe o par: o português e o inglês **sem** fallback. A
 * regra é `slugNoIdioma` (`./idioma`), a mesma do menu e dos índices do site. */

type Base = { id: number | string; slug?: string | null }

/** Uma linha, sem quebra, cortada na palavra: o resumo entra numa lista que o
 *  modelo lê e num cartão de duas linhas. */
export function emUmaLinha(texto: string | null | undefined, maximo = 220): string {
  const limpo = (texto ?? '').replace(/\s+/g, ' ').trim()
  if (limpo.length <= maximo) return limpo
  const corte = limpo.slice(0, maximo)
  return `${corte.slice(0, Math.max(corte.lastIndexOf(' '), maximo - 40)).trimEnd()}…`
}

function item<T extends Base>(
  prefixo: string,
  tipo: TipoDeConteudoDaIa,
  secao: Secao,
  par: Par<T>,
  locale: Locale,
  textos: (doc: T) => { titulo?: string | null; resumo?: string | null },
): ConteudoRecomendavel | null {
  const doIdioma = locale === 'pt' ? par.pt : par.en
  const slug = slugNoIdioma(par, locale)
  if (!doIdioma || !slug) return null

  /* Texto que falta no inglês cai no português: o endereço existe, e um cartão
     com o título em português é melhor que cartão nenhum (P-08). */
  const proprio = textos(doIdioma)
  const reserva = textos(par.pt)
  const titulo = emUmaLinha(proprio.titulo || reserva.titulo, 140)
  if (!titulo) return null

  return {
    /* O id é o do documento, igual nos dois idiomas: a etiqueta de uma resposta
       antiga continua valendo se o título ou o slug mudarem. */
    codigo: `${prefixo}${par.pt.id}`,
    tipo,
    titulo,
    resumo: emUmaLinha(proprio.resumo || reserva.resumo),
    href: hrefDe(secao, locale, slug),
  }
}

type Solucao = Base & { title?: string | null; shortDescription?: string | null; hasPage?: boolean | null }
type Segmento = Base & { name?: string | null; shortDescription?: string | null }
type Case = Base & { title?: string | null; summary?: string | null }
type ComDescricao = Base & { title?: string | null; description?: string | null }
type Parceiro = Base & { name?: string | null; description?: string | null; hasPage?: boolean | null }

/* O prefixo do código de cada collection. Exportado porque a busca da ATRA AI
 * (`lib/busca-da-ia/`) guarda os trechos de cada documento pelo mesmo código:
 * é ele que liga o trecho achado ao cartão que o modelo pode recomendar. */
export const PREFIXO_DO_CODIGO = {
  solutions: 'S',
  segments: 'G',
  partners: 'R',
  cases: 'C',
  webinars: 'W',
  resources: 'E',
  posts: 'A',
} as const

/** Solução sem página (`hasPage`) aparece no menu, mas não tem endereço (D-09). */
export const deSolucao = (par: Par<Solucao>, locale: Locale) =>
  par.pt.hasPage
    ? item(PREFIXO_DO_CODIGO.solutions, 'solucao', 'solucoes', par, locale, (d) => ({ titulo: d.title, resumo: d.shortDescription }))
    : null

export const deSegmento = (par: Par<Segmento>, locale: Locale) =>
  item(PREFIXO_DO_CODIGO.segments, 'segmento', 'segmentos', par, locale, (d) => ({ titulo: d.name, resumo: d.shortDescription }))

/* D-75 — a página de cada parceiro (`/parceiros/<slug>`) é onde o site diz que a
 * ATRA é parceira certificada do Google Cloud, com quais especializações, e o
 * que ela faz com Databricks. Fora do catálogo, "vocês têm certificação Google
 * Cloud?" não achava nada disso. Como a solução, só entra quem tem página. */
export const deParceiro = (par: Par<Parceiro>, locale: Locale) =>
  par.pt.hasPage
    ? item(PREFIXO_DO_CODIGO.partners, 'parceiro', 'parceiros', par, locale, (d) => ({ titulo: d.name, resumo: d.description }))
    : null

export const deCase = (par: Par<Case>, locale: Locale) =>
  item(PREFIXO_DO_CODIGO.cases, 'case', 'cases', par, locale, (d) => ({ titulo: d.title, resumo: d.summary }))

export const deWebinar = (par: Par<ComDescricao>, locale: Locale) =>
  item(PREFIXO_DO_CODIGO.webinars, 'webinar', 'webinars', par, locale, (d) => ({ titulo: d.title, resumo: d.description }))

export const deEbook = (par: Par<ComDescricao>, locale: Locale) =>
  item(PREFIXO_DO_CODIGO.resources, 'ebook', 'ebooks', par, locale, (d) => ({ titulo: d.title, resumo: d.description }))

export const deArtigo = (par: Par<ComDescricao>, locale: Locale) =>
  item(PREFIXO_DO_CODIGO.posts, 'artigo', 'blog', par, locale, (d) => ({ titulo: d.title, resumo: d.description }))

/* As páginas que o assistente pode indicar além do conteúdo: os índices das
 * seções e as páginas de conversão. A rota é da **seção** (`hrefDe(secao)`), e
 * por isso existe nos dois idiomas sem depender do slug da página.
 *
 * ATRA na mídia fica de fora por decisão do G-ferrari (09/10): desvia a
 * conversa do foco comercial.
 *
 * ⚠️ Carreiras também ficava, pelo mesmo motivo, e entrou na D-75 (27/10): sem
 * ela, quem perguntava "como faço para trabalhar na ATRA?" recebia a página de
 * Consultores — que é a alocação de especialistas no time do **cliente** — e o
 * WhatsApp do comercial. Quem segura o foco agora é a regra de
 * `lib/instrucao-da-ia.ts`: a página só é indicada a quem procura trabalho. */
const SECOES_INDICAVEIS = ['solucoes', 'segmentos', 'cases', 'blog', 'webinars', 'ebooks', 'insights', 'consultores', 'carreiras'] as const
/* Páginas de `pages` que têm rota própria sem ser página-mestra: slug → seção. */
const ROTA_PELO_SLUG: Partial<Record<string, Secao>> = { contato: 'contato', sobre: 'sobre' }

type Pagina = {
  id: number | string
  slug?: string | null
  title?: string | null
  masterOf?: string | null
  seo?: { metaDescription?: string | null } | null
}

/** O código da página leva a seção, e não o id: `P-CONTATO`. */
export const codigoDaPagina = (secao: string): string => `P-${secao.toUpperCase()}`

/** A seção que dá endereço à página, ou `undefined` se ela não é indicável. */
export function secaoDaPagina(pagina: Pick<Pagina, 'slug' | 'masterOf'>): Secao | undefined {
  const mestra = (SECOES_INDICAVEIS as readonly string[]).includes(pagina.masterOf ?? '') ? (pagina.masterOf as Secao) : undefined
  return mestra ?? ROTA_PELO_SLUG[pagina.slug ?? '']
}

export function dePagina(par: Par<Pagina>, locale: Locale): ConteudoRecomendavel | null {
  const secao = secaoDaPagina(par.pt)
  if (!secao) return null

  const doIdioma = (locale === 'pt' ? par.pt : par.en) ?? par.pt
  const titulo = emUmaLinha(doIdioma.title || par.pt.title, 140)
  if (!titulo) return null

  return {
    codigo: codigoDaPagina(secao),
    tipo: 'pagina',
    titulo,
    resumo: emUmaLinha(doIdioma.seo?.metaDescription || par.pt.seo?.metaDescription),
    href: hrefDe(secao, locale),
  }
}

/** O diagnóstico de maturidade não é documento de `pages`: é rota com global. */
export function doDiagnostico(textos: { titulo?: string | null; resumo?: string | null }, locale: Locale): ConteudoRecomendavel | null {
  const titulo = emUmaLinha(textos.titulo, 140)
  if (!titulo) return null
  return {
    codigo: codigoDaPagina('diagnostico'),
    tipo: 'pagina',
    titulo,
    resumo: emUmaLinha(textos.resumo),
    href: hrefDe('diagnosticoMaturidade', locale),
  }
}

/* O que o admin liga em "O que a IA pode recomendar" → os tipos do catálogo.
 * Os valores do campo são os nomes das collections, como no resto do CMS.
 *
 * ⚠️ As páginas de parceiro andam com "Páginas" (D-75): são páginas do site,
 * e uma opção nova no campo pediria migração para um interruptor que ninguém
 * pediu. */
const TIPO_DO_CAMPO: Record<NonNullable<AtraAi['recommends']>[number], readonly TipoDeConteudoDaIa[]> = {
  solutions: ['solucao'],
  segments: ['segmento'],
  cases: ['case'],
  webinars: ['webinar'],
  ebooks: ['ebook'],
  posts: ['artigo'],
  pages: ['pagina', 'parceiro'],
}

export const TIPOS_RECOMENDAVEIS = Object.keys(TIPO_DO_CAMPO) as NonNullable<AtraAi['recommends']>

/** Campo vazio = nada ligado: o assistente não recomenda conteúdo do site. */
export function tiposLigados(doAdmin: AtraAi['recommends'] | undefined): ReadonlySet<TipoDeConteudoDaIa> {
  return new Set((doAdmin ?? []).flatMap((valor) => TIPO_DO_CAMPO[valor] ?? []))
}
