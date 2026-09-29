/* MIG-102 / D-33 / D-41 — integração com o ATRAIR (sistema de R&S da ATRA).
 *
 * ⚠️ HTTP puro, sem SDK — a mesma escolha do `crm.ts`: duas chamadas `fetch`
 * não justificam dependência nova.
 *
 * ⚠️ **Nada aqui lê o ambiente para decidir se roda.** Desde a D-41 quem decide
 * é o CMS: as duas funções recebem a `IntegracaoAtrair` resolvida por
 * `lerIntegracaoAtrair()` (global `integrations`), e o endereço já vem validado
 * e sem barra final. O ambiente guarda **só a credencial** — `ATRAIR_API_KEY`,
 * que é a segunda tranca: chave ligada no CMS sem credencial no servidor segue
 * inerte, e é isso que fez a D-41 não mudar o que estava no ar.
 *
 * ⚠️ `ATRAIR_API_KEY` **sem** `NEXT_PUBLIC_`: chave de servidor (regra 7, o CI
 * reprova o prefixo junto de `KEY`).
 *
 * ⚠️ Currículo é dado de RH, não lead comercial (D-29): o destino é o ATRAIR,
 * não o CRM. O ATRAIR deduplica por e-mail do lado de lá — reenviar o mesmo
 * candidato atualiza o cadastro em vez de duplicar.
 */

import type { IntegracaoAtrair } from '@/types/content'

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
}

/** Uma vaga publicada, como o ATRAIR a entrega. Sem valores e sem o cliente. */
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
  /** Endereço da página da vaga NO ATRAIR — é para lá que o card leva. */
  url: string
}

/**
 * De onde a grade de `/carreiras` vai tirar as vagas.
 *
 * ⚠️ É o tipo que a D-41 existe para criar. Antes esta função devolvia
 * `VagaAberta[]`, e `[]` queria dizer **três** coisas incompatíveis:
 * integração desligada, ATRAIR fora do ar, e ATRAIR respondendo que não há
 * vaga aberta. As duas primeiras querem a lista do CMS na tela; a terceira
 * quer a página vazia, porque o ATRAIR é a fonte da verdade quando está
 * ligado — e uma vaga fechada lá reaparecendo pela lista antiga do CMS é pior
 * do que uma página que diz "nenhuma vaga aberta".
 *
 * Logo: `fonte: 'atrair'` com `vagas: []` é resposta legítima e mostra o vazio.
 * `fonte: 'cms'` é "não conseguimos perguntar" — e aí o CMS assume.
 */
export type ResultadoDeVagas =
  | { fonte: 'atrair'; vagas: VagaAberta[] }
  | { fonte: 'cms'; motivo: 'desligado' | 'sem-endereco' | 'sem-credencial' | 'falhou' }

/* Quanto tempo a lista fica em cache. Vaga não abre de minuto em minuto, e a
 * página de carreiras é estática: sem isto, ou o build congela a lista, ou toda
 * visita bate no ATRAIR. */
const CACHE_SEGUNDOS = 300

/**
 * As vagas publicadas no ATRAIR, para a grade da página de carreiras.
 *
 * ⚠️ **Nunca lança e nunca deixa a página cair.** Com o ATRAIR fora do ar, com
 * a chave errada ou com a integração desligada no CMS, devolve `fonte: 'cms'`
 * — e a grade cai para a lista da collection `jobs`. A página de carreiras não
 * pode deixar de existir porque outro sistema está fora.
 */
export async function buscarVagasAbertas(integracao: IntegracaoAtrair): Promise<ResultadoDeVagas> {
  /* A chave do CMS vem primeiro: desligada, o site não chama o ATRAIR nem para
   * saber se ele está de pé. Desligar tem efeito imediato — não espera o cache
   * de 5 min abaixo, porque não há `fetch` a cachear. */
  if (!integracao.vagas) return { fonte: 'cms', motivo: 'desligado' }
  if (!integracao.endpoint) {
    console.warn('[atrair] sem endereço no global `integrations` — grade de vagas cai para o CMS')
    return { fonte: 'cms', motivo: 'sem-endereco' }
  }
  const chave = process.env.ATRAIR_API_KEY
  if (!chave) {
    console.warn('[atrair] ATRAIR_API_KEY ausente — grade de vagas cai para o CMS')
    return { fonte: 'cms', motivo: 'sem-credencial' }
  }

  try {
    /* `integracao.endpoint` já vem sem barra final, aparado pelo mapper — ver o
     * ⚠️ da barra dupla em `mappers/integracao.ts`. */
    const r = await fetch(`${integracao.endpoint}/api/public/vagas`, {
      headers: { 'x-api-key': chave },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CACHE_SEGUNDOS },
    })
    if (!r.ok) {
      console.error('[atrair] não devolveu as vagas:', r.status, await r.text().catch(() => ''))
      return { fonte: 'cms', motivo: 'falhou' }
    }
    const corpo = (await r.json()) as { vagas?: unknown }
    if (!Array.isArray(corpo?.vagas)) {
      console.error('[atrair] resposta de vagas fora do formato esperado')
      return { fonte: 'cms', motivo: 'falhou' }
    }
    /* ⚠️ Só o que tem id, cargo e endereço entra. Card sem cargo não diz ao
     * que a pessoa se candidata, e card sem `url` não leva a lugar nenhum —
     * os dois são pior do que uma vaga a menos na lista.
     *
     * ⚠️ Filtrar até sobrar zero continua sendo `fonte: 'atrair'`: o ATRAIR
     * respondeu. Cair para o CMS aqui esconderia um defeito de formato no
     * outro lado atrás de uma lista que parece certa. */
    const vagas = (corpo.vagas as VagaAberta[]).filter(
      (v) => Number.isInteger(v?.id) && !!v?.cargo?.trim() && !!v?.url?.trim(),
    )
    return { fonte: 'atrair', vagas }
  } catch (e) {
    console.error('[atrair] falhou ao buscar vagas:', e)
    return { fonte: 'cms', motivo: 'falhou' }
  }
}

/**
 * Cria no ATRAIR quem se inscreveu no Banco de Talentos.
 *
 * ⚠️ **Melhor esforço, nunca propaga.** A inscrição já está no Postgres quando
 * isto roda (grava primeiro, sincroniza depois — D-26 vale aqui também); a
 * falha fica no log do servidor e nunca vira erro para quem acabou de enviar o
 * currículo. `false` quer dizer "não sincronizou", não "não gravou".
 */
export async function enviarParaAtrair(
  candidatura: CandidaturaParaAtrair,
  integracao: IntegracaoAtrair,
): Promise<boolean> {
  /* Chave própria, separada da das vagas (D-41): a ida do currículo e a vinda
   * das vagas quebram por motivos diferentes e se desligam em momentos
   * diferentes. */
  if (!integracao.bancoDeTalentos) return false
  if (!integracao.endpoint) {
    console.warn('[atrair] sem endereço no global `integrations` — candidatura não sincronizada')
    return false
  }
  const chave = process.env.ATRAIR_API_KEY
  if (!chave) {
    console.warn('[atrair] ATRAIR_API_KEY ausente — candidatura não sincronizada')
    return false
  }

  try {
    const r = await fetch(`${integracao.endpoint}/api/public/talent-pool`, {
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
