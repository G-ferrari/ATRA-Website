'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import {
  questionarioEmTexto,
  resumoRespostas,
  validarRespostas,
  type RespostasQuickCheck,
} from '@/lib/diagnostico-rc18'
import { enviarAviso } from '@/lib/email'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'
import { MAX_POR_VALOR } from '@/lib/utm'

/* Lead do diagnóstico de prontidão RC 18/2025 (feature rc18, task 007).
 *
 * Mesmo contrato dos outros formulários (anti-spam → grava → avisa, com o aviso
 * incapaz de derrubar a gravação). A sincronização com o RD Station CRM não vem
 * aqui: é o hook `afterChange` de `form-submissions`, e `rc18-diagnostic` entrou
 * na lista comercial de `lib/crm.ts` (D-29).
 *
 * ⚠️ As respostas são **revalidadas no servidor** (Server Action é endpoint
 * público, MIG-142); o resumo dos 11 pilares vai para `message`, cortado no teto
 * do campo, e o questionário inteiro — pergunta e resposta — vai no e-mail que a
 * ATRA recebe. Sem índice na tela (decisão do dono).
 *
 * ⚠️ **Destino do e-mail: `RC18_LEAD_EMAIL`, com o `contact.email` do CMS como
 * padrão** (P-29). O dono pediu caixa própria para o diagnóstico e informa o
 * endereço depois; enquanto a variável não existir, o aviso continua indo para o
 * contato institucional — deixar o padrão vazio perderia o lead em silêncio até
 * alguém configurar. A gravação em `form-submissions` não depende disto.
 */

export type ResultadoDiagnosticoLead = { ok: true } | { ok: false; erro: string }

const ERRO = 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.'
const MAX_CAMPO = 200
const MAX_MENSAGEM = 5000

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

const campanha = (dados: FormData, campo: string): string | undefined =>
  texto(dados, campo).slice(0, MAX_POR_VALOR) || undefined

export async function enviarDiagnosticoRc18(dados: FormData): Promise<ResultadoDiagnosticoLead> {
  const email = texto(dados, 'email')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, erro: 'Confira o e-mail informado.' }
  }

  /* Anti-spam idêntico ao contato: isca, carimbo e limite por IP. Robô barrado
   * recebe sucesso — dizer "você foi barrado" entrega o critério. */
  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) {
    console.warn(`[diagnostico-rc18] barrado por ${veredito.motivo}`)
    return { ok: true }
  }
  const cabecalhos = await headers()
  if (excedeuPorIp(ipDe(cabecalhos))) return { ok: true }

  /* Respostas cruas do cliente → validadas no servidor (não confia no enviado). */
  let respostas: RespostasQuickCheck = {}
  try {
    respostas = validarRespostas(JSON.parse(texto(dados, 'respostas', MAX_MENSAGEM) || '{}'))
  } catch {
    respostas = {}
  }
  const mensagem = resumoRespostas(respostas).slice(0, MAX_MENSAGEM)

  const payload = await getPayload()

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'rc18-diagnostic',
        email,
        name: texto(dados, 'name') || undefined,
        phone: texto(dados, 'phone') || undefined,
        company: texto(dados, 'company') || undefined,
        message: mensagem,
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
    console.error('[diagnostico-rc18] não gravou:', e)
    return { ok: false, erro: ERRO }
  }

  const contato = await lerContato()
  const empresa = texto(dados, 'company')
  const enviou = await enviarAviso({
    para: process.env.RC18_LEAD_EMAIL?.trim() || contato.email,
    assunto: `[site] diagnóstico RC 18${empresa ? ` — ${empresa}` : ''}`,
    responderPara: email,
    /* ⚠️ O `filter(Boolean)` vale só para as linhas de contato, que são
       opcionais: aplicado ao corpo inteiro ele comeria as linhas em branco
       entre os blocos, e o e-mail chegaria num parágrafo só. */
    texto: [
      'Novo RC18 Quick Check preenchido no site.',
      [
        'Contato do respondente',
        texto(dados, 'name') && `Nome: ${texto(dados, 'name')}`,
        empresa && `Instituição: ${empresa}`,
        `E-mail: ${email}`,
        texto(dados, 'phone') && `Telefone: ${texto(dados, 'phone')}`,
      ]
        .filter(Boolean)
        .join('\n'),
      /* O questionário completo, e não o `mensagem` que foi para o banco: este
         repete a pergunta de cada pilar (ver `questionarioEmTexto`). */
      questionarioEmTexto(respostas),
    ].join('\n\n'),
  })

  if (enviou) {
    const { docs } = await payload.find({
      collection: 'form-submissions',
      where: { email: { equals: email }, kind: { equals: 'rc18-diagnostic' } },
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
