import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { lerContato } from '@/lib/contato'
import { lerConviteDeLead } from '@/lib/convite-de-lead'
import { isLocale, LOCALES } from '@/lib/locales'

import { Conversa } from './conversa'

/* /chat (MIG-061) — a ATRA AI.
 *
 * ⚠️ `noindex`: é ferramenta de conversa, não conteúdo. O legado não põe meta
 * nenhuma porque é SPA; indexar uma tela de chat vazia gasta orçamento de
 * rastreio e não serve a ninguém.
 *
 * A primeira pergunta pode vir da caixa de conversa da home, por `?q=`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/* ⚠️ Fora do índice de propósito, e não por ser página magra: `/chat` é uma
 * ferramenta, não conteúdo. Indexá-la traria gente da busca para uma conversa
 * sem contexto — e cada visita custa cota da API (D-12).
 *
 * Sem `metadataDe`: o helper monta canônica e hreflang, que só fazem sentido
 * para página que se quer encontrada. */
export const metadata: Metadata = {
  title: 'Converse com a ATRA',
  robots: { index: false, follow: true },
}

export default async function Pagina({ searchParams }: PageProps<'/[locale]/chat'>) {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const { q } = await searchParams
  const inicial = typeof q === 'string' ? q : undefined

  /* MIG-150 — resolvido aqui e injetado pronto (regra 4). `null` enquanto
     qualquer chave estiver fechada (env, toggle, consentimento), e aí a ilha
     desenha exatamente o que desenhava antes da feature. */
  const convite = await lerConviteDeLead(locale)

  /* O cartão de [UI_CONTACT] aponta para o WhatsApp do global `contact` — o
     legado hardcoda o número no componente (`ChatGenerativeUI.tsx:37`), e
     conteúdo mora no CMS. `lerContato` é cacheado por requisição. */
  const { whatsapp } = await lerContato()

  return (
    /* ⚠️ Sem `min-h-screen` e sem fundo. A casca do site já é uma coluna
       `min-h-screen` cujo filho é `flex-1 min-h-0`; repetir a altura aqui faz a
       página passar da viewport e nascer com barra de rolagem, e os 15px da
       barra deslocam **tudo** — no aceite visual foram 40% dos pixels. O
       gabarito não tem `<main>` nesta rota: a página é o próprio filho flex. */
    <main className="flex-1 flex flex-col min-h-0">
      <Conversa mensagemInicial={inicial} locale={locale} convite={convite} whatsapp={whatsapp} />
    </main>
  )
}
