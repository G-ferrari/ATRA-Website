/* MIG-080 — cliente da API REST do WordPress da ATRA.
 *
 * Fundação de MIG-081 a MIG-086: paginação genérica (posts, pages, media,
 * categories), retry com backoff e cache em disco. Nada daqui pode ser
 * importado por `src/` — é ferramenta de importação, não código de aplicação.
 *
 * Rodar quem usa com: pnpm exec tsx scripts/wp-import/<arquivo>.ts
 * (o strip de tipos do Node não resolve import de TS sem extensão) */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { WP_API, WP_USER_AGENT, type WpMedia, type WpPage, type WpPost, type WpTerm } from './types'

export type WpParamValue = string | number | boolean | Array<string | number> | undefined

export type WpParams = Record<string, WpParamValue>

/** `off` ignora o cache; `refresh` rebaixa tudo e regrava. */
export type CacheMode = 'read-write' | 'refresh' | 'off'

export type WpClientOptions = {
  baseUrl?: string
  userAgent?: string
  /** 100 é o teto do WP; pedir mais devolve 400. */
  perPage?: number
  /** Tentativas totais, não retentativas: 1 desliga o retry. */
  maxAttempts?: number
  backoffMs?: number
  maxBackoffMs?: number
  timeoutMs?: number
  /** `null` desliga o cache em disco. */
  cacheDir?: string | null
  cacheMode?: CacheMode
  /** Idade máxima de uma entrada do cache; `undefined` = nunca expira. */
  cacheMaxAgeMs?: number
  fetchImpl?: typeof fetch
  sleep?: (ms: number) => Promise<void>
  log?: (linha: string) => void
}

export type WpPageResult<T> = {
  items: T[]
  /** `X-WP-Total` — total de itens da consulta, não da página. */
  total: number
  /** `X-WP-TotalPages` — a fonte da parada da paginação. */
  totalPages: number
  page: number
}

export type WpBinary = {
  url: string
  bytes: Buffer
  contentType: string | null
}

/** Resposta HTTP que o WP recusou responder — carrega o `code` do WP quando vem. */
export class WpHttpError extends Error {
  readonly status: number
  readonly url: string
  readonly code?: string
  readonly attempts: number

  constructor(args: { status: number; url: string; code?: string; attempts: number; message: string }) {
    super(args.message)
    this.name = 'WpHttpError'
    this.status = args.status
    this.url = args.url
    this.code = args.code
    this.attempts = args.attempts
  }
}

/** Falhou em todas as tentativas por rede/timeout — nunca chegou a ter status. */
export class WpNetworkError extends Error {
  readonly url: string
  readonly attempts: number

  constructor(args: { url: string; attempts: number; cause: unknown }) {
    super(`falha de rede em ${args.url} após ${args.attempts} tentativa(s): ${descrever(args.cause)}`)
    this.name = 'WpNetworkError'
    this.url = args.url
    this.attempts = args.attempts
    this.cause = args.cause
  }
}

const PADRAO = {
  baseUrl: WP_API,
  userAgent: WP_USER_AGENT,
  perPage: 100,
  maxAttempts: 4,
  backoffMs: 500,
  maxBackoffMs: 15_000,
  timeoutMs: 30_000,
  // Ancorado no módulo, não no cwd: um script rodado de outra pasta escreveria
  // um `.cache/` novo lá e baixaria os 207 posts de novo achando que era miss.
  cacheDir: join(dirname(fileURLToPath(import.meta.url)), '.cache'),
  cacheMode: 'read-write' as CacheMode,
}

type EntradaDeCache = {
  url: string
  fetchedAt: string
  total: number
  totalPages: number
  body: unknown
}

export class WpClient {
  private readonly opcoes: Required<Omit<WpClientOptions, 'cacheMaxAgeMs'>> & { cacheMaxAgeMs?: number }

