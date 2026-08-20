import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/lib/locales'
import { TEXTOS_CASCA } from '@/lib/navegacao'
import type { Contato, Image as Imagem, Rodape } from '@/types/content'

/* Rodapé — porte de `legacy/src/App.tsx:2450`.
 *
 * O conteúdo vem dos globals `footer` e `contact` (MIG-072) e o logo do
 * `site-settings` (MIG-073); o layout resolve os três e entrega prontos. O que
 * sobrou em `lib/navegacao.ts` é cromo de interface — `alt` do logo, "Design
 * System", "Alternar tema".
 *
 * As redes sociais apontam para `#` no legado; as URLs reais estavam no CTA de
 * contato e entraram no global (P-26). Os 3 links legais continuam em `#` —
 * `/politicas-e-termos` existe no WordPress e entra em MIG-094. */

export function SiteFooter({
  locale,
  rodape,
  contato,
  logo,
}: {
  locale: Locale
  rodape: Rodape
  contato: Contato
  logo: Imagem | null
}) {
  const t = TEXTOS_CASCA[locale]
  const prefixo = locale === 'pt' ? '' : `/${locale}`
  const redes = [
    { Icone: Linkedin, nome: 'LinkedIn', url: contato.redes.linkedin },
    { Icone: Instagram, nome: 'Instagram', url: contato.redes.instagram },
    { Icone: Youtube, nome: 'YouTube', url: contato.redes.youtube },
  ]

  return (
    <footer className="bg-[#0e1015] text-white/70 pt-16 pb-10 rounded-t-lg relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              {logo && (
                /* eslint-disable-next-line @next/next/no-img-element -- ver SiteHeader */
                <img
                  src={logo.url}
                  alt={t.logo}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-auto object-contain brightness-110"
                />
              )}
            </div>
            <p className="text-xs font-light leading-relaxed mb-4 text-white/60">{rodape.sobre}</p>
            <div className="flex gap-2.5">
              {redes.map(({ Icone, nome, url }) => (
                <a
                  key={nome}
                  href={url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nome}
                  className="w-8 h-8 rounded-md bg-white/10 hover:bg-primary transition-all flex items-center justify-center text-white"
                >
                  <Icone size={14} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {rodape.colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <h2 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{coluna.titulo}</h2>

              {coluna.tipo === 'contact' ? (
                <ul className="space-y-3 text-xs font-light">
                  <li className="flex gap-2.5">
                    <Phone size={16} className="text-secondary opacity-80 shrink-0" aria-hidden />
                    <a
                      href={contato.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {contato.telefone}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <Mail size={16} className="text-secondary opacity-80 shrink-0" aria-hidden />
                    <a href={`mailto:${contato.email}`} className="hover:text-white transition-colors">
                      {contato.email}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <MapPin size={16} className="text-secondary opacity-80 shrink-0" aria-hidden />
                    <span className="leading-relaxed text-white/60">{contato.endereco}</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2 text-xs font-light">
                  {coluna.links.map((item) =>
                    /* Sem destino o legado desenha `<a href="#">`, não `<Link>`:
                       um `Link` para `#` faria o router do Next prefetchar a
                       própria rota a cada item. */
                    item.href ? (
                      <li key={item.label}>
                        <Link href={`${prefixo}${item.href}`} className="hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <a href="#" className="hover:text-white transition-colors">
                          {item.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-light text-white/40">
          <p>{rodape.direitos}</p>
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
