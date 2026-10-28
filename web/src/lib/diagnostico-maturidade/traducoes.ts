/* O texto traduzido do Diagnóstico, por idioma: o inglês (D-76) e o espanhol
 * (D-77). Quem precisa de um texto pergunta aqui pelo idioma, em vez de
 * `idioma === 'en'` espalhado — idioma novo entra numa linha, e o `tsc`
 * reprova se faltar. O português não está aqui: ele é a base (`dados.ts`). */

import type { Locale } from '@/lib/locales'

import * as espanhol from './espanhol'
import * as ingles from './ingles'

export type IdiomaTraduzido = Exclude<Locale, 'pt'>

export interface Traducao {
  setores: typeof ingles.SETORES_EN
  portes: typeof ingles.PORTES_EN
  cargos: typeof ingles.CARGOS_EN
  pilares: typeof ingles.PILARES_EN
  perguntas: typeof ingles.PERGUNTAS_EN
  rotulosDasTags: typeof ingles.ROTULOS_DAS_TAGS_EN
  rotulosNaLinha: typeof ingles.ROTULOS_NA_LINHA_EN
  niveis: typeof ingles.NIVEIS_EN
  ofertas: typeof ingles.OFERTAS_EN
  acoesPorRegulacao: typeof ingles.ACOES_POR_REGULACAO_EN
  oQueEstaEmJogo: typeof ingles.O_QUE_ESTA_EM_JOGO_EN
  motor: {
    fases: readonly { fase: string; prazo: string }[]
    diagnosticoExecutivo: { titulo: string; descricao: string }
    frenteRegulatoria: string
    iaSobreDadosConfiaveis: { titulo: string; descricao: string }
    leitura: { abaixo: string; acima: string; compativel: string }
  }
}

export const TRADUCOES: Readonly<Record<IdiomaTraduzido, Traducao>> = {
  en: {
    setores: ingles.SETORES_EN,
    portes: ingles.PORTES_EN,
    cargos: ingles.CARGOS_EN,
    pilares: ingles.PILARES_EN,
    perguntas: ingles.PERGUNTAS_EN,
    rotulosDasTags: ingles.ROTULOS_DAS_TAGS_EN,
    rotulosNaLinha: ingles.ROTULOS_NA_LINHA_EN,
    niveis: ingles.NIVEIS_EN,
    ofertas: ingles.OFERTAS_EN,
    acoesPorRegulacao: ingles.ACOES_POR_REGULACAO_EN,
    oQueEstaEmJogo: ingles.O_QUE_ESTA_EM_JOGO_EN,
    motor: ingles.MOTOR_EN,
  },
  es: {
    setores: espanhol.SETORES_ES,
    portes: espanhol.PORTES_ES,
    cargos: espanhol.CARGOS_ES,
    pilares: espanhol.PILARES_ES,
    perguntas: espanhol.PERGUNTAS_ES,
    rotulosDasTags: espanhol.ROTULOS_DAS_TAGS_ES,
    rotulosNaLinha: espanhol.ROTULOS_NA_LINHA_ES,
    niveis: espanhol.NIVEIS_ES,
    ofertas: espanhol.OFERTAS_ES,
    acoesPorRegulacao: espanhol.ACOES_POR_REGULACAO_ES,
    oQueEstaEmJogo: espanhol.O_QUE_ESTA_EM_JOGO_ES,
    motor: espanhol.MOTOR_ES,
  },
}

/** A tradução do idioma, ou `null` no português. */
export const traducaoDe = (idioma: Locale): Traducao | null => (idioma === 'pt' ? null : TRADUCOES[idioma])
