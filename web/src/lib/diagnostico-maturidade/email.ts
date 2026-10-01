/* E-mail do resultado ao lead e aviso à ATRA (feature diagnostico-maturidade-dados,
 * task 024).
 *
 * O resultado só chega por e-mail (decisão de 26/09): este e-mail **é** a tela
 * de resultado do HTML do Roger (`renderResult`, v1.7) — as mesmas seções, na
 * mesma ordem, com os mesmos títulos, e a nota metodológica copiada caractere a
 * caractere. O `email.test.ts` confere cada texto fixo contra o HTML de origem.
 *
 * Funções puras: recebem o que o motor calculou e os textos do CMS, devolvem
 * strings. Quem envia é a action (task 025), por `enviarAviso`.
 *
 * ⚠️ HTML de e-mail não é HTML de site. Gmail, Outlook e Apple Mail ignoram,
 * cada um, uma parte diferente do CSS: nada de `<style>`, flex, grid ou variável
 * CSS — layout em tabela e estilo em linha. Nenhuma imagem é necessária para
 * ler (muitos clientes as bloqueiam por padrão), e o fundo é claro mesmo o site
 * sendo grafite: o e-mail é lido no tema do cliente de e-mail, não no do site.
 */

import type { DiagnosticoDeMaturidade } from '@/types/content'

import { CARGOS, NIVEIS, PORTES, SETORES, type Cargo, type Porte, type Setor } from './dados'
import {
  alternativaEscolhida,
  faixa,
  impactosDoSetor,
  leituraPeloPorte,
  nivelNumerico,
  perguntasDoSetor,
  pilaresEmJogo,
  type Calculo,
  type FaseDoRoadmap,
  type Respostas,
  type Roadmap,
} from './motor'

/* ---------------------------------------------------------------------
   Textos fixos — do HTML v1.7, não da engenharia
   --------------------------------------------------------------------- */

/* Títulos de `renderResult` (os `<h4>`), o rótulo da tela de resultado e os dois
 * botões dela (`#aq-res-wa`, `#aq-res-agenda`). Mudar aqui é mudar o texto do
 * Roger: o teste reprova se deixar de bater com o HTML. */
const TITULOS = {
  resultado: 'Resultado do diagnóstico',
  impactos: 'Impactos avaliados para o seu setor',
  pilares: 'Maturidade por pilar',
  emJogo: 'O que está em jogo',
  regulacoes: 'Regulações com maior gap',
  roadmap: 'Roadmap recomendado · consultoria e implementação ATRA',
  acoes: 'Ações por regulação',
} as const

const ENTRE_OUTROS = 'entre outros'

const NOTA_METODOLOGICA =
  'Resultado gerado a partir das suas respostas, na escala de maturidade DAMA-DMBOK (1 Inicial a 5 Otimizado). O gap de cada regulação é a distância até o nível 5 somada nas respostas relacionadas. As recomendações são um ponto de partida: a leitura completa acontece na sessão com o especialista.'

const BOTAO_ESPECIALISTA = 'Falar com um especialista'
const BOTAO_AGENDA = 'Agendar leitura do diagnóstico'

/* O cabeçalho do cartão do HTML (`.aq-brand`): o logo tem `alt="ATRA"`. Aqui é
 * texto, não imagem — cliente que bloqueia imagem mostraria um quadro vazio. */
const MARCA = 'ATRA'
const NOME_DO_DIAGNOSTICO = 'Diagnóstico de Maturidade de Dados'

/* ---------------------------------------------------------------------
   Cores (DESIGN.md) e tipografia
   --------------------------------------------------------------------- */

const COR = {
  azul: '#3C98FA',
  /* Botão com texto branco: o azul ATRA dá 3,0:1, abaixo do AA para 15 px. O
   * profundo (o hover do site) dá 4,6:1. */
  azulProfundo: '#2A75C5',
  laranja: '#FF8B08',
  /* `--warm-ink` do HTML: texto das etiquetas laranja. O laranja queimado da
   * marca (#D67200) dá 3,1:1 sobre o fundo creme, ilegível em 12 px. */
  laranjaTinta: '#8A5200',
  laranjaClaro: '#FFF4E5',
  tinta: '#0F172A',
  ardosia: '#334155',
  ardosiaClara: '#64748B',
  papel: '#FFFFFF',
  nevoa: '#F8FAFC',
  nevoaRecuada: '#F1F5F9',
  traco: '#E2E8F0',
} as const

