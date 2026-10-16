import { Calendar, ChevronLeft, Download, FileText, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/content/rich-text'
import { ChamadaFinal } from '@/components/layout/chamada-final'
import { DownloadGate } from '@/components/forms/download-gate'
import type { Locale } from '@/lib/locales'
import { dataPorExtenso } from '@/lib/mappers/resource'
import { hrefDe, type Secao } from '@/lib/routes'
import type { ResourceDetail } from '@/types/content'

/* Landing de material rico (MIG-045). Nasceu compartilhada por /relatorios/[slug] e
 * /ebooks/[slug] — as duas diferem em rótulo e num dado (data contra número de
 * páginas), não em estrutura.
 *
 * ⚠️ **Rota sem gabarito**: não existe no protótipo. Ver a nota em
 * estrategia-de-testes.md sobre o que verifica essas páginas.
 *
 * O download é **MIG-104** e liga sozinho, material a material: com PDF, o
 * formulário; sem, o botão inerte do protótipo (P-07).
 *
 * Desde a task 046 (pedido da Taci, 14/10) o formulário fica **depois do
 * texto**, antes de "Entre em contato": quem chega lê sobre o e-book antes de
 * deixar o contato. O herói mantém o botão, que agora leva até ele (`#baixar`). */

/** A âncora do formulário — o botão do herói aponta para ela. */
const ANCORA_DO_FORMULARIO = 'baixar'

export type TextosDoMaterial = {
  voltar: string
  prefixo: string
  cta: string
  ctaIndisponivel: string
  paginas: string
  semCorpoTitulo: string
  semCorpoTexto: string
}

export function PaginaDeMaterial({
  material,
  secao,
  locale,
  t,
}: {
  material: ResourceDetail
  secao: Extract<Secao, 'ebooks'>
  locale: Locale
  t: TextosDoMaterial
}) {
  const ehEbook = material.kind === 'ebook'

  return (
    <main className="min-h-screen bg-white dark:bg-[#0e1015]">
      {/* `data-heroi-azul`: o cabeçalho, transparente por cima, ganha fundo
          (variante `sobre-azul`, globals.css). */}
      <section data-heroi-azul className="relative bg-primary overflow-hidden pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src={material.image.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/85 to-primary/60" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            href={hrefDe(secao, locale)}
            className="inline-flex items-center gap-2 text-white font-bold mb-8 hover:gap-3 hover:text-secondary transition-all"
          >
            <ChevronLeft size={20} aria-hidden /> {t.voltar}
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="lg:w-2/3">
              <div className="text-secondary font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4 flex items-center gap-2">
                {ehEbook ? <FileText size={14} aria-hidden /> : <Calendar size={14} aria-hidden />}
                {t.prefixo}
                {!ehEbook && ` — ${dataPorExtenso(material.publishedAt, locale)}`}
                {ehEbook && material.pages !== null && ` — ${material.pages} ${t.paginas}`}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {material.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mb-8">
                {material.description}
              </p>

              {material.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {material.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-[4px] bg-white/10 text-[10px] font-medium text-white/80 uppercase flex items-center gap-1 "
                    >
                      <Tag size={10} aria-hidden /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* MIG-104: com PDF no material, o botão leva ao formulário, no
               * fim da página; sem, o botão inerte de sempre. Subir o arquivo
               * no admin é o que troca um pelo outro — ver
               * `actions/materiais.ts`. */}
              {material.temDownload ? (
                <a
                  href={`#${ANCORA_DO_FORMULARIO}`}
                  className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary-dark text-white px-10 py-5 rounded-[6px] font-bold text-lg transition-colors"
                >
                  <Download size={20} aria-hidden /> {t.cta}
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    disabled
                    title={t.ctaIndisponivel}
                    className="inline-flex items-center gap-3 bg-secondary/60 text-white px-10 py-5 rounded-[6px] font-bold text-lg cursor-not-allowed"
                  >
                    <Download size={20} aria-hidden /> {t.cta}
                  </button>
                  <p className="text-xs text-white/60 mt-3">{t.ctaIndisponivel}</p>
                </>
              )}
            </div>

            <div className="lg:w-1/3 w-full max-w-xs mx-auto lg:mx-0">
              <div className="aspect-[3/4] rounded-[6px] overflow-hidden relative  bg-white/5 p-2 shadow-2xl">
                <div className="relative w-full h-full">
                  <Image
                    src={material.image.url}
                    alt={material.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 60vw"
                    className="object-cover rounded-[6px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {material.body ? (
              <RichText data={material.body} />
            ) : (
              <div className="rounded-[6px]  bg-slate-50 dark:bg-[#181b22] p-8 text-center mb-12">
                <h2 className="font-bold text-slate-900 dark:text-white mb-1">{t.semCorpoTitulo}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t.semCorpoTexto}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ⚠️ `scroll-mt`: o cabeçalho é fixo, e sem a margem o botão do herói
       * pararia com o título do painel embaixo dele. */}
      {material.temDownload && (
        <section
          id={ANCORA_DO_FORMULARIO}
          aria-labelledby={`${ANCORA_DO_FORMULARIO}-titulo`}
          className="pb-24 scroll-mt-28"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto rounded-[6px] bg-slate-50 dark:bg-[#181b22] shadow-xl p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10">
              <div className="md:w-5/12">
                <div className="text-primary-dark dark:text-primary font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <FileText size={14} aria-hidden /> {t.prefixo}
                </div>
                <h2
                  id={`${ANCORA_DO_FORMULARIO}-titulo`}
                  className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-3"
                >
                  {t.cta}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{material.title}</p>
              </div>
              <div className="md:w-7/12">
                <DownloadGate resourceId={material.id} />
              </div>
            </div>
          </div>
        </section>
      )}

      <ChamadaFinal locale={locale} />
    </main>
  )
}
