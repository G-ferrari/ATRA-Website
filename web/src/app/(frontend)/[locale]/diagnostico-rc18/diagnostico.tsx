'use client'

import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'

import { enviarDiagnosticoRc18, type ResultadoDiagnosticoLead } from '@/actions/diagnostico-rc18'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import {
  calcularIndice,
  DIMENSOES,
  NIVEIS,
  type DimensaoId,
  type Faixa,
  type Nivel,
  type ResultadoDiagnostico,
} from '@/lib/diagnostico-rc18'
import { cn } from '@/lib/utils'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'

/* Ilha do diagnóstico RC 18/2025 (feature rc18, task 006).
 *
 * Autoavaliação das 12 dimensões (0–3), índice calculado na hora pela lib pura
 * `@/lib/diagnostico-rc18` (a mesma que o servidor usará para gravar o lead na
 * task 007 — o cliente não é fonte de verdade). Sem `motion`: transições em CSS,
 * para não depender do IntersectionObserver. */

const CAMPO =
  'w-full rounded-[6px] bg-surface-1 px-3 py-2 text-sm text-text-main placeholder:text-text-muted shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-primary/20'

const FAIXA: Record<Faixa, { titulo: string; texto: string }> = {
  inicial: {
    titulo: 'Estágio inicial',
    texto:
      'A maior parte das dimensões ainda depende de controle manual. A RC 18 exige o nível "em produção" como piso — há um caminho claro a percorrer até 31/12/2026.',
  },
  intermediario: {
    titulo: 'Em evolução',
    texto:
      'Você já tem regra e medição em parte das dimensões, mas ainda faltam pontos para atingir o piso da norma em todas elas.',
  },
  avancado: {
    titulo: 'Avançado',
    texto:
      'A maioria das dimensões já opera com regra, medição e evidência. Vale confirmar a cobertura ponta a ponta e a rastreabilidade até o envio ao BCB.',
  },
}

