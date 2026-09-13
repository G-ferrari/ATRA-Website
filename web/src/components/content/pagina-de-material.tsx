import { Calendar, ChevronLeft, Download, FileText, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/content/rich-text'
import { DownloadGate } from '@/components/forms/download-gate'
import { ContactCta } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { dataPorExtenso } from '@/lib/mappers/resource'
import { hrefDe, type Secao } from '@/lib/routes'
import type { Contato, ResourceDetail } from '@/types/content'

/* Landing de material rico (MIG-045), compartilhada por /relatorios/[slug] e
 * /ebooks/[slug] — as duas diferem em rótulo e num dado (data contra número de
 * páginas), não em estrutura.
 *
 * ⚠️ **Rota sem gabarito**: não existe no protótipo. Ver a nota em
 * estrategia-de-testes.md sobre o que verifica essas páginas.
 *
 * ⚠️ O botão não baixa nada, de propósito. O download é **MIG-104**, que
 * depende do formulário (MIG-100) e de duas pendências: publicar a política de
 * privacidade (P-14) — coletar dado pessoal sem ela é exposição de LGPD — e
 * decidir para onde vão os leads (P-18). Até lá o botão fica inerte, como está
 * no protótipo hoje. */

export type TextosDoMaterial = {
  voltar: string
  prefixo: string
  cta: string
  ctaIndisponivel: string
  paginas: string
  semCorpoTitulo: string
  semCorpoTexto: string
  ctaTitulo: string
  ctaDestaque: string
  ctaDescricao: string
  ctaTelefone: string
  ctaEmail: string
  ctaAcao: string
}

export function PaginaDeMaterial({
  material,
  secao,
  locale,
  t,
  contato,
}: {
  material: ResourceDetail
  secao: Extract<Secao, 'relatorios' | 'ebooks'>
  locale: Locale
  t: TextosDoMaterial
  contato: Contato
}) {
  const ehEbook = material.kind === 'ebook'

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-primary overflow-hidden pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src={material.image.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/60" />
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

              {/* MIG-104: com PDF no material, o formulário gated; sem, o
               * botão inerte de sempre. Subir o arquivo no admin é o que troca
               * um pelo outro — ver `actions/materiais.ts`. */}
              {material.temDownload ? (
                <DownloadGate resourceId={material.id} />
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
              <div className="rounded-[6px]  bg-slate-50 p-8 text-center mb-12">
                <h2 className="font-bold text-slate-900 mb-1">{t.semCorpoTitulo}</h2>
                <p className="text-sm text-slate-600">{t.semCorpoTexto}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCta
        title={t.ctaTitulo}
        titleHighlight={t.ctaDestaque}
        description={t.ctaDescricao}
        phoneLabel={t.ctaTelefone}
        emailLabel={t.ctaEmail}
        actionLabel={t.ctaAcao}
        href={hrefDe('contato', locale)}
        contato={contato}
      />
    </main>
  )
}
