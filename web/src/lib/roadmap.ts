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
}

export type Fase = {
  nome: string
  tasks: Task[]
}

export type Decisao = { id: string; titulo: string }

export type Pendencia = {
  id: string
  pergunta: string
  status: 'aberta' | 'resolvida'
}

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
    const posCriterio = colunas.indexOf('Critério de aceite')
    fase.tasks.push({
      id,
      titulo: semMarcacao(celulas[1] ?? ''),
      criterio: semMarcacao(celulas[posCriterio] ?? ''),
      status: classificarStatus(idBruto, celulas[1] ?? '', celulaStatus),
    })
  }
  return fases.filter((f) => f.tasks.length > 0)
}

const parsearDecisoes = (md: string): Decisao[] =>
  [...md.matchAll(/^## (D-\d+) — (.+)$/gm)].map((m) => ({
    id: m[1],
    titulo: semMarcacao(m[2]),
  }))

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
      }
    })

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
  if (!raiz) return { atualizadoEm: null, fases: [], decisoes: [], pendencias: [], documentos: [] }

  const tasksMd = ler(raiz, '03-plano/tasks.md')
  return {
    atualizadoEm: tasksMd.match(/^atualizado_em:\s*(\S+)/m)?.[1] ?? null,
    fases: parsearTasks(tasksMd),
    decisoes: parsearDecisoes(ler(raiz, '00-contexto/decisoes.md')),
    pendencias: parsearPendencias(ler(raiz, '00-contexto/pendencias.md')),
    documentos: lerDocumentos(raiz),
  }
}
