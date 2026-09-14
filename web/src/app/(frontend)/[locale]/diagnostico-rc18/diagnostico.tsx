'use client'

import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'

import { enviarDiagnosticoRc18, type ResultadoDiagnosticoLead } from '@/actions/diagnostico-rc18'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import { PILARES, TOTAL_PILARES, type PilarId } from '@/lib/diagnostico-rc18'
import { cn } from '@/lib/utils'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'

/* Ilha do RC18 Quick Check (feature rc18).
 *
 * ⚠️ 11 pilares de múltipla escolha + dados de contato, num **envio único**: ao
 * enviar, a ATRA recebe um e-mail com as respostas e entra em contato. Sem índice
 * na tela (decisão do dono) — as opções carregam pontos só para o e-mail. As
 * respostas seguem cruas para a action, que revalida e monta o resumo.
 *
 * Sem `motion`: transições em CSS, para não depender do IntersectionObserver. */

const CAMPO =
  'w-full rounded-[6px] bg-surface-1 px-3 py-2 text-sm text-text-main placeholder:text-text-muted shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-primary/20'

export function Diagnostico({ hrefContato }: { hrefContato: string }) {
  const [respostas, setRespostas] = useState<Partial<Record<PilarId, string>>>({})

  const caminho = usePathname()
  const carimbo = useRef<HTMLInputElement>(null)
  const utm = useRef<HTMLInputElement[]>([])
  const [envio, acao, enviando] = useActionState(
    async (_anterior: ResultadoDiagnosticoLead | null, dados: FormData) => enviarDiagnosticoRc18(dados),
    null as ResultadoDiagnosticoLead | null,
  )

  /* Escondidos (carimbo/UTM/isca) no padrão do `Formulario` (MIG-100/101); a
     action recorta tudo de novo no servidor. Preenchidos no mount. */
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [])

  const respondidos = Object.keys(respostas).length
  const completo = respondidos === TOTAL_PILARES
  const progresso = Math.round((respondidos / TOTAL_PILARES) * 100)

  function selecionar(id: PilarId, valor: string) {
    setRespostas((r) => ({ ...r, [id]: valor }))
  }

  if (envio?.ok) {
    return (
      <div className="mx-auto max-w-3xl px-3 sm:px-6 py-12 md:py-16">
        <div className="vort-card text-center">
          <h2 className="mb-2 text-xl font-semibold text-text-main">Recebemos suas respostas.</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Um especialista da ATRA vai analisar o seu quick-check e entrar em contato pelo e-mail e telefone
            informados. Obrigado!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">RC18 Quick Check</p>
        <h1 className="mb-4 text-3xl font-light tracking-tight text-text-main md:text-4xl">
          Sua instituição está pronta para a <span className="text-gradient">RC 18/2025</span>?
        </h1>
        <p className="text-base leading-relaxed text-text-muted">
          Autoavaliação rápida de prontidão para a qualidade das informações regulatórias, em onze pilares. Responda e
          deixe seu contato — a ATRA analisa e retorna com as recomendações.
        </p>
        <p className="mt-3 text-xs text-text-muted">
          Autoavaliação indicativa, baseada na sua percepção — não substitui um assessment formal.
        </p>
      </header>

      <div className="sticky top-20 z-10 mb-8 rounded-[6px] bg-surface-2/95 px-4 py-3 shadow-md backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>
            {respondidos} de {TOTAL_PILARES} respondidos
          </span>
          <span>{progresso}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div className="h-full bg-gradient-atra transition-all duration-300" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <form action={acao} aria-busy={enviando} className="space-y-4">
        <ol className="space-y-4">
          {PILARES.map((p, i) => (
            <li key={p.id} className="vort-card">
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-xs font-semibold text-primary">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{p.nome}</h2>
              </div>
              <p className="mb-4 text-sm font-medium text-text-main">{p.pergunta}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label={p.nome}>
                {p.opcoes.map((o) => {
                  const ativo = respostas[p.id] === o.valor
                  return (
                    <button
                      key={o.valor}
                      type="button"
                      onClick={() => selecionar(p.id, o.valor)}
                      aria-pressed={ativo}
                      className={cn(
                        'rounded-[6px] px-3 py-2 text-left text-xs font-semibold transition-all',
                        ativo
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-surface-3 text-text-muted hover:bg-surface-3/70 hover:text-text-main',
                      )}
                    >
                      {o.rotulo}
                    </button>
                  )
                })}
              </div>
            </li>
          ))}
        </ol>

        {/* Contato — último passo do formulário. */}
        <div className="vort-card">
          <h3 className="mb-1 text-lg font-semibold text-text-main">Receba a análise e fale com um especialista</h3>
          <p className="mb-4 text-sm text-text-muted">
            Deixe seu contato: a ATRA recebe as respostas por e-mail e retorna com as recomendações.
          </p>

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
            <input type="text" name="name" required placeholder="Nome do respondente" aria-label="Nome do respondente" className={CAMPO} />
            <input type="text" name="company" required placeholder="Instituição" aria-label="Instituição" className={CAMPO} />
            <input type="email" name="email" required placeholder="E-mail corporativo" aria-label="E-mail corporativo" className={CAMPO} />
            <input type="tel" name="phone" required placeholder="Telefone" aria-label="Telefone" className={CAMPO} />
          </div>

          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={!completo || enviando}
              className={cn('pill-btn-primary', (!completo || enviando) && 'cursor-not-allowed opacity-50')}
            >
              {enviando ? 'Enviando…' : 'Enviar respostas'}
            </button>
            {!completo && (
              <span className="text-xs text-text-muted">Responda os {TOTAL_PILARES} pilares para enviar.</span>
            )}
          </div>

          <p className="mt-3 text-xs text-text-muted">
            Seus dados são tratados conforme a nossa Política de Privacidade.{' '}
            <a href={hrefContato} className="text-primary underline">
              Prefere falar direto? Fale conosco.
            </a>
          </p>
          {envio && !envio.ok && (
            <p role="alert" className="mt-2 text-sm font-medium text-red-500 dark:text-red-400">
              {envio.erro}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
