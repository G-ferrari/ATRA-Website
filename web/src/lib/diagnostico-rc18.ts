/* Quick Check de prontidão para a RC 18/2025 (feature rc18).
 *
 * ⚠️ Substitui o motor de 12 dimensões da norma pela autoavaliação de **11
 * pilares** do formulário de referência (logiks.com.br/formularioRC18), a pedido
 * do dono. Cada pilar é uma pergunta de múltipla escolha com pontos por opção.
 *
 * Puro e determinístico: a mesma validação roda no cliente (ilha) e no servidor
 * (ao gravar o lead — o cliente não é fonte de verdade). Sem I/O, sem `window`.
 *
 * ⚠️ Decisão do dono: **sem índice na tela**. A pontuação existe só para compor o
 * e-mail que a ATRA recebe (ajuda a priorizar o contato), não é exibida ao
 * visitante — o envio apenas coleta as respostas e a ATRA entra em contato.
 */

export type PilarId =
  | 'governanca'
  | 'gestao-qualidade'
  | 'rastreabilidade'
  | 'controles'
  | 'papeis'
  | 'documentacao'
  | 'indicadores'
  | 'evidencias'
  | 'monitoramento'
  | 'patrocinio'
  | 'cultura'

export type Opcao = { valor: string; rotulo: string; pontos: number }
export type Pilar = { id: PilarId; nome: string; pergunta: string; opcoes: Opcao[] }

/* Perguntas, opções e pontos do formulário de referência. Fidelidade ao original,
 * com correções mínimas de gramática (ex.: "seram" → "serão" no pilar Indicadores). */
export const PILARES: Pilar[] = [
  {
    id: 'governanca',
    nome: 'Governança',
    pergunta: 'A sua instituição tem clara uma solução de governança/gestão de dados?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'parcial', rotulo: 'Parcialmente', pontos: 7 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
      { valor: 'desconheco', rotulo: 'Desconheço', pontos: 2 },
    ],
  },
  {
    id: 'gestao-qualidade',
    nome: 'Gestão da qualidade',
    pergunta:
      'Quando um problema é encontrado em um dado enviado ao regulador, existe um processo definido para identificação, correção e tratamento?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'parcial', rotulo: 'Parcialmente', pontos: 7 },
      { valor: 'cada-area', rotulo: 'Cada área resolve de forma diferente', pontos: 3 },
      { valor: 'nao-sabemos', rotulo: 'Não sabemos', pontos: 2 },
    ],
  },
  {
    id: 'rastreabilidade',
    nome: 'Rastreabilidade',
    pergunta:
      'Caso o BACEN solicite a origem de uma informação regulatória, sua instituição conseguiria demonstrar todo o caminho percorrido pelo dado?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'parcial', rotulo: 'Parcialmente', pontos: 7 },
      { valor: 'dificil', rotulo: 'Seria difícil', pontos: 3 },
      { valor: 'nao-conseguiriamos', rotulo: 'Não conseguiríamos', pontos: 0 },
    ],
  },
  {
    id: 'controles',
    nome: 'Controles',
    pergunta: 'Como são realizadas as validações das informações regulatórias?',
    opcoes: [
      { valor: 'automatico', rotulo: 'Automaticamente', pontos: 10 },
      { valor: 'misto', rotulo: 'Parte automática e parte manual', pontos: 7 },
      { valor: 'manual', rotulo: 'Apenas manualmente', pontos: 3 },
      { valor: 'sem-validacao', rotulo: 'Não existem validações', pontos: 0 },
    ],
  },
  {
    id: 'papeis',
    nome: 'Papéis e responsabilidades',
    pergunta: 'Os responsáveis pelos principais dados da instituição são claramente conhecidos pelas áreas envolvidas?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'em-parte', rotulo: 'Em parte', pontos: 7 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
    ],
  },
  {
    id: 'documentacao',
    nome: 'Documentação',
    pergunta: 'Existe documentação atualizada dos processos que produzem informações regulatórias?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'parcial', rotulo: 'Parcialmente', pontos: 7 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
      { valor: 'desconheco', rotulo: 'Desconheço', pontos: 2 },
    ],
  },
  {
    id: 'indicadores',
    nome: 'Indicadores',
    pergunta: 'A qualidade das informações regulatórias é acompanhada por indicadores que serão exigidos pelo BACEN?',
    opcoes: [
      { valor: 'sempre', rotulo: 'Sempre', pontos: 10 },
      { valor: 'algumas-areas', rotulo: 'Algumas áreas', pontos: 7 },
      { valor: 'raramente', rotulo: 'Raramente', pontos: 4 },
      { valor: 'nunca', rotulo: 'Nunca', pontos: 0 },
    ],
  },
  {
    id: 'evidencias',
    nome: 'Evidências',
    pergunta: 'As validações de qualidade de dados realizadas ficam registradas e disponíveis para auditorias ou fiscalizações?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'parcial', rotulo: 'Parcialmente', pontos: 7 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
      { valor: 'desconheco', rotulo: 'Desconheço', pontos: 2 },
    ],
  },
  {
    id: 'monitoramento',
    nome: 'Monitoramento',
    pergunta: 'A instituição monitora continuamente a qualidade das informações regulatórias?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'em-parte', rotulo: 'Em parte', pontos: 7 },
      { valor: 'quando-surge', rotulo: 'Apenas quando surge problema', pontos: 4 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
    ],
  },
  {
    id: 'patrocinio',
    nome: 'Patrocínio executivo',
    pergunta:
      'A Diretoria ou Alta Administração acompanha regularmente indicadores relacionados à qualidade das informações regulatórias?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'eventualmente', rotulo: 'Eventualmente', pontos: 7 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
      { valor: 'desconheco', rotulo: 'Desconheço', pontos: 2 },
    ],
  },
  {
    id: 'cultura',
    nome: 'Cultura',
    pergunta: 'A sua instituição promove alinhamentos de melhorias da sua governança e qualidade de dados?',
    opcoes: [
      { valor: 'sim', rotulo: 'Sim', pontos: 10 },
      { valor: 'em-parte', rotulo: 'Em parte', pontos: 7 },
      { valor: 'quando-surge', rotulo: 'Apenas quando surge problema', pontos: 4 },
      { valor: 'nao', rotulo: 'Não', pontos: 0 },
    ],
  },
]

