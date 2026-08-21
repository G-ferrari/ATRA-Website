import { spawn, spawnSync } from 'node:child_process'
import { cpus } from 'node:os'
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
 *   pnpm gate                     compara o app novo contra o gabarito
 *   pnpm gate --baseline          regrava o gabarito a partir do legado (:3001)
 *   pnpm gate --sem-build         reaproveita o .next existente
 *   pnpm gate --rota home         só a regressão visual daquela rota
 *   pnpm gate --viewport desktop  só um viewport
 *
 * ⚠️ `--rota` e `--viewport` existem para **iterar**, não para aprovar. Um
 * `pnpm gate` sem filtro custa ~9 min e a máquina inteira; conferir uma rota
 * enquanto se conserta um bloco custa ~1 min. Quem fecha a task roda o gate
 * completo — o filtro não pega regressão em rota vizinha.
 *
 * ⚠️ Página estática não muda com `--sem-build`. A home e as outras rotas de
 * conteúdo são pré-renderizadas no build: depois de mexer no **seed**, é
 * `pnpm gate` inteiro, ou o servidor serve o HTML antigo e a comparação repete
 * o mesmo número de pixels da corrida anterior — já custou duas corridas.
 */

const PORTA = 3100
/* Metade dos núcleos, no máximo 4 e no mínimo 1. */
const TETO_DE_CPUS = Math.min(4, Math.max(1, Math.floor(cpus().length / 2)))
const IMAGEM = 'mcr.microsoft.com/playwright:v1.62.1-noble'
const LEGADO = 'http://host.docker.internal:3001'
const args = process.argv.slice(2)
const gravarGabarito = args.includes('--baseline')
const semBuild = args.includes('--sem-build')
const valorDe = (nome) => {
  const i = args.indexOf(nome)
  return i >= 0 ? args[i + 1] : null
}
const rota = valorDe('--rota')
const viewport = valorDe('--viewport')

/* Filtro repassado ao Playwright.
 *
 * ⚠️ Os dois specs nomeiam o teste de formas diferentes — `visual.spec.ts` usa
 * `${nome}: paridade com o legado` e `baseline.spec.ts` usa `gabarito: ${nome}`
 * —, então o padrão precisa cobrir as duas. Um `-g` que só casasse a primeira
 * faria `--baseline --rota` rodar **zero** teste e sair verde. */
const filtro = [
  ...(rota ? ['-g', `(gabarito: ${rota}$|${rota}: paridade)`] : []),
  ...(viewport ? ['--project', viewport] : []),
]

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

/* ⚠️ A porta tem que estar **livre** antes de subir o servidor.
 *
 * Se alguém já está escutando em :3100 — o servidor de uma corrida anterior que
 * não morreu, tipicamente — o `next start` desta corrida sai na hora com
 * `EADDRINUSE`, e a suíte roda inteira contra o **build antigo**. O resultado
 * parece legítimo: 240 testes, falhas plausíveis, nenhum aviso. Custou uma
 * corrida inteira de 25 minutos investigando um defeito que já estava
 * corrigido no código — o build que respondia é que era outro.
 *
 * Abortar aqui é a diferença entre um gate que mede e um que inventa. */
async function portaOcupada() {
  try {
    await fetch(`http://localhost:${PORTA}/`, { signal: AbortSignal.timeout(2_000) })
    return true
  } catch {
    return false
  }
}

if (await portaOcupada()) {
  console.error(`✖ já há algo escutando em :${PORTA} — provavelmente o servidor de uma corrida anterior.`)
  console.error(`  A suíte rodaria contra o build daquela corrida, não contra este. Derrube com:`)
  console.error(`      lsof -ti tcp:${PORTA} | xargs kill`)
  process.exit(1)
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
  while (Date.now() < limite) {
    /* Servidor que morreu não vai subir, e quem estiver respondendo na porta é
     * outra coisa. Conferido **antes** do fetch: com a ordem invertida, um
     * servidor alheio responde 200 na primeira volta e o gate segue feliz. */
    if (saiu) return false
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
  ? ['sh', '-c', `GRAVAR_GABARITO=1 npx playwright test e2e/baseline.spec.ts --update-snapshots ${filtro.map((a) => `'${a}'`).join(' ')}`]
  : ['npx', 'playwright', 'test', ...(rota ? ['e2e/visual.spec.ts'] : []), ...filtro]

const r = passo(gravarGabarito ? 'gravando o gabarito (legado)' : 'comparando', () =>
  spawnSync(
    'docker',
    [
      'run', '--rm',
      /* ⚠️ Teto de recursos, **derivado do que a máquina tem**. Sem teto o
         container do Playwright toma tudo — dois workers de Chromium
         capturando página inteira em três viewports — e o resto do computador
         trava enquanto o gate roda. Fixar em 4 quebrou o CI: o runner do
         GitHub tem 2 núcleos e o Docker recusa `--cpus` acima do disponível
         ("range of CPUs is from 0.01 to 2.00"). */
      `--cpus=${TETO_DE_CPUS}`,
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
