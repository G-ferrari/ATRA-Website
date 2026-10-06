import { Layers, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { iconePorNome } from '@/components/blocks/icones'
import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { SeloDeSolucao } from '@/components/ui/selo-de-solucao'
import { ABAS_DE_SOLUCOES } from '@/lib/abas-de-solucoes'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CabecalhoDaSecao, SolutionCard } from '@/types/content'

import { TEXTOS_DAS_SECOES } from './textos'
import { TituloComDestaque } from './titulo'

/* /solucoes (MIG-055, D-52) dentro da página-mestra: o cartão de topo com o
 * cabeçalho escrito no admin e a grade agrupada pelas abas do menu. A etiqueta
 * vem depois da contagem de abas ("4 frentes"). A RC18 não entra (D-37). */
export function ListaDeSolucoes({
  cabecalho,
  solucoes,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  solucoes: SolutionCard[]
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  /* `h1` quando a lista abre a página, que é o caso de hoje; com um herói de
     página acima, o título da página é o dele. */
  const Titulo = abertura ? 'h1' : 'h2'
  return (
    <>
      <section id={anchor ?? undefined} className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12 scroll-mt-32">
        <div className="rounded-[6px] bg-surface-2 dark:bg-linear-to-br dark:from-[#12151c] dark:via-[#1a2130] dark:to-[#0e1015] text-slate-900 dark:text-white p-6 sm:p-10 md:p-14 shadow-xl dark:shadow-2xl relative overflow-hidden vort-dot-grid">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {cabecalho.eyebrow && (
                <StatusBadge label={cabecalho.eyebrow} variant="primary" size="sm" pulse icon={<Layers size={12} />} />
              )}
              {cabecalho.chip && (
                <MetricChip label={`${ABAS_DE_SOLUCOES.length} ${cabecalho.chip}`} variant="neutral" size="sm" />
              )}
            </div>
            {(cabecalho.title || cabecalho.highlight) && (
              <Titulo className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight">
                <TituloComDestaque cabecalho={cabecalho} />
              </Titulo>
            )}
            {/* O texto de abertura nasce vazio aqui (o topo de hoje não tem); se a
                editora escrever, sai no tom da descrição do herói de página. */}
            {cabecalho.paragrafos.length > 0 && (
              <div className="mt-4 space-y-3 max-w-xl text-xs sm:text-sm md:text-base text-slate-600 dark:text-white/70 font-light leading-relaxed">
                {cabecalho.paragrafos.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {solucoes.length === 0 && <p className="text-sm text-text-muted">{TEXTOS_DAS_SECOES[locale].vazio.solucoes}</p>}

        {ABAS_DE_SOLUCOES.map((aba) => {
          const daAba = solucoes.filter((s) => s.category === aba.id)
          // Aba vazia some: o índice mostra a oferta, não o esquema.
          if (daAba.length === 0) return null

          return (
            <section key={aba.id}>
              <h2 className="text-lg sm:text-xl font-bold font-display text-text-main mb-5">{aba[locale]}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {daAba.map((solucao) => {
                  /* Resolvido aqui, e não dentro do cartão: `iconePorNome`
                   * devolve um componente, e a regra `react-hooks/static-
                   * components` proíbe criar componente no corpo de um. */
                  const Icone = iconePorNome(solucao.icon)
                  return <CartaoDeSolucao key={solucao.slug} solucao={solucao} locale={locale} icone={Icone} />
                })}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}

/* Card do painel de Soluções do mega-menu (`App.tsx:252`). A solução sem página
 * é uma `<div>` — no índice, um link que não sai do lugar é pior que um card
 * estático, e `hasPage` já carrega essa informação (D-09). */
function CartaoDeSolucao({ solucao, locale, icone: Icone }: { solucao: SolutionCard; locale: Locale; icone: LucideIcon }) {
  /* Cartão com selo é o destaque da aba (D-52): ganha o contorno da marca. */
  const classe = cn('relative flex flex-col p-5 rounded-md bg-surface-2  transition-all group', solucao.badge && 'ring-1 ring-primary/40')

  const conteudo = (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icone size={20} aria-hidden />
        </div>
        <h3 className="text-text-main font-bold text-sm leading-tight group-hover:text-primary transition-colors">{solucao.title}</h3>
        {solucao.badge && <SeloDeSolucao texto={solucao.badge} className="ml-auto" />}
      </div>
      <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">{solucao.shortDescription}</p>
    </>
  )

  return solucao.hasPage ? (
    <Link
      href={hrefDe('solucoes', locale, solucao.slug)}
      className={cn(classe, 'hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:shadow-lg hover:border-primary/30')}
    >
      {conteudo}
    </Link>
  ) : (
    <div className={classe}>{conteudo}</div>
  )
}
