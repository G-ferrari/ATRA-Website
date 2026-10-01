import { ehEndpointDeIntegracao } from '@/lib/formatos-de-integracao'
import type { Integration } from '@/payload-types'
import type { IntegracaoAtrair } from '@/types/content'

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
