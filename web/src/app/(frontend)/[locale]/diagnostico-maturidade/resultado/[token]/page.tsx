import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'
import { connection } from 'next/server'

import { lerDiagnosticoDeMaturidade } from '@/lib/diagnostico'
import { conteudoDoResultado, montarRoadmap } from '@/lib/diagnostico-maturidade'
import { textosDaTela } from '@/lib/diagnostico-maturidade/tela'
import { DEFAULT_LOCALE, isLocale } from '@/lib/locales'
import { lerResultadoPeloToken } from '@/lib/resultado-do-diagnostico'

/* /diagnostico-maturidade/resultado/<token> (28/10) — a leitura completa do
 * diagnóstico de um lead: o destino do botão "Ver o diagnóstico completo" do
 * e-mail que a automação do RD manda. As mesmas seções, na mesma ordem e com os
 * mesmos textos do e-mail do resultado (`conteudoDoResultado`), no idioma da
 * rota.
 *
 * ⚠️ Página de dado pessoal sem login: o token de 256 bits **é** a senha
 * (`link-do-resultado.ts`). Daí:
 *
 *  - `noindex, nofollow` e nenhum link para cá no site, no sitemap ou no
 *    `hreflang`: só chega quem recebeu o link;
 *  - `connection()`: renderizada a cada visita, nunca guardada no cache do Next.
 *    Um resultado guardado continuaria no ar depois de o lead ser apagado do
 *    admin (direito de exclusão da LGPD);
 *  - `referrer: no-referrer`: clicar no WhatsApp daqui não entrega o endereço
 *    (com o token) a terceiros;
 *  - token inválido, inexistente ou de lead sem resultado dão o mesmo 404;
 *  - só o primeiro nome aparece — nada de e-mail, telefone ou empresa. */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : DEFAULT_LOCALE
  return {
    title: textosDaTela(idioma).marca,
    robots: { index: false, follow: false, nocache: true },
    referrer: 'no-referrer',
  }
}

const TITULO_DA_SECAO = 'mb-3 mt-8 text-base font-semibold text-text-main'

/* A cor da borda de cada fase, a mesma do e-mail (`COR_DA_FASE`). */
const BORDA_DA_FASE = { f1: 'border-primary', f2: 'border-primary-dark', f3: 'border-secondary' } as const

/* Etiqueta laranja do e-mail: no claro, o `laranjaTinta` (#8A5200) sobre creme;
   no escuro, o laranja da marca sobre o grafite. */
const ETIQUETA = 'inline-block rounded-[4px] bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-[#8A5200] dark:text-secondary'

export default async function Pagina({ params }: PageProps<'/[locale]/diagnostico-maturidade/resultado/[token]'>) {
  await connection()
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()
  const { token } = await params

  const lead = await lerResultadoPeloToken(token)
  if (!lead) notFound()

  const textos = await lerDiagnosticoDeMaturidade(locale)
  const c = conteudoDoResultado({
    nome: lead.primeiroNome,
    setor: lead.setor,
    porte: lead.porte,
    calculo: lead.calculo,
    roadmap: montarRoadmap(lead.calculo, locale),
    textos,
    idioma: locale,
    whatsappUrl: textos.whatsappUrl,
    agendaUrl: textos.agendaUrl,
  })
  const { titulos } = c.fixos

  return (
    <main className="relative overflow-x-clip pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
        />
        <article className="relative rounded-[12px] bg-surface-2 px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-secondary-dark dark:text-secondary">
            {c.fixos.nomeDoDiagnostico}
          </p>
          <p className="mt-3 text-text-muted">{c.saudacao}</p>

          <section aria-labelledby="resultado" className="mt-6 rounded-[8px] bg-surface-1 p-5">
            <h2 id="resultado" className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark dark:text-primary">
              {titulos.resultado}
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-full border-[3px] border-primary text-2xl font-bold text-text-main">
                {c.media}
              </span>
              <div>
                <h1 className="text-xl font-semibold text-text-main">{c.nivel}</h1>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{c.leitura}</p>
              </div>
            </div>
          </section>

          <h2 className={TITULO_DA_SECAO}>{titulos.impactos}</h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {c.impactos.map((i) => (
              <span key={i} className={ETIQUETA}>
                {i}
              </span>
            ))}
            <span className="ml-1 text-xs font-medium text-text-muted">{c.fixos.entreOutros}</span>
          </div>

          <h2 className={TITULO_DA_SECAO}>{titulos.pilares}</h2>
          <ul className="space-y-3">
            {c.pilares.map((p) => (
              <li key={p.pilar} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-sm">
                <span className="font-semibold text-text-main">{p.pilar}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-text-muted/20" aria-hidden>
                  <span className="block h-full rounded-full" style={{ width: `${p.largura}%`, backgroundColor: p.cor }} />
                </span>
                <span className="text-right font-bold text-text-main">{p.nota}</span>
              </li>
            ))}
          </ul>

          {c.emJogo.length > 0 && (
            <>
              <h2 className={TITULO_DA_SECAO}>{titulos.emJogo}</h2>
              <ul className="space-y-2">
                {c.emJogo.map((x) => (
                  <li key={x.pilar} className="rounded-[6px] bg-surface-1 px-4 py-3 text-sm">
                    <p className="font-semibold text-[#8A5200] dark:text-secondary">{x.pilar}</p>
                    <p className="mt-1 leading-relaxed text-text-muted">{x.emJogo}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {c.regulacoes.length > 0 && (
            <>
              <h2 className={TITULO_DA_SECAO}>{titulos.regulacoes}</h2>
              <div className="flex flex-wrap gap-1.5">
                {c.regulacoes.map((r) => (
                  <span key={r.titulo} className={ETIQUETA}>
                    {r.titulo}
                  </span>
                ))}
              </div>
            </>
          )}

          <h2 className={TITULO_DA_SECAO}>{titulos.roadmap}</h2>
          <ol className="space-y-2.5">
            {c.fases.map((f) => (
              <li key={f.fase} className={`border-l-4 bg-surface-1 px-4 py-3.5 ${BORDA_DA_FASE[f.classe]}`}>
                <p className="text-xs font-bold uppercase tracking-[0.06em] text-primary-dark dark:text-primary">{f.fase}</p>
                <p className="mt-0.5 text-xs text-text-muted">{f.prazo}</p>
                {f.itens.map((i) => (
                  <div key={i.titulo} className="mt-2.5 text-sm">
                    <p className="font-semibold text-text-main">{i.titulo}</p>
                    <p className="mt-0.5 leading-relaxed text-text-muted">{i.descricao}</p>
                  </div>
                ))}
              </li>
            ))}
          </ol>

          {c.acoes.length > 0 && (
            <>
              <h2 className={TITULO_DA_SECAO}>{titulos.acoes}</h2>
              <ul className="space-y-2">
                {c.acoes.map((r) => (
                  <li key={r.titulo} className="rounded-[6px] bg-surface-1 px-4 py-3 text-sm">
                    <p className="font-semibold text-[#8A5200] dark:text-secondary">{r.titulo}</p>
                    <p className="mt-1 leading-relaxed text-text-muted">{r.descricao}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-8 border-t border-dashed border-text-muted/30 pt-4 text-xs leading-relaxed text-text-muted">
            {c.fixos.nota}
          </p>

          {c.botoes.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {c.botoes.map((b, i) => (
                <a
                  key={b.url}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={i === 0 ? 'pill-btn-primary min-h-11' : 'pill-btn-outline min-h-11'}
                >
                  {b.rotulo}
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
