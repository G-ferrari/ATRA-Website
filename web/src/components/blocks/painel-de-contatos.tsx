import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Share2, Youtube } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'

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
 * saiu em 29/09: a ATRA não tem mais sede fixa. Só volta se o global ganhar um.
 *
 * ⚠️ **Dois desenhos, pela foto.** Com foto (home, consultores), os contatos
 * ficam no alto e no pé do cartão, e a foto aparece no meio. Sem foto
 * (`/contato`), esse meio era um vazio de ~350px desde que o endereço saiu —
 * o e-mail sozinho em cima, WhatsApp e redes embaixo. Sem foto os contatos
 * viram **lista**, uma linha por contato, ocupando o cartão inteiro (06/10,
 * pedido da revisão com Karen e Taci). */

/** Igual em todo o site; ver a nota acima. */
const EMAIL = 'negocios@atra.com.br'

const REDES = [
  { Icone: Linkedin, nome: 'LinkedIn', chave: 'linkedin', cor: 'bg-[#0A66C2]/15 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#388DFF]' },
  { Icone: Instagram, nome: 'Instagram', chave: 'instagram', cor: 'bg-[#E4405F]/15 text-[#E4405F] dark:bg-[#E4405F]/20 dark:text-[#FA7298]' },
  { Icone: Facebook, nome: 'Facebook', chave: 'facebook', cor: 'bg-[#1877F2]/15 text-[#1877F2] dark:bg-[#1877F2]/20 dark:text-[#5A9DFF]' },
  { Icone: Youtube, nome: 'YouTube', chave: 'youtube', cor: 'bg-[#FF0000]/15 text-[#FF0000] dark:bg-[#FF0000]/20 dark:text-[#FF4E4E]' },
] as const

/** Os ícones das redes. Rede sem URL no admin não aparece: o ícone levaria a
 *  `#` numa aba nova. */
function Redes({ redes }: { redes: Contato['redes'] }) {
  return (
    <div className="flex items-center gap-3">
      {REDES.flatMap(({ Icone, nome, chave, cor }) => {
        const url = redes[chave]
        if (!url) return []
        return (
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
        )
      })}
    </div>
  )
}

/** Uma linha da lista: ícone, rótulo e o contato. Cresce para dividir a altura
 *  do cartão com as outras — é o que preenche o espaço. */
function Linha({ icone, cor, rotulo, children }: { icone: ReactNode; cor: string; rotulo: ReactNode; children: ReactNode }) {
  return (
    <li className="flex-1 flex items-center gap-4 py-5">
      <span className={`w-11 h-11 rounded-[6px] flex items-center justify-center shrink-0 ${cor}`} aria-hidden>
        {icone}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-1.5">{rotulo}</p>
        {children}
      </div>
    </li>
  )
}

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
  const neutro = 'bg-primary/10 text-primary'
  const valor = 'text-base md:text-lg font-light text-text-main dark:text-white/90 hover:text-primary dark:hover:text-primary transition-colors break-words'

  /* Sem foto, a lista. */
  if (!foto) {
    return (
      <div className="relative rounded-[6px] overflow-hidden flex flex-col p-8 sm:p-10 min-h-[500px] shadow-xl dark:shadow-2xl bg-surface-1 dark:bg-[#12151c]">
        <div className="absolute inset-0 bg-linear-to-br from-surface-1/90 via-surface-1/80 to-surface-2/95 dark:from-black/90 dark:via-black/60 dark:to-[#12151c]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-surface-1/40 dark:bg-[#12151c]/30" />

        <h3 className="relative z-10 text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-2">
          {t.contatos}
        </h3>

        <ul className="relative z-10 flex-1 flex flex-col divide-y divide-border-main/60 dark:divide-white/10">
          <Linha icone={<Mail size={20} />} cor={neutro} rotulo={t.email}>
            <a href={`mailto:${EMAIL}`} className={valor}>
              {EMAIL}
            </a>
          </Linha>

          {contato && (
            <Linha
              icone={<MessageCircle size={20} />}
              cor="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              rotulo={
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  {t.conversar}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
              }
            >
              <a href={contato.whatsapp} target="_blank" rel="noopener noreferrer" className={valor}>
                {contato.telefoneComDdd}
              </a>
            </Linha>
          )}

          {contato?.endereco && (
            <Linha icone={<MapPin size={20} />} cor={neutro} rotulo={t.endereco}>
              <p className="text-sm font-light text-text-main dark:text-white/90 whitespace-pre-line">{contato.endereco}</p>
            </Linha>
          )}

          {contato && (
            <Linha icone={<Share2 size={20} />} cor={neutro} rotulo={t.redes}>
              <Redes redes={contato.redes} />
            </Linha>
          )}
        </ul>
      </div>
    )
  }

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
            <p className="text-sm font-light text-text-main dark:text-white/90">{EMAIL}</p>
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
            <Redes redes={contato.redes} />
          </div>
        </div>
      )}
    </div>
  )
}
