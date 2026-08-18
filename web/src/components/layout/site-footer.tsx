import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import Link from 'next/link'

import { CONTATO } from '@/lib/contato'
import type { Locale } from '@/lib/locales'
import { LOGO_ATRA, RODAPE, TEXTOS_CASCA } from '@/lib/navegacao'

/* Rodapé — porte de `legacy/src/App.tsx:2450`.
 *
 * As redes sociais apontam para `#` no legado; portado assim (D-15). Os 3 links
 * legais idem — `/politicas-e-termos` existe no WordPress e entra em MIG-094. */

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = TEXTOS_CASCA[locale]
  const prefixo = locale === 'pt' ? '' : `/${locale}`

  return (
    <footer className="bg-[#0e1015] text-white/70 pt-16 pb-10 rounded-t-lg relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- ver SiteHeader */}
              <img
                src={LOGO_ATRA}
                alt={t.logo}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-xs font-light leading-relaxed mb-4 text-white/60">{t.sobreATRA}</p>
            <div className="flex gap-2.5">
              {[
                { Icone: Linkedin, nome: 'LinkedIn' },
                { Icone: Instagram, nome: 'Instagram' },
                { Icone: Youtube, nome: 'YouTube' },
              ].map(({ Icone, nome }) => (
                <a
                  key={nome}
                  href="#"
                  aria-label={nome}
                  className="w-8 h-8 rounded-md bg-white/10 hover:bg-primary transition-all flex items-center justify-center text-white"
                >
                  <Icone size={14} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t.tituloSolucoes}</h2>
            <ul className="space-y-2 text-xs font-light">
              {RODAPE.solucoes.map((s) => (
                <li key={s.pt}>
                  <a href="#" className="hover:text-white transition-colors">
                    {s[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t.tituloSobre}</h2>
            <ul className="space-y-2 text-xs font-light">
              {RODAPE.institucional.map((item) => (
                <li key={item.href}>
                  <Link href={`${prefixo}${item.href}`} className="hover:text-white transition-colors">
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t.tituloContato}</h2>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex gap-2.5">
                <Phone size={16} className="text-secondary opacity-80 shrink-0" aria-hidden />
                <a
                  href={CONTATO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {CONTATO.telefone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} className="text-secondary opacity-80 shrink-0" aria-hidden />
                <a href={`mailto:${CONTATO.email}`} className="hover:text-white transition-colors">
                  {CONTATO.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MapPin size={16} className="text-secondary opacity-80 shrink-0" aria-hidden />
                <span className="leading-relaxed text-white/60">{CONTATO.endereco}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t.tituloLegal}</h2>
            <ul className="space-y-2 text-xs font-light">
              {RODAPE.legal.map((item) => (
                <li key={item.pt}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-light text-white/40">
          <p>{t.direitos}</p>
          <div className="flex gap-4">
            <Link href={`${prefixo}/design-system`} className="hover:text-primary transition-colors">
              {t.designSystem}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
