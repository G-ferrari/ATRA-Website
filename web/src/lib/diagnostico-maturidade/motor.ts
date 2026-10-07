/* Motor do Diagnóstico de Maturidade de Dados (feature diagnostico-maturidade-dados,
 * task 022).
 *
 * Porte à mão, em TS tipado, da lógica do questionário do Roger — v1.7, recebida
 * em 25/09/2026 (docs/02-especificacao/diagnostico-maturidade/, ver
 * ADAPTACAO-SITE-NOVO.md). Cada função diz qual original reproduz. Os dados vêm
 * de `dados.ts`, gerado do mesmo HTML.
 *
 * Puro e determinístico, sem DOM, React ou `@/payload-types`: a mesma conta roda
 * no cliente (tela e validação do e-mail) e no servidor, que **recalcula** a
 * partir dos índices das alternativas — o navegador não é fonte de verdade.
 *
 * ⚠️ Porte fiel, inclusive do que parece estranho (D-15). Os poucos textos que
 * moram dentro da lógica do HTML (nível, fases do roadmap, leitura pelo porte)
 * estão copiados aqui caractere a caractere; `motor.test.ts` roda as funções
 * originais do HTML e compara com tolerância zero, então qualquer desvio reprova.
 * A única exceção é deliberada e registrada: o número do nível (D-38, ver
 * `nivelNumerico`). Antes de "corrigir" algo, ver também `impactosDoSetor`.
 */

import {
  ACOES_POR_REGULACAO,
  CARGOS,
  DOMINIOS_DE_EMAIL_BLOQUEADOS,
  OFERTAS,
  O_QUE_ESTA_EM_JOGO,
  PERGUNTAS,
  PORTES,
  ROTULOS_DAS_TAGS,
  SETORES,
  TAGS_INTERNAS,
  TAGS_UNIVERSAIS,
  TAGS_UNIVERSAIS_DO_PERFIL,
  type Alternativa,
  type Cargo,
  type Faixa,
  type NivelNumerico,
  type NomeDoPilar,
  type Pergunta,
  type Porte,
  type Setor,
  type Tag,
} from './dados'
import { REGULACOES_PADRAO, type RegulacoesPorSetor } from './regulacoes'

/* ⚠️ `regulacoes` — o último parâmetro de `tagRelevante`, `impactosDaPergunta`,
 * `impactosDoSetor` e `calcular` — é a única coisa aqui que **não** vem do HTML
 * do Roger: desde 07/10 a lista de regulações de cada setor pode ser escolhida
 * no admin (`regulacoes.ts`). O padrão é a lista do Roger, e é com ele que
 * `motor.test.ts` compara com o original; quem serve o site passa a do admin.
 * As três telas — perfil, pergunta e resultado — usam a mesma lista. */

/** perguntaId → índice (0 a 3) da alternativa escolhida, na ordem da base.
 *
 * O servidor recebe só isto: nota e tags são sempre derivadas da base, nunca do
 * que o navegador manda. Entrada de pergunta que não existe, de pergunta de
 * outro setor, ou com índice fora do intervalo (negativo, fracionário, ≥ nº de
 * alternativas) é **ignorada** — conta como não respondida. */
export type Respostas = Readonly<Record<string, number>>

export interface Calculo {
  /** Média geral, 2 casas (`overall` no HTML); 0 se nada foi respondido. */
  media: number
  /** Rótulo do nível pela média: '1 · Inicial' … '5 · Otimizado'. */
  nivel: string
  /** Média por pilar, só dos pilares com resposta, na ordem da primeira resposta. */
  pilares: Partial<Record<NomeDoPilar, number>>
  /** Média por área DAMA-DMBOK, mesma regra. */
  damas: Record<string, number>
  /** Tag → soma de (5 − nota) das respostas que a carregam, só tags relevantes ao setor. */
  gaps: Record<string, number>
  /** Três maiores gaps como o HTML os manda ao CRM: 'LGPD (12)'. */
  topGaps: string[]
}

