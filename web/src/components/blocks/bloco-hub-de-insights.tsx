import { ArrowRight, ChevronRight, Clock, Mail, Send, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { GlowCard, MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { BlocoInsightsHub, CartaoDeInsight, TipoDeInsight } from '@/types/content'

import { Icone } from './icones'
import { TextoDestacado } from './texto-destacado'

/* Hub de conteúdos — porte de `legacy/src/pages/Insights.tsx:260`.
 *
 * Desde a D-55 (05/10) a parte do meio é **automática**: uma faixa por tipo
 * (Cases, Blog, Webinars, ATRA na mídia, E-books) com os primeiros de cada
 * seção e o "Ver todos" para a página dela, resolvida pela página
 * (`faixasDeInsights`). Saíram os 10 cartões escritos à mão do legado, os
 * destaques, a busca e os filtros por formato e tópico — eram manutenção que
 * ninguém fazia, e mostravam conteúdo que não existia mais.
 *
 * Topo, pílulas, canais, caixa de inscrição e chamada final seguem texto do
 * admin.
 *
 * A caixa de inscrição está **estática**, como os outros formulários até
 * MIG-100 (P-14, P-18). */

const TEXTOS = {
  pt: {
    verTodos: 'Ver todos',
    verSecao: 'Ver seção',
    novaAba: 'abre em outra aba',
    acao: { webinars: 'Assistir Webinar', ebooks: 'Baixar Ebook', midia: 'Leia a matéria', padrao: 'Acessar Conteúdo' },
    email: 'Seu e-mail corporativo',
    inscrever: 'Inscrever-se Grátis',
    emBreve: 'A inscrição pelo site chega em breve.',
  },
  en: {
    verTodos: 'See all',
    verSecao: 'See section',
    novaAba: 'opens in a new tab',
    acao: { webinars: 'Watch webinar', ebooks: 'Download ebook', midia: 'Read the article', padrao: 'Read more' },
    email: 'Your work email',
    inscrever: 'Subscribe for free',
    emBreve: 'Subscribing on the site is coming soon.',
  },
} as const

/** Onde as faixas começam: o destino da pílula que não leva a uma seção. */
const ANCORA_DAS_FAIXAS = 'ultimos-conteudos'

/* O cartão inteiro leva ao conteúdo: o link fica no título, com `after:inset-0`
   cobrindo o cartão — o conteúdo do `GlowCard` é a caixa posicionada — e o
   botão de baixo é só aparência. */
const CLASSE_DO_LINK =
  "after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-[6px] focus-visible:after:ring-2 focus-visible:after:ring-[#3C98FA]"

function Cartao({ item, tipo, locale }: { item: CartaoDeInsight; tipo: TipoDeInsight; locale: Locale }) {
  const t = TEXTOS[locale]
  const acao = tipo === 'webinars' || tipo === 'ebooks' || tipo === 'midia' ? t.acao[tipo] : t.acao.padrao

  return (
    /* `customSize` e `w-full`: sem eles o `GlowCard` aplica o tamanho padrão
       (`w-64`), e o cartão ficava com 256px numa coluna de 390 — defeito que
       vinha do porte do protótipo e ficou à vista com as faixas. */
    <GlowCard glowColor="blue" customSize className="w-full overflow-hidden flex flex-col justify-between h-full group">
      <div>
        <div className="aspect-[16/9] overflow-hidden relative rounded-t-[5px] bg-surface-1">
          {item.image && (
            <Image
              src={item.image.url}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {item.selo && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-[6px] bg-black/60 text-white text-[10px] font-medium backdrop-blur-md flex items-center gap-1">
                <Clock size={12} aria-hidden />
                {item.selo}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {item.origem && <div className="text-[11px] font-semibold text-primary mb-2">{item.origem}</div>}

          <h3 className="text-base font-bold text-text-main mb-2.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {item.externo ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className={CLASSE_DO_LINK}>
                {item.title}
                <span className="sr-only"> ({t.novaAba})</span>
              </a>
            ) : (
              <Link href={item.href} className={CLASSE_DO_LINK}>
                {item.title}
              </Link>
            )}
          </h3>

          <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-3 mb-4">{item.description}</p>
        </div>
      </div>

      <div className="p-6 pt-0">
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-[6px] bg-surface-1 text-text-muted ">
                {tag}
              </span>
            ))}
          </div>
        )}

        <span
          aria-hidden
          className="w-full py-2.5 px-4 rounded-[6px] bg-surface-1 group-hover:bg-primary group-hover:text-white text-text-main  text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{acao}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </GlowCard>
  )
}