/* Mona Sans não existe no cliente de e-mail, e fonte web em e-mail é loteria
 * (Gmail ignora). A pilha do sistema lê bem em todos. */
const FONTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

/** Cor da barra do pilar pela faixa do HTML (`band`): crítico < 2,6 em laranja,
 * atenção < 3,5 em azul, o resto em ardósia (§8.3 da feature).
 *
 * ⚠️ A cor é só apoio: a nota vai sempre escrita ao lado, em tinta — laranja
 * sobre branco não passa de 2,3:1, e parte dos leitores não distingue as cores. */
export function corDoPilar(nota: number): string {
  const f = faixa(nota)
  return f === 'low' ? COR.laranja : f === 'mid' ? COR.azul : COR.ardosia
}

/* Uma cor por fase, como a borda de `.aq-phase` (f1 azul vivo, f2 azul
 * profundo, f3 laranja), trocada pelos equivalentes da marca. */
const COR_DA_FASE: Record<FaseDoRoadmap['classe'], string> = {
  f1: COR.azul,
  f2: COR.azulProfundo,
  f3: COR.laranja,
}

/* ---------------------------------------------------------------------
   Apoio
   --------------------------------------------------------------------- */

/** Escapa texto para HTML — conteúdo de elemento **e** valor de atributo entre
 * aspas. Todo texto variável passa por aqui: o nome vem do visitante e os
 * textos vêm do CMS, e nenhum dos dois pode virar marcação no e-mail. */
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const e = escaparHtml

/* Vírgula decimal, como o HTML (`toFixed(1).replace('.', ',')`). */
const decimal = (n: number, casas = 1) => n.toFixed(casas).replace('.', ',')

/* O mapper já descarta o que não é http(s); isto segura quem chamar sem ele —
 * um `javascript:` num `href` de e-mail é o mesmo XSS que seria no site. */
const linkSeguro = (url: string | null | undefined): string | null => {
  const v = url?.trim()
  return v && /^https?:\/\//i.test(v) ? v : null
}

/* Assunto é cabeçalho de e-mail: quebra de linha ali não tem lugar. */
const umaLinha = (texto: string) => texto.replace(/\s+/g, ' ').trim()

/* "Maturidade por pilar" do mais forte ao mais fraco — o `sort` de
 * `renderResult` sobre a lista crescente do roadmap. Sort estável: empate
 * mantém a ordem do roadmap, como no original. */
const pilaresDoMaisForte = (roadmap: Roadmap) => [...roadmap.pilares].sort((a, b) => b.nota - a.nota)

const rotuloDe = <V extends string>(lista: readonly { valor: V; rotulo: string }[], valor: V) =>
  lista.find((o) => o.valor === valor)?.rotulo ?? valor

/* ---------------------------------------------------------------------
   E-mail do resultado ao lead
   --------------------------------------------------------------------- */

export interface EntradaDoEmailDoResultado {
  nome: string
  setor: Setor
  porte: Porte
  calculo: Calculo
  roadmap: Roadmap
  /** Assunto e abertura, do global do CMS (já resolvidos pelo mapper). */
  textos: Pick<DiagnosticoDeMaturidade, 'email'>
  whatsappUrl: string
  /** Vazio = sem o botão de agenda. */
  agendaUrl?: string | null
}

export interface EmailDoResultado {
  assunto: string
  html: string
  texto: string
}

/* O conteúdo uma vez só; HTML e texto são duas maneiras de escrever o mesmo. */
function conteudoDoResultado(entrada: EntradaDoEmailDoResultado) {
  const { calculo, roadmap } = entrada
  const numero = nivelNumerico(calculo.media)
  const nivel = NIVEIS[numero]
  const nome = entrada.nome.trim()
  const regulacoes = roadmap.regulacoes
  const whatsapp = linkSeguro(entrada.whatsappUrl)
  const agenda = linkSeguro(entrada.agendaUrl)

  return {
    saudacao: nome ? `Olá, ${nome},` : 'Olá,',
    abertura: entrada.textos.email.abertura?.trim() || null,
    media: decimal(calculo.media),
    nivel: `Nível ${numero} · ${nivel.nome}`,
    leitura: `${nivel.descricao} ${leituraPeloPorte(calculo.media, entrada.porte)}`,
    impactos: impactosDoSetor(entrada.setor).map((i) => i.rotulo),
    pilares: pilaresDoMaisForte(roadmap).map((x) => ({
      pilar: x.pilar,
      nota: decimal(x.nota),
      largura: Math.round((x.nota / 5) * 100),
      cor: corDoPilar(x.nota),
    })),
    emJogo: pilaresEmJogo(roadmap),
    regulacoes,
    fases: roadmap.fases,
    /* Como no HTML: "Ações por regulação" só quando há mais de uma — com uma só,
     * a ação já está inteira na "Frente regulatória prioritária" da fase 2. */
    acoes: regulacoes.length > 1 ? regulacoes : [],
    botoes: [
      ...(whatsapp ? [{ rotulo: BOTAO_ESPECIALISTA, url: whatsapp, fundo: COR.azulProfundo, corDoTexto: COR.papel }] : []),
      ...(agenda ? [{ rotulo: BOTAO_AGENDA, url: agenda, fundo: COR.laranja, corDoTexto: COR.tinta }] : []),
    ],
  }
}

