/* As funções ORIGINAIS do questionário do Roger, rodando em Node — só para os
 * testes de paridade (task 022). Não importar fora de `*.test.ts`: depende de
 * `node:vm` e de ler `docs/` do disco.
 *
 * Por que rodar o original em vez de gravar resultados esperados: uma fixture
 * escrita à mão só prova que o porte concorda com quem escreveu a fixture. Aqui
 * o esperado sai do próprio JS do HTML, isolado do `<script>` pelo mesmo
 * isolador do extrator (`scripts/diagnostico-maturidade/extrair-do-html.mjs`) e
 * avaliado num contexto `vm` com:
 *   - as constantes do HTML (não as de `dados.ts` — senão um erro de extração
 *     passaria dos dois lados);
 *   - um `state` falso, montado como `next()` monta ao sair da tela de perfil;
 *   - um DOM de mentira, só onde a função toca o DOM (`buildQuestions`).
 * O que em `renderResult` é conta no meio do HTML (`lvlNum`, `bench`, `weak`) é
 * isolado declaração a declaração e reembrulhado numa função com `sc`, `rm` e
 * `porte` por parâmetro — `porte` no original vem do `<select>`.
 *
 * Qualquer peça que o isolador não ache derruba `carregarOriginal()` com a razão:
 * paridade contra a função errada seria pior que paridade nenhuma.
 */

import vm from 'node:vm'

import {
  isolarFuncao,
  isolarInicializador,
  lerHtml,
  scriptDoQuiz,
} from '../../../scripts/diagnostico-maturidade/extrair-do-html.mjs'

/* ---------------------------------------------------------------------
   Formatos do original (nomes de campo do HTML)
   --------------------------------------------------------------------- */

export interface ScoresOriginal {
  overall: number
  nivel: string
  pilares: Record<string, number>
  damas: Record<string, number>
  gaps: Record<string, number>
  topGaps: string[]
}
export interface RoadmapOriginal {
  pilares: { p: string; v: number }[]
  phases: { f: string; w: string; cls: string; items: { t: string; d: string }[] }[]
  regs: { t: string; d: string; g: number }[]
}
export interface LeituraOriginal {
  lvlNum: number
  L: { n: string; d: string }
  bench: string
  /** `weak` com o texto de `STAKES[x.p]` que o HTML mostra ao lado. */
  weak: { p: string; v: number; stake: string }[]
}
export interface EtiquetaOriginal {
  tag: string
  rotulo: string
}

interface QuestaoOriginal {
  id: string
  sectors: string[]
  options: { s: number; t: string; tags: string[] }[]
}
interface TelaFalsa {
  atributos: Record<string, string>
  innerHTML: string
}
/* O que existe dentro do contexto depois de avaliar o script montado abaixo. */
interface Contexto {
  state: { step: number; sector: string; active: QuestaoOriginal[]; answers: Record<string, unknown> }
  __telas: TelaFalsa[]
  CONFIG: { blockedEmailDomains: string[] }
  QUESTIONS: QuestaoOriginal[]
  TAG_LABELS: Record<string, string>
  SECTOR_TAGS: Record<string, string[]>
  tagRelevant(tag: string): boolean
  tagChips(q: QuestaoOriginal): string
  buildQuestions(setor: string): void
  sectorImpactChips(setor: string): string
  computeScores(): ScoresOriginal
  band(v: number): string
  buildRoadmap(sc: ScoresOriginal): RoadmapOriginal
  roadmapText(rm: RoadmapOriginal): string
  __nivel(overall: number): string
  __leitura(sc: ScoresOriginal, rm: RoadmapOriginal, porte: string): LeituraOriginal
}

