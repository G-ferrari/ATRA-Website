/* O texto do Diagnóstico no idioma da página (D-76). A conta não passa por
 * aqui: pergunta traduzida mantém `id`, `pilar`, notas e tags da base, e é o
 * mesmo índice de alternativa que vai ao servidor nos dois idiomas. */

import type { Locale } from '@/lib/locales'

import {
  CARGOS,
  NIVEIS,
  PORTES,
  ROTULOS_DAS_TAGS,
  SETORES,
  type Cargo,
  type NivelNumerico,
  type NomeDoPilar,
  type OpcaoDoPerfil,
  type Pergunta,
  type Porte,
  type Setor,
  type Tag,
} from './dados'
import type { Impacto } from './motor'
import { traducaoDe, type Traducao } from './traducoes'

export type Idioma = Locale

const traduzirOpcoes = <V extends string>(
  lista: readonly OpcaoDoPerfil<V>[],
  em: (tr: Traducao) => Readonly<Record<V, string>>,
  idioma: Idioma,
): readonly OpcaoDoPerfil<V>[] => {
  const tr = traducaoDe(idioma)
  return tr ? lista.map((o) => ({ valor: o.valor, rotulo: em(tr)[o.valor] })) : lista
}

export const setoresNoIdioma = (idioma: Idioma) => traduzirOpcoes<Setor>(SETORES, (tr) => tr.setores, idioma)
export const portesNoIdioma = (idioma: Idioma) => traduzirOpcoes<Porte>(PORTES, (tr) => tr.portes, idioma)
export const cargosNoIdioma = (idioma: Idioma) => traduzirOpcoes<Cargo>(CARGOS, (tr) => tr.cargos, idioma)

export function perguntaNoIdioma(pergunta: Pergunta, idioma: Idioma): Pergunta {
  const tr = traducaoDe(idioma)
  if (!tr) return pergunta
  const em = tr.perguntas[pergunta.id]
  return {
    ...pergunta,
    enunciado: em.enunciado,
    alternativas: pergunta.alternativas.map((a, i) => ({
      ...a,
      texto: em.alternativas[i],
    })),
  }
}

export const pilarNoIdioma = (pilar: NomeDoPilar, idioma: Idioma): string =>
  traducaoDe(idioma)?.pilares[pilar] ?? pilar

export function rotuloDaTagNoIdioma(tag: string, idioma: Idioma): string {
  const rotulos = traducaoDe(idioma)?.rotulosDasTags ?? ROTULOS_DAS_TAGS
  return (Object.hasOwn(rotulos, tag) && rotulos[tag as Tag]) || tag
}

/** As etiquetas do motor (que saem em português) com o rótulo do idioma. */
export const impactosNoIdioma = (impactos: readonly Impacto[], idioma: Idioma): Impacto[] =>
  idioma === 'pt'
    ? [...impactos]
    : impactos.map((i) => ({
        tag: i.tag,
        rotulo: rotuloDaTagNoIdioma(i.tag, idioma),
      }))

export const nivelNoIdioma = (numero: NivelNumerico, idioma: Idioma) => (traducaoDe(idioma)?.niveis ?? NIVEIS)[numero]
