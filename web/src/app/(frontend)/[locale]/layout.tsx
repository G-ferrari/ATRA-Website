import type { Metadata } from 'next'
import { Mona_Sans } from 'next/font/google'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { LOCALES, isLocale } from '@/lib/locales'
import '../globals.css'

/* D-16: Mona Sans pela MESMA build que o legado consome.
 *
 * next/font/google baixa em tempo de build e serve do nosso domínio: métrica
 * idêntica à do legado, sem requisição do visitante ao Google (LGPD) e sem DNS
 * extra no carregamento.
 *
 * Não trocar por next/font/local com a build do GitHub: medido, ela é de 1,4% a
 * 2,3% mais estreita, o que estouraria o limite de 0,1% da regressão visual em
 * toda captura com texto.
 *
 * ⚠️ Não adicionar `axes: ['wdth']`. O site não usa largura condensada nem
 * expandida, e pedir o eixo faz o Google servir um corte diferente: os pesos
 * romanos continuam batendo, mas o itálico fica 3,2% mais largo que o do legado.
 * Sem o eixo, os 8 pesos e o itálico batem em 0,0000%. */
const monaSans = Mona_Sans({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mona-sans',
})

export const metadata: Metadata = {
  title: { default: 'ATRA', template: '%s | ATRA' },
  description: 'Consultoria de Dados e IA.',
}

/* Pré-renderiza os dois idiomas. O proxy reescreve a raiz para /pt, então
 * este é o layout raiz de fato do site público. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  // next/root-params (Next 16): dá o locale em qualquer Server Component,
  // sem passar por props até o fim da árvore.
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  return (
    /* `dark` no servidor: o legado inicia no tema escuro (App.tsx:2571) e a
     * regressão visual compara os dois. Aplicar por efeito no cliente causaria
     * flash de tema claro na primeira pintura. O alternador entra com a casca
     * do site (MIG-057). */
    <html
      lang={locale === 'pt' ? 'pt-BR' : 'en'}
      className={`${monaSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