  constructor(options: WpClientOptions = {}) {
    this.opcoes = {
      baseUrl: (options.baseUrl ?? PADRAO.baseUrl).replace(/\/$/, ''),
      userAgent: options.userAgent ?? PADRAO.userAgent,
      perPage: options.perPage ?? PADRAO.perPage,
      maxAttempts: options.maxAttempts ?? PADRAO.maxAttempts,
      backoffMs: options.backoffMs ?? PADRAO.backoffMs,
      maxBackoffMs: options.maxBackoffMs ?? PADRAO.maxBackoffMs,
      timeoutMs: options.timeoutMs ?? PADRAO.timeoutMs,
      cacheDir: options.cacheDir === undefined ? PADRAO.cacheDir : options.cacheDir,
      cacheMode: options.cacheMode ?? modoDoAmbiente() ?? PADRAO.cacheMode,
      cacheMaxAgeMs: options.cacheMaxAgeMs,
      fetchImpl: options.fetchImpl ?? globalThis.fetch.bind(globalThis),
      sleep: options.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms))),
      log: options.log ?? ((linha) => console.warn(linha)),
    }
  }

  /** URL absoluta de um recurso, com os parâmetros já serializados. */
  url(resource: string, params: WpParams = {}): string {
    const u = new URL(`${this.opcoes.baseUrl}/${resource.replace(/^\//, '')}`)
    for (const [chave, valor] of Object.entries(params)) {
      if (valor === undefined) continue
      u.searchParams.set(chave, Array.isArray(valor) ? valor.join(',') : String(valor))
    }
    return u.toString()
  }

  /** Uma requisição JSON, com retry e cache. Use para rotas fora do padrão de coleção. */
  async fetchJson<T>(resource: string, params: WpParams = {}): Promise<T> {
    const { body } = await this.pedirJson(this.url(resource, params))
    return body as T
  }

  /** Uma página de uma coleção, com os totais que o WP manda no header. */
  async fetchPage<T>(resource: string, page = 1, params: WpParams = {}): Promise<WpPageResult<T>> {
    const url = this.url(resource, { per_page: this.opcoes.perPage, ...params, page })
    const { body, total, totalPages } = await this.pedirJson(url)
    return { items: (body ?? []) as T[], total, totalPages, page }
  }

  /**
   * Percorre a coleção inteira.
   *
   * ⚠️ A parada é o header `X-WP-TotalPages`, não o tamanho do lote. Em
   * `media` a primeira página do site da ATRA volta com 99 itens de 100 —
   * o WP conta em `X-WP-Total` anexos que depois esconde por permissão. A
   * heurística `lote.length < per_page` pararia ali e importaria 99 de 541.
   */
  async fetchAll<T>(resource: string, params: WpParams = {}): Promise<T[]> {
    const primeira = await this.fetchPage<T>(resource, 1, params)
    const itens = [...primeira.items]
    for (let pagina = 2; pagina <= primeira.totalPages; pagina++) {
      const lote = await this.fetchPage<T>(resource, pagina, params)
      itens.push(...lote.items)
    }
    // Diferença é esperada em `media` (anexos escondidos por permissão) e
    // suspeita em qualquer outra coleção — avisar é mais barato que descobrir
    // depois que a importação entrou incompleta.
    if (itens.length !== primeira.total) {
      this.opcoes.log(`wp: ${resource} devolveu ${itens.length} itens para X-WP-Total = ${primeira.total}`)
    }
    return itens
  }

  /** Quantos itens a consulta tem, sem baixar a coleção. */
  async count(resource: string, params: WpParams = {}): Promise<number> {
    const { total } = await this.fetchPage(resource, 1, { ...params, per_page: 1, _fields: 'id' })
    return total
  }

  posts(params: WpParams = {}): Promise<WpPost[]> {
    return this.fetchAll<WpPost>('posts', params)
  }

  /** Inclui as 6 vagas — no WP da ATRA elas são páginas comuns (P-02). */
  pages(params: WpParams = {}): Promise<WpPage[]> {
    return this.fetchAll<WpPage>('pages', params)
  }

  media(params: WpParams = {}): Promise<WpMedia[]> {
    return this.fetchAll<WpMedia>('media', params)
  }

  categories(params: WpParams = {}): Promise<WpTerm[]> {
    return this.fetchAll<WpTerm>('categories', params)
  }

  tags(params: WpParams = {}): Promise<WpTerm[]> {
    return this.fetchAll<WpTerm>('tags', params)
  }

  /**
   * Baixa um binário (imagem de `source_url`, para MIG-082) com o mesmo retry.
   *
   * ⚠️ A URL vem inteira do WP e aponta para `wp-content`, fora de `wp-json` —
   * por isso recebe URL absoluta, e não recurso relativo à `baseUrl`.
   */
  async fetchBinary(url: string): Promise<WpBinary> {
    // Os bytes ficam num arquivo à parte do `.json` de metadados: gravar 287
    // imagens em base64 dentro de JSON incharia o cache e o tornaria inútil
    // para inspeção manual.
    const arquivo = this.caminhoDeCache(url, 'bin')
    if (arquivo && this.opcoes.cacheMode === 'read-write') {
      const meta = lerCache(`${arquivo}.json`, this.opcoes.cacheMaxAgeMs)
      if (meta) {
        try {
          const { contentType } = meta.body as { contentType: string | null }
          return { url, bytes: readFileSync(arquivo), contentType }
        } catch {
          /* metadado sem o arquivo de bytes: trata como miss e rebaixa */
        }
      }
    }

    const res = await this.pedirComRetry(url)
    const bytes = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type')

    if (arquivo && this.opcoes.cacheMode !== 'off') {
      mkdirSync(dirname(arquivo), { recursive: true })
      writeFileSync(arquivo, bytes)
      gravarCache(`${arquivo}.json`, {
        url,
        fetchedAt: new Date().toISOString(),
        total: bytes.length,
        totalPages: 1,
        body: { contentType },
      })
    }
    return { url, bytes, contentType }
  }

  private async pedirJson(url: string): Promise<{ body: unknown; total: number; totalPages: number }> {
    const arquivo = this.caminhoDeCache(url, 'json')
    if (arquivo && this.opcoes.cacheMode === 'read-write') {
      const entrada = lerCache(arquivo, this.opcoes.cacheMaxAgeMs)
      if (entrada) return { body: entrada.body, total: entrada.total, totalPages: entrada.totalPages }
    }

    const res = await this.pedirComRetry(url)
    const texto = await res.text()
    const tipo = res.headers.get('content-type') ?? ''

    // ⚠️ Sem isto um HTML de 200 vira `SyntaxError: Unexpected token '<'`, que
    // não diz nada sobre a causa real (quase sempre user-agent ou rota errada).
    if (!tipo.includes('json')) {
      throw new WpHttpError({
        status: res.status,
        url,
        attempts: 1,
        message: `${url} respondeu ${res.status} com content-type "${tipo}", não JSON: ${texto.slice(0, 120)}`,
      })
    }

    const body: unknown = JSON.parse(texto)
    const total = Number(res.headers.get('x-wp-total') ?? (Array.isArray(body) ? body.length : 1))
    const totalPages = Number(res.headers.get('x-wp-totalpages') ?? 1)

    if (arquivo && this.opcoes.cacheMode !== 'off') {
      gravarCache(arquivo, { url, fetchedAt: new Date().toISOString(), total, totalPages, body })
    }
    return { body, total, totalPages }
  }

  private async pedirComRetry(url: string): Promise<Response> {
    let ultimoErroDeRede: unknown

    for (let tentativa = 1; tentativa <= this.opcoes.maxAttempts; tentativa++) {
      let res: Response
      try {
        res = await this.opcoes.fetchImpl(url, {
          // ⚠️ A API responde 302 sem user-agent de browser (MIG-012): quem
          // hospeda tem um WAF que barra UA de robô e manda para
          // /RUNCLOUD-8G-WAF-BLOCKED. Seguir o redirect entrega HTML com status
          // 200 e o erro só aparece depois, num JSON.parse sem contexto;
          // `manual` transforma isso em falha explícita.
          redirect: 'manual',
          headers: { 'user-agent': this.opcoes.userAgent, accept: 'application/json, */*' },
          signal: AbortSignal.timeout(this.opcoes.timeoutMs),
        })
      } catch (erro) {
        ultimoErroDeRede = erro
        if (tentativa === this.opcoes.maxAttempts) break
        await this.esperar(this.atraso(tentativa), tentativa, url, descrever(erro))
        continue
      }

      if (res.ok) return res

      if (res.status >= 300 && res.status < 400) {
        throw new WpHttpError({
          status: res.status,
          url,
          attempts: tentativa,
          message: `${url} respondeu ${res.status} → ${res.headers.get('location') ?? '?'}. A API do WP redireciona quando o user-agent não é de browser`,
        })
      }

      // Repetir 4xx que não seja 429 (ou 408) só queima tempo: requisição
      // inválida não fica válida na segunda vez.
      const vaiRepetir = res.status >= 500 || res.status === 429 || res.status === 408
      if (!vaiRepetir || tentativa === this.opcoes.maxAttempts) {
        throw new WpHttpError({
          status: res.status,
          url,
          attempts: tentativa,
          code: await codigoDoErro(res),
          message: `${url} respondeu ${res.status} após ${tentativa} tentativa(s)`,
        })
      }

      await this.esperar(this.atraso(tentativa, res.headers.get('retry-after')), tentativa, url, `HTTP ${res.status}`)
    }

    throw new WpNetworkError({ url, attempts: this.opcoes.maxAttempts, cause: ultimoErroDeRede })
  }

  /** Exponencial com jitter; `Retry-After` do servidor tem precedência. */
  private atraso(tentativa: number, retryAfter?: string | null): number {
    const pedido = segundosDeRetryAfter(retryAfter)
    if (pedido !== null) return Math.min(pedido * 1000, this.opcoes.maxBackoffMs)
    const base = Math.min(this.opcoes.backoffMs * 2 ** (tentativa - 1), this.opcoes.maxBackoffMs)
    return Math.round(base * (1 + Math.random() * 0.25))
  }

  private async esperar(ms: number, tentativa: number, url: string, motivo: string): Promise<void> {
    this.opcoes.log(`wp: ${motivo} em ${url} — tentativa ${tentativa}/${this.opcoes.maxAttempts}, repetindo em ${ms}ms`)
    await this.opcoes.sleep(ms)
  }

  private caminhoDeCache(url: string, extensao: string): string | null {
    if (!this.opcoes.cacheDir || this.opcoes.cacheMode === 'off') return null
    // O nome legível ajuda a inspecionar/apagar à mão; o hash é quem garante
    // unicidade, porque a query inteira entra na chave.
    const rotulo = (new URL(url).pathname.split('/').filter(Boolean).pop() ?? 'wp').replace(/[^a-z0-9._-]/gi, '_')
    const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
    return join(this.opcoes.cacheDir, `${rotulo}-${hash}.${extensao}`)
  }
}

