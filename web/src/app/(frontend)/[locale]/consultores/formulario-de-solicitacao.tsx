'use client'

import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { solicitarConsultoresNoFormulario, type CodigoDeErro } from '@/actions/consultores'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import { itensEscolhidos, totalDePessoas } from '@/lib/consultores'
import type { Locale } from '@/lib/locales'
import { MAX_MESES, type Modelo } from '@/lib/solicitacao-consultores'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'
import type { ConsultantRole } from '@/types/content'

import { useSolicitacao } from './solicitacao-contexto'

/* Formulário de solicitação de consultores (task 013) — o último formulário
 * morto do site, ligado.
 *
 * Ilha cliente porque precisa do carrinho, que mora no provedor de
 * `solicitacao-contexto.tsx`. A casca da seção — título, foto, painel de
 * contatos — continua no servidor, em `solicitar-consultores.tsx`.
 *
 * ⚠️ `<form action>` com Server Action, e não `onSubmit` com `fetch`: sem
 * JavaScript o formulário ainda envia. O carrinho é estado de cliente, então
 * sem JS a lista de perfis vai vazia — mas o campo livre chega, e é o caminho
 * que sobra para quem não tem o catálogo interativo. */

/* Mesma ordem dos rótulos em `TEXTOS.modelos`, e as chaves são as que a action
 * aceita (`lib/solicitacao-consultores.ts`). */
const MODELOS: readonly Modelo[] = ['full-time', 'part-time', 'squad', 'staff-augmentation']

const TEXTOS = {
  pt: {
    nome: 'Nome completo *',
    empresa: 'Empresa',
    email: 'E-mail corporativo *',
    telefone: 'Telefone / WhatsApp',
    modeloVazio: 'Modelo de alocação (opcional)',
    modelos: [
      'Modelo: Full-time (Dedicado)',
      'Modelo: Part-time (Parcial)',
      'Modelo: Squad Gerenciada ATRA',
      'Modelo: Staff Augmentation',
    ],
    duracao: 'Duração estimada em meses (opcional)',
    mensagem: 'Descreva brevemente o projeto, horizonte de tempo ou requisitos...',
    enviar: 'Verificar Disponibilidade',
    enviando: 'Enviando...',
    sucesso: 'Recebemos sua solicitação. A gente responde em breve.',
    suaSolicitacao: 'Sua solicitação',
    resumo: (perfis: number, pessoas: number) =>
      `${perfis} ${perfis === 1 ? 'perfil' : 'perfis'} · ${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}`,
    editar: 'Editar',
    privacidade: 'Seus dados são tratados conforme a nossa',
    politica: 'Política de Privacidade',
    erros: {
      email: 'Confira o e-mail informado.',
      vazio: 'Escolha ao menos um perfil ou descreva o profissional que você procura.',
      indisponiveis:
        'Os perfis escolhidos não estão mais disponíveis. Atualize a página e escolha de novo, ou descreva o profissional que você procura.',
      falha: 'Não foi possível enviar agora. Tente pelo WhatsApp ou por negocios@atra.com.br.',
    } satisfies Record<CodigoDeErro, string>,
  },
  en: {
    nome: 'Full name *',
    empresa: 'Company',
    email: 'Work e-mail *',
    telefone: 'Phone / WhatsApp',
    modeloVazio: 'Allocation model (optional)',
    modelos: [
      'Model: Full-time (dedicated)',
      'Model: Part-time',
      'Model: ATRA managed squad',
      'Model: Staff augmentation',
    ],
    duracao: 'Estimated duration in months (optional)',
    mensagem: 'Briefly describe the project, timeline or requirements...',
    enviar: 'Check availability',
    enviando: 'Sending...',
    sucesso: 'We got your request. We will get back to you soon.',
    suaSolicitacao: 'Your request',
    resumo: (perfis: number, pessoas: number) =>
      `${perfis} ${perfis === 1 ? 'profile' : 'profiles'} · ${pessoas} ${pessoas === 1 ? 'person' : 'people'}`,
    editar: 'Edit',
    privacidade: 'Your data is handled under our',
    politica: 'Privacy Policy',
    erros: {
      email: 'Please check the e-mail address.',
      vazio: 'Pick at least one profile or describe the professional you are looking for.',
      indisponiveis:
        'The profiles you picked are no longer available. Refresh the page and pick again, or describe the professional you are looking for.',
      falha: 'We could not send it right now. Try WhatsApp or negocios@atra.com.br.',
    } satisfies Record<CodigoDeErro, string>,
  },
} as const

