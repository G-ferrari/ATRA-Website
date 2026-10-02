'use client'

import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'

import type { Locale } from '@/lib/locales'
import { TEXTOS_CASCA } from '@/lib/navegacao'

import { escolherTema, useTema } from './tema'

/* Alternador de tema — porte de `legacy/src/App.tsx:2643`, com memória desde
 * 02/10 (D-48): o site abre no tema do sistema e, depois que a pessoa troca por
 * aqui, guarda a escolha. No legado ele voltava a escuro a cada carregamento.
 *
 * O tema em si mora em `./tema` — o mesmo que o `<html>` lê. Aqui é só o botão. */

export function ThemeToggle({ locale }: { locale: Locale }) {
  const tema = useTema()

  return (
    <button
      type="button"
      onClick={() => escolherTema(tema === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 md:bottom-12 right-0 z-[100] bg-surface-2 dark:bg-surface-3 text-text-main p-3 pl-4 pr-2.5 rounded-l-[6px] shadow-[-6px_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[-8px_4px_24px_rgba(0,0,0,0.4)] hover:pr-4 transition-all duration-300 group flex items-center justify-center cursor-pointer"
      aria-label={TEXTOS_CASCA[locale].alternarTema}
    >
      <motion.div
        initial={false}
        animate={{ rotate: tema === 'dark' ? 180 : 0, scale: tema === 'dark' ? 0.85 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-center"
      >
        {tema === 'dark' ? (
          <Sun size={22} className="text-amber-400 group-hover:text-amber-300 transition-colors" aria-hidden />
        ) : (
          <Moon size={22} className="text-slate-800 dark:text-sky-300 group-hover:text-primary transition-colors" aria-hidden />
        )}
      </motion.div>
    </button>
  )
}
