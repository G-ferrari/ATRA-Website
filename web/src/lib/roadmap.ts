import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

/* Leitura da documentação do projeto para a página interna /roadmap.
 *
 * A fonte é `docs/` — a mesma especificação que rege o repositório. Nada aqui
 * é uma segunda cópia: o backlog vem de `03-plano/tasks.md`, as decisões de
 * `00-contexto/decisoes.md`, as pendências de `00-contexto/pendencias.md`, e a
 * página os parseia a cada build. Task nova aparece sozinha; contagem à mão
 * não existe para envelhecer (mesmo princípio da bancada do design system).
 *
 * ⚠️ Dois caminhos, pelo mesmo motivo do `proxy.ts`: nativo, `docs/` é irmã de
 * `web/`; em container ela entra como `/docs`. E degradação em vez de crash:
 * a rota é interna — sem `docs/`, ela avisa e fica de pé (o site não pode
 * depender da documentação para buildar).
 */

export type StatusDaTask = 'done' | 'wip' | 'todo' | 'blocked' | 'cancelada'

export type Task = {
  id: string
  titulo: string
  criterio: string
  status: StatusDaTask
  /** Onde mexe — só as tabelas das Fases 1–2 declaram a coluna. */
  arquivos: string
  dependencias: string
  estimativa: string
  /** A narrativa que acompanha o status ("done — provado no staging…"). */
  nota: string
  /** Estimativa em horas (0 quando a célula não é numérica: "—", vazio). */
  horas: number
}

export type Fase = {
  nome: string
  tasks: Task[]
}

export type Decisao = {
  id: string
  titulo: string
  /** O registro completo (contexto, alternativas, consequência), em markdown. */
  corpo: string
}

export type Pendencia = {
  id: string
  pergunta: string
  status: 'aberta' | 'resolvida'
  referencia: string
  nota: string
}

/** Uma barra do gráfico de esforço — vem da tabela `## Totais` do backlog. */
export type EsforcoDaFase = { fase: string; horas: number }

export type Risco = {
  risco: string
  /** A probabilidade vigente — numa reavaliação ("~~alta~~ → **baixa**"), a de agora. */
  probabilidade: string
  mitigacao: string
  mitigado: boolean
}

export type ItemDeCutover = { feito: boolean; texto: string }

export type Documento = {
  grupo: string
  nome: string
  conteudo: string
}

export type Roadmap = {
  atualizadoEm: string | null
  fases: Fase[]
  decisoes: Decisao[]
  pendencias: Pendencia[]
  documentos: Documento[]
  esforco: EsforcoDaFase[]
  riscos: Risco[]
  /** A seção "Caminho crítico" do roadmap, em markdown, sem o cabeçalho. */
  caminhoCritico: string
  /** Os pré-requisitos do runbook de cutover — assinatura manual, não estado inferido. */
  cutover: ItemDeCutover[]
}

const raizDocs = (): string | null =>
  [path.resolve(process.cwd(), '../docs'), '/docs'].find(existsSync) ?? null

const ler = (raiz: string, relativo: string): string => {
  try {
    return readFileSync(path.join(raiz, relativo), 'utf8')
  } catch {
    return ''
  }
}

/** Tira a marcação inline que atrapalha texto corrido: negrito, riscado,
 * código e link (fica o rótulo). O conteúdo integral segue nos documentos. */
const semMarcacao = (texto: string): string =>
  texto
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|~~|`/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const classificarStatus = (idBruto: string, tituloBruto: string, celulaStatus: string): StatusDaTask => {
  /* Cancelamento aparece de dois jeitos no backlog: o ID riscado (~~MIG-008~~)
   * ou só o título riscado com repactuação no critério (MIG-084 → P-27). */
  if (idBruto.includes('~~') || tituloBruto.includes('~~') || /❌|n\/a/i.test(celulaStatus))
    return 'cancelada'
  /* "provada"/"no ar" cobrem os status narrativos ("construída no escuro,
   * invisibilidade provada") — entregue e verificado, só esperando uma chave. */
  if (/done|✅ ?feita|provada|no ar/i.test(celulaStatus)) return 'done'
  if (/wip/i.test(celulaStatus)) return 'wip'
  if (/blocked/i.test(celulaStatus)) return 'blocked'
  return 'todo'
}

/* O backlog é uma sequência de `## Fase …` com uma tabela cada. As colunas
 * variam: a tabela de Cutover/Limpeza não tem `Status` (nada lá começou), e é
 * o cabeçalho de cada tabela que diz onde cada campo está. */
