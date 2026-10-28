import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { lerDiagnosticoDeMaturidade } from '@/lib/diagnostico'
import { ehSetor } from '@/lib/diagnostico-maturidade'
import { textosDaTela } from '@/lib/diagnostico-maturidade/tela'
import { DEFAULT_LOCALE, isLocale, LOCALES } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'

import { Questionario } from './questionario'

/* /diagnostico-maturidade (feature diagnostico-maturidade-dados, tasks 026 e
 * 027) — o questionário de maturidade de dados do Roger, que substitui o RC18
 * Quick Check (D-35): perfil, perguntas, contato e conclusão. O resultado não
 * aparece aqui; vai por e-mail.
 *
 * ⚠️ `noindex`, como `/chat`: é ferramenta de conversão, não conteúdo. Quem
 * chega vem de um CTA — das páginas de segmento, de normativa ou da RC18 —,
 * quase sempre com `?setor=` no link. O endereço do diagnóstico antigo também
 * cai aqui, já com `?setor=financeiro` (`ROTAS_APOSENTADAS`, em
 * `lib/redirects.ts`).
 *
 * A rota EN (`/en/data-maturity-assessment`) é o questionário em inglês desde
 * a D-76 (28/10): textos fixos, perguntas e e-mail do resultado. O global é
 * lido no idioma da rota, e o inglês que ninguém escreveu no admin sai do
 * padrão inglês do mapper, nunca do português. Até ali a rota servia o
 * português, com `lang="pt-BR"` no `<main>`. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : DEFAULT_LOCALE
  const { titulo } = await lerDiagnosticoDeMaturidade(idioma)
  /* Sem `metadataDe`: canônica e hreflang são para página que se quer
     encontrada (o mesmo argumento de `/chat`). A descrição fica para a prévia
     de quem compartilha o link. */
  return {
    title: textosDaTela(idioma).marca,
    description: titulo,
    robots: { index: false, follow: true },
  }
}

export default async function Pagina({ searchParams }: PageProps<'/[locale]/diagnostico-maturidade'>) {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  /* ⚠️ O setor é lido **aqui**, no servidor, e isso torna a rota dinâmica
   * (`searchParams` é API de requisição no Next 16 — ver `page.md`). Escolha
   * consciente, a mesma de `/chat`:
   *
   *  - quase todo acesso chega com `?setor=`, e lido no cliente
   *    (`useSearchParams` + `<Suspense>`) o HTML estático sairia sem setor: a
   *    pessoa via "Selecione…", e um instante depois o setor e a linha de
   *    impactos entravam empurrando o formulário para baixo;
   *  - lido aqui, o HTML já nasce com o setor escolhido e os impactos certos —
   *    o critério de aceite se prova com `curl`, sem navegador;
   *  - o preço é renderizar por requisição (o layout e um global), numa página
   *    de conversão de tráfego baixo. Publicar o global não precisa de
   *    revalidação: cada visita já lê o valor atual.
   *
   * Setor fora dos oito códigos (ou repetido, que vira lista) é ignorado: o
   * perfil abre sem seleção. */
  const { setor } = await searchParams
  const setorInicial = ehSetor(setor) ? setor : null

  const { titulo, abertura, conclusao, whatsappUrl, agendaUrl, regulacoes } = await lerDiagnosticoDeMaturidade(locale)

  return (
    <main className="relative overflow-x-clip pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        {/* Os dois brilhos do HTML do Roger (azul em cima, laranja embaixo),
            na intensidade do banner do carrossel de destaques: a "corrente
            azul→laranja" da marca em baixa opacidade, atrás do cartão. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/15"
        />
        {/* A política no idioma da rota: é página do site, e existe nos dois. */}
        <Questionario
          idioma={locale}
          textos={{ titulo, abertura, conclusao, whatsappUrl, agendaUrl, regulacoes }}
          setorInicial={setorInicial}
          privacidadeHref={hrefDe('politicas', locale)}
        />
      </div>
    </main>
  )
}
