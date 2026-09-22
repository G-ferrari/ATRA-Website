/* MIG-102 — sincronização do Banco de Talentos com o ATRAIR (sistema de R&S da ATRA).
 *
 * ⚠️ HTTP puro, sem SDK — a mesma escolha do `crm.ts`: uma chamada `fetch`
 * não justifica dependência nova.
 *
 * ⚠️ **Sem as envs, não sincroniza e não falha.** A candidatura já está no
 * Postgres quando isto roda (grava primeiro, sincroniza depois — D-26 vale
 * aqui também); a falta fica no log do servidor, nunca vira erro para o
 * candidato que acabou de enviar o currículo.
 *
 * ⚠️ Currículo é dado de RH, não lead comercial (D-29): o destino é o ATRAIR,
 * não o CRM. O ATRAIR deduplica por e-mail do lado de lá — reenviar o mesmo
 * candidato atualiza o cadastro em vez de duplicar.
 *
 * ⚠️ `ATRAIR_API_KEY` **sem** `NEXT_PUBLIC_`: chave de servidor (regra 7,
 * o CI reprova o prefixo junto de `KEY`).
 */

const TIMEOUT_MS = 8_000

/** O que o endpoint público do ATRAIR (`POST /api/public/talent-pool`) aceita. */
export type CandidaturaParaAtrair = {
  name: string
  email: string
  phone?: string
  linkedinUrl?: string
  /** Valor do select como está na página (pt ou en — o ATRAIR normaliza). */
  area?: string
  senioridade?: string
  source?: string
  /** Vaga escolhida no formulário. Sem ela, a candidatura fica no banco geral. */
  vagaId?: number
}

/** Uma vaga aberta, como o ATRAIR a publica. Sem valores e sem o cliente. */
export type VagaAberta = {
  id: number
  cargo: string
  descricao: string
  modeloDeTrabalho: string | null
  tipoDeContrato: string | null
  senioridade: string | null
  tags: string[]
  posicoes: number
  inicioPrevisto: string | null
  publicadaEm: string | null
}

/**
 * Lê o campo de vaga do formulário, que vem como `id::cargo` num valor só.
 *
 * ⚠️ São dois dados num campo porque o formulário funciona **sem JavaScript**
 * (ver `forms/formulario.tsx`): não dá para preencher um campo escondido com o
 * título no clique do select. O id vai para o ATRAIR, que decide em que fila a
 * pessoa entra; o cargo vai para o admin do site, onde quem lê precisa do nome
 * da vaga, não de um número.
 *
 * ⚠️ Corta no PRIMEIRO `::` e leva o resto como cargo — um cargo com `::` no
 * nome é improvável, mas perder metade dele seria pior. Id que não é inteiro
 * positivo vira `undefined`: quem posta o formulário não é obrigado a ser o
 * nosso HTML.
 */
export function lerVagaEscolhida(valor: string): { id?: number; cargo?: string } {
  const corte = valor.indexOf('::')
  if (corte < 0) return {}
  const id = Number(valor.slice(0, corte))
  const cargo = valor.slice(corte + 2).trim()
  return {
    id: Number.isInteger(id) && id > 0 ? id : undefined,
    cargo: cargo || undefined,
  }
}

/* Quanto tempo a lista fica em cache. Vaga não abre de minuto em minuto, e a
 * página de carreiras é estática: sem isto, ou o build congela a lista, ou toda
 * visita bate no ATRAIR. */
const CACHE_SEGUNDOS = 300

/**
 * As vagas abertas no ATRAIR, para o candidato escolher no formulário.
 *
 * ⚠️ **Nunca lança e nunca deixa a página cair.** Sem as envs, com o ATRAIR
 * fora do ar ou com a chave errada, devolve lista vazia — e o formulário volta
 * a ser o que era, um envio para o banco de talentos geral. A página de
 * carreiras não pode deixar de existir porque outro sistema está fora.
 */
export async function buscarVagasAbertas(): Promise<VagaAberta[]> {
  const base = process.env.ATRAIR_API_URL
  const chave = process.env.ATRAIR_API_KEY
  if (!base || !chave) {
    console.warn('[atrair] ATRAIR_API_URL/ATRAIR_API_KEY ausentes — formulário sem lista de vagas')
    return []
  }

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/public/vagas`, {
      headers: { 'x-api-key': chave },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CACHE_SEGUNDOS },
    })
    if (!r.ok) {
      console.error('[atrair] não devolveu as vagas:', r.status, await r.text().catch(() => ''))
      return []
    }
    const corpo = (await r.json()) as { vagas?: unknown }
    if (!Array.isArray(corpo?.vagas)) {
      console.error('[atrair] resposta de vagas fora do formato esperado')
      return []
    }
    /* ⚠️ Só o que tem id e cargo entra. Vaga sem cargo viraria uma opção em
     * branco no select, e o candidato não saberia ao que se candidatou. */
    return (corpo.vagas as VagaAberta[]).filter((v) => Number.isInteger(v?.id) && !!v?.cargo?.trim())
  } catch (e) {
    console.error('[atrair] falhou ao buscar vagas:', e)
    return []
  }
}

export async function enviarParaAtrair(candidatura: CandidaturaParaAtrair): Promise<boolean> {
  const base = process.env.ATRAIR_API_URL
  const chave = process.env.ATRAIR_API_KEY
  if (!base || !chave) {
    console.warn('[atrair] ATRAIR_API_URL/ATRAIR_API_KEY ausentes — candidatura não sincronizada')
    return false
  }

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/public/talent-pool`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': chave },
      body: JSON.stringify(candidatura),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!r.ok) {
      console.error('[atrair] recusou a candidatura:', r.status, await r.text().catch(() => ''))
      return false
    }
    return true
  } catch (e) {
    /* ⚠️ Nunca propaga: a candidatura já está no banco e visível no admin. */
    console.error('[atrair] falhou:', e)
    return false
  }
}