export interface Original {
  dominiosBloqueados: string[]
  /** Todas as tags que o HTML conhece (rótulos, alternativas, listas por setor). */
  tags: string[]
  /** Perguntas que `buildQuestions(setor)` monta, na ordem das telas. */
  perguntasDoSetor(setor: string): { id: string; alternativas: number }[]
  tagRelevante(setor: string, tag: string): boolean
  impactosDoSetor(setor: string): EtiquetaOriginal[]
  impactosDaPergunta(setor: string, perguntaId: string): EtiquetaOriginal[]
  /** `computeScores` depois de clicar, em cada pergunta do setor, a alternativa do índice dado. */
  calcular(setor: string, respostas: Record<string, number>): ScoresOriginal
  nivelDaMedia(overall: number): string
  faixa(v: number): string
  montarRoadmap(sc: ScoresOriginal): RoadmapOriginal
  roadmapEmTexto(rm: RoadmapOriginal): string
  leitura(sc: ScoresOriginal, rm: RoadmapOriginal, porte: string): LeituraOriginal
}

const DECLARACOES = [
  'CONFIG', 'QUESTIONS', 'TAG_LABELS', 'UNIVERSAL_TAGS', 'SECTOR_TAGS', 'INTERNAL_TAGS', 'PROFILE_UNIVERSAL',
  'LEVELS', 'OFFERS', 'REG_ACTIONS', 'STAKES',
]
const FUNCOES = [
  'tagRelevant', 'tagChips', 'buildQuestions', 'sectorImpactChips', 'computeScores', 'band', 'buildRoadmap', 'roadmapText',
]

const ETIQUETA = /<span data-tag="([^"]*)">([^<]*)<\/span>/g

/* Lê as etiquetas `<span data-tag>` de um HTML do original e confere que o resto
 * é exatamente a moldura esperada — se o Roger mudar a marcação, o teste para em
 * vez de ler etiqueta a menos. */
function lerEtiquetas(html: string, moldura: RegExp, onde: string): EtiquetaOriginal[] {
  const etiquetas = [...html.matchAll(ETIQUETA)].map((m) => ({ tag: m[1], rotulo: m[2] }))
  const resto = html.replace(ETIQUETA, '')
  if (!moldura.test(resto)) {
    throw new Error(`Paridade: a marcação de ${onde} mudou no HTML e não sei mais ler as etiquetas: ${resto}`)
  }
  return etiquetas
}

