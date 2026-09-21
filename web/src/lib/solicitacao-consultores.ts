/* Solicitação de consultores — leitura do que o formulário manda e montagem do
 * resumo que o comercial lê (task 012).
 *
 * Puro de propósito, como `lib/diagnostico-rc18.ts`: a Server Action é endpoint
 * público (MIG-142), e o que ela aceita do cliente é exatamente o que precisa de
 * teste. Nada aqui consulta o banco — a action entrega os perfis já conferidos.
 *
 * ⚠️ Arquivo próprio, e não `lib/consultores.ts`: a task 010 também edita aquele,
 * e as duas vão para a mesma branch de integração. */

/** Teto de pessoas por perfil — **a fonte única**. `MAX_POR_PERFIL`, que o
 *  stepper de `/consultores` usa, é esta constante reexportada por
 *  `lib/consultores.ts`: o cliente não pode oferecer uma quantidade que o
 *  servidor depois corta. */
export const MAX_PESSOAS_POR_PERFIL = 20

/** Quantos perfis distintos um envio pode carregar. O catálogo tem 8; o teto só
 *  existe para que um JSON forjado com milhares de entradas não vire uma consulta
 *  com milhares de ids. */
export const MAX_PERFIS_POR_ENVIO = 50

/** Maior valor de `integer` no Postgres — o tipo do `id` das collections. */
const MAX_ID_POSTGRES = 2_147_483_647

/** Duração estimada, em meses. Acima de 5 anos já é contrato, não estimativa. */
export const MAX_MESES = 60

/** Modelos de alocação aceitos. As chaves são o contrato com o formulário
 *  (task 013); os rótulos são o que o comercial lê. */
export const MODELOS = {
  'full-time': 'Full-time (dedicado)',
  'part-time': 'Part-time (parcial)',
  squad: 'Squad gerenciada ATRA',
  'staff-augmentation': 'Staff augmentation',
} as const

export type Modelo = keyof typeof MODELOS

export type PerfilPedido = { id: number; quantidade: number }

/** O que chega do cliente em `perfis`: JSON `[{ slug, quantidade }]`.
 *
 * Nada aqui é confiável. Entrada que não for array vira lista vazia; item sem
 * slug numérico sai (o slug de um perfil é o id da collection — ver
 * `lib/mappers/consultant.ts`); quantidade é truncada e presa em 1..20; slug
 * repetido fica só na primeira ocorrência. */
export function lerPerfisPedidos(bruto: string): PerfilPedido[] {
  let valor: unknown
  try {
    valor = JSON.parse(bruto || '[]')
  } catch {
    return []
  }
  if (!Array.isArray(valor)) return []

  const vistos = new Set<number>()
  const saida: PerfilPedido[] = []
  for (const item of valor) {
    if (saida.length >= MAX_PERFIS_POR_ENVIO) break
    if (typeof item !== 'object' || item === null) continue
    const { slug, quantidade } = item as { slug?: unknown; quantidade?: unknown }

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

    const n = Math.trunc(Number(quantidade))
    saida.push({ id, quantidade: Number.isFinite(n) ? Math.min(MAX_PESSOAS_POR_PERFIL, Math.max(1, n)) : 1 })
  }
  return saida
}

/** Duração em meses, ou `null` quando ausente ou fora de 1..60. Fora da faixa
 *  vira ausência, e não o limite: "999 meses" não é uma estimativa que valha
 *  gravar como 60. */
export function lerDuracao(bruto: string): number | null {
  if (!bruto.trim()) return null
  const n = Number(bruto)
  if (!Number.isInteger(n) || n < 1 || n > MAX_MESES) return null
  return n
}

export function lerModelo(bruto: string): Modelo | null {
  return Object.hasOwn(MODELOS, bruto) ? (bruto as Modelo) : null
}

export type PerfilConfirmado = { cargo: string; nivel: string; quantidade: number }

/** O texto que vai para `message` do lead — e para o e-mail do comercial.
 *
 * ⚠️ `perfis` já vem **conferido contra o banco**: cargo e nível são os do
 * `specialist-roles`, não os que o cliente mandou. Esta função não sabe disso e
 * não precisa saber; quem garante é a action. */
export function resumoDaSolicitacao(pedido: {
  perfis: readonly PerfilConfirmado[]
  duracaoMeses: number | null
  modelo: Modelo | null
  descricao: string
}): string {
  const blocos: string[] = []

  if (pedido.perfis.length > 0) {
    const pessoas = pedido.perfis.reduce((soma, p) => soma + p.quantidade, 0)
    blocos.push(
      [
        `Perfis solicitados (${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}):`,
        ...pedido.perfis.map((p) => `- ${p.quantidade}× ${p.cargo} (${p.nivel})`),
      ].join('\n'),
    )
  } else {
    /* Chegou pelo "Não encontrou um consultor nesta lista?" (task 014): o
       comercial precisa saber que não é um formulário vazio por engano. */
    blocos.push('Nenhum perfil do catálogo selecionado — o visitante descreveu o que procura.')
  }

  const condicoes = [
    pedido.duracaoMeses && `Duração estimada: ${pedido.duracaoMeses} ${pedido.duracaoMeses === 1 ? 'mês' : 'meses'}`,
    pedido.modelo && `Modelo de alocação: ${MODELOS[pedido.modelo]}`,
  ].filter(Boolean)
  if (condicoes.length > 0) blocos.push(condicoes.join('\n'))

  if (pedido.descricao.trim()) blocos.push(`Descrição do visitante:\n${pedido.descricao.trim()}`)

  return blocos.join('\n\n')
}
