import type { Field, GlobalAfterChangeHook, Payload, TaskConfig } from 'payload'

import { provedorDeTraducao } from './traducao'
import { idiomasLigados, FILA_DE_TRADUCAO } from './traducao-automatica'

/* D-77 (28/10): os textos de Configuração — menu, rodapé, painel do menu,
 * aviso de cookies, ATRA AI — também se traduzem sozinhos para o espanhol.
 *
 * O plugin de tradução não sabe traduzir global (D-74), e no inglês esses
 * textos foram escritos à mão no admin. No espanhol não há quem escreva: sem
 * isto, o `/es` abriria com o menu e o rodapé em português, pelo fallback.
 *
 * Mesmo Gemini, mesma fila e mesmo interruptor do espanhol (Sistema →
 * Integrações). Salvar o global em português pede a tradução; a tarefa lê o
 * português e grava o espanhol inteiro — **sobrescreve**, como a tradução das
 * collections, e global não tem a trava "revisado à mão". O inglês fica fora:
 * é escrito à mão, e retraduzir apagaria esse trabalho.
 *
 * ⚠️ Fora de propósito, campo a campo:
 * - `consentNotice` (ATRA AI): é o texto que prova o consentimento do lead
 *   (LGPD), e texto jurídico não se gera (P-14). O espanhol mostra o português
 *   pelo fallback até alguém escrever;
 * - os globais sem texto de visitante: Aparência, Contato, Integrações,
 *   Rastreamento;
 * - o do Diagnóstico de Maturidade: o texto do questionário mora no código e é
 *   traduzido à mão, com revisão do Roger e da Taciane (D-76). O texto do
 *   global vai junto, no mesmo padrão (`PADRAO_DO_DIAGNOSTICO_*`), e uma
 *   tradução do Gemini aqui passaria por cima do revisado. */

export const GLOBAIS_TRADUZIDOS = [
  'navigation',
  'footer',
  'conversion-panel',
  'cookie-consent',
  'atra-ai',
  'site-settings',
] as const

/** Os idiomas em que os globais se traduzem sozinhos. Só o espanhol: ver acima. */
export const IDIOMAS_DOS_GLOBAIS = ['es'] as const
type IdiomaDoGlobal = (typeof IDIOMAS_DOS_GLOBAIS)[number]

const CAMPOS_FORA = new Set(['consentNotice'])

export const TAREFA_DE_GLOBAL = 'traduzir-global'

/* A escrita da própria tarefa, para o gancho não pedir outra tradução. */
const ESCRITA_DA_TAREFA = 'atraTraducaoDeGlobal'

type Caminho = (string | number)[]
type Achado = { caminho: Caminho; texto: string }

/**
 * Os textos localizados de um global, com o caminho de cada um no documento.
 * Só `text` e `textarea`: os globais não têm texto rico, e o resto (link,
 * ícone, número, relação) não é tradução.
 */
export function textosLocalizados(fields: readonly Field[], dados: unknown, caminho: Caminho = [], herdado = false): Achado[] {
  if (!dados || typeof dados !== 'object') return []
  const doc = dados as Record<string, unknown>
  return fields.flatMap((campo): Achado[] => {
    const localizado = herdado || ('localized' in campo && campo.localized === true)
    switch (campo.type) {
      case 'text':
      case 'textarea': {
        const valor = doc[campo.name]
        if (!localizado || CAMPOS_FORA.has(campo.name) || typeof valor !== 'string' || !valor.trim()) return []
        return [{ caminho: [...caminho, campo.name], texto: valor }]
      }
      case 'group':
        return 'name' in campo && campo.name
          ? textosLocalizados(campo.fields, doc[campo.name], [...caminho, campo.name], localizado)
          : textosLocalizados(campo.fields, doc, caminho, localizado)
      case 'row':
      case 'collapsible':
        return textosLocalizados(campo.fields, doc, caminho, herdado)
      case 'tabs':
        return campo.tabs.flatMap((aba) =>
          'name' in aba && aba.name
            ? textosLocalizados(aba.fields, doc[aba.name], [...caminho, aba.name], herdado || aba.localized === true)
            : textosLocalizados(aba.fields, doc, caminho, herdado),
        )
      case 'array': {
        const linhas = doc[campo.name]
        if (!Array.isArray(linhas)) return []
        return linhas.flatMap((linha, i) => textosLocalizados(campo.fields, linha, [...caminho, campo.name, i], localizado))
      }
      case 'blocks': {
        const linhas = doc[campo.name]
        if (!Array.isArray(linhas)) return []
        return linhas.flatMap((linha, i) => {
          const tipo = (linha as { blockType?: string })?.blockType
          const bloco = campo.blocks.find((b) => b.slug === tipo)
          return bloco ? textosLocalizados(bloco.fields, linha, [...caminho, campo.name, i], localizado) : []
        })
      }
      default:
        return []
    }
  })
}

