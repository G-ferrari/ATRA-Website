'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { MAX_CHARS_POR_CONTEXTO, MAX_MENSAGENS_DO_CONTEXTO } from '@/lib/chat'
import { lerContato } from '@/lib/contato'
import { destinoDoAviso } from '@/lib/destino-do-aviso'
import { enviarAviso } from '@/lib/email'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'
import { MAX_POR_VALOR } from '@/lib/utm'

/* MIG-149 (D-29) — o lead que o convite do chat coleta.
 *
 * Mesmo contrato do formulário de contato (MIG-100/101): anti-spam → grava →
 * avisa, com o aviso incapaz de derrubar a gravação. A sincronização com o
 * RD Station CRM não aparece aqui de propósito — é o hook de MIG-148, que
 * dispara no `payload.create`.
 *
 * ⚠️ A guarda de flag fica **na action**, não só na UI: Server Action é
 * endpoint público, e feature escura (`ENABLE_CHAT_LEAD` ausente, ou convite
 * desligado no CMS) não pode aceitar POST de quem descobrir a rota.
 */

export type ResultadoLeadDoChat = { ok: true } | { ok: false; erro: string }

const ERRO = 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.'
const MAX_CAMPO = 200
/* O teto do servidor para o recorte da conversa: o cliente monta ≤5 mensagens
 * de ≤500 chars (`contextoDoLead`), e aqui entra margem para os separadores —
 * quem posta não é obrigado a ser o nosso JavaScript (MIG-142). */
const MAX_CONTEXTO = MAX_MENSAGENS_DO_CONTEXTO * (MAX_CHARS_POR_CONTEXTO + 1)

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

const campanha = (dados: FormData, campo: string): string | undefined =>
  texto(dados, campo).slice(0, MAX_POR_VALOR) || undefined

export async function enviarLeadDoChat(dados: FormData): Promise<ResultadoLeadDoChat> {
  if (process.env.ENABLE_CHAT_LEAD !== '1') return { ok: false, erro: ERRO }

  const email = texto(dados, 'email')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, erro: 'Confira o e-mail informado.' }
  }

  /* Anti-spam idêntico ao contato: isca, carimbo e limite por IP. Robô barrado
   * recebe sucesso — dizer "você foi barrado" entrega o critério. */
  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) {
    console.warn(`[chat-lead] barrado por ${veredito.motivo}`)
    return { ok: true }
  }
  const cabecalhos = await headers()
  if (excedeuPorIp(ipDe(cabecalhos))) return { ok: true }

  const payload = await getPayload()

  /* A segunda metade da guarda: o toggle editorial do CMS. Checado depois do
   * anti-spam para não gastar consulta com robô. */
  const ai = await payload.findGlobal({ slug: 'atra-ai', depth: 0 })
  if (!ai.leadCapture?.enabled) return { ok: false, erro: ERRO }

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'chat-lead',
        email,
        name: texto(dados, 'name') || undefined,
        phone: texto(dados, 'phone') || undefined,
        company: texto(dados, 'company') || undefined,
        chatContext: texto(dados, 'chatContext', MAX_CONTEXTO) || undefined,
        source: texto(dados, 'source') || undefined,
        utm: {
          source: campanha(dados, 'utm_source'),
          medium: campanha(dados, 'utm_medium'),
          campaign: campanha(dados, 'utm_campaign'),
          term: campanha(dados, 'utm_term'),
          content: campanha(dados, 'utm_content'),
        },
        status: 'new',
        notified: false,
      },
    })
  } catch (e) {
    console.error('[chat-lead] não gravou:', e)
    return { ok: false, erro: ERRO }
  }

  const contato = await lerContato()
  const empresa = texto(dados, 'company')
  const enviou = await enviarAviso({
    para: destinoDoAviso(contato, 'chat'),
    assunto: `[site] novo lead do chat${empresa ? ` — ${empresa}` : ''}`,
    responderPara: email,
    texto: [
      `E-mail: ${email}`,
      texto(dados, 'name') && `Nome: ${texto(dados, 'name')}`,
      texto(dados, 'phone') && `Telefone: ${texto(dados, 'phone')}`,
      empresa && `Empresa: ${empresa}`,
      texto(dados, 'chatContext', MAX_CONTEXTO) &&
        `\nO que perguntou à ATRA AI:\n${texto(dados, 'chatContext', MAX_CONTEXTO)}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  if (enviou) {
    const { docs } = await payload.find({
      collection: 'form-submissions',
      where: { email: { equals: email }, kind: { equals: 'chat-lead' } },
      sort: '-createdAt',
      limit: 1,
      depth: 0,
    })
    if (docs[0]) {
      await payload.update({ collection: 'form-submissions', id: docs[0].id, data: { notified: true } })
    }
  }

  return { ok: true }
}
