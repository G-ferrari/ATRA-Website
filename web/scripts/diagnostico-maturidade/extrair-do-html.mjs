/* Extrator da base do Diagnóstico de Maturidade de Dados (task 022).
 *
 * Lê o questionário do Roger — `docs/02-especificacao/diagnostico-maturidade/
 * atra-diagnostico-maturidade-dados.html` — e grava
 * `src/lib/diagnostico-maturidade/dados.ts`.
 *
 * ⚠️ Por que gerar e não transcrever: são 33 perguntas × 4 alternativas × tags,
 * mais ~40 textos de resultado. Transcrição à mão é onde entra erro silencioso
 * (uma vírgula, um "5" corrigido para "4"), e os textos são decisão de conteúdo
 * do marketing (D-22) — têm que sair caractere a caractere. Aqui o dado é
 * **avaliado** como o navegador avaliaria, em `node:vm`, e reescrito.
 *
 * O isolador também é usado por `src/lib/diagnostico-maturidade/original.ts`,
 * que roda as funções originais do HTML nos testes de paridade. Um isolador só,
 * para que extração e paridade não discordem sobre onde uma declaração termina.
 *
 * Rodar (de `web/`, ou no contêiner em `/app`):
 *   node scripts/diagnostico-maturidade/extrair-do-html.mjs
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import vm from 'node:vm'

/* ⚠️ Relativo a este arquivo, não ao `cwd`. Nativo, `web/scripts/…` sobe três
 * níveis até a raiz do repositório; no contêiner, `/app/scripts/…` sobe até `/`,
 * onde o compose monta `docs/` em `/docs`. O mesmo caminho serve aos dois — a
 * armadilha do `redirects.csv` (docs/ fora do contêiner) não se repete. */
export const CAMINHO_DO_HTML = fileURLToPath(
  new URL('../../../docs/02-especificacao/diagnostico-maturidade/atra-diagnostico-maturidade-dados.html', import.meta.url),
)
const DESTINO = fileURLToPath(new URL('../../src/lib/diagnostico-maturidade/dados.ts', import.meta.url))

/** @param {string} [caminho] */
export function lerHtml(caminho = CAMINHO_DO_HTML) {
  if (!existsSync(caminho)) {
    throw new Error(
      `Diagnóstico de maturidade: HTML de origem não encontrado em ${caminho}. ` +
        'No contêiner, `docs/` precisa estar montado em `/docs` (docker-compose.yml).',
    )
  }
  return readFileSync(caminho, 'utf8')
}

/* =====================================================================
   ISOLADOR
   ===================================================================== */

/** @typedef {{ fonte: string, mascara: string }} Codigo */

/* Casar chaves no texto cru quebra no primeiro `'}'` dentro de uma string, e o
 * HTML é cheio de texto livre. Por isso o isolador trabalha sobre uma **máscara**:
 * a mesma fonte, com o conteúdo de strings, comentários, regex e trechos
 * literais de template trocado por espaço (mesmo comprimento, então os índices
 * valem para a fonte original). Procurar e casar delimitadores na máscara é
 * seguro; recortar é feito na fonte. */

const PALAVRAS_ANTES_DE_REGEX = new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await',
])
const FECHA = { '(': ')', '[': ']', '{': '}' }

/** @param {string} fonte @param {number} indice */
function linhaDe(fonte, indice) {
  return fonte.slice(0, indice).split('\n').length
}

