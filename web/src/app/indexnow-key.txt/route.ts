import { chaveDoIndexNow } from '@/lib/indexnow'

/* A prova de posse do IndexNow (D-80): o protocolo confere que este arquivo
 * devolve a mesma chave do aviso (`keyLocation`). Sem chave no ambiente, 404 —
 * e o aviso também não sai. Lido a cada requisição: a chave entra no ambiente
 * do contêiner, não no build. */
export const dynamic = 'force-dynamic'

export function GET(): Response {
  const chave = chaveDoIndexNow()
  return chave
    ? new Response(chave, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
    : new Response('Not found', { status: 404 })
}
