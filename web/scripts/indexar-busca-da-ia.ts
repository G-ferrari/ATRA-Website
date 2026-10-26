/* D-73 — sincroniza à mão o índice da busca da ATRA AI.
 *
 * Normalmente ninguém precisa disto: a primeira conversa depois de um deploy e
 * cada publicação no admin já sincronizam (`src/lib/busca-da-ia/agenda.ts`).
 * Serve para encher o índice antes da primeira conversa, ou para conferir
 * quantos trechos cada idioma tem. Só reenvia ao Gemini o que mudou.
 *
 * Rodar com:
 *   pnpm exec tsx --env-file-if-exists=.env.local scripts/indexar-busca-da-ia.ts
 * Em produção não há o que rodar: a imagem do site não traz os scripts, e a
 * primeira conversa depois do deploy já sincroniza em segundo plano. O log do
 * container diz quando terminou ("índice da busca sincronizado").
 */
import { geradorDeEmbeddings } from '../src/lib/busca-da-ia/embeddings'
import { sincronizarIndice } from '../src/lib/busca-da-ia/indice'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('Sem GEMINI_API_KEY: os embeddings saem do Gemini.')
  process.exit(1)
}

for (const r of await sincronizarIndice(geradorDeEmbeddings(apiKey))) {
  console.log(`${r.locale}: ${r.trechos} trechos (${r.gravados} gravados, ${r.apagados} apagados)`)
}
process.exit(0)
