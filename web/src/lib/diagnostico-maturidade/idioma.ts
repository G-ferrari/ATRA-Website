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
import { CARGOS_EN, NIVEIS_EN, PERGUNTAS_EN, PILARES_EN, PORTES_EN, ROTULOS_DAS_TAGS_EN, SETORES_EN } from './ingles'
import type { Impacto } from './motor'

export type Idioma = Locale

const traduzirOpcoes = <V extends string>(
  lista: readonly OpcaoDoPerfil<V>[],
  em: Readonly<Record<V, string>>,
  idioma: Idioma,
): readonly OpcaoDoPerfil<V>[] =>
  idioma === 'pt' ? lista : lista.map((o) => ({ valor: o.valor, rotulo: em[o.valor] }))

export const setoresNoIdioma = (idioma: Idioma) => traduzirOpcoes<Setor>(SETORES, SETORES_EN, idioma)
export const portesNoIdioma = (idioma: Idioma) => traduzirOpcoes<Porte>(PORTES, PORTES_EN, idioma)
export const cargosNoIdioma = (idioma: Idioma) => traduzirOpcoes<Cargo>(CARGOS, CARGOS_EN, idioma)

export function perguntaNoIdioma(pergunta: Pergunta, idioma: Idioma): Pergunta {
  if (idioma === 'pt') return pergunta
  const em = PERGUNTAS_EN[pergunta.id]
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
  idioma === 'pt' ? pilar : PILARES_EN[pilar]

export function rotuloDaTagNoIdioma(tag: string, idioma: Idioma): string {
  const rotulos = idioma === 'pt' ? ROTULOS_DAS_TAGS : ROTULOS_DAS_TAGS_EN
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

export const nivelNoIdioma = (numero: NivelNumerico, idioma: Idioma) => (idioma === 'pt' ? NIVEIS : NIVEIS_EN)[numero]
