/* Executor dos seeds, em ordem declarada.
 *
 * A ordem importa: `cases` cria os assuntos e os parceiros que outras seeds
 * referenciam.
 *
 * Rodar com `pnpm seed`. Todos são idempotentes: rodar duas vezes não duplica.
 *
 * **Um processo só**, desde 09/10. Eram 21 — um por arquivo —, e cada um pagava
 * de novo o arranque do Payload (carregar o config inteiro pelo tsx): no CI o
 * seed levava ~4 min, quase todo de arranque, a cada rodada. Agora o primeiro
 * arquivo sobe o Payload e os seguintes recebem a mesma instância (`getPayload`
 * devolve a que já existe para o mesmo config).
 *
 * ⚠️ Cada arquivo ainda termina em `process.exit(0)`, e alguns saem cedo, no
 * topo, quando falta `SEED_FIXTURES`. Para o primeiro não levar os outros
 * junto, `process.exit` vira, **só enquanto os seeds carregam**, um lançamento
 * que interrompe aquele módulo e mais nada. Vale porque todo `process.exit` dos
 * seeds está no topo do módulo: um que fosse chamado de dentro de um
 * `try/catch` seria engolido pelo `catch` e o arquivo seguiria rodando.
 *
 * ⚠️ Por ser um processo só, o script do `package.json` carrega o `tsx` e o
 * `.env.local` (`--env-file-if-exists`, e não `--env-file`: no CI não há
 * `.env.local` — as variáveis vêm do workflow — e o `node` abortaria com "not
 * found" antes de rodar qualquer seed; foi o que manteve MIG-010 sem uma
 * execução verde desde a estreia do CI).
 *
 * ⚠️ Não há mais seed das soluções do menu (D-52, 02/10): as 18 da estrutura
 * nova entram pela migração `20261002_213000_nova_estrutura_de_solucoes`, que
 * roda no `migrate` — inclusive em banco novo, porque não depende de conteúdo
 * nem de storage. Os seeds antigos (`solucoes.ts`, `solucao-ia.ts`,
 * `solucoes-wp.ts`) recriariam as soluções que a migração apagou. Só a RC18
 * continua aqui.
 */
const SEEDS = ['parceiros-catalogo.ts', 'cases.ts', 'glossary.ts', 'resources.ts', 'webinars.ts', 'posts.ts', 'clientes.ts', 'sobre.ts', 'carreiras.ts', 'contato.ts', 'consultores.ts', 'parceiros.ts', 'solucoes-rc18.ts', 'home.ts', 'insights.ts', 'atra-ai.ts', 'navegacao.ts', 'globais.ts', 'segmentos.ts', 'rastreamento.ts', 'migracoes-de-dados.ts']

/** O `process.exit(n)` de um seed, enquanto os seeds carregam. */
class SaidaDoSeed extends Error {
  constructor(codigo) {
    super(`seed saiu com código ${codigo}`)
    this.codigo = codigo
  }
}

const sairDeVerdade = process.exit.bind(process)
process.exit = (codigo = 0) => {
  throw new SaidaDoSeed(codigo)
}

for (const arquivo of SEEDS) {
  console.log(`\n▶ ${arquivo}`)
  let codigo = 0
  try {
    await import(`./${arquivo}`)
  } catch (erro) {
    if (erro instanceof SaidaDoSeed) {
      codigo = erro.codigo
    } else {
      console.error(erro)
      codigo = 1
    }
  }
  if (codigo !== 0) {
    console.error(`\n✖ ${arquivo} falhou (código ${codigo}). Os seguintes não rodaram.`)
    sairDeVerdade(codigo)
  }
}
console.log('\n✓ seed completo')
/* A conexão com o banco segura o processo de pé: sair é de propósito. */
sairDeVerdade(0)
