'use client'

import { ArrowLeft, ArrowUpRight, RotateCcw, Send, Sparkles, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Icone } from '@/components/blocks/icones'
import { rastrear } from '@/lib/rastreio'
import { cn } from '@/lib/utils'
import type { ConviteDeLead } from '@/types/content'

import { ConviteLead } from './convite-lead'
import { RespostaDoModelo } from './ui-generativa'

/* Conversa com a ATRA AI — porte de `legacy/src/pages/Chat.tsx:163`.
 *
 * A "UI generativa" ficou de fora enquanto a IA não respondia (P-04/D-12) e
 * entrou quando o modelo passou a responder em homologação: o system prompt
 * manda injetar `[UI_SERVICE:…]`, `[UI_PARTNER:…]`, `[UI_CHART:…]` e
 * `[UI_CONTACT]`, e sem o porte de `Chat.tsx:17` as tags saíam **cruas** na
 * tela — o convite de contato virava texto morto e o markdown aparecia com os
 * asteriscos. `ui-generativa.tsx` troca as tags por cartões e renderiza o
 * resto como markdown, como no gabarito. */

type Mensagem = { role: 'user' | 'model'; content: string }

const SUGESTOES = [
  {
    icone: 'brain',
    titulo: 'IA Generativa & Agentes',
    descricao: 'Como a IA Generativa pode otimizar processos na minha empresa?',
    prompt:
      'Como a ATRA ajuda empresas a implementar IA Generativa, agentes inteligentes e modelos de linguagem com governança?',
  },
  {
    icone: 'cloud',
    titulo: 'Parceria Google Cloud',
    descricao: 'Qual a experiência da ATRA em modernização na nuvem?',
    prompt:
      'Gostaria de entender a parceria da ATRA com o Google Cloud e quais serviços de migração e Lakehouse vocês oferecem.',
  },
  {
    icone: 'trending-up',
    titulo: 'FinOps & Custos em Nuvem',
    descricao: 'Estratégias de otimização de gastos em nuvem e governança.',
    prompt:
      'Como funciona o serviço de FinOps e Governança da ATRA para reduzir custos na nuvem e melhorar a previsibilidade orçamentária?',
  },
  {
    icone: 'chart',
    titulo: 'BI & Advanced Analytics',
    descricao: 'Modernização de dashboards executivos e autosserviço.',
    prompt:
      'Preciso modernizar nossos relatórios e dashboards corporativos. Como a ATRA estrutura soluções de Business Intelligence e Lakehouse?',
  },
] as const

const ERRO_GERAL =
  'Desculpe, ocorreu um erro ao se comunicar com nossos especialistas. Tente novamente em alguns segundos.'

