'use client'

import { useActionState, useEffect, useRef } from 'react'

import { enviarCandidatura, type ResultadoCandidatura } from '@/actions/candidatura'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'

/* MIG-102 — o formulário de candidatura, ilha cliente da página da vaga.
 *
 * Segue `formulario.tsx` à risca: carimbo por ref depois da montagem (Date.now
 * no render é impuro e diverge do servidor), campos escondidos ANTES dos reais
 * (a armadilha do space-y do Tailwind 4), sem fieldset, sucesso inline.
 *
 * ⚠️ Só é montado quando `ENABLE_JOB_APPLICATIONS=1` — a página decide, não
 * este componente. P-17 (retenção do CV, LGPD) é o interruptor. */

const CAMPO = 'w-full bg-surface-2 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[6px] px-4 py-3 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary/60'

export function Candidatura({ jobId, jobTitle }: { jobId: number; jobTitle: string }) {
  const carimbo = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
  }, [])

  const [estado, acao, enviando] = useActionState(
    async (_a: ResultadoCandidatura | null, dados: FormData) => enviarCandidatura(dados),
    null as ResultadoCandidatura | null,
  )

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. */
  useRastrearEnvio(Boolean(estado?.ok), 'form_submit', { form_type: 'job-application' })

  if (estado?.ok) {
    return (
      <p role="status" className="text-sm font-light text-emerald-500">
        Candidatura enviada. O RH recebe seu currículo e responde pelo e-mail informado.
      </p>
    )
  }

  return (
    <form action={acao} aria-busy={enviando} className="space-y-4 max-w-xl">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="jobTitle" value={jobTitle} />
      <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />
      {/* A isca do anti-spam: invisível para gente, irresistível para robô. */}
      <input type="text" name={CAMPO_ISCA} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <input name="name" required placeholder="Seu nome" aria-label="Nome" className={CAMPO} />
      <input name="email" type="email" required placeholder="Seu e-mail" aria-label="E-mail" className={CAMPO} />
      <input name="phone" placeholder="Telefone (opcional)" aria-label="Telefone" className={CAMPO} />
      <textarea name="message" rows={4} placeholder="Conte em poucas linhas por que esta vaga (opcional)" aria-label="Mensagem" className={CAMPO} />
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2" htmlFor="cv">
          Currículo (PDF, até 5 MB)
        </label>
        <input id="cv" name="cv" type="file" accept="application/pdf" required className="block text-sm text-text-muted file:mr-4 file:rounded-[6px] file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white hover:file:bg-primary-dark file:cursor-pointer" />
      </div>

      {estado && !estado.ok && (
        <p role="alert" className="text-sm font-light text-red-400">
          {estado.erro}
        </p>
      )}

      <button type="submit" className="pill-btn-primary" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar candidatura'}
      </button>
    </form>
  )
}
