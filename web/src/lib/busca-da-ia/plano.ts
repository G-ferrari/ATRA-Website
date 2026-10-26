import { createHash } from 'node:crypto'

import type { ConteudoRecomendavel } from '@/types/content'

import type { TrechoGuardado, TrechoNovo } from './banco'
import { DIMENSOES, MODELO_DE_EMBEDDING } from './embeddings'
import { dividirEmTrechos } from './texto'

/* A conta da sincronização do índice (D-73), sem banco nem rede: o que cada
 * item do catálogo deve ter, e o que mudou desde a última vez. */

export type TrechoDesejado = Omit<TrechoNovo, 'vetor'>

/** O hash muda quando muda o texto, o modelo ou a dimensão — qualquer um dos
 *  três torna o vetor guardado inválido. */
export function hashDoTrecho(conteudo: string): string {
  return createHash('sha256').update(`${MODELO_DE_EMBEDDING}:${DIMENSOES}\n${conteudo}`).digest('hex')
}

/** Os trechos que cada item do catálogo deve ter no índice. Item sem texto no
 *  CMS (o diagnóstico, que é global) entra com o título e o resumo. */
export function trechosDesejados(
  catalogo: readonly ConteudoRecomendavel[],
  paragrafos: ReadonlyMap<string, readonly string[]>,
): TrechoDesejado[] {
  return catalogo.flatMap((item) => {
    const texto = paragrafos.get(item.codigo) ?? [item.resumo]
    return dividirEmTrechos(item.titulo, texto.filter(Boolean)).map((conteudo, posicao) => ({
      codigo: item.codigo,
      tipo: item.tipo,
      posicao,
      conteudo,
      hash: hashDoTrecho(conteudo),
    }))
  })
}

/** O que gravar (novo ou mudado) e o que apagar (sobrou), comparando pelo hash. */
export function planejar(
  desejados: readonly TrechoDesejado[],
  guardados: readonly TrechoGuardado[],
): { gravar: TrechoDesejado[]; apagar: TrechoGuardado[] } {
  const chave = (t: { codigo: string; posicao: number }) => `${t.codigo}#${t.posicao}`
  const hashGuardado = new Map(guardados.map((t) => [chave(t), t.hash]))
  const queridos = new Set(desejados.map(chave))
  return {
    gravar: desejados.filter((t) => hashGuardado.get(chave(t)) !== t.hash),
    apagar: guardados.filter((t) => !queridos.has(chave(t))),
  }
}

