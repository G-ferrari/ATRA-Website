import { ehIdentificadorDeConversao, ehTagDoRd } from '@/lib/formatos-de-integracao'
import {
  ehCampoPersonalizadoDoRd,
  ehEnderecoInterno,
  TIPOS_COM_CAMPO_PERSONALIZADO,
  TIPOS_DE_CAMPO,
  type TipoDeCampo,
} from '@/lib/formularios-do-admin'
import type { Locale } from '@/lib/locales'
import type { Form } from '@/payload-types'
import type { CampoDoFormulario, ConfigDoFormulario, FormularioDoAdmin } from '@/types/content'

import { ConteudoIncompleto } from './shared'

/* Mappers dos formulários montados no admin (task 048).
 *
 * Dois recortes do mesmo documento, de propósito: `toFormularioDoAdmin` é o
 * que a seção desenha (e vai para o navegador); `toConfigDoFormulario` é o que
 * o servidor usa para conferir o envio, avisar e mandar ao RD — os endereços do
 * aviso e o mapeamento do RD não têm por que chegar ao HTML da página.
 *
 * Campo vazio vira `ConteudoIncompleto`: com a validação de rascunho ligada
 * isso só acontece num idioma sem tradução ou num documento gravado por fora
 * do admin, e o preview mostra o que falta em vez de estourar. */

type Linha = NonNullable<Form['fields']>[number]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const ehTipo = (valor: unknown): valor is TipoDeCampo => (TIPOS_DE_CAMPO as readonly unknown[]).includes(valor)

/** O id da linha é o nome do campo no `<form>` e no envio. O Payload sempre
 *  grava um; sem ele (documento montado à mão), a posição serve. */
const idDaLinha = (linha: Linha, i: number): string => linha.id || `campo-${i + 1}`

function linhasValidas(doc: Pick<Form, 'fields'>): { linha: Linha; tipo: TipoDeCampo; i: number }[] {
  const linhas = (doc.fields ?? []).flatMap((linha, i) => (ehTipo(linha.type) ? [{ linha, tipo: linha.type, i }] : []))
  if (!linhas.some((l) => l.tipo === 'email')) throw new ConteudoIncompleto('forms.fields (campo de e-mail)')
  return linhas
}

/** O endereço do "depois do envio" no idioma da página: o admin guarda o
 *  caminho em português, e o `proxy.ts` traduz os slugs a partir do `/en`. */
function hrefNoIdioma(caminho: string, locale: Locale): string {
  if (locale === 'pt') return caminho
  return caminho === '/' ? `/${locale}` : `/${locale}${caminho}`
}

export function toFormularioDoAdmin(doc: Form, locale: Locale): FormularioDoAdmin {
  const campos: CampoDoFormulario[] = linhasValidas(doc).map(({ linha, tipo, i }) => {
    const rotulo = linha.label?.trim()
    if (!rotulo) throw new ConteudoIncompleto(`forms.fields[${i + 1}].label`)
    return {
      id: idDaLinha(linha, i),
      tipo,
      rotulo,
      exemplo: linha.placeholder?.trim() || null,
      obrigatorio: tipo === 'email' || Boolean(linha.required),
      largura: linha.width === 'half' ? 'meia' : 'inteira',
      opcoes:
        tipo === 'select'
          ? (linha.options ?? []).flatMap((o) =>
              o.value?.trim() && o.label?.trim() ? [{ rotulo: o.label.trim(), valor: o.value.trim() }] : [],
            )
          : [],
    }
  })

  const botao = doc.submitLabel?.trim()
  if (!botao) throw new ConteudoIncompleto('forms.submitLabel')

  let depoisDoEnvio: FormularioDoAdmin['depoisDoEnvio']
  if (doc.afterSubmit === 'page') {
    const caminho = doc.redirectPath?.trim()
    if (!caminho || !ehEnderecoInterno(caminho)) throw new ConteudoIncompleto('forms.redirectPath')
    depoisDoEnvio = { tipo: 'pagina', href: hrefNoIdioma(caminho, locale) }
  } else {
    const mensagem = doc.successMessage?.trim()
    if (!mensagem) throw new ConteudoIncompleto('forms.successMessage')
    depoisDoEnvio = { tipo: 'mensagem', mensagem }
  }

  return { id: doc.id, campos, botao, aviso: doc.notice?.trim() || null, depoisDoEnvio }
}

export function toConfigDoFormulario(doc: Form): ConfigDoFormulario {
  const campos = linhasValidas(doc).map(({ linha, tipo, i }) => {
    const campoNoRd = linha.rdField?.trim()
    return {
      id: idDaLinha(linha, i),
      tipo,
      rotulo: linha.label?.trim() || `Campo ${i + 1}`,
      obrigatorio: tipo === 'email' || Boolean(linha.required),
      valores: tipo === 'select' ? (linha.options ?? []).flatMap((o) => (o.value?.trim() ? [o.value.trim()] : [])) : [],
      consentimento: tipo === 'checkbox' && Boolean(linha.consent),
      campoNoRd:
        TIPOS_COM_CAMPO_PERSONALIZADO.includes(tipo) && campoNoRd && ehCampoPersonalizadoDoRd(campoNoRd) ? campoNoRd : null,
    }
  })

  const identificador = doc.rd?.conversionIdentifier?.trim()
  return {
    id: doc.id,
    nome: doc.name,
    campos,
    avisarPara: [...new Set((doc.notifyEmails ?? []).map((e) => e.trim()).filter((e) => EMAIL.test(e)))],
    rd: {
      identificador: identificador && ehIdentificadorDeConversao(identificador) ? identificador : null,
      tags: [...new Set((doc.rd?.tags ?? []).map((t) => t.trim()).filter(ehTagDoRd))],
    },
  }
}
