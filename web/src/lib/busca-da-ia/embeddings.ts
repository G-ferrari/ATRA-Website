import { GoogleGenAI } from '@google/genai'

/* Os embeddings da busca da ATRA AI (D-73): texto → vetor, pelo Gemini, com a
 * mesma `GEMINI_API_KEY` da conversa.
 *
 * ⚠️ Modelo e dimensão fazem parte do índice. Trocar qualquer um dos dois deixa
 * os vetores guardados incomparáveis com os da pergunta — a busca devolveria
 * trechos ao acaso, sem erro. Por isso os dois entram no hash de cada trecho
 * (`indice.ts`): mudar aqui faz a próxima sincronização refazer tudo. E a
 * dimensão é também a da coluna (`vector(768)`, na migração): mudá-la pede
 * migração nova.
 *
 * 768, e não os 3.072 nativos: o modelo é treinado para ser cortado (MRL), a
 * perda de qualidade é pequena, e o índice fica quatro vezes menor. */

export const MODELO_DE_EMBEDDING = 'gemini-embedding-001'
export const DIMENSOES = 768

/* O limite da API é 100 textos por chamada; 50 deixa folga para trechos longos
 * sem bater no teto de tokens por requisição. */
const POR_CHAMADA = 50

/** Documento para guardar, ou pergunta para buscar: o modelo gera vetores
 *  diferentes para cada papel, e é isso que aproxima pergunta de resposta. */
export type Tarefa = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'

export type GerarEmbeddings = (textos: readonly string[], tarefa: Tarefa) => Promise<number[][]>

export function geradorDeEmbeddings(apiKey: string): GerarEmbeddings {
  const ai = new GoogleGenAI({ apiKey })
  return async (textos, tarefa) => {
    const vetores: number[][] = []
    for (let i = 0; i < textos.length; i += POR_CHAMADA) {
      const lote = textos.slice(i, i + POR_CHAMADA)
      const resposta = await ai.models.embedContent({
        model: MODELO_DE_EMBEDDING,
        contents: [...lote],
        config: { taskType: tarefa, outputDimensionality: DIMENSOES },
      })
      const recebidos = (resposta.embeddings ?? []).map((e) => e.values ?? [])
      if (recebidos.length !== lote.length || recebidos.some((v) => v.length !== DIMENSOES)) {
        throw new Error(`Embeddings: esperava ${lote.length} vetores de ${DIMENSOES}, veio outra coisa.`)
      }
      vetores.push(...recebidos)
    }
    return vetores
  }
}

/** O vetor no formato de texto que o pgvector lê: `[0.1,0.2,…]`. */
export function comoVetor(valores: readonly number[]): string {
  return `[${valores.join(',')}]`
}
