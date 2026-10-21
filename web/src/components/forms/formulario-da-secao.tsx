'use client'

import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useId, useRef } from 'react'

import { enviarFormularioDoAdminNoEstado, type EstadoDoFormularioDoAdmin } from '@/actions/formularios-do-admin'
import { MAX_TEXTO_CURTO, MAX_TEXTO_LONGO, nomeDoCampo } from '@/lib/formularios-do-admin'
import type { Locale } from '@/lib/locales'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'
import { cn } from '@/lib/utils'
import type { CampoDoFormulario, FormularioDoAdmin } from '@/types/content'

import { CamposOcultos } from './campos-ocultos'

/* O formulário de Conteúdo → Formulários, desenhado na seção "Formulário"
 * (feature criador-de-formularios, task 051).
 *
 * Os campos são os do contato (`bloco-contato`, `contato-com-foto`): traço
 * embaixo, sem caixa. O que muda é que o rótulo fica visível acima de cada
 * campo — aqui ele é escrito pelo marketing e diz o que se pede, e o texto de
 * exemplo, quando há, é só exemplo.
 *
 * ⚠️ `noValidate`: quem confere é o servidor (049), e a mensagem vem ao lado do
 * campo, no idioma da página. O balão do navegador sairia no idioma dele e só
 * para o primeiro erro. O `required` continua no campo para o leitor de tela
 * anunciar "obrigatório". */

const TEXTOS = {
  pt: {
    selecione: 'Selecione…',
    enviando: 'Enviando…',
    enviado: 'Recebemos o seu envio.',
    continuar: 'Continuar',
  },
  en: {
    selecione: 'Select…',
    enviando: 'Sending…',
    enviado: 'We received your submission.',
    continuar: 'Continue',
  },
} as const

/* O traço do contato, mais firme no claro: lá o campo fica sobre a página, e
   aqui sobre o cartão branco, onde o `border-main` some. No foco e no erro o
   traço engrossa para 2px (a sombra), em vez de só mudar de cor. 16px no
   celular (D-65): abaixo disso o iOS dá zoom ao tocar no campo. `scroll-mt`:
   o foco no primeiro erro rola até o campo, e o cabeçalho fixo o cobriria. */
const CAMPO =
  'w-full scroll-mt-32 bg-transparent border-b border-slate-300 dark:border-white/20 py-2 text-base sm:text-sm text-text-main placeholder:text-text-muted outline-none transition-[border-color,box-shadow] duration-150 focus:border-primary focus:shadow-[0_1px_0_0_var(--color-primary)] aria-[invalid=true]:border-red-500 aria-[invalid=true]:shadow-[0_1px_0_0_#ef4444]'

/** O que cada tipo pede ao navegador: teclado no celular e preenchimento automático. */
const ENTRADA: Partial<
  Record<CampoDoFormulario['tipo'], { type: string; autoComplete?: string; inputMode?: 'email' | 'tel' }>