export function BlocoHubDeInsights({ bloco, locale }: { bloco: BlocoInsightsHub; locale: Locale }) {
  const t = TEXTOS[locale]

  return (
    <>
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <div className="text-left">
          {(bloco.badge || bloco.chip) && (
            <div className="flex items-center gap-2 mb-4">
              {bloco.badge && (
                <StatusBadge label={bloco.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
              )}
              {bloco.chip && <MetricChip label={bloco.chip} variant="neutral" size="sm" />}
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-text-main mb-6 leading-tight">
            <TextoDestacado texto={bloco.title} destaque={bloco.highlight} />
          </h1>

          {bloco.description && (
            <p className="text-xs sm:text-sm md:text-base text-text-muted max-w-3xl font-light leading-relaxed mb-8">
              {bloco.description}
            </p>
          )}

          {/* As pílulas levam à seção de cada formato. A que não tem destino
              ("Todos os Formatos") desce até as faixas, e é a que aparece
              marcada — era o filtro ligado ao abrir a página. */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {bloco.formats.map((f) => (
              <Link
                key={f.key}
                href={f.href ?? `#${ANCORA_DAS_FAIXAS}`}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer',
                  f.href
                    ? 'bg-surface-2 text-text-muted hover:text-text-main  hover:bg-surface-3'
                    : 'bg-primary text-white shadow-xs',
                )}
              >
                <Icone nome={f.icon} size={14} />
                <span>{f.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {bloco.faixas.length > 0 && (
        <section id={ANCORA_DAS_FAIXAS} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 space-y-16 scroll-mt-32">
          {bloco.faixas.map((faixa) => (
            <div key={faixa.tipo}>
              <div className="flex items-end justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold font-display text-text-main">{faixa.titulo}</h2>
                <Link
                  href={faixa.verTodos}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark whitespace-nowrap transition-colors group"
                >
                  <span>
                    {t.verTodos}
                    <span className="sr-only"> — {faixa.titulo}</span>
                  </span>
                  <ArrowRight size={14} aria-hidden className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {faixa.itens.map((item) => (
                  <div key={item.id}>
                    <Cartao item={item} tipo={faixa.tipo} locale={locale} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {bloco.portals && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-text-main mb-2">{bloco.portals.title}</h2>
            {bloco.portals.description && (
              <p className="text-xs md:text-sm text-text-muted font-light">{bloco.portals.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bloco.formats
              .filter((f) => f.href)
              .map((f) => (
                <Link
                  key={f.key}
                  href={f.href ?? '#'}
                  className="bg-surface-2  rounded-[6px] p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icone nome={f.icon} size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
                    {f.label}
                  </h4>
                  <span className="text-[11px] text-text-muted font-medium flex items-center gap-1">
                    {t.verSecao} <ChevronRight size={12} aria-hidden />
                  </span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {bloco.newsletter && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
          <div className="bg-surface-2  rounded-[6px] p-8 md:p-12 shadow-xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />

            <div className="max-w-xl relative z-10">
              {bloco.newsletter.eyebrow && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
                  <Mail size={14} aria-hidden />
                  <span>{bloco.newsletter.eyebrow}</span>
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-bold font-display text-text-main mb-2">
                {bloco.newsletter.title}
              </h3>
              {bloco.newsletter.description && (
                <p className="text-xs md:text-sm text-text-muted font-light">{bloco.newsletter.description}</p>
              )}
            </div>

            <div className="w-full md:w-80 shrink-0 relative z-10">
              <form className="space-y-3">
                <input
                  type="email"
                  disabled
                  placeholder={t.email}
                  aria-label={t.email}
                  className="w-full px-4 py-3 bg-surface-1  rounded-[6px] text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all disabled:opacity-100"
                />
                <button
                  type="button"
                  disabled
                  title={t.emBreve}
                  className="w-full py-3 bg-primary text-white rounded-[6px] text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>{t.inscrever}</span>
                  <Send size={14} aria-hidden />
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {bloco.closing && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="bg-surface-2  rounded-[6px] p-8 md:p-10 shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold font-display text-text-main mb-3">{bloco.closing.title}</h3>
            {bloco.closing.description && (
              <p className="text-xs md:text-sm text-text-muted font-light max-w-2xl mx-auto mb-6">
                {bloco.closing.description}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {bloco.closing.ctaLabel && (
                <Link
                  href={bloco.closing.ctaHref ?? '#'}
                  className="px-6 py-3 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold transition-all shadow-md shadow-primary/20"
                >
                  {bloco.closing.ctaLabel}
                </Link>
              )}
              {bloco.closing.secondaryLabel && (
                <Link
                  href={bloco.closing.secondaryHref ?? '#'}
                  className="px-6 py-3 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-main  text-xs md:text-sm font-semibold transition-all"
                >
                  {bloco.closing.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