export function Conversa({
  mensagemInicial,
  locale,
  convite,
  whatsapp,
}: {
  mensagemInicial?: string
  locale: 'pt' | 'en'
  /* MIG-150 (D-29): `null` com a feature fechada — e aí nada daqui muda. */
  convite?: ConviteDeLead | null
  /* Para o cartão de [UI_CONTACT] — vem do global `contact`, resolvido na página. */
  whatsapp: string
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [texto, setTexto] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const fimRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const jaEnviou = useRef(false)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, carregando])

  const enviar = useCallback(
    async (conteudo: string, historicoAtual: Mensagem[]) => {
      const limpo = conteudo.trim()
      if (!limpo) return

      const historico: Mensagem[] = [...historicoAtual, { role: 'user', content: limpo }]
      setMensagens(historico)
      setTexto('')
      setErro(null)
      setCarregando(true)

      /* MIG-156: no-op sem GTM ou sem consentimento de estatística. Só o fato,
         nunca o conteúdo — o que a pessoa escreveu não vai ao dataLayer. */
      if (historicoAtual.length === 0) rastrear('chat_started')
      rastrear('chat_message_sent')

      try {
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          /* O idioma vai junto: a rota está fora do segmento `[locale]` e não
             tem como descobrir sozinha em qual das duas páginas o visitante
             está. Sem ele, a mensagem de indisponibilidade sai no idioma
             padrão, qualquer que seja a página. */
          body: JSON.stringify({ messages: historico, locale }),
        })
        const dados = (await r.json()) as { text?: string; error?: string }
        if (!r.ok || dados.error) {
          setErro(dados.error ?? ERRO_GERAL)
          return
        }
        setMensagens([...historico, { role: 'model', content: dados.text ?? '' }])
      } catch {
        setErro(ERRO_GERAL)
      } finally {
        setCarregando(false)
      }
    },
    [locale],
  )

  /* A caixa de conversa da home manda a primeira pergunta por query string.
     `jaEnviou` impede o reenvio quando o efeito roda duas vezes. */
  useEffect(() => {
    if (!mensagemInicial || jaEnviou.current) return
    jaEnviou.current = true
    void enviar(mensagemInicial, [])
  }, [mensagemInicial, enviar])

  return (
    <div className="flex-1 flex flex-col pt-24 md:pt-28 pb-4 md:pb-6 px-3 sm:px-6 md:px-8 max-w-6xl w-full mx-auto min-h-0 relative select-none">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex-1 flex flex-col min-h-0 bg-surface-2 dark:bg-[#181b22]  rounded-[6px] shadow-xl dark:shadow-2xl overflow-hidden relative">
        <div className="px-4 sm:px-5 py-3.5 border-b border-border-main flex items-center justify-between bg-surface-2/90 dark:bg-[#181b22]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Voltar para a página inicial"
              className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-surface-3 dark:bg-[#222631]  text-text-muted hover:text-text-main hover:border-primary/50 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} aria-hidden />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-[6px] bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-xs">
                  <div className="w-full h-full bg-surface-2 dark:bg-[#181b22] rounded-[4px] flex items-center justify-center text-primary">
                    <Sparkles size={16} className="text-primary animate-pulse" aria-hidden />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface-2 dark:border-[#181b22]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-text-main tracking-tight">Converse com a ATRA</h2>
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-[6px] tracking-wider">
                    BETA
                  </span>
                </div>
                <p className="text-[10.5px] text-text-muted">IA Especialista em Dados &amp; Negócios</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mensagens.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMensagens([])
                  setErro(null)
                  setTexto('')
                }}
                title="Reiniciar conversa"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-surface-3 dark:bg-[#222631]  text-text-muted hover:text-text-main hover:border-primary/50 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw size={12} aria-hidden />
                <span className="hidden sm:inline">Nova conversa</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 relative min-h-0 select-text">
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 p-3.5 rounded-[6px] text-xs font-medium shadow-xs flex items-center justify-between gap-3">
              <span>{erro}</span>
              <button
                type="button"
                onClick={() => setErro(null)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-300 text-xs underline cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          )}

          {mensagens.length === 0 && !carregando && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-6 sm:py-10 px-2">
              <div className="w-14 h-14 rounded-[6px] bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 border border-primary/20 flex items-center justify-center mb-4 shadow-md shadow-primary/10">
                <Sparkles size={26} className="text-primary" aria-hidden />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-text-main mb-2 tracking-tight">
                Como podemos impulsionar sua empresa hoje?
              </h3>

              <p className="text-xs sm:text-[13px] text-text-muted mb-6 max-w-lg leading-relaxed">
                Descubra nossas soluções em{' '}
                <strong className="text-text-main font-semibold">Inteligência Artificial</strong>, arquitetura de{' '}
                <strong className="text-text-main font-semibold">Lakehouse</strong>,{' '}
                <strong className="text-text-main font-semibold">FinOps</strong> e conheça a nossa parceria oficial com o{' '}
                <strong className="text-text-main font-semibold">Google Cloud</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {SUGESTOES.map((s) => (
                  <button
                    key={s.titulo}
                    type="button"
                    onClick={() => void enviar(s.prompt, mensagens)}
                    className="p-3.5 rounded-[6px] bg-surface-3/70 dark:bg-[#222631]/70  hover:border-primary/60 hover:bg-surface-3 dark:hover:bg-[#222631] transition-all duration-200 group flex items-start gap-3 shadow-xs cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      <Icone nome={s.icone} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-bold text-text-main mb-0.5 flex items-center justify-between group-hover:text-primary transition-colors">
                        <span>{s.titulo}</span>
                        <ArrowUpRight
                          size={12}
                          className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                          aria-hidden
                        />
                      </div>
                      <p className="text-[10.5px] text-text-muted leading-relaxed line-clamp-2">{s.descricao}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mensagens.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={cn(
                'flex gap-2.5 sm:gap-3.5',
                m.role === 'user' ? 'ml-auto justify-end max-w-[85%] sm:max-w-[75%]' : 'max-w-[95%] sm:max-w-[85%]',
              )}
            >
              {m.role === 'model' && (
                <div className="w-8 h-8 rounded-[6px] bg-gradient-to-tr from-primary to-secondary p-[1px] shrink-0 mt-0.5 shadow-sm shadow-primary/10">
                  <div className="w-full h-full bg-surface-2 dark:bg-[#181b22] rounded-[4px] flex items-center justify-center text-primary">
                    <Sparkles size={14} className="text-primary" aria-hidden />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'p-3.5 sm:p-4 text-[13px] leading-relaxed overflow-hidden',
                  m.role === 'user'
                    ? 'bg-primary text-white font-medium rounded-[6px] rounded-tr-[2px] shadow-md shadow-primary/20'
                    : 'bg-surface-3 dark:bg-[#222631] text-text-main rounded-[6px] rounded-tl-[2px]  shadow-xs',
                )}
              >
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <RespostaDoModelo texto={m.content} whatsapp={whatsapp} />
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-[6px] bg-surface-3 dark:bg-[#222631]  text-text-main flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User size={14} aria-hidden />
                </div>
              )}
            </div>
          ))}

          {/* MIG-150 — o convite entra no fluxo depois de N mensagens DO
              VISITANTE (não do modelo, de propósito: com a IA indisponível a
              mensagem do usuário fica no estado — ver `enviar` — e capturar o
              contato é o que resta). Nunca no estado vazio: é o que o gabarito
              do gate captura, e ele não muda. */}
          {convite && mensagens.filter((m) => m.role === 'user').length >= convite.aposMensagens && (
            <ConviteLead convite={convite} mensagens={mensagens} locale={locale} />
          )}

          {carregando && (
            <div className="flex gap-2.5 sm:gap-3.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-[6px] bg-gradient-to-tr from-primary to-secondary p-[1px] shrink-0 mt-0.5 shadow-sm shadow-primary/10">
                <div className="w-full h-full bg-surface-2 dark:bg-[#181b22] rounded-[4px] flex items-center justify-center text-primary">
                  <Sparkles size={14} className="text-primary animate-pulse" aria-hidden />
                </div>
              </div>
              <div className="px-4 py-3 rounded-[6px] rounded-tl-[2px] bg-surface-3 dark:bg-[#222631]  flex items-center gap-2 shadow-xs">
                <span className="text-[11px] text-text-muted mr-1 font-medium">Consultando especialistas ATRA</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={fimRef} />
        </div>

        <div className="p-3 sm:p-3.5 bg-surface-2/95 dark:bg-[#181b22]/95 border-t border-border-main">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void enviar(texto, mensagens)
            }}
            className="flex gap-2 sm:gap-2.5 max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="O que você deseja construir hoje?"
              aria-label="O que você deseja construir hoje?"
              disabled={carregando}
              className="flex-1 bg-surface-1 dark:bg-[#0e1015]  text-text-main placeholder:text-text-muted px-4 py-2.5 sm:py-3 rounded-[6px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-[13px] shadow-inner"
            />
            <button
              type="submit"
              disabled={!texto.trim() || carregando}
              aria-label="Enviar mensagem"
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-[11px] uppercase tracking-wider rounded-[6px] flex items-center justify-center gap-1.5 hover:shadow-md hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Send size={14} className={cn(carregando && 'opacity-0')} aria-hidden />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-text-muted font-medium flex justify-center items-center gap-1.5">
              <Sparkles size={10} className="text-primary" aria-hidden /> POWERED BY ATRA AI • Inteligência para Negócios
              &amp; Nuvem
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
