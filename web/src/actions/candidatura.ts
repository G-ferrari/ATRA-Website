'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import { enviarAviso } from '@/lib/email'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'

/* MIG-102 — candidatura a uma vaga, com currículo.
 *
 * Mesmo contrato do formulário de contato (MIG-100/101): anti-spam → grava →
 * avisa, com o aviso incapaz de derrubar a gravação. O que muda é o arquivo:
 * o PDF entra em `private-files` — bucket privado, lido só pelo RH autenticado
 * no admin — e a submission referencia o doc.
 *
 * ⚠️ **Não está montada em página nenhuma até P-17 responder** (retenção e
 * acesso, exigência de LGPD). A action existe e funciona; ligar é montar o
 * componente `Candidatura` na página da vaga com `ENABLE_JOB_APPLICATIONS=1`.
 */

export type ResultadoCandidatura = { ok: true } | { ok: false; erro: string }

const ERRO = 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.'
const MAX_CAMPO = 200
const MAX_MENSAGEM = 5000
/* 5 MB cobre qualquer currículo real; o teto existe porque upload sem teto é
 * disco alheio de graça. */
const MAX_CV_BYTES = 5 * 1024 * 1024

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

export async function enviarCandidatura(dados: FormData): Promise<ResultadoCandidatura> {
  const email = texto(dados, 'email')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, erro: 'Confira o e-mail — é por ele que o RH responde.' }
  }
  const nome = texto(dados, 'name')
  if (!nome) return { ok: false, erro: 'Diga seu nome — a candidatura é sua.' }

  /* Anti-spam idêntico ao contato: isca, carimbo de tempo e limite por IP.
   * Robô barrado recebe sucesso — dizer "você foi barrado" entrega o critério. */
  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) return { ok: true }
  const cabecalhos = await headers()
  if (excedeuPorIp(ipDe(cabecalhos))) return { ok: true }

  const arquivo = dados.get('cv')
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { ok: false, erro: 'Anexe o currículo em PDF.' }
  }
  if (arquivo.type !== 'application/pdf' || !arquivo.name.toLowerCase().endsWith('.pdf')) {
    return { ok: false, erro: 'O currículo precisa ser um PDF.' }
  }
  if (arquivo.size > MAX_CV_BYTES) {
    return { ok: false, erro: 'O PDF passa de 5 MB — exporte uma versão mais leve.' }
  }

  const conteudo = Buffer.from(await arquivo.arrayBuffer())
  /* Assinatura de PDF de verdade, não só a extensão: %PDF no início. É barato
   * e barra o .exe renomeado — o RH vai abrir esses arquivos. */
  if (!conteudo.subarray(0, 5).toString('latin1').startsWith('%PDF')) {
    return { ok: false, erro: 'O arquivo não parece um PDF válido.' }
  }

  const jobId = Number(texto(dados, 'jobId', 30))
  const vaga = texto(dados, 'jobTitle')

  const payload = await getPayload()
  try {
    const cv = await payload.create({
      collection: 'private-files',
      data: { label: `CV — ${nome}${vaga ? ` (${vaga})` : ''}`, kind: 'cv' },
      file: {
        data: conteudo,
        mimetype: 'application/pdf',
        /* O nome sai higienizado: vira parte da chave no bucket. */
        name: `cv-${Date.now()}-${arquivo.name.replace(/[^\w.-]+/g, '_').slice(0, 80)}`,
        size: conteudo.length,
      },
    })

    await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'job-application',
        email,
        name: nome,
        phone: texto(dados, 'phone') || undefined,
        message: texto(dados, 'message', MAX_MENSAGEM) || undefined,
        cv: cv.id,
        ...(Number.isFinite(jobId) && jobId > 0 ? { job: jobId } : {}),
        status: 'new',
        notified: false,
      },
    })
  } catch (e) {
    console.error('[candidatura] não gravou:', e)
    return { ok: false, erro: ERRO }
  }

  const contato = await lerContato()
  await enviarAviso({
    para: contato.email,
    assunto: `[site] candidatura${vaga ? ` — ${vaga}` : ''}`,
    responderPara: email,
    texto: [`Nome: ${nome}`, `E-mail: ${email}`, vaga && `Vaga: ${vaga}`, '', 'O currículo está no admin, em Arquivos privados.']
      .filter(Boolean)
      .join('\n'),
  })

  return { ok: true }
}
