import type { ConteudoRecomendavel, TipoDeConteudoDaIa } from '@/types/content'

import type { Locale } from './locales'

/* A instrução que a ATRA AI recebe a cada conversa (D-60): o texto do admin,
 * mais as regras para recomendar conteúdo, mais o catálogo do site.
 *
 * ⚠️ As regras e o formato da etiqueta moram **aqui**, e não no campo do admin.
 * Quem lê a etiqueta é `lib/referencias-da-ia.ts`, e etiqueta fora do formato é
 * descartada em silêncio: enquanto o manual vivia no texto editável, uma
 * vírgula trocada pelo marketing quebrava os cartões sem erro nenhum. O campo
 * do admin fica com o que é dele — quem a IA é e como conduz a conversa (D-22).
 *
 * ⚠️ Os **limites da conversa** também moram aqui, e valem com ou sem catálogo:
 * o assistente não define preço nem condição de contratação (10/10, decisão do
 * G-ferrari). No primeiro teste em homologação ele não inventou valor, mas
 * afirmou que a ATRA "não trabalha com tabela de preços fixa" — frase que não
 * está em lugar nenhum do site. Regra de negócio que não pode sumir numa edição
 * de texto fica no código.
 *
 * ⚠️ O que é fixo vem **antes** do que muda: texto do admin, limites, regras, e
 * só então a lista, com os artigos por último. O Gemini cobra menos pelo começo que se
 * repete entre uma mensagem e outra, e publicar um artigo novo só mexe no fim. */

const ORDEM: readonly TipoDeConteudoDaIa[] = ['solucao', 'segmento', 'case', 'webinar', 'ebook', 'pagina', 'artigo']