export function Diagnostico({ hrefContato }: { hrefContato: string }) {
  const [respostas, setRespostas] = useState<Partial<Record<DimensaoId, Nivel>>>({})
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null)
  const resultadoRef = useRef<HTMLElement>(null)

  /* Captura do lead (task 007). Escondidos (carimbo/UTM/isca) seguem o padrão do
     `Formulario` (MIG-100/101); a action recorta tudo de novo no servidor. */
  const caminho = usePathname()
  const carimbo = useRef<HTMLInputElement>(null)
  const utm = useRef<HTMLInputElement[]>([])
  const [envio, acao, enviando] = useActionState(
    async (_anterior: ResultadoDiagnosticoLead | null, dados: FormData) => enviarDiagnosticoRc18(dados),
    null as ResultadoDiagnosticoLead | null,
  )

  useEffect(() => {
    if (!resultado) return
    if (carimbo.current) carimbo.current.value = String(Date.now())
    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [resultado])

  const respondidas = Object.keys(respostas).length
  const total = DIMENSOES.length
  const completo = respondidas === total
  const progresso = Math.round((respondidas / total) * 100)

  function selecionar(id: DimensaoId, nivel: Nivel) {
    setRespostas((r) => ({ ...r, [id]: nivel }))
    setResultado(null) // a resposta mudou → o resultado anterior deixa de valer
  }

  function calcular() {
    if (!completo) return
    setResultado(calcularIndice(respostas))
    requestAnimationFrame(() =>
      resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  function refazer() {
    setRespostas({})
    setResultado(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Diagnóstico gratuito</p>
        <h1 className="mb-4 text-3xl font-light tracking-tight text-text-main md:text-4xl">
          Sua instituição está pronta para a <span className="text-gradient">RC 18/2025</span>?
        </h1>
        <p className="text-base leading-relaxed text-text-muted">
          Avalie a maturidade da sua instituição nas 12 dimensões de qualidade da informação exigidas pela
          Resolução Conjunta nº 18/2025. Leva cerca de 2 minutos e o resultado aparece na hora.
        </p>
        <p className="mt-3 text-xs text-text-muted">
          Autoavaliação indicativa, baseada na sua percepção — não substitui um assessment formal.
        </p>
      </header>

      <div className="sticky top-20 z-10 mb-8 rounded-[6px] bg-surface-2/95 px-4 py-3 shadow-md backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>
            {respondidas} de {total} respondidas
          </span>
          <span>{progresso}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div className="h-full bg-gradient-atra transition-all duration-300" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <ol className="space-y-4">
        {DIMENSOES.map((d, i) => (
          <li key={d.id} className="vort-card">
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-xs font-semibold text-primary">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-base font-semibold text-text-main">{d.nome}</h2>
            </div>
            <p className="mb-4 text-sm text-text-muted">{d.pergunta}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label={d.nome}>
              {NIVEIS.map((n) => {
                const ativo = respostas[d.id] === n.valor
                return (
                  <button
                    key={n.valor}
                    type="button"
                    onClick={() => selecionar(d.id, n.valor)}
                    aria-pressed={ativo}
                    title={n.descricao}
                    className={cn(
                      'rounded-[6px] border px-3 py-2 text-left text-xs font-semibold transition-all',
                      ativo
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-transparent bg-surface-3 text-text-muted hover:border-primary/40',
                    )}
                  >
                    {n.rotulo}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={calcular}
          disabled={!completo}
          className={cn('pill-btn-secondary', !completo && 'cursor-not-allowed opacity-50')}
        >
          Ver minha prontidão
        </button>
        {!completo && (
          <span className="text-xs text-text-muted">Responda as {total} dimensões para calcular.</span>
        )}
      </div>

      {resultado && (
        <section ref={resultadoRef} className="mt-14 scroll-mt-28" aria-live="polite">
          <div className="vort-card-dark text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
              Índice de prontidão RC 18
            </p>
            <p className="text-gradient text-6xl font-light leading-none">{resultado.ipRc18}%</p>
            <p className="mt-4 text-lg font-semibold text-white">{FAIXA[resultado.faixa].titulo}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              {FAIXA[resultado.faixa].texto}
            </p>
            {resultado.lacunas.length > 0 && (
              <p className="mt-3 text-sm text-white/70">
                <strong className="text-white">{resultado.lacunas.length}</strong> de {total} dimensões ainda
                abaixo do piso da norma.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-2">
            {resultado.porDimensao.map((d) => {
              const lacuna = resultado.lacunas.includes(d.id)
              return (
                <div key={d.id} className="flex items-center gap-3 rounded-[6px] bg-surface-2 px-4 py-2.5">
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', lacuna ? 'bg-secondary' : 'bg-emerald-500')} />
                  <span className="flex-1 text-sm text-text-main">{d.nome}</span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className={cn('h-full rounded-full', lacuna ? 'bg-secondary' : 'bg-primary')}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Captura do lead com o resumo do diagnóstico (task 007). O índice é
              recalculado no servidor a partir de `respostas`. */}
          <div className="mt-8 vort-card">
            {envio?.ok ? (
              <p role="status" className="text-center text-sm text-text-main">
                Recebemos seu diagnóstico. Um especialista da ATRA vai retornar em breve.
              </p>
            ) : (
              <>
                <h3 className="mb-1 text-lg font-semibold text-text-main">
                  Receba a análise e fale com um especialista
                </h3>
                <p className="mb-4 text-sm text-text-muted">
                  Um assessment inicial de 30 minutos, dimensionado pelo porte da sua instituição, aprofunda este
                  resultado.
                </p>
                <form action={acao} aria-busy={enviando} className="space-y-3">
                  <input type="hidden" name="source" value={caminho ?? ''} />
                  <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />
                  <input type="hidden" name="respostas" value={JSON.stringify(respostas)} />
                  {CHAVES_UTM.map((chave, i) => (
                    <input
                      key={chave}
                      ref={(el) => {
                        if (el) utm.current[i] = el
                      }}
                      type="hidden"
                      name={chave}
                      defaultValue=""
                    />
                  ))}
                  <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                    <label htmlFor={`diag-${CAMPO_ISCA}`}>Não preencha este campo</label>
                    <input id={`diag-${CAMPO_ISCA}`} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input type="text" name="name" placeholder="Nome" aria-label="Nome" className={CAMPO} />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="E-mail corporativo"
                      aria-label="E-mail corporativo"
                      className={CAMPO}
                    />
                    <input type="text" name="company" placeholder="Instituição" aria-label="Instituição" className={CAMPO} />
                    <input type="tel" name="phone" placeholder="Telefone" aria-label="Telefone" className={CAMPO} />
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={enviando}
                      className={cn('pill-btn-primary', enviando && 'cursor-not-allowed opacity-50')}
                    >
                      Enviar diagnóstico
                    </button>
                    <button type="button" onClick={refazer} className="pill-btn-outline">
                      Refazer
                    </button>
                  </div>
                  <p className="text-xs text-text-muted">
                    Seus dados são tratados conforme a nossa Política de Privacidade.{' '}
                    <a href={hrefContato} className="text-primary underline">
                      Prefere falar direto? Fale conosco.
                    </a>
                  </p>
                  {envio && !envio.ok && (
                    <p role="alert" className="text-sm font-medium text-red-500 dark:text-red-400">
                      {envio.erro}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
