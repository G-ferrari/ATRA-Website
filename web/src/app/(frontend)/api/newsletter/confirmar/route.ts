import { NextResponse, type NextRequest } from 'next/server'

import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/* MIG-103 — o clique do link de confirmação da newsletter.
 *
 * GET de propósito: o link chega por e-mail e precisa funcionar num clique,
 * sem JavaScript e sem formulário. O que ele muda é idempotente — confirmar
 * duas vezes carimba a mesma inscrição.
 *
 * ⚠️ Token errado e token ausente respondem o **mesmo redirect** da página de
 * confirmação com estado de erro genérico. Distinguir "token não existe" de
 * "token expirado/errado" daria a um robô um oráculo para enumerar tokens.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')?.trim() ?? ''
  const destino = (ok: boolean) =>
    NextResponse.redirect(new URL(`/newsletter/${ok ? 'confirmada' : 'invalida'}`, req.nextUrl.origin))

  /* Formato do gerarToken(): 48 hex. Fora disso nem consulta o banco. */
  if (!/^[0-9a-f]{48}$/.test(token)) return destino(false)

  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'form-submissions',
    where: { confirmationToken: { equals: token }, kind: { equals: 'newsletter' } },
    limit: 1,
    depth: 0,
  })
  if (!docs[0]) return destino(false)

  if (!docs[0].confirmedAt) {
    await payload.update({
      collection: 'form-submissions',
      id: docs[0].id,
      data: { confirmedAt: new Date().toISOString() },
    })
  }
  return destino(true)
}
