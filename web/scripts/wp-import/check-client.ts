/* MIG-080 — verificação executável do cliente da API do WP.
 *
 * Duas metades: um servidor local que força os caminhos de erro (retry, 429,
 * 4xx, rede) e uma bateria contra a API real da ATRA, que é onde o critério de
 * aceite ("traz os 207 posts") se comprova.
 *
 * Rodar com: pnpm exec tsx scripts/wp-import/check-client.ts
 * (`--offline` pula a metade que depende da rede) */
import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import { type AddressInfo } from 'node:net'

import { createWpClient, WpHttpError, WpNetworkError } from './client'
import { type WpPost } from './types'

const OFFLINE = process.argv.includes('--offline')

let falhas = 0
async function teste(nome: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn()
    console.log(`  ✓ ${nome}`)
  } catch (erro) {
    falhas++
    console.log(`  ✗ ${nome}\n      ${erro instanceof Error ? erro.message : String(erro)}`)
  }
}

/* ── Servidor de mentira: cada rota exercita um caminho do retry ───────────── */

let chamadas: Record<string, number> = {}

function subirServidor(): Promise<{ server: Server; base: string }> {
  const server = createServer((req, res) => {
    const rota = (req.url ?? '/').split('?')[0]
    chamadas[rota] = (chamadas[rota] ?? 0) + 1
    const n = chamadas[rota]
    const json = { 'content-type': 'application/json' }

    if (rota === '/flaky') {
      // Falha nas duas primeiras e responde na terceira: prova que o retry
      // insiste e que o resultado bom vence.
      if (n < 3) return res.writeHead(500, json).end('{"code":"boom"}')
      return res.writeHead(200, { ...json, 'x-wp-total': '1', 'x-wp-totalpages': '1' }).end('[{"id":1}]')
    }
    if (rota === '/rate-limited') {
      if (n < 2) return res.writeHead(429, { ...json, 'retry-after': '2' }).end('{"code":"too_many"}')
      return res.writeHead(200, { ...json, 'x-wp-total': '1', 'x-wp-totalpages': '1' }).end('[{"id":1}]')
    }
    if (rota === '/gone') return res.writeHead(404, json).end('{"code":"rest_no_route"}')
    if (rota === '/sempre-500') return res.writeHead(503, json).end('{"code":"unavailable"}')
    if (rota === '/redirecionado') return res.writeHead(302, { location: 'https://www.atra.com.br/' }).end()
    if (rota === '/html') return res.writeHead(200, { 'content-type': 'text/html' }).end('<html>oi</html>')
    if (rota === '/paginado') {
      const pagina = Number(new URL(req.url ?? '', 'http://x').searchParams.get('page') ?? 1)
      // 2 páginas de 2 itens: o total é múltiplo exato do per_page, o caso em
      // que a heurística `lote.length < per_page` pediria uma página a mais.
      if (pagina > 2) return res.writeHead(400, json).end('{"code":"rest_post_invalid_page_number"}')
      const itens = pagina === 1 ? '[{"id":1},{"id":2}]' : '[{"id":3},{"id":4}]'
      return res.writeHead(200, { ...json, 'x-wp-total': '4', 'x-wp-totalpages': '2' }).end(itens)
    }
    res.writeHead(404, json).end('{"code":"rest_no_route"}')
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo
      resolve({ server, base: `http://127.0.0.1:${port}` })
    })
  })
}

