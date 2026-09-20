/* MIG-148 — sincronização de leads com o RD Station CRM (D-26).
 *
 * ⚠️ Pelo HTTP puro, sem SDK — a mesma escolha do `email.ts`: três chamadas
 * `fetch` não justificam uma dependência nova.
 *
 * ⚠️ **Sem token, não sincroniza e não falha.** O lead já está no Postgres
 * quando isto roda (D-26: grava primeiro, sincroniza depois), e a falta fica
 * visível no admin — `crm.syncedAt` vazio — em vez de virar erro para quem
 * acabou de enviar o formulário.
 *
 * ⚠️ `RDSTATION_CRM_TOKEN` **sem** `NEXT_PUBLIC_`: chave de servidor (regra 7,
 * o CI reprova o prefixo junto de `TOKEN`).
 *
 * ⚠️ O contrato externo (token via query string, `GET /contacts?email=`,
 * `POST /contacts`, `POST /deals` com `deal.name` + array `contacts`) vem de
 * developers.rdstation.com. O formato **fino** dos corpos varia por conta
 * (etapa de funil, campos customizados) e é validado no lead de ponta a ponta
 * em homologação — uma recusa da API vira `{ ok: false }` com log, nunca
 * exceção, e o lead fica retentável no admin.
 */

const BASE = 'https://crm.rdstation.com/api/v1'
const TIMEOUT_MS = 8_000

/** O recorte de `form-submissions` que a sincronização lê. Estrutural de
 * propósito: o hook passa o doc do Payload, os testes passam objetos crus. */
export type LeadParaCrm = {
  kind: string
  email: string
  name?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  source?: string | null
  /** Só o kind `chat-lead` (MIG-149) preenche. */
  chatContext?: string | null
  confirmedAt?: string | null
  utm?: {
    source?: string | null
    medium?: string | null
    campaign?: string | null
    term?: string | null
    content?: string | null
  } | null
  crm?: {
    contactId?: string | null
    dealId?: string | null
    syncedAt?: string | null
    error?: string | null
  } | null
}

export type ResultadoDaSincronizacao =
  | { ok: true; contactId: string; dealId: string }
  /** `contactId` presente quando o contato foi criado mas a negociação não:
   * gravá-lo é o que impede o retry de criar um contato duplicado (D-26). */
  | { ok: false; motivo: string; contactId?: string }

/* ⚠️ Só lead de **vendas** vai ao CRM. `job-application` e `talent-pool` são
 * dado de RH — currículo dentro de pipeline comercial seria vazamento de
 * finalidade (LGPD), não integração. Se a ATRA quiser o banco de talentos lá,
 * é decisão dela, não default nosso (D-29). */
const KINDS_COMERCIAIS = new Set([
  'contact',
  'chat-lead',
  'material-download',
  'rc18-diagnostic',
  'consultant-request',
])

/**
 * Se este doc deve ir ao CRM **agora**. Pura, para a matriz de teste.
 *
 * A regra de retry mora aqui: `syncedAt` vazio deixa qualquer escrita
 * posterior — o `notified` da action, um "lido" no admin — tentar de novo.
 * Newsletter só entra confirmada (MIG-103): pendente não é inscrito, muito
 * menos lead.
 */
export function deveSincronizar(doc: LeadParaCrm): boolean {
  if (doc.crm?.syncedAt) return false
  if (doc.kind === 'newsletter') return Boolean(doc.confirmedAt)
  return KINDS_COMERCIAIS.has(doc.kind)
}

export async function sincronizarLead(doc: LeadParaCrm): Promise<ResultadoDaSincronizacao> {
  const token = process.env.RDSTATION_CRM_TOKEN
  if (!token) return { ok: false, motivo: 'RDSTATION_CRM_TOKEN ausente' }

  /* Idempotência em dois degraus: id já gravado nunca é recriado. */
  const contactId =
    doc.crm?.contactId || (await acharContato(token, doc.email)) || (await criarContato(token, doc))
  if (!contactId) return { ok: false, motivo: 'contato não encontrado nem criado' }

  const dealId = doc.crm?.dealId || (await criarNegociacao(token, doc, contactId))
  if (!dealId) return { ok: false, motivo: 'negociação não criada', contactId }

  /* Melhor esforço: a anotação dá ao comercial o que o lead escreveu, mas a
   * sincronização não depende dela. */
  await anotar(token, dealId, doc)

  return { ok: true, contactId, dealId }
}

