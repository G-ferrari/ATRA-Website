/* A linha "Impactos avaliados" como o site a mostra (Roger, 08/10).
 *
 * O questionário lista norma por norma — "Resolução Conjunta CMN/BCB 18/2025",
 * "Resolução CMN 5.274/2025", "BCBS 239"… —, e a linha de um banco chegava a dez
 * etiquetas. O Roger pediu a linha pelo **órgão**, sem o detalhe: "BACEN (Banco
 * Central)" no lugar das três normas, "CVM" no lugar de "Resolução CVM
 * 244/2026", "ECA Digital" sem o número da lei.
 *
 * ⚠️ É só a **linha de resumo**: a tela de perfil e a mesma linha do e-mail. As
 * etiquetas "Impacta:" de cada pergunta e as lacunas do resultado continuam
 * norma por norma — é ali que o lead descobre **qual** resolução está em
 * aberto, e é o que o comercial lê no lead. Nada aqui entra na conta.
 *
 * Fica fora de `motor.ts` de propósito: `impactosDoSetor` é o porte de
 * `sectorImpactChips` e segue comparado com o HTML original; isto é a regra do
 * site por cima dele. */
import { ROTULOS_DAS_TAGS, TAGS_UNIVERSAIS_DO_PERFIL, type Setor, type Tag } from './dados'
import { impactosDoSetor, type Impacto } from './motor'
import { REGULACOES_PADRAO, type RegulacoesPorSetor } from './regulacoes'

/** Norma → o órgão pelo qual ela aparece na linha. Quem não está aqui aparece
 *  com o próprio nome. A ANPD entra junto da LGPD: o Roger ditou "LGPD/ANPD". */
const ORGAO: Partial<Record<Tag, Tag>> = {
  rc18: 'bcb',
  cmn5274: 'bcb',
  bcbs239: 'bcb',
  cvm244: 'cvm',
  sro: 'susep',
  tiss: 'ans',
  rgc: 'anatel',
  lgpd_saude: 'lgpd',
  anpd: 'lgpd',
}

/** O nome na linha, quando não é o do questionário. */
const ROTULO_NA_LINHA: Partial<Record<Tag, string>> = {
  bcb: 'BACEN (Banco Central)',
  eca: 'ECA Digital',
  lgpd: 'LGPD/ANPD',
}

const REFORMA = 'reforma_tributaria'
const PARA_TODOS = new Set<string>(TAGS_UNIVERSAIS_DO_PERFIL)

function orgaoDe(tag: string): string {
  return (Object.hasOwn(ORGAO, tag) && ORGAO[tag as Tag]) || tag
}

function rotuloNaLinha(tag: string, doQuestionario: string): string {
  if (Object.hasOwn(ROTULO_NA_LINHA, tag)) return ROTULO_NA_LINHA[tag as Tag] ?? doQuestionario
  return (Object.hasOwn(ROTULOS_DAS_TAGS, tag) && ROTULOS_DAS_TAGS[tag as Tag]) || doQuestionario
}

/**
 * As etiquetas de "Impactos avaliados" na ordem que o Roger ditou: o que é do
 * setor primeiro, depois o que vale para todos (LGPD/ANPD, Marco Legal da IA) e
 * a Reforma Tributária por último. Normas do mesmo órgão viram uma etiqueta só.
 *
 * Parte de `impactosDoSetor`, então a lista do admin (D-56) continua mandando:
 * regulação tirada de um setor sai daqui, e a ordem do admin é a da tela.
 */
export function impactosNoPerfil(setor: Setor, regulacoes: RegulacoesPorSetor = REGULACOES_PADRAO): Impacto[] {
  const posicao = (tag: string) => (tag === REFORMA ? 2 : PARA_TODOS.has(orgaoDe(tag)) ? 1 : 0)
  /* `sort` é estável: dentro de cada grupo fica a ordem do motor. */
  const ordenados = [...impactosDoSetor(setor, regulacoes)].sort((a, b) => posicao(a.tag) - posicao(b.tag))

  const vistos = new Set<string>()
  const saida: Impacto[] = []
  for (const impacto of ordenados) {
    const tag = orgaoDe(impacto.tag)
    if (vistos.has(tag)) continue
    vistos.add(tag)
    saida.push({ tag, rotulo: rotuloNaLinha(tag, impacto.rotulo) })
  }
  return saida
}
