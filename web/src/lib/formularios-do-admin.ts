/* Regras puras dos formulários montados no admin (feature
 * criador-de-formularios, task 048). Sem Payload e sem React: a collection usa
 * para validar, o mapper para ler, e a action da 049 para conferir o envio — a
 * mesma regra nos três lados. */

import { ehIdentificadorDeConversao, normalizarNome } from './formatos-de-integracao'

/** Os tipos de campo da v1, na ordem do seletor do admin. */
export const TIPOS_DE_CAMPO = [
  'name',
  'email',
  'phone',
  'company',
  'jobTitle',
  'shortText',
  'longText',
  'select',
  'checkbox',
] as const
export type TipoDeCampo = (typeof TIPOS_DE_CAMPO)[number]

/** Os tipos que têm campo padrão no RD e coluna própria (ou quase) no envio:
 *  cada um aparece no máximo uma vez num formulário, senão o RD receberia dois
 *  nomes e só um sobreviveria. O e-mail, além disso, é obrigatório. */
export const TIPOS_UNICOS: readonly TipoDeCampo[] = ['name', 'email', 'phone', 'company', 'jobTitle']

/** Os tipos sem campo padrão no RD — só estes escolhem um `cf_…`. */
export const TIPOS_COM_CAMPO_PERSONALIZADO: readonly TipoDeCampo[] = ['shortText', 'longText', 'select', 'checkbox']

export const MAX_CAMPOS = 20
export const MAX_OPCOES = 50

/* Marca de código e caracteres invisíveis: a mesma régua dos nomes do RD
 * (`formatos-de-integracao.ts`), para a sugestão nunca nascer recusada. */
