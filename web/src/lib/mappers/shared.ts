import type { Media, Topic as TopicDoc } from '@/payload-types'
import type { Image, Topic } from '@/types/content'

/* Um relacionamento do Payload chega como id (`number`) ou como documento,
 * conforme a `depth` da consulta. Resolver isso é trabalho do mapper: se
 * vazasse para o componente, todo JSX precisaria de `typeof x === 'object'`. */

export function isPopulated<T>(valor: number | string | T | null | undefined): valor is T {
  return typeof valor === 'object' && valor !== null
}

/**
 * Campo obrigatório que chegou vazio.
 *
 * É diferente de relacionamento não populado, e a distinção importa: o Payload
 * **não valida obrigatórios em rascunho**, de propósito — é o que permite salvar
 * pela metade. Então rascunho com `heroImage` vazio é uso normal, não defeito,
 * e o preview precisa mostrar o que falta em vez de estourar (D-20).
 *
 * Já num documento publicado isto é bug de verdade e continua derrubando.
 */
export class ConteudoIncompleto extends Error {
  constructor(readonly campo: string) {
    super(`[conteúdo] "${campo}" está vazio.`)
    this.name = 'ConteudoIncompleto'
  }
}

/**
 * Falha alto e explicando o conserto. Relacionamento não populado é erro de
 * consulta (faltou `depth`), não dado ruim — e uma imagem quebrada em silêncio
 * é pior que um erro em desenvolvimento.
 */
function exigirPopulado<T>(valor: number | string | T | null | undefined, campo: string): T {
  if (valor == null) throw new ConteudoIncompleto(campo)
  if (!isPopulated<T>(valor)) {
    throw new Error(
      `[mapper] "${campo}" veio como id, não como documento. ` +
        `Aumente a \`depth\` da consulta ou use \`populate\`.`,
    )
  }
  return valor
}

/**
 * Roda um mapper e separa "conteúdo faltando" de sucesso. Erro de consulta
 * continua subindo: aquilo é bug e tem que aparecer.
 */
export function mapearOuFaltando<T>(fn: () => T): { doc: T } | { faltando: string } {
  try {
    return { doc: fn() }
  } catch (e) {
    if (e instanceof ConteudoIncompleto) return { faltando: e.campo }
    throw e
  }
}

export function toImage(valor: number | Media | null | undefined, campo: string): Image {
  const doc = exigirPopulado<Media>(valor, campo)
  if (!doc.url || !doc.width || !doc.height) {
    throw new Error(`[mapper] Media "${campo}" (id ${doc.id}) sem url/width/height.`)
  }
  return { url: doc.url, alt: doc.alt, width: doc.width, height: doc.height }
}

/** Versão opcional: campo vazio é ausência legítima, não erro. */
export function toImageOpcional(
  valor: number | Media | null | undefined,
  campo: string,
): Image | null {
  return valor == null ? null : toImage(valor, campo)
}

export function toTopic(valor: number | TopicDoc, campo = 'topic'): Topic {
  const doc = exigirPopulado<TopicDoc>(valor, campo)
  return { slug: doc.slug, name: doc.name }
}

/** Lista de relacionamentos, descartando o que não veio populado. */
export function toTopics(valores: (number | TopicDoc)[] | null | undefined): Topic[] {
  return (valores ?? []).filter(isPopulated<TopicDoc>).map((t) => toTopic(t))
}

/** `array` do Payload → lista de strings, sem os itens vazios. */
export function toTextos<K extends string>(
  itens: readonly Record<K, string | null | undefined>[] | null | undefined,
  chave: K,
): string[] {
  const valores: (string | null | undefined)[] = (itens ?? []).map((i) => i[chave])
  return valores.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}