export interface ItemDoRoadmap {
  titulo: string
  descricao: string
}
export interface FaseDoRoadmap {
  fase: string
  prazo: string
  /** Classe CSS do HTML (`f1`…`f3`), que dá a cor da fase. */
  classe: 'f1' | 'f2' | 'f3'
  itens: ItemDoRoadmap[]
}
export interface Roadmap {
  /** Os 4 pilares em ordem crescente de nota (sem resposta = 0). */
  pilares: { pilar: NomeDoPilar; nota: number }[]
  fases: [FaseDoRoadmap, FaseDoRoadmap, FaseDoRoadmap]
  /** Até 4 regulações com maior gap que têm ação recomendada ("Regulações com maior gap"). */
  regulacoes: { titulo: string; descricao: string; gap: number }[]
}

export interface Impacto {
  tag: string
  rotulo: string
}

/* ---------------------------------------------------------------------
   Perfil
   --------------------------------------------------------------------- */

const temValor = <V extends string>(lista: readonly { valor: V }[], v: unknown): v is V =>
  typeof v === 'string' && lista.some((o) => o.valor === v)

export const ehSetor = (v: unknown): v is Setor => temValor(SETORES, v)
export const ehPorte = (v: unknown): v is Porte => temValor(PORTES, v)
export const ehCargo = (v: unknown): v is Cargo => temValor(CARGOS, v)

/* Rótulo amigável: `TAG_LABELS[t] || t`. */
function rotuloDaTag(tag: string): string {
  return (Object.hasOwn(ROTULOS_DAS_TAGS, tag) && ROTULOS_DAS_TAGS[tag as Tag]) || tag
}

/* `SECTOR_TAGS[state.sector] || []`. O `hasOwn` só evita que um setor forjado
 * como 'constructor' devolva uma função do protótipo — o original quebraria. */
function tagsDoSetor(setor: string, regulacoes: RegulacoesPorSetor): readonly string[] {
  return (Object.hasOwn(regulacoes, setor) && regulacoes[setor as Setor]) || []
}

/* ---------------------------------------------------------------------
   Perguntas
   --------------------------------------------------------------------- */

/** Filtro de `buildQuestions`: transversais (`'all'`) + as do setor, na ordem da base. */
export function perguntasDoSetor(setor: Setor): Pergunta[] {
  return PERGUNTAS.filter((q) => q.setores.includes('all') || q.setores.includes(setor))
}

/** `tagRelevant`: pergunta transversal só exibe (e só pontua gap para) as tags
 * universais e os reguladores do setor escolhido. */
export function tagRelevante(setor: Setor, tag: string, regulacoes: RegulacoesPorSetor = REGULACOES_PADRAO): boolean {
  return (TAGS_UNIVERSAIS as readonly string[]).includes(tag) || tagsDoSetor(setor, regulacoes).includes(tag)
}

/** `tagChips`: as etiquetas "Impacta:" de uma pergunta — união das tags das
 * alternativas, sem as internas, filtrada pelo setor.
 *
 * Lista vazia = o HTML mostra "Base para todas as regulações do setor". */
export function impactosDaPergunta(
  pergunta: Pergunta,
  setor: Setor,
  regulacoes: RegulacoesPorSetor = REGULACOES_PADRAO,
): Impacto[] {
  const vistas = new Set<string>()
  const saida: Impacto[] = []
  for (const alternativa of pergunta.alternativas) {
    for (const tag of alternativa.tags) {
      if (!vistas.has(tag) && !(TAGS_INTERNAS as readonly string[]).includes(tag) && tagRelevante(setor, tag, regulacoes)) {
        vistas.add(tag)
        saida.push({ tag, rotulo: rotuloDaTag(tag) })
      }
    }
  }
  return saida
}

/** `sectorImpactChips`: "Impactos avaliados" na tela de perfil e no resultado —
 * LGPD, ANPD e IA, os reguladores do setor e, se alguma pergunta **específica**
 * do setor carrega a tag, a Reforma Tributária. O HTML fecha a lista com
 * "entre outros". */
