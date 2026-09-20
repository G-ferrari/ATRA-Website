'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'
import { urlAssinadaDoPrivado } from '@/lib/s3-privado'

/* MIG-104 — o download gated de material rico.
 *
 * O formulário troca contato por acesso: grava o lead e devolve uma URL
 * pré-assinada de 15 minutos para o PDF do material. O arquivo mora no bucket
 * privado — a URL curta é o que mantém "gated" significando alguma coisa.
 *
 * ⚠️ **Liga sozinho, material a material**: a página só mostra o formulário
 * quando `resources.file` está preenchido (P-07 — os 9 materiais ainda não têm
 * PDF). Subir o arquivo no admin é o interruptor; não há flag.
 *
 * A ordem é a de MIG-100: anti-spam → grava → entrega. O lead entra ANTES da
 * URL sair — download sem lead gravado seria o formulário falhando na única
 * função dele.
 */

export type ResultadoDownload = { ok: true; url: string } | { ok: false; erro: string }

const ERRO = 'Não foi possível liberar agora. Tente de novo em instantes.'
const MAX_CAMPO = 200

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

export async function baixarMaterial(dados: FormData): Promise<ResultadoDownload> {
  const email = texto(dados, 'email')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, erro: 'Confira o e-mail para liberar o download.' }
  }

  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  /* ⚠️ Robô barrado aqui NÃO recebe sucesso, ao contrário do contato: sucesso
   * neste formulário é uma URL de download, e entregá-la seria abrir o
   * material. Erro genérico, sem dizer o porquê. */
  if (!veredito.ok) return { ok: false, erro: ERRO }
  const cabecalhos = await headers()
  if (excedeuPorIp(ipDe(cabecalhos))) return { ok: false, erro: ERRO }

  const id = Number(texto(dados, 'resourceId', 30))
  if (!Number.isFinite(id) || id <= 0) return { ok: false, erro: ERRO }

  const payload = await getPayload()
  const material = await payload.findByID({ collection: 'resources', id, depth: 1 }).catch(() => null)
  const arquivo = material?.file
  if (
    !material ||
    material._status !== 'published' ||
    typeof arquivo !== 'object' ||
    !arquivo?.filename
  ) {
    /* Sem arquivo não há o que liberar — e a página nem mostra o formulário
     * neste estado. Chegar aqui é requisição montada à mão. */
    return { ok: false, erro: ERRO }
  }

  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        kind: 'material-download',
        email,
        name: texto(dados, 'name') || undefined,
        company: texto(dados, 'company') || undefined,
        resource: material.id,
        status: 'new',
        notified: false,
      },
    })
  } catch (e) {
    console.error('[material] não gravou o lead:', e)
    return { ok: false, erro: ERRO }
  }

  try {
    return { ok: true, url: await urlAssinadaDoPrivado(arquivo.filename) }
  } catch (e) {
    console.error('[material] não assinou a URL:', e)
    return { ok: false, erro: ERRO }
  }
}