export function carregarOriginal(html: string = lerHtml()): Original {
  const script = scriptDoQuiz(html)
  const computeScores = isolarFuncao(script, 'computeScores')
  const renderResult = isolarFuncao(script, 'renderResult')

  const fonte = [
    ...DECLARACOES.map((nome) => `var ${nome} = ${isolarInicializador(script, nome)};`),
    'var state = { step: 0, sector: "", active: [], answers: {} };',
    /* `buildQuestions` remove as telas antigas (não há), cria uma `<section>` por
     * pergunta e a insere antes da tela de contato. As telas vão para uma lista. */
    'var __telas = [];',
    'var body = { querySelectorAll: function () { return []; }, querySelector: function () { return null; },',
    '  insertBefore: function (tela) { __telas.push(tela); } };',
    'var document = { createElement: function () {',
    '  return { atributos: {}, innerHTML: "", setAttribute: function (k, v) { this.atributos[k] = String(v); } }; } };',
    ...FUNCOES.map((nome) => isolarFuncao(script, nome).fonte),
    `function __nivel(overall) { return ${isolarInicializador(computeScores, 'nivel')}; }`,
    'function __leitura(sc, rm, porte) {',
    `  var lvlNum = ${isolarInicializador(renderResult, 'lvlNum')};`,
    `  var L = ${isolarInicializador(renderResult, 'L')};`,
    `  var bigCo = ${isolarInicializador(renderResult, 'bigCo')};`,
    `  var bench = ${isolarInicializador(renderResult, 'bench')};`,
    `  var weak = ${isolarInicializador(renderResult, 'weak')};`,
    '  return { lvlNum: lvlNum, L: L, bench: bench,',
    '    weak: weak.map(function (x) { return { p: x.p, v: x.v, stake: STAKES[x.p] }; }) };',
    '}',
  ].join('\n')

  const ctx = vm.createContext({}) as unknown as Contexto
  try {
    vm.runInContext(fonte, ctx as unknown as vm.Context, { filename: 'diagnostico-original.js', timeout: 5000 })
  } catch (erro) {
    throw new Error(`Paridade: o JS isolado do HTML não avalia — o isolador cortou no lugar errado? ${String(erro)}`)
  }

  /* Objeto criado dentro do `vm` tem outro `Object.prototype`; o clone traz para cá. */
  const trazer = <T>(v: T): T => structuredClone(v)

  const entrarNoSetor = (setor: string) => {
    ctx.state = { step: 0, sector: setor, active: [], answers: {} }
    ctx.__telas = []
    ctx.buildQuestions(setor)
    const telas = ctx.__telas.map((t) => t.atributos['data-qid'])
    const ativas = ctx.state.active.map((q) => q.id)
    if (telas.join() !== ativas.join()) throw new Error(`Paridade: telas e state.active divergem em ${setor}.`)
  }

  const tags = new Set<string>([
    ...Object.keys(ctx.TAG_LABELS),
    ...ctx.QUESTIONS.flatMap((q) => q.options.flatMap((o) => o.tags)),
    ...Object.values(ctx.SECTOR_TAGS).flat(),
  ])

  return {
    dominiosBloqueados: trazer(ctx.CONFIG.blockedEmailDomains),
    tags: [...tags],

    perguntasDoSetor(setor) {
      entrarNoSetor(setor)
      return ctx.state.active.map((q) => ({ id: q.id, alternativas: q.options.length }))
    },

    tagRelevante(setor, tag) {
      ctx.state = { step: 0, sector: setor, active: [], answers: {} }
      return ctx.tagRelevant(tag)
    },

    impactosDoSetor(setor) {
      return lerEtiquetas(ctx.sectorImpactChips(setor), /^<span class="etc">entre outros<\/span>$/, 'sectorImpactChips')
    },

    impactosDaPergunta(setor, perguntaId) {
      ctx.state = { step: 0, sector: setor, active: [], answers: {} }
      const q = ctx.QUESTIONS.find((x) => x.id === perguntaId)
      if (!q) throw new Error(`Paridade: pergunta ${perguntaId} não existe no HTML.`)
      const etiquetas = lerEtiquetas(
        ctx.tagChips(q),
        /^<div class="aq-tags"[^>]*><span class="dama"[^>]*>DAMA · [^<]*<\/span><span class="lb">Impacta:<\/span><\/div>$/,
        'tagChips',
      )
      /* Sem regulação do setor, o HTML põe uma etiqueta fixa no lugar. */
      return etiquetas.length === 1 && etiquetas[0].tag === 'base' ? [] : etiquetas
    },

    calcular(setor, respostas) {
      entrarNoSetor(setor)
      for (const q of ctx.state.active) {
        if (!Object.hasOwn(respostas, q.id)) continue
        const indice = respostas[q.id]
        const o = q.options[indice]
        if (!o) throw new Error(`Paridade: índice ${indice} não existe em ${q.id} — o gerador de respostas errou.`)
        /* O que o clique grava: os `data-*` do botão, que `buildQuestions` escreveu
         * como texto (`'' + o.s`, `o.tags.join(',')`) e o handler lê de volta. */
        ctx.state.answers[q.id] = {
          score: +String(o.s),
          tags: o.tags.join(',').split(',').filter(Boolean),
          idx: indice,
          label: o.t,
        }
      }
      return trazer(ctx.computeScores())
    },

    nivelDaMedia: (overall) => ctx.__nivel(overall),
    faixa: (v) => ctx.band(v),
    montarRoadmap: (sc) => trazer(ctx.buildRoadmap(sc)),
    roadmapEmTexto: (rm) => ctx.roadmapText(rm),
    leitura: (sc, rm, porte) => trazer(ctx.__leitura(sc, rm, porte)),
  }
}
