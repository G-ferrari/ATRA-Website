import { describe, expect, it } from 'vitest'

import { lerHtml } from '../../../scripts/diagnostico-maturidade/extrair-do-html.mjs'
import {
  NIVEIS,
  calcular,
  corDoPilar,
  escaparHtml,
  montarAvisoParaAtra,
  montarEmailDoResultado,
  montarRoadmap,
  perguntasDoSetor,
  type EntradaDoEmailDoResultado,
  type NomeDoPilar,
  type Respostas,
} from '.'

/* Financeiro: o setor com mais perguntas (18) e mais reguladores — é onde
 * "Ações por regulação" tem mais de uma regulação para mostrar. */
const SETOR = 'financeiro'

const porPilar = (indice: Partial<Record<NomeDoPilar, number>>): Respostas =>
  Object.fromEntries(perguntasDoSetor(SETOR).map((q) => [q.id, indice[q.pilar] ?? 0]))

const PERFIS = {
  /* Todas as primeiras alternativas (nota 1): média 1, nível 1. */
  baixo: Object.fromEntries(perguntasDoSetor(SETOR).map((q) => [q.id, 0])) as Respostas,
  /* Todas as últimas (nota 5): média 5, nível 5. */
  alto: Object.fromEntries(perguntasDoSetor(SETOR).map((q) => [q.id, q.alternativas.length - 1])) as Respostas,
  /* Um pilar em cada faixa: Segurança 5, Qualidade 3, Governança 2, Conformidade 1. */
  misto: porPilar({ Segurança: 3, Qualidade: 2, Governança: 1, Conformidade: 0 }),
}

const TEXTOS = {
  email: {
    assunto: 'Seu Diagnóstico de Maturidade de Dados — ATRA',
    abertura: 'Obrigado por responder ao diagnóstico.\n\nAbaixo está a leitura das suas respostas.',
  },
}
const WHATSAPP = 'https://api.whatsapp.com/send/?phone=5511963060267&text=Oi'
const AGENDA = 'https://agenda.exemplo.com.br/atra'

function montar(respostas: Respostas, extra: Partial<EntradaDoEmailDoResultado> = {}) {
  const calculo = calcular(SETOR, respostas)
  const roadmap = montarRoadmap(calculo)
  return montarEmailDoResultado({
    nome: 'Ana Souza',
    setor: SETOR,
    porte: '1_5bi',
    calculo,
    roadmap,
    textos: TEXTOS,
    whatsappUrl: WHATSAPP,
    agendaUrl: AGENDA,
    ...extra,
  })
}

/* Os títulos de `renderResult`, na ordem em que o HTML os monta. */
const SECOES = [
  'Impactos avaliados para o seu setor',
  'Maturidade por pilar',
  'O que está em jogo',
  'Regulações com maior gap',
  'Roadmap recomendado · consultoria e implementação ATRA',
  'Ações por regulação',
] as const
const NOTA =
  'Resultado gerado a partir das suas respostas, na escala de maturidade DAMA-DMBOK (1 Inicial a 5 Otimizado). O gap de cada regulação é a distância até o nível 5 somada nas respostas relacionadas. As recomendações são um ponto de partida: a leitura completa acontece na sessão com o especialista.'
const BOTAO_AGENDA = 'Agendar leitura do diagnóstico'
const BOTAO_ESPECIALISTA = 'Falar com um especialista'

const secoesPresentes = (texto: string) => SECOES.filter((s) => texto.includes(s))