type Conteudo = ReturnType<typeof conteudoDoResultado>

/* --- HTML --- */

/* Tabela de layout: sem espaçamento de célula e escondida do leitor de tela. */
const tabela = (linhas: string, estilo = '', largura = '100%') =>
  `<table role="presentation" width="${largura}" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;${estilo}">${linhas}</table>`

const bloco = (conteudo: string, padding = '0 24px') =>
  `<tr><td style="padding:${padding};font-family:${FONTE};">${conteudo}</td></tr>`

const tituloDaSecao = (texto: string) =>
  `<h2 style="margin:28px 0 12px;font-family:${FONTE};font-size:16px;line-height:1.3;font-weight:700;color:${COR.tinta};">${e(texto)}</h2>`

const paragrafo = (texto: string, estilo = '') =>
  `<p style="margin:0 0 12px;font-family:${FONTE};font-size:15px;line-height:1.6;color:${COR.ardosia};${estilo}">${texto}</p>`

/* Etiqueta (`.aq-gaps span`). `inline-block` para quebrar linha entre elas;
 * o Outlook ignora o padding e ainda assim mostra o fundo. */
const etiqueta = (texto: string, apagada = false) =>
  apagada
    ? `<span style="display:inline-block;margin:0 6px 8px 0;padding:4px 10px;font-size:12px;line-height:1.4;font-weight:500;color:${COR.ardosiaClara};">${e(texto)}</span>`
    : `<span style="display:inline-block;margin:0 6px 8px 0;padding:4px 10px;border-radius:4px;background-color:${COR.laranjaClaro};font-size:12px;line-height:1.4;font-weight:600;color:${COR.laranjaTinta};">${e(texto)}</span>`

/* Barra do pilar: duas células, a pintada com a largura da nota. Célula de 0% ou
 * 100% não some em todo cliente, então as pontas viram uma célula só. */
function barra(largura: number, cor: string): string {
  const celula = (w: string, fundo: string) =>
    `<td width="${w}" height="10" bgcolor="${fundo}" style="height:10px;font-size:0;line-height:0;background-color:${fundo};">&nbsp;</td>`
  const celulas =
    largura <= 0
      ? celula('100%', COR.traco)
      : largura >= 100
        ? celula('100%', cor)
        : celula(`${largura}%`, cor) + celula(`${100 - largura}%`, COR.traco)
  return tabela(`<tr>${celulas}</tr>`, `background-color:${COR.traco};`)
}

/* Item de `.aq-reg`: nome em destaque e o texto embaixo — empilhado, e não lado
 * a lado como no HTML, porque no celular a coluna do nome espremeria o texto. */
const itemDeLista = (titulo: string, texto: string) =>
  tabela(
    `<tr><td style="padding:12px 14px;border-radius:6px;background-color:${COR.nevoa};font-family:${FONTE};">` +
      `<p style="margin:0 0 4px;font-size:14px;line-height:1.4;font-weight:700;color:${COR.laranjaTinta};">${e(titulo)}</p>` +
      `<p style="margin:0;font-size:14px;line-height:1.55;color:${COR.ardosia};">${e(texto)}</p>` +
      `</td></tr>`,
    'margin:0 0 8px;',
  )

