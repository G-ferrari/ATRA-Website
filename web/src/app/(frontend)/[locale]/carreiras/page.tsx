import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import { buscarVagasAbertas } from '@/lib/atrair'
import { lerIntegracaoAtrair } from '@/lib/integracoes'
import { isLocale, LOCALES } from '@/lib/locales'
import { metadataDaPaginaMestra, resolverPaginaMestra } from '@/lib/paginas'

/* /carreiras (MIG-050) — página montada por blocos, página-mestra da seção
 * desde a D-55 (achada pela marca da seção, não pelo slug). Casca fina: resolve
 * e renderiza. Toda a estrutura vive no CMS.
 *
 * As vagas ABERTAS vêm do ATRAIR **quando a integração está ligada no CMS**
 * (D-41, chave `integrations.atrair.jobsFeed`): é o sistema de R&S que sabe o
 * que está aberto de verdade. Desligada — ou com o ATRAIR fora do ar —, a grade
 * mostra as vagas da collection `jobs`, que têm página própria em
 * `/carreiras/[slug]`.
 *
 * Resolvidas aqui e passadas como prop: nenhum componente busca dado (regra 4).
 *
 * ⚠️ `vagasDoAtrair` é `VagaAberta[] | null`, e o `null` **não** é decoração:
 * `[]` é o ATRAIR dizendo "nenhuma vaga aberta" (mostra o vazio) e `null` é
 * "não foi possível perguntar" (cai para o CMS). Ver `ResultadoDeVagas`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return metadataDaPaginaMestra('carreiras')
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  /* O global das integrações é lido antes de tudo porque é ele que diz se vale
     a pena chamar o ATRAIR — desligado, a chamada não acontece. As duas
     consultas que sobram seguem em paralelo. */
  const integracao = await lerIntegracaoAtrair()
  const [pagina, vagas] = await Promise.all([
    resolverPaginaMestra('carreiras', locale),
    buscarVagasAbertas(integracao),
  ])
  if (!pagina) notFound()

  return (
    <PaginaMestra
      pagina={pagina}
      locale={locale}
      className="pb-0 bg-surface-1 min-h-screen text-text-main"
      vagasDoAtrair={vagas.fonte === 'atrair' ? vagas.vagas : null}
    />
  )
}
