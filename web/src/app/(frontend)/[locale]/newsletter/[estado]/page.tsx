import type { Metadata } from 'next'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { StatusBadge } from '@/components/ui'
import { isLocale } from '@/lib/locales'

/* MIG-103 — onde o link de confirmação da newsletter aterrissa.
 *
 * Dois estados, uma rota: `confirmada` e `invalida`. Página nova, fora do
 * gate visual (não existe no protótipo) e fora do índice — ninguém busca
 * "newsletter confirmada", e indexada ela viraria resultado órfão.
 *
 * ⚠️ Sem `generateStaticParams`: os dois estados são poucos, mas a página
 * precisa existir mesmo se o build não a materializar — quem chega aqui veio
 * de um clique de e-mail, o pior lugar para um 404.
 */

const ESTADOS = {
  confirmada: {
    selo: 'Inscrição confirmada',
    titulo: 'Você está na lista.',
    texto:
      'A partir de agora os insights da ATRA chegam no seu e-mail. Sem spam: quando não fizer mais sentido, todo e-mail traz como sair.',
  },
  invalida: {
    selo: 'Link inválido',
    titulo: 'Este link não confirmou nada.',
    texto:
      'O link pode ter vindo incompleto do seu e-mail. Volte à página inicial e inscreva-se de novo — o e-mail de confirmação chega em seguida.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Newsletter', robots: { index: false, follow: false } }
}

export default async function Pagina({ params }: { params: Promise<{ estado: string }> }) {
  const locale = await getLocale()
  const { estado } = await params
  if (!isLocale(locale) || !(estado in ESTADOS)) notFound()
  const t = ESTADOS[estado as keyof typeof ESTADOS]

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
      <StatusBadge label={t.selo} variant={estado === 'confirmada' ? 'primary' : 'secondary'} />
      <h1 className="text-3xl md:text-4xl font-display font-light text-text-main mt-6 mb-4">
        {t.titulo}
      </h1>
      <p className="text-text-muted font-light mb-10">{t.texto}</p>
      <Link
        href="/"
        className="pill-btn-primary"
      >
        Voltar ao site
      </Link>
    </main>
  )
}
