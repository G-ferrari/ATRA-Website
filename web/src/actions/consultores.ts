'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import { enviarAviso } from '@/lib/email'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'
import {
  lerDuracao,
  lerModelo,
  lerPerfisPedidos,
  resumoDaSolicitacao,
  type PerfilConfirmado,
} from '@/lib/solicitacao-consultores'
import { MAX_POR_VALOR } from '@/lib/utm'

/* Solicitação de consultores de /consultores (feature consultores-solicitacao,
 * task 012).
 *
 * Mesmo contrato dos outros formulários (`architecture.md` §4): anti-spam →
 * grava → avisa, com o aviso incapaz de derrubar a gravação. A sincronização com
 * o RD Station CRM não vem aqui: é o hook `afterChange` de `form-submissions`, e
 * `consultant-request` entrou na lista comercial na task 011.
 *
 * ⚠️ **Os perfis são revalidados no servidor.** Server Action é endpoint público
 * (MIG-142): o cliente manda ids e quantidades, e cargo e nível saem do
 * `specialist-roles` — nunca do que veio no formulário. Id que não existe some.
 *
 * ⚠️ **Depois que o lead é gravado, a resposta é sucesso, aconteça o que
 * acontecer.** No modelo (`diagnostico-rc18.ts`), `lerContato` e o `update` do
 * `notified` rodam sem proteção depois do `create`: se um deles falhar, o
 * visitante vê erro com o lead já salvo, tenta de novo, e o comercial recebe
 * duplicata. Aqui o bloco pós-gravação só registra no log.
 *
 * ⚠️ `notified` é marcado pelo **id que o `create` devolveu**. O modelo busca o
 * lead por e-mail + kind + `-createdAt`, e dois envios simultâneos do mesmo
 * e-mail marcariam o errado.
 *
 * Destino do aviso: o `email` do global `contact`, como os demais formulários —
 * sem variável de ambiente nova. */

export type ResultadoSolicitacao = { ok: true } | { ok: false; erro: string }

const ERRO = 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.'
const VAZIO = 'Escolha ao menos um perfil ou descreva o profissional que você procura.'
const MAX_CAMPO = 200
const MAX_MENSAGEM = 5000

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

const campanha = (dados: FormData, campo: string): string | undefined =>
  texto(dados, campo).slice(0, MAX_POR_VALOR) || undefined

export async function solicitarConsultores(dados: FormData): Promise<ResultadoSolicitacao> {
  const email = texto(dados, 'email')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, erro: 'Confira o e-mail informado.' }
  }

  /* Robô barrado recebe sucesso: dizer "você foi barrado" entrega o critério. */
  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) {
    console.warn(`[consultores] barrado por ${veredito.motivo}`)
    return { ok: true }
  }
  if (excedeuPorIp(ipDe(await headers()))) return { ok: true }

  const pedidos = lerPerfisPedidos(texto(dados, 'perfis', MAX_MENSAGEM))
  const descricao = texto(dados, 'message', MAX_MENSAGEM)
  /* Sem perfil e sem descrição não há pedido. Recusado antes de tocar no banco. */
  if (pedidos.length === 0 && !descricao) return { ok: false, erro: VAZIO }

  const payload = await getPayload()

  let perfis: PerfilConfirmado[] = []
  if (pedidos.length > 0) {
    try {
      /* `specialist-roles` é `isPublic` e sem drafts: não há rascunho a esconder,
         então o filtro `_status` da regra 4 não se aplica. `select` porque o
         adapter Postgres faz um JOIN por tipo de bloco mesmo com `depth: 0`.
         `pt`: quem lê o resumo é o comercial da ATRA. */
      const { docs } = await payload.find({
        collection: 'specialist-roles',
        where: { id: { in: pedidos.map((p) => p.id) } },
        locale: 'pt',
        depth: 0,
        limit: pedidos.length,
        select: { role: true, level: true },
      })
      const porId = new Map(docs.map((d) => [Number(d.id), d]))
      /* Na ordem em que o visitante escolheu, e não na do banco. */
      perfis = pedidos.flatMap((p) => {
        const d = porId.get(p.id)
        return d ? [{ cargo: d.role, nivel: d.level, quantidade: p.quantidade }] : []
      })
    } catch (e) {
      console.error('[consultores] não conferiu os perfis:', e)
      return { ok: false, erro: ERRO }
    }
  }
  /* Todos os ids eram forjados ou de perfis que saíram do catálogo. */
  if (perfis.length === 0 && !descricao) return { ok: false, erro: VAZIO }

  const mensagem = resumoDaSolicitacao({
    perfis,
    duracaoMeses: lerDuracao(texto(dados, 'duracao')),
    modelo: lerModelo(texto(dados, 'modelo')),
    descricao,
  }).slice(0, MAX_MENSAGEM)

  const nome = texto(dados, 'name')
  const telefone = texto(dados, 'phone')
  const empresa = texto(dados, 'company')

  let id: number | string
  try {
    const doc = await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'consultant-request',
        email,
        name: nome || undefined,
        phone: telefone || undefined,
        company: empresa || undefined,
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
    id = doc.id
  } catch (e) {
    console.error('[consultores] não gravou:', e)
    return { ok: false, erro: ERRO }
  }

  /* Daqui em diante o lead está salvo: falha só vai para o log. */
  try {
    const contato = await lerContato()
    const enviou = await enviarAviso({
      para: contato.email,
      assunto: `[site] solicitação de consultores${empresa ? ` — ${empresa}` : ''}`,
      responderPara: email,
      /* `filter(Boolean)` só nas linhas de contato, que são opcionais: no corpo
         inteiro ele comeria as linhas em branco entre os blocos. */
      texto: [
        'Nova solicitação de consultores pelo site.',
        [
          'Contato',
          nome && `Nome: ${nome}`,
          empresa && `Empresa: ${empresa}`,
          `E-mail: ${email}`,
          telefone && `Telefone: ${telefone}`,
        ]
          .filter(Boolean)
          .join('\n'),
        mensagem,
      ].join('\n\n'),
    })
    if (enviou) await payload.update({ collection: 'form-submissions', id, data: { notified: true } })
  } catch (e) {
    console.error(`[consultores] lead ${id} gravado, mas o aviso falhou:`, e)
  }

  return { ok: true }
}
