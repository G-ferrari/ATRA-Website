/* MIG-092 / MIG-093 — extração das páginas institucionais do WordPress.
 *
 * Segmento e solução são páginas comuns montadas no Elementor, com o mesmo
 * cabeçalho e o mesmo rodapé de template. O **miolo** é que difere, e a
 * diferença foi medida nas 21 páginas, não presumida:
 *
 * As 8 verticais seguem um molde de grade:
 *
 *   <h2> nome da vertical          ← manchete
 *   <p>  uma frase                 ← vira `shortDescription`
 *   <h2> "O que nós fazemos"       ← cabeçalho da grade
 *   <p>  "Descubra nossos…"        ← intro da grade
 *   <h2>+<p> × N                   ← os cards
 *   <h3> "Somos parceiros…"        ← rodapé do template
 *   <h2> "Entre em contato…"       ← rodapé do template
 *
 * Nada daqui pode ser importado por `src/`: é ferramenta de importação. */
import { JSDOM } from 'jsdom'

export type ItemDeSegmento = { titulo: string; texto: string }

export type ConteudoDeSegmento = {
  /** O `<h2>` de abertura, que repete o nome da vertical em caixa baixa. */
  manchete: string
  /** A frase de abertura. É o `shortDescription` do card do índice. */
  chamada: string
  /** Cabeçalho da grade: "O que nós fazemos" + a frase de intro. */
  grade: { titulo: string; intro: string } | null
  itens: ItemDeSegmento[]
}

/** Onde o conteúdo acaba e o rodapé do template começa, nas 8 páginas. */
const RODAPE_DO_TEMPLATE = /somos parceiros das maiores|entre em contato com nossa equipe/i

const texto = (el: Element) => (el.textContent ?? '').replace(/\s+/g, ' ').trim()

type BlocoDaPagina = { tag: string; txt: string; html: string }

/**
 * Blocos de conteúdo da página, achatados e sem o rodapé do template.
 *
 * Achatados porque o container do Elementor tem id gerado
 * (`elementor-element-b5fc11`) e aninha cinco níveis — o conversor de MIG-081
 * descartaria os `div` de qualquer jeito.
 *
 * ⚠️ Bloco **dentro** de outro já selecionado é pulado: sem isso o `<p>` de
 * dentro de um `<li>` entra duas vezes, uma pela lista e outra por si.
 */
export function blocosDaPagina(html: string): BlocoDaPagina[] {
  const doc = new JSDOM(html).window.document
  for (const lixo of doc.querySelectorAll('form, select, script, style, img, input, textarea, button')) {
    lixo.remove()
  }

  const selecionados: Element[] = []
  for (const el of doc.querySelectorAll('h1,h2,h3,h4,p,ul,ol,table,blockquote')) {
    const txt = texto(el)
    if (!txt) continue
    /* Para no rodapé do template: o que vem depois é o mesmo em todas as
     * páginas do site, e entraria como se fosse conteúdo da página. */
    if (RODAPE_DO_TEMPLATE.test(txt)) break
    if (selecionados.some((s) => s.contains(el))) continue
    selecionados.push(el)
  }

  return selecionados.map((el) => ({ tag: el.tagName.toLowerCase(), txt: texto(el), html: el.outerHTML }))
}

