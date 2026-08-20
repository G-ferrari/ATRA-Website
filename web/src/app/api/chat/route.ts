import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

/* POST /api/chat — porte de `legacy/server.ts:38`, com o que D-12 decidiu.
 *
 * O legado expõe a rota **sem limite nenhum**: cada POST gasta cota do Gemini, e
 * qualquer um pode chamá-la em laço. Aqui entra limite por IP e degradação
 * graciosa — atingido o teto, responde a mensagem de indisponibilidade em vez
 * de continuar gastando.
 *
 * ⚠️ O contador é **em memória do processo**. Serve a um servidor só, que é o
 * plano de deploy (P-05), e some a cada reinício. Com mais de uma instância ou
 * função serverless, cada uma conta a sua e o teto efetivo multiplica. Trocar
 * por Redis é a próxima etapa, e depende de saber o teto real de custo (P-04).
 *
 * ⚠️ `GEMINI_API_KEY` **sem** prefixo `NEXT_PUBLIC_`: a chave só existe no
 * servidor. O `define` de `legacy/vite.config.ts:12` injeta a chave no bundle
 * do cliente, e é exatamente o que a regra 7 proíbe portar. */

export const dynamic = 'force-dynamic'

type Mensagem = { role: 'user' | 'model'; content: string }

const JANELA_MS = 60 * 60 * 1000
const acessos = new Map<string, number[]>()

function ipDe(req: Request): string {
  const encaminhado = req.headers.get('x-forwarded-for')
  return encaminhado?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'desconhecido'
}

/** Conta as chamadas da última hora e registra esta. Devolve se passou do teto. */
function estourouOLimite(ip: string, teto: number): boolean {
  const agora = Date.now()
  const recentes = (acessos.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  if (recentes.length >= teto) {
    acessos.set(ip, recentes)
    return true
  }
  recentes.push(agora)
  acessos.set(ip, recentes)

  /* Limpeza oportunista: sem isto o mapa cresce com um IP por visitante e nunca
     encolhe. Roda de vez em quando para não pagar o custo a cada requisição. */
  if (acessos.size > 5000) {
    for (const [chave, marcas] of acessos) {
      const vivos = marcas.filter((t) => agora - t < JANELA_MS)
      if (vivos.length === 0) acessos.delete(chave)
      else acessos.set(chave, vivos)
    }
  }
  return false
}

export async function POST(req: Request) {
  const payload = await getPayload()
  const config = await payload.findGlobal({ slug: 'atra-ai', depth: 0 })

  const indisponivel =
    config?.unavailableMessage ??
    'A ATRA AI está indisponível no momento. Fale com a gente pelo WhatsApp ou por negocios@atra.com.br.'

  if (config?.enabled === false) {
    return NextResponse.json({ error: indisponivel }, { status: 503 })
  }

  if (estourouOLimite(ipDe(req), config?.requestsPerHour ?? 20)) {
    return NextResponse.json({ error: indisponivel }, { status: 429 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    /* Sem chave a rota não erra 500: responde o mesmo texto de
       indisponibilidade. É o caso do ambiente de desenvolvimento e do
       container do aceite visual. */
    return NextResponse.json({ error: indisponivel }, { status: 503 })
  }

  let mensagens: Mensagem[]
  try {
    const corpo = (await req.json()) as { messages?: Mensagem[] }
    mensagens = corpo.messages ?? []
  } catch {
    return NextResponse.json({ error: 'Formato de mensagens inválido.' }, { status: 400 })
  }

  if (!Array.isArray(mensagens) || mensagens.length === 0) {
    return NextResponse.json({ error: 'Formato de mensagens inválido.' }, { status: 400 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const resposta = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: mensagens.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      config: { systemInstruction: config?.systemPrompt ?? '', temperature: 0.7 },
    })
    return NextResponse.json({ text: resposta.text ?? '' })
  } catch (e) {
    console.error('ATRA AI:', e)
    return NextResponse.json({ error: indisponivel }, { status: 502 })
  }
}
