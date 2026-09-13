/* Motor de pontuação do diagnóstico de prontidão para a RC 18/2025 (feature rc18,
 * task 005).
 *
 * Puro e determinístico: a mesma função calcula o índice no cliente (na hora, na
 * ilha do diagnóstico) e no servidor (ao gravar o lead, task 007 — o cliente não
 * é fonte de verdade). Sem I/O, sem `window`, sem `Date`.
 *
 * As 12 dimensões são as **oficiais** do Art. 2º da Resolução Conjunta nº 18/2025
 * (BCB + CMN). A escala de maturidade 0–3 reflete o texto do material da ATRA: o
 * "nível 1" do modelo DAMA (controle manual, planilhas) até o "nível 3" exigido
 * pela norma (regra, medição e evidência em produção).
 *
 * ⚠️ O índice é **indicativo** (autoavaliação por percepção), não um veredito de
 * conformidade — a página do diagnóstico deixa isso explícito.
 */

export type DimensaoId =
  | 'acessibilidade'
  | 'acuracia'
  | 'adaptabilidade'
  | 'clareza'
  | 'comparabilidade'
  | 'completude'
  | 'confiabilidade'
  | 'consistencia'
  | 'integridade'
  | 'rastreabilidade'
  | 'relevancia'
  | 'tempestividade'

export type Nivel = 0 | 1 | 2 | 3

/** O nível 3 é o piso exigido pela norma ("regra, medição e evidência"). */
export const NIVEL_MAXIMO: Nivel = 3
export const PISO_DA_NORMA: Nivel = 3

export const NIVEIS: { valor: Nivel; rotulo: string; descricao: string }[] = [
  { valor: 0, rotulo: 'Inexistente', descricao: 'Controle manual, planilhas paralelas, sem padrão.' },
  { valor: 1, rotulo: 'Inicial', descricao: 'Há política ou intenção, mas sem medição.' },
  { valor: 2, rotulo: 'Em implantação', descricao: 'Regra definida e medição parcial.' },
  { valor: 3, rotulo: 'Em produção', descricao: 'Regra, medição e evidência — o piso da norma.' },
]

export const DIMENSOES: { id: DimensaoId; nome: string; pergunta: string }[] = [
  { id: 'acessibilidade', nome: 'Acessibilidade', pergunta: 'As informações prestadas ao BCB têm local, forma e prazos de acesso claramente definidos?' },
  { id: 'acuracia', nome: 'Acurácia', pergunta: 'Os dados refletem a realidade de forma precisa, conforme metodologia documentada?' },
  { id: 'adaptabilidade', nome: 'Adaptabilidade', pergunta: 'Você gera informações em novos formatos e demandas não periódicas com agilidade?' },
  { id: 'clareza', nome: 'Clareza', pergunta: 'As informações são apresentadas de forma concisa e compreensível ao usuário?' },
  { id: 'comparabilidade', nome: 'Comparabilidade', pergunta: 'É possível comparar as informações entre períodos e áreas de forma consistente?' },
  { id: 'completude', nome: 'Completude', pergunta: 'As informações atendem integralmente aos aspectos requeridos, sem lacunas?' },
  { id: 'confiabilidade', nome: 'Confiabilidade', pergunta: 'Os dados revisados têm baixo desvio em relação ao valor inicialmente informado?' },
  { id: 'consistencia', nome: 'Consistência', pergunta: 'O mesmo dado é padronizado e sem contradição entre áreas e sistemas?' },
  { id: 'integridade', nome: 'Integridade', pergunta: 'Há garantia de que a informação é autêntica e não foi alterada indevidamente?' },
  { id: 'rastreabilidade', nome: 'Rastreabilidade', pergunta: 'Você rastreia cada informação da origem até o envio ao BCB?' },
  { id: 'relevancia', nome: 'Relevância', pergunta: 'As informações são úteis e influenciam a tomada de decisão?' },
  { id: 'tempestividade', nome: 'Tempestividade', pergunta: 'As informações são entregues no prazo, com curto intervalo entre o fato e o envio?' },
]

const IDS = new Set<DimensaoId>(DIMENSOES.map((d) => d.id))
const TOTAL = DIMENSOES.length // 12

export type RespostasDiagnostico = Partial<Record<DimensaoId, Nivel>>

export type Faixa = 'inicial' | 'intermediario' | 'avancado'

export type ResultadoDiagnostico = {
  /** Índice de prontidão, 0–100 (soma dos níveis / máximo possível). */
  ipRc18: number
  faixa: Faixa
  porDimensao: { id: DimensaoId; nome: string; nivel: Nivel; pct: number }[]
  /** Dimensões abaixo do piso da norma (nível 3). */
  lacunas: DimensaoId[]
  /** Quantas das 12 dimensões foram respondidas com valor válido. */
  respondidas: number
}

/** Descarta chaves desconhecidas e níveis fora de 0–3. Fonte única de validação,
 * usada pelo cliente e pelo servidor (que não confia no número enviado). */
export function validarRespostas(entrada: unknown): RespostasDiagnostico {
  const saida: RespostasDiagnostico = {}
  if (!entrada || typeof entrada !== 'object') return saida
  for (const [chave, valor] of Object.entries(entrada as Record<string, unknown>)) {
    if (!IDS.has(chave as DimensaoId)) continue
    const n = Number(valor)
    if (Number.isInteger(n) && n >= 0 && n <= NIVEL_MAXIMO) saida[chave as DimensaoId] = n as Nivel
  }
  return saida
}

export function faixaDe(ipRc18: number): Faixa {
  if (ipRc18 >= 75) return 'avancado'
  if (ipRc18 >= 45) return 'intermediario'
  return 'inicial'
}

/** Calcula o índice sobre as 12 dimensões — dimensão não respondida conta como 0
 * (a ilha exige as 12 antes de enviar). Puro e determinístico. */
export function calcularIndice(entrada: RespostasDiagnostico): ResultadoDiagnostico {
  const respostas = validarRespostas(entrada)

  const porDimensao = DIMENSOES.map((d) => {
    const nivel = respostas[d.id] ?? 0
    return { id: d.id, nome: d.nome, nivel, pct: Math.round((nivel / NIVEL_MAXIMO) * 100) }
  })

  const soma = porDimensao.reduce((acc, d) => acc + d.nivel, 0)
  const ipRc18 = Math.round((soma / (TOTAL * NIVEL_MAXIMO)) * 100)

  return {
    ipRc18,
    faixa: faixaDe(ipRc18),
    porDimensao,
    lacunas: porDimensao.filter((d) => d.nivel < PISO_DA_NORMA).map((d) => d.id),
    respondidas: Object.keys(respostas).length,
  }
}
