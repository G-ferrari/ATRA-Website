/* Navegação do questionário (feature diagnostico-maturidade-dados, task 026).
 *
 * O `state`, `next()` e `back()` do HTML do Roger (v1.7), reescritos como
 * reducer puro para a ilha de `/diagnostico-maturidade` — sem DOM nem React,
 * para ser testável sem navegador (`questionario.test.ts`). A tela só desenha o
 * que sai daqui.
 *
 * O `passo` é o `state.step` do HTML: 0 é o perfil, 1…N são as perguntas do
 * setor e N + 1 é o contato. O contato e a conclusão são da task 027 — aqui o
 * contato é o fim da linha, e "avançar" nele não faz nada.
 *
 * Fica fora do `index.ts` de propósito: aquele é o que rota, action e e-mail
 * compartilham; isto só a ilha usa.
 */

import type { Cargo, Pergunta, Porte, Setor } from './dados'
import { ehCargo, ehPorte, ehSetor, perguntasDoSetor } from './motor'

export type CampoDoPerfil = 'setor' | 'porte' | 'cargo'

/** Ordem em que o HTML valida e mostra os erros (`validateProfile`). */
export const CAMPOS_DO_PERFIL: readonly CampoDoPerfil[] = ['setor', 'porte', 'cargo']

export interface Perfil {
  setor: Setor | null
  porte: Porte | null
  cargo: Cargo | null
}

export interface EstadoDoQuestionario {
  /** 0 = perfil · 1…N = pergunta · N + 1 = contato. */
  passo: number
  perfil: Perfil
  /** Setor em que as respostas foram dadas — o `state.sector` do HTML.
   *
   * ⚠️ Só muda no "Começar", e não quando o select muda: é lá que o HTML
   * compara e zera. Quem troca Saúde → Varejo → Saúde sem começar não perde o
   * que já tinha respondido para Saúde. */
  setorDasRespostas: Setor | null
  /** perguntaId → índice (0 a 3) da alternativa: o formato que a action da
   * task 025 recebe e revalida. Nota e tags nunca moram aqui. */
  respostas: Readonly<Record<string, number>>
  /** Campos que o "Começar" encontrou vazios (`is-invalid` do HTML). */
  invalidos: readonly CampoDoPerfil[]
}

export type AcaoDoQuestionario =
  | { tipo: 'preencher'; campo: CampoDoPerfil; valor: string }
  | { tipo: 'responder'; perguntaId: string; indice: number }
  /** `de`: o passo em que o avanço foi agendado. O avanço automático espera
   * 350 ms, e se nesse meio-tempo a pessoa voltou ou já avançou pelo botão, a
   * ordem velha não pode empurrar outra tela — é o `screens()[state.step] ===
   * sec` do HTML. */
  | { tipo: 'avancar'; de?: number }
  | { tipo: 'voltar' }

export function estadoInicial(setor: Setor | null): EstadoDoQuestionario {
  return {
    passo: 0,
    perfil: { setor, porte: null, cargo: null },
    setorDasRespostas: null,
    respostas: {},
    invalidos: [],
  }
}

/* Valor que não é código conhecido — inclusive o "" do "Selecione…" — vira
 * `null`: o perfil só guarda o que o motor reconhece. */
function lerCampo(campo: CampoDoPerfil, valor: string): Setor | Porte | Cargo | null {
  if (campo === 'setor') return ehSetor(valor) ? valor : null
  if (campo === 'porte') return ehPorte(valor) ? valor : null
  return ehCargo(valor) ? valor : null
}

export function camposFaltando(perfil: Perfil): CampoDoPerfil[] {
  return CAMPOS_DO_PERFIL.filter((campo) => perfil[campo] === null)
}

/** As perguntas do setor em que se está respondendo, na ordem da base. */
export function perguntasAtivas(estado: EstadoDoQuestionario): Pergunta[] {
  return estado.setorDasRespostas ? perguntasDoSetor(estado.setorDasRespostas) : []
}

function perguntaDoPasso(estado: EstadoDoQuestionario): Pergunta | undefined {
  return estado.passo > 0 ? perguntasAtivas(estado)[estado.passo - 1] : undefined
}

function respostaDe(estado: EstadoDoQuestionario, perguntaId: string): number | undefined {
  return Object.hasOwn(estado.respostas, perguntaId) ? estado.respostas[perguntaId] : undefined
}

