import { CONVERSOES_PADRAO, ehEndpointDeIntegracao, ehIdentificadorDeConversao } from '@/lib/formatos-de-integracao'
import type { Integration } from '@/payload-types'
import type { IntegracaoAtrair, IntegracaoRd } from '@/types/content'

/* Mapper do global `integrations` (D-41).
 *
 * O admin vence. `ATRAIR_API_URL` fica de reserva: até a D-41 era a única fonte
 * do endereço, e um ambiente que já a tenha não perde a integração com o
 * deploy — mesmo arranjo que o mapper do `tracking` faz com o id do GTM.
 *
 * ⚠️ Endereço fora do formato vira `null` **também aqui**, não só na validação
 * do admin: a reserva vem do ambiente, que o admin não valida, e este endereço
 * é o que recebe a `ATRAIR_API_KEY` no cabeçalho. Um `ATRAIR_API_URL` torto num
 * `.env` não pode virar chave entregue no lugar errado.
 *
 * ⚠️ A barra final sai **aqui**, uma vez. Antes cada chamada fazia
 * `base.replace(/\/$/, '')` por conta própria, e uma delas esquecer produzia
 * `//api/public/vagas` — que alguns servidores atendem e outros 404.
 */
export function toIntegracaoAtrair(
  doc: Pick<Integration, 'atrair'>,
  reserva: { endpoint?: string } = {},
): IntegracaoAtrair {
  const bruto = doc.atrair?.endpoint?.trim() || reserva.endpoint?.trim() || ''
  const endpoint = ehEndpointDeIntegracao(bruto) ? bruto.replace(/\/+$/, '') : null
  return {
    endpoint,
    /* ⚠️ `?? true` e não `?? false`: o checkbox nasce ligado no global, e um
     * global ainda não gravado devolve o campo `undefined` em vez do
     * `defaultValue`. Ler isso como "desligado" apagaria a grade de vagas de
     * quem só fez o deploy — a D-41 não muda o que está no ar. */
    vagas: doc.atrair?.jobsFeed ?? true,
    bancoDeTalentos: doc.atrair?.talentPool ?? true,
  }
}

/* D-54 — a parte do RD Station Marketing do mesmo global.
 *
 * ⚠️ Identificador fora do formato vira `null` **aqui** também: o campo vai em
 * JSON para o RD, e um valor que entrou por outro caminho (banco editado à
 * mão) não pode chegar à chamada. `null` desliga aquele formulário, não a
 * integração.
 *
 * ⚠️ Global ainda não gravado devolve `undefined` em vez do `defaultValue`:
 * `ligado` lê como ligado (a D-54 não muda o que está no ar — sem a chave no
 * ambiente, segue inerte), `camposPersonalizados` como desligado (o seguro),
 * e cada identificador cai no padrão com que o campo nasce. */
export function toIntegracaoRd(doc: Pick<Integration, 'rdStationMarketing'>): IntegracaoRd {
  const g = doc.rdStationMarketing
  const c = g?.conversions
  const identificador = (valor: string | null | undefined, padrao: string): string | null => {
    /* `undefined` é "nunca gravado" → padrão; `''` é o admin apagando de
     * propósito → aquele formulário não vai. */
    const bruto = valor === undefined ? padrao : (valor ?? '').trim()
    return bruto && ehIdentificadorDeConversao(bruto) ? bruto : null
  }
  return {
    ligado: g?.enabled ?? true,
    camposPersonalizados: g?.customFields ?? false,
    conversoes: {
      contato: identificador(c?.contact, CONVERSOES_PADRAO.contact),
      chat: identificador(c?.chatLead, CONVERSOES_PADRAO.chatLead),
      newsletter: identificador(c?.newsletter, CONVERSOES_PADRAO.newsletter),
      download: identificador(c?.materialDownload, CONVERSOES_PADRAO.materialDownload),
      consultores: identificador(c?.consultantRequest, CONVERSOES_PADRAO.consultantRequest),
      diagnostico: identificador(c?.dataMaturityDiagnostic, CONVERSOES_PADRAO.dataMaturityDiagnostic),
    },
  }
}
