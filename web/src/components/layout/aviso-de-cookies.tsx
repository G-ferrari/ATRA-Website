'use client'

import { Cookie, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import {
  anunciarConsentimento,
  EVENTO_ABRIR_PREFERENCIAS,
  gravarConsentimento,
  lerConsentimento,
} from '@/lib/consentimento'
import { congelado } from '@/lib/e2e'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { AvisoDeCookies as TextosDoAviso } from '@/types/content'

/* MIG-152 (D-30) — o banner de consentimento de cookies e o painel de
 * preferências, no mesmo cartão.
 *
 * ⚠️ Nunca renderiza no SSR nem na primeira pintura: a decisão de aparecer
 * depende do cookie, que só existe no cliente — e sob `congelado()` (o gate
 * visual) ele não aparece nunca, cinto e suspensório para o caso de alguém
 * preencher os textos num banco local de gate.
 *
 * ⚠️ **Recusar tão visível quanto aceitar** é requisito da spec
 * (formularios-e-integracoes.md), não estilo: os dois botões têm o mesmo
 * tamanho e a mesma tipografia, e o e2e mede isso.
 *
 * A identidade visual copia os padrões existentes: o cartão do chat
 * (`conversa.tsx`), o CTA do convite de lead (`convite-lead.tsx`) e a entrada
 * animada via motion/react (`theme-toggle.tsx`). O cartão fica à esquerda no
 * desktop para não brigar com o alternador de tema, que é fixo à direita
 * (`theme-toggle.tsx`, z-[100] — este fica acima, z-[110], porque enquanto a
 * pergunta está aberta ela é o que importa). */

type Estado = 'nada' | 'banner' | 'painel'

export function AvisoDeCookies({ textos, locale }: { textos: TextosDoAviso; locale: Locale }) {
  const [estado, setEstado] = useState<Estado>('nada')
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (congelado()) return
    /* Num quadro seguinte, não síncrono no efeito (regra do lint): evita o
       render em cascata e dá à animação de entrada um primeiro quadro limpo. */
    const quadro = requestAnimationFrame(() => {
      if (!lerConsentimento()) setEstado('banner')
    })

    const abrir = () => {
      const c = lerConsentimento()
      setAnalytics(c?.analytics ?? false)
      setMarketing(c?.marketing ?? false)
      setEstado('painel')
    }
    window.addEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir)
    }
  }, [])

  const decidir = (escolha: { analytics: boolean; marketing: boolean }) => {
    const gravado = gravarConsentimento(escolha)
    if (gravado) anunciarConsentimento(gravado)
    setEstado('nada')
  }

  return (
    <AnimatePresence>
      {estado !== 'nada' && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-label={textos.titulo}
          data-testid="aviso-de-cookies"
          className="fixed z-[110] bottom-3 left-3 right-3 md:bottom-8 md:left-8 md:right-auto md:max-w-md bg-surface-2 dark:bg-[#181b22]  rounded-[6px] shadow-xl dark:shadow-2xl backdrop-blur-md p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Cookie size={16} aria-hidden />
              </div>
              <h2 className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
                {estado === 'painel' ? textos.tituloDoPainel : textos.titulo}
              </h2>
            </div>
            {estado === 'painel' && lerConsentimento() && (
              <button
                type="button"
                onClick={() => setEstado('nada')}
                aria-label={textos.recusar}
                className="text-text-muted hover:text-text-main transition-colors cursor-pointer shrink-0"
              >
                <X size={14} aria-hidden />
              </button>
            )}
          </div>

          {estado === 'banner' ? (
            <>
              <p className="text-[12px] text-text-muted leading-relaxed mb-3 whitespace-pre-wrap">
                {textos.mensagem}{' '}
                <a
                  href={hrefDe('politicas', locale)}
                  className="text-primary hover:underline underline-offset-2"
                >
                  {locale === 'pt' ? 'Saiba mais' : 'Learn more'}
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* ⚠️ Os dois com o MESMO tamanho e tipografia — requisito da
                    spec, medido pelo e2e. */}
                <button type="button" onClick={() => decidir({ analytics: true, marketing: true })} className={CTA}>
                  {textos.aceitar}
                </button>
                <button
                  type="button"
                  onClick={() => decidir({ analytics: false, marketing: false })}
                  className={SECUNDARIO}
                >
                  {textos.recusar}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnalytics(false)
                    setMarketing(false)
                    setEstado('painel')
                  }}
                  className="px-3 py-2 text-[11px] font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  {textos.preferencias}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[12px] text-text-muted leading-relaxed mb-3">{textos.mensagemDoPainel}</p>
              <div className="space-y-2.5 mb-3">
                <Categoria nome={textos.categorias.necessarios.nome} descricao={textos.categorias.necessarios.descricao} />
                <Categoria
                  nome={textos.categorias.analytics.nome}
                  descricao={textos.categorias.analytics.descricao}
                  ligado={analytics}
                  aoAlternar={() => setAnalytics((v) => !v)}
                />
                <Categoria
                  nome={textos.categorias.marketing.nome}
                  descricao={textos.categorias.marketing.descricao}
                  ligado={marketing}
                  aoAlternar={() => setMarketing((v) => !v)}
                />
              </div>
              <button type="button" onClick={() => decidir({ analytics, marketing })} className={CTA}>
                {textos.salvar}
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Uma categoria do painel. Sem `aoAlternar` é a essencial: sempre ligada,
 * interruptor travado — mostrar que ela existe é transparência, escondê-la
 * seria fingir que não há cookie nenhum. */
function Categoria({
  nome,
  descricao,
  ligado,
  aoAlternar,
}: {
  nome: string
  descricao: string
  ligado?: boolean
  aoAlternar?: () => void
}) {
  const ativo = aoAlternar ? Boolean(ligado) : true
  return (
    <div className="flex items-start justify-between gap-3 p-2.5 rounded-[6px] bg-surface-3/70 dark:bg-[#222631]/70 ">
      <div className="min-w-0">
        <p className="text-[11.5px] font-bold text-text-main mb-0.5">{nome}</p>
        <p className="text-[10.5px] text-text-muted leading-relaxed">{descricao}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ativo}
        aria-label={nome}
        disabled={!aoAlternar}
        onClick={aoAlternar}
        className={`relative shrink-0 w-9 h-5 rounded-full transition-colors mt-0.5 ${
          ativo ? 'bg-linear-to-r from-primary to-primary-dark' : 'bg-surface-1 dark:bg-[#0e1015] '
        } ${aoAlternar ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all ${ativo ? 'left-[18px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

/* O CTA padrão do site — copiado do convite de lead (`convite-lead.tsx`),
 * que copiou do chat. O secundário tem o MESMO padding e tipografia. */
const CTA =
  'px-4 py-2 bg-linear-to-r from-primary to-primary-dark text-white font-bold text-[11px] uppercase tracking-wider rounded-[6px] hover:shadow-md hover:shadow-primary/25 active:scale-[0.98] transition-all cursor-pointer'
const SECUNDARIO =
  'px-4 py-2 bg-surface-1 dark:bg-[#0e1015]  text-text-main font-bold text-[11px] uppercase tracking-wider rounded-[6px] hover:border-primary/50 active:scale-[0.98] transition-all cursor-pointer'
