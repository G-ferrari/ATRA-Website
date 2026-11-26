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

import { LOCALES, type Locale } from './locales'

export const AREAS = {
  pt: ['Engenharia de Dados', 'Inteligência Artificial / ML', 'Analytics & BI', 'Arquitetura Cloud', 'Outros'],
  en: ['Data Engineering', 'Artificial Intelligence / ML', 'Analytics & BI', 'Cloud Architecture', 'Other'],
  es: ['Ingeniería de Datos', 'Inteligencia Artificial / ML', 'Analytics & BI', 'Arquitectura Cloud', 'Otros'],
} as const

export const SENIORIDADES = {
  pt: ['Júnior', 'Pleno', 'Sênior', 'Lead / Principal', 'Trainee'],
  en: ['Junior', 'Mid-level', 'Senior', 'Lead / Principal', 'Trainee'],
  es: ['Junior', 'Semi Senior', 'Senior', 'Lead / Principal', 'Trainee'],
} as const

/** O rótulo em português da opção escolhida, em qualquer idioma; `undefined`
 *  para o que não é opção da lista (vazio, forjado, de outra versão). */
function opcaoEmPortugues(lista: Record<Locale, readonly string[]>, valor: string): string | undefined {
  const i = Math.max(...LOCALES.map((l) => lista[l].indexOf(valor)))
  return i >= 0 ? lista.pt[i] : undefined
}

export const areaEmPortugues = (valor: string) => opcaoEmPortugues(AREAS, valor)
export const senioridadeEmPortugues = (valor: string) => opcaoEmPortugues(SENIORIDADES, valor)

/** O endereço do perfil no LinkedIn, normalizado para `https://`; `undefined`
 *  para o que não é perfil do LinkedIn.
 *
 *  ⚠️ Obrigatório no Banco de Talentos desde 26/11 (pedido do RH): é o
 *  LinkedIn, e não um anexo, que o RH abre para avaliar o candidato. Daí a
 *  regra ser "perfil do LinkedIn" e não "qualquer endereço" — um link para o
 *  portfólio ou para o Google passaria pela regra antiga e não serviria.
 *
 *  Aceita como o candidato cola: com ou sem `https://`, com ou sem `www.`, com
 *  subdomínio de país (`br.linkedin.com`), e o endereço público antigo
 *  (`/pub/`). Só `/in/<perfil>`: página de empresa, de vaga ou de post não é o
 *  perfil de ninguém. A mesma função vale no navegador (a mensagem no campo) e
 *  na action (a regra que vale). */
export function perfilDoLinkedin(valor: string): string | undefined {
  const bruto = valor.trim()
  if (!bruto || bruto.length > 300) return undefined
  const comProtocolo = /^[a-z][a-z\d+.-]*:/i.test(bruto) ? bruto : `https://${bruto}`
  let url: URL
  try {
    url = new URL(comProtocolo)
  } catch {
    return undefined
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined
  if (url.username || url.password || url.port) return undefined
  const host = url.hostname.toLowerCase()
  if (host !== 'linkedin.com' && !host.endsWith('.linkedin.com')) return undefined
  if (!/^\/(in|pub)\/[^/]+/i.test(url.pathname)) return undefined
  url.protocol = 'https:'
  return url.href
}
