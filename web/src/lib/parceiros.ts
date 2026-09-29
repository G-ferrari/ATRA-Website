import type { Locale } from './locales'
import { comParceiros, comVitrineDeParceiros } from './mappers/blocks'
import { toParceiroDaFaixa } from './mappers/partner'
import { getPayload } from './payload'
import type { Bloco } from '@/types/content'

/* Injeta o cadastro de parceiros nos blocos que o leem: a faixa de logos da
 * home e, desde 29/09, a vitrine de parceiros em "Todos".
 *
 * ⚠️ Toda rota que monta página por blocos chama isto — `resolverPagina` e as
 * rotas de solução, segmento e parceiro. A vitrine em "Todos" sai do mapper
 * **vazia**, e o bloco vazio não desenha nada: uma rota que esquecer a chamada
 * perde a seção inteira, sem erro.
 *
 * Uma consulta só para os dois blocos, e nenhuma quando a página não tem
 * nenhum deles. `partners` não tem rascunho — não há `_status` a filtrar. */
export async function comParceirosCadastrados(blocos: Bloco[], locale: Locale): Promise<Bloco[]> {
  const faixa = blocos.some((b) => b.tipo === 'logoMarquee')
  const vitrine = blocos.some((b) => b.tipo === 'partnerShowcase' && b.source === 'all')
  if (!faixa && !vitrine) return blocos

  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'partners',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    select: { name: true, slug: true, logo: true, logoDark: true, logoScale: true, hasPage: true },
  })

  if (faixa) comParceiros(blocos, docs.map((p) => toParceiroDaFaixa(p, locale)).filter((p) => p !== null))
  if (vitrine) comVitrineDeParceiros(blocos, docs)
  return blocos
}