function fase(f: FaseDoRoadmap): string {
  const itens = f.itens
    .map(
      (i) =>
        `<p style="margin:10px 0 2px;font-size:14px;line-height:1.4;font-weight:700;color:${COR.tinta};">${e(i.titulo)}</p>` +
        `<p style="margin:0;font-size:14px;line-height:1.55;color:${COR.ardosia};">${e(i.descricao)}</p>`,
    )
    .join('')
  return tabela(
    `<tr><td style="padding:14px 16px;border-left:4px solid ${COR_DA_FASE[f.classe]};background-color:${COR.nevoa};font-family:${FONTE};">` +
      `<p style="margin:0;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${COR.azulProfundo};">${e(f.fase)}</p>` +
      `<p style="margin:2px 0 0;font-size:12px;line-height:1.4;color:${COR.ardosiaClara};">${e(f.prazo)}</p>` +
      itens +
      `</td></tr>`,
    'margin:0 0 10px;',
  )
}

/* Botão "à prova de Outlook": a cor vai na célula (`bgcolor`), o link ocupa o
 * padding. Um por linha — lado a lado não cabem numa tela de 375 px. */
const botao = (b: Conteudo['botoes'][number]) =>
  tabela(
    `<tr><td bgcolor="${b.fundo}" style="border-radius:6px;background-color:${b.fundo};">` +
      `<a href="${e(b.url)}" target="_blank" rel="noopener" style="display:inline-block;padding:13px 24px;font-family:${FONTE};font-size:15px;line-height:1.2;font-weight:700;color:${b.corDoTexto};text-decoration:none;border-radius:6px;">${e(b.rotulo)}</a>` +
      `</td></tr>`,
    'margin:0 0 12px;',
    'auto',
  )

/* Texto do CMS em parágrafos: linha em branco separa parágrafo, quebra simples
 * vira `<br>`. Escapado antes — a quebra é a única marcação que entra. */
const paragrafosDoCms = (texto: string) =>
  texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => paragrafo(e(p).replace(/\r?\n/g, '<br>')))
    .join('')

