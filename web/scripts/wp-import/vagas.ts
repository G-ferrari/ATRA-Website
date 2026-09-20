/* MIG-085 — extração do corpo de uma vaga da página do WordPress.
 *
 * A vaga não é um CPT: é uma página comum montada no Elementor (P-02, respondida
 * por evidência). A página inteira vem no `content.rendered` — cabeçalho do
 * template, banner, a vaga, e o formulário de candidatura com dois `<select>` de
 * 40 opções. Só o miolo é conteúdo.
 *
 * A estrutura é a mesma nas 7 páginas e dá dois marcadores confiáveis:
 *
 *   <h2> Explore nossas vagas … #vemserATRA   ← cabeçalho do template
 *   <h2> {título da vaga}                      ← começo do conteúdo
 *   <h3> Responsabilidades: … Nós somos a ATRA
 *   <h3> Envie seu Currículo …                 ← começo do formulário
 *
 * Nada daqui pode ser importado por `src/`: é ferramenta de importação. */
import { JSDOM } from 'jsdom'

/** Onde o formulário de candidatura começa. Depois disto não há conteúdo. */
const INICIO_DO_FORMULARIO = /envie seu curr[ií]culo/i

const BLOCOS = 'h1,h2,h3,h4,h5,p,ul,ol,table,blockquote'

const normalizar = (s: string) =>
  s
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')

/**
 * HTML só com os blocos de conteúdo da vaga, na ordem do documento.
 *
 * Devolve os blocos achatados em vez de recortar o container do Elementor: os
 * containers têm id gerado (`elementor-element-b5fc11`) e aninham cinco níveis,
 * e o conversor de MIG-081 descartaria os `div` de qualquer jeito.
 *
 * ⚠️ Um bloco que está **dentro** de outro já selecionado é pulado — sem isso o
 * `<p>` de dentro de um `<li>` entraria duas vezes, uma pela lista e outra por
 * si, e o texto sairia duplicado.
 */
export function corpoDaVaga(html: string, titulo: string): string {
  const doc = new JSDOM(html).window.document

  for (const lixo of doc.querySelectorAll('form, select, script, style, img, input, textarea, button')) {
    lixo.remove()
  }

  const blocos = [...doc.querySelectorAll(BLOCOS)]
  const alvoDoTitulo = normalizar(titulo)

  /* O título aparece duas vezes: no `<h2>` do conteúdo e, às vezes, no `<title>`
   * da aba. Casa pelo texto normalizado para sobreviver a `&#8211;` virando `–`
   * e a `(a)` no meio da palavra. */
  const inicio = blocos.findIndex((b) => /^h[12]$/i.test(b.tagName) && normalizar(b.textContent ?? '') === alvoDoTitulo)
  const fim = blocos.findIndex((b) => INICIO_DO_FORMULARIO.test(b.textContent ?? ''))

  const doInicio = inicio >= 0 ? inicio + 1 : 0
  const ateOFim = fim > doInicio ? fim : blocos.length

  const selecionados: Element[] = []
  for (const bloco of blocos.slice(doInicio, ateOFim)) {
    if (selecionados.some((s) => s.contains(bloco))) continue
    if (!(bloco.textContent ?? '').trim()) continue
    selecionados.push(bloco)
  }

  return selecionados.map((b) => b.outerHTML).join('\n')
}

/* ⚠️ **A dedução de área saiu daqui, e é uma decisão registrada (P-28).**
 *
 * O campo `area` era obrigatório em `jobs`, e o WordPress não tem o dado: guarda
 * só o título da vaga — os dois `<select>` da página parecem taxonomia mas são a
 * lista de vagas abertas e a de senioridade. A importação chegou a deduzir a
 * área do título com uma tabela de palavras ("Key Account Manager" → Comercial),
 * marcando cada atribuição no log para o RH conferir.
 *
 * O RH respondeu: manter sem área por ora. Então o campo virou opcional e a
 * dedução foi removida em vez de ficar desligada — classificação inventada que
 * ninguém pediu é exatamente o que D-22 mantém fora da migração, e código morto
 * que "só precisa ser religado" volta sozinho.
 */

/**
 * Modelo de trabalho, lido da seção "Modelo de contratação" da própria página.
 *
 * Isto é extração, não classificação: as 7 páginas dizem em texto corrido
 * "Atuação remota", "Híbrido – São Paulo/SP (3 dias presenciais e 2 remotos)"
 * ou "Modelo remoto". A ordem dos testes importa — a frase do híbrido cita
 * presencial e remoto na mesma linha, e procurar "remoto" primeiro classificaria
 * as três vagas híbridas como remotas.
 *
 * Sem menção nenhuma fica `remote`, que é o default do campo e o que as 6 vagas
 * do protótipo usavam.
 */
export function modeloDeTrabalho(texto: string): 'remote' | 'hybrid' | 'onsite' {
  if (/h[ií]brid/i.test(texto)) return 'hybrid'
  if (/remot/i.test(texto)) return 'remote'
  if (/presencial/i.test(texto)) return 'onsite'
  return 'remote'
}