export const TOTAL_PILARES = PILARES.length // 11

/* O maior valor de cada pilar é 10; o teto é 11 × 10. */
export const PONTUACAO_MAXIMA = PILARES.reduce(
  (acc, p) => acc + Math.max(...p.opcoes.map((o) => o.pontos)),
  0,
)

const POR_ID = new Map<PilarId, Pilar>(PILARES.map((p) => [p.id, p]))

/** pilar → `valor` da opção escolhida. */
export type RespostasQuickCheck = Partial<Record<PilarId, string>>

/** Descarta pilares desconhecidos e opções inválidas. Fonte única de validação,
 * usada pelo cliente e pelo servidor (que não confia no que chega). */
export function validarRespostas(entrada: unknown): RespostasQuickCheck {
  const saida: RespostasQuickCheck = {}
  if (!entrada || typeof entrada !== 'object') return saida
  for (const [chave, valor] of Object.entries(entrada as Record<string, unknown>)) {
    const pilar = POR_ID.get(chave as PilarId)
    if (!pilar) continue
    if (typeof valor === 'string' && pilar.opcoes.some((o) => o.valor === valor)) {
      saida[chave as PilarId] = valor
    }
  }
  return saida
}

/** Soma dos pontos das opções escolhidas. Só para o e-mail — não vai à tela. */
export function pontuacao(entrada: RespostasQuickCheck): { total: number; maximo: number; pct: number } {
  const respostas = validarRespostas(entrada)
  let total = 0
  for (const p of PILARES) {
    const valor = respostas[p.id]
    const opcao = valor ? p.opcoes.find((o) => o.valor === valor) : undefined
    if (opcao) total += opcao.pontos
  }
  return { total, maximo: PONTUACAO_MAXIMA, pct: Math.round((total / PONTUACAO_MAXIMA) * 100) }
}

/** Recorte legível para o `message` do lead e o aviso por e-mail. */
export function resumoRespostas(entrada: RespostasQuickCheck): string {
  const respostas = validarRespostas(entrada)
  const { total, maximo, pct } = pontuacao(respostas)
  const linhas = PILARES.map((p) => {
    const valor = respostas[p.id]
    const opcao = valor ? p.opcoes.find((o) => o.valor === valor) : undefined
    return `- ${p.nome}: ${opcao ? `${opcao.rotulo} (${opcao.pontos} pts)` : '—'}`
  })
  return [`Pontuação: ${total}/${maximo} (${pct}%).`, '', 'Respostas por pilar:', ...linhas].join('\n')
}