/** @param {string} fonte @returns {string} */
export function mascarar(fonte) {
  const n = fonte.length
  const saida = fonte.split('')
  const apagar = (/** @type {number} */ de, /** @type {number} */ ate) => {
    for (let k = de; k < ate; k++) if (saida[k] !== '\n') saida[k] = ' '
  }
  /* Profundidade de chaves no momento de cada `${` aberto — o `}` que a devolve
   * a esse valor fecha a interpolação, e o texto volta a ser literal. */
  /** @type {number[]} */
  const templates = []
  let chaves = 0
  /* Último token relevante: decide se `/` abre regex ou é divisão. */
  let ultimo = 'op'

  const lerTemplate = (/** @type {number} */ de) => {
    let k = de
    while (k < n) {
      const c = fonte[k]
      if (c === '\\') {
        k += 2
        continue
      }
      if (c === '`') {
        apagar(de, k)
        return k + 1
      }
      if (c === '$' && fonte[k + 1] === '{') {
        apagar(de, k)
        templates.push(chaves)
        chaves++
        return k + 2
      }
      k++
    }
    throw new Error(`Isolador: template literal sem fim (linha ${linhaDe(fonte, de)}).`)
  }

  let i = 0
  while (i < n) {
    const c = fonte[i]
    const d = fonte[i + 1]
    if (c === '/' && d === '/') {
      const f = fonte.indexOf('\n', i)
      const fim = f < 0 ? n : f
      apagar(i, fim)
      i = fim
      continue
    }
    if (c === '/' && d === '*') {
      const f = fonte.indexOf('*/', i + 2)
      if (f < 0) throw new Error(`Isolador: comentário sem fim (linha ${linhaDe(fonte, i)}).`)
      apagar(i, f + 2)
      i = f + 2
      continue
    }
    if (c === '"' || c === "'") {
      let k = i + 1
      while (k < n && fonte[k] !== c) {
        if (fonte[k] === '\n') throw new Error(`Isolador: string sem fim (linha ${linhaDe(fonte, i)}).`)
        k += fonte[k] === '\\' ? 2 : 1
      }
      if (k >= n) throw new Error(`Isolador: string sem fim (linha ${linhaDe(fonte, i)}).`)
      apagar(i + 1, k)
      i = k + 1
      ultimo = 'id'
      continue
    }
    if (c === '`') {
      i = lerTemplate(i + 1)
      ultimo = 'id'
      continue
    }
    if (c === '/' && ultimo === 'op') {
      let k = i + 1
      let classe = false
      for (;;) {
        if (k >= n || fonte[k] === '\n') throw new Error(`Isolador: regex sem fim (linha ${linhaDe(fonte, i)}).`)
        const r = fonte[k]
        if (r === '\\') {
          k += 2
          continue
        }
        if (classe) {
          if (r === ']') classe = false
        } else if (r === '[') classe = true
        else if (r === '/') break
        k++
      }
      k++
      while (k < n && /[a-z]/i.test(fonte[k])) k++
      apagar(i + 1, k)
      i = k
      ultimo = 'id'
      continue
    }
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (/[\w$]/.test(c)) {
      let k = i
      while (k < n && /[\w$]/.test(fonte[k])) k++
      ultimo = PALAVRAS_ANTES_DE_REGEX.has(fonte.slice(i, k)) ? 'op' : 'id'
      i = k
      continue
    }
    if (c === '{') chaves++
    if (c === '}') {
      chaves--
      if (templates.length && templates[templates.length - 1] === chaves) {
        templates.pop()
        i = lerTemplate(i + 1)
        ultimo = 'id'
        continue
      }
    }
    ultimo = c === ')' || c === ']' ? 'id' : 'op'
    i++
  }
  return saida.join('')
}

/** @param {string} fonte @returns {Codigo} */
export function codigoDe(fonte) {
  return { fonte, mascara: mascarar(fonte) }
}

/** @param {Codigo} codigo @param {number} de @param {number} ate @returns {Codigo} */
function recortar(codigo, de, ate) {
  return { fonte: codigo.fonte.slice(de, ate), mascara: codigo.mascara.slice(de, ate) }
}

/* ⚠️ Achar zero ou duas ocorrências tem que **derrubar**, não escolher uma: se o
 * Roger renomear ou duplicar uma função, a paridade compararia o port com a coisa
 * errada e passaria. */
/** @param {Codigo} codigo @param {RegExp} padrao @param {string} descricao */
function unica(codigo, padrao, descricao) {
  const achados = [...codigo.mascara.matchAll(padrao)]
  if (achados.length !== 1) {
    throw new Error(
      `Isolador: esperava exatamente 1 \`${descricao}\` no <script> do diagnóstico e achei ${achados.length}. ` +
        'O HTML do Roger mudou — ajuste o extrator e `original.ts` antes de confiar na paridade.',
    )
  }
  return /** @type {RegExpMatchArray & { index: number }} */ (achados[0])
}