export function createWpClient(options: WpClientOptions = {}): WpClient {
  return new WpClient(options)
}

function modoDoAmbiente(): CacheMode | undefined {
  const v = process.env.WP_IMPORT_CACHE
  return v === 'off' || v === 'refresh' || v === 'read-write' ? v : undefined
}

function lerCache(arquivo: string, maxAgeMs?: number): EntradaDeCache | null {
  try {
    const entrada = JSON.parse(readFileSync(arquivo, 'utf8')) as EntradaDeCache
    if (maxAgeMs !== undefined && Date.now() - Date.parse(entrada.fetchedAt) > maxAgeMs) return null
    return entrada
  } catch {
    return null
  }
}

function gravarCache(arquivo: string, entrada: EntradaDeCache): void {
  mkdirSync(dirname(arquivo), { recursive: true })
  writeFileSync(arquivo, JSON.stringify(entrada))
}

/** `Retry-After` vem em segundos ou como data HTTP. */
function segundosDeRetryAfter(valor?: string | null): number | null {
  if (!valor) return null
  const segundos = Number(valor)
  if (Number.isFinite(segundos)) return Math.max(0, segundos)
  const data = Date.parse(valor)
  return Number.isNaN(data) ? null : Math.max(0, (data - Date.now()) / 1000)
}

/** O WP manda `{ code, message, data: { status } }` no corpo do erro. */
async function codigoDoErro(res: Response): Promise<string | undefined> {
  try {
    const corpo = (await res.json()) as { code?: string }
    return corpo.code
  } catch {
    return undefined
  }
}

function descrever(erro: unknown): string {
  return erro instanceof Error ? `${erro.name}: ${erro.message}` : String(erro)
}
