'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Icone } from '@/components/blocks/icones'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CategoriaDoMenu, CorDeDestaque, Navegacao } from '@/types/content'

/* Painéis do megamenu — porte de `legacy/src/App.tsx:458-880`.
 *
 * Os sete painéis do legado são três formatos repetidos: Soluções tem abas de
 * subcategoria, Insights e Parceiros são grades de cinco colunas, e as outras
 * quatro (Consultores, Carreiras, Sobre, Glossário) são a mesma coluna dupla
 * com textos diferentes. O `panel` da categoria escolhe qual desenhar.
 *
 * ⚠️ Nenhum painel aparece na regressão visual: eles só existem com o menu
 * aberto, e a captura é do estado fechado. A verificação deles é funcional,
 * no smoke. */

/* Classe literal por cor — o Tailwind não enxerga `bg-${cor}-500/10`. */
const COR_DO_DESTAQUE: Record<CorDeDestaque, string> = {
  primary: 'bg-primary/10 text-primary',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  purple: 'bg-purple-500/10 text-purple-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
  pink: 'bg-pink-500/10 text-pink-500',
  orange: 'bg-orange-500/10 text-orange-500',
  blue: 'bg-blue-500/10 text-blue-500',
  amber: 'bg-amber-500/10 text-amber-500',
}

const CARTAO =
  'flex flex-col p-4 rounded-lg bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all hover:shadow-md group'

const CELULA_DA_GRADE =
  'flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all group shadow-sm'