export function conteudoDeSegmento(html: string): ConteudoDeSegmento {
  const blocos = blocosDaPagina(html).filter((b) => b.tag !== 'ul' && b.tag !== 'ol' && b.tag !== 'table' && b.tag !== 'blockquote')

  const manchete = blocos[0]?.tag.startsWith('h') ? blocos.shift()!.txt : ''
  const chamada = blocos[0]?.tag === 'p' ? blocos.shift()!.txt : ''

  /* O cabeçalho da grade é o próximo par título+parágrafo. Se a página não
   * tiver — nenhuma das 8 está nesse caso, mas o formato não é garantido — os
   * blocos seguem direto para os cards. */
  let grade: ConteudoDeSegmento['grade'] = null
  if (blocos[0]?.tag.startsWith('h') && blocos[1]?.tag === 'p') {
    grade = { titulo: blocos.shift()!.txt, intro: blocos.shift()!.txt }
  }

  const itens: ItemDeSegmento[] = []
  for (let i = 0; i < blocos.length; i++) {
    if (!blocos[i].tag.startsWith('h')) continue
    const seguinte = blocos[i + 1]
    if (seguinte?.tag !== 'p') continue
    itens.push({ titulo: blocos[i].txt, texto: seguinte.txt })
    i++
  }

  return { manchete, chamada, grade, itens }
}

/**
 * Ícone do card, lido do que o título já diz.
 *
 * ⚠️ As páginas do WordPress **não têm ícone nenhum** — o campo é obrigatório
 * no bloco. A tabela é pequena e explícita, e casa palavra que está escrita no
 * título ("Governança" → escudo, "Nuvem" → nuvem). O que ela não reconhecer
 * fica com o ícone da própria vertical, que é honesto: repete o contexto em vez
 * de sugerir uma categoria que ninguém escolheu.
 */
const ICONES: { padrao: RegExp; icone: string }[] = [
  { padrao: /governan|conformidade|complian/i, icone: 'shield' },
  { padrao: /fraude|segurança|risco|prote/i, icone: 'lock' },
  { padrao: /nuvem|cloud/i, icone: 'cloud' },
  { padrao: /an[áa]lise|analytics|relat[óo]rio|desempenho/i, icone: 'chart' },
  { padrao: /cliente|paciente|aluno|engajamento|experi[êe]ncia/i, icone: 'users' },
  { padrao: /intelig[êe]ncia artificial|\bia\b|machine learning/i, icone: 'brain' },
  { padrao: /dados|data|cadastro|qualidade/i, icone: 'database' },
  { padrao: /processo|opera|gerenciamento|planejamento|cadeia/i, icone: 'workflow' },
  { padrao: /moderniza|aplicativ|plataforma|sistema/i, icone: 'server' },
  { padrao: /receita|vendas|marketing|crescimento|fidelidade/i, icone: 'trending-up' },
  { padrao: /iot|sensor|equipamento|medidor/i, icone: 'cpu' },
]

export function iconeDeItem(titulo: string, reserva: string): string {
  return ICONES.find(({ padrao }) => padrao.test(titulo))?.icone ?? reserva
}

export type ConteudoDeSolucao = {
  /** A frase de abertura. É o `shortDescription` do card e do mega-menu. */
  chamada: string
  /** O resto do miolo, em HTML, para o conversor de MIG-081. */
  corpo: string
}

/**
 * Miolo de uma página de solução.
 *
 * ⚠️ **Não reaproveita o molde de grade dos segmentos**, e a diferença foi
 * medida: das 13 páginas de solução, **8 não têm nenhum par título+texto** —
 * são um cabeçalho de seção seguido de parágrafos soltos. Montar uma grade de
 * cards ali produziria uma seção vazia e jogaria fora o texto que sobrou. É a
 * mesma armadilha que `blocos.md` registra: composição escrita a partir do
 * inventário de seções em vez do markup.
 *
 * O que sai daqui é HTML corrido, que vira um bloco de texto. Estruturar cada
 * uma das 13 em cards é trabalho editorial, não de importação.
 */
export function conteudoDeSolucao(html: string): ConteudoDeSolucao {
  const blocos = blocosDaPagina(html)

  /* A manchete repete o nome da solução em caixa alta ou baixa
   * ("DATA INTEGRATION", "cloud"); o título do documento já a carrega. */
  if (blocos[0]?.tag.startsWith('h')) blocos.shift()
  const chamada = blocos[0]?.tag === 'p' ? blocos.shift()!.txt : ''

  return { chamada, corpo: blocos.map((b) => b.html).join('\n') }
}
