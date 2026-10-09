import { spawnSync } from 'node:child_process'
import './pnpm-no-path.mjs'

/* Publicar: confere tudo e só então leva a `migracao` para a `main` (D-59).
 *
 * O push na `main` é o deploy, e desde 09/10 **nada no GitHub confere antes** —
 * o workflow só publica. Quem confere é este script, e por isso ele é o único
 * caminho para a `main`: o hook de `pre-push` recusa push direto nela.
 *
 * O que ele garante, na ordem:
 *   1. você está na `migracao`, com a árvore limpa e igual à do GitHub;
 *   2. a `migracao` contém a `main` — então a árvore conferida é exatamente a
 *      que vai ao ar, e o push é um avanço simples, sem merge novo;
 *   3. o `pnpm check` inteiro passa;
 *   4. nada mudou de commit enquanto o check rodava.
 *
 * ⚠️ D-44 continua valendo: a `main` só recebe o que veio da `migracao`. Push de
 * uma `main` atrasada leva ao ar código velho sobre um banco já migrado.
 *
 * Uso: pnpm ship            confere e publica
 *      pnpm ship --ensaio   confere e para antes do push */

const ensaio = process.argv.includes('--ensaio')

function git(...argumentos) {
  const r = spawnSync('git', argumentos, { encoding: 'utf8' })
  if (r.status !== 0) recusar(`git ${argumentos.join(' ')} falhou:\n${r.stderr}`)
  return r.stdout.trim()
}

function recusar(mensagem) {
  console.error(`\n✖ ${mensagem}\n  Nada foi publicado.`)
  process.exit(1)
}

if (git('rev-parse', '--abbrev-ref', 'HEAD') !== 'migracao') {
  recusar('o ship parte da `migracao` (D-44): faça o merge do seu trabalho nela e rode de lá.')
}
if (git('status', '--porcelain') !== '') {
  recusar('a árvore tem alteração não commitada — o check conferiria o que não vai ao ar.')
}

git('fetch', '--quiet', 'origin', 'main', 'migracao')
const sha = git('rev-parse', 'HEAD')

if (sha !== git('rev-parse', 'origin/migracao')) {
  recusar('a `migracao` local difere da do GitHub — `git pull` ou `git push origin migracao` antes.')
}
if (spawnSync('git', ['merge-base', '--is-ancestor', 'origin/main', sha]).status !== 0) {
  recusar('a `main` tem commit que a `migracao` não tem — traga a `main` para a `migracao` antes (`git merge origin/main`).')
}
if (sha === git('rev-parse', 'origin/main')) {
  console.log('✓ a `main` já está neste commit — não há o que publicar.')
  process.exit(0)
}

console.log(`▶ conferindo ${sha.slice(0, 7)} antes de publicar\n${git('log', '--oneline', `origin/main..${sha}`)}`)

const check = spawnSync('pnpm', ['check'], { stdio: 'inherit' })
if (check.status !== 0) recusar('o check reprovou.')

if (git('rev-parse', 'HEAD') !== sha) recusar('o commit mudou enquanto o check rodava.')

if (ensaio) {
  console.log(`\n✓ ensaio: ${sha.slice(0, 7)} passou no check. Sem --ensaio, ele iria para a main.`)
  process.exit(0)
}

// `ATRA_SHIP` é o que o hook de pre-push lê para deixar este push passar.
const push = spawnSync('git', ['push', 'origin', `${sha}:refs/heads/main`], {
  stdio: 'inherit',
  env: { ...process.env, ATRA_SHIP: '1' },
})
if (push.status !== 0) recusar('o push para a `main` falhou.')

console.log(`\n✓ ${sha.slice(0, 7)} está na main — o deploy começou na VM.`)
console.log('  Acompanhe:  gh run watch $(gh run list --workflow Deploy --limit 1 --json databaseId -q ".[0].databaseId")')
