import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { tokenConfere } from '@/lib/revalidacao-de-fora'

/* POST /api/revalidar — só o próprio processo chama (`lib/revalidacao-de-fora.ts`),
 * quando uma escrita fora de requisição (a fila de tradução) precisa invalidar
 * o site. 404 para quem não tem o token: a rota não existe para o público. */
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!tokenConfere(req.headers.get('x-revalidar'))) return new NextResponse(null, { status: 404 })
  revalidatePath('/', 'layout')
  return new NextResponse(null, { status: 204 })
}
