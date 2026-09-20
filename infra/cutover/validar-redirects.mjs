#!/usr/bin/env node
/* Valida o redirects.csv inteiro contra um ambiente vivo (MIG-086/108/132).
 *
 * Usado no ensaio do cutover e na conferência pós-virada:
 *
 *   node infra/cutover/validar-redirects.mjs --base https://srv1927832.hstgr.cloud --auth 'usuario:senha'
 *   node infra/cutover/validar-redirects.mjs --base https://www.atra.com.br
 *
 * O que cada linha prova:
 *  - origem → cadeia de redirects (barra final conta um salto) → destino do CSV
 *    no caminho → 200 no fim, em no máximo 2 saltos, sem laço;
 *  - linhas 410: terminam em **410** — a normalização de barra pode custar um
 *    salto antes, e está certo (o robô chega ao 410 do mesmo jeito);
 *  - linha com origem == destino é especificação, não regra de servidor: pulada.
 *
 * ⚠️ Difere do `e2e/redirects.spec.ts` de propósito: o spec roda no CI contra
 * um banco de fixture e por isso não cobra 200 dos destinos de conteúdo
 * importado; aqui o ambiente é real e **todo** destino precisa responder.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`)
  return i > -1 ? process.argv[i + 1] : padrao
}
const BASE = arg('base', '')
const AUTH = arg('auth', '')
if (!BASE) {
  console.error('uso: validar-redirects.mjs --base <url> [--auth usuario:senha]')
  process.exit(2)
}
const HEADERS = {
  'user-agent': 'validacao-redirects (ensaio de cutover)',
  ...(AUTH ? { authorization: `Basic ${Buffer.from(AUTH).toString('base64')}` } : {}),
}

const CSV = path.resolve(import.meta.dirname, '../../docs/02-especificacao/dados/redirects.csv')
const linhas = readFileSync(CSV, 'utf8')
  .split('\n')
  .slice(1)
  .filter(Boolean)
  .map((l) => {
    const [de, para, status] = l.split(',')
    return { de, para, status }
  })
  .filter((l) => l.de && l.de !== l.para)

const caminhoDe = (loc) => {
  if (!loc) return '(sem Location)'
  return loc.startsWith('http') ? new URL(loc).pathname : loc.split('?')[0]
}

async function salto(caminho) {
  const r = await fetch(BASE + caminho, { headers: HEADERS, redirect: 'manual' })
  return { codigo: r.status, para: caminhoDe(r.headers.get('location')) }
}

async function validar({ de, para, status }) {
  let atual = de
  const cadeia = []
  for (let i = 0; i < 4; i++) {
    const r = await salto(atual)
    if (![301, 307, 308].includes(r.codigo)) {
      if (status === '410') {
        return r.codigo === 410 ? null : `GONE  ${de}: esperado 410, veio ${r.codigo}`
      }
      if (r.codigo !== 200) return `FINAL ${de}: cadeia ${JSON.stringify(cadeia)} termina em ${r.codigo}`
      if (!cadeia.includes(para)) return `ALVO  ${de}: cadeia ${JSON.stringify(cadeia)} não passa por ${para}`
      if (cadeia.length > 2) return `LONGA ${de}: ${cadeia.length} saltos`
      return null
    }
    if (!r.para || cadeia.includes(r.para)) return `LACO  ${de}: ${JSON.stringify([...cadeia, r.para])}`
    cadeia.push(r.para)
    atual = r.para
  }
  return `LACO  ${de}: não terminou em 4 saltos`
}

console.log(`validando ${linhas.length} regras contra ${BASE} …`)
const falhas = []
const LARGURA = 12
for (let i = 0; i < linhas.length; i += LARGURA) {
  const lote = await Promise.all(linhas.slice(i, i + LARGURA).map(validar))
  falhas.push(...lote.filter(Boolean))
}

console.log(`${falhas.length === 0 ? '✅' : '✖'} ${linhas.length - falhas.length}/${linhas.length} ok · ${falhas.length} falhas`)
for (const f of falhas.slice(0, 20)) console.log(' ', f)
process.exit(falhas.length ? 1 : 0)
