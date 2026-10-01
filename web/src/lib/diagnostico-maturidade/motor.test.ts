import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  codigoDe,
  extrairDados,
  isolarFuncao,
  isolarInicializador,
  lerHtml,
  mascarar,
} from '../../../scripts/diagnostico-maturidade/extrair-do-html.mjs'
import {
  ACOES_POR_REGULACAO,
  CARGOS,
  DOMINIOS_DE_EMAIL_BLOQUEADOS,
  NIVEIS,
  OFERTAS,
  O_QUE_ESTA_EM_JOGO,
  PERGUNTAS,
  PORTES,
  ROTULOS_DAS_TAGS,
  SETORES,
  TAGS_DO_SETOR,
  TAGS_INTERNAS,
  TAGS_UNIVERSAIS,
  TAGS_UNIVERSAIS_DO_PERFIL,
  VERSAO,
  calcular,
  ehCargo,
  ehEmailCorporativo,
  ehPorte,
  ehSetor,
  faixa,
  impactosDaPergunta,
  impactosDoSetor,
  leituraPeloPorte,
  montarRoadmap,
  nivelDaMedia,
  nivelNumerico,
  perguntasDoSetor,
  pilaresEmJogo,
  roadmapEmTexto,
  tagRelevante,
  validarRespostas,
  type Setor,
} from '.'
import { carregarOriginal, type RoadmapOriginal, type ScoresOriginal } from './original'

/* Tolerância zero: o esperado não é fixture escrita à mão, é o JS do HTML do
 * Roger rodando ao lado (ver `original.ts`). */
const html = lerHtml()
const original = carregarOriginal(html)

/* ---------------------------------------------------------------------
   Apoio
   --------------------------------------------------------------------- */

/* mulberry32 — pseudoaleatório com semente, para as combinações mistas serem as
 * mesmas em toda corrida e em toda máquina. */
function sorteador(semente: number) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Os cenários escolhem índices a partir das perguntas do ORIGINAL — o porte
 * recebe exatamente o mesmo `{ perguntaId: índice }`. */
type Cenario = { nome: string; respostas: (setor: Setor, n: number) => Record<string, number> }
const porIndice = (setor: Setor, escolher: (q: { id: string; alternativas: number }) => number | undefined) => {
  const saida: Record<string, number> = {}
  for (const q of original.perguntasDoSetor(setor)) {
    const i = escolher(q)
    if (i !== undefined) saida[q.id] = i
  }
  return saida
}
const CENARIOS: Cenario[] = [
  { nome: 'todas as primeiras alternativas', respostas: (s) => porIndice(s, () => 0) },
  { nome: 'todas as últimas alternativas', respostas: (s) => porIndice(s, (q) => q.alternativas - 1) },
  ...[1, 2, 3, 4, 5].map((semente) => ({
    nome: `mista, semente ${semente}`,
    respostas: (s: Setor, n: number) => {
      const sortear = sorteador(semente * 100 + n)
      return porIndice(s, (q) => Math.floor(sortear() * q.alternativas))
    },
  })),
  /* Além do pedido: o original aceita pergunta sem resposta (média 0 sem nenhuma). */
  { nome: 'nenhuma resposta', respostas: () => ({}) },
  {
    nome: 'metade respondida, semente 42',
    respostas: (s, n) => {
      const sortear = sorteador(4200 + n)
      return porIndice(s, (q) => (sortear() < 0.5 ? undefined : Math.floor(sortear() * q.alternativas)))
    },
  },
]

/* Formato do original → formato do porte. Chave nova no original derruba: sem
 * isso, um campo acrescentado numa v1.8 sumiria dos dois lados da comparação. */