describe('textos fixos', () => {
  /* O e-mail substitui a tela de resultado do HTML: título, nota e botão escritos
   * pela engenharia seriam conteúdo novo sem passar pelo marketing (D-22). */
  it('títulos, nota metodológica e botões são os do HTML do Roger', () => {
    const html = lerHtml()
    const { html: corpo, texto } = montar(PERFIS.baixo)
    for (const fixo of [...SECOES, 'Resultado do diagnóstico', 'entre outros', NOTA, BOTAO_ESPECIALISTA, BOTAO_AGENDA]) {
      expect(html, fixo).toContain(fixo)
      expect(corpo, fixo).toContain(fixo)
      expect(texto, fixo).toContain(fixo)
    }
  })

  it('assunto vem do CMS, numa linha só', () => {
    expect(montar(PERFIS.baixo).assunto).toBe(TEXTOS.email.assunto)
    expect(
      montar(PERFIS.baixo, { textos: { email: { assunto: 'Seu resultado\r\nBcc: x@y.com', abertura: null } } }).assunto,
    ).toBe('Seu resultado Bcc: x@y.com')
  })

  it('abertura vem do CMS; vazia, o e-mail começa pelo resultado', () => {
    const com = montar(PERFIS.baixo)
    expect(com.texto.startsWith(`Olá, Ana Souza,\n\n${TEXTOS.email.abertura}\n\nResultado do diagnóstico`)).toBe(true)
    expect(com.html).toContain('Abaixo está a leitura das suas respostas.')

    const sem = montar(PERFIS.baixo, { textos: { email: { assunto: 'A', abertura: null } } })
    expect(sem.texto.startsWith('Olá, Ana Souza,\n\nResultado do diagnóstico')).toBe(true)
    expect(sem.html).not.toContain('Obrigado por responder')
  })
})

describe('perfil baixo — todas as primeiras alternativas', () => {
  const { html, texto } = montar(PERFIS.baixo)

  it('nota 1,0 e Nível 1 · Inicial, com a leitura pelo porte', () => {
    for (const corpo of [html, texto]) {
      expect(corpo).toContain('1,0')
      expect(corpo).toContain(`Nível 1 · ${NIVEIS[1].nome}`)
      expect(corpo).toContain(NIVEIS[1].descricao)
      expect(corpo).toContain('Para o seu porte, esse nível está abaixo do esperado pelos pares e pelos reguladores.')
    }
  })

  it('todas as seções, na ordem do renderResult', () => {
    expect(secoesPresentes(texto)).toEqual([...SECOES])
    const posicoes = SECOES.map((s) => html.indexOf(s))
    expect(posicoes.every((p) => p > 0)).toBe(true)
    expect([...posicoes].sort((a, b) => a - b)).toEqual(posicoes)
    expect(html.indexOf(NOTA)).toBeGreaterThan(posicoes.at(-1)!)
  })

  it('texto', () => {
    expect(texto).toMatchSnapshot()
  })
})

describe('perfil alto — todas as últimas alternativas', () => {
  const calculo = calcular(SETOR, PERFIS.alto)
  const { html, texto } = montar(PERFIS.alto)

  it('nota 5,0 e Nível 5 · Otimizado', () => {
    for (const corpo of [html, texto]) {
      expect(corpo).toContain('5,0')
      expect(corpo).toContain(`Nível 5 · ${NIVEIS[5].nome}`)
      expect(corpo).toContain('Nível acima da média do mercado brasileiro.')
    }
  })

  /* Sem pilar abaixo de 3,5 não há o que está em jogo; e a alternativa de nota 5
   * não carrega tag, então não há gap, regulação nem ação por regulação. */
  it('só impactos, pilares e roadmap', () => {
    expect(calculo.gaps).toEqual({})
    expect(montarRoadmap(calculo).regulacoes).toEqual([])
    const esperadas = ['Impactos avaliados para o seu setor', 'Maturidade por pilar', 'Roadmap recomendado · consultoria e implementação ATRA']
    expect(secoesPresentes(texto)).toEqual(esperadas)
    expect(secoesPresentes(html)).toEqual(esperadas)
    expect(html).toContain(NOTA)
  })

  it('a fase 3 ganha "IA sobre dados confiáveis" (média ≥ 3,5)', () => {
    expect(texto).toContain('IA sobre dados confiáveis')
  })

  it('texto', () => {
    expect(texto).toMatchSnapshot()
  })
})

describe('regras de presença', () => {
  const calculo = calcular(SETOR, PERFIS.baixo)
  const roadmap = montarRoadmap(calculo)
  const comRegulacoes = (n: number) =>
    montarEmailDoResultado({
      nome: 'Ana',
      setor: SETOR,
      porte: 'ate_50mi',
      calculo,
      roadmap: { ...roadmap, regulacoes: roadmap.regulacoes.slice(0, n) },
      textos: TEXTOS,
      whatsappUrl: WHATSAPP,
    })

  it('"Ações por regulação" só com mais de uma regulação', () => {
    expect(roadmap.regulacoes.length).toBeGreaterThan(1)
    const uma = comRegulacoes(1)
    expect(uma.texto).toContain('Regulações com maior gap')
    expect(uma.texto).not.toContain('Ações por regulação')
    expect(uma.html).not.toContain('Ações por regulação')
  })

  it('sem regulação, nem a lista de gaps nem as ações', () => {
    const nenhuma = comRegulacoes(0)
    for (const corpo of [nenhuma.html, nenhuma.texto]) {
      expect(corpo).not.toContain('Regulações com maior gap')
      expect(corpo).not.toContain('Ações por regulação')
    }
  })
})

