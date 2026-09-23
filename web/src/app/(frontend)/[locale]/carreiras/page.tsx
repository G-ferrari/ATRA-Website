import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { buscarVagasAbertas } from '@/lib/atrair'
import { isLocale, LOCALES } from '@/lib/locales'
import { resolverPagina } from '@/lib/paginas'
import { metadataDe } from '@/lib/seo'

/* /carreiras (MIG-050) — página montada por blocos. Casca fina: resolve e renderiza.
 * Toda a estrutura vive no CMS.
 *
 * As vagas ABERTAS vêm do ATRAIR, não do CMS: é o sistema de R&S que sabe o que
 * está aberto de verdade, e é dele que sai o identificador que faz a
 * candidatura cair na vaga certa. Resolvidas aqui e passadas como prop — nenhum
 * componente busca dado (regra 4). Se o ATRAIR estiver fora, a lista vem vazia
 * e o formulário volta a ser um envio para o banco de talentos geral. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const pagina = await resolverPagina('carreiras', 'careers', locale)
  return pagina ? metadataDe({ locale, local: { secao: 'carreiras' }, seo: pagina.seo }) : {}
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const [pagina, vagasAbertas] = await Promise.all([
    resolverPagina('carreiras', 'careers', locale),
    buscarVagasAbertas(),
  ])
  if (!pagina) notFound()

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <RenderBlocks blocos={pagina.blocos} locale={locale} vagasAbertas={vagasAbertas} />
    </main>
  )
}
