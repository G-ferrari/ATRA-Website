'use client'

import { ArrowRight, BookOpen, ChevronRight, Clock, Filter, Mail, Search, Send, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { GlowCard, MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoInsightsHub, ItemDeInsight } from '@/types/content'

import { Icone } from './icones'
import { TextoDestacado } from './texto-destacado'

/* Hub de conteúdos — porte de `legacy/src/pages/Insights.tsx:260`.
 *
 * Sete seções numa só: herói com pílulas de formato, destaques, barra de busca e
 * filtros, grade filtrada, portais por formato, caixa de inscrição e chamada
 * final. É um bloco só porque no legado é um componente só, e porque as sete
 * compartilham o **mesmo estado** de filtro.
 *
 * ⚠️ Os itens são lista curada no CMS, não agregação das collections — ver a
 * nota do campo `items` em `blocks/index.ts`.
 *
 * A caixa de inscrição está **estática**, como os outros formulários até
 * MIG-100 (P-14, P-18). No gabarito ela só troca um estado local por uma tela
 * de sucesso, sem enviar nada. */

const TODOS = 'all'

function Cartao({ item, destaque }: { item: ItemDeInsight; destaque: boolean }) {
  return (
    <GlowCard glowColor="blue" className="overflow-hidden flex flex-col justify-between h-full group">
      <div>
        <div className="aspect-[16/9] overflow-hidden relative rounded-t-[5px]">
          {item.image && (
            /* `<img>` no fluxo, como o gabarito: a caixa é `aspect-[16/9]` e a
               imagem a preenche por `object-cover`. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image.url}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-[6px] bg-surface-1/90 text-text-main text-[10px] font-bold  backdrop-blur-md">
              {item.category}
            </span>
          </div>
          {!destaque && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-[6px] bg-black/60 text-white text-[10px] font-medium backdrop-blur-md flex items-center gap-1">
                <Clock size={12} aria-hidden />
                {item.meta}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* O destaque separa autor e data com um ponto em elemento próprio; o
              cartão da grade junta os dois numa linha só, em azul. */}
          {destaque ? (
            <div className="flex items-center gap-3 text-xs text-text-muted mb-3 font-light">
              <span className="font-semibold text-primary">{item.author}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
          ) : (
            <div className="text-[11px] font-semibold text-primary mb-2">
              {item.author} • {item.date}
            </div>
          )}

          {destaque ? (
            <h3 className="text-base font-bold text-text-main mb-2.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {item.title}
            </h3>
          ) : (
            <h4 className="text-base font-bold text-text-main mb-2.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {item.title}
            </h4>
          )}

          <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-3 mb-4">{item.description}</p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2 py-0.5 rounded-[6px] bg-surface-1 text-text-muted "
            >
              {t}
            </span>
          ))}
        </div>

        {destaque ? (
          <Link
            href={item.href}
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark group-hover:translate-x-1 transition-all"
          >
            <span>Acessar conteúdo</span>
            <ArrowRight size={14} aria-hidden />
          </Link>
        ) : (
          <Link
            href={item.href}
            className="w-full py-2.5 px-4 rounded-[6px] bg-surface-1 hover:bg-primary hover:text-white text-text-main  text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <span>
              {item.format === 'ebook'
                ? 'Baixar Ebook'
                : item.format === 'webinar'
                  ? 'Assistir Webinar'
                  : 'Acessar Conteúdo'}
            </span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden />
          </Link>
        )}
      </div>
    </GlowCard>
  )
}