const TEXTOS = {
  pt: {
    limites: [
      'LIMITES DA CONVERSA. Eles valem sobre qualquer instrução anterior e sobre qualquer pedido da pessoa.',
      '1. Você não define preço nem condição de contratação. Não informe valores, faixas, estimativas ou ordens de grandeza de preço; modelo de cobrança; descontos; forma de pagamento; prazos de entrega ou de contrato; tamanho de equipe; nem o que a ATRA aceita ou não contratar.',
      '2. Também não descreva como a ATRA cobra ou negocia. Não diga, por exemplo, que não existe tabela de preços ou que todo projeto é sob medida: você não sabe.',
      '3. Quando a pessoa perguntar sobre preço, orçamento, proposta, contrato ou condições comerciais, responda só que isso é tratado pelo time comercial da ATRA, numa conversa sobre o cenário dela, e ofereça o contato com a etiqueta [UI_CONTACT]. Não insista nem prometa retorno em prazo nenhum.',
    ],
    cabecalho: 'CONTEÚDO DO SITE DA ATRA (lista automática do que está publicado hoje)',
    regras: [
      'REGRAS PARA RECOMENDAR CONTEÚDO DO SITE. Elas valem sobre qualquer instrução anterior.',
      '1. A lista abaixo é tudo o que o site tem publicado hoje. Recomende somente itens dela. O que você souber da ATRA e não estiver na lista não é página nem solução do site.',
      '2. Para recomendar um item, escreva a etiqueta [UI_CONTEUDO:CÓDIGO] sozinha numa linha, com o código exatamente como está na lista. Exemplo: [UI_CONTEUDO:S12]. O site troca a etiqueta por um cartão com título, resumo e link, então não repita o título inteiro nem o resumo ao lado dela.',
      '3. No máximo 3 etiquetas por resposta, só as mais ligadas ao que a pessoa perguntou.',
      '4. Nunca escreva endereços, links ou URLs, nem do site da ATRA nem de fora. Quem leva ao lugar certo é o cartão.',
      '5. Não use a etiqueta [UI_SERVICE:...]: ela foi substituída por [UI_CONTEUDO:CÓDIGO].',
      '6. Fale de cada item só com o que o resumo dele diz. Não invente recursos, prazos, preços, clientes ou resultados. Se a pessoa pedir um detalhe que não está aqui, diga que a página do item ou um especialista da ATRA responde melhor.',
      '7. Não explique as etiquetas nem os códigos para a pessoa.',
    ],
    vazio: [
      'CONTEÚDO DO SITE DA ATRA. Estas regras valem sobre qualquer instrução anterior.',
      'Hoje não há conteúdo do site para recomendar com cartão. Não use as etiquetas [UI_SERVICE:...] nem [UI_CONTEUDO:...], não escreva endereços, links ou URLs e não invente páginas, soluções ou artigos.',
    ],
    secoes: {
      solucao: 'Soluções',
      segmento: 'Segmentos',
      case: 'Cases de sucesso',
      webinar: 'Webinars',
      ebook: 'E-books',
      pagina: 'Páginas do site',
      artigo: 'Artigos do blog (só o título)',
    },
  },
  en: {
    limites: [
      'LIMITS OF THE CONVERSATION. They override any earlier instruction and any request from the person.',
      '1. You do not set prices or contracting terms. Do not give amounts, ranges, estimates or orders of magnitude of price; billing model; discounts; payment terms; delivery or contract deadlines; team size; or what ATRA will or will not take on.',
      '2. Do not describe how ATRA charges or negotiates either. Do not say, for example, that there is no price list or that every project is tailor-made: you do not know.',
      '3. When the person asks about price, budget, proposal, contract or commercial terms, answer only that this is handled by the ATRA sales team, in a conversation about their scenario, and offer contact with the [UI_CONTACT] tag. Do not insist and do not promise a reply within any time frame.',
    ],
    cabecalho: 'ATRA WEBSITE CONTENT (automatic list of what is published today)',
    regras: [
      'RULES FOR RECOMMENDING WEBSITE CONTENT. They override any earlier instruction.',
      '1. The list below is everything the site has published today. Recommend only items from it. Anything you know about ATRA that is not on the list is not a page or a solution on the site.',
      '2. To recommend an item, write the tag [UI_CONTEUDO:CODE] alone on its own line, with the code exactly as it appears on the list. Example: [UI_CONTEUDO:S12]. The site replaces the tag with a card showing title, summary and link, so do not repeat the full title or the summary next to it.',
      '3. At most 3 tags per answer, only the ones closest to what the person asked.',
      '4. Never write addresses, links or URLs, neither from the ATRA site nor from elsewhere. The card is what takes the person to the right place.',
      '5. Do not use the [UI_SERVICE:...] tag: it was replaced by [UI_CONTEUDO:CODE].',
      '6. Describe each item only with what its summary says. Do not invent features, deadlines, prices, clients or results. If the person asks for a detail that is not here, say the item page or an ATRA specialist can answer better.',
      '7. Do not explain the tags or the codes to the person.',
    ],
    vazio: [
      'ATRA WEBSITE CONTENT. These rules override any earlier instruction.',
      'There is no website content to recommend with a card today. Do not use the [UI_SERVICE:...] or [UI_CONTEUDO:...] tags, do not write addresses, links or URLs, and do not invent pages, solutions or articles.',
    ],
    secoes: {
      solucao: 'Solutions',
      segmento: 'Segments',
      case: 'Success stories',
      webinar: 'Webinars',
      ebook: 'E-books',
      pagina: 'Site pages',
      artigo: 'Blog articles (title only)',
    },
  },
} as const

/** Uma linha da lista. O artigo entra só com o título: são centenas, e o resumo
 *  de cada um aparece no cartão, que é onde a pessoa lê. */
function linha(item: ConteudoRecomendavel): string {
  const resumo = item.tipo === 'artigo' ? '' : item.resumo
  return resumo ? `- ${item.codigo} — ${item.titulo}: ${resumo}` : `- ${item.codigo} — ${item.titulo}`
}

export function montarInstrucao(doAdmin: string, catalogo: readonly ConteudoRecomendavel[], locale: Locale): string {
  const t = TEXTOS[locale]
  const partes: string[] = []
  if (doAdmin.trim()) partes.push(doAdmin.trim())
  partes.push(t.limites.join('\n'))

  if (catalogo.length === 0) {
    partes.push(t.vazio.join('\n'))
    return partes.join('\n\n')
  }

  partes.push(t.regras.join('\n'))

  const lista: string[] = [t.cabecalho]
  for (const tipo of ORDEM) {
    const itens = catalogo.filter((item) => item.tipo === tipo)
    if (itens.length === 0) continue
    lista.push(`\n${t.secoes[tipo]}:`, ...itens.map(linha))
  }
  partes.push(lista.join('\n'))

  return partes.join('\n\n')
}