const parsearTasks = (md: string): Fase[] => {
  const fases: Fase[] = []
  let fase: Fase | null = null
  let colunas: string[] = []

  for (const linha of md.split('\n')) {
    const tituloDeFase = linha.match(/^## (Fase .+)$/)
    if (tituloDeFase) {
      fase = { nome: tituloDeFase[1].trim(), tasks: [] }
      fases.push(fase)
      colunas = []
      continue
    }
    if (!fase || !linha.startsWith('|')) continue

    const celulas = linha.split('|').slice(1, -1).map((c) => c.trim())
    if (celulas[0] === 'ID') {
      colunas = celulas
      continue
    }
    const idBruto = celulas[0] ?? ''
    if (!/MIG-\d+/.test(idBruto)) continue

    const id = idBruto.match(/MIG-\d+\w*/)?.[0] ?? idBruto
    /* ⚠️ Várias tabelas do backlog carregam o status numa célula **além** do
     * cabeçalho (`| … | 3h | **done** |` sob um cabeçalho de 4 colunas). A
     * regra: coluna `Status` quando declarada; senão, a última célula quando a
     * linha excede o cabeçalho; senão não há status (Cutover/Limpeza). */
    const posStatus = colunas.indexOf('Status')
    const celulaStatus =
      posStatus >= 0
        ? (celulas[posStatus] ?? '')
        : celulas.length > colunas.length
          ? (celulas[celulas.length - 1] ?? '')
          : ''
    const coluna = (nomes: string[]): string => {
      const pos = nomes.map((n) => colunas.indexOf(n)).find((p) => p >= 0) ?? -1
      return pos >= 0 ? (celulas[pos] ?? '') : ''
    }
    /* A narrativa vem depois do travessão do status ("**done** — provado…"). */
    const nota = celulaStatus.includes('—')
      ? semMarcacao(celulaStatus.slice(celulaStatus.indexOf('—') + 1))
      : ''
    fase.tasks.push({
      id,
      titulo: semMarcacao(celulas[1] ?? ''),
      criterio: semMarcacao(coluna(['Critério de aceite'])),
      status: classificarStatus(idBruto, celulas[1] ?? '', celulaStatus),
      arquivos: semMarcacao(coluna(['Arquivos'])),
      dependencias: semMarcacao(coluna(['Dep.', 'Dep. extra'])),
      estimativa: semMarcacao(coluna(['Est.'])),
      nota,
      horas: parseFloat(coluna(['Est.']).replace(',', '.')) || 0,
    })
  }
  return fases.filter((f) => f.tasks.length > 0)
}

const parsearDecisoes = (md: string): Decisao[] =>
  /* O corpo de cada decisão vai do seu `## D-xx` até o próximo `## `. */
  md
    .split(/^## /m)
    .map((secao) => secao.match(/^(D-\d+) — (.+)\n([\s\S]*)$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => ({ id: m[1], titulo: semMarcacao(m[2]), corpo: m[3].trim() }))

const parsearPendencias = (md: string): Pendencia[] =>
  md
    .split('\n')
    .filter((l) => l.startsWith('|') && /P-\d+/.test(l.split('|')[1] ?? ''))
    .map((linha) => {
      const celulas = linha.split('|').slice(1, -1).map((c) => c.trim())
      const idBruto = celulas[0] ?? ''
      return {
        id: idBruto.match(/P-\d+/)?.[0] ?? idBruto,
        pergunta: semMarcacao(celulas[1] ?? ''),
        status: (idBruto.includes('~~') || idBruto.includes('✅') ? 'resolvida' : 'aberta') as
          | 'aberta'
          | 'resolvida',
        referencia: semMarcacao(celulas[2] ?? ''),
        nota: semMarcacao(celulas[3] ?? ''),
      }
    })

/* A tabela `## Totais` do backlog é a única fonte de horas por fase — as
 * células de estimativa das tasks têm exceções demais ("—", "?" e formatos
 * mistos) para somar com honestidade. */
const parsearEsforco = (md: string): EsforcoDaFase[] => {
  const secao = md.split(/^## Totais$/m)[1] ?? ''
  return secao
    .split('\n')
    .filter((l) => l.startsWith('|') && /~[\d,.]+h/.test(l) && !l.includes('Total'))
    .map((linha) => {
      const celulas = linha.split('|').slice(1, -1).map((c) => c.trim())
      return {
        fase: semMarcacao(celulas[0] ?? ''),
        horas: parseFloat((celulas[3] ?? '').replace(/[^\d,.]/g, '').replace(',', '.')) || 0,
      }
    })
}

const parsearRiscos = (md: string): Risco[] => {
  const secao = md.split(/^## Riscos de cronograma$/m)[1]?.split(/^## /m)[0] ?? ''
  return secao
    .split('\n')
    .filter((l) => l.startsWith('|') && !/^\|\s*(Risco|-)/.test(l))
    .map((linha) => {
      const celulas = linha.split('|').slice(1, -1).map((c) => c.trim())
      const probBruta = celulas[1] ?? ''
      return {
        risco: semMarcacao(celulas[0] ?? ''),
        /* "~~alta~~ → **baixa**" é reavaliação: vale a de depois da seta. */
        probabilidade: semMarcacao(probBruta.includes('→') ? probBruta.split('→').pop()! : probBruta),
        mitigacao: semMarcacao(celulas[2] ?? ''),
        mitigado: (celulas[0] ?? '').includes('~~') || (celulas[2] ?? '').includes('✅'),
      }
    })
    .filter((r) => r.risco)
}

const extrairCaminhoCritico = (md: string): string =>
  (md.split(/^## Caminho crítico$/m)[1]?.split(/^## /m)[0] ?? '').trim()

/* Cada item pode continuar em linhas indentadas; elas se juntam ao texto. */
const parsearCutover = (md: string): ItemDeCutover[] => {
  const secao = md.split(/^## Pré-requisitos.*$/m)[1]?.split(/^## |^---$/m)[0] ?? ''
  const itens: ItemDeCutover[] = []
  for (const linha of secao.split('\n')) {
    const item = linha.match(/^- \[([ x])\] (.+)$/)
    if (item) {
      itens.push({ feito: item[1] === 'x', texto: semMarcacao(item[2]) })
    } else if (itens.length > 0 && /^\s+\S/.test(linha)) {
      itens[itens.length - 1].texto += ` ${semMarcacao(linha)}`
    }
  }
  return itens
}

const lerDocumentos = (raiz: string): Documento[] => {
  const documentos: Documento[] = []
  const entradas = ['.', ...readdirSync(raiz, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()]
  for (const grupo of entradas) {
    const dir = path.join(raiz, grupo)
    const arquivos = readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => e.name)
      .sort()
    for (const nome of arquivos) {
      documentos.push({ grupo: grupo === '.' ? 'raiz' : grupo, nome, conteudo: ler(dir, nome) })
    }
  }
  return documentos
}

export function lerRoadmap(): Roadmap {
  const raiz = raizDocs()
  if (!raiz)
    return {
      atualizadoEm: null,
      fases: [],
      decisoes: [],
      pendencias: [],
      documentos: [],
      esforco: [],
      riscos: [],
      caminhoCritico: '',
      cutover: [],
    }

  const tasksMd = ler(raiz, '03-plano/tasks.md')
  const roadmapMd = ler(raiz, '03-plano/roadmap.md')
  return {
    atualizadoEm: tasksMd.match(/^atualizado_em:\s*(\S+)/m)?.[1] ?? null,
    fases: parsearTasks(tasksMd),
    decisoes: parsearDecisoes(ler(raiz, '00-contexto/decisoes.md')),
    pendencias: parsearPendencias(ler(raiz, '00-contexto/pendencias.md')),
    documentos: lerDocumentos(raiz),
    esforco: parsearEsforco(tasksMd),
    riscos: parsearRiscos(roadmapMd),
    caminhoCritico: extrairCaminhoCritico(roadmapMd),
    cutover: parsearCutover(ler(raiz, '04-infra/runbook-cutover.md')),
  }
}