export function PainelDoMenu({
  categoria,
  navegacao,
  locale,
  aoNavegar,
}: {
  categoria: CategoriaDoMenu
  navegacao: Navegacao
  locale: Locale
  aoNavegar: () => void
}) {
  if (categoria.panel === 'solutions') {
    return <PainelDeSolucoes grupos={navegacao.solucoes} aoNavegar={aoNavegar} />
  }

  if (categoria.panel === 'partners') {
    return (
      <div className="grid grid-cols-5 gap-3 pt-3" data-testid="painel-parceiros">
        {navegacao.parceiros.map((p) => (
          <Link
            key={p.slug}
            href={hrefDe('parceiros', locale, p.slug)}
            onClick={aoNavegar}
            className={CELULA_DA_GRADE}
          >
            <div className="w-14 h-10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200 relative">
              {p.logo && (
                <Image src={p.logo.url} alt={p.logo.alt} fill sizes="56px" className="object-contain" />
              )}
            </div>
            <div>
              <div className="text-[11px] font-normal text-text-main mb-0.5 capitalize tracking-wide group-hover:text-primary transition-colors">
                {p.name}
              </div>
              <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                {navegacao.descricoesDeParceiro[p.slug] ?? ''}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  /* Mesma grade do painel de parceiros, com ícone no lugar do logo: a vertical
   * não tem marca, tem símbolo. Lê a collection `segments` — digitar as 8 aqui
   * recriaria a duplicação que o global existe para evitar. */
  if (categoria.panel === 'segments') {
    return (
      <div className="grid grid-cols-4 gap-3 pt-3" data-testid="painel-segmentos">
        {navegacao.segmentos.map((s) => (
          <Link
            key={s.slug}
            href={hrefDe('segmentos', locale, s.slug)}
            onClick={aoNavegar}
            className={CELULA_DA_GRADE}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <Icone nome={s.icon} size={20} />
            </div>
            <div>
              <div className="text-[11px] font-normal text-text-main mb-0.5 capitalize tracking-wide group-hover:text-primary transition-colors">
                {s.name}
              </div>
              <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{s.shortDescription}</div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  if (categoria.panel === 'links') {
    return (
      <div className="grid grid-cols-5 gap-3 pt-3">
        {categoria.links.map((l) => (
          <Link key={l.href} href={l.href} onClick={aoNavegar} className={CELULA_DA_GRADE}>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <Icone nome={l.icon} size={20} />
            </div>
            <div>
              <div className="text-[11px] font-normal text-text-main mb-0.5 capitalize tracking-wide group-hover:text-primary transition-colors">
                {l.label}
              </div>
              <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{l.description}</div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return <PainelDividido categoria={categoria} aoNavegar={aoNavegar} />
}

/* Coluna dupla: texto e destaques à esquerda, cartão de chamada à direita.
 *
 * ⚠️ A caixa do ícone dos destaques sai em `rounded-[6px]`, que é o que três
 * dos quatro painéis do legado usam; o de Consultores usa `rounded-lg`
 * (`App.tsx:612`). Diferença de 2px num painel que a regressão visual não
 * cobre — unificado de propósito, e registrado em debito-tecnico.md. */
function PainelDividido({
  categoria,
  aoNavegar,
}: {
  categoria: CategoriaDoMenu
  aoNavegar: () => void
}) {
  return (
    <div className="grid grid-cols-12 gap-6 pt-3 text-left items-center">
      <div className="col-span-6 flex flex-col justify-center gap-4 pr-2">
        {categoria.intro && <p className="text-xs text-text-muted leading-relaxed">{categoria.intro}</p>}

        {categoria.highlights.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-white/5">
            {categoria.highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5',
                    COR_DO_DESTAQUE[h.color],
                  )}
                >
                  <Icone nome={h.icon} size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-text-main mb-0.5">{h.title}</h5>
                  <p className="text-[10px] text-text-muted leading-relaxed">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {categoria.card && (
        <Link
          href={categoria.card.href}
          onClick={aoNavegar}
          className="col-span-6 flex flex-col justify-between p-5 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20 h-full"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                {categoria.card.icon && <Icone nome={categoria.card.icon} size={18} />}
              </div>
              <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors capitalize">
                {categoria.card.title}
              </h4>
            </div>

            {categoria.card.bullets.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 text-[11px] text-text-muted my-3">
                {categoria.card.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-primary shrink-0" aria-hidden />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {categoria.card.ctaLabel && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors self-start mt-2">
              {categoria.card.ctaLabel}{' '}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden />
            </div>
          )}
        </Link>
      )}
    </div>
  )
}

/* Abas de subcategoria + grade de duas colunas (`App.tsx:459`). A subcategoria
 * ativa é estado local: o legado troca no `onMouseEnter`. */
function PainelDeSolucoes({
  grupos,
  aoNavegar,
}: {
  grupos: Navegacao['solucoes']
  aoNavegar: () => void
}) {
  const [ativa, setAtiva] = useState(0)
  const grupo = grupos[ativa] ?? grupos[0]
  if (!grupo) return null

  return (
    <div className="flex flex-col w-full gap-4 pt-2">
      <div className="flex items-center gap-8 border-none pb-2">
        {grupos.map((g, i) => (
          <button
            key={g.title}
            type="button"
            onMouseEnter={() => setAtiva(i)}
            onFocus={() => setAtiva(i)}
            aria-current={i === ativa ? 'true' : undefined}
            className={cn(
              'text-xs font-normal transition-all relative pb-1 cursor-pointer capitalize',
              i === ativa
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                : 'text-text-muted hover:text-text-main',
            )}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 pt-2">
        {grupo.items.map((item) => {
          const conteudo = (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icone nome={item.icon} size={18} />
                </div>
                <h4 className="text-text-main font-normal text-xs leading-tight group-hover:text-primary transition-colors capitalize">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">
                {item.description}
              </p>
            </>
          )

          /* Solução sem página não vira link, como no índice (D-09). No legado
           * todas são `<Link>`, inclusive as cinco que apontam para `#`. */
          return item.href ? (
            <Link key={item.title} href={item.href} onClick={aoNavegar} className={CARTAO}>
              {conteudo}
            </Link>
          ) : (
            <div key={item.title} className={cn(CARTAO, 'cursor-default')}>
              {conteudo}
            </div>
          )
        })}
      </div>
    </div>
  )
}
