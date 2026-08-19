import { spawnSync } from 'node:child_process'

/* Executor dos seeds, em ordem declarada.
 *
 * A ordem importa: `cases` cria os assuntos e os parceiros que outras seeds
 * referenciam. Cada arquivo continua sendo um processo próprio — eles usam
 * top-level await e `process.exit`, e importar um do outro derrubaria o
 * seguinte no meio.
 *
 * Rodar com `pnpm seed`. Todos são idempotentes: rodar duas vezes não duplica.
 */
const SEEDS = ['cases.ts', 'glossary.ts', 'resources.ts', 'webinars.ts', 'posts.ts', 'sobre.ts', 'carreiras.ts', 'contato.ts', 'consultores.ts', 'parceiros.ts', 'solucoes.ts']

for (const arquivo of SEEDS) {
  console.log(`\n▶ ${arquivo}`)
  const r = spawnSync(
    'node',
    ['--import', 'tsx', '--env-file=.env.local', `scripts/seed/${arquivo}`],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) {
    console.error(`\n✖ ${arquivo} falhou (código ${r.status}). Os seguintes não rodaram.`)
    process.exit(r.status ?? 1)
  }
}
console.log('\n✓ seed completo')
