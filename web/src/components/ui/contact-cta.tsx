import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { Contato } from '@/types/content'

/* CTA de fechamento com telefone e e-mail.
 * Porte de `legacy/src/components/CaseDetailBase.tsx:185`. */

export type ContactCtaProps = {
  title: string
  /** Segunda metade do título, destacada em laranja. */
  titleHighlight: string
  description: string
  phoneLabel: string
  emailLabel: string
  actionLabel: string
  href: string
  /** Resolvido pela página, do global `contact` (MIG-072). */
  contato: Contato
}

export function ContactCta({
  title,
  titleHighlight,
  description,
  phoneLabel,
  emailLabel,
  actionLabel,
  href,
  contato,
}: ContactCtaProps) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-[6px] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              {title} <span className="text-secondary">{titleHighlight}</span>
            </h2>
            <p className="text-lg text-white/80 mb-12">{description}</p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12 p-8 bg-white/5 rounded-[6px] backdrop-blur-sm">
              <div>
                <div className="text-secondary text-xs font-black uppercase mb-2">{phoneLabel}</div>
                <div className="text-xl font-bold">{contato.telefone}</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <div>
                <div className="text-secondary text-xs font-black uppercase mb-2">{emailLabel}</div>
                <div className="text-xl font-bold">{contato.email}</div>
              </div>
            </div>

            <Link
              href={href}
              className="inline-flex items-center gap-3 bg-secondary hover:bg-orange-600 text-white px-10 py-5 rounded-[6px] font-bold text-lg transition-all hover:-translate-y-1 shadow-lg"
            >
              {actionLabel} <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
