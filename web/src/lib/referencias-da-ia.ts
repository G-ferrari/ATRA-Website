import type { ConteudoRecomendavel, ReferenciasDaIa } from '@/types/content'

/* A resposta da ATRA AI, conferida contra o catálogo (D-60).
 *
 * O modelo é instruído a citar conteúdo só pelo código e a não escrever
 * endereço (`lib/instrucao-da-ia.ts`). Isto aqui é o que faz a regra valer
 * mesmo quando ele desobedece — por descuido, ou porque o visitante pediu: o
 * que sai para a tela são só cartões de itens que **existem** e links que
 * **estão** no catálogo. O resto vira texto simples.
 *
 * ⚠️ Roda no servidor, antes de a resposta sair. O navegador recebe o texto já
 * limpo e o mapa código → {título, resumo, endereço}; ele não tem como montar
 * um link que o servidor não mandou. */

export type RespostaConferida = { texto: string; referencias: ReferenciasDaIa }

/** Maiúsculas, sem acento e sem pontuação: para casar título e código. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
}

/** Sem query, sem âncora e sem barra no fim: `/solucoes/x/?a=1#b` → `/solucoes/x`. */
function caminhoLimpo(caminho: string): string {
  const semResto = caminho.split(/[?#]/)[0]
  return semResto.length > 1 ? semResto.replace(/\/+$/, '') : semResto
}

/**
 * O caminho, se o endereço é do próprio site; `null` se é de fora ou não é
 * endereço. `origens` são os hosts que contam como "o site" — o de produção e o
 * do ambiente, porque o modelo às vezes escreve o endereço completo.
 */
function caminhoInterno(url: string, origens: ReadonlySet<string>): string | null {
  if (url.startsWith('/') && !url.startsWith('//')) return caminhoLimpo(url)
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return origens.has(u.hostname.replace(/^www\./, '')) ? caminhoLimpo(u.pathname) : null
  } catch {
    return null
  }
}

/** Host sem `www.`, de uma URL ou de um nome de host; `null` se não der. */
function hostDe(origem: string): string | null {
  try {
    return new URL(origem.includes('://') ? origem : `https://${origem}`).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function resolverReferencias(
  texto: string,
  catalogo: readonly ConteudoRecomendavel[],
  origens: readonly (string | undefined)[] = [],
): RespostaConferida {
  const porCodigo = new Map(catalogo.map((item) => [item.codigo.toUpperCase(), item]))
  const porEndereco = new Map(catalogo.map((item) => [caminhoLimpo(item.href), item]))
  /* Só soluções e segmentos: é o que a etiqueta antiga recomendava. */
  const porTitulo = new Map(
    catalogo.filter((item) => item.tipo === 'solucao' || item.tipo === 'segmento').map((item) => [normalizar(item.titulo), item]),
  )
  const hosts = new Set(origens.map((o) => (o ? hostDe(o) : null)).filter((h): h is string => Boolean(h)))

  const referencias: ReferenciasDaIa = {}
  const citar = (item: ConteudoRecomendavel): string => {
    referencias[item.codigo] = { tipo: item.tipo, titulo: item.titulo, resumo: item.resumo, href: item.href }
    return `[UI_CONTEUDO:${item.codigo}]`
  }

  let saida = texto

  /* 1. A etiqueta nova. Aceita o acento e a caixa que o modelo às vezes troca
        (`[UI_CONTEÚDO:s12]`); código que não está no catálogo some. */
  saida = saida.replace(/\[UI_CONTE[UÚ]DO:\s*([^\]\s]+)\s*\]/gi, (_, codigo: string) => {
    const item = porCodigo.get(codigo.toUpperCase())
    return item ? citar(item) : ''
  })

  /* 2. A etiqueta antiga, de resposta que ainda siga o texto do protótipo. Se o
        título é o de uma solução ou segmento publicado, vira o cartão ligado;
        senão fica como estava — o cartão sem link que a tela ainda desenha. */
  saida = saida.replace(/\[UI_SERVICE:([^:\]]+)(?::[^\]]*)?\]/g, (etiqueta: string, titulo: string) => {
    const item = porTitulo.get(normalizar(titulo))
    return item ? citar(item) : etiqueta
  })

  /* 3. Imagem em markdown: o navegador buscaria o endereço que o modelo
        escreveu, de qualquer servidor. Fica só o texto alternativo. */
  saida = saida.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')

  /* 4. Link em markdown: fica o que aponta para um item do catálogo, já com o
        endereço do catálogo; qualquer outro perde o link e mantém o texto. */
  saida = saida.replace(/\[([^\]]+)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g, (_, rotulo: string, url: string) => {
    const caminho = caminhoInterno(url, hosts)
    const item = caminho ? porEndereco.get(caminho) : undefined
    return item ? `[${rotulo}](${item.href})` : rotulo
  })

  /* Etiqueta removida não pode deixar um buraco de três linhas no texto. */
  saida = saida.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()

  return { texto: saida, referencias }
}