function mesmasChaves(obj: object, chaves: string[], onde: string) {
  const tem = Object.keys(obj)
  if (tem.length !== chaves.length || !chaves.every((k) => tem.includes(k))) {
    throw new Error(`Paridade: ${onde} mudou de formato no HTML (${tem.join(', ')}); atualize o porte.`)
  }
}
function calculoComoNoPorte(o: ScoresOriginal) {
  mesmasChaves(o, ['overall', 'nivel', 'pilares', 'damas', 'gaps', 'topGaps'], 'computeScores')
  return { media: o.overall, nivel: o.nivel, pilares: o.pilares, damas: o.damas, gaps: o.gaps, topGaps: o.topGaps }
}
function roadmapComoNoPorte(o: RoadmapOriginal) {
  mesmasChaves(o, ['pilares', 'phases', 'regs'], 'buildRoadmap')
  return {
    pilares: o.pilares.map((x) => (mesmasChaves(x, ['p', 'v'], 'buildRoadmap.pilares'), { pilar: x.p, nota: x.v })),
    fases: o.phases.map((f) => {
      mesmasChaves(f, ['f', 'w', 'cls', 'items'], 'buildRoadmap.phases')
      return {
        fase: f.f,
        prazo: f.w,
        classe: f.cls,
        itens: f.items.map((i) => (mesmasChaves(i, ['t', 'd'], 'buildRoadmap.items'), { titulo: i.t, descricao: i.d })),
      }
    }),
    regulacoes: o.regs.map((r) => (mesmasChaves(r, ['t', 'd', 'g'], 'buildRoadmap.regs'), { titulo: r.t, descricao: r.d, gap: r.g })),
  }
}

/* As três faixas em que o HTML v1.7 discorda de si mesmo — rótulo por limiar,
 * cabeçalho por arredondamento — e em que o porte segue o rótulo (D-38). */
const FAIXAS_DO_D38: readonly [number, number][] = [
  [1.5, 1.8],
  [2.5, 2.6],
  [4.3, 4.5],
]
const naFaixaDoD38 = (media: number) => FAIXAS_DO_D38.some(([de, ate]) => media >= de && media < ate)

const SEM_ROADMAP: RoadmapOriginal = { pilares: [], phases: [], regs: [] }
const leituraDaMedia = (overall: number, porte: string) =>
  original.leitura({ overall } as ScoresOriginal, SEM_ROADMAP, porte)

/* ---------------------------------------------------------------------
   Base
   --------------------------------------------------------------------- */

describe('dados.ts × HTML v1.7', () => {
  it('dados.ts é a extração atual do HTML — se reprovar, regenerar com o extrator', () => {
    expect({
      versao: VERSAO,
      setores: SETORES,
      portes: PORTES,
      cargos: CARGOS,
      perguntas: PERGUNTAS,
      rotulosDasTags: ROTULOS_DAS_TAGS,
      tagsUniversais: TAGS_UNIVERSAIS,
      tagsDoSetor: TAGS_DO_SETOR,
      tagsInternas: TAGS_INTERNAS,
      tagsUniversaisDoPerfil: TAGS_UNIVERSAIS_DO_PERFIL,
      niveis: NIVEIS,
      ofertas: OFERTAS,
      acoesPorRegulacao: ACOES_POR_REGULACAO,
      oQueEstaEmJogo: O_QUE_ESTA_EM_JOGO,
      dominiosDeEmailBloqueados: DOMINIOS_DE_EMAIL_BLOQUEADOS,
    }).toEqual(extrairDados(html))
  })

  it('versão 1.7; 8 setores, 5 portes, 6 cargos; 33 perguntas', () => {
    expect(VERSAO).toBe('1.7')
    expect(SETORES).toHaveLength(8)
    expect(PORTES).toHaveLength(5)
    expect(CARGOS).toHaveLength(6)
    expect(PERGUNTAS).toHaveLength(33)
  })

  it('toda pergunta tem 4 alternativas com notas 1, 2, 3 e 5 — sem 4, como no original', () => {
    for (const q of PERGUNTAS) expect(q.alternativas.map((a) => a.nota)).toEqual([1, 2, 3, 5])
  })

  it('nenhum módulo do motor importa CMS, React ou API de navegador', () => {
    for (const arquivo of ['motor.ts', 'dados.ts', 'index.ts']) {
      const fonte = readFileSync(new URL(`./${arquivo}`, import.meta.url), 'utf8')
      const importados = [...fonte.matchAll(/\bfrom\s+'([^']+)'/g)].map((m) => m[1])
      expect(importados.every((m) => m.startsWith('./')), `${arquivo}: ${importados.join(', ')}`).toBe(true)
      /* Máscara do extrator: comentário e string não contam. */
      expect(mascarar(fonte)).not.toMatch(/\b(window|document|navigator|localStorage|sessionStorage)\b/)
    }
  })
})

