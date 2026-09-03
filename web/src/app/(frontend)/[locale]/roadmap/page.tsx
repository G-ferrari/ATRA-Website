import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { StatusBadge } from '@/components/ui'
import { LOCALES, isLocale } from '@/lib/locales'
import { lerRoadmap } from '@/lib/roadmap'

import { Documento } from './documento'
import { Graficos } from './graficos'
import { Painel } from './painel'

/* /roadmap — o estado da migração, lido da própria especificação.
 *
 * Página **interna e não linkada**: só chega aqui quem digita a URL. O
 * `noindex` abaixo é o que a mantém fora do Google (mesmo contrato do
 * `/design-system`), e nenhum menu, rodapé ou sitemap aponta para cá — não
 * adicionar em `lib/routes.ts` nem em navegação é parte do requisito.
 *
 * Tudo vem de `docs/` via `lib/roadmap.ts`, parseado na pré-renderização:
 * backlog (previsto vs realizado), decisões, pendências e os documentos
 * completos. Task nova no backlog aparece aqui sozinha no build seguinte —
 * não existe segunda contagem para envelhecer.
 */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Roadmap da migração',
    robots: { index: false, follow: false },
  }
}

const GRUPOS: Record<string, string> = {
  raiz: 'Visão geral',
  '00-contexto': 'Contexto — decisões e pendências',
  '01-descoberta': 'Descoberta — inventários do site atual',
  '02-especificacao': 'Especificação',
  '03-plano': 'Plano — roadmap, backlog e testes',
  '04-infra': 'Infraestrutura — deploy, backup e cutover',
  '05-operacao': 'Operação — guia do editor',
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const { atualizadoEm, fases, decisoes, pendencias, documentos, esforco } = lerRoadmap()

  const todas = fases.flatMap((f) => f.tasks)
  const contaveis = todas.filter((t) => t.status !== 'cancelada')
  const feitas = contaveis.filter((t) => t.status === 'done')
  const pct = contaveis.length ? Math.round((feitas.length / contaveis.length) * 100) : 0
  const pendentesAbertas = pendencias.filter((p) => p.status === 'aberta')

  /* A tabela de totais do backlog tem os nomes curtos das fases, na mesma
   * ordem das seções — é o rótulo que cabe no eixo do gráfico. */
  const progresso = fases.map((f, i) => {
    const doGrafico = f.tasks.filter((t) => t.status !== 'cancelada')
    const prontas = doGrafico.filter((t) => t.status === 'done').length
    return {
      fase: esforco[i]?.fase ?? f.nome.replace(/^Fase /, ''),
      feitas: prontas,
      restantes: doGrafico.length - prontas,
    }
  })

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <header className="mb-14">
        <StatusBadge label="Interno · noindex" variant="secondary" size="sm" />
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-main mt-4 mb-3">
          Roadmap da migração
        </h1>
        <p className="text-text-muted font-light max-w-2xl">
          O previsto e o realizado da migração de <code className="text-sm">atra.com.br</code> para
          Next.js + Payload, lidos direto da especificação em <code className="text-sm">docs/</code> a
          cada build — não há segunda contagem para desatualizar.
          {atualizadoEm && <> Backlog atualizado em {atualizadoEm}.</>}
        </p>
      </header>

      {fases.length === 0 ? (
        <p className="text-text-muted text-sm">
          ⚠ Documentação indisponível nesta renderização — <code>docs/</code> não está montada. Ver o
          comentário em <code>lib/roadmap.ts</code>.
        </p>
      ) : (
        <>
          {/* ── resumo ────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { valor: `${pct}%`, rotulo: 'do backlog concluído' },
                { valor: `${feitas.length}/${contaveis.length}`, rotulo: 'tasks feitas' },
                { valor: String(decisoes.length), rotulo: 'decisões registradas' },
                { valor: String(pendentesAbertas.length), rotulo: 'pendências abertas' },
              ].map((n) => (
                <div key={n.rotulo} className="vort-card dark:vort-card-dark !p-5">
                  <p className="text-3xl font-display font-light text-text-main tabular-nums">{n.valor}</p>
                  <p className="text-xs text-text-muted mt-1">{n.rotulo}</p>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-surface-3 overflow-hidden mb-6" aria-hidden>
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <Graficos progresso={progresso} esforco={esforco} />
          </section>

          {/* ── previsto vs realizado ─────────────────────────────────── */}
          <section className="mb-20">
            <h2 className="text-xl font-display text-text-main mb-6">Previsto vs realizado</h2>
            <Painel fases={fases} />
          </section>

          {/* ── decisões ──────────────────────────────────────────────── */}
          <section className="mb-20">
            <h2 className="text-xl font-display text-text-main mb-2">Decisões</h2>
            <p className="text-sm text-text-muted font-light mb-6">
              Toda decisão da migração vive em <code>docs/00-contexto/decisoes.md</code>. O registro
              completo, com contexto e consequência, está na seção de documentos abaixo.
            </p>
            <div className="space-y-2">
              {decisoes.map((d) => (
                <details
                  key={d.id}
                  className="group rounded-[6px] border border-border-main bg-surface-2 open:shadow-md"
                >
                  <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-baseline gap-3 hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
                    <span className="text-text-muted text-xs shrink-0 transition-transform group-open:rotate-90" aria-hidden>
                      ›
                    </span>
                    <span className="text-xs font-mono text-primary shrink-0">{d.id}</span>
                    <span className="text-sm text-text-main">{d.titulo}</span>
                  </summary>
                  <div className="px-4 sm:px-6 pb-5 border-t border-border-main pt-3">
                    <Documento md={d.corpo} />
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── pendências ────────────────────────────────────────────── */}
          <section className="mb-20">
            <h2 className="text-xl font-display text-text-main mb-2">Pendências</h2>
            <p className="text-sm text-text-muted font-light mb-6">
              O que depende de decisão — da ATRA ou do projeto — para andar. Abertas primeiro.
            </p>
            <div className="space-y-2">
              {[...pendentesAbertas, ...pendencias.filter((p) => p.status === 'resolvida')].map((p) => (
                <details
                  key={p.id}
                  className="group rounded-[6px] border border-border-main bg-surface-2 open:shadow-md"
                >
                  <summary className="cursor-pointer select-none list-none px-4 py-3 flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-3 shrink-0 sm:w-40">
                      <span className="text-text-muted text-xs transition-transform group-open:rotate-90" aria-hidden>
                        ›
                      </span>
                      <StatusBadge
                        label={p.status}
                        variant={p.status === 'aberta' ? 'secondary' : 'online'}
                        size="sm"
                      />
                      <span className="text-xs font-mono text-text-muted">{p.id}</span>
                    </span>
                    <span className="text-sm text-text-main min-w-0">{p.pergunta}</span>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 border-t border-border-main pt-3 space-y-2">
                    {p.referencia && (
                      <p className="text-xs text-text-muted">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Afeta</span>{' '}
                        <span className="font-mono">{p.referencia}</span>
                      </p>
                    )}
                    {p.nota && <p className="text-sm text-text-subtle font-light">{p.nota}</p>}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── documentação completa ─────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-display text-text-main mb-2">Documentação</h2>
            <p className="text-sm text-text-muted font-light mb-8">
              A especificação completa do projeto, arquivo a arquivo. Clique para expandir.
            </p>
            <div className="space-y-10">
              {Object.entries(GRUPOS).map(([grupo, titulo]) => {
                const doGrupo = documentos.filter((d) => d.grupo === grupo)
                if (doGrupo.length === 0) return null
                return (
                  <div key={grupo}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                      {titulo}
                    </h3>
                    <div className="space-y-2">
                      {doGrupo.map((d) => (
                        <details
                          key={d.nome}
                          className="group rounded-[6px] border border-border-main bg-surface-2 open:shadow-md"
                        >
                          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-mono text-text-main marker:text-text-muted hover:text-primary transition-colors">
                            {d.nome}
                          </summary>
                          <div className="px-4 sm:px-6 pb-6 border-t border-border-main pt-4">
                            <Documento md={d.conteudo} />
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
