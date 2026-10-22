'use client'

import { useRowLabel, useTranslation } from '@payloadcms/ui'

import { ROTULO_DO_TIPO, type TipoDeCampo } from '@/lib/formularios-do-admin'

/* O rótulo de cada linha da lista de campos de um formulário (task 048).
 *
 * Sem ele o Payload mostra "Campo 01", "Campo 02"… e, fechadas, as linhas de um
 * formulário de dez campos são indistinguíveis. Aqui a linha diz o que é:
 * "Empresa · obrigatório", ou "Qual o seu desafio? · Texto longo". */

type Linha = { type?: TipoDeCampo | null; label?: string | null; required?: boolean | null }

export function RotuloDoCampoDoFormulario() {
  const { data, rowNumber } = useRowLabel<Linha>()
  const { i18n } = useTranslation()
  const idioma = i18n.language === 'en' ? 'en' : 'pt'
  const tipo = data?.type ? ROTULO_DO_TIPO[data.type]?.[idioma] : null
  const rotulo = data?.label?.trim()
  const obrigatorio = data?.required || data?.type === 'email'

  const partes = [
    rotulo || (idioma === 'en' ? `Field ${String((rowNumber ?? 0) + 1).padStart(2, '0')}` : `Campo ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`),
    /* "E-mail · E-mail" não diz nada: o tipo só entra quando difere do rótulo. */
    tipo && tipo.toLowerCase() !== rotulo?.toLowerCase() ? tipo : null,
    obrigatorio ? (idioma === 'en' ? 'required' : 'obrigatório') : null,
  ].filter(Boolean)
  return <span>{partes.join(' · ')}</span>
}