/* O isolador casa delimitadores; um texto com `}` solto não pode enganá-lo, e o
 * que ele não acha tem que derrubar a paridade inteira, não passar em branco. */
describe('isolador do HTML', () => {
  it('ignora chave e ponto e vírgula dentro de string, comentário, regex e template', () => {
    const codigo = codigoDe(
      [
        "var A = { t: 'fecha } aqui; e {abre', u: \"}}\", r: /[};]{2,}/g, s: `x ${ { a: 1 }.a } }` /* } ; */ };",
        '// function f( — comentário não conta',
        'function f(a) { if (a) { return "}" } return /{/.test(a) }',
      ].join('\n'),
    )
    expect(isolarInicializador(codigo, 'A')).toMatch(/^\{ t: .*\*\/ \}$/)
    expect(isolarFuncao(codigo, 'f').fonte).toBe('function f(a) { if (a) { return "}" } return /{/.test(a) }')
  })

  it('função ou declaração ausente derruba com o nome do que faltou', () => {
    expect(() => carregarOriginal(html.replace('function computeScores(', 'function calcularNotas('))).toThrow(
      /function computeScores\(/,
    )
    expect(() => carregarOriginal(html.replace('var bench =', 'var leitura ='))).toThrow(/var bench =/)
    expect(() => extrairDados(html.replace('var STAKES =', 'var RISCOS ='))).toThrow(/var STAKES =/)
  })

  it('declaração duplicada também derruba — não escolhe uma', () => {
    const duplicado = html.replace('function band(v)', 'function band(v){ return 0; }\n  function band(v)')
    expect(() => carregarOriginal(duplicado)).toThrow(/achei 2/)
  })
})

/* ---------------------------------------------------------------------
   Paridade por setor
   --------------------------------------------------------------------- */

/* O README do Roger (§12) fala em 15 a 18 por setor. */
const PERGUNTAS_POR_SETOR: Record<Setor, number> = {
  financeiro: 18,
  capitais: 16,
  seguros: 16,
  saude: 16,
  telecom: 16,
  educacao: 17,
  varejo: 15,
  outros: 15,
}

describe.each(SETORES.map((s, n) => ({ setor: s.valor, n })))('setor $setor', ({ setor, n }) => {
  it(`${PERGUNTAS_POR_SETOR[setor]} perguntas, na ordem que buildQuestions monta`, () => {
    const porte = perguntasDoSetor(setor)
    const doOriginal = original.perguntasDoSetor(setor)
    expect(porte.map((q) => q.id)).toEqual(doOriginal.map((q) => q.id))
    expect(porte.map((q) => q.alternativas.length)).toEqual(doOriginal.map((q) => q.alternativas))
    expect(porte).toHaveLength(PERGUNTAS_POR_SETOR[setor])
    expect(porte.length).toBeGreaterThanOrEqual(15)
    expect(porte.length).toBeLessThanOrEqual(18)
  })

  it('tagRelevante = tagRelevant, para toda tag do HTML (e uma que não existe)', () => {
    for (const tag of [...original.tags, 'tag_inexistente']) {
      expect(tagRelevante(setor, tag), tag).toBe(original.tagRelevante(setor, tag))
    }
  })

  it('impactos do setor = sectorImpactChips', () => {
    expect(impactosDoSetor(setor)).toStrictEqual(original.impactosDoSetor(setor))
  })

  it('impactos de cada pergunta = tagChips', () => {
    for (const q of perguntasDoSetor(setor)) {
      expect(impactosDaPergunta(q, setor), q.id).toStrictEqual(original.impactosDaPergunta(setor, q.id))
    }
  })

  it.each(CENARIOS)('paridade com computeScores, buildRoadmap e renderResult — $nome', ({ respostas: gerar }) => {
    const respostas = gerar(setor, n)

    const o = original.calcular(setor, respostas)
    const p = calcular(setor, respostas)
    expect(p).toStrictEqual(calculoComoNoPorte(o))
    /* A ordem das chaves desempata o top 3 e a frente regulatória: tem que ser a mesma. */
    expect(Object.keys(p.gaps)).toEqual(Object.keys(o.gaps))
    expect(Object.keys(p.pilares)).toEqual(Object.keys(o.pilares))
    expect(Object.keys(p.damas)).toEqual(Object.keys(o.damas))

    const rmOriginal = original.montarRoadmap(o)
    const rm = montarRoadmap(p)
    expect(rm).toStrictEqual(roadmapComoNoPorte(rmOriginal))
    expect(roadmapEmTexto(rm)).toBe(original.roadmapEmTexto(rmOriginal))

    /* D-38: número e nome do nível saem do rótulo, que é o que vai ao CRM. */
    const numero = nivelNumerico(p.media)
    expect(`${numero} · ${NIVEIS[numero].nome}`).toBe(p.nivel)

    for (const { valor: porte } of PORTES) {
      const leitura = original.leitura(o, rmOriginal, porte)
      if (naFaixaDoD38(p.media)) {
        expect(numero).not.toBe(leitura.lvlNum)
      } else {
        expect(numero).toBe(leitura.lvlNum)
        expect(NIVEIS[numero]).toStrictEqual({ nome: leitura.L.n, descricao: leitura.L.d })
      }
      expect(leituraPeloPorte(p.media, porte), porte).toBe(leitura.bench)
      expect(pilaresEmJogo(rm)).toStrictEqual(leitura.weak.map((x) => ({ pilar: x.p, nota: x.v, emJogo: x.stake })))
    }
  })
})

/* ---------------------------------------------------------------------
   Limiares
   --------------------------------------------------------------------- */

describe('limiares, de 0 a 5 em passos de 0,01', () => {
  const medias = Array.from({ length: 501 }, (_, i) => i / 100)

  it('nível (computeScores) e faixa (band)', () => {
    for (const m of medias) {
      expect(nivelDaMedia(m), String(m)).toBe(original.nivelDaMedia(m))
      expect(faixa(m), String(m)).toBe(original.faixa(m))
    }
  })

  it('leitura pelo porte (renderResult), em todos os portes', () => {
    for (const m of medias) {
      for (const { valor: porte } of PORTES) {
        expect(leituraPeloPorte(m, porte), `${m} ${porte}`).toBe(leituraDaMedia(m, porte).bench)
      }
    }
  })

  it('número do nível sempre concorda com o rótulo (D-38)', () => {
    for (const m of medias) {
      expect(`${nivelNumerico(m)} · ${NIVEIS[nivelNumerico(m)].nome}`, String(m)).toBe(nivelDaMedia(m))
    }
  })

  /* O original (`lvlNum`) arredonda a média e discorda do próprio rótulo. O porte
   * segue o rótulo de propósito (D-38); este teste prova que o desvio é
   * exatamente nas três faixas — nem uma média a mais, nem a menos. Quando o HTML
   * unificar o critério, ele reprova: é a hora de voltar a exigir igualdade. */
  it('número do nível difere do lvlNum do original só nas três faixas do D-38', () => {
    for (const m of medias) {
      const difere = nivelNumerico(m) !== leituraDaMedia(m, 'ate_50mi').lvlNum
      expect(difere, String(m)).toBe(naFaixaDoD38(m))
    }
  })

  it.each([
    [1.5, '1 · Inicial', 2],
    [1.79, '1 · Inicial', 2],
    [2.5, '2 · Repetível', 3],
    [2.59, '2 · Repetível', 3],
    [4.3, '5 · Otimizado', 4],
    [4.49, '5 · Otimizado', 4],
  ])('média %s: rótulo "%s" e cabeçalho do mesmo nível; o original dizia Nível %s', (media, nivel, doOriginal) => {
    expect(nivelDaMedia(media)).toBe(nivel)
    expect(original.nivelDaMedia(media)).toBe(nivel)
    expect(nivelNumerico(media)).toBe(Number(nivel.charAt(0)))
    expect(leituraDaMedia(media, 'ate_50mi').lvlNum).toBe(doOriginal)
  })
})

/* ---------------------------------------------------------------------
   Contato
   --------------------------------------------------------------------- */

describe('ehEmailCorporativo', () => {
  it('recusa os 13 domínios de e-mail pessoal da lista do Roger, em qualquer caixa', () => {
    expect(original.dominiosBloqueados).toHaveLength(13)
    for (const dominio of original.dominiosBloqueados) {
      expect(ehEmailCorporativo(`ana@${dominio}`), dominio).toBe(false)
      expect(ehEmailCorporativo(`ana@${dominio.toUpperCase()}`), dominio).toBe(false)
    }
  })

  it('aceita e-mail corporativo', () => {
    expect(ehEmailCorporativo('ana@banco.com.br')).toBe(true)
    expect(ehEmailCorporativo('ana.souza@seguradora.com')).toBe(true)
  })

  it('recusa formato inválido (mesma regex do validateLead)', () => {
    for (const email of ['', 'ana', 'ana@banco', '@banco.com.br', 'ana@@banco.com.br', 'ana souza@banco.com.br', 'ana@banco.c']) {
      expect(ehEmailCorporativo(email), email).toBe(false)
    }
  })

  it('ignora espaço nas pontas, como o input type="email" do navegador', () => {
    expect(ehEmailCorporativo('  ana@banco.com.br \n')).toBe(true)
    expect(ehEmailCorporativo(' ana@gmail.com ')).toBe(false)
  })
})

/* ---------------------------------------------------------------------
   Contrato das respostas
   --------------------------------------------------------------------- */

describe('respostas inválidas são ignoradas, não quebram', () => {
  const base = { gov_estrategia: 0, qual_mdm: 1, conf_fin_rc18: 2, seg_acesso: 3 }
  const semEstrategia = { qual_mdm: 1, conf_fin_rc18: 2, seg_acesso: 3 }

  it('pergunta que não existe', () => {
    expect(calcular('financeiro', { ...base, pergunta_inexistente: 0 })).toStrictEqual(calcular('financeiro', base))
  })

  it('pergunta de outro setor', () => {
    expect(calcular('financeiro', { ...base, conf_sau_tiss: 0 })).toStrictEqual(calcular('financeiro', base))
  })

  it.each([4, 99, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('índice fora do intervalo (%s)', (indice) => {
    expect(calcular('financeiro', { ...base, gov_estrategia: indice })).toStrictEqual(
      calcular('financeiro', semEstrategia),
    )
  })

  it('validarRespostas deixa só pergunta do setor com índice válido, aceitando dígitos em texto', () => {
    expect(
      validarRespostas('financeiro', {
        gov_estrategia: '3',
        qual_mdm: 0,
        conf_fin_rc18: 4,
        seg_acesso: ' 1',
        conf_sau_tiss: 0,
        inexistente: 1,
        qual_regras: 1.5,
        qual_confianca: '2.0',
      }),
    ).toEqual({ gov_estrategia: 3, qual_mdm: 0 })
  })

  it('validarRespostas tolera entrada que não é objeto', () => {
    expect(validarRespostas('financeiro', null)).toEqual({})
    expect(validarRespostas('financeiro', 'gov_estrategia=1')).toEqual({})
    expect(validarRespostas('financeiro', 42)).toEqual({})
  })

  it('setor, porte e cargo só valem com os códigos do HTML', () => {
    expect(ehSetor('financeiro')).toBe(true)
    expect(ehSetor('Financeiro')).toBe(false)
    expect(ehSetor('all')).toBe(false)
    expect(ehPorte('1_5bi')).toBe(true)
    expect(ehPorte('')).toBe(false)
    expect(ehCargo('cio_cto_cdo')).toBe(true)
    expect(ehCargo(undefined)).toBe(false)
  })
})