async function verificarRetry(): Promise<void> {
  console.log('\n═══ RETRY E BACKOFF (servidor local) ═══')
  const { server, base } = await subirServidor()
  chamadas = {}

  // `sleep` injetado: registra a espera em vez de gastá-la, senão a bateria
  // levaria os segundos de verdade do backoff.
  const esperas: number[] = []
  const cliente = createWpClient({
    baseUrl: base,
    cacheDir: null,
    maxAttempts: 4,
    backoffMs: 100,
    sleep: async (ms) => void esperas.push(ms),
    log: (l) => console.log(`      · ${l}`),
  })

  await teste('500 → repete e a terceira tentativa passa', async () => {
    esperas.length = 0
    const r = await cliente.fetchPage('flaky')
    assert.equal(chamadas['/flaky'], 3, 'deveria ter chamado 3×')
    assert.equal(r.items.length, 1)
    assert.equal(esperas.length, 2, 'duas esperas entre três tentativas')
    assert.ok(esperas[1] > esperas[0], `backoff não cresceu: ${esperas.join(', ')}`)
  })

  await teste('429 respeita Retry-After (2s), ignorando o backoff calculado', async () => {
    esperas.length = 0
    await cliente.fetchPage('rate-limited')
    assert.deepEqual(esperas, [2000], `esperava [2000], veio [${esperas.join(', ')}]`)
  })

  await teste('404 não é repetido', async () => {
    esperas.length = 0
    const erro = await cliente.fetchPage('gone').catch((e: unknown) => e)
    assert.ok(erro instanceof WpHttpError, 'esperava WpHttpError')
    assert.equal(erro.status, 404)
    assert.equal(erro.attempts, 1, 'um 404 não melhora repetindo')
    assert.equal(chamadas['/gone'], 1)
    assert.equal(esperas.length, 0, 'não deveria ter esperado')
    assert.equal(erro.code, 'rest_no_route', 'o code do WP precisa chegar em quem trata')
  })

  await teste('5xx persistente desiste em maxAttempts', async () => {
    esperas.length = 0
    const erro = await cliente.fetchPage('sempre-500').catch((e: unknown) => e)
    assert.ok(erro instanceof WpHttpError && erro.status === 503)
    assert.equal(chamadas['/sempre-500'], 4, 'maxAttempts = 4')
    assert.equal(esperas.length, 3)
  })

  await teste('302 vira erro nomeando o user-agent, não HTML parseado como JSON', async () => {
    const erro = await cliente.fetchPage('redirecionado').catch((e: unknown) => e)
    assert.ok(erro instanceof WpHttpError && erro.status === 302)
    assert.match(erro.message, /user-agent/)
    assert.equal(chamadas['/redirecionado'], 1, 'redirect não é caso de retry')
  })

  await teste('200 em HTML falha com a resposta no texto do erro', async () => {
    const erro = await cliente.fetchPage('html').catch((e: unknown) => e)
    assert.ok(erro instanceof WpHttpError)
    assert.match(erro.message, /content-type/)
  })

  await teste('paginação para por X-WP-TotalPages, sem pedir a página inexistente', async () => {
    const itens = await cliente.fetchAll<{ id: number }>('paginado', { per_page: 2 })
    assert.deepEqual(
      itens.map((i) => i.id),
      [1, 2, 3, 4],
    )
    assert.equal(chamadas['/paginado'], 2, 'a 3ª página nunca deveria ser pedida')
  })

  server.close()

  await teste('host inválido: repete e termina em WpNetworkError', async () => {
    const esperasDeRede: number[] = []
    const offline = createWpClient({
      baseUrl: 'http://host.invalido.atra.teste/wp-json/wp/v2',
      cacheDir: null,
      maxAttempts: 3,
      backoffMs: 50,
      timeoutMs: 2_000,
      sleep: async (ms) => void esperasDeRede.push(ms),
      log: (l) => console.log(`      · ${l}`),
    })
    const erro = await offline.fetchPage('posts').catch((e: unknown) => e)
    assert.ok(erro instanceof WpNetworkError, `esperava WpNetworkError, veio ${String(erro)}`)
    assert.equal(erro.attempts, 3)
    assert.equal(esperasDeRede.length, 2)
    assert.ok(esperasDeRede[1] > esperasDeRede[0], `backoff não cresceu: ${esperasDeRede.join(', ')}`)
  })
}

/* ── API real ─────────────────────────────────────────────────────────────── */