/** Índice do delimitador que fecha o que abre em `inicio`. @param {string} mascara @param {number} inicio */
function fechamento(mascara, inicio) {
  /** @type {string[]} */
  const pilha = []
  for (let k = inicio; k < mascara.length; k++) {
    const c = mascara[k]
    if (c === '(' || c === '[' || c === '{') pilha.push(c)
    else if (c === ')' || c === ']' || c === '}') {
      const aberto = pilha.pop()
      if (!aberto || FECHA[/** @type {'(' | '[' | '{'} */ (aberto)] !== c) {
        throw new Error(`Isolador: \`${c}\` sem par na linha ${linhaDe(mascara, k)}.`)
      }
      if (!pilha.length) return k
    }
  }
  throw new Error(`Isolador: \`${mascara[inicio]}\` da linha ${linhaDe(mascara, inicio)} nunca fecha.`)
}

/** Texto de `function <nome>(…){…}`, do `function` ao `}` final.
 * @param {Codigo} codigo @param {string} nome @returns {Codigo} */
export function isolarFuncao(codigo, nome) {
  const achado = unica(codigo, new RegExp(`\\bfunction\\s+${nome}\\s*\\(`, 'g'), `function ${nome}(`)
  const abreParametros = achado.index + achado[0].length - 1
  const fechaParametros = fechamento(codigo.mascara, abreParametros)
  const abreCorpo = fechaParametros + 1 + codigo.mascara.slice(fechaParametros + 1).search(/\S/)
  if (codigo.mascara[abreCorpo] !== '{') {
    throw new Error(`Isolador: \`function ${nome}\` não tem corpo entre chaves.`)
  }
  return recortar(codigo, achado.index, fechamento(codigo.mascara, abreCorpo) + 1)
}

/** Expressão à direita de `var <nome> = …;`, sem o `;`.
 * @param {Codigo} codigo @param {string} nome @returns {string} */
export function isolarInicializador(codigo, nome) {
  const achado = unica(codigo, new RegExp(`\\bvar\\s+${nome}\\s*=(?!=)`, 'g'), `var ${nome} =`)
  const inicio = achado.index + achado[0].length
  /** @type {string[]} */
  const pilha = []
  for (let k = inicio; k < codigo.mascara.length; k++) {
    const c = codigo.mascara[k]
    if (c === '(' || c === '[' || c === '{') pilha.push(c)
    else if (c === ')' || c === ']' || c === '}') {
      const aberto = pilha.pop()
      if (!aberto || FECHA[/** @type {'(' | '[' | '{'} */ (aberto)] !== c) {
        throw new Error(`Isolador: \`var ${nome}\` não termina em \`;\` (sai do escopo na linha ${linhaDe(codigo.mascara, k)}).`)
      }
    } else if (!pilha.length && c === ';') {
      return codigo.fonte.slice(inicio, k).trim()
    } else if (!pilha.length && c === ',') {
      /* `var a = 1, b = 2` — o recorte levaria o `b` junto como se fosse do `a`. */
      throw new Error(`Isolador: \`var ${nome}\` está numa declaração múltipla; separe antes de extrair.`)
    }
  }
  throw new Error(`Isolador: \`var ${nome}\` não termina em \`;\`.`)
}

/** O único <script> que declara a base de perguntas. @param {string} html @returns {Codigo} */
export function scriptDoQuiz(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .filter((s) => /\bvar\s+QUESTIONS\s*=/.test(s))
  if (scripts.length !== 1) {
    throw new Error(`Diagnóstico de maturidade: esperava 1 <script> com \`var QUESTIONS\` e achei ${scripts.length}.`)
  }
  return codigoDe(scripts[0])
}

/* Avalia um literal isolado sem acesso a nada — nem `document`, nem `require`.
 * `structuredClone` traz o valor para o reino (realm) de quem chamou: objeto
 * criado dentro do `vm` tem outro `Object.prototype`. As quebras de linha em
 * volta evitam que um `// comentário` na última linha engula o parêntese. */
/** @param {string} expressao */
export function avaliar(expressao) {
  return structuredClone(vm.runInNewContext(`(\n${expressao}\n)`, {}, { timeout: 1000 }))
}

/* =====================================================================
   HTML FORA DO <script>
   ===================================================================== */

