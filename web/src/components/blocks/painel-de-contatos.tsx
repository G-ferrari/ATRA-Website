import { Facebook, Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react'
import Image from 'next/image'

import type { Locale } from '@/lib/locales'
import type { Contato } from '@/types/content'

/* Painel de contatos (foto + e-mail + endereço + WhatsApp + redes).
 *
 * ⚠️ **Fonte única.** Antes vivia copiado em `contato-com-foto.tsx` (home) e em
 * `consultores/solicitar-consultores.tsx`, e as cópias divergiram: a de
 * consultores ficou com o e-mail **partido** (`negocios@atra.` / `com.br`), com
 * `contato.telefone` no lugar de `telefoneComDdd` e sem i18n. Consolidado aqui a
 * partir da versão da home (a mais atualizada), agora com rótulos PT/EN.
 *
 * O e-mail é **fixo** (igual em todo o site) e **não** parte (a quebra saiu a
 * pedido, melhoria de UI sancionada, D-31). WhatsApp, redes e endereço vêm do
 * global `contato` (MIG-072). O endereço era escrito aqui, em três linhas, e
 * saiu em 29/09: a ATRA não tem mais sede fixa. Só volta se o global ganhar um. */

const TEXTOS = {
  pt: {
    contatos: 'Nossos Contatos',
    email: 'E-mail',
    endereco: 'Endereço',
    conversar: 'Conversar agora',
    redes: 'Nossas redes sociais',
  },
  en: {
    contatos: 'Our contacts',
    email: 'E-mail',
    endereco: 'Address',
    conversar: 'Talk to us now',
    redes: 'Our social networks',
  },
} as const

export function PainelDeContatos({
  contato,
  locale,
  foto,
}: {
  /* `null` só no preview de um bloco solto no admin — o cartão some. */
  contato: Contato | null
  locale: Locale
  foto?: { url: string; alt: string } | null
}) {
  const t = TEXTOS[locale]

  return (
    <div className="relative rounded-[6px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 min-h-[500px] shadow-xl dark:shadow-2xl bg-surface-1 dark:bg-[#12151c]">
      {foto && (
        <Image
          src={foto.url}
          alt={foto.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-35 scale-105"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-br from-surface-1/90 via-surface-1/80 to-surface-2/95 dark:from-black/90 dark:via-black/60 dark:to-[#12151c]/95 mix-blend-multiply" />
      <div className="absolute inset-0 bg-surface-1/40 dark:bg-[#12151c]/30" />

      <div className="relative z-10 text-text-main dark:text-white">
        <h3 className="text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-6">
          {t.contatos}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
          <div>
            <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">
              {t.email}
            </p>
            <p className="text-sm font-light text-text-main dark:text-white/90">negocios@atra.com.br</p>
          </div>
          {contato?.endereco && (
            <div>
              <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">
                {t.endereco}
              </p>
              <p className="text-sm font-light text-text-main dark:text-white/90 whitespace-pre-line">{contato.endereco}</p>
            </div>
          )}
        </div>
      </div>

      {contato && (
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8">
          <a
            href={contato.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-surface-2/95 dark:bg-[#181b22]/95 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 backdrop-blur-sm rounded-[6px] px-4 py-3 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 flex-1 sm:flex-initial h-[76px]"
          >
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-normal tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t.conversar}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-text-main dark:text-white tracking-tight">
                {contato.telefoneComDdd}
              </p>
            </div>
            <div className="w-9 h-9 rounded-[6px] bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MessageCircle size={19} aria-hidden />
            </div>
          </a>

          <div className="bg-surface-2/95 dark:bg-[#181b22]/95 backdrop-blur-sm rounded-[6px] px-4 py-3 shadow-lg flex flex-col justify-center gap-1.5 flex-1 sm:flex-initial h-[76px]">
            <p className="text-[10px] uppercase font-normal tracking-wider text-text-muted dark:text-white/60">
              {t.redes}
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icone: Linkedin, nome: 'LinkedIn', url: contato.redes.linkedin, cor: 'bg-[#0A66C2]/15 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#388DFF]' },
                { Icone: Instagram, nome: 'Instagram', url: contato.redes.instagram, cor: 'bg-[#E4405F]/15 text-[#E4405F] dark:bg-[#E4405F]/20 dark:text-[#FA7298]' },
                { Icone: Facebook, nome: 'Facebook', url: contato.redes.facebook, cor: 'bg-[#1877F2]/15 text-[#1877F2] dark:bg-[#1877F2]/20 dark:text-[#5A9DFF]' },
                { Icone: Youtube, nome: 'YouTube', url: contato.redes.youtube, cor: 'bg-[#FF0000]/15 text-[#FF0000] dark:bg-[#FF0000]/20 dark:text-[#FF4E4E]' },
                // Rede sem URL no admin não aparece: o ícone levaria a `#` numa aba nova.
              ].filter((r): r is typeof r & { url: string } => Boolean(r.url)).map(({ Icone, nome, url, cor }) => (
                <a
                  key={nome}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${nome} da ATRA`}
                  className={`w-9 h-9 rounded-[6px] ${cor} flex items-center justify-center transition-transform hover:scale-105`}
                >
                  <Icone size={19} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