function gravar(alvo: Record<string, unknown>, caminho: Caminho, valor: string) {
  let atual: Record<string | number, unknown> = alvo
  for (const parte of caminho.slice(0, -1)) atual = atual[parte] as Record<string | number, unknown>
  atual[caminho[caminho.length - 1]] = valor
}

/**
 * Traduz um global e grava no idioma de destino.
 *
 * ⚠️ O espanhol vai com o documento português **inteiro**, ids de linha
 * incluídos, só com os textos trocados. As listas dos globais (itens do menu,
 * colunas do rodapé) não são localizadas — só os textos dentro delas —, e
 * reenviar uma lista sem os ids de cada linha cria linhas novas e deixa o texto
 * do outro idioma órfão: a armadilha do `casarIds` (`scripts/seed/ids.ts`).
 */
export async function traduzirGlobal(payload: Payload, slug: string, alvo: IdiomaDoGlobal): Promise<number> {
  const config = payload.config.globals.find((g) => g.slug === slug)
  if (!config) throw new Error(`[traducao-de-global] global desconhecido: ${slug}`)

  const pt = (await payload.findGlobal({ slug: slug as never, locale: 'pt', depth: 0 })) as Record<string, unknown>
  const achados = textosLocalizados(config.fields, pt)
  if (achados.length === 0) return 0

  const traduzido = await provedorDeTraducao.translate(
    Object.fromEntries(achados.map((a, i) => [i, a.texto])),
    'pt',
    alvo,
  )
  if (!traduzido) throw new Error(`[traducao-de-global] o Gemini não devolveu a tradução de ${slug}`)

  const dados = structuredClone(pt)
  for (const chave of ['id', 'globalType', 'createdAt', 'updatedAt']) delete dados[chave]
  achados.forEach((a, i) => {
    const texto = traduzido[i]
    if (typeof texto === 'string' && texto.trim()) gravar(dados, a.caminho, texto)
  })

  await payload.updateGlobal({
    slug: slug as never,
    locale: alvo,
    data: dados as never,
    depth: 0,
    context: { [ESCRITA_DA_TAREFA]: true },
  })
  return achados.length
}

/** A tarefa da fila. Um global por vez, como os documentos. */
export const tarefaDeTraducaoDeGlobal: TaskConfig = {
  slug: TAREFA_DE_GLOBAL,
  inputSchema: [
    { name: 'global', type: 'text', required: true },
    { name: 'alvo', type: 'text', required: true },
  ],
  retries: { attempts: 4, backoff: { type: 'exponential', delay: 60_000 } },
  handler: async ({ input, req }) => {
    const { global, alvo } = input as { global: string; alvo: IdiomaDoGlobal }
    const textos = await traduzirGlobal(req.payload, global, alvo)
    req.payload.logger.info(`[traducao-de-global] ${global} → ${alvo}: ${textos} textos`)
    return { output: {} }
  },
}

/** Pede a tradução de um global, na fila da tradução. */
export async function pedirTraducaoDeGlobal(payload: Payload, global: string, alvo: IdiomaDoGlobal, req?: Parameters<Payload['jobs']['queue']>[0]['req']) {
  await payload.jobs.queue({ task: TAREFA_DE_GLOBAL as never, queue: FILA_DE_TRADUCAO, input: { global, alvo } as never, req })
}

const semMetadados = (doc: unknown) =>
  JSON.stringify(doc, (chave, valor) => (chave === 'updatedAt' || chave === 'createdAt' ? undefined : valor))

/* Salvar o global em português, com o interruptor do idioma ligado e a chave
 * no ambiente, pede a tradução. A escrita da própria tarefa não pede outra. */
export const pedirTraducaoAoSalvar: GlobalAfterChangeHook = async ({ doc, previousDoc, req, global }) => {
  if ((req.context as Record<string, unknown>)[ESCRITA_DA_TAREFA] === true) return doc
  if (req.locale !== 'pt' || !process.env.GEMINI_API_KEY?.trim()) return doc
  if (semMetadados(previousDoc) === semMetadados(doc)) return doc
  const ligados = await idiomasLigados(req)
  for (const alvo of IDIOMAS_DOS_GLOBAIS) {
    if (ligados.has(alvo)) await pedirTraducaoDeGlobal(req.payload, global.slug, alvo, req)
  }
  return doc
}
