/* O que os três lados do Sentry (servidor, edge e navegador) compartilham.
 *
 * ⚠️ Sem DSN o SDK é inerte: `init` com `dsn` vazio não abre conexão nem
 * guarda evento. É assim que o CI, o dev local e o container do gate rodam —
 * o código de observabilidade existe, o envio só liga quando a variável
 * aparece no `.env.prod` (MIG-122, D-46). */

export type AmbienteDoSentry = 'producao' | 'homologacao' | 'local'

/* O nome do ambiente sai da URL do site, e não de uma variável própria, para
 * não existir um terceiro lugar que precisa concordar com `SITE_URL`: o
 * domínio real é produção; qualquer outro hostname público é homologação. */
export function ambienteDoSentry(siteUrl: string | undefined): AmbienteDoSentry {
  let host = ''
  try {
    host = new URL(siteUrl ?? '').hostname
  } catch {
    return 'local'
  }
  if (host === 'atra.com.br' || host === 'www.atra.com.br') return 'producao'
  if (host === 'localhost' || host === '127.0.0.1' || host === '') return 'local'
  return 'homologacao'
}

/* Ruído conhecido de navegador que não é erro do site: extensão injetando
 * script, `ResizeObserver` avisando que vai repetir o ciclo, rejeição sem
 * objeto de erro (código de terceiros). Filtrar aqui é o que a spec pede em
 * "Filtros" — cada um destes já encheu um projeto de Sentry em outro lugar. */
export const ERROS_IGNORADOS = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications',
  'Non-Error promise rejection captured',
  /^Loading chunk \d+ failed/,
  /^Loading CSS chunk/,
]
export const URLS_IGNORADAS = [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-(web-)?extension:\/\//]

type EventoMinimo = {
  request?: { data?: unknown; cookies?: unknown; headers?: Record<string, string> }
  exception?: { values?: { stacktrace?: { frames?: { filename?: string }[] } }[] }
}

/* ⚠️ PII: a spec proíbe mandar corpo de formulário ou conversa do chat. O
 * `sendDefaultPii` que ela cita deixou de existir no SDK 11 — o padrão já é
 * não mandar IP nem cookies. O que sobra é o SDK do servidor anexando a
 * requisição ao evento; o corpo e os cookies saem antes de ir. Cabeçalhos ficam sem `cookie` e `authorization` pelo mesmo motivo. Vale
 * nos três lados — no navegador não há `request.data`, e a função é inócua. */
export function semDadoPessoal<E extends EventoMinimo>(evento: E): E {
  if (evento.request) {
    delete evento.request.data
    delete evento.request.cookies
    if (evento.request.headers) {
      delete evento.request.headers.cookie
      delete evento.request.headers.authorization
    }
  }
  return evento
}

/* Evento cujo rastro inteiro vem de extensão de navegador não é do site:
 * descartado (`null`) em vez de só filtrado por URL, porque o `denyUrls` do
 * SDK olha a URL do script que lançou, e extensão às vezes lança de dentro do
 * nosso bundle via `postMessage`. */
export function vemDeExtensao(evento: EventoMinimo): boolean {
  const frames = evento.exception?.values?.flatMap((v) => v.stacktrace?.frames ?? []) ?? []
  return frames.length > 0 && frames.every((f) => URLS_IGNORADAS.some((re) => re.test(f.filename ?? '')))
}
