import { spawnSync } from 'node:child_process'

/* `payload migrate` que não aceita sair calado.
 *
 * ⚠️ O CLI do Payload carrega o `tsx` num worker e dispara o comando com
 * `void start()` (`payload/bin.js`). Quando esse carregamento empaca sem nenhum
 * handle vivo, o Node esvazia o laço de eventos e **sai com código 0, sem
 * imprimir nada** — nem o aviso de e-mail que o Payload sempre solta ao subir.
 * Aconteceu duas vezes em 28/09 no CI (o seed e o build quebraram depois com
 * `relation "..." does not exist`), e o mesmo comando roda no migrador do
 * deploy: lá, uma migração pulada em silêncio deixaria o site com schema velho.
 *
 * Então sucesso aqui exige o Payload dizer que terminou: "Done." ao fim, ou
 * "No migrations to run.". Saída 0 sem isso é o empacamento — tenta de novo.
 * Saída diferente de 0 é erro de verdade (migração quebrada, banco fora) e
 * não se repete: repetir esconderia a causa. */

const TENTATIVAS = 3
const TERMINOU = /No migrations to run\.|Done\./

for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
  const r = spawnSync('pnpm', ['exec', 'payload', 'migrate'], {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  })
  process.stdout.write(r.stdout ?? '')
  process.stderr.write(r.stderr ?? '')

  if (r.status !== 0) process.exit(r.status ?? 1)
  if (TERMINOU.test(`${r.stdout}${r.stderr}`)) process.exit(0)

  console.error(
    `\n⚠️ payload migrate saiu com 0 sem dizer que terminou (tentativa ${tentativa}/${TENTATIVAS}) — o carregador do tsx empacou; tentando de novo.\n`,
  )
}

console.error(`✖ payload migrate saiu calado ${TENTATIVAS} vezes. Nenhuma migração garantida — parando aqui.`)
process.exit(1)
