/* Solicitação de consultores — leitura do que o formulário manda e montagem do
 * resumo que o comercial lê (task 012).
 *
 * Puro de propósito, como `lib/diagnostico-rc18.ts`: a Server Action é endpoint
 * público (MIG-142), e o que ela aceita do cliente é exatamente o que precisa de
 * teste. Nada aqui consulta o banco — a action entrega os perfis já conferidos.
 *
 * ⚠️ Arquivo próprio, e não `lib/consultores.ts`: a task 010 também edita aquele,
 * e as duas vão para a mesma branch de integração.
 *
 * ⚠️ **A task 020 (22/09) enxugou o pedido**: saíram a quantidade por perfil, o
 * modelo de alocação e a duração estimada — com os campos, saiu o que os lia.
 * O formulário ficou com nome, e-mail, telefone e descrição, e o resto é
 * conversa comercial. */


/** Quantos perfis distintos um envio pode carregar. O catálogo tem 8; o teto só
 *  existe para que um JSON forjado com milhares de entradas não vire uma consulta
 *  com milhares de ids. */
export const MAX_PERFIS_POR_ENVIO = 50

/** O que conta como e-mail — **fonte única** entre o `pattern` do campo e a
 *  checagem da Server Action. Sem anchors: o atributo `pattern` do HTML já
 *  casa a string inteira, e a action monta a regex com `^…$`.
 *
 *  ⚠️ Existe porque os dois divergiam: `joao@empresa` passava no
 *  `type="email"` do navegador e a action recusava por falta de domínio. A
 *  recusa só vinha depois do envio — gastando a cota por IP — e o React 19
 *  apagava o formulário ao terminar a action. */
export const PADRAO_EMAIL = '[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}'

/** Maior valor de `integer` no Postgres — o tipo do `id` das collections. */
const MAX_ID_POSTGRES = 2_147_483_647

/** O que chega do cliente em `perfis`: JSON com os slugs escolhidos.
 *
 * ⚠️ Era `[{ slug, quantidade }]` até a task 020, quando a quantidade por perfil
 * saiu da tela e do pedido.
 *
 * Nada aqui é confiável. Entrada que não for array vira lista vazia; item que
 * não for slug numérico sai (o slug de um perfil é o id da collection — ver
 * `lib/mappers/consultant.ts`); slug repetido fica só na primeira ocorrência. */
export function lerPerfisPedidos(bruto: string): number[] {
  let valor: unknown
  try {
    valor = JSON.parse(bruto || '[]')
  } catch {
    return []
  }
  if (!Array.isArray(valor)) return []

  const vistos = new Set<number>()
  const saida: number[] = []
  for (const slug of valor) {
    if (saida.length >= MAX_PERFIS_POR_ENVIO) break

    /* Só dígitos, e dentro do `integer` do Postgres: é id de collection.
       Qualquer outra coisa nem chega à consulta.

       ⚠️ O limite é o do tipo, não o de dígitos. A primeira versão aceitava até
       12 dígitos, e um id acima de 2.147.483.647 não "sumia": a consulta
       estourava com `value out of range for type integer`, e o pedido inteiro
       — inclusive os perfis válidos — voltava como erro. */
    if (typeof slug !== 'string' || !/^\d{1,10}$/.test(slug)) continue
    const id = Number(slug)
    if (id < 1 || id > MAX_ID_POSTGRES) continue
    if (vistos.has(id)) continue
    vistos.add(id)
    saida.push(id)
  }
  return saida
}

export type PerfilConfirmado = { cargo: string; nivel: string }

/** O texto que vai para `message` do lead — e para o e-mail do comercial.
 *
 * ⚠️ `perfis` já vem **conferido contra o banco**: cargo e nível são os do
 * `specialist-roles`, não os que o cliente mandou. Esta função não sabe disso e
 * não precisa saber; quem garante é a action. */
export function resumoDaSolicitacao(pedido: {
  perfis: readonly PerfilConfirmado[]
  descricao: string
}): string {
  const blocos: string[] = []

  if (pedido.perfis.length > 0) {
    blocos.push(
      ['Perfis solicitados:', ...pedido.perfis.map((p) => `- ${p.cargo} (${p.nivel})`)].join('\n'),
    )
  } else {
    /* Chegou pelo "Não encontrou um consultor nesta lista?" (task 014): o
       comercial precisa saber que não é um formulário vazio por engano. */
    blocos.push('Nenhum perfil do catálogo selecionado — o visitante descreveu o que procura.')
  }

  if (pedido.descricao.trim()) blocos.push(`Descrição do visitante:\n${pedido.descricao.trim()}`)

  return blocos.join('\n\n')
}