function htmlDoResultado(assunto: string, c: Conteudo): string {
  const secoes: string[] = []

  secoes.push(
    bloco(
      `<p style="margin:0;font-size:20px;line-height:1.2;font-weight:800;letter-spacing:0.02em;color:${COR.tinta};">${e(MARCA)}</p>` +
        `<p style="margin:4px 0 0;font-size:13px;line-height:1.4;color:${COR.ardosiaClara};">${e(NOME_DO_DIAGNOSTICO)}</p>`,
      '24px 24px 20px',
    ),
  )

  secoes.push(bloco(paragrafo(e(c.saudacao), `color:${COR.tinta};`) + (c.abertura ? paragrafosDoCms(c.abertura) : '')))

  /* Cabeçalho do resultado (`.aq-res-head`): a nota no círculo, o nível e a
   * leitura. O HTML pinta este bloco de azul-marinho; aqui é painel claro —
   * bloco escuro em e-mail vira mancha quando o cliente inverte as cores. */
  secoes.push(
    bloco(
      `<p style="margin:16px 0 10px;font-size:12px;line-height:1;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COR.azulProfundo};">${e(TITULOS.resultado)}</p>` +
        tabela(
          `<tr><td style="padding:16px;border-radius:6px;background-color:${COR.nevoaRecuada};">` +
            tabela(
              `<tr>` +
                `<td width="72" valign="middle" style="width:72px;padding:0 14px 0 0;">` +
                tabela(
                  `<tr><td width="66" height="66" align="center" valign="middle" bgcolor="${COR.papel}" style="width:66px;height:66px;border:3px solid ${COR.azul};border-radius:50%;background-color:${COR.papel};font-family:${FONTE};font-size:26px;line-height:1;font-weight:800;color:${COR.tinta};">${e(c.media)}</td></tr>`,
                  /* Com `collapse`, o navegador ignora o raio da borda da célula e o
                   * círculo sai quadrado. O Outlook de mesa sai quadrado de todo jeito. */
                  'border-collapse:separate;',
                  '72',
                ) +
                `</td>` +
                `<td valign="middle" style="font-family:${FONTE};">` +
                `<h1 style="margin:0 0 6px;font-family:${FONTE};font-size:20px;line-height:1.25;font-weight:700;color:${COR.tinta};">${e(c.nivel)}</h1>` +
                `<p style="margin:0;font-size:14px;line-height:1.55;color:${COR.ardosia};">${e(c.leitura)}</p>` +
                `</td>` +
                `</tr>`,
            ) +
            `</td></tr>`,
        ),
    ),
  )

  secoes.push(
    bloco(
      tituloDaSecao(TITULOS.impactos) +
        `<div>${c.impactos.map((i) => etiqueta(i)).join(' ')} ${etiqueta(ENTRE_OUTROS, true)}</div>`,
    ),
  )

  secoes.push(
    bloco(
      tituloDaSecao(TITULOS.pilares) +
        tabela(
          c.pilares
            .map(
              (p) =>
                `<tr>` +
                `<td width="110" style="width:110px;padding:6px 0;font-family:${FONTE};font-size:14px;line-height:1.3;font-weight:600;color:${COR.tinta};">${e(p.pilar)}</td>` +
                `<td style="padding:6px 12px;">${barra(p.largura, p.cor)}</td>` +
                `<td width="40" align="right" style="width:40px;padding:6px 0;font-family:${FONTE};font-size:14px;line-height:1.3;font-weight:700;color:${COR.tinta};">${e(p.nota)}</td>` +
                `</tr>`,
            )
            .join(''),
        ),
    ),
  )

  if (c.emJogo.length) {
    secoes.push(bloco(tituloDaSecao(TITULOS.emJogo) + c.emJogo.map((x) => itemDeLista(x.pilar, x.emJogo)).join('')))
  }

  if (c.regulacoes.length) {
    secoes.push(
      bloco(tituloDaSecao(TITULOS.regulacoes) + `<div>${c.regulacoes.map((r) => etiqueta(r.titulo)).join(' ')}</div>`),
    )
  }

  secoes.push(bloco(tituloDaSecao(TITULOS.roadmap) + c.fases.map(fase).join('')))

  if (c.acoes.length) {
    secoes.push(bloco(tituloDaSecao(TITULOS.acoes) + c.acoes.map((r) => itemDeLista(r.titulo, r.descricao)).join('')))
  }

  secoes.push(
    bloco(
      `<p style="margin:20px 0 0;padding:12px 0 0;border-top:1px dashed ${COR.traco};font-size:12px;line-height:1.5;color:${COR.ardosiaClara};">${e(NOTA_METODOLOGICA)}</p>`,
    ),
  )

  if (c.botoes.length) secoes.push(bloco(c.botoes.map(botao).join(''), '24px 24px 12px'))

  secoes.push(bloco('&nbsp;', '0 24px 12px'))

  /* O `<!--[if mso]>` é comentário para todo cliente menos o Outlook de mesa,
   * que ignora `max-width` e esticaria o cartão na janela inteira. */
  return (
    `<!DOCTYPE html>` +
    `<html lang="pt-BR">` +
    `<head>` +
    `<meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta name="color-scheme" content="light">` +
    `<meta name="supported-color-schemes" content="light">` +
    `<title>${e(assunto)}</title>` +
    `</head>` +
    `<body style="margin:0;padding:0;background-color:${COR.nevoaRecuada};">` +
    tabela(
      `<tr><td align="center" style="padding:24px 8px;">` +
        `<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->` +
        tabela(
          secoes.join(''),
          `max-width:600px;border-top:4px solid ${COR.azul};border-radius:6px;background-color:${COR.papel};`,
        ) +
        `<!--[if mso]></td></tr></table><![endif]-->` +
        `</td></tr>`,
      `background-color:${COR.nevoaRecuada};`,
    ) +
    `</body>` +
    `</html>`
  )
}

/* --- Texto --- */

function textoDoResultado(c: Conteudo): string {
  const secao = (titulo: string, linhas: string[]) => [titulo, ...linhas].join('\n')
  const blocos: string[] = [c.saudacao]
  if (c.abertura) blocos.push(c.abertura)

  blocos.push(secao(TITULOS.resultado, [`${c.media} · ${c.nivel}`, c.leitura]))
  blocos.push(secao(TITULOS.impactos, [[...c.impactos, ENTRE_OUTROS].join(', ')]))
  blocos.push(secao(TITULOS.pilares, c.pilares.map((p) => `${p.pilar}: ${p.nota}`)))
  if (c.emJogo.length) blocos.push(secao(TITULOS.emJogo, c.emJogo.map((x) => `${x.pilar}: ${x.emJogo}`)))
  if (c.regulacoes.length) blocos.push(secao(TITULOS.regulacoes, [c.regulacoes.map((r) => r.titulo).join(', ')]))
  blocos.push(
    secao(TITULOS.roadmap, [
      c.fases
        /* Descrição na linha de baixo: "Título: descrição" viraria "Frente
         * regulatória prioritária: LGPD: Inventário…", com dois-pontos em série. */
        .map((f) => [`${f.fase} · ${f.prazo}`, ...f.itens.map((i) => `- ${i.titulo}\n  ${i.descricao}`)].join('\n'))
        .join('\n\n'),
    ]),
  )
  if (c.acoes.length) blocos.push(secao(TITULOS.acoes, c.acoes.map((r) => `${r.titulo}: ${r.descricao}`)))
  blocos.push(NOTA_METODOLOGICA)
  if (c.botoes.length) blocos.push(c.botoes.map((b) => `${b.rotulo}: ${b.url}`).join('\n'))

  return blocos.join('\n\n')
}