async function verificarApiReal(): Promise<void> {
  console.log('\n═══ API REAL (www.atra.com.br) ═══')
  // Sem cache: o critério de aceite é sobre a produção da ATRA, não sobre o que
  // ficou em disco de uma execução anterior.
  const cliente = createWpClient({ cacheDir: null, log: (l) => console.log(`      · ${l}`) })

  let posts: WpPost[] = []

  await teste('traz todos os posts paginando', async () => {
    const total = await cliente.count('posts')
    posts = await cliente.posts({ _fields: 'id,slug,date,link,title,featured_media,categories' })
    console.log(`      X-WP-Total = ${total} · baixados = ${posts.length}`)
    assert.equal(posts.length, total, 'a paginação perdeu ou duplicou item')
    assert.equal(new Set(posts.map((p) => p.id)).size, posts.length, 'ids repetidos entre páginas')
    if (posts.length !== 207) {
      console.log(`      ⚠️ o corpus mudou desde MIG-012: ${posts.length} posts, não 207`)
    }
  })

  await teste('todo post tem slug, data e link (MIG-083 e MIG-086 dependem)', async () => {
    const quebrados = posts.filter((p) => !p.slug || !p.date || !p.link)
    assert.equal(quebrados.length, 0, `${quebrados.length} post(s) sem slug/date/link`)
  })

  await teste('o cache poupa a segunda passada', async () => {
    let idas = 0
    const comCache = createWpClient({
      cacheMode: 'refresh',
      fetchImpl: (input, init) => {
        idas++
        return fetch(input, init)
      },
    })
    await comCache.fetchPage('posts', 1, { per_page: 5, _fields: 'id' })
    const idasDepoisDaPrimeira = idas
    /* `cacheMode` explícito porque `WP_IMPORT_CACHE` no ambiente venceria o
     * padrão do cliente e este teste passaria a medir a variável, não o cache:
     * com `refresh` exportado a leitura nunca acontece e a verificação reprova
     * sem haver defeito. */
    const doCache = createWpClient({
      cacheMode: 'read-write',
      fetchImpl: () => Promise.reject(new Error('não deveria ir à rede')),
    })
    const r = await doCache.fetchPage<{ id: number }>('posts', 1, { per_page: 5, _fields: 'id' })
    assert.equal(idasDepoisDaPrimeira, 1)
    assert.equal(r.items.length, 5, 'o cache devolveu a página inteira')
    // Os totais moram no header; se não forem gravados junto, a segunda
    // execução acha que a coleção tem 1 página e importa só o primeiro lote.
    assert.equal(r.total, posts.length, 'X-WP-Total precisa sobreviver ao cache')
    assert.ok(r.totalPages > 0, 'X-WP-TotalPages precisa sobreviver ao cache')
  })

  await teste('pages, media e categories também paginam (MIG-082, MIG-084, MIG-085)', async () => {
    for (const recurso of ['pages', 'media', 'categories'] as const) {
      const total = await cliente.count(recurso)
      const itens = await cliente.fetchAll<{ id: number }>(recurso, { _fields: 'id' })
      const gap = total - itens.length
      console.log(`      ${recurso.padEnd(11)} ${String(itens.length).padStart(4)} (X-WP-Total = ${total})`)
      assert.equal(new Set(itens.map((i) => i.id)).size, itens.length, `${recurso}: ids repetidos entre páginas`)
      // ⚠️ `media` é a exceção conhecida: o WP conta anexos em X-WP-Total que
      // depois esconde por permissão do post-mãe. Exigir igualdade aqui
      // reprovaria uma paginação correta; o que não pode é vir a mais, nem
      // faltar nas coleções que fecham a conta.
      if (recurso === 'media') assert.ok(gap >= 0 && gap < total * 0.1, `media: buraco de ${gap} itens é grande demais`)
      else assert.equal(itens.length, total, `${recurso}: paginação divergiu do total`)
    }
  })

  await teste('baixa binário de mídia (MIG-082)', async () => {
    const { items } = await cliente.fetchPage<{ source_url: string }>('media', 1, {
      per_page: 1,
      media_type: 'image',
      _fields: 'source_url',
    })
    const bin = await cliente.fetchBinary(items[0].source_url)
    assert.ok(bin.bytes.length > 1000, `imagem veio com ${bin.bytes.length} bytes`)
    assert.match(bin.contentType ?? '', /^image\//)
  })

  await teste('user-agent de robô é barrado pelo WAF (a armadilha de MIG-012)', async () => {
    const comoRobo = createWpClient({ cacheDir: null, userAgent: 'curl/8.7.1', maxAttempts: 1 })
    const erro = await comoRobo.fetchPage('posts', 1, { per_page: 1, _fields: 'id' }).catch((e: unknown) => e)
    assert.ok(erro instanceof WpHttpError, `esperava WpHttpError, veio ${String(erro)}`)
    assert.equal(erro.status, 302)
    console.log(`      ${erro.message}`)
  })
}

await verificarRetry()
if (!OFFLINE) await verificarApiReal()
else console.log('\n(--offline: bateria contra a API real pulada)')

console.log(falhas === 0 ? '\n✓ tudo passou\n' : `\n✗ ${falhas} verificação(ões) falharam\n`)
process.exit(falhas === 0 ? 0 : 1)
