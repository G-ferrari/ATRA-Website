import { ArrowRight, Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react'
import Image from 'next/image'

import { TechCornerBraces } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import type { Contato } from '@/types/content'

/* Seção "solicitar consultores" — porte de `legacy/src/pages/Consultants.tsx:685`.
 *
 * ⚠️ Não usa o bloco `ctaContact`. O legado diz copiar a seção da home, mas as
 * duas divergiram: aqui há subtítulo, cinco campos (com um `select` de modelo de
 * alocação) e um cartão à direita **com foto de fundo**, enquanto o `ctaContact`
 * que portamos em MIG-053 tem três campos e um cartão de gradiente escuro.
 * Reusar o bloco deixaria a seção ~200px mais curta que o gabarito.
 *
 * O formulário está **desabilitado**, pelo mesmo motivo de /contato: ligar o
 * envio é MIG-100 e depende de publicar a política de privacidade (P-14) e de
 * decidir o destino dos leads (P-18). No legado ele também não envia para lugar
 * nenhum — só troca o estado local para uma tela de sucesso.
 *
 * A foto é a do acervo da ATRA, não o hotlink do Unsplash do legado
 * (`Consultants.tsx:834`) — ver inventario-assets.md. */

const TEXTOS = {
  pt: {
    titulo: 'Vamos acelerar sua equipe com consultores ATRA?',
    subtitulo: 'Solicite perfis ou squads para o seu projeto!',
    nome: 'Nome completo *',
    email: 'E-mail corporativo *',
    telefone: 'Telefone / WhatsApp',
    cargo: 'Cargo ou tecnologia desejada',
    mensagem: 'Descreva brevemente o projeto, horizonte de tempo ou requisitos...',
    modelos: [
      'Modelo: Full-time (Dedicado)',
      'Modelo: Part-time (Parcial)',
      'Modelo: Squad Gerenciada ATRA',
      'Modelo: Staff Augmentation',
    ],
    enviar: 'Verificar Disponibilidade',
    aviso: 'O envio pelo site chega em breve. Enquanto isso, use o WhatsApp ou o e-mail ao lado.',
    contatos: 'Nossos Contatos',
    rotuloEmail: 'E-mail',
    rotuloEndereco: 'Endereço',
    conversar: 'Conversar agora',
    redes: 'Nossas redes sociais',
    fotoAlt: 'Equipe da ATRA reunida em evento',
  },
  en: {
    titulo: 'Shall we accelerate your team with ATRA consultants?',
    subtitulo: 'Request profiles or squads for your project.',
    nome: 'Full name *',
    email: 'Work e-mail *',
    telefone: 'Phone / WhatsApp',
    cargo: 'Role or technology needed',
    mensagem: 'Briefly describe the project, timeline or requirements...',
    modelos: [
      'Model: Full-time (dedicated)',
      'Model: Part-time',
      'Model: ATRA managed squad',
      'Model: Staff augmentation',
    ],
    enviar: 'Check availability',
    aviso: 'Submitting from the site is coming soon. For now, use WhatsApp or the e-mail beside.',
    contatos: 'Our contacts',
    rotuloEmail: 'E-mail',
    rotuloEndereco: 'Address',
    conversar: 'Talk to us now',
    redes: 'Our social networks',
    fotoAlt: 'ATRA team together at an event',
  },
} as const

/* ⚠️ Sem `disabled:opacity-60`. Os campos estão desabilitados, mas o legado —
 * que é o gabarito — desenha os dele em opacidade cheia, e o `select` nativo
 * ainda acinzenta o texto por conta própria quando desabilitado. Quem impede o
 * envio é o `disabled` e o `title` do botão, não a cor. */
const CAMPO =
  'w-full bg-transparent border-b border-border-main dark:border-white/20 outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors disabled:opacity-100'

export function SolicitarConsultores({ locale, contato }: { locale: Locale; contato: Contato }) {
  const t = TEXTOS[locale]

  return (
    <section
      id="solicitar-consultores"
      className="py-12 bg-surface-2 dark:bg-[#12151c] relative overflow-hidden px-3 sm:px-6 transition-colors duration-500 border-t border-border-main/50"
    >
      <TechCornerBraces color="orange" position="bottom-left" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch relative z-10">
          <div className="flex flex-col text-left py-6 md:py-10 pr-0 lg:pr-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-display text-text-main dark:text-white mb-4 leading-tight">
              {t.titulo}
            </h2>

            <h3 className="text-lg md:text-xl font-light font-display text-text-main dark:text-white mb-6">
              {t.subtitulo}
            </h3>

            {/* Estático: sem `onSubmit`, sem estado. Ver a nota no topo. */}
            <form className="flex flex-col space-y-6">
              <div>
                <input type="text" name="nome" placeholder={t.nome} disabled className={CAMPO} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="email" name="email" placeholder={t.email} disabled className={CAMPO} />
                <input type="tel" name="telefone" placeholder={t.telefone} disabled className={CAMPO} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="text" name="cargo" placeholder={t.cargo} disabled className={CAMPO} />
                <select name="modelo" disabled aria-label={t.modelos[0]} className={`${CAMPO} cursor-pointer`}>
                  {t.modelos.map((m) => (
                    <option key={m} value={m} className="bg-surface-2 text-text-main">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <input
                  type="text"
                  name="mensagem"
                  placeholder={t.mensagem}
                  disabled
                  className={`${CAMPO} pb-12`}
                />
              </div>

              {/* O aviso de "ainda não está no ar" vivia só no `title` do botão —
                  invisível no toque e para quem navega por teclado, então o
                  visitante preenchia o formulário inteiro antes de descobrir que
                  ele não envia. Agora fica visível ao lado do botão; a cópia
                  (`t.aviso`) já existia nos dois idiomas, nada de texto novo. */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3">
                <p className="text-xs text-text-muted dark:text-white/60 font-light max-w-sm">{t.aviso}</p>
                <button
                  type="button"
                  disabled
                  title={t.aviso}
                  /* Mesma cor do legado, e não um `bg-primary/60` de botão
                     apagado: o aceite visual compara com ele. O que impede o
                     envio é o `disabled` e o `title`, não a cor. */
                  className="bg-primary text-white dark:bg-white dark:text-[#12151c] py-3 px-6 rounded-[6px] text-sm font-medium transition-all flex items-center gap-2 cursor-not-allowed shadow-md shrink-0"
                >
                  <span>{t.enviar}</span>
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </form>
          </div>

          <div className="relative rounded-[6px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 min-h-[480px] shadow-xl dark:shadow-2xl bg-surface-1 dark:bg-[#12151c]">
            <Image
              src="/fotos/equipe-atra.jpg"
              alt={t.fotoAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-35 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-surface-1/90 via-surface-1/80 to-surface-2/95 dark:from-black/90 dark:via-black/60 dark:to-[#12151c]/95 mix-blend-multiply" />
            <div className="absolute inset-0 bg-surface-1/40 dark:bg-[#12151c]/30" />

            <div className="relative z-10 text-text-main dark:text-white">
              <h3 className="text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-6">
                {t.contatos}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                <div>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">
                    {t.rotuloEmail}
                  </p>
                  {/* ⚠️ As quebras são do legado (`Consultants.tsx:852` e
                      `:856`), não do texto: ele parte o e-mail em duas linhas e
                      o endereço em três, com `<br/>`. Sem isso o cartão fica
                      40px mais curto — e como ele tem `min-h-[480px]`, só 2px
                      vazam para a página, o que basta para empurrar o rodapé. */}
                  <p className="text-sm font-light text-text-main dark:text-white/90">
                    negocios@atra.
                    <br />
                    com.br
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">
                    {t.rotuloEndereco}
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

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8">
              <a
                href={contato.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-surface-2/95 dark:bg-[#181b22]/95 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 backdrop-blur-sm  hover:border-emerald-500/40 rounded-[6px] px-4 py-3 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 flex-1 sm:flex-initial h-[76px]"
              >
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-emerald-600 dark:text-emerald-400">
                      {t.conversar}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-text-main dark:text-white tracking-tight">
                    {contato.telefone}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-[6px] bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle size={19} aria-hidden />
                </div>
              </a>

              <div className="bg-surface-2/95 dark:bg-[#181b22]/95 backdrop-blur-sm  rounded-[6px] px-4 py-3 shadow-lg flex flex-col justify-center gap-1.5 flex-1 sm:flex-initial h-[76px]">
                <p className="text-[10px] uppercase font-normal tracking-wider text-text-muted dark:text-white/60">
                  {t.redes}
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { Icone: Linkedin, nome: 'LinkedIn', url: contato.redes.linkedin, cor: 'bg-[#0A66C2]/15 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#388DFF]' },
                    { Icone: Instagram, nome: 'Instagram', url: contato.redes.instagram, cor: 'bg-[#E4405F]/15 text-[#E4405F] dark:bg-[#E4405F]/20 dark:text-[#FA7298]' },
                    { Icone: Youtube, nome: 'YouTube', url: contato.redes.youtube, cor: 'bg-[#FF0000]/15 text-[#FF0000] dark:bg-[#FF0000]/20 dark:text-[#FF4D4D]' },
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
          </div>
        </div>
      </div>
    </section>
  )
}