/** O resultado do diagnóstico como o lead recebe: assunto do CMS, HTML de e-mail
 * e a mesma coisa em texto puro (a parte que lê quem não abre HTML). */
export function montarEmailDoResultado(entrada: EntradaDoEmailDoResultado): EmailDoResultado {
  const assunto = umaLinha(entrada.textos.email.assunto)
  const conteudo = conteudoDoResultado(entrada)
  return { assunto, html: htmlDoResultado(assunto, conteudo), texto: textoDoResultado(conteudo) }
}

/* ---------------------------------------------------------------------
   Aviso à ATRA
   --------------------------------------------------------------------- */

export interface EntradaDoAvisoParaAtra {
  contato: { nome: string; email: string; telefone?: string | null; empresa?: string | null }
  setor: Setor
  porte: Porte
  cargo: Cargo
  calculo: Calculo
  roadmap: Roadmap
  respostas: Respostas
}

export interface AvisoParaAtra {
  assunto: string
  texto: string
}

/** O aviso à caixa "Diagnóstico": quem é, o resultado resumido e **cada
 * pergunta com a alternativa escolhida** — o comercial aborda o lead sabendo o
 * que ele respondeu, não só a nota. Texto puro, como os outros avisos do site. */
export function montarAvisoParaAtra(entrada: EntradaDoAvisoParaAtra): AvisoParaAtra {
  const { contato, calculo, roadmap } = entrada
  const empresa = contato.empresa?.trim()
  const perguntas = perguntasDoSetor(entrada.setor)
  const respondidas = perguntas.filter((q) => alternativaEscolhida(q, entrada.respostas)).length

  /* ⚠️ O `filter(Boolean)` vale só dentro do bloco de contato, cujas linhas são
   * opcionais: no corpo inteiro ele comeria as linhas em branco entre blocos. */
  const blocos = [
    'Novo Diagnóstico de Maturidade de Dados preenchido no site.',
    [
      'Contato',
      `Nome: ${contato.nome.trim()}`,
      empresa && `Empresa: ${empresa}`,
      `E-mail: ${contato.email.trim()}`,
      contato.telefone?.trim() && `Telefone: ${contato.telefone.trim()}`,
    ]
      .filter(Boolean)
      .join('\n'),
    [
      'Perfil',
      `Setor: ${rotuloDe(SETORES, entrada.setor)}`,
      `Porte: ${rotuloDe(PORTES, entrada.porte)}`,
      `Cargo: ${rotuloDe(CARGOS, entrada.cargo)}`,
    ].join('\n'),
    [
      'Resultado',
      `Média: ${decimal(calculo.media, 2)}`,
      `Nível: ${calculo.nivel}`,
      /* Pilar sem resposta sai "—", e não o 0 do roadmap: para quem vai abordar
       * o lead, "não respondeu" e "nota zero" são conversas diferentes. */
      ...pilaresDoMaisForte(roadmap).map((x) => {
        const nota = calculo.pilares[x.pilar]
        return `${x.pilar}: ${nota === undefined ? '—' : decimal(nota, 2)}`
      }),
    ].join('\n'),
    ['Maiores gaps', ...(calculo.topGaps.length ? calculo.topGaps.map((g, i) => `${i + 1}. ${g}`) : ['—'])].join('\n'),
    ['Roadmap', ...roadmap.fases.map((f) => `${f.fase} (${f.prazo}): ${f.itens.map((i) => i.titulo).join('; ')}`)].join(
      '\n',
    ),
    [
      `Respostas (${respondidas} de ${perguntas.length} perguntas)`,
      ...perguntas.map((q, i) => {
        const alternativa = alternativaEscolhida(q, entrada.respostas)
        return [
          `${i + 1}. [${q.pilar}] ${q.enunciado}`,
          `   ${alternativa ? `${alternativa.texto} (nota ${alternativa.nota})` : '—'}`,
        ].join('\n')
      }),
    ].join('\n'),
  ]

  return {
    assunto: umaLinha(`[site] diagnóstico de maturidade${empresa ? ` — ${empresa}` : ''}`),
    texto: blocos.join('\n\n'),
  }
}
