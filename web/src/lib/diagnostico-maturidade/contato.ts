/* Contato do questionário (feature diagnostico-maturidade-dados, task 027).
 *
 * A validação que a ilha faz antes de enviar — o `validateLead` do HTML do
 * Roger (v1.7) — e os parâmetros do evento do envio aceito. Fica fora do
 * `index.ts` pelo mesmo motivo de `questionario.ts`: só a ilha usa.
 *
 * ⚠️ Regras e textos são **os mesmos** da action
 * (`actions/diagnostico-maturidade.ts`), e as duas validações existem de
 * propósito: o cliente recusa antes para a pessoa não esperar a rede nem
 * gastar a cota por IP; o servidor recusa de novo porque Server Action é
 * endpoint público (MIG-142). Não dá para importar de lá — arquivo
 * `'use server'` só exporta função assíncrona —, então `contato.test.ts` roda a
 * action com os mesmos casos e reprova se as duas divergirem.
 */

import type { Setor } from './dados'
import { ehEmailCorporativo } from './motor'

/** A empresa fica de fora: no HTML ela é "(opcional)" e não tem regra. */
export type CampoValidado = 'name' | 'email' | 'phone' | 'consentimento'

export type ContatoDigitado = Record<Exclude<CampoValidado, 'consentimento'>, string> & { consentimento: boolean }

export type ErrosDoContato = Partial<Record<CampoValidado, string>>

/** A ordem do formulário, que é a ordem em que o foco procura o primeiro erro. */
export const CAMPOS_VALIDADOS: readonly CampoValidado[] = ['name', 'email', 'phone', 'consentimento']

/** `.aq-field .err` do HTML, caractere a caractere (D-22). */
export const ERROS_DO_CONTATO: Record<CampoValidado, string> = {
  name: 'Informe seu nome.',
  email: 'Use um e-mail corporativo válido (não aceitamos gmail, hotmail, etc.).',
  phone: 'Informe um telefone com DDD.',
  consentimento: 'É preciso autorizar o contato para receber o diagnóstico.',
}

/* Os mesmos cortes da action: `texto` (apara e corta em 200) e `linha` (junta
 * espaços). Sem eles, "A    b" passaria no servidor e seria recusado aqui — o
 * servidor mede o nome depois de juntar os espaços. */
const MAX_CAMPO = 200
const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const texto = (valor: string) => valor.trim().slice(0, MAX_CAMPO)
const linha = (valor: string) => texto(valor).replace(/\s+/g, ' ')

/** Um problema por campo, todos de uma vez — errar dois e descobrir um por
 * envio é o que o HTML evita marcando todos juntos. Objeto vazio = pode enviar. */
export function validarContato(contato: ContatoDigitado): ErrosDoContato {
  const erros: ErrosDoContato = {}
  const email = texto(contato.email)
  if (linha(contato.name).length < 3) erros.name = ERROS_DO_CONTATO.name
  if (!FORMATO_DE_EMAIL.test(email) || !ehEmailCorporativo(email)) erros.email = ERROS_DO_CONTATO.email
  if (linha(contato.phone).replace(/\D/g, '').length < 10) erros.phone = ERROS_DO_CONTATO.phone
  if (!contato.consentimento) erros.consentimento = ERROS_DO_CONTATO.consentimento
  return erros
}

/** Parâmetros do `quiz_maturidade_lead` — o `dataLayer.push` do `submitLead` do
 * HTML, que a ilha manda por `rastrear` (no-op sem GTM e sem consentimento de
 * estatística, D-30).
 *
 * ⚠️ Só o setor. O HTML manda também `quiz_nivel`, mas lá a nota era calculada
 * no navegador; aqui quem calcula é o servidor (MIG-142) e a action devolve só
 * o e-mail — a tela de conclusão não mostra resultado (decisão de 26/09). Nível
 * inventado no cliente seria um número diferente do que o lead recebe. */
export function parametrosDoLead(setor: Setor | null): Record<string, string> {
  return setor ? { quiz_setor: setor } : {}
}
