import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'

import { TechCornerBraces } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoCtaContact } from '@/types/content'

import { ContatoComFoto } from './contato-com-foto'
import { Formulario } from '@/components/forms/formulario'

/* Contato com formulário — porte de `legacy/src/App.tsx:2288`.
 *
 * ⚠️ O formulário **envia** desde MIG-100. P-14 saiu do caminho quando
 * `/politicas-e-termos` foi publicada (MIG-094) — é o que a LGPD exige antes de
 * coletar dado pessoal. E D-26 fechou P-18: a ATRA usa **RD Station CRM**, o
 * destino final do lead é lá, e o que grava aqui é registro de passagem. */

const CAMPOS = [
  { name: 'name', tipo: 'text', ph: 'Nome completo' },
  { name: 'email', tipo: 'email', ph: 'E-mail' },
  { name: 'phone', tipo: 'tel', ph: 'Telefone' },
] as const

export function BlocoContato({ bloco }: { bloco: BlocoCtaContact }) {
  /* A forma com foto é outro markup, não outra pele: ver a nota do campo
     `variant` em `blocks/index.ts`. */
  if (bloco.variant === 'photo') return <ContatoComFoto bloco={bloco} />

  /* O cartão some se o contato não veio resolvido — é o que acontece no preview
     de um bloco solto no admin. A página o injeta (MIG-072). */
  const contato = bloco.contato

  return (
    <section
      id={bloco.anchor ?? 'fale-conosco'}
      className={cn(
        'py-16 relative overflow-hidden px-3 sm:px-6',
        bloco.theme === 'surface-2' ? 'bg-surface-2 dark:bg-[#12151c]' : 'bg-surface-1',
      )}
    >
      <TechCornerBraces color="orange" position="bottom-left" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div
          className={cn(
            'grid gap-8 items-stretch',
            bloco.showContactCard ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto',
          )}
        >
          <div className="flex flex-col text-left py-8 md:py-12 pr-0 lg:pr-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-display text-text-main mb-8 leading-tight">
              {bloco.title}
            </h2>
            {bloco.subtitle && (
              <h3 className="text-xl md:text-2xl font-light font-display text-text-main mb-6">
                {bloco.subtitle}
              </h3>
            )}

            {/* ⚠️ Esta variante **não** está sob gate visual: D-10 fez `/contato`
                nascer no site novo, sem gabarito. Por isso ela pode largar o
                `disabled:opacity-60` e o `bg-primary/60`, que existiam para
                desenhar "desligado" — na home, onde a outra variante é usada,
                mexer na cor teria custado pixel. */}
            <Formulario
              kind="contact"
              className="flex flex-col space-y-6"
              sucesso="Recebemos sua mensagem. A gente responde em breve."
            >
              {CAMPOS.map((c) => (
                <input
                  key={c.name}
                  type={c.tipo}
                  name={c.name}
                  placeholder={c.ph}
                  required={c.name !== 'phone'}
                  className="w-full bg-transparent border-b border-border-main dark:border-white/20 outline-none py-2 text-sm text-text-main placeholder:text-text-muted font-light"
                />
              ))}
              <textarea
                name="message"
                placeholder="Sua mensagem"
                rows={3}
                required
                className="w-full bg-transparent border-b border-border-main dark:border-white/20 outline-none py-2 text-sm text-text-main placeholder:text-text-muted font-light resize-none"
              />
              <button
                type="submit"
                className="bg-primary text-white py-3 px-6 rounded-[6px] text-sm font-medium flex items-center gap-2 w-fit"
              >
                Enviar
              </button>
            </Formulario>
          </div>

          {bloco.showContactCard && contato && (
            <div className="bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] rounded-[6px] p-8 lg:p-12 text-white flex flex-col justify-center gap-8 relative overflow-hidden">
              <TechCornerBraces color="blue" position="top-left" size={14} />

              <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                <div>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone size={12} aria-hidden /> Telefone
                  </p>
                  <a href={contato.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm font-light hover:text-primary transition-colors">
                    {contato.telefone}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail size={12} aria-hidden /> E-mail
                  </p>
                  <a href={`mailto:${contato.email}`} className="text-sm font-light hover:text-primary transition-colors">
                    {contato.email}
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={12} aria-hidden /> Endereço
                  </p>
                  <p className="text-sm font-light text-white/90 leading-relaxed">{contato.endereco}</p>
                </div>
              </div>

              <div className="flex gap-2.5 relative z-10">
                {[
                  { Icone: Linkedin, nome: 'LinkedIn', url: contato.redes.linkedin },
                  { Icone: Instagram, nome: 'Instagram', url: contato.redes.instagram },
                  { Icone: Youtube, nome: 'YouTube', url: contato.redes.youtube },
                ].map(({ Icone, nome, url }) => (
                  <a
                    key={nome}
                    href={url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={nome}
                    className="w-9 h-9 rounded-md bg-white/10 hover:bg-primary transition-all flex items-center justify-center text-white"
                  >
                    <Icone size={16} aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
