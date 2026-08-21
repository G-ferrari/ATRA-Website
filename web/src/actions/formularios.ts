'use server'

import { headers } from 'next/headers'

import { conferir, excedeuPorIp, CAMPO_ISCA } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import { enviarAviso } from '@/lib/email'
import { getPayload } from '@/lib/payload'
import { MAX_POR_VALOR } from '@/lib/utm'

/* MIG-100 — o envio dos formulários do site.
 *
 * Server Action e não rota de API: o formulário é um `<form action={...}>`, e
 * com isso ele **funciona sem JavaScript** — o que importa num formulário de
 * contato, que é a única forma de um visitante falar com a empresa.
 *
 * ⚠️ A ordem importa: anti-spam → grava → avisa. Gravar antes de avisar é o que
 * garante que um problema no e-mail não perca o lead. É o inverso do que parece
 * natural (avisar e só então persistir), e é o que P-22 questiona por outro
 * ângulo — lead perdido não volta.
 */

export type Resultado = { ok: true } | { ok: false; erro: string }

const ERRO_GENERICO = 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.'

function ipDe(cabecalhos: Headers): string {
  const encaminhado = cabecalhos.get('x-forwarded-for')
  return encaminhado?.split(',')[0]?.trim() || cabecalhos.get('x-real-ip') || 'desconhecido'
}

const texto = (dados: FormData, campo: string): string => String(dados.get(campo) ?? '').trim()

/** Um parâmetro de campanha, cortado no teto. `undefined` quando vazio: coluna nula diz "sem campanha", string vazia não diz nada. */
const campanha = (dados: FormData, campo: string): string | undefined =>
  texto(dados, campo).slice(0, MAX_POR_VALOR) || undefined

/** Aceita o que parece e-mail. Validação de verdade é o e-mail chegar. */
const pareceEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export async function enviarFormulario(dados: FormData): Promise<Resultado> {
  const kind = texto(dados, 'kind')
  if (kind !== 'contact' && kind !== 'newsletter' && kind !== 'talent-pool') {
    return { ok: false, erro: ERRO_GENERICO }
  }

  const email = texto(dados, 'email')
  if (!pareceEmail(email)) return { ok: false, erro: 'Confira o e-mail informado.' }

  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) {
    /* ⚠️ Responde **sucesso** ao robô, de propósito. Dizer "você foi barrado"
     * entrega o critério de graça: o autor ajusta o script e volta. O envio
     * simplesmente não acontece. */
    console.warn(`[formulario] barrado por ${veredito.motivo}`)
    return { ok: true }
  }

  const cabecalhos = await headers()
  if (excedeuPorIp(ipDe(cabecalhos))) return { ok: true }

  const payload = await getPayload()

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        kind,
        email,
        name: texto(dados, 'name') || undefined,
        phone: texto(dados, 'phone') || undefined,
        company: texto(dados, 'company') || undefined,
        message: texto(dados, 'message') || undefined,
        source: texto(dados, 'source') || undefined,
        /* ⚠️ Cortado **de novo** aqui. O cliente já limita, mas quem posta o
         * formulário não é obrigado a ser o nosso JavaScript — `curl` com um
         * `utm_campaign` de 8 KB chegaria inteiro na coluna. */
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
    console.error('[formulario] não gravou:', e)
    return { ok: false, erro: ERRO_GENERICO }
  }

  /* O aviso é o **segundo** passo e não pode derrubar o primeiro. Sem chave de
   * e-mail, `notified` fica falso e a falta aparece no admin. */
  const contato = await lerContato()
  const enviou = await enviarAviso({
    para: contato.email,
    assunto: `[site] ${ASSUNTO[kind]}${texto(dados, 'company') ? ` — ${texto(dados, 'company')}` : ''}`,
    responderPara: email,
    texto: resumo(dados, email),
  })

  if (enviou) {
    const { docs } = await payload.find({
      collection: 'form-submissions',
      where: { email: { equals: email } },
      sort: '-createdAt',
      limit: 1,
      depth: 0,
    })
    if (docs[0]) await payload.update({ collection: 'form-submissions', id: docs[0].id, data: { notified: true } })
  }

  return { ok: true }
}

const ASSUNTO: Record<string, string> = {
  contact: 'novo contato',
  newsletter: 'nova inscrição na newsletter',
  'talent-pool': 'novo currículo no banco de talentos',
}

function resumo(dados: FormData, email: string): string {
  const linhas = [
    `E-mail: ${email}`,
    texto(dados, 'name') && `Nome: ${texto(dados, 'name')}`,
    texto(dados, 'phone') && `Telefone: ${texto(dados, 'phone')}`,
    texto(dados, 'company') && `Empresa: ${texto(dados, 'company')}`,
    texto(dados, 'source') && `Veio de: ${texto(dados, 'source')}`,
    texto(dados, 'utm_campaign') && `Campanha: ${texto(dados, 'utm_campaign')}`,
    texto(dados, 'message') && `\n${texto(dados, 'message')}`,
  ].filter(Boolean)
  return linhas.join('\n')
}
