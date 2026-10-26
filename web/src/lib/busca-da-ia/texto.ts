/* O texto de um documento do CMS, para a busca da ATRA AI (D-73).
 *
 * Um extrator só para todas as collections, e não um por bloco: são dezenas de
 * blocos, e a lista escrita à mão mentiria no primeiro bloco novo — o texto
 * dele simplesmente não entraria na busca, sem erro nenhum. Aqui o caminho é o
 * inverso: entra toda string do documento, menos o que é sabidamente
 * estrutura (id, slug, endereço, estilo, valor de lista de opções).
 *
 * ⚠️ O preço do jeito largo é algum ruído — o rótulo de um botão, um selo.
 * Ruído pesa pouco num trecho de mil caracteres; texto que falta não aparece
 * em lugar nenhum. Quando um campo novo for só estrutura, ele entra em
 * `IGNORAR`, e não o contrário. */

/** Chaves cujo valor nunca é texto para ler: estrutura, endereço, aparência. */
const IGNORAR = new Set([
  'id',
  'blockType',
  'blockName',
  'slug',
  'anchor',
  'href',
  'url',
  'videoUrl',
  'embedUrl',
  'icon',
  'theme',
  'variant',
  'align',
  'mediaMode',
  'ctaVariant',
  'descriptionWidth',
  'borda',
  'spacing',
  'style',
  'format',
  'mode',
  'direction',
  'type',
  'kind',
  'category',
  'masterOf',
  'navLabel',
  'label',
  'caption',
  'color',
  'email',
  'phone',
  'whatsapp',
  '_status',
  'createdAt',
  'updatedAt',
  'publishedAt',
  /* O SEO repete título e resumo, que já entram pelos campos da página. */
  'seo',
])

/** Valor de lista de opções (`surface-1`, `dark-centered`) e afins. */
const IDENTIFICADOR = /^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/
const ENDERECO = /^(?:https?:|mailto:|tel:|\/|#)/

function ehTexto(valor: string): boolean {
  const limpo = valor.trim()
  if (!limpo || !/\p{L}/u.test(limpo)) return false
  if (IDENTIFICADOR.test(limpo) || ENDERECO.test(limpo)) return false
  return true
}

/* Os nós do Lexical que viram um parágrafo cada. O resto (texto, link, negrito)
   é trecho de linha e se junta ao parágrafo de cima. */
const BLOCOS_DO_LEXICAL = new Set(['paragraph', 'heading', 'quote', 'listitem', 'tablecell'])

type No = { type?: string; text?: string; children?: No[] }

function emLinha(no: No): string {
  if (typeof no.text === 'string') return no.text
  return (no.children ?? []).map(emLinha).join('')
}

function paragrafosDoLexical(no: No, saida: string[]): void {
  if (no.type && BLOCOS_DO_LEXICAL.has(no.type)) {
    /* Item com sublista: o texto do item é um parágrafo, e cada item da
       sublista, outro. */
    const filhos = no.children ?? []
    saida.push(filhos.filter((f) => f.type !== 'list').map(emLinha).join(''))
    for (const lista of filhos.filter((f) => f.type === 'list')) paragrafosDoLexical(lista, saida)
    return
  }
  for (const filho of no.children ?? []) paragrafosDoLexical(filho, saida)
}

function ehLexical(valor: object): valor is { root: No } {
  const root = (valor as { root?: unknown }).root
  return typeof root === 'object' && root !== null && Array.isArray((root as No).children)
}

function percorrer(valor: unknown, chave: string, saida: string[]): void {
  if (IGNORAR.has(chave)) return
  if (typeof valor === 'string') {
    if (ehTexto(valor)) saida.push(valor)
    return
  }
  if (Array.isArray(valor)) {
    for (const item of valor) percorrer(item, chave, saida)
    return
  }
  if (typeof valor !== 'object' || valor === null) return
  if (ehLexical(valor)) {
    paragrafosDoLexical(valor.root, saida)
    return
  }
  for (const [k, v] of Object.entries(valor)) percorrer(v, k, saida)
}

/** Os parágrafos do documento, na ordem em que aparecem, sem repetição. */
export function paragrafosDoDocumento(doc: unknown): string[] {
  const brutos: string[] = []
  percorrer(doc, '', brutos)

  const vistos = new Set<string>()
  const paragrafos: string[] = []
  for (const bruto of brutos) {
    const limpo = bruto.replace(/\s+/g, ' ').trim()
    if (!limpo || !ehTexto(limpo) || vistos.has(limpo)) continue
    vistos.add(limpo)
    paragrafos.push(limpo)
  }
  return paragrafos
}

/* ~1.200 caracteres: cabe uma ideia inteira (um desafio e a solução de um
 * case, uma seção de artigo) sem diluir a busca. Trecho grande demais casa com
 * tudo um pouco; pequeno demais perde o contexto do que diz. */
export const TAMANHO_DO_TRECHO = 1200

/* Teto por documento. O artigo mais longo do blog dá ~25 trechos; o teto existe
 * para um documento anômalo (uma tabela colada inteira) não custar centenas de
 * embeddings a cada publicação. */
export const MAX_TRECHOS_POR_DOCUMENTO = 40

/** Parte um parágrafo longo em frases, e uma frase longa em palavras. */
function emPedacos(paragrafo: string, tamanho: number): string[] {
  if (paragrafo.length <= tamanho) return [paragrafo]
  const pedacos: string[] = []
  let atual = ''
  for (const frase of paragrafo.split(/(?<=[.!?;:])\s+/)) {
    const partes = frase.length <= tamanho ? [frase] : (frase.match(new RegExp(`.{1,${tamanho}}(?:\\s|$)`, 'g')) ?? [frase])
    for (const parte of partes) {
      if (atual && atual.length + 1 + parte.length > tamanho) {
        pedacos.push(atual)
        atual = ''
      }
      atual = atual ? `${atual} ${parte.trim()}` : parte.trim()
    }
  }
  if (atual) pedacos.push(atual)
  return pedacos
}

/**
 * Os trechos que vão para o índice. Cada um começa pelo título do documento:
 * "Prazo de 3 meses" não diz nada sozinho, e com o título na frente o trecho
 * casa com a pergunta sobre aquele case.
 */
export function dividirEmTrechos(
  titulo: string,
  paragrafos: readonly string[],
  tamanho = TAMANHO_DO_TRECHO,
  maximo = MAX_TRECHOS_POR_DOCUMENTO,
): string[] {
  const cabecalho = titulo.trim()
  const corpo = paragrafos.filter((p) => p !== cabecalho).flatMap((p) => emPedacos(p, tamanho))
  if (corpo.length === 0) return cabecalho ? [cabecalho] : []

  const trechos: string[] = []
  let atual = ''
  for (const pedaco of corpo) {
    if (atual && atual.length + 1 + pedaco.length > tamanho) {
      trechos.push(atual)
      atual = ''
    }
    atual = atual ? `${atual}\n${pedaco}` : pedaco
  }
  if (atual) trechos.push(atual)

  return trechos.slice(0, maximo).map((t) => (cabecalho ? `${cabecalho}\n\n${t}` : t))
}