/* O mesmo campo de antes. A nota sobre `disabled:opacity-100` saiu com o
 * `disabled`: o formulário agora envia. */
const CAMPO =
  'w-full bg-transparent border-b border-border-main dark:border-white/20 outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors'

export function FormularioDeSolicitacao({
  perfis,
  locale,
  privacidadeHref,
}: {
  perfis: ConsultantRole[]
  locale: Locale
  /** Resolvido no servidor por `hrefDe` (regra 6): esta ilha não monta URL. */
  privacidadeHref: string
}) {
  const t = TEXTOS[locale]
  const caminho = usePathname()
  const { escolhidos, setEscolhidos } = useSolicitacao()
  /* Por `itensEscolhidos`: perfil que saiu do catálogo não vai para o servidor
     nem aparece no resumo — e a soma de pessoas sai da mesma lista. */
  const itens = itensEscolhidos(perfis, escolhidos)
  const pessoas = totalDePessoas(itens)

  /* ⚠️ Carimbo e UTM escritos **depois da montagem**, por `ref`: `Date.now()` e
   * `sessionStorage` no render fariam o HTML do servidor divergir do cliente.
   *
   * ⚠️ E os `<input type="hidden">` que recebem esses valores **não levam
   * `defaultValue`**. Campo escondido guarda o valor no próprio atributo `value`
   * (é o modo "default" do HTML), e o React reaplica `defaultValue` a cada
   * render: o que o `ref` escreveu era apagado no primeiro re-render. Aqui o
   * formulário re-renderiza sempre que o carrinho muda — o visitante escolhia um
   * perfil e a UTM sumia do envio, e o carimbo voltava a `0`, que o anti-spam
   * lê como "sem carimbo, deixa passar": a checagem de tempo desligada em
   * silêncio. Sem `defaultValue`, o React não toca no valor. Sem JavaScript o
   * campo sai vazio, que o servidor trata igual a `0`. */
  const carimbo = useRef<HTMLInputElement>(null)
  const utm = useRef<HTMLInputElement[]>([])
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [])

  /* ⚠️ A própria Server Action, e não um embrulho — ver
   * `solicitarConsultoresNoFormulario`. Com embrulho o formulário não envia sem
   * JavaScript. */
  const [envio, acao, enviando] = useActionState(solicitarConsultoresNoFormulario, null)

  /* O carrinho esvazia depois que o servidor confirma. Efeito, e não o callback
   * da action, porque o callback teria de ser um embrulho cliente — o que
   * quebra o envio sem JavaScript. É sincronizar com um resultado que vem de
   * fora (o servidor), não estado derivado: a render extra acontece uma vez,
   * depois de um envio bem-sucedido. */
  useEffect(() => {
    if (envio?.ok) setEscolhidos(new Map())
  }, [envio, setEscolhidos])

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. */
  useRastrearEnvio(Boolean(envio?.ok), 'form_submit', { form_type: 'consultant-request' })

  if (envio?.ok) {
    /* Inline, não modal — como os demais formulários do site. Verde em par
       claro/escuro: `text-emerald-500` puro fica ilegível na superfície clara. */
    return (
      <p role="status" className="text-sm font-light text-emerald-700 dark:text-emerald-400">
        {t.sucesso}
      </p>
    )
  }

  return (
    <form action={acao} aria-busy={enviando} className="flex flex-col space-y-6">
      {/* ⚠️ Os escondidos vêm **antes** dos campos reais. O Tailwind 4 põe o
          `space-y-*` como `margin-bottom` em `> :not(:last-child)`: um escondido
          no fim tira do último campo real a condição de último filho e soma 24px
          à página. E nada de `<fieldset>` em volta — com `display: contents` ele
          vira o único filho e o `space-y` some. */}
      <input type="hidden" name="source" value={caminho ?? ''} />
      <input ref={carimbo} type="hidden" name="carimbo" />
      <input
        type="hidden"
        name="perfis"
        value={JSON.stringify(itens.map((i) => ({ slug: i.perfil.slug, quantidade: i.quantidade })))}
      />
      {CHAVES_UTM.map((chave, i) => (
        <input
          key={chave}
          ref={(el) => {
            if (el) utm.current[i] = el
          }}
          type="hidden"
          name={chave}
        />
      ))}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`consultores-${CAMPO_ISCA}`}>Não preencha este campo</label>
        <input id={`consultores-${CAMPO_ISCA}`} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* O que vai junto, para o visitante conferir antes de enviar. Some quando
          o carrinho está vazio: aí o pedido é o campo livre. */}
      {itens.length > 0 && (
        <div className="rounded-[6px] bg-surface-1 dark:bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-text-main dark:text-white">
              {t.suaSolicitacao}: {t.resumo(itens.length, pessoas)}
            </span>
            <a href="#minha-solicitacao" className="text-xs text-primary underline shrink-0">
              {t.editar}
            </a>
          </div>
          <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
            {itens.map(({ perfil: p, quantidade }) => (
              <li key={p.slug} className="text-xs text-text-muted dark:text-white/70 font-light">
                {quantidade}× {p.role}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={t.nome}
          aria-label={t.nome}
          className={CAMPO}
        />
        <input
          type="text"
          name="company"
          autoComplete="organization"
          placeholder={t.empresa}
          aria-label={t.empresa}
          className={CAMPO}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t.email}
          aria-label={t.email}
          className={CAMPO}
        />
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder={t.telefone}
          aria-label={t.telefone}
          className={CAMPO}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* ⚠️ Opção vazia primeiro. Sem ela, o `select` sempre enviava
            "full-time", e todo lead chegava ao comercial com "Modelo de alocação:
            Full-time" — inclusive de quem nunca abriu o campo. */}
        <select name="modelo" defaultValue="" aria-label={t.modeloVazio} className={`${CAMPO} cursor-pointer`}>
          <option value="" className="bg-surface-2 text-text-main">
            {t.modeloVazio}
          </option>
          {MODELOS.map((chave, i) => (
            <option key={chave} value={chave} className="bg-surface-2 text-text-main">
              {t.modelos[i]}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="duracao"
          min={1}
          max={MAX_MESES}
          step={1}
          inputMode="numeric"
          placeholder={t.duracao}
          aria-label={t.duracao}
          className={CAMPO}
        />
      </div>

      {/* `textarea`, e não o `input` de uma linha esticado com `pb-12` que o
          legado usava: é o campo onde se descreve um perfil que não está no
          catálogo, e isso pede parágrafo. */}
      <div className="pt-2">
        <textarea
          name="message"
          rows={3}
          placeholder={t.mensagem}
          aria-label={t.mensagem}
          className={`${CAMPO} resize-none`}
        />
      </div>

      {envio && !envio.ok && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {t.erros[envio.codigo] ?? envio.erro}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3">
        <p className="text-xs text-text-muted dark:text-white/60 font-light max-w-sm">
          {t.privacidade}{' '}
          <a href={privacidadeHref} className="text-primary underline">
            {t.politica}
          </a>
          .
        </p>
        {/* Mesma cor do legado, que o aceite visual compara. */}
        <button
          type="submit"
          disabled={enviando}
          className="bg-primary text-white dark:bg-white dark:text-[#12151c] py-3 px-6 rounded-[6px] text-sm font-medium transition-all flex items-center gap-2 cursor-pointer disabled:cursor-wait disabled:opacity-80 shadow-md shrink-0"
        >
          <span>{enviando ? t.enviando : t.enviar}</span>
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </form>
  )
}
