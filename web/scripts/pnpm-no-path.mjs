import { spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

/* Garante que `pnpm` exista no PATH dos processos filhos.
 *
 * ⚠️ Quem usa o pnpm pelo corepack sem `corepack enable` roda `corepack pnpm
 * check` — e aí **este** processo existe, mas `spawnSync('pnpm')` dá ENOENT: o
 * primeiro passo "saía com código null" e o hook de pre-push barrava todo push.
 * O pnpm que nos chamou deixa o próprio caminho em `npm_execpath`; um atalho de
 * uma linha numa pasta temporária, à frente do PATH, serve a este script e a
 * tudo o que ele chamar (o gate, o seed, o migrate). */
if (spawnSync('pnpm', ['--version'], { stdio: 'ignore' }).error) {
  const pnpm = process.env.npm_execpath
  if (!pnpm) {
    console.error('✖ `pnpm` não está no PATH. Rode por ele (`corepack pnpm <script>`) ou ligue com `corepack enable pnpm`.')
    process.exit(1)
  }
  const pasta = mkdtempSync(path.join(tmpdir(), 'atra-pnpm-'))
  const atalho = path.join(pasta, 'pnpm')
  writeFileSync(atalho, `#!/bin/sh\nexec "${process.execPath}" "${pnpm}" "$@"\n`)
  chmodSync(atalho, 0o755)
  process.env.PATH = `${pasta}${path.delimiter}${process.env.PATH}`
}
