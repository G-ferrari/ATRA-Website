'use client'

import { useRowLabel, useTranslation } from '@payloadcms/ui'

/* O rótulo de cada resposta de um envio de formulário do admin (task 052).
 *
 * Sem ele o Payload mostra "Resposta 01", "Resposta 02"… e, recolhidas, as
 * linhas não dizem nada. Aqui a linha já é a leitura do envio: "Empresa: Banco
 * X". Resposta longa é cortada: o texto inteiro está na própria linha, aberta. */

type Linha = { label?: string | null; value?: string | null }

const MAX = 80

export function RotuloDaResposta() {
  const { data, rowNumber } = useRowLabel<Linha>()
  const { i18n } = useTranslation()
  const pergunta =
    data?.label?.trim() || `${i18n.language === 'en' ? 'Answer' : 'Resposta'} ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const resposta = data?.value?.replace(/\s+/g, ' ').trim()
  if (!resposta) return <span>{pergunta}</span>
  /* "Como conheceu a ATRA?: Busca" não: pergunta que já fecha com pontuação
     dispensa os dois-pontos. */
  const separador = /[?!.:]$/.test(pergunta) ? ' ' : ': '
  return (
    <span>
      {pergunta}
      {separador}
      <strong>{resposta.length > MAX ? `${resposta.slice(0, MAX - 1)}…` : resposta}</strong>
    </span>
  )
}
