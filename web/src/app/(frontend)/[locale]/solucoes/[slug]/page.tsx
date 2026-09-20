import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { RenderBlocks } from '@/components/blocks/render-blocks'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { comContato, toBlocos, toMetricas, toSelos } from '@/lib/mappers/blocks'
import { getPayload } from '@/lib/payload'
import { lerContato } from '@/lib/contato'
import { toSeo } from '@/lib/mappers/seo'
import { metadataDe } from '@/lib/seo'
import { DadosEstruturados } from '@/components/layout/dados-estruturados'
import { servico } from '@/lib/jsonld'
import { ORIGEM } from '@/lib/seo'
import { hrefDe } from '@/lib/routes'

/* /solucoes/[slug] (MIG-056) — porte de `legacy/src/pages/SolutionAI.tsx`.
 *
 * Mesmo padrão de `/parceiros/[slug]`: a página é montada por blocos guardados
 * na própria solução, e só existe para quem tem `hasPage`. No legado havia uma
 * página de IA em código, servindo também `/solucoes`; D-09 separou as duas, e
 * o que era componente fixo virou conteúdo — as outras 5 soluções (e as 13 de
 * MIG-093) reaproveitam a mesma estrutura sem código novo. */

async function buscarSolucao(slug: string, locale: Locale) {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()

  const [{ docs }, global, contato] = await Promise.all([
    payload.find({
      collection: 'solutions',
      locale,
      depth: 2,
      limit: 1,
      draft: rascunho,
      /* Fora do modo rascunho, só publicado: a Local API ignora `access.read`
       * (`overrideAccess: true` por padrão), e sem isto a solução em rascunho
       * responde 200 para qualquer visitante. */
      where: rascunho
        ? { slug: { equals: slug }, hasPage: { equals: true } }
        : { slug: { equals: slug }, hasPage: { equals: true }, _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
    lerContato(),
  ])

  if (!docs[0]) return null
  const blocos = toBlocos(docs[0].layout, { metricas: toMetricas(global), selos: toSelos(global) })
  /* O `ctaContact` desenha telefone/e-mail/endereço/redes do global `contact` —
   * mesmo passo de `lib/paginas.ts`. A rota de solução não o fazia, então o cartão
   * nascia vazio aqui (a página RC18 usa o formulário no padrão da home). */
  comContato(blocos, contato)
  return { doc: docs[0], blocos }
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'solutions',
      locale,
      depth: 0,
      limit: 200,
      where: { hasPage: { equals: true }, _status: { equals: 'published' } },
      // Só o slug: sem isto a consulta arrasta o `layout` inteiro, com um join
      // por tipo de bloco, para montar uma lista de caminhos.
      select: { slug: true },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/solucoes/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const s = await buscarSolucao(slug, locale)
  if (!s) return {}
  return metadataDe({
    locale,
    local: { secao: 'solucoes', slug },
    seo: toSeo(s.doc.seo, { titulo: s.doc.title, descricao: s.doc.shortDescription }),
  })
}

export default async function SolucaoPage({ params }: PageProps<'/[locale]/solucoes/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const solucao = await buscarSolucao(slug, locale)
  if (!solucao) notFound()

  /* Ênfases de apresentação da RC18 sobre o conteúdo já publicado no CMS (D-31),
     escopadas a este slug para não afetar as outras soluções, que compartilham os
     mesmos blocos. */
  let blocos = solucao.blocos
  if (slug === 'rc18') {
    const PRAZO_RC18 = '31 de dezembro de 2026'
    /* Ícones das 12 dimensões, na ordem do dicionário `dimensoes.cards` do seed
       (`scripts/seed/solucoes-rc18.ts`). Ficam aqui porque no CMS o bloco é um
       `accordionSteps` (só título+descrição): ao renderizar como grade, a página
       reidrata os ícones que o acordeão descarta. Manter em sincronia com a ordem
       do seed. */
    const ICONES_DIMENSOES = [
      'user-check', 'target', 'settings', 'info', 'chart', 'database',
      'shield-check', 'workflow', 'lock', 'search', 'star', 'zap',
    ]
    /* Laranja escasso e espalhado nos ícones das seções: ~1 a cada 4, deslocando por
       linha (`cols`) para não formar uma coluna; o resto fica azul. */
    const acento = (idx: number, cols: number): 'primary' | 'secondary' =>
      idx % cols === (Math.floor(idx / cols) * 3 + 2) % cols ? 'secondary' : 'primary'
    for (const b of solucao.blocos) {
      if (b.tipo === 'pageHero' || b.tipo === 'ctaBanner') b.prazoDestaque = PRAZO_RC18
      /* "O verdadeiro desafio" no layout da landing: os 5 desafios viram uma faixa
         compacta de ícone+rótulo, com uma frase de intro acima. Sem campo CMS para
         isso — é apresentação, escopada a este slug (como o selo de prazo). */
      if (b.tipo === 'audienceSplit' && b.anchor === 'o-desafio') {
        b.itemLayout = 'strip'
        b.itemsIntro = 'Quando esses caminhos não estão devidamente estruturados, surgem desafios como:'
        /* A faixa "desafio" era toda azul; intercala 1 laranja (escasso). */
        b.items.forEach((it, idx) => (it.accent = acento(idx, 5)))
      }
      /* Ícones da grade "O que precisa" (toda azul) ganham laranja escasso; a grade
         das 12 dimensões recebe o mesmo mais abaixo, na transformação. */
      if (b.tipo === 'iconCardGrid') b.items.forEach((it, idx) => (it.accent = acento(idx, b.columns)))
      /* Os dois `processSteps` — "O prazo" e a jornada "Como a ATRA te ajuda" —
         viram linha do tempo horizontal, como na landing. Ficam em fundos alternados
         (surface-2 / surface-1), o que os mantém distintos apesar do mesmo formato. */
      if (b.tipo === 'processSteps') b.layout = 'timeline'
    }
    /* As 12 dimensões saem do acordeão (parede de 12 linhas, ~1290px) para uma grade
       de cards (ícone + título + descrição, 3 linhas de 4). O bloco no CMS continua
       um `accordionSteps` — a troca é de apresentação e reidrata os ícones. Mantém
       âncora/navLabel/tema, então o item "Dimensões" do submenu segue apontando para
       cá (a lista do submenu é resolvida no mapper, antes desta troca). */
    blocos = solucao.blocos.map((b) =>
      b.tipo === 'accordionSteps' && b.anchor === 'dimensoes'
        ? {
            id: b.id,
            anchor: b.anchor,
            navLabel: b.navLabel,
            theme: b.theme,
            borda: b.borda,
            espaco: b.espaco,
            tipo: 'iconCardGrid' as const,
            eyebrow: b.eyebrow,
            title: b.title,
            columns: 4 as const,
            variant: 'card' as const,
            headerWidth: 'full' as const,
            items: b.steps.map((s, idx) => ({
              icon: ICONES_DIMENSOES[idx] ?? 'sparkles',
              title: s.title,
              description: s.description,
              accent: acento(idx, 4),
            })),
          }
        : b,
    )
  }

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      {/* Invisível: vai num `<script type="application/ld+json">`. */}
      <DadosEstruturados
        dados={servico({
          seo: toSeo(solucao.doc.seo, { titulo: solucao.doc.title, descricao: solucao.doc.shortDescription }),
          url: `${ORIGEM}${hrefDe('solucoes', locale, slug)}`,
        })}
      />
      <RenderBlocks blocos={blocos} locale={locale} />
    </main>
  )
}
