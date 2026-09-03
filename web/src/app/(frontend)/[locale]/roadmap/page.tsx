import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { StatusBadge } from '@/components/ui'
import { LOCALES, isLocale } from '@/lib/locales'
import { lerRoadmap } from '@/lib/roadmap'

import { Documento } from './documento'
import { Graficos } from './graficos'
import { Painel } from './painel'

/* /roadmap — o painel executivo da migração, lido da própria especificação.
 *
 * Página **interna e não linkada**: só chega aqui quem digita a URL. O
 * `noindex` abaixo é o que a mantém fora do Google (mesmo contrato do
 * `/design-system`), e nenhum menu, rodapé ou sitemap aponta para cá — não
 * adicionar em `lib/routes.ts` nem em navegação é parte do requisito.
 *
 * Tudo vem de `docs/` via `lib/roadmap.ts`, parseado na pré-renderização:
 * backlog, horas, riscos, caminho crítico, checklist de cutover, decisões,
 * pendências e os documentos completos. Nenhum número é digitado aqui — não
 * existe segunda contagem para envelhecer.
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

const SECOES = [
  { id: 'indicadores', rotulo: 'Indicadores' },
  { id: 'fases', rotulo: 'Fases e tasks' },
  { id: 'riscos', rotulo: 'Riscos' },
  { id: 'cutover', rotulo: 'Cutover' },
  { id: 'decisoes', rotulo: 'Decisões' },
  { id: 'pendencias', rotulo: 'Pendências' },
  { id: 'documentacao', rotulo: 'Documentação' },
]

/** Anel de progresso — SVG puro, sem biblioteca: um círculo com dasharray. */
function Anel({ pct }: { pct: number }) {
  const raio = 26
  const perimetro = 2 * Math.PI * raio
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden className="shrink-0 -rotate-90">
      <circle cx="32" cy="32" r={raio} fill="none" strokeWidth="6" className="stroke-surface-3" />
      <circle
        cx="32"
        cy="32"
        r={raio}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-primary"
        strokeDasharray={`${(pct / 100) * perimetro} ${perimetro}`}
      />
    </svg>
  )
}

