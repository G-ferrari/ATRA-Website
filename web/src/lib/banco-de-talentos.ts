/* As opções do formulário do banco de talentos (Trabalhe Conosco) — uma lista
 * só, que o formulário mostra e a action confere.
 *
 * ⚠️ A action aceita **só** estas opções nos campos do perfil (D-62, 15/10).
 * Nasceu para o envio ao RD, onde um POST forjado punha texto livre no perfil
 * de qualquer e-mail; o envio saiu na D-67 (22/10), e a regra ficou: os campos
 * são o filtro do RH no admin, e grava sempre o rótulo **em português** — em
 * inglês o mesmo cargo viraria outro valor no filtro.
 *
 * As listas são as do protótipo (D-22: escolher as opções é do marketing e do
 * RH). O formulário do WordPress usava outras (31 cargos; nível com
 * "Especialista") — se os campos do RD forem listas fechadas com aqueles
 * valores, isto precisa casar com eles (a conferir na task 047). */

export const AREAS = {
  pt: ['Engenharia de Dados', 'Inteligência Artificial / ML', 'Analytics & BI', 'Arquitetura Cloud', 'Outros'],
  en: ['Data Engineering', 'Artificial Intelligence / ML', 'Analytics & BI', 'Cloud Architecture', 'Other'],
} as const

export const SENIORIDADES = {
  pt: ['Júnior', 'Pleno', 'Sênior', 'Lead / Principal', 'Trainee'],
  en: ['Junior', 'Mid-level', 'Senior', 'Lead / Principal', 'Trainee'],
} as const

/** O rótulo em português da opção escolhida, em qualquer idioma; `undefined`
 *  para o que não é opção da lista (vazio, forjado, de outra versão). */
function opcaoEmPortugues(lista: { pt: readonly string[]; en: readonly string[] }, valor: string): string | undefined {
  const i = Math.max(lista.pt.indexOf(valor), lista.en.indexOf(valor))
  return i >= 0 ? lista.pt[i] : undefined
}

export const areaEmPortugues = (valor: string) => opcaoEmPortugues(AREAS, valor)
export const senioridadeEmPortugues = (valor: string) => opcaoEmPortugues(SENIORIDADES, valor)

/** O LinkedIn como endereço `http(s)`, até 300 caracteres; o resto vira
 *  `undefined` — o campo é texto livre na tela, e um endereço é o que o RD e o
 *  RH esperam ali. */
export function linkedinValido(valor: string): string | undefined {
  if (!valor || valor.length > 300) return undefined
  try {
    const url = new URL(valor)
    return url.protocol === 'https:' || url.protocol === 'http:' ? valor : undefined
  } catch {
    return undefined
  }
}