const FORA_DE_UM_NOME = /[<>{}`"\\\p{C}\p{Zl}\p{Zp}]/gu

/**
 * O identificador de conversão sugerido quando o formulário é criado: o
 * próprio nome, sem o que a validação recusaria. O RD aceita espaço e acento,
 * e o marketing reconhece o formulário pelo nome que deu a ele.
 *
 * Só na criação (o gancho decide): depois disso o campo é do marketing, e
 * apagado quer dizer "não mandar ao RD".
 */
export function sugerirIdentificador(nome: string | null | undefined): string | null {
  const limpo = normalizarNome(String(nome ?? '').replace(FORA_DE_UM_NOME, ' ').replace(/\s+/g, ' ')).slice(0, 100).trim()
  return limpo && ehIdentificadorDeConversao(limpo) ? limpo : null
}

/**
 * O valor estável de uma opção de lista, gerado do rótulo: minúsculo, sem
 * acento, com hífen. É o que fica gravado no envio e no RD — o rótulo pode ser
 * reescrito depois sem desalinhar os envios antigos.
 */
export function valorDaOpcao(rotulo: string | null | undefined): string {
  return String(rotulo ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const MAX_VALOR = 60

/** O primeiro `base`, `base-2`, `base-3`… que ninguém tomou, sempre dentro de
 *  `MAX_VALOR` — a base é cortada para o sufixo caber. */
function valorLivre(base: string, tomados: Set<string>): string {
  if (!tomados.has(base)) return base
  for (let n = 2; ; n++) {
    const sufixo = `-${n}`
    const candidato = `${base.slice(0, MAX_VALOR - sufixo.length)}${sufixo}`
    if (!tomados.has(candidato)) return candidato
  }
}

export type OpcaoParaValor = { id?: string | null; label?: string | null; value?: string | null }

/**
 * O valor gravado de cada opção de uma lista.
 *
 * ⚠️ O dono de um valor é a **opção salva com aquele id**, e não o texto que
 * chega no envio: o "Duplicar" do admin copia o valor (campo somente leitura)
 * para a linha nova, e arrastar uma opção nova para o topo a faria tomar o
 * valor da antiga — e os envios antigos passariam a apontar para a opção
 * errada. Por isso: opção que já existia (mesmo id em `originais`) mantém o
 * valor dela; opção nova ganha um valor do próprio rótulo, livre entre os já
 * tomados.
 *
 * Opção criada com o admin em inglês ganha o valor do rótulo em inglês: é o
 * único rótulo que o gancho vê naquele momento.
 */
export function valoresDasOpcoes(atuais: readonly OpcaoParaValor[], originais: readonly OpcaoParaValor[]): string[] {
  const doOriginal = new Map(originais.flatMap((o) => (o.id && o.value ? [[o.id, o.value] as const] : [])))
  const mantidos = atuais.map((o) => (o.id ? doOriginal.get(o.id) : undefined))
  const tomados = new Set(mantidos.filter((v): v is string => Boolean(v)))
  return atuais.map((o, i) => {
    const mantido = mantidos[i]
    if (mantido) return mantido
    const valor = valorLivre(valorDaOpcao(o.label) || 'opcao', tomados)
    tomados.add(valor)
    return valor
  })
}

/**
 * O nome de um campo personalizado do RD: `cf_` seguido de minúsculas, dígitos
 * e sublinhado — o formato com que o RD cria os campos (`cf_area_de_atuacao`).
 * Que o campo **exista** na conta só o RD diz: a recusa chega em `rd.error`.
 */
export function ehCampoPersonalizadoDoRd(valor: string): boolean {
  return /^cf_[a-z0-9_]{1,60}$/.test(valor)
}

/**
 * Um endereço do próprio site, para o "depois do envio". Começa com `/`, sem
 * domínio, sem `//` (que o navegador lê como outro domínio) e sem espaço. O
 * prefixo `/en` entra no mapper, como nos destinos do rodapé e do painel do
 * menu; o `proxy.ts` traduz os slugs.
 *
 * ⚠️ É digitado, e não uma relação com Páginas: página criada em Conteúdo →
 * Páginas não tem rota própria no site (só as fixas e as páginas-mestras), e o
 * destino mais comum é justamente outra coisa — um case, um material.
 */
export function ehEnderecoInterno(valor: string): boolean {
  return (
    /^\/(?!\/)[^\s\\]{0,199}$/.test(valor) &&
    /* O prefixo de idioma é do site, não do editor: `/pt/contato` viraria
       `/en/pt/contato` na versão em inglês. */
    !/^\/(pt|en)(\/|$|[?#])/i.test(valor) &&
    /* Controle invisível tornaria inválido o cabeçalho `Location` de um
       redirecionamento feito no servidor. */
    !/\p{C}/u.test(valor)
  )
}

export type CampoParaConferir = {
  type?: string | null
  rdField?: string | null
  required?: boolean | null
  consent?: boolean | null
}

/**
 * O que está errado na lista de campos, ou `null`:
 * - exatamente um e-mail — é por ele que o RD identifica o lead;
 * - no máximo um de cada tipo com campo padrão no RD;
 * - um campo personalizado do RD (`cf_…`) por campo: dois mandando para o
 *   mesmo, um sobrescreveria o outro no RD sem aviso;
 * - no máximo uma caixa de consentimento, e nunca obrigatória: consentimento
 *   forçado não é livre (LGPD), e "desmarcada → sem base legal" deixaria de
 *   existir;
 * - entre 1 e `MAX_CAMPOS` campos.
 */
export function conferirCampos(campos: readonly CampoParaConferir[] | null | undefined): string | null {
  const lista = campos ?? []
  const emails = lista.filter((c) => c.type === 'email').length
  if (emails === 0) return 'O formulário precisa de um campo de e-mail: é por ele que o RD identifica o lead.'
  if (emails > 1) return 'O formulário tem mais de um campo de e-mail. Deixe só um.'
  if (lista.length > MAX_CAMPOS) return `Um formulário tem no máximo ${MAX_CAMPOS} campos.`
  for (const tipo of TIPOS_UNICOS) {
    if (tipo === 'email') continue
    if (lista.filter((c) => c.type === tipo).length > 1) {
      return `O tipo "${ROTULO_DO_TIPO[tipo].pt}" aparece mais de uma vez. Cada um desses tipos vai para um campo padrão do RD e só pode aparecer uma vez.`
    }
  }
  /* Só conta o `cf_` de quem pode tê-lo: trocado o tipo, o valor antigo fica
     escondido no admin e não vai a lugar nenhum. */
  const personalizados = lista
    .filter((c) => TIPOS_COM_CAMPO_PERSONALIZADO.includes(c.type as TipoDeCampo))
    .map((c) => c.rdField?.trim())
    .filter((v): v is string => Boolean(v))
  const repetido = personalizados.find((v, i) => personalizados.indexOf(v) !== i)
  if (repetido) return `Dois campos mandam a resposta para "${repetido}" no RD. Cada campo personalizado do RD recebe um campo só.`
  const consentimentos = lista.filter((c) => c.type === 'checkbox' && c.consent)
  if (consentimentos.length > 1) return 'Só uma caixa de marcar pode ser o consentimento para receber comunicações.'
  if (consentimentos.some((c) => c.required)) {
    return 'A caixa de consentimento não pode ser obrigatória: consentimento só vale se a pessoa puder deixar de marcar.'
  }
  return null
}

/** O nome de cada tipo no admin (português; o admin do Payload é traduzido). */
export const ROTULO_DO_TIPO: Record<TipoDeCampo, { pt: string; en: string }> = {
  name: { pt: 'Nome', en: 'Name' },
  email: { pt: 'E-mail', en: 'E-mail' },
  phone: { pt: 'Telefone', en: 'Phone' },
  company: { pt: 'Empresa', en: 'Company' },
  jobTitle: { pt: 'Cargo', en: 'Job title' },
  shortText: { pt: 'Texto curto', en: 'Short text' },
  longText: { pt: 'Texto longo', en: 'Long text' },
  select: { pt: 'Lista de opções', en: 'Option list' },
  checkbox: { pt: 'Caixa de marcar', en: 'Checkbox' },
}