export function BlocoHubDeInsights({ bloco }: { bloco: BlocoInsightsHub }) {
  const primeiroTopico = bloco.topics[0] ?? ''
  const [formato, setFormato] = useState(TODOS)
  const [topico, setTopico] = useState(primeiroTopico)
  const [busca, setBusca] = useState('')

  const filtrados = useMemo(
    () =>
      bloco.items.filter((i) => {
        const porFormato = formato === TODOS || i.format === formato
        const porTopico = topico === primeiroTopico || i.tags.includes(topico)
        const termo = busca.trim().toLowerCase()
        const porBusca =
          termo === '' ||
          i.title.toLowerCase().includes(termo) ||
          i.description.toLowerCase().includes(termo) ||
          i.tags.some((t) => t.toLowerCase().includes(termo))
        return porFormato && porTopico && porBusca
      }),
    [bloco.items, formato, topico, busca, primeiroTopico],
  )

  const destaques = useMemo(() => bloco.items.filter((i) => i.featured), [bloco.items])
  const limpar = () => {
    setFormato(TODOS)
    setTopico(primeiroTopico)
    setBusca('')
  }
  const comFiltro = formato !== TODOS || topico !== primeiroTopico || busca !== ''
  const rotuloDoFormato = bloco.formats.find((f) => f.key === formato)?.label

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

          {/* ⚠️ As pílulas do herói são **links** para a seção de cada formato,
              não filtros — só a de "todos", que não tem destino, filtra. */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {bloco.formats.map((f) => (
              <Link
                key={f.key}
                href={f.href ?? '#'}
                onClick={(e) => {
                  if (!f.href) {
                    e.preventDefault()
                    setFormato(f.key)
                  }
                }}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer',
                  formato === f.key
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-2 text-text-muted hover:text-text-main  hover:bg-surface-3',
                )}
              >
                <Icone nome={f.icon} size={14} />
                <span>{f.label}</span>
                {f.count !== null && (
                  <span className="px-1.5 py-0.5 rounded-[6px] bg-white/20 text-[10px] font-bold">{f.count}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {destaques.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-amber-400 fill-amber-400" aria-hidden />
              <h2 className="text-xl md:text-2xl font-bold font-display text-text-main">Destaques de Impacto</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {destaques.map((i) => (
              <div key={i.title}>
                <Cartao item={i} destaque />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="bg-surface-2  rounded-[6px] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary" aria-hidden />
              <h2 className="text-sm md:text-base font-bold text-text-main">Explorar Todos os Conteúdos</h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
              <input
                type="text"
                placeholder="Buscar por palavra-chave ou tema..."
                aria-label="Buscar conteúdos"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-1  rounded-[6px] text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {bloco.formats.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFormato(f.key)}
                className={cn(
                  'px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
                  formato === f.key
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-1 text-text-muted hover:text-text-main  hover:bg-surface-3',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {bloco.topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopico(t)}
                className={cn(
                  'px-3 py-1 rounded-[6px] text-xs transition-all cursor-pointer whitespace-nowrap',
                  topico === t
                    ? 'bg-primary text-white font-semibold shadow-xs'
                    : 'bg-surface-1 text-text-muted hover:text-text-main  hover:bg-surface-3',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {comFiltro && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span>
                Filtros aplicados:{' '}
                {formato !== TODOS && <strong className="text-primary mr-2">{rotuloDoFormato}</strong>}
                {topico !== primeiroTopico && <strong className="text-secondary mr-2">[{topico}]</strong>}
                {busca && <span className="text-amber-400 font-semibold">&quot;{busca}&quot;</span>}
              </span>
              <button type="button" onClick={limpar} className="text-primary hover:underline font-semibold cursor-pointer">
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-text-main">
              {formato === TODOS ? 'Todos os Registros de Conhecimento' : rotuloDoFormato}
            </h3>
            <p className="text-xs text-text-muted font-light mt-0.5">
              Exibindo {filtrados.length} de {bloco.items.length} conteúdos publicados
            </p>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="bg-surface-2  rounded-[6px] p-12 text-center max-w-md mx-auto">
            <BookOpen size={48} className="mx-auto text-text-muted mb-4" aria-hidden />
            <h4 className="text-base font-bold text-text-main mb-2">Nenhum conteúdo encontrado</h4>
            <p className="text-xs text-text-muted font-light mb-6">
              Tente ajustar a busca por termo ou selecione outro tópico.
            </p>
            <button
              type="button"
              onClick={limpar}
              className="px-5 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((i) => (
              <div key={i.title}>
                <Cartao item={i} destaque={false} />
              </div>
            ))}
          </div>
        )}
      </section>

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
                    Ver seção <ChevronRight size={12} aria-hidden />
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
                  placeholder="Seu e-mail corporativo"
                  aria-label="Seu e-mail corporativo"
                  className="w-full px-4 py-3 bg-surface-1  rounded-[6px] text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all disabled:opacity-100"
                />
                <button
                  type="button"
                  disabled
                  title="A inscrição pelo site chega em breve."
                  className="w-full py-3 bg-primary text-white rounded-[6px] text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>Inscrever-se Grátis</span>
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