export function questionario(estado: EstadoDoQuestionario, acao: AcaoDoQuestionario): EstadoDoQuestionario {
  switch (acao.tipo) {
    case 'preencher': {
      /* Mexer no campo apaga o erro **dele**, e só dele — o `input` do HTML
         tira o `is-invalid` do próprio campo e deixa os outros acesos. */
      const perfil: Perfil = { ...estado.perfil, [acao.campo]: lerCampo(acao.campo, acao.valor) }
      return { ...estado, perfil, invalidos: estado.invalidos.filter((c) => c !== acao.campo) }
    }

    case 'responder': {
      const pergunta = perguntaDoPasso(estado)
      if (!pergunta || pergunta.id !== acao.perguntaId) return estado
      const { indice } = acao
      if (!Number.isInteger(indice) || indice < 0 || indice >= pergunta.alternativas.length) return estado
      return { ...estado, respostas: { ...estado.respostas, [pergunta.id]: indice } }
    }

    case 'avancar': {
      if (acao.de !== undefined && acao.de !== estado.passo) return estado

      if (estado.passo === 0) {
        const faltando = camposFaltando(estado.perfil)
        if (faltando.length > 0) return { ...estado, invalidos: faltando }
        const setor = estado.perfil.setor as Setor
        /* Regra do Roger (o `state.answers = {}` do HTML): trocar de setor
           recomeça **tudo**. ⚠️ Inclusive as transversais, que têm o mesmo id
           nos oito setores e sobreviveriam a um filtro por pergunta — manter
           só essas seria desviar do HTML, não otimizar. */
        const mesmoSetor = setor === estado.setorDasRespostas
        return {
          ...estado,
          passo: 1,
          setorDasRespostas: setor,
          respostas: mesmoSetor ? estado.respostas : {},
          invalidos: [],
        }
      }

      const pergunta = perguntaDoPasso(estado)
      // Sem pergunta é o contato: o envio é da task 027.
      if (!pergunta || respostaDe(estado, pergunta.id) === undefined) return estado
      return { ...estado, passo: estado.passo + 1 }
    }

    case 'voltar':
      return estado.passo > 0 ? { ...estado, passo: estado.passo - 1 } : estado
  }
}

export type Etapa =
  | { tipo: 'perfil' }
  | {
      tipo: 'pergunta'
      /** O setor das respostas, que filtra as etiquetas "Impacta:". */
      setor: Setor
      pergunta: Pergunta
      numero: number
      total: number
      resposta: number | undefined
    }
  | { tipo: 'contato' }

export function etapaAtual(estado: EstadoDoQuestionario): Etapa {
  if (estado.passo === 0 || !estado.setorDasRespostas) return { tipo: 'perfil' }
  const perguntas = perguntasAtivas(estado)
  const pergunta = perguntas[estado.passo - 1]
  if (!pergunta) return { tipo: 'contato' }
  return {
    tipo: 'pergunta',
    setor: estado.setorDasRespostas,
    pergunta,
    numero: estado.passo,
    total: perguntas.length,
    resposta: respostaDe(estado, pergunta.id),
  }
}

/** Texto do canto do cartão (`#aq-step-label`). */
export function rotuloDaEtapa(etapa: Etapa): string {
  if (etapa.tipo === 'perfil') return 'Perfil'
  if (etapa.tipo === 'pergunta') return `Pergunta ${etapa.numero} de ${etapa.total}`
  return 'Contato'
}

/** Percentual da barra, pela conta do `render()` do HTML: `step / (total − 1)`,
 * com `total` = perguntas + 3 (perfil, contato e concluído). A conclusão, que
 * chega na task 027, é a única tela em 100%. */
export function progresso(estado: EstadoDoQuestionario): number {
  const total = perguntasAtivas(estado).length + 3
  return Math.round((estado.passo / (total - 1)) * 100)
}

/** O botão de avançar da pergunta só acende com a resposta dada (o
 * `btnN.disabled` do HTML). No perfil ele fica sempre aceso: clicar sem os
 * três campos mostra os erros, que é como a pessoa descobre o que falta. */
export function podeAvancar(estado: EstadoDoQuestionario): boolean {
  const etapa = etapaAtual(estado)
  if (etapa.tipo === 'perfil') return true
  if (etapa.tipo === 'pergunta') return etapa.resposta !== undefined
  return false
}

/** Atalho de teclado do HTML: A–E ou 1–5 escolhem a alternativa. `null` para
 * qualquer outra tecla; índice além das alternativas o reducer ignora. */
export function indiceDaTecla(tecla: string): number | null {
  if (tecla.length !== 1) return null
  const letra = 'ABCDE'.indexOf(tecla.toUpperCase())
  if (letra > -1) return letra
  return /^[1-5]$/.test(tecla) ? Number(tecla) - 1 : null
}
