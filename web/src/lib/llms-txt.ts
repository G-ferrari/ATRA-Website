import type { ConteudoRecomendavel, TipoDeConteudoDaIa } from '@/types/content'

/* `/llms.txt` (GEO, D-80): um resumo do site em Markdown, para assistentes de
 * IA que leem o site para responder sobre a ATRA.
 *
 * ⚠️ É **proposta**, não padrão (llmstxt.org, Jeremy Howard, 2024), e o Google
 * diz com todas as letras que não usa: "não é preciso criar arquivos de texto
 * para IA" para aparecer nos recursos dele. Entra porque custa pouco — a lista
 * já existe, é o catálogo da ATRA AI (D-60) — e porque agentes que leem o site
 * para responder a uma pergunta recebem o mapa em vez de garimpar HTML.
 *
 * Só o que já está publicado e tem endereço, nada escrito aqui: o resumo do
 * topo é a descrição da página inicial no admin (D-22, o texto é do
 * marketing). */

/** O formato pede um H2 por grupo de links. A ordem é a do menu do site. */
const GRUPOS: { tipo: TipoDeConteudoDaIa; titulo: string }[] = [
  { tipo: 'pagina', titulo: 'Páginas' },
  { tipo: 'solucao', titulo: 'Soluções' },
  { tipo: 'segmento', titulo: 'Segmentos atendidos' },
  { tipo: 'case', titulo: 'Cases de sucesso' },
  { tipo: 'parceiro', titulo: 'Parceiros de tecnologia' },
  { tipo: 'webinar', titulo: 'Webinars' },
  { tipo: 'ebook', titulo: 'E-books' },
]

/** Os artigos vão em "Optional", que o formato reserva para o que pode ser
 *  pulado quando falta espaço. Teto para o arquivo não virar o blog inteiro. */
export const MAX_ARTIGOS_NO_LLMS_TXT = 100

/* Markdown de uma linha: quebra e colchete no título quebrariam o link. */
const linha = (texto: string) => texto.replace(/\s+/g, ' ').replace(/[[\]]/g, '').trim()

function item(c: ConteudoRecomendavel, origem: string): string {
  const resumo = linha(c.resumo)
  return `- [${linha(c.titulo)}](${origem}${c.href})${resumo ? `: ${resumo}` : ''}`
}

export function montarLlmsTxt(args: {
  catalogo: ConteudoRecomendavel[]
  origem: string
  resumo: string
}): string {
  const { catalogo, origem, resumo } = args
  const partes = ['# ATRA', '', `> ${linha(resumo)}`, '']

  for (const { tipo, titulo } of GRUPOS) {
    const itens = catalogo.filter((c) => c.tipo === tipo)
    if (itens.length === 0) continue
    partes.push(`## ${titulo}`, '', ...itens.map((c) => item(c, origem)), '')
  }

  const artigos = catalogo.filter((c) => c.tipo === 'artigo').slice(0, MAX_ARTIGOS_NO_LLMS_TXT)
  partes.push(
    '## Optional',
    '',
    `- [Mapa do site](${origem}/sitemap.xml): todas as páginas, em português, inglês e espanhol`,
    ...artigos.map((c) => item(c, origem)),
    '',
  )

  return partes.join('\n')
}