describe('botões', () => {
  it.each([null, undefined, '', '   '])('sem agendaUrl (%j), sem o botão de agenda', (agendaUrl) => {
    const { html, texto } = montar(PERFIS.baixo, { agendaUrl })
    for (const corpo of [html, texto]) {
      expect(corpo).not.toContain('Agendar')
      expect(corpo).toContain(BOTAO_ESPECIALISTA)
    }
  })

  it('com agendaUrl, o botão aponta para ela', () => {
    const { html, texto } = montar(PERFIS.baixo)
    expect(html).toContain(`href="${AGENDA}"`)
    expect(html).toContain(BOTAO_AGENDA)
    expect(texto).toContain(`${BOTAO_AGENDA}: ${AGENDA}`)
  })

  it('link que não é http(s) não vira botão', () => {
    const { html } = montar(PERFIS.baixo, { agendaUrl: 'javascript:alert(1)', whatsappUrl: 'data:text/html,oi' })
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('data:text')
    expect(html).not.toContain(BOTAO_AGENDA)
    expect(html).not.toContain(BOTAO_ESPECIALISTA)
  })

  it('o & da URL do WhatsApp sai escapado no href', () => {
    expect(montar(PERFIS.baixo).html).toContain(`href="${WHATSAPP.replace('&', '&amp;')}"`)
  })
})

