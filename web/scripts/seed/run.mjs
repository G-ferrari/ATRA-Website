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
const SEEDS = ['parceiros-catalogo.ts', 'cases.ts', 'glossary.ts', 'resources.ts', 'webinars.ts', 'posts.ts', 'sobre.ts', 'carreiras.ts', 'contato.ts', 'consultores.ts', 'parceiros.ts', 'solucoes.ts', 'solucao-ia.ts', 'home.ts', 'insights.ts', 'atra-ai.ts', 'navegacao.ts']

for (const arquivo of SEEDS) {
  console.log(`\n▶ ${arquivo}`)
  const r = spawnSync(
    'node',
    /* ⚠️ `--env-file-if-exists`, e não `--env-file`. No CI não há `.env.local`
     * — as variáveis vêm do workflow — e o `node` aborta com "not found" antes
     * de rodar qualquer seed, derrubando o job de e2e inteiro. Foi o que
     * manteve MIG-010 sem uma execução verde desde a estreia do CI. */
    ['--import', 'tsx', '--env-file-if-exists=.env.local', `scripts/seed/${arquivo}`],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) {
    console.error(`\n✖ ${arquivo} falhou (código ${r.status}). Os seguintes não rodaram.`)
    process.exit(r.status ?? 1)
  }
}
console.log('\n✓ seed completo')
