'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Icone } from '@/components/blocks/icones'
import { SeloDeSolucao } from '@/components/ui/selo-de-solucao'
import { congelado } from '@/lib/e2e'
import type { Locale } from '@/lib/locales'
import { larguraOticaCss } from '@/lib/logo'
import { hrefDe } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CategoriaDoMenu, CorDeDestaque, MiniCase, Navegacao, PainelDeConversao } from '@/types/content'

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
  'flex flex-col p-4 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all hover:shadow-md group'

/* Solução com selo (D-52) — o "Diferencial ATRA" de Analytics Conversacional. */
const CARTAO_EM_DESTAQUE = 'ring-1 ring-primary/40 bg-primary/[0.04] dark:bg-primary/[0.08]'

const CELULA_DA_GRADE =
  'flex flex-col items-center text-center gap-2 p-4 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all group shadow-sm'

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
    return (
      <PainelDeSolucoes grupos={navegacao.solucoes} conversao={navegacao.conversao} locale={locale} aoNavegar={aoNavegar} />
    )
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
            <div className="w-16 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
              {/* Largura pela proporção do logo (`lib/logo.ts`); 0,75 é a altura
                  sobre a largura desta caixa. A versão escura troca só por CSS. */}
              {p.logo && (
                <div
                  className="relative"
                  style={{ width: larguraOticaCss(p.logo, p.logoScale, 0.75), aspectRatio: `${p.logo.width} / ${p.logo.height}` }}
                >
                  <Image src={p.logo.url} alt={p.logo.alt} fill sizes="64px" className={cn('object-contain', p.logoDark && 'dark:hidden')} />
                  {p.logoDark && (
                    <Image src={p.logoDark.url} alt={p.logoDark.alt} fill sizes="64px" className="object-contain hidden dark:block" />
                  )}
                </div>
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
            <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
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
            <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
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
 * dos quatro painéis do legado usam; o de Consultores usa `rounded-[6px]`
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
 * ativa é estado local: o legado troca no `onMouseEnter`.
 *
 * Com o painel de conversão preenchido no CMS (D-51), a grade divide a linha
 * com ele a partir de `xl`. Sem ele, o menu sai como sempre foi. */
function PainelDeSolucoes({
  grupos,
  conversao,
  locale,
  aoNavegar,
}: {
  grupos: Navegacao['solucoes']
  conversao: PainelDeConversao | null
  locale: Locale
  aoNavegar: () => void
}) {
  const [ativa, setAtiva] = useState(0)
  const grupo = grupos[ativa] ?? grupos[0]
  if (!grupo) return null

  return (
    <div className={cn('w-full pt-2', conversao && 'xl:grid xl:grid-cols-[minmax(0,1fr)_25rem] xl:gap-6 xl:items-start')}>
      <div className="flex flex-col w-full gap-4">
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

        {/* Categoria de item único (foi o caso da RC18) ocupa a largura toda — sem coluna
         * vazia ao lado — para a aba funcionar como entrada direta para a página. */}
        {/* Com o painel ao lado a grade fica mais estreita e os cartões mais
            altos; o espaço menor entre eles devolve a altura que o menu tinha
            em 1280px. */}
        <div className={cn('grid gap-6 pt-2', conversao && 'xl:gap-4', grupo.items.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
          {grupo.items.map((item) => {
            const conteudo = (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icone nome={item.icon} size={18} />
                  </div>
                  {/* Sem `capitalize` desde a D-52: o título vem do admin já com as
                      maiúsculas certas, e a classe transformava "de" em "De"
                      ("Fábrica De Soluções De Dados"). */}
                  <h4 className="text-text-main font-normal text-xs leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.badge && <SeloDeSolucao texto={item.badge} className="ml-auto" />}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">
                  {item.description}
                </p>
              </>
            )

            /* Solução sem página não vira link, como no índice (D-09). No legado
             * todas são `<Link>`, inclusive as cinco que apontam para `#`. */
            return item.href ? (
              <Link key={item.title} href={item.href} onClick={aoNavegar} className={cn(CARTAO, item.badge && CARTAO_EM_DESTAQUE)}>
                {conteudo}
              </Link>
            ) : (
              <div key={item.title} className={cn(CARTAO, item.badge && CARTAO_EM_DESTAQUE, 'cursor-default')}>
                {conteudo}
              </div>
            )
          })}
        </div>
      </div>

      {conversao && (
        <CamadaDeConversao painel={conversao} cases={conversao.cases[grupo.id]} aba={grupo.id} locale={locale} aoNavegar={aoNavegar} />
      )}
    </div>
  )
}

/* Camada de conversão (D-51): o painel fixo à direita do menu de Soluções. O
 * conteúdo é o mesmo em todas as abas; só o case de baixo acompanha a aba.
 *
 * `hidden xl:flex`: abaixo de 1280px a grade de soluções precisa da largura
 * toda — medido em 1024px, os cartões apertados cresciam e a última linha da
 * aba de Dados saía da tela. No celular a navegação é a gaveta, que já fecha
 * com "Fale Conosco". */
const TEXTOS_DA_CONVERSAO = {
  pt: { rotulo: 'Por onde começar', case: 'Case', cases: 'Cases relacionados', irPara: (n: number, total: number) => `Case ${n} de ${total}` },
  en: { rotulo: 'Where to start', case: 'Case', cases: 'Related cases', irPara: (n: number, total: number) => `Case ${n} of ${total}` },
} as const

function CamadaDeConversao({
  painel,
  cases,
  aba,
  locale,
  aoNavegar,
}: {
  painel: PainelDeConversao
  cases: MiniCase[]
  aba: string
  locale: Locale
  aoNavegar: () => void
}) {
  const t = TEXTOS_DA_CONVERSAO[locale]

  return (
    <aside
      aria-label={t.rotulo}
      data-testid="painel-de-conversao"
      className="hidden xl:flex flex-col gap-3 rounded-[6px] bg-primary/[0.06] dark:bg-white/[0.04] p-4 text-left"
    >
      <div>
        {/* `!`: a regra global dos títulos (`h1…h6 { font-weight: 300 }`) está
            fora das camadas do Tailwind e venceria o peso sem ele. */}
        <h3 className="text-base font-semibold! tracking-normal font-display text-text-main leading-tight">{painel.titulo}</h3>
        {painel.abertura && <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{painel.abertura}</p>}
      </div>

      {painel.caminhos.length > 0 && (
        <ul className="flex flex-col gap-2">
          {painel.caminhos.map((c) => (
            <li key={c.title}>
              <Link
                href={c.href}
                onClick={aoNavegar}
                className="group flex items-center gap-3 rounded-[6px] bg-surface-2 p-2.5 shadow-sm hover:shadow-md transition-all"
              >
                <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icone nome={c.icon} size={17} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-semibold text-text-main group-hover:text-primary transition-colors">{c.title}</span>
                  {c.description && <span className="block text-[10px] text-text-muted leading-snug">{c.description}</span>}
                </span>
                <ArrowRight size={15} className="text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {painel.cta && (
        <Link
          href={painel.cta.href}
          onClick={aoNavegar}
          className="flex items-center justify-center gap-2 w-full rounded-[6px] bg-primary text-white text-xs font-semibold py-2.5 shadow-md hover:bg-primary-dark active:scale-[0.99] transition-all"
        >
          {painel.cta.label} <ArrowRight size={14} aria-hidden />
        </Link>
      )}

      {/* Uma linha só nos 25rem do painel, com os cinco itens da especificação
          (medido: 356px de 368). O `flex-wrap` é a rede para um rótulo mais
          comprido digitado no admin: quebra em duas em vez de vazar. */}
      {painel.provas.length > 0 && (
        <ul data-testid="prova-social" className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0.5 text-[10px] text-text-muted leading-relaxed">
          {painel.provas.map((p, i) => (
            <li key={`${p.value} ${p.label ?? ''}`} className="flex items-baseline gap-1 whitespace-nowrap">
              {i > 0 && <span aria-hidden className="text-text-muted/60">·</span>}
              <span>
                <strong className="font-semibold text-text-main">{p.value}</strong>
                {p.label && ` ${p.label}`}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* `key` pela aba: trocar de aba monta o rodízio de novo, no primeiro
          case dela, em vez de herdar a posição da aba anterior. */}
      {cases.length > 0 && <CasesDaAba key={aba} cases={cases} textos={t} aoNavegar={aoNavegar} />}
    </aside>
  )
}

/** Tempo de cada case na tela, quando a aba tem mais de um. */
const TROCA_DE_CASE_MS = 5000

function CasesDaAba({
  cases,
  textos,
  aoNavegar,
}: {
  cases: MiniCase[]
  textos: (typeof TEXTOS_DA_CONVERSAO)[Locale]
  aoNavegar: () => void
}) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const atual = cases[indice] ?? cases[0]

  /* O rodízio para com o ponteiro ou o foco em cima — ninguém clica num cartão
     que troca debaixo do dedo —, para quem pediu menos movimento ao sistema e
     sob `?e2e=1`, que congela todo carrossel do site. */
  useEffect(() => {
    if (cases.length < 2 || pausado || congelado()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const relogio = window.setInterval(() => setIndice((i) => (i + 1) % cases.length), TROCA_DE_CASE_MS)
    return () => window.clearInterval(relogio)
  }, [cases.length, pausado])

  return (
    <div
      aria-label={textos.cases}
      role="group"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      className="flex flex-col gap-2"
    >
      {/* Altura fixa: o título tem tamanhos diferentes de case para case, e um
          cartão que cresce e encolhe a cada troca sacode o menu inteiro. */}
      <Link
        href={atual.href}
        onClick={aoNavegar}
        data-testid="mini-case"
        className="group flex items-center gap-3 h-[4.75rem] rounded-[6px] bg-surface-2 p-2.5 shadow-sm hover:shadow-md transition-all"
      >
        {atual.image && (
          <span className="relative w-14 h-14 rounded-[6px] overflow-hidden shrink-0">
            <Image src={atual.image.url} alt="" fill sizes="56px" className="object-cover" />
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block text-xs font-semibold text-text-main group-hover:text-primary transition-colors truncate">
            {atual.client ? `${textos.case}: ${atual.client}` : textos.case}
          </span>
          <span className="block text-[10px] text-text-muted leading-snug line-clamp-2">{atual.title}</span>
        </span>
        <ArrowRight size={15} className="text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
      </Link>

      {cases.length > 1 && (
        <div className="flex items-center justify-center gap-1">
          {cases.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={textos.irPara(i + 1, cases.length)}
              aria-current={i === indice ? 'true' : undefined}
              className="p-1 cursor-pointer group/ponto"
            >
              <span
                className={cn(
                  'block w-1.5 h-1.5 rounded-full transition-colors',
                  i === indice ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20 group-hover/ponto:bg-slate-400 dark:group-hover/ponto:bg-white/40',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
