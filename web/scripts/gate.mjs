import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as esperar } from 'node:timers/promises'

/* Gate de regressão visual (MIG-035).
 *
 * Três decisões, cada uma para eliminar uma fonte de divergência que já custou
 * uma sessão de depuração:
 *
 * 1. **Build de produção**, não `next dev`. É o que vai ao ar, não recompila
 *    sob demanda e não injeta o indicador de dev. Com o servidor de dev a suíte
 *    alternava entre verde e vermelho sem mudança de código, e uma rota chegava
 *    a levar 70s.
 * 2. **Imagem oficial do Playwright**, a mesma no macOS e no CI. Rasterização
 *    de fonte difere entre sistemas; um gabarito gravado no macOS reprovava no
 *    Linux mesmo com o código certo.
 * 3. **Porta 3100**, separada do :3000 de desenvolvimento, para o gate não
 *    depender do que estiver rodando na sua máquina.
 *
 * Uso:
 *   pnpm gate            compara o app novo contra o gabarito
 *   pnpm gate --baseline regrava o gabarito a partir do legado (:3001)
 *   pnpm gate --sem-build  reaproveita o .next existente
 */

const PORTA = 3100
const IMAGEM = 'mcr.microsoft.com/playwright:v1.62.1-noble'
const LEGADO = 'http://host.docker.internal:3001'
const args = process.argv.slice(2)
const gravarGabarito = args.includes('--baseline')
const semBuild = args.includes('--sem-build')

function passo(titulo, fn) {
  process.stdout.write(`\n▶ ${titulo}\n`)
  return fn()
}

if (!semBuild) {
  passo('build de produção', () => {
    const r = spawnSync('pnpm', ['build'], { stdio: 'inherit' })
    if (r.status !== 0) process.exit(r.status ?? 1)
  })
}

const servidor = spawn('pnpm', ['exec', 'next', 'start', '--port', String(PORTA)], {
  stdio: ['ignore', 'pipe', 'inherit'],
  env: { ...process.env, NODE_ENV: 'production' },
})
servidor.stdout.on('data', () => {}) // consumido para o processo não travar no buffer

let saiu = false
servidor.on('exit', () => (saiu = true))

async function esperarNoAr() {
  const limite = Date.now() + 90_000
  while (Date.now() < limite && !saiu) {
    try {
      const r = await fetch(`http://localhost:${PORTA}/cases-de-sucesso`, {
        signal: AbortSignal.timeout(5_000),
      })
      if (r.ok) return true
    } catch {
      /* ainda subindo */
    }
    await esperar(1_000)
  }
  return false
}

function encerrar(codigo) {
  servidor.kill('SIGTERM')
  process.exit(codigo)
}

process.on('SIGINT', () => encerrar(130))

if (!(await passo(`subindo o build em :${PORTA}`, esperarNoAr))) {
  console.error(`✖ o servidor de produção não respondeu em :${PORTA}`)
  encerrar(1)
}

const comando = gravarGabarito
  ? ['sh', '-c', 'GRAVAR_GABARITO=1 npx playwright test e2e/baseline.spec.ts --update-snapshots']
  : ['npx', 'playwright', 'test']

const r = passo(gravarGabarito ? 'gravando o gabarito (legado)' : 'comparando', () =>
  spawnSync(
    'docker',
    [
      'run', '--rm',
      '--add-host=host.docker.internal:host-gateway',
      '-e', `NEXT_URL=http://host.docker.internal:${PORTA}`,
      '-e', `LEGACY_URL=${LEGADO}`,
      '-e', 'CI=1',
      '-v', `${process.cwd()}:/work`,
      '-w', '/work',
      IMAGEM,
      ...comando,
    ],
    { stdio: 'inherit' },
  ),
)

encerrar(r.status ?? 1)
