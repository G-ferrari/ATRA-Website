import { TechCornerBraces } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/locales'
import type { BlocoCtaContact } from '@/types/content'

import { ContatoComFoto } from './contato-com-foto'
import { PainelDeContatos } from './painel-de-contatos'
import { Formulario } from '@/components/forms/formulario'

/* Contato com formulário — porte de `legacy/src/App.tsx:2288`.
 *
 * ⚠️ O formulário **envia** desde MIG-100. P-14 saiu do caminho quando
 * `/politicas-e-termos` foi publicada (MIG-094) — é o que a LGPD exige antes de
 * coletar dado pessoal. E D-26 fechou P-18 (corrigida pela D-54: é o **RD Station Marketing**), o
 * destino final do lead é lá, e o que grava aqui é registro de passagem. */

const CAMPOS = [
  { name: 'name', tipo: 'text', ph: 'Nome completo' },
  { name: 'email', tipo: 'email', ph: 'E-mail' },
  { name: 'phone', tipo: 'tel', ph: 'Telefone' },
] as const

export function BlocoContato({ bloco, locale }: { bloco: BlocoCtaContact; locale: Locale }) {
  /* A forma com foto é outro markup, não outra pele: ver a nota do campo
     `variant` em `blocks/index.ts`. */
  if (bloco.variant === 'photo') return <ContatoComFoto bloco={bloco} locale={locale} />

  /* O cartão some se o contato não veio resolvido — é o que acontece no preview
     de um bloco solto no admin. A página o injeta (MIG-072). */
  const contato = bloco.contato

  return (
    <section
      id={bloco.anchor ?? 'fale-conosco'}
      className={cn(
        'py-16 relative overflow-hidden px-3 sm:px-6 scroll-mt-32',
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

          {/* Painel de contatos compartilhado (fonte única) — antes esta variante
              tinha um card próprio de lista de ícones, que divergia da home.
              Ver painel-de-contatos.tsx. */}
          {bloco.showContactCard && contato && (
            <PainelDeContatos contato={contato} locale={locale} foto={bloco.photo} />
          )}
        </div>
      </div>
    </section>
  )
}