> = {
  name: { type: 'text', autoComplete: 'name' },
  email: { type: 'email', autoComplete: 'email', inputMode: 'email' },
  phone: { type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  company: { type: 'text', autoComplete: 'organization' },
  jobTitle: { type: 'text', autoComplete: 'organization-title' },
  shortText: { type: 'text' },
}

export function FormularioDaSecao({
  formulario,
  locale,
  idDoTitulo,
}: {
  formulario: FormularioDoAdmin
  locale: Locale
  /** O título da seção, quando há: dá nome ao formulário para o leitor de tela. */
  idDoTitulo?: string
}) {
  const t = TEXTOS[locale]
  const base = useId()
  const router = useRouter()
  const refDoForm = useRef<HTMLFormElement>(null)
  const refDoSucesso = useRef<HTMLDivElement>(null)

  const [estado, acao, enviando] = useActionState(enviarFormularioDoAdminNoEstado, null as EstadoDoFormularioDoAdmin | null)

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. No "ir para
     outra página" o envio de verdade volta como `redirect`, e o evento não
     dispara: quem mede ali é a visita à página de destino. */
  const destino = formulario.depoisDoEnvio.tipo === 'pagina' ? formulario.depoisDoEnvio.href : null
  /* Aqui, `{ ok: true }` com destino é só o sucesso falso: contá-lo mediria
     exatamente os envios descartados. */
  useRastrearEnvio(Boolean(estado?.ok) && !destino, 'form_submit', { form_type: 'custom-form' })

  useEffect(() => {
    if (!estado) return
    if (estado.ok) {
      /* `{ ok: true }` num formulário que leva a outra página é o sucesso
         falso do anti-spam (049): o envio de verdade chega como `redirect`.
         Ir para a mesma página é o que não deixa os dois se distinguirem. */
      if (destino) router.push(destino)
      else refDoSucesso.current?.focus()
      return
    }
    /* Com erro, o foco vai ao primeiro campo recusado — o leitor de tela lê o
       campo e a mensagem ligada a ele. */
    refDoForm.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [estado, destino, router])

  if (estado?.ok) {
    if (destino) {
      return (
        <p role="status" className="text-base text-text-main">
          {t.enviado}{' '}
          <a href={destino} className="text-primary-dark underline underline-offset-4 dark:text-primary">
            {t.continuar}
          </a>
        </p>
      )
    }
    return (
      /* Sem caixa própria: a seção já põe o formulário num cartão, e a
         mensagem ocupa o lugar dele. */
      <div ref={refDoSucesso} role="status" tabIndex={-1} className="flex items-start gap-3 outline-none">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check size={14} strokeWidth={3} aria-hidden />
        </span>
        <p className="whitespace-pre-line text-base leading-relaxed text-text-main">
          {formulario.depoisDoEnvio.tipo === 'mensagem' ? formulario.depoisDoEnvio.mensagem : t.enviado}
        </p>
      </div>
    )
  }

  const erros = estado && !estado.ok ? (estado.erros ?? {}) : {}
  const valores = estado && !estado.ok ? (estado.valores ?? {}) : {}
  const erroGeral = estado && !estado.ok ? estado.erro : undefined

  return (
    <form
      ref={refDoForm}
      action={acao}
      noValidate
      aria-busy={enviando}
      aria-labelledby={idDoTitulo}
      className="flex flex-col gap-8"
    >
      {/* Antes dos campos de verdade (ver `campos-ocultos.tsx`). Aqui o
          espaçamento é `gap`, que não conta campo escondido nem absoluto. */}
      <input type="hidden" name="formulario" value={formulario.id} />
      <input type="hidden" name="locale" value={locale} />
      <CamposOcultos />

      <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
        {formulario.campos.map((campo) => (
          <Campo
            key={campo.id}
            campo={campo}
            id={`${base}-${campo.id}`}
            erro={erros[campo.id]}
            valor={valores[nomeDoCampo(campo.id)]}
            selecione={t.selecione}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {formulario.aviso && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-text-muted">{formulario.aviso}</p>
        )}
        {erroGeral && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {erroGeral}
          </p>
        )}
        <div>
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-6 py-3 text-sm font-medium text-white shadow-md transition-[background-color,transform] hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
          >
            <span>{enviando ? t.enviando : formulario.botao}</span>
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </form>
  )
}

function Campo({
  campo,
  id,
  erro,
  valor,
  selecione,
}: {
  campo: CampoDoFormulario
  id: string
  erro: string | undefined
  /** O que o visitante tinha digitado, quando o envio voltou com erro. */
  valor: string | undefined
  selecione: string
}) {
  const nome = nomeDoCampo(campo.id)
  const idDoErro = `${id}-erro`
  const invalido = Boolean(erro)
  /* No celular, sempre a linha inteira: meia largura a 390px deixa o campo
     com menos de 170px. */
  const largura = campo.largura === 'inteira' ? 'sm:col-span-2' : ''
  const comum = {
    id,
    name: nome,
    required: campo.obrigatorio,
    'aria-invalid': invalido || undefined,
    'aria-describedby': invalido ? idDoErro : undefined,
  }
  const mensagem = erro && (
    <p id={idDoErro} className="text-sm text-red-600 dark:text-red-400">
      {erro}
    </p>
  )
  /* Azul profundo no claro: o azul da marca sobre o cartão branco fica em
     2,8:1 (medido). */
  const obrigatorio = campo.obrigatorio && (
    <span aria-hidden className="text-primary-dark dark:text-primary">
      {' *'}
    </span>
  )

  if (campo.tipo === 'checkbox') {
    return (
      <div className={cn('flex flex-col gap-1.5', largura)}>
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-text-subtle">
          {/* `scheme-*`: desmarcada, a caixa nativa sai branca no escuro. */}
          <input
            {...comum}
            type="checkbox"
            defaultChecked={valor !== undefined}
            className="mt-0.5 size-[18px] shrink-0 scroll-mt-32 cursor-pointer accent-primary scheme-light dark:scheme-dark aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-2 aria-[invalid=true]:outline-red-500"
          />
          <span>
            {campo.rotulo}
            {obrigatorio}
          </span>
        </label>
        {mensagem}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-1.5', largura)}>
      <label htmlFor={id} className="text-sm text-text-subtle">
        {campo.rotulo}
        {obrigatorio}
      </label>
      {campo.tipo === 'select' ? (
        <div className="relative">
          {/* `scheme-*` põe a lista aberta no tema da página: sem ele, ela sai
              branca no escuro (a mesma nota do diagnóstico). Sem escolha, o
              "Selecione…" fica no tom do texto de exemplo dos outros campos —
              e as opções, no do texto. */}
          {/* ⚠️ `key` pelo valor devolvido: no React 19, `defaultValue` novo
              num `<select>` já montado não chega ao DOM, e o reset depois da
              action voltaria para "Selecione…" — a escolha se perderia no
              envio com erro. Remontar põe a opção certa como padrão. */}
          <select
            key={valor ?? ''}
            {...comum}
            defaultValue={valor ?? ''}
            className={cn(
              CAMPO,
              'cursor-pointer appearance-none pr-8 scheme-light dark:scheme-dark',
              "has-[option[value='']:checked]:text-text-muted [&>option]:text-text-main",
            )}
          >
            <option value="">{campo.exemplo ?? selecione}</option>
            {campo.opcoes.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-text-muted"
          />
        </div>
      ) : campo.tipo === 'longText' ? (
        <textarea
          {...comum}
          rows={4}
          maxLength={MAX_TEXTO_LONGO}
          placeholder={campo.exemplo ?? undefined}
          defaultValue={valor}
          className={cn(CAMPO, 'resize-none')}
        />
      ) : (
        <input
          {...comum}
          {...ENTRADA[campo.tipo]}
          maxLength={MAX_TEXTO_CURTO}
          placeholder={campo.exemplo ?? undefined}
          defaultValue={valor}
          className={CAMPO}
        />
      )}
      {mensagem}
    </div>
  )
}
