import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { getPayload } from '@/lib/payload'

/* Liga o modo rascunho do Next e devolve o visitante à página pedida.
 *
 * Autenticação: a chamada vem do admin, no mesmo domínio, então o cookie do
 * Payload viaja junto e `payload.auth` diz quem é. Sem sessão válida a rota
 * recusa — modo rascunho aberto exporia conteúdo não publicado a qualquer um
 * que descobrisse a URL.
 *
 * Não usa segredo compartilhado de propósito: um `?secret=` em URL vaza por
 * histórico, log de servidor e Referer. A sessão já existe e é revogável. */
export async function GET(request: NextRequest) {
  const caminho = request.nextUrl.searchParams.get('caminho')

  // Só caminho relativo: `?caminho=https://outro-site` transformaria esta rota
  // num redirecionador aberto.
  if (!caminho || !caminho.startsWith('/') || caminho.startsWith('//')) {
    return new Response('Parâmetro `caminho` ausente ou inválido.', { status: 400 })
  }

  const payload = await getPayload()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Sessão necessária para ver rascunhos.', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(caminho)
}
