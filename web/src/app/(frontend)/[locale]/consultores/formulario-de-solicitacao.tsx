'use client'

import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import type { CodigoDeErro, ResultadoSolicitacao } from '@/actions/consultores'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import type { ItemEscolhido } from '@/lib/consultores'
import type { Locale } from '@/lib/locales'
import { MAX_MESES, PADRAO_EMAIL, type Modelo } from '@/lib/solicitacao-consultores'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'

import { ID_DESCRICAO, useSolicitacao } from './solicitacao-contexto'

/* Formulário de solicitação de consultores (task 013) — o último formulário
 * morto do site, ligado.
 *
 * Desde a task 018 mora **dentro da aba de pedido** (`aba-de-pedido.tsx`), logo
 * abaixo da lista de perfis escolhidos. Mudou de lugar, não de comportamento:
 * as notas abaixo valem inteiras. O `useActionState` subiu para a aba, que
 * precisa do resultado para reabrir sozinha na resposta de um envio sem
 * JavaScript — este componente recebe `envio` e `acao` prontos.
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
  itens,
  locale,
  privacidadeHref,
  envio,
  acao,
  enviando,
}: {
  /** Já resolvidos por `itensEscolhidos` na aba: perfil que saiu do catálogo
   *  não vai para o servidor. */
  itens: ItemEscolhido[]
  locale: Locale
  /** Resolvido no servidor por `hrefDe` (regra 6): esta ilha não monta URL. */
  privacidadeHref: string
  envio: ResultadoSolicitacao | null
  acao: (dados: FormData) => void
  enviando: boolean
}) {
  const t = TEXTOS[locale]
  const caminho = usePathname()
  const { setEscolhidos } = useSolicitacao()

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
  /* ⚠️ O carimbo é renovado na **primeira interação com o formulário**, e não
   * só na montagem. O anti-spam descarta envio com carimbo de mais de 120
   * minutos — e devolve **sucesso falso**. Numa página de catálogo, aba
   * esquecida aberta é comum: quem abria às 9h e enviava às 11h30 via a
   * confirmação, o carrinho esvaziava, e nada era gravado. A regra ficou
   * visível quando o carimbo parou de ser zerado a cada render (ver a nota
   * acima): o bug escondia outro. Medido da primeira interação, os 3 s mínimos
   * seguem barrando robô rápido, e os 120 min só pegam sessão realmente velha. */
  const interagiu = useRef(false)
  const carimbarNaPrimeiraInteracao = () => {
    if (interagiu.current || !carimbo.current) return
    interagiu.current = true
    carimbo.current.value = String(Date.now())
  }
  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())
    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [])

  /* O carrinho esvazia depois que o servidor confirma. Efeito, e não o callback
   * da action, porque o callback teria de ser um embrulho cliente — o que
   * quebra o envio sem JavaScript. É sincronizar com um resultado que vem de
   * fora (o servidor), não estado derivado: a render extra acontece uma vez,
   * depois de um envio bem-sucedido. */
  useEffect(() => {
    if (!envio?.ok) return
    setEscolhidos(new Map())
    /* O próximo pedido começa uma sessão nova de preenchimento. */
    interagiu.current = false
  }, [envio, setEscolhidos])

  /* ⚠️ O que o visitante mandou, quando o servidor recusou. O React 19 reseta o
   * formulário ao fim da action — com sucesso ou com erro —, e o reset volta ao
   * `defaultValue`: sem isto, a recusa apagava tudo o que foi digitado. Em campo
   * **visível** reaplicar o `defaultValue` não sobrescreve o que a pessoa digitou
   * (é o oposto dos escondidos lá em cima), então pode ficar. */
  const antes = envio && !envio.ok ? envio.valores : undefined

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística. */
  useRastrearEnvio(Boolean(envio?.ok), 'form_submit', { form_type: 'consultant-request' })

  /* ⚠️ A confirmação **não substitui** o formulário, ao contrário dos demais do
   * site. Aqui a lista continua interativa depois do envio: quem montava um
   * segundo carrinho e clicava em "Enviar solicitação" caía numa confirmação
   * sem formulário, e só recarregando a página. O formulário volta vazio (o
   * reset do React, e sucesso não devolve `valores`) com a faixa acima. */
  return (
    <>
      {envio?.ok && (
        /* Verde em par claro/escuro: `text-emerald-500` puro fica ilegível na
           superfície clara. */
        <p role="status" className="mb-6 text-sm font-light text-emerald-700 dark:text-emerald-400">
          {t.sucesso}
        </p>
      )}
    <form action={acao} aria-busy={enviando} onFocus={carimbarNaPrimeiraInteracao} className="@container flex flex-col space-y-6">
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

      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
        <input
          type="text"
          name="name"
          defaultValue={antes?.name}
          required
          autoComplete="name"
          placeholder={t.nome}
          aria-label={t.nome}
          className={CAMPO}
        />
        <input
          type="text"
          name="company"
          defaultValue={antes?.company}
          autoComplete="organization"
          placeholder={t.empresa}
          aria-label={t.empresa}
          className={CAMPO}
        />
      </div>

      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
        <input
          type="email"
          name="email"
          required
          defaultValue={antes?.email}
          /* Mesma regra da Server Action (`PADRAO_EMAIL`): `joao@empresa` passava
             no `type="email"` e só era recusado depois do envio. */
          pattern={PADRAO_EMAIL}
          title={t.erros.email}
          autoComplete="email"
          placeholder={t.email}
          aria-label={t.email}
          className={CAMPO}
        />
        <input
          type="tel"
          name="phone"
          defaultValue={antes?.phone}
          autoComplete="tel"
          placeholder={t.telefone}
          aria-label={t.telefone}
          className={CAMPO}
        />
      </div>

      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
        {/* ⚠️ Opção vazia primeiro. Sem ela, o `select` sempre enviava
            "full-time", e todo lead chegava ao comercial com "Modelo de alocação:
            Full-time" — inclusive de quem nunca abriu o campo. */}
        {/* ⚠️ `key` porque em `<select>` não controlado o React só aplica o
            `defaultValue` na **montagem** — mudar depois é ignorado, e o reset
            voltava à opção vazia. Medido: com os valores devolvidos, os campos de
            texto voltavam e o modelo não. A `key` remonta o campo quando a recusa
            traz outro modelo. */}
        <select
          key={antes?.modelo ?? ''}
          name="modelo"
          defaultValue={antes?.modelo ?? ''}
          aria-label={t.modeloVazio}
          className={`${CAMPO} cursor-pointer`}
        >
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
          defaultValue={antes?.duracao}
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
        {/* `required` só com o carrinho vazio: aí a descrição é o pedido inteiro,
            e sem ela o servidor recusaria. Barrado no navegador não gasta a cota
            por IP — e sem JavaScript o carrinho está sempre vazio, então vale
            também para esse caminho. */}
        <textarea
          id={ID_DESCRICAO}
          name="message"
          required={itens.length === 0}
          defaultValue={antes?.message}
          rows={3}
          placeholder={t.mensagem}
          aria-label={t.mensagem}
          /* `scroll-mt-32`: sem JavaScript, a âncora do CTA "Não encontrou…" pousa
             o campo sob a barra fixa do topo — 83% encoberto em 375px. */
          className={`${CAMPO} resize-none scroll-mt-32`}
        />
      </div>

      {envio && !envio.ok && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {t.erros[envio.codigo] ?? envio.erro}
        </p>
      )}

      <div className="flex flex-col @lg:flex-row @lg:justify-between @lg:items-center gap-3 pt-3">
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
    </>
  )
}
