import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import './pnpm-no-path.mjs'

/* A esteira de verificação, na máquina de quem publica (D-59).
 *
 * Até 09/10 isto era o `ci.yml`: os jobs `verify` e `e2e` rodavam no executor do
 * GitHub a cada PR e a cada push, e a franquia de 2.000 minutos do mês acabou
 * em nove dias. O GitHub ficou só com o deploy; **tudo o que o CI conferia
 * continua conferível por um comando**, e é este.
 *
 * Uso:
 *   pnpm check:fast   o que era o job `verify` — segredo exposto, lint, tipos do
 *                     Payload, importMap, tipos, testes unitários (~2 min).
 *                     É o que o hook de `pre-push` roda.
 *   pnpm check        isso mais o que era o job `e2e`: banco zerado, migrações,
 *                     seed com fixtures e o `pnpm gate` nos três tamanhos de
 *                     tela. É o que o `pnpm ship` exige antes de publicar.
 *   pnpm check --viewport desktop   repassa o filtro ao gate, para iterar.
 *
 * ⚠️ Confere a **árvore de trabalho**, não o commit. Quem garante que o que foi
 * conferido é o que vai ao ar é o `ship`, que exige árvore limpa. */

const args = process.argv.slice(2)
const rapido = args.includes('--rapido')
const repassar = args.filter((a) => a !== '--rapido')

const RAIZ = path.resolve(process.cwd(), '..')
const COMPOSE = ['compose', '-p', 'atra-check', '-f', path.join(RAIZ, 'docker-compose.check.yml')]

/* Os valores que o `ci.yml` dava aos dois jobs, apontados para as portas do
 * `docker-compose.check.yml`.
 *
 * ⚠️ Vão no ambiente do processo, e por isso vencem o `.env.local`: nem o
 * `--env-file-if-exists` do seed nem o carregador do Next sobrescrevem variável
 * que já existe. Sem isso a esteira migraria e semearia o banco de dev. */
const AMBIENTE = {
  ...process.env,
  DATABASE_URI: 'postgres://atra:atra@localhost:55432/atra',
  PAYLOAD_SECRET: 'check-secret-not-used-in-production',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  S3_ENDPOINT: 'http://localhost:59000',
  S3_BUCKET: 'atra-media',
  S3_PRIVATE_BUCKET: 'atra-privado',
  S3_ACCESS_KEY: 'atra',
  S3_SECRET_KEY: 'atra12345',
  NEXT_TELEMETRY_DISABLED: '1',
}

const inicio = Date.now()
const minutos = () => `${((Date.now() - inicio) / 60_000).toFixed(1)} min`

function reprovar(mensagem) {
  console.error(`\n✖ ${mensagem}`)
  console.error(`  check reprovado em ${minutos()}.`)
  process.exit(1)
}

function rodar(titulo, comando, argumentos, opcoes = {}) {
  process.stdout.write(`\n▶ ${titulo}\n`)
  const r = spawnSync(comando, argumentos, { stdio: 'inherit', env: AMBIENTE, ...opcoes })
  if (r.status !== 0) reprovar(`${titulo} — saiu com código ${r.status ?? r.signal}`)
}

const digest = (arquivo) => (existsSync(arquivo) ? createHash('sha1').update(readFileSync(arquivo)).digest('hex') : null)

/* Arquivo gerado tem que estar em dia. O CI comparava com `git diff`; aqui a
 * comparação é antes × depois do gerador, para não reprovar por uma alteração
 * ainda não commitada que **está** em dia. */
function gerado(titulo, script, arquivo) {
  const antes = digest(arquivo)
  rodar(titulo, 'pnpm', [script])
  if (digest(arquivo) !== antes) {
    reprovar(`${arquivo} estava desatualizado — o gerador acabou de reescrevê-lo. Confira e commite.`)
  }
}

/* ── o que era o job `verify` ─────────────────────────────────────────────── */

/* Nenhum segredo pode ter prefixo NEXT_PUBLIC_ — o prefixo injeta a variável no
 * bundle do cliente. Ver docs/04-infra/ambientes.md. */
process.stdout.write('\n▶ segredo exposto ao cliente?\n')
{
  const alvos = ['src', '.env.example'].filter((a) => existsSync(a))
  const r = spawnSync('grep', ['-rnE', 'NEXT_PUBLIC_[A-Z_]*(KEY|SECRET|TOKEN|PASSWORD)', ...alvos], { encoding: 'utf8' })
  if (r.status === 0) {
    process.stdout.write(r.stdout)
    reprovar('segredo com prefixo NEXT_PUBLIC_ — iria para o bundle do cliente.')
  }
  // ⚠️ 1 é "nada encontrado"; 2 é o grep que não rodou, e isso não é aprovação.
  if (r.status !== 1) reprovar(`o grep de segredos não rodou: ${r.stderr}`)
}

rodar('lint', 'pnpm', ['lint'])
// Defasado, o `payload-types.ts` mente para o typecheck.
gerado('tipos do Payload em dia?', 'generate:types', 'src/payload-types.ts')
// Defasado não quebra o build: quebra em silêncio o campo no admin.
gerado('importMap em dia?', 'generate:importmap', 'src/app/(payload)/admin/importMap.js')
// `PageProps`/`LayoutProps` nascem em `.next/types`; sem isto o tsc reprova rota certa.
rodar('tipos das rotas', 'pnpm', ['typegen'])
rodar('typecheck', 'pnpm', ['typecheck'])
rodar('testes unitários', 'pnpm', ['test'])

if (rapido) {
  console.log(`\n✓ check rápido aprovado em ${minutos()}.`)
  process.exit(0)
}

/* ── o que era o job `e2e` ────────────────────────────────────────────────── */

if (spawnSync('docker', ['info'], { stdio: 'ignore' }).status !== 0) {
  reprovar('o Docker não respondeu — a suíte de ponta a ponta precisa dele (banco, storage e o Playwright).')
}

const derrubar = () => spawnSync('docker', [...COMPOSE, 'down', '-v', '--remove-orphans'], { stdio: 'ignore' })
// Resto de uma corrida interrompida: o banco tem que nascer vazio.
derrubar()
process.on('exit', derrubar)
process.on('SIGINT', () => process.exit(130))
process.on('SIGTERM', () => process.exit(143))

rodar('banco e storage descartáveis (:55432, :59000)', 'docker', [...COMPOSE, 'up', '-d', '--wait', 'postgres', 'minio'])
rodar('buckets', 'docker', [...COMPOSE, 'up', 'createbucket'])

// `pnpm migrate`, e não `pnpm payload migrate`: o invólucro recusa a saída
// calada do CLI — ver `scripts/migrar.mjs`.
rodar('migrações num banco zerado', 'pnpm', ['migrate'])
// Sem as fixtures a suíte não tem o que conferir em /blog e /carreiras.
rodar('seed com fixtures', 'pnpm', ['seed'], { env: { ...AMBIENTE, SEED_FIXTURES: '1' } })
rodar('gate: build de produção + suíte', 'pnpm', ['gate', ...repassar])

console.log(`\n✓ check aprovado em ${minutos()}.`)
