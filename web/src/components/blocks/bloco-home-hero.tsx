'use client'

import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { congelado } from '@/lib/e2e'
import type { Locale } from '@/lib/locales'
import type { BlocoHomeHero } from '@/types/content'

import { CampoDeParticulas } from './campo-de-particulas'
import { PromptDaIa } from './prompt-da-ia'

/* Herói da home — porte de `legacy/src/components/aether-flow-hero.tsx:438`.
 *
 * Tela cheia com campo de partículas atrás, título com uma palavra laranja que
 * troca a cada 2,5s, e um botão que rola a página até o fim da seção.
 *
 * A caixa de conversa com a IA renderiza **dentro** deste container, sobre o
 * mesmo canvas — no legado ela é `children` de `AetherFlowHero` (`App.tsx:2548`).
 * Ver a nota do campo `prompt` em `blocks/index.ts`. */
/* ⚠️ Toda cor de texto aqui carrega o par claro/escuro, e a versão escura é a
 * que o gabarito compara — por isso ela vem depois, no `dark:`, com o valor
 * exato de antes. O herói ficava **branco sobre fundo branco** no tema claro: o
 * título sumia por completo, e o protótipo tem o mesmo defeito. O aceite visual
 * nunca pegou porque captura só no escuro. Ver `e2e/contraste.spec.ts`.
 */
export function BlocoHomeHero({ bloco, locale }: { bloco: BlocoHomeHero; locale: Locale }) {
  const [indice, setIndice] = useState(0)
  const secaoRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (congelado()) return
    const t = setInterval(() => setIndice((i) => (i + 1) % bloco.rotatingWords.length), 2500)
    return () => clearInterval(t)
  }, [bloco.rotatingWords.length])

  const rolar = () => {
    const el = secaoRef.current
    if (!el) return
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().bottom, behavior: 'smooth' })
  }

  const palavra = bloco.rotatingWords[indice] ?? ''

  return (
    <div className="relative w-full overflow-hidden transition-colors duration-500 text-slate-900 dark:text-white">
      <CampoDeParticulas />

      <section
        ref={secaoRef}
        id={bloco.anchor ?? undefined}
        className="relative z-10 w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 md:px-8 max-w-7xl mx-auto text-center"
      >
        <div className="flex flex-col items-center max-w-5xl mx-auto space-y-5 sm:space-y-6 md:space-y-8">
          <div className="w-full">
            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-snug sm:leading-tight select-none text-center text-slate-900 dark:text-white">
              <span>{bloco.titlePrefix} </span>
              {/* `min-h-[1.2em]` e `align-top` seguram a altura da linha enquanto
                  a palavra troca: sem eles o título pula meio caractere a cada
                  2,5s, e no gabarito a captura pegaria alturas diferentes. */}
              <span className="inline-block relative min-h-[1.2em] align-top text-secondary">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={palavra}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-secondary"
                  >
                    {palavra}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </div>

          {bloco.description && (
            <div className="max-w-2xl px-2">
              <p className="text-sm sm:text-lg md:text-xl font-light leading-relaxed text-slate-600 dark:text-gray-300">
                {bloco.description}
              </p>
            </div>
          )}

          {bloco.scrollLabel && (
            <div className="pt-2 sm:pt-4 flex justify-center w-full">
              <button
                type="button"
                onClick={rolar}
                className="group flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C98FA] rounded-[6px] p-2.5 sm:p-3 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                aria-label={bloco.scrollLabel}
              >
                <span className="text-xs sm:text-base font-medium tracking-wide select-none">
                  {bloco.scrollLabel}
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronDown size={22} className="transition-transform group-hover:scale-110" aria-hidden />
                </motion.div>
              </button>
            </div>
          )}
        </div>
      </section>

      {bloco.prompt && <PromptDaIa prompt={bloco.prompt} clientes={bloco.clientes} locale={locale} />}
    </div>
  )
}
