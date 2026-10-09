/* O consentimento de cookies do visitante (MIG-151, D-30).
 *
 * ⚠️ **Cookie de primeira parte, não localStorage.** A preferência precisa
 * sobreviver ao fechamento da aba ("persistida e revogável", MIG-109), aparece
 * em DevTools/auditoria como um cookie deve aparecer, e um dia o servidor pode
 * lê-la. O cookie em si é estritamente necessário — guardar "não quero
 * cookies" exige um cookie, e é o único isento de consentimento (D-30).
 *
 * ⚠️ **Versionado.** Se as categorias mudarem (uma nova, uma reclassificada),
 * subir `VERSAO_DE_CONSENTIMENTO` invalida todo consentimento antigo e o
 * banner reaparece — consentimento dado para outra pergunta não vale para a
 * pergunta nova.
 *
 * ⚠️ Tudo em try/catch, como `guardarUtm`: `document.cookie` lança em
 * contextos raros, e perder a preferência é aceitável; derrubar a página por
 * causa dela, não.
 *
 * As ilhas conversam por CustomEvent no `window` — o repositório não tem
 * provider global e um estado React compartilhado exigiria criar um. Quem
 * grava anuncia (`anunciarConsentimento`); quem depende ouve
 * (`aoMudarConsentimento`): a captura de UTM efetiva ou limpa, o GTM injeta ou
 * nega. */

export const COOKIE_DE_CONSENTIMENTO = 'atra-consent'
/* 2 desde a D-40 (27/09): marketing passou a incluir a Lusha, que identifica
 * a empresa da visita. Quem aceitou marketing quando ela era só a UTM aceitou
 * outra coisa — o aviso pergunta de novo.
 * 3 desde a D-54 (02/10): marketing passou a incluir o monitoramento do RD
 * Station Marketing, que acompanha a navegação do visitante entre páginas e a
 * amarra ao lead. Mesmo raciocínio: pergunta de novo. */
export const VERSAO_DE_CONSENTIMENTO = 3
/** ~6 meses. Vencido, o banner volta a perguntar. */
export const VALIDADE_EM_SEGUNDOS = 180 * 24 * 60 * 60

export const EVENTO_CONSENTIMENTO = 'atra:consentimento'
export const EVENTO_ABRIR_PREFERENCIAS = 'atra:abrir-preferencias'

export type Consentimento = {
  v: number
  analytics: boolean
  marketing: boolean
  /** Quando o visitante respondeu — prova de consentimento, não telemetria. */
  ts: number
}

/** Parse puro da string de cookies, para teste. Qualquer coisa fora do
 * contrato — versão diferente, campo faltando, JSON quebrado — devolve `null`
 * e o banner volta a perguntar, que é o comportamento seguro. */
export function consentimentoDeCookieString(cookies: string): Consentimento | null {
  const cru = cookies
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_DE_CONSENTIMENTO}=`))
    ?.slice(COOKIE_DE_CONSENTIMENTO.length + 1)
  if (!cru) return null

  try {
    const lido = JSON.parse(decodeURIComponent(cru)) as Record<string, unknown>
    if (lido.v !== VERSAO_DE_CONSENTIMENTO) return null
    if (typeof lido.analytics !== 'boolean' || typeof lido.marketing !== 'boolean') return null
    return {
      v: VERSAO_DE_CONSENTIMENTO,
      analytics: lido.analytics,
      marketing: lido.marketing,
      ts: typeof lido.ts === 'number' ? lido.ts : 0,
    }
  } catch {
    return null
  }
}

export function lerConsentimento(): Consentimento | null {
  try {
    return consentimentoDeCookieString(document.cookie)
  } catch {
    return null
  }
}

export function gravarConsentimento(escolha: { analytics: boolean; marketing: boolean }): Consentimento | null {
  const consentimento: Consentimento = { v: VERSAO_DE_CONSENTIMENTO, ...escolha, ts: Date.now() }
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${COOKIE_DE_CONSENTIMENTO}=${encodeURIComponent(JSON.stringify(consentimento))}; Max-Age=${VALIDADE_EM_SEGUNDOS}; Path=/; SameSite=Lax${secure}`
    return consentimento
  } catch {
    return null
  }
}

export function anunciarConsentimento(consentimento: Consentimento): void {
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMENTO, { detail: consentimento }))
  } catch {
    /* sem window (SSR) não há quem ouvir */
  }
}

/** Assina a mudança de consentimento; devolve o cancelamento (para o cleanup
 * do useEffect). */
export function aoMudarConsentimento(cb: (c: Consentimento) => void): () => void {
  const ouvinte = (e: Event) => {
    const detalhe = (e as CustomEvent<Consentimento>).detail
    if (detalhe) cb(detalhe)
  }
  window.addEventListener(EVENTO_CONSENTIMENTO, ouvinte)
  return () => window.removeEventListener(EVENTO_CONSENTIMENTO, ouvinte)
}

export function pedirPreferencias(): void {
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_PREFERENCIAS))
  } catch {
    /* idem */
  }
}
