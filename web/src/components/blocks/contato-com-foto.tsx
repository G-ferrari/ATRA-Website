import { ArrowRight, Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react'
import Image from 'next/image'

import { TechCornerBraces, TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoCtaContact } from '@/types/content'
import { Formulario } from '@/components/forms/formulario'

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

export function ContatoComFoto({ bloco }: { bloco: BlocoCtaContact }) {
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

          <div className="relative rounded-[6px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 min-h-[500px] shadow-xl dark:shadow-2xl bg-surface-1 dark:bg-[#12151c]">
            {bloco.photo && (
              <Image
                src={bloco.photo.url}
                alt={bloco.photo.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-35 scale-105"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-br from-surface-1/90 via-surface-1/80 to-surface-2/95 dark:from-black/90 dark:via-black/60 dark:to-[#12151c]/95 mix-blend-multiply" />
            <div className="absolute inset-0 bg-surface-1/40 dark:bg-[#12151c]/30" />

            <div className="relative z-10 text-text-main dark:text-white">
              <h3 className="text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-6">
                Nossos Contatos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                <div>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">
                    E-mail
                  </p>
                  {/* ⚠️ E-mail e endereço continuam **escritos aqui**, e não vindos
                      do global `contact` (MIG-072): o endereço quebra em três linhas
                      com pontuação diferente da string do rodapé, e reconstituir isso
                      a partir de um texto corrido seria adivinhação — a quebra é pixel.
                      O e-mail antes também era partido no meio (`negocios@atra.` /
                      `com.br`, `App.tsx:2374`, porte fiel D-15); a quebra saiu a pedido,
                      como melhoria de UI sancionada (D-31). Débito do endereço em
                      `debito-tecnico.md`. */}
                  <p className="text-sm font-light text-text-main dark:text-white/90">
                    negocios@atra.com.br
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">
                    Endereço
                  </p>
                  <p className="text-sm font-light text-text-main dark:text-white/90">
                    Av. Queiroz Filho, 1700
                    <br />
                    Torre D Sala 802
                    <br />
                    Vila Hamburguesa – SP
                  </p>
                </div>
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
                        Conversar agora
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
                    Nossas redes sociais
                  </p>
                  <div className="flex items-center gap-3">
                    {[
                      { Icone: Linkedin, nome: 'LinkedIn', url: contato.redes.linkedin, cor: 'bg-[#0A66C2]/15 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#388DFF]' },
                      { Icone: Instagram, nome: 'Instagram', url: contato.redes.instagram, cor: 'bg-[#E4405F]/15 text-[#E4405F] dark:bg-[#E4405F]/20 dark:text-[#FA7298]' },
                      { Icone: Youtube, nome: 'YouTube', url: contato.redes.youtube, cor: 'bg-[#FF0000]/15 text-[#FF0000] dark:bg-[#FF0000]/20 dark:text-[#FF4E4E]' },
                    ].map(({ Icone, nome, url, cor }) => (
                      <a
                        key={nome}
                        href={url ?? '#'}
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
        </div>
      </div>
    </section>
  )
}