export function impactosDoSetor(setor: Setor, regulacoes: RegulacoesPorSetor = REGULACOES_PADRAO): Impacto[] {
  /* ⚠️ `q.sectors.indexOf(sector)`, e não o filtro com `'all'`: pergunta
   * transversal não conta. Hoje só `conf_ger_tributaria` decide isso. */
  const temReforma = PERGUNTAS.some(
    (q) =>
      (q.setores as readonly string[]).includes(setor) &&
      q.alternativas.some((a) => (a.tags as readonly string[]).includes('reforma_tributaria')),
  )
  const tags: readonly string[] = [
    ...TAGS_UNIVERSAIS_DO_PERFIL,
    ...tagsDoSetor(setor, regulacoes),
    ...(temReforma ? ['reforma_tributaria'] : []),
  ]
  return [...new Set(tags)].map((tag) => ({ tag, rotulo: rotuloDaTag(tag) }))
}

/* ---------------------------------------------------------------------
   Respostas
   --------------------------------------------------------------------- */

/** A alternativa que a resposta aponta, ou `undefined` se a pergunta ficou sem
 * resposta ou o índice é inválido — a mesma regra de `calcular`, para o aviso à
 * ATRA listar exatamente o que entrou na conta. */
export function alternativaEscolhida(pergunta: Pergunta, respostas: Respostas): Alternativa | undefined {
  if (!Object.hasOwn(respostas, pergunta.id)) return undefined
  const indice = respostas[pergunta.id]
  return Number.isInteger(indice) && indice >= 0 ? pergunta.alternativas[indice] : undefined
}

/** Limpa o que chega do navegador: fica só pergunta do setor com índice válido.
 * Aceita o índice como número ou como texto só de dígitos (valor de FormData).
 * Entrada que não é objeto vira `{}`. */
export function validarRespostas(setor: Setor, entrada: unknown): Record<string, number> {
  const saida: Record<string, number> = {}
  if (!entrada || typeof entrada !== 'object') return saida
  const bruto = entrada as Record<string, unknown>
  for (const pergunta of perguntasDoSetor(setor)) {
    if (!Object.hasOwn(bruto, pergunta.id)) continue
    const valor = bruto[pergunta.id]
    const indice = typeof valor === 'string' && /^\d+$/.test(valor) ? Number(valor) : valor
    if (typeof indice === 'number' && alternativaEscolhida(pergunta, { [pergunta.id]: indice })) {
      saida[pergunta.id] = indice
    }
  }
  return saida
}

/* ---------------------------------------------------------------------
   Pontuação
   --------------------------------------------------------------------- */

/* A mesma ordem de soma do `reduce` original: ponto flutuante não é associativo,
 * e a paridade é na segunda casa. */
const media2 = (notas: number[]) => +(notas.reduce((x, y) => x + y, 0) / notas.length).toFixed(2)

/** Rótulo do nível pela média — limiares 1,8 / 2,6 / 3,5 / 4,3 de `computeScores`. */
export function nivelDaMedia(media: number): string {
  return media < 1.8
    ? '1 · Inicial'
    : media < 2.6
      ? '2 · Repetível'
      : media < 3.5
        ? '3 · Definido'
        : media < 4.3
          ? '4 · Gerenciado'
          : '5 · Otimizado'
}

/** `computeScores`: média, nível, médias por pilar e por área DAMA, gaps por tag
 * relevante (5 − nota, a distância até "Otimizado") e os três maiores. */