/** @param {string} html */
export function versaoDoQuiz(html) {
  const raiz = html.match(/<div\b[^>]*\bid="atra-quiz"[^>]*>/)
  const versao = raiz?.[0].match(/\bdata-version="([^"]+)"/)?.[1]
  if (!versao) throw new Error('Diagnóstico de maturidade: `data-version` do #atra-quiz não encontrado.')
  return versao
}

/** @param {string} texto */
function decodificarEntidades(texto) {
  const nomeadas = /** @type {Record<string, string>} */ ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })
  return texto.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (inteira, corpo) => {
    if (corpo[0] === '#') {
      return String.fromCodePoint(corpo[1].toLowerCase() === 'x' ? parseInt(corpo.slice(2), 16) : parseInt(corpo.slice(1), 10))
    }
    const valor = nomeadas[corpo]
    /* Entidade que este decodificador não conhece derruba: sair com `&hellip;`
     * literal na tela seria erro de conteúdo em silêncio. */
    if (valor === undefined) throw new Error(`Diagnóstico de maturidade: entidade HTML não tratada: ${inteira}`)
    return valor
  })
}

/* O `<option value="">Selecione…</option>` fica de fora: é o convite do campo,
 * não um setor/porte/cargo. */
/** @param {string} html @param {string} id @returns {{ valor: string, rotulo: string }[]} */
export function opcoesDoSelect(html, id) {
  const selects = [...html.matchAll(new RegExp(`<select\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</select>`, 'g'))]
  if (selects.length !== 1) throw new Error(`Diagnóstico de maturidade: esperava 1 <select id="${id}"> e achei ${selects.length}.`)
  const opcoes = [...selects[0][1].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/g)].map((m) => {
    const valor = m[1].match(/\bvalue="([^"]*)"/)?.[1]
    if (valor === undefined) throw new Error(`Diagnóstico de maturidade: <option> sem value em #${id}: ${m[0]}`)
    return { valor: decodificarEntidades(valor), rotulo: decodificarEntidades(m[2].trim()) }
  })
  const reais = opcoes.filter((o) => o.valor !== '')
  if (!reais.length) throw new Error(`Diagnóstico de maturidade: #${id} sem opções.`)
  return reais
}

/* =====================================================================
   DADOS
   ===================================================================== */

/* Nome no HTML → nome em `dados.ts`. Os **códigos** (tags, setores, pilares,
 * `low/mid/high`) seguem como estão no HTML; só os nomes de campo e de constante
 * vão para o português do resto de `web/src/lib`. */
const DECLARACOES = [
  'CONFIG', 'QUESTIONS', 'TAG_LABELS', 'UNIVERSAL_TAGS', 'SECTOR_TAGS', 'INTERNAL_TAGS', 'PROFILE_UNIVERSAL',
  'LEVELS', 'OFFERS', 'REG_ACTIONS', 'STAKES',
]

/* Conferir o formato com rigor é o que impede uma v1.8 com campo novo (um
 * `hint` na alternativa, digamos) de ser descartada sem ninguém ver. */
/** @param {unknown} valor @param {string[]} chaves @param {string} onde */
function conferirObjeto(valor, chaves, onde) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error(`${onde}: esperava objeto.`)
  const tem = Object.keys(valor)
  const sobra = tem.filter((k) => !chaves.includes(k))
  const falta = chaves.filter((k) => !tem.includes(k))
  if (sobra.length || falta.length) {
    throw new Error(`${onde}: formato mudou (sobra: ${sobra.join(', ') || '—'}; falta: ${falta.join(', ') || '—'}). Atualize o extrator e o motor.`)
  }
  return /** @type {Record<string, unknown>} */ (valor)
}
/** @param {unknown} valor @param {string} onde @returns {string} */
function texto(valor, onde) {
  if (typeof valor !== 'string') throw new Error(`${onde}: esperava texto.`)
  return valor
}
/** @param {unknown} valor @param {string} onde @returns {string[]} */
function listaDeTextos(valor, onde) {
  if (!Array.isArray(valor)) throw new Error(`${onde}: esperava lista.`)
  return valor.map((v, i) => texto(v, `${onde}[${i}]`))
}
/** @param {unknown} valor @param {string} onde @returns {Record<string, string>} */
function mapaDeTextos(valor, onde) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error(`${onde}: esperava objeto.`)
  return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, texto(v, `${onde}.${k}`)]))
}

