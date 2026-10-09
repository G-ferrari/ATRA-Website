/* As regulações avaliadas em cada setor, quando quem decide é o admin (07/10).
 *
 * A lista por setor é do Roger (`TAGS_DO_SETOR`, em `dados.ts`, gerado do HTML)
 * e não é só a linha "Impactos avaliados" da tela de perfil: a mesma lista
 * decide quais etiquetas "Impacta:" cada pergunta mostra e quais lacunas entram
 * no resultado (`tagRelevante`). Por isso o admin edita **a lista**, e não a
 * etiqueta da tela — o que a tela promete é o que o diagnóstico entrega.
 *
 * Fica fora de `dados.ts` de propósito: aquele arquivo é gerado, e isto é a
 * regra do site sobre ele. */
import { PERGUNTAS, ROTULOS_DAS_TAGS, SETORES, TAGS_DO_SETOR, TAGS_UNIVERSAIS, type Setor, type Tag } from './dados'

/** Setor → as regulações que ele avalia, na ordem em que aparecem na tela. */
export type RegulacoesPorSetor = Readonly<Record<Setor, readonly string[]>>

/* A ordem que o Roger pediu para a tela (08/10), onde ela não é a do HTML: na
 * Saúde, ANS antes do CFM. Só a ordem — o que entra na lista segue vindo da
 * base, e código que a base não tiver mais é ignorado aqui. */
const ORDEM_NA_TELA: Partial<Record<Setor, readonly Tag[]>> = {
  saude: ['anvisa', 'ans', 'tiss', 'cfm', 'rnds', 'lgpd_saude'],
}

function naOrdemDaTela(setor: Setor): readonly Tag[] {
  const ordem = ORDEM_NA_TELA[setor]
  if (!ordem) return TAGS_DO_SETOR[setor]
  const posicao = (tag: Tag) => (ordem.includes(tag) ? ordem.indexOf(tag) : ordem.length)
  return [...TAGS_DO_SETOR[setor]].sort((a, b) => posicao(a) - posicao(b))
}

/**
 * A lista do Roger: o que vale enquanto o admin não escolher outra.
 *
 * ⚠️ As mesmas regulações de `TAGS_DO_SETOR`, mas **não na mesma ordem** em
 * todo setor. A ordem não entra na conta — só na tela —, e por isso
 * `motor.test.ts` compara `impactosDoSetor` com o HTML passando `TAGS_DO_SETOR`.
 */
export const REGULACOES_PADRAO: RegulacoesPorSetor = Object.fromEntries(
  SETORES.map(({ valor }) => [valor, naOrdemDaTela(valor)]),
) as Record<Setor, readonly Tag[]>

const UNIVERSAIS = new Set<string>(TAGS_UNIVERSAIS)

/**
 * As regulações que um setor **consegue** avaliar: as da lista do Roger e as
 * que alguma pergunta do setor (própria ou transversal) carrega numa resposta.
 * É o que o admin oferece para aquele setor, e só isso.
 *
 * ⚠️ Regulação que nenhuma pergunta do setor carrega apareceria na tela como
 * "avaliada" sem nunca somar lacuna. Incluir uma dessas exige pergunta nova, na
 * base do Roger — por isso ela não é opção aqui. As universais (LGPD, ANPD, IA,
 * Reforma Tributária…) ficam de fora: valem para todos os setores, sempre.
 *
 * A ordem é a do HTML do Roger, e depois a do catálogo — é a ordem das opções
 * no enum do banco. A ordem **na tela** é a da escolha (`REGULACOES_PADRAO`).
 */
export function regulacoesAvaliaveis(setor: Setor): Tag[] {
  const carregadas = new Set<string>()
  for (const pergunta of PERGUNTAS) {
    const doSetor = (pergunta.setores as readonly string[]).includes('all') || (pergunta.setores as readonly string[]).includes(setor)
    if (!doSetor) continue
    for (const alternativa of pergunta.alternativas) for (const tag of alternativa.tags) carregadas.add(tag)
  }
  const padrao = TAGS_DO_SETOR[setor]
  const outras = (Object.keys(ROTULOS_DAS_TAGS) as Tag[]).filter(
    (tag) => carregadas.has(tag) && !UNIVERSAIS.has(tag) && !padrao.includes(tag),
  )
  return [...padrao, ...outras]
}

/**
 * A lista de cada setor a partir do que está no admin. Setor sem escolha (campo
 * vazio, ou global nunca salvo) fica com a lista do Roger; código que deixou de
 * ser opção — a base mudou de versão — é descartado em vez de virar etiqueta
 * com o código cru na tela.
 */
export function resolverRegulacoes(
  doAdmin: Partial<Record<string, readonly string[] | null | undefined>> | null | undefined,
): RegulacoesPorSetor {
  const saida = {} as Record<Setor, readonly string[]>
  for (const { valor: setor } of SETORES) {
    const permitidas = new Set<string>(regulacoesAvaliaveis(setor))
    const escolhidas = [...new Set(doAdmin?.[setor] ?? [])].filter((tag) => permitidas.has(tag))
    saida[setor] = escolhidas.length > 0 ? escolhidas : REGULACOES_PADRAO[setor]
  }
  return saida
}
