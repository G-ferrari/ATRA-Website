import { ArrowRight } from 'lucide-react'

import { TechCornerBraces, TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/locales'
import type { BlocoCtaContact } from '@/types/content'
import { Formulario } from '@/components/forms/formulario'

import { PainelDeContatos } from './painel-de-contatos'

/* Faixa de contato com cartão de foto — porte de `legacy/src/App.tsx:2288`, a
 * seção `#fale-conosco` que fecha a home.
 *
 * ⚠️ É irmã de `consultores/solicitar-consultores.tsx`, não a mesma coisa: lá
 * são cinco campos (com um `select` de modelo de alocação) e o cartão tem
 * `min-h-[480px]`; aqui são quatro e `min-h-[500px]`. As duas seções divergiram
 * no legado, e o aceite visual é contra cada página.
 *
 * ⚠️ O formulário **envia** desde MIG-100. No gabarito ele não envia — o
 * `onSubmit` do protótipo só faz `preventDefault` —, e a diferença não aparece
 * em captura: nenhum pixel muda entre um campo que aceita texto e um que não
 * aceita. */

/* ⚠️ Sem `disabled:opacity-60`: o gabarito desenha os campos em opacidade
 * cheia. Quem impede o envio é o `disabled` e o `title` do botão, não a cor. */
const CAMPO =
  'w-full bg-transparent border-b border-border-main dark:border-white/20 outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors disabled:opacity-100'

export function ContatoComFoto({ bloco, locale }: { bloco: BlocoCtaContact; locale: Locale }) {
  /* Injetado pela página (MIG-072). `null` só no preview de um bloco solto. */
  const contato = bloco.contato

  return (
    <section
      id={bloco.anchor ?? 'fale-conosco'}
      className={cn(
        'py-16 md:py-24 relative overflow-hidden px-3 sm:px-6 transition-colors duration-500',
        bloco.theme === 'surface-2' ? 'bg-surface-2 dark:bg-[#12151c]' : 'bg-surface-1',
      )}
    >
      {/* Linhas decorativas da seção, na configuração do gabarito
          (`App.tsx:2295`). */}
      <TechHorizontalLine color="mixed" align="right" side="top" delay={0.2} />
      <TechVerticalLine color="blue" align="right" alignY="top" delay={0.3} />
      <TechCornerBraces color="orange" position="bottom-left" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch relative z-10">
          <div className="flex flex-col text-left py-8 md:py-12 pr-0 lg:pr-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-display text-text-main dark:text-white mb-8 leading-tight">
              {bloco.title}
            </h2>

            {bloco.subtitle && (
              <h3 className="text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-6">
                {bloco.subtitle}
              </h3>
            )}

            <Formulario
              kind="contact"
              className="flex flex-col space-y-6"
              sucesso="Recebemos sua mensagem. A gente responde em breve."
            >
              <div>
                <input type="text" name="name" placeholder="Nome completo" required className={CAMPO} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="email" name="email" placeholder="E-mail" required className={CAMPO} />
                <input type="tel" name="phone" placeholder="Telefone" className={CAMPO} />
              </div>

              <div className="pt-2">
                {/* ⚠️ `input`, não `textarea`. O gabarito usa um campo de uma
                    linha com `pb-16` para simular a caixa alta — o cursor fica
                    no topo e o texto não quebra. Trocar por `textarea` muda a
                    altura da caixa e a posição do placeholder. */}
                <input
                  type="text"
                  name="message"
                  placeholder="Sua mensagem"
                  required
                  className={`${CAMPO} pb-16`}
                />
              </div>

              <div className="flex justify-end pt-4">
                {/* `cursor-not-allowed` sai junto com o `disabled` e não move
                    pixel: cursor não aparece em captura. */}
                <button
                  type="submit"
                  className="bg-primary text-white dark:bg-white dark:text-[#12151c] py-3 px-6 rounded-[6px] text-sm font-medium transition-all flex items-center gap-2 shadow-md"
                >
                  <span>Enviar</span>
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </Formulario>
          </div>

          {/* Painel de contatos compartilhado (fonte única) — ver
              painel-de-contatos.tsx. */}
          <PainelDeContatos contato={contato} locale={locale} foto={bloco.photo} />
        </div>
      </div>
    </section>
  )
}