/** Tudo o que `dados.ts` guarda, no formato em que ele guarda. @param {string} html */
export function extrairDados(html) {
  const script = scriptDoQuiz(html)
  /** @type {Record<string, unknown>} */
  const bruto = Object.fromEntries(DECLARACOES.map((nome) => [nome, avaliar(isolarInicializador(script, nome))]))

  const config = /** @type {Record<string, unknown>} */ (bruto.CONFIG)
  if (!config || typeof config !== 'object') throw new Error('CONFIG: esperava objeto.')

  if (!Array.isArray(bruto.QUESTIONS)) throw new Error('QUESTIONS: esperava lista.')
  const perguntas = bruto.QUESTIONS.map((q, i) => {
    const p = conferirObjeto(q, ['id', 'pilar', 'dama', 'sectors', 'text', 'options'], `QUESTIONS[${i}]`)
    if (!Array.isArray(p.options)) throw new Error(`QUESTIONS[${i}].options: esperava lista.`)
    return {
      id: texto(p.id, `QUESTIONS[${i}].id`),
      pilar: texto(p.pilar, `QUESTIONS[${i}].pilar`),
      dama: texto(p.dama, `QUESTIONS[${i}].dama`),
      setores: listaDeTextos(p.sectors, `QUESTIONS[${i}].sectors`),
      enunciado: texto(p.text, `QUESTIONS[${i}].text`),
      alternativas: p.options.map((o, j) => {
        const a = conferirObjeto(o, ['s', 't', 'tags'], `QUESTIONS[${i}].options[${j}]`)
        if (typeof a.s !== 'number' || !Number.isInteger(a.s)) throw new Error(`QUESTIONS[${i}].options[${j}].s: esperava inteiro.`)
        return { nota: a.s, texto: texto(a.t, `QUESTIONS[${i}].options[${j}].t`), tags: listaDeTextos(a.tags, `QUESTIONS[${i}].options[${j}].tags`) }
      }),
    }
  })

  const niveis = Object.fromEntries(
    Object.entries(/** @type {object} */ (bruto.LEVELS)).map(([k, v]) => {
      const n = conferirObjeto(v, ['n', 'd'], `LEVELS.${k}`)
      return [k, { nome: texto(n.n, `LEVELS.${k}.n`), descricao: texto(n.d, `LEVELS.${k}.d`) }]
    }),
  )
  const ofertas = Object.fromEntries(
    Object.entries(/** @type {object} */ (bruto.OFFERS)).map(([pilar, faixas]) => [
      pilar,
      Object.fromEntries(
        Object.entries(/** @type {object} */ (faixas)).map(([faixa, oferta]) => {
          const o = conferirObjeto(oferta, ['t', 'd'], `OFFERS.${pilar}.${faixa}`)
          return [faixa, { titulo: texto(o.t, `OFFERS.${pilar}.${faixa}.t`), descricao: texto(o.d, `OFFERS.${pilar}.${faixa}.d`) }]
        }),
      ),
    ]),
  )
  const tagsDoSetor = Object.fromEntries(
    Object.entries(/** @type {object} */ (bruto.SECTOR_TAGS)).map(([s, tags]) => [s, listaDeTextos(tags, `SECTOR_TAGS.${s}`)]),
  )

  return {
    versao: versaoDoQuiz(html),
    setores: opcoesDoSelect(html, 'aq-setor'),
    portes: opcoesDoSelect(html, 'aq-porte'),
    cargos: opcoesDoSelect(html, 'aq-cargo'),
    perguntas,
    rotulosDasTags: mapaDeTextos(bruto.TAG_LABELS, 'TAG_LABELS'),
    tagsUniversais: listaDeTextos(bruto.UNIVERSAL_TAGS, 'UNIVERSAL_TAGS'),
    tagsDoSetor,
    tagsInternas: listaDeTextos(bruto.INTERNAL_TAGS, 'INTERNAL_TAGS'),
    tagsUniversaisDoPerfil: listaDeTextos(bruto.PROFILE_UNIVERSAL, 'PROFILE_UNIVERSAL'),
    niveis,
    ofertas,
    acoesPorRegulacao: mapaDeTextos(bruto.REG_ACTIONS, 'REG_ACTIONS'),
    oQueEstaEmJogo: mapaDeTextos(bruto.STAKES, 'STAKES'),
    dominiosDeEmailBloqueados: listaDeTextos(config.blockedEmailDomains, 'CONFIG.blockedEmailDomains'),
  }
}