describe('segurança do HTML', () => {
  it('escaparHtml escapa os cinco caracteres de marcação', () => {
    expect(escaparHtml(`<a href="x" title='y'>P&D</a>`)).toBe(
      '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;P&amp;D&lt;/a&gt;',
    )
    expect(escaparHtml('Conformidade · ação')).toBe('Conformidade · ação')
  })

  it('nome do visitante sai escapado', () => {
    const { html, texto } = montar(PERFIS.baixo, { nome: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script')
    expect(html).toContain('Olá, &lt;script&gt;alert(1)&lt;/script&gt;,')
    /* Texto puro não interpreta marcação: lá o nome vai como foi digitado. */
    expect(texto.startsWith('Olá, <script>alert(1)</script>,')).toBe(true)
  })

  it('texto do CMS sai escapado, com as quebras de linha preservadas', () => {
    const { html } = montar(PERFIS.baixo, {
      textos: { email: { assunto: 'A <b>', abertura: 'Linha 1\nLinha <img src=x onerror=alert(1)>\n\nOutro parágrafo' } },
    })
    expect(html).not.toContain('<img')
    expect(html).not.toContain('<b>')
    expect(html).toContain('<title>A &lt;b&gt;</title>')
    expect(html).toContain('Linha 1<br>Linha &lt;img src=x onerror=alert(1)&gt;</p>')
    expect(html).toContain('>Outro parágrafo</p>')
  })
})

describe('HTML de e-mail', () => {
  it.each(Object.entries(PERFIS))('perfil %s: tabelas e estilo em linha, até 600 px, sem JS nem imagem', (_, respostas) => {
    const { html } = montar(respostas)
    expect(html.startsWith('<!DOCTYPE html><html lang="pt-BR">')).toBe(true)
    expect(html).toContain('max-width:600px')
    expect(html).toContain('<table role="presentation"')
    for (const proibido of ['<script', '<style', '<link', '<img', 'class=', 'display:flex', 'display:grid', 'var(--', 'url(']) {
      expect(html, proibido).not.toContain(proibido)
    }
  })

  it('pilares do mais forte ao mais fraco, cada um com a nota escrita', () => {
    const { html, texto } = montar(PERFIS.misto)
    const ordem = [...html.matchAll(/>(Governança|Qualidade|Segurança|Conformidade)<\/td>/g)].map((m) => m[1])
    expect(ordem).toEqual(['Segurança', 'Qualidade', 'Governança', 'Conformidade'])
    expect(texto).toContain('Maturidade por pilar\nSegurança: 5,0\nQualidade: 3,0\nGovernança: 2,0\nConformidade: 1,0')
    for (const nota of ['5,0', '3,0', '2,0', '1,0']) expect(html).toContain(`>${nota}</td>`)
  })

  /* §8.3 da feature: crítico laranja, atenção azul, o resto neutro. */
  it('cor da barra pela faixa do HTML: < 2,6 laranja, < 3,5 azul, senão ardósia', () => {
    expect(corDoPilar(0)).toBe('#FF8B08')
    expect(corDoPilar(2.59)).toBe('#FF8B08')
    expect(corDoPilar(2.6)).toBe('#3C98FA')
    expect(corDoPilar(3.49)).toBe('#3C98FA')
    expect(corDoPilar(3.5)).toBe('#334155')
    expect(corDoPilar(5)).toBe('#334155')
  })
})

describe('aviso à ATRA', () => {
  const entrada = (respostas: Respostas, empresa: string | null = 'Banco Exemplo S.A.') => {
    const calculo = calcular(SETOR, respostas)
    return montarAvisoParaAtra({
      contato: { nome: 'Ana Souza', email: 'ana@bancoexemplo.com.br', telefone: '(11) 99999-0000', empresa },
      setor: SETOR,
      porte: '1_5bi',
      cargo: 'cio_cto_cdo',
      calculo,
      roadmap: montarRoadmap(calculo),
      respostas,
    })
  }

  it('lista todas as perguntas do setor com a alternativa escolhida', () => {
    const { texto } = entrada(PERFIS.baixo)
    const perguntas = perguntasDoSetor(SETOR)
    expect(perguntas).toHaveLength(18)
    expect(texto).toContain('Respostas (18 de 18 perguntas)')
    perguntas.forEach((q, i) => {
      expect(texto, q.id).toContain(`${i + 1}. [${q.pilar}] ${q.enunciado}\n   ${q.alternativas[0].texto} (nota 1)`)
    })
  })

  it('pergunta sem resposta sai com "—"', () => {
    const [primeira, ...resto] = perguntasDoSetor(SETOR)
    const respostas = Object.fromEntries(resto.map((q) => [q.id, 3]))
    const { texto } = entrada(respostas)
    expect(texto).toContain('Respostas (17 de 18 perguntas)')
    expect(texto).toContain(`1. [${primeira.pilar}] ${primeira.enunciado}\n   —`)
  })

  it('contato, perfil legível, média, nível, pilares, top 3 e roadmap', () => {
    const { assunto, texto } = entrada(PERFIS.baixo)
    expect(assunto).toBe('[site] diagnóstico de maturidade — Banco Exemplo S.A.')
    for (const linha of [
      'Nome: Ana Souza',
      'Empresa: Banco Exemplo S.A.',
      'E-mail: ana@bancoexemplo.com.br',
      'Telefone: (11) 99999-0000',
      'Setor: Mercado Financeiro · Bancos, Fintechs, Meios de Pagamento',
      'Porte: R$ 1 bi – 5 bi',
      'Cargo: CIO / CTO / CDO',
      'Média: 1,00',
      'Nível: 1 · Inicial',
      'Governança: 1,00',
      'Fase 1 (0 a 3 meses): Diagnóstico executivo de dados',
    ]) {
      expect(texto, linha).toContain(linha)
    }
    const top = calcular(SETOR, PERFIS.baixo).topGaps
    expect(top).toHaveLength(3)
    expect(texto).toContain(`Maiores gaps\n1. ${top[0]}\n2. ${top[1]}\n3. ${top[2]}`)
  })

  it('sem empresa, o assunto não fica com travessão solto', () => {
    const { assunto, texto } = entrada(PERFIS.baixo, null)
    expect(assunto).toBe('[site] diagnóstico de maturidade')
    expect(texto).not.toContain('Empresa:')
  })

  it('pilar sem resposta sai "—", não 0', () => {
    const soGovernanca = Object.fromEntries(
      perguntasDoSetor(SETOR)
        .filter((q) => q.pilar === 'Governança')
        .map((q) => [q.id, 1]),
    )
    const { texto } = entrada(soGovernanca)
    expect(texto).toContain('Governança: 2,00')
    expect(texto).toContain('Conformidade: —')
  })
})
