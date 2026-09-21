import type { ConsultantRole } from '@/types/content'

/* Filtro do catálogo de /consultores (task 009).
 *
 * Separado da ilha pelo mesmo motivo de `lib/diagnostico-rc18.ts`: é a regra que
 * os critérios de aceitação descrevem, e teste unitário sobre os 8 perfis reais
 * custa milissegundos enquanto o mesmo caso por e2e custa minutos.
 *
 * ⚠️ **Esta função não conhece o modo `OU`/`E`** — e isso é a decisão, não um
 * esquecimento. Os dois modos devolvem **o mesmo conjunto** de perfis; o que muda
 * é a leitura: `E` pergunta "quem cobre tudo?" e responde explicitamente,
 * inclusive quando a resposta é "ninguém", sem deixar o visitante na mão. Quem
 * decide mostrar a separação é a UI.
 *
 * ⚠️ **Não reintroduza corte por cobertura para o modo `E`.** A página lista 8
 * **arquétipos** de perfil, não pessoas: interseção pura devolve zero na maioria
 * das combinações reais — "GCP + FinOps + PySpark" e "Looker + GCP + Delta Lake +
 * BigQuery", os dois exemplos que vieram no feedback de 20/09, dão lista vazia. Um
 * beco sem saída no meio do funil é pior que um resultado parcial, e é o
 * resultado parcial que empurra para o comportamento certo: pedir **dois** perfis.
 */

export type PerfilComCobertura = { perfil: ConsultantRole; cobertura: number }

export type ResultadoFiltro = {
  /** Perfis que têm **todas** as tags marcadas. Sem tag marcada, são todos. */
  completos: PerfilComCobertura[]
  /** Têm pelo menos uma das tags marcadas, mas não todas. Vazio sem tag marcada. */
  parciais: PerfilComCobertura[]
  /** Quantas tags foram marcadas — o "de M" do selo "cobre N de M". */
  alvo: number
}

/** Ordem de exibição quando a separação não interessa (modo `OU`): cobertura
 *  desc, que é exatamente `completos` seguido de `parciais`. */
export function emOrdem({ completos, parciais }: ResultadoFiltro): PerfilComCobertura[] {
  return [...completos, ...parciais]
}

export type ModoFiltro = 'ou' | 'e'

export type Exibicao = {
  /** Grade de cima. Vazia quando ninguém cobre tudo — a UI não a desenha. */
  principais: PerfilComCobertura[]
  /** Grade de baixo, sob a faixa. Vazia fora do modo `E`. */
  parciais: PerfilComCobertura[]
  /** `separador` divide dois grupos que existem; `aviso` encabeça os parciais
   *  quando **não há** grupo de cima. A cópia das duas é diferente, e é por isso
   *  que são valores distintos e não um booleano. */
  faixa: 'nenhuma' | 'separador' | 'aviso'
}

/** Como o resultado deve ser **lido** na tela. Mora aqui, e não na ilha, porque
 *  foi exatamente esta decisão que passou sem teste e produziu uma faixa dizendo
 *  "nenhum perfil reúne tudo" com dois perfis que reúnem logo acima. */
export function exibicao(r: ResultadoFiltro, modo: ModoFiltro): Exibicao {
  if (modo === 'ou' || r.alvo === 0 || r.parciais.length === 0) {
    return { principais: modo === 'e' ? r.completos : emOrdem(r), parciais: [], faixa: 'nenhuma' }
  }
  return r.completos.length > 0
    ? { principais: r.completos, parciais: r.parciais, faixa: 'separador' }
    : { principais: [], parciais: r.parciais, faixa: 'aviso' }
}

export function total({ completos, parciais }: ResultadoFiltro): number {
  return completos.length + parciais.length
}

export function filtrarPerfis({
  perfis,
  tags,
  niveis,
  busca,
}: {
  perfis: readonly ConsultantRole[]
  tags: ReadonlySet<string>
  niveis: ReadonlySet<string>
  busca: string
}): ResultadoFiltro {
  const termo = busca.trim().toLowerCase()
  const alvo = tags.size

  const cortados = perfis.filter((p) => {
    /* Conjunto vazio é "sem filtro nesta dimensão", não "nada casa". */
    if (niveis.size > 0 && !niveis.has(p.level)) return false
    if (termo === '') return true
    return [p.role, p.description, ...p.tags].join(' ').toLowerCase().includes(termo)
  })

  const comCobertura = cortados
    .map((perfil) => ({ perfil, cobertura: perfil.tags.filter((t) => tags.has(t)).length }))
    /* Sem tag marcada não há o que cobrir; com tags, quem não tem nenhuma sai — é
       o único corte por cobertura, e vale nos dois modos. */
    .filter(({ cobertura }) => alvo === 0 || cobertura > 0)
    /* `sort` é estável desde ES2019, então perfis de mesma cobertura preservam a
       ordem que veio do CMS (`sort: 'order'`) em vez de embaralhar a cada clique. */
    .sort((a, b) => b.cobertura - a.cobertura)

  return {
    completos: comCobertura.filter((x) => x.cobertura === alvo),
    parciais: comCobertura.filter((x) => x.cobertura < alvo),
    alvo,
  }
}
