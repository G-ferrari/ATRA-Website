import { Compass, Home, Search } from 'lucide-react'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'

import { isLocale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'

/* Página 404 (MIG-062).
 *
 * ⚠️ Não é porte: o legado **responde 200 em rota inexistente**, servindo a home
 * no lugar (debito-tecnico.md). Isso faz o Google indexar URLs quebradas como se
 * fossem páginas boas — parte do que a migração conserta.
 *
 * Os atalhos são as rotas que já existem. Cresce com a Fase 3. */

const TEXTOS = {
  pt: {
    titulo: 'Esta página não existe',
    texto:
      'O endereço pode ter mudado, ou o link que trouxe você até aqui pode estar desatualizado. Abaixo estão os caminhos mais usados.',
    home: 'Ir para a home',
    atalhos: 'Ou vá direto para:',
    cases: 'Cases de sucesso',
    blog: 'Blog',
    glossario: 'Glossário',
    sobre: 'Sobre a ATRA',
  },
  en: {
    titulo: 'This page does not exist',
    texto:
      'The address may have changed, or the link that brought you here may be out of date. Below are the most used paths.',
    home: 'Go to the home page',
    atalhos: 'Or go straight to:',
    cases: 'Success stories',
    blog: 'Blog',
    glossario: 'Glossary',
    sobre: 'About ATRA',
  },
} as const

export default async function NaoEncontrada() {
  const bruto = await getLocale()
  const locale = isLocale(bruto) ? bruto : 'pt'
  const t = TEXTOS[locale]

  const atalhos = [
    { href: hrefDe('cases', locale), label: t.cases },
    { href: hrefDe('blog', locale), label: t.blog },
    { href: hrefDe('glossario', locale), label: t.glossario },
    { href: hrefDe('sobre', locale), label: t.sobre },
  ]

  return (
    <main className="pt-32 md:pt-44 pb-24 min-h-screen bg-surface-1 text-text-main">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
        <div className="w-16 h-16 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8">
          <Compass size={32} aria-hidden />
        </div>

        <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3">404</p>
        <h1 className="text-3xl md:text-5xl font-bold font-display mb-4 leading-tight">{t.titulo}</h1>
        <p className="text-sm md:text-base text-text-muted font-light leading-relaxed mb-10">{t.texto}</p>

        <Link
          href={locale === 'pt' ? '/' : `/${locale}`}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-[6px] font-bold text-sm transition-all shadow-md shadow-primary/20"
        >
          <Home size={16} aria-hidden /> {t.home}
        </Link>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Search size={12} aria-hidden /> {t.atalhos}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {atalhos.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="px-3 py-1 rounded-[4px] text-xs font-medium bg-surface-2 text-text-muted hover:text-text-main  hover:bg-surface-3 transition-all"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