function Kpi({ valor, rotulo, contexto }: { valor: string; rotulo: string; contexto?: string }) {
  return (
    <div className="vort-card dark:vort-card-dark !p-5">
      <p className="text-3xl font-display font-light text-text-main tabular-nums">{valor}</p>
      <p className="text-xs font-semibold text-text-subtle mt-1">{rotulo}</p>
      {contexto && <p className="text-[11px] text-text-muted font-light mt-0.5">{contexto}</p>}
    </div>
  )
}

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const { atualizadoEm, fases, decisoes, pendencias, documentos, esforco, riscos, caminhoCritico, cutover } =
    lerRoadmap()

  const todas = fases.flatMap((f) => f.tasks)
  const contaveis = todas.filter((t) => t.status !== 'cancelada')
  const feitas = contaveis.filter((t) => t.status === 'done')
  const pct = contaveis.length ? Math.round((feitas.length / contaveis.length) * 100) : 0

  const horasTotais = contaveis.reduce((s, t) => s + t.horas, 0)
  const horasFeitas = feitas.reduce((s, t) => s + t.horas, 0)
  const pctHoras = horasTotais ? Math.round((horasFeitas / horasTotais) * 100) : 0

  /* A tabela de totais do backlog tem os nomes curtos das fases, na mesma
   * ordem das seções — é o rótulo que cabe no eixo dos gráficos e nos marcos. */
  const porFase = fases.map((f, i) => {
    const doGrafico = f.tasks.filter((t) => t.status !== 'cancelada')
    const prontas = doGrafico.filter((t) => t.status === 'done')
    return {
      nomeCurto: esforco[i]?.fase ?? f.nome.replace(/^Fase /, ''),
      tasks: { feitas: prontas.length, restantes: doGrafico.length - prontas.length },
      horas: {
        feitas: prontas.reduce((s, t) => s + t.horas, 0),
        restantes: doGrafico.reduce((s, t) => s + t.horas, 0) - prontas.reduce((s, t) => s + t.horas, 0),
      },
    }
  })
  const fasesConcluidas = porFase.filter((f) => f.tasks.restantes === 0 && f.tasks.feitas > 0)

  const pendentesAbertas = pendencias.filter((p) => p.status === 'aberta')
  const riscosAtivos = riscos.filter((r) => !r.mitigado)
  const cutoverFeitos = cutover.filter((i) => i.feito)

  const PROBABILIDADE: Record<string, 'secondary' | 'beta' | 'neutral'> = {
    alta: 'secondary',
    média: 'beta',
    baixa: 'neutral',
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <header className="mb-10">
        <StatusBadge label="Interno · noindex" variant="secondary" size="sm" />
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-main mt-4 mb-3">
          Roadmap da migração
        </h1>
        <p className="text-text-muted font-light max-w-2xl">
          O painel de acompanhamento da migração de <code className="text-sm">atra.com.br</code> para
          Next.js + Payload. Todo número desta página é parseado de{' '}
          <code className="text-sm">docs/</code> a cada build — não há segunda contagem para
          desatualizar.{atualizadoEm && <> Backlog atualizado em {atualizadoEm}.</>}
        </p>
      </header>

      {fases.length === 0 ? (
        <p className="text-text-muted text-sm">
          ⚠ Documentação indisponível nesta renderização — <code>docs/</code> não está montada. Ver o
          comentário em <code>lib/roadmap.ts</code>.
        </p>
      ) : (
        <>
          {/* ── navegação da página ───────────────────────────────────── */}
          <nav
            aria-label="Seções desta página"
            className="flex flex-wrap gap-x-5 gap-y-2 mb-12 pb-4 border-b border-border-main text-xs font-semibold uppercase tracking-wider"
          >
            {SECOES.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-text-muted hover:text-primary transition-colors">
                {s.rotulo}
              </a>
            ))}
          </nav>

          {/* ── indicadores ───────────────────────────────────────────── */}
          <section id="indicadores" className="mb-16 scroll-mt-28">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="vort-card dark:vort-card-dark !p-5 flex items-center gap-4 sm:col-span-2">
                <div className="relative">
                  <Anel pct={pct} />
                  <span className="absolute inset-0 grid place-items-center text-sm font-bold text-text-main tabular-nums">
                    {pct}%
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-subtle">Progresso do backlog</p>
                  <p className="text-2xl font-display font-light text-text-main tabular-nums">
                    {feitas.length}/{contaveis.length} <span className="text-sm">tasks</span>
                  </p>
                  <p className="text-[11px] text-text-muted font-light">
                    {pctHoras}% do esforço em horas · ~{Math.round(horasTotais - horasFeitas)}h restantes
                  </p>
                </div>
              </div>
              <Kpi
                valor={`${fasesConcluidas.length}/${porFase.length}`}
                rotulo="fases concluídas"
                contexto={`em execução: ${porFase
                  .filter((f) => f.tasks.feitas > 0 && f.tasks.restantes > 0)
                  .map((f) => f.nomeCurto.split(' ')[0])
                  .join(', ') || 'nenhuma'}`}
              />
              <Kpi
                valor={`${cutoverFeitos.length}/${cutover.length}`}
                rotulo="pré-requisitos de cutover"
                contexto="assinatura manual do runbook"
              />
              <Kpi
                valor={String(pendentesAbertas.length)}
                rotulo="pendências abertas"
                contexto={`de ${pendencias.length} mapeadas`}
              />
              <Kpi
                valor={String(riscosAtivos.length)}
                rotulo="riscos ativos"
                contexto={`${riscos.length - riscosAtivos.length} mitigado(s) de ${riscos.length}`}
              />
              <Kpi valor={String(decisoes.length)} rotulo="decisões registradas" contexto="D-07 a D-30" />
              <Kpi
                valor={`~${Math.round(horasTotais)}h`}
                rotulo="esforço total estimado"
                contexto={`~${Math.round(horasFeitas)}h realizadas`}
              />
            </div>

            {/* marcos: uma fase por célula, com estado */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-6">
              {porFase.map((f) => {
                const estado =
                  f.tasks.restantes === 0 && f.tasks.feitas > 0
                    ? 'concluída'
                    : f.tasks.feitas > 0
                      ? 'em curso'
                      : 'prevista'
                const pctFase = f.tasks.feitas + f.tasks.restantes
                  ? Math.round((f.tasks.feitas / (f.tasks.feitas + f.tasks.restantes)) * 100)
                  : 0
                return (
                  <div
                    key={f.nomeCurto}
                    className="rounded-[6px] border border-border-main bg-surface-2 px-2.5 py-2"
                    title={`${f.nomeCurto}: ${estado}, ${pctFase}%`}
                  >
                    <p className="text-[11px] font-semibold text-text-main truncate">{f.nomeCurto}</p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        estado === 'concluída'
                          ? 'text-emerald-500 dark:text-emerald-400'
                          : estado === 'em curso'
                            ? 'text-primary'
                            : 'text-text-muted'
                      }`}
                    >
                      {estado === 'concluída' ? '✓ concluída' : estado === 'em curso' ? `● ${pctFase}%` : '○ prevista'}
                    </p>
                    <div className="h-0.5 rounded-full bg-surface-3 mt-1.5 overflow-hidden" aria-hidden>
                      <div className="h-full bg-primary" style={{ width: `${pctFase}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <Graficos
              tasks={porFase.map((f) => ({ fase: f.nomeCurto, ...f.tasks }))}
              horas={porFase.map((f) => ({
                fase: f.nomeCurto,
                feitas: Math.round(f.horas.feitas * 4) / 4,
                restantes: Math.round(f.horas.restantes * 4) / 4,
              }))}
            />
          </section>

          {/* ── previsto vs realizado ─────────────────────────────────── */}
          <section id="fases" className="mb-20 scroll-mt-28">
            <h2 className="text-xl font-display text-text-main mb-6">Previsto vs realizado</h2>
            <Painel fases={fases} />
          </section>

          {/* ── riscos e caminho crítico ──────────────────────────────── */}
          <section id="riscos" className="mb-20 scroll-mt-28">
            <h2 className="text-xl font-display text-text-main mb-2">Riscos e caminho crítico</h2>
            <p className="text-sm text-text-muted font-light mb-6">
              O registro de riscos de cronograma do roadmap, com a probabilidade vigente — um risco
              reavaliado mostra a de agora.
            </p>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                {[...riscosAtivos, ...riscos.filter((r) => r.mitigado)].map((r) => (
                  <div key={r.risco} className="rounded-[6px] border border-border-main bg-surface-2 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      {r.mitigado ? (
                        <StatusBadge label="mitigado" variant="online" size="sm" />
                      ) : (
                        <StatusBadge label={`probabilidade ${r.probabilidade}`} variant={PROBABILIDADE[r.probabilidade] ?? 'neutral'} size="sm" />
                      )}
                    </div>
                    <p className={`text-sm ${r.mitigado ? 'line-through text-text-muted' : 'text-text-main'}`}>
                      {r.risco}
                    </p>
                    <p className="text-xs text-text-muted font-light mt-1">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Mitigação</span>{' '}
                      {r.mitigacao}
                    </p>
                  </div>
                ))}
              </div>
              <div className="vort-card dark:vort-card-dark">
                <h3 className="text-sm font-semibold text-text-main mb-3">Caminho crítico</h3>
                <Documento md={caminhoCritico} />
              </div>
            </div>
          </section>

          {/* ── prontidão de cutover ──────────────────────────────────── */}
          <section id="cutover" className="mb-20 scroll-mt-28">
            <h2 className="text-xl font-display text-text-main mb-2">Prontidão de cutover</h2>
            <p className="text-sm text-text-muted font-light mb-6">
              Os pré-requisitos do runbook — nada começa sem todos. A marcação é assinatura manual no
              documento, de propósito: estado inferido não substitui conferência.
            </p>
            <div className="rounded-[6px] border border-border-main bg-surface-2 divide-y divide-border-main">
              {cutover.map((item) => (
                <div key={item.texto} className="px-4 py-3 flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`mt-0.5 shrink-0 w-4 h-4 rounded-[4px] border grid place-items-center text-[10px] ${
                      item.feito
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500 dark:text-emerald-400'
                        : 'border-border-main text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <p className={`text-sm font-light ${item.feito ? 'text-text-muted line-through' : 'text-text-subtle'}`}>
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── decisões ──────────────────────────────────────────────── */}
          <section id="decisoes" className="mb-20 scroll-mt-28">
            <h2 className="text-xl font-display text-text-main mb-2">Decisões</h2>
            <p className="text-sm text-text-muted font-light mb-6">
              Toda decisão da migração vive em <code>docs/00-contexto/decisoes.md</code>. Cada uma abre
              com o registro completo — contexto, alternativas e consequência.
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
          <section id="pendencias" className="mb-20 scroll-mt-28">
            <h2 className="text-xl font-display text-text-main mb-2">Pendências</h2>
            <p className="text-sm text-text-muted font-light mb-6">
              O que depende de decisão — da ATRA ou do projeto — para andar. Abertas primeiro; cada uma
              abre com o que afeta e por que importa.
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
          <section id="documentacao" className="scroll-mt-28">
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