const ROTULO: Record<string, string> = {
  contact: 'Contato pelo site',
  'chat-lead': 'Lead do chat (ATRA AI)',
  'material-download': 'Download de material',
  'rc18-diagnostic': 'Diagnóstico RC 18/2025',
  'consultant-request': 'Solicitação de consultores',
  newsletter: 'Inscrição na newsletter',
}

async function acharContato(token: string, email: string): Promise<string | null> {
  const json = await chamar(token, 'GET', `/contacts?email=${encodeURIComponent(email)}&limit=1`)
  const lista = (json?.contacts ?? json?.data) as unknown
  if (!Array.isArray(lista) || lista.length === 0) return null
  return idDe(lista[0])
}

async function criarContato(token: string, doc: LeadParaCrm): Promise<string | null> {
  const json = await chamar(token, 'POST', '/contacts', {
    contact: {
      /* A API exige nome (mínimo 2 chars); quem não disse o seu entra pelo
       * e-mail — melhor um contato "estranho" no CRM que um lead perdido. */
      name: doc.name?.trim() || doc.email,
      emails: [{ email: doc.email }],
      ...(doc.phone ? { phones: [{ phone: doc.phone, type: 'work' }] } : {}),
      /* `company` não vira organização aqui: criar organização pede outro
       * recurso e um id — a empresa entra no nome da negociação e na anotação. */
    },
  })
  return json ? idDe(json) : null
}

async function criarNegociacao(token: string, doc: LeadParaCrm, contactId: string): Promise<string | null> {
  /* Etapa do funil é id da conta, não constante da API. Sem a env, a conta
   * decide o padrão. */
  const etapa = process.env.RDSTATION_CRM_DEAL_STAGE_ID
  const quem = doc.company?.trim() || doc.name?.trim() || doc.email
  const json = await chamar(token, 'POST', '/deals', {
    deal: {
      name: `${ROTULO[doc.kind] ?? 'Lead do site'} — ${quem}`,
      ...(etapa ? { deal_stage_id: etapa } : {}),
    },
    contacts: [{ _id: contactId }],
  })
  return json ? idDe(json) : null
}

async function anotar(token: string, dealId: string, doc: LeadParaCrm): Promise<void> {
  const texto = [
    doc.message && `Mensagem: ${doc.message}`,
    doc.chatContext && `O que perguntou à ATRA AI:\n${doc.chatContext}`,
    doc.source && `Converteu em: ${doc.source}`,
    doc.utm?.source && `Origem: ${doc.utm.source}${doc.utm.medium ? ` / ${doc.utm.medium}` : ''}`,
    doc.utm?.campaign && `Campanha: ${doc.utm.campaign}`,
  ]
    .filter(Boolean)
    .join('\n')
  if (!texto) return
  await chamar(token, 'POST', '/activities', { activity: { deal_id: dealId, text: texto } })
}

/* A API devolve o id ora como `_id`, ora como `id`, ora aninhado no recurso —
 * este funil aceita qualquer um e devolve string ou nada. */
function idDe(valor: unknown): string | null {
  if (!valor || typeof valor !== 'object') return null
  const o = valor as Record<string, unknown>
  const bruto = o._id ?? o.id ?? idDe(o.contact) ?? idDe(o.deal)
  return typeof bruto === 'string' && bruto ? bruto : null
}

async function chamar(
  token: string,
  metodo: 'GET' | 'POST',
  caminho: string,
  corpo?: unknown,
): Promise<Record<string, unknown> | null> {
  const separador = caminho.includes('?') ? '&' : '?'
  try {
    const r = await fetch(`${BASE}${caminho}${separador}token=${encodeURIComponent(token)}`, {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      ...(corpo === undefined ? {} : { body: JSON.stringify(corpo) }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!r.ok) {
      console.error('[crm] RD Station recusou:', metodo, caminho, r.status, await r.text().catch(() => ''))
      return null
    }
    return (await r.json()) as Record<string, unknown>
  } catch (e) {
    /* ⚠️ Nunca propaga: o lead já está no banco, e o retry é gratuito —
     * qualquer escrita com `syncedAt` vazio tenta de novo. */
    console.error('[crm] falhou:', metodo, caminho, e)
    return null
  }
}