export function calcular(setor: Setor, respostas: Respostas, regulacoes: RegulacoesPorSetor = REGULACOES_PADRAO): Calculo {
  const porPilar: Partial<Record<NomeDoPilar, number[]>> = {}
  const porDama: Record<string, number[]> = {}
  const gaps: Record<string, number> = {}
  let soma = 0
  let n = 0
  for (const pergunta of perguntasDoSetor(setor)) {
    const alternativa = alternativaEscolhida(pergunta, respostas)
    if (!alternativa) continue
    soma += alternativa.nota
    n++
    ;(porPilar[pergunta.pilar] ??= []).push(alternativa.nota)
    ;(porDama[pergunta.dama] ??= []).push(alternativa.nota)
    const gap = 5 - alternativa.nota
    for (const tag of alternativa.tags) {
      if (tagRelevante(setor, tag, regulacoes)) gaps[tag] = (gaps[tag] || 0) + gap
    }
  }

  /* ⚠️ A ordem das chaves é parte do resultado: `Object.keys(gaps)` ordenado por
   * valor desempata pela ordem de inserção (sort estável), e é isso que decide
   * o top 3 e a "Frente regulatória prioritária" quando dois gaps empatam. */
  const pilares: Partial<Record<NomeDoPilar, number>> = {}
  for (const p of Object.keys(porPilar) as NomeDoPilar[]) pilares[p] = media2(porPilar[p]!)
  const damas: Record<string, number> = {}
  for (const d of Object.keys(porDama)) damas[d] = media2(porDama[d])

  const media = n ? +(soma / n).toFixed(2) : 0
  const topGaps = Object.keys(gaps)
    .sort((a, b) => gaps[b] - gaps[a])
    .slice(0, 3)
    .map((t) => `${rotuloDaTag(t)} (${gaps[t]})`)

  return { media, nivel: nivelDaMedia(media), pilares, damas, gaps, topGaps }
}

/** `band`: faixa das ofertas e da cor da barra do pilar (crítico < 2,6, atenção < 3,5). */
export function faixa(nota: number): Faixa {
  return nota < 2.6 ? 'low' : nota < 3.5 ? 'mid' : 'high'
}

/* ---------------------------------------------------------------------
   Roadmap
   --------------------------------------------------------------------- */

/* Ordem de `buildRoadmap`, que desempata pilares de mesma nota (sort estável). */
const ORDEM_DOS_PILARES: readonly NomeDoPilar[] = ['Governança', 'Qualidade', 'Segurança', 'Conformidade']

/** `buildRoadmap`: fase 1 abre com o diagnóstico executivo e recebe a oferta do
 * pilar mais fraco; fase 2, a do segundo e a frente regulatória de maior gap;
 * fase 3, as dos outros dois e — média ≥ 3,5 — IA sobre dados confiáveis. */
export function montarRoadmap(calculo: Pick<Calculo, 'media' | 'pilares' | 'gaps'>): Roadmap {
  const pilares = ORDEM_DOS_PILARES.map((pilar) => ({ pilar, nota: calculo.pilares[pilar] || 0 })).sort(
    (a, b) => a.nota - b.nota,
  )
  const fases: Roadmap['fases'] = [
    { fase: 'Fase 1', prazo: '0 a 3 meses', classe: 'f1', itens: [] },
    { fase: 'Fase 2', prazo: '3 a 6 meses', classe: 'f2', itens: [] },
    { fase: 'Fase 3', prazo: '6 a 12 meses', classe: 'f3', itens: [] },
  ]
  fases[0].itens.push({
    titulo: 'Diagnóstico executivo de dados',
    descricao:
      'Leitura detalhada deste resultado com um especialista da ATRA, priorização dos gaps por risco e prazo regulatório, e roadmap aprovado pela diretoria.',
  })
  pilares.forEach((x, i) => {
    const oferta = OFERTAS[x.pilar][faixa(x.nota)]
    fases[i < 2 ? i : 2].itens.push({ titulo: `${oferta.titulo} · ${x.pilar}`, descricao: oferta.descricao })
  })

  const { gaps } = calculo
  const acao = (tag: string) => (Object.hasOwn(ACOES_POR_REGULACAO, tag) ? ACOES_POR_REGULACAO[tag as Tag] : undefined)
  const regulacoes = Object.keys(gaps)
    .sort((a, b) => gaps[b] - gaps[a])
    .filter((t) => acao(t))
    .slice(0, 4)
    .map((t) => ({ titulo: rotuloDaTag(t), descricao: acao(t)!, gap: gaps[t] }))

  if (regulacoes.length) {
    fases[1].itens.push({
      titulo: 'Frente regulatória prioritária',
      descricao: `${regulacoes[0].titulo}: ${regulacoes[0].descricao}`,
    })
  }
  if (calculo.media >= 3.5) {
    fases[2].itens.push({
      titulo: 'IA sobre dados confiáveis',
      descricao:
        'Casos de uso de IA e analytics avançado sobre a base governada, com governança de modelos e dados de treinamento.',
    })
  }
  return { pilares, fases, regulacoes }
}

