import type { Mensagem } from '../chat'
import type { Locale } from '../locales'

import { trechosMaisProximos, type TrechoAchado } from './banco'
import { consultaDaConversa } from './consulta'
import type { GerarEmbeddings } from './embeddings'

/* A busca de cada pergunta (D-73): a conversa vira um vetor, e o banco devolve
 * os trechos do site mais próximos dele. */

/* Seis trechos de ~1.200 caracteres: ~2.000 tokens a mais por mensagem. O
 * bastante para a resposta ter de onde tirar o que diz, e pouco perto da lista
 * do catálogo, que já vai inteira. */
export const TRECHOS_POR_PERGUNTA = 6

export async function buscarTrechos(
  mensagens: readonly Mensagem[],
  locale: Locale,
  codigos: readonly string[],
  gerar: GerarEmbeddings,
): Promise<TrechoAchado[]> {
  const consulta = consultaDaConversa(mensagens)
  if (!consulta || codigos.length === 0) return []
  const [vetor] = await gerar([consulta], 'RETRIEVAL_QUERY')
  return trechosMaisProximos(locale, vetor, codigos, TRECHOS_POR_PERGUNTA)
}
