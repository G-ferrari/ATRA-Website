'use client'

import { useEffect, useState } from 'react'

/* Placeholder da Fase 1: existe para verificar que os tokens do legado
 * responderam e que o tema alterna. A home real é MIG-059. */

/* ⚠️ Classes precisam ser strings literais e completas. O Tailwind varre o
 * código-fonte como texto: `bg-${nome}` nunca é gerado, e o elemento aparece
 * sem estilo, sem erro nenhum. Vale para todo o porte dos componentes. */
const SURFACES = [
  { label: 'surface-1', cls: 'bg-surface-1' },
  { label: 'surface-2', cls: 'bg-surface-2' },
  { label: 'surface-3', cls: 'bg-surface-3' },
]
const TEXTS = [
  { label: 'text-main', cls: 'text-text-main' },
  { label: 'text-muted', cls: 'text-text-muted' },
  { label: 'text-subtle', cls: 'text-text-subtle' },
]
const BRAND = [
  { label: 'primary', cls: 'bg-primary' },
  { label: 'primary-dark', cls: 'bg-primary-dark' },
  { label: 'secondary', cls: 'bg-secondary' },
  { label: 'secondary-dark', cls: 'bg-secondary-dark' },
]

export default function Home() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <main className="flex-1 p-8 sm:p-12 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-display">
          ATRA — <span className="text-gradient font-normal">fundação</span>
        </h1>
        <button onClick={() => setDark((d) => !d)} className="pill-btn-outline">
          {dark ? 'Tema claro' : 'Tema escuro'}
        </button>
      </div>

      <section className="vort-card mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
          Superfícies e texto
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {SURFACES.map((s) => (
            <div key={s.label} className={`${s.cls} p-4 rounded-[6px] text-xs text-text-main`}>
              {s.label}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {TEXTS.map((t) => (
            <p key={t.label} className={`${t.cls} text-sm`}>
              {t.label} — A ATRA cria soluções em software sob medida
            </p>
          ))}
        </div>
      </section>

      <section className="vort-card mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Marca</h2>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {BRAND.map((c) => (
            <div key={c.label} className={`${c.cls} p-4 rounded-[6px] text-[10px] text-white`}>
              {c.label}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="pill-btn-primary">Primário</button>
          <button className="pill-btn-secondary">Secundário</button>
          <button className="pill-btn-outline">Contorno</button>
        </div>
      </section>

      <section className="vort-card">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
          Pesos da Mona Sans
        </h2>
        <div className="space-y-1" id="font-samples">
          {[300, 400, 500, 600, 700, 800, 900].map((w) => (
            <p key={w} style={{ fontWeight: w }} className="text-sm" data-weight={w}>
              {w} — A ATRA cria soluções em software sob medida — 0123456789
            </p>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-4">
          Sem a fonte carregada ainda: cai no fallback do sistema até MIG-009.
        </p>
      </section>
    </main>
  )
}