/* =====================================================================
   GERAÇÃO DE dados.ts
   ===================================================================== */

/** @param {string} s */
function aspas(s) {
  const escapes = /** @type {Record<string, string>} */ ({ '\\': '\\\\', "'": "\\'", '\n': '\\n', '\r': '\\r', '\t': '\\t' })
  return `'${s.replace(/[\\'\u0000-\u001f\u2028\u2029]/g, (c) => escapes[c] ?? `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)}'`
}
/** @param {string} k */
function chave(k) {
  return /^[\p{ID_Start}_$][\p{ID_Continue}$]*$/u.test(k) || /^(0|[1-9]\d*)$/.test(k) ? k : aspas(k)
}
/** Literal TS legível: objeto uma chave por linha, lista curta de primitivos inline.
 * @param {unknown} v @param {string} recuo @returns {string} */
function literal(v, recuo = '') {
  if (typeof v === 'string') return aspas(v)
  if (typeof v === 'number') return String(v)
  const dentro = `${recuo}  `
  if (Array.isArray(v)) {
    if (!v.length) return '[]'
    if (v.every((x) => typeof x !== 'object')) {
      const inline = `[${v.map((x) => literal(x)).join(', ')}]`
      if (inline.length <= 100) return inline
    }
    return `[\n${v.map((x) => `${dentro}${literal(x, dentro)},`).join('\n')}\n${recuo}]`
  }
  if (v && typeof v === 'object') {
    const pares = Object.entries(v)
    if (!pares.length) return '{}'
    const plano = pares.every(([, y]) => typeof y !== 'object' || (Array.isArray(y) && y.every((z) => typeof z !== 'object')))
    const inline = `{ ${pares.map(([k, y]) => `${chave(k)}: ${literal(y)}`).join(', ')} }`
    /* Alternativa numa linha só, mesmo longa: é a unidade que se revisa contra o
     * HTML, e lá ela também ocupa uma linha. */
    if (plano && ('nota' in v || inline.length <= 100)) return inline
    return `{\n${pares.map(([k, y]) => `${dentro}${chave(k)}: ${literal(y, dentro)},`).join('\n')}\n${recuo}}`
  }
  throw new Error(`Gerador: valor não suportado: ${String(v)}`)
}
/** @param {string[]} valores */
function uniao(valores) {
  return valores.map((v) => `\n  | ${typeof v === 'number' ? v : aspas(v)}`).join('')
}
/** @param {string[]} a @param {string[]} b */
function mesmoConjunto(a, b) {
  return a.length === b.length && a.every((x) => b.includes(x))
}