/** `roadmapText`: o roadmap numa linha, como o HTML manda ao CRM
 * ('Fase 1 (0 a 3 meses): A; B | Fase 2 …'). */
export function roadmapEmTexto(roadmap: Roadmap): string {
  return roadmap.fases.map((f) => `${f.fase} (${f.prazo}): ${f.itens.map((i) => i.titulo).join('; ')}`).join(' | ')
}

/* ---------------------------------------------------------------------
   Leitura do resultado (trechos de `renderResult`)
   --------------------------------------------------------------------- */

/** O número do cabeçalho "Nível N · Nome" (e a chave de `NIVEIS`): o dígito do
 * rótulo de `nivelDaMedia`, entre 1 e 5.
 *
 * ⚠️ **Desvio deliberado do original (D-38).** O HTML v1.7 arredonda a média
 * (`lvlNum = Math.round(overall)`), que discorda do rótulo em três faixas: média
 * em [1,5; 1,8) sairia "Nível 2 · Repetível" com rótulo '1 · Inicial'; em
 * [2,5; 2,6), 3 contra 2; em [4,3; 4,5), 4 contra 5. O rótulo é o que vai ao CRM,
 * e o lead não pode ler no e-mail um nível diferente do que o comercial vê —
 * então o número sai do rótulo. `motor.test.ts` prova que o desvio fica só
 * nessas três faixas; unificar no HTML fica com o Roger na próxima versão. */
export function nivelNumerico(media: number): NivelNumerico {
  return Number(nivelDaMedia(media).charAt(0)) as NivelNumerico
}

/* Os dois portes que o HTML trata como "grande empresa". */
const PORTES_GRANDES: readonly Porte[] = ['1_5bi', 'acima_5bi']

/** `bench`: a frase que segue a descrição do nível, lida pelo porte. */
export function leituraPeloPorte(media: number, porte: Porte): string {
  const grande = PORTES_GRANDES.includes(porte)
  return grande && media < 3
    ? 'Para o seu porte, esse nível está abaixo do esperado pelos pares e pelos reguladores.'
    : media >= 4
      ? 'Nível acima da média do mercado brasileiro.'
      : 'Nível compatível com a maioria das empresas do seu porte, com espaço claro de evolução.'
}

/** `weak` → bloco "O que está em jogo": até 3 pilares abaixo de 3,5, do mais
 * fraco para o mais forte, com a consequência prática de cada um. */
export function pilaresEmJogo(roadmap: Roadmap): { pilar: NomeDoPilar; nota: number; emJogo: string }[] {
  return roadmap.pilares
    .filter((x) => x.nota < 3.5)
    .slice(0, 3)
    .map((x) => ({ pilar: x.pilar, nota: x.nota, emJogo: O_QUE_ESTA_EM_JOGO[x.pilar] }))
}

/* ---------------------------------------------------------------------
   Contato
   --------------------------------------------------------------------- */

const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** A regra de `validateLead` para o e-mail: formato válido e domínio fora da
 * lista de e-mail pessoal do Roger.
 *
 * O original testa `input.value`, que o navegador já sanitizou (campo
 * `type="email"`: tira quebras de linha e espaço ASCII das pontas). No servidor o
 * valor chega cru pelo FormData, então a sanitização é refeita aqui — sem ela,
 * um espaço sobrando reprovaria no servidor o que o cliente aprovou. */
export function ehEmailCorporativo(email: string): boolean {
  const valor = email.replace(/[\r\n]/g, '').replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, '')
  const dominio = (valor.split('@')[1] || '').toLowerCase()
  return FORMATO_DE_EMAIL.test(valor) && !DOMINIOS_DE_EMAIL_BLOQUEADOS.includes(dominio)
}