/** @param {ReturnType<typeof extrairDados>} d @returns {string} */
export function gerarModulo(d) {
  const setores = d.setores.map((s) => s.valor)
  const pilares = [...new Set(d.perguntas.map((q) => q.pilar))]
  const notas = [...new Set(d.perguntas.flatMap((q) => q.alternativas.map((a) => a.nota)))].sort((a, b) => a - b)
  const niveis = Object.keys(d.niveis)
  const faixas = Object.keys(Object.values(d.ofertas)[0] ?? {})
  const tags = [
    ...new Set([
      ...Object.keys(d.rotulosDasTags),
      ...d.perguntas.flatMap((q) => q.alternativas.flatMap((a) => a.tags)),
      ...d.tagsUniversais,
      ...Object.values(d.tagsDoSetor).flat(),
      ...d.tagsInternas,
      ...d.tagsUniversaisDoPerfil,
      ...Object.keys(d.acoesPorRegulacao),
    ]),
  ]

  /* Cada tipo abaixo é uma promessa que o TypeScript vai cobrar dos consumidores.
   * Se o dado não a cumpre, parar aqui com a razão é melhor que um tipo mentiroso. */
  const ids = d.perguntas.map((q) => q.id)
  if (new Set(ids).size !== ids.length) throw new Error('QUESTIONS: id repetido.')
  for (const q of d.perguntas) {
    const fora = q.setores.filter((s) => s !== 'all' && !setores.includes(s))
    if (fora.length) throw new Error(`QUESTIONS ${q.id}: setor fora do #aq-setor: ${fora.join(', ')}.`)
  }
  const setoresSemTags = Object.keys(d.tagsDoSetor).filter((s) => !setores.includes(s))
  if (setoresSemTags.length) throw new Error(`SECTOR_TAGS: setor fora do #aq-setor: ${setoresSemTags.join(', ')}.`)
  if (!mesmoConjunto(Object.keys(d.ofertas), pilares)) throw new Error('OFFERS: os pilares não são os das perguntas.')
  if (!mesmoConjunto(Object.keys(d.oQueEstaEmJogo), pilares)) throw new Error('STAKES: os pilares não são os das perguntas.')
  for (const [p, f] of Object.entries(d.ofertas)) {
    if (!mesmoConjunto(Object.keys(f), faixas)) throw new Error(`OFFERS.${p}: faixas diferentes das dos outros pilares.`)
  }
  if (!mesmoConjunto(niveis, ['1', '2', '3', '4', '5'])) throw new Error('LEVELS: esperava as chaves 1 a 5.')

  const rotulosCompletos = tags.every((t) => t in d.rotulosDasTags)
  const tagsDoSetorCompleto = mesmoConjunto(Object.keys(d.tagsDoSetor), setores)

  return `/* ⚠️ ARQUIVO GERADO — não editar à mão.
 *
 * Origem: docs/02-especificacao/diagnostico-maturidade/atra-diagnostico-maturidade-dados.html
 * (questionário do Roger, versão ${d.versao} — \`data-version\` do #atra-quiz).
 *
 * Regenerar, de \`web/\` (ou no contêiner, em \`/app\`):
 *   node scripts/diagnostico-maturidade/extrair-do-html.mjs
 *
 * Os textos saem caractere a caractere do HTML: conteúdo é decisão do marketing
 * (D-22), e correção de texto se faz no HTML de origem, não aqui. As notas das
 * alternativas são ${notas.join(', ')} — sem 4 — como no original.
 *
 * Nomes: constantes e campos em português; **códigos** (setor, porte, cargo,
 * tag, pilar, faixa) exatamente como no HTML. Equivalências:
 *   QUESTIONS → PERGUNTAS ({ id, pilar, dama, sectors → setores, text → enunciado,
 *     options → alternativas: { s → nota, t → texto, tags } })
 *   TAG_LABELS → ROTULOS_DAS_TAGS · UNIVERSAL_TAGS → TAGS_UNIVERSAIS
 *   SECTOR_TAGS → TAGS_DO_SETOR · INTERNAL_TAGS → TAGS_INTERNAS
 *   PROFILE_UNIVERSAL → TAGS_UNIVERSAIS_DO_PERFIL · LEVELS → NIVEIS ({ n → nome, d → descricao })
 *   OFFERS → OFERTAS ({ t → titulo, d → descricao }) · REG_ACTIONS → ACOES_POR_REGULACAO
 *   STAKES → O_QUE_ESTA_EM_JOGO · CONFIG.blockedEmailDomains → DOMINIOS_DE_EMAIL_BLOQUEADOS
 *   <select id="aq-setor|aq-porte|aq-cargo"> → SETORES | PORTES | CARGOS (sem o "Selecione…")
 *
 * \`motor.test.ts\` reextrai o HTML e compara com este arquivo: HTML novo sem
 * regenerar reprova o teste.
 */

export const VERSAO = ${aspas(d.versao)}

export type Setor =${uniao(setores)}
export type Porte =${uniao(d.portes.map((p) => p.valor))}
export type Cargo =${uniao(d.cargos.map((c) => c.valor))}
export type NomeDoPilar =${uniao(pilares)}
export type PerguntaId =${uniao(ids)}
export type Tag =${uniao(tags)}
export type Nota = ${notas.join(' | ')}
export type NivelNumerico = ${niveis.join(' | ')}
/** Faixa de maturidade das ofertas: baixa < 2,6 · média < 3,5 · alta (\`band\` no HTML). */
export type Faixa =${uniao(faixas)}

export interface OpcaoDoPerfil<V extends string> {
  readonly valor: V
  readonly rotulo: string
}
export interface Alternativa {
  readonly nota: Nota
  readonly texto: string
  readonly tags: readonly Tag[]
}
export interface Pergunta {
  readonly id: PerguntaId
  readonly pilar: NomeDoPilar
  /** Área de conhecimento DAMA-DMBOK. */
  readonly dama: string
  /** \`'all'\` = transversal; senão, só aparece para os setores listados. */
  readonly setores: readonly (Setor | 'all')[]
  readonly enunciado: string
  readonly alternativas: readonly Alternativa[]
}
export interface Nivel {
  readonly nome: string
  readonly descricao: string
}
export interface Oferta {
  readonly titulo: string
  readonly descricao: string
}

export const SETORES: readonly OpcaoDoPerfil<Setor>[] = ${literal(d.setores)}

export const PORTES: readonly OpcaoDoPerfil<Porte>[] = ${literal(d.portes)}

export const CARGOS: readonly OpcaoDoPerfil<Cargo>[] = ${literal(d.cargos)}

export const PERGUNTAS: readonly Pergunta[] = ${literal(d.perguntas)}

export const ROTULOS_DAS_TAGS: Readonly<${rotulosCompletos ? 'Record' : 'Partial<Record'}<Tag, string>${rotulosCompletos ? '' : '>'}> = ${literal(d.rotulosDasTags)}

/** Tags que contam em qualquer setor. */
export const TAGS_UNIVERSAIS: readonly Tag[] = ${literal(d.tagsUniversais)}

/** Reguladores relevantes por setor: pergunta transversal só mostra (e só soma gap para) estes e os universais. */
export const TAGS_DO_SETOR: Readonly<${tagsDoSetorCompleto ? 'Record' : 'Partial<Record'}<Setor, readonly Tag[]>${tagsDoSetorCompleto ? '' : '>'}> = ${literal(d.tagsDoSetor)}

/** Temas internos: pontuam gap, mas não viram etiqueta "Impacta:" na pergunta. */
export const TAGS_INTERNAS: readonly Tag[] = ${literal(d.tagsInternas)}

/** Primeiras etiquetas de "Impactos avaliados" na tela de perfil, em qualquer setor. */
export const TAGS_UNIVERSAIS_DO_PERFIL: readonly Tag[] = ${literal(d.tagsUniversaisDoPerfil)}

export const NIVEIS: Readonly<Record<NivelNumerico, Nivel>> = ${literal(d.niveis)}

/** Oferta da ATRA por pilar e faixa de maturidade. */
export const OFERTAS: Readonly<Record<NomeDoPilar, Readonly<Record<Faixa, Oferta>>>> = ${literal(d.ofertas)}

/** Ação recomendada por regulação (prazo e frente de trabalho). */
export const ACOES_POR_REGULACAO: Readonly<Partial<Record<Tag, string>>> = ${literal(d.acoesPorRegulacao)}

/** Consequência prática de cada pilar fraco — bloco "O que está em jogo". */
export const O_QUE_ESTA_EM_JOGO: Readonly<Record<NomeDoPilar, string>> = ${literal(d.oQueEstaEmJogo)}

/** Domínios de e-mail pessoal recusados no contato (lista do Roger). */
export const DOMINIOS_DE_EMAIL_BLOQUEADOS: readonly string[] = ${literal(d.dominiosDeEmailBloqueados)}
`
}

/* =====================================================================
   EXECUÇÃO DIRETA
   ===================================================================== */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dados = extrairDados(lerHtml())
  writeFileSync(DESTINO, gerarModulo(dados))
  const porSetor = dados.setores
    .map((s) => `${s.valor} ${dados.perguntas.filter((q) => q.setores.includes('all') || q.setores.includes(s.valor)).length}`)
    .join(' · ')
  console.log(`✓ dados.ts gerado — versão ${dados.versao}, ${dados.perguntas.length} perguntas (${porSetor}).`)
}
