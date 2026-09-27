'use client'

import { CalendarDays, Check, ChevronDown, LoaderCircle, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  useActionState,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'

import {
  enviarDiagnosticoDeMaturidade,
  type ResultadoDoDiagnostico,
  type ValoresEnviados,
} from '@/actions/diagnostico-maturidade'
import { StatusBadge } from '@/components/ui'
import { CAMPO_ISCA } from '@/lib/anti-spam'
import {
  CARGOS,
  PORTES,
  SETORES,
  impactosDaPergunta,
  impactosDoSetor,
  type OpcaoDoPerfil,
  type Setor,
} from '@/lib/diagnostico-maturidade'
import {
  CAMPOS_VALIDADOS,
  parametrosDoLead,
  validarContato,
  type CampoValidado,
  type ErrosDoContato,
} from '@/lib/diagnostico-maturidade/contato'
import {
  CAMPOS_DO_PERFIL,
  camposFaltando,
  estadoInicial,
  etapaAtual,
  indiceDaTecla,
  podeAvancar,
  progresso,
  questionario,
  rotuloDaEtapa,
  type CampoDoPerfil,
  type Etapa,
  type EstadoDoQuestionario,
  type Perfil,
} from '@/lib/diagnostico-maturidade/questionario'
import { congelado } from '@/lib/e2e'
import { useRastrearEnvio } from '@/lib/use-rastrear-envio'
import { cn } from '@/lib/utils'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'
import type { DiagnosticoDeMaturidade } from '@/types/content'

import { GrupoDeAlternativas } from './alternativas'
import { BarraDeProgresso } from './barra-de-progresso'

/* Ilha do Diagnóstico de Maturidade de Dados (tasks 026 e 027): perfil →
 * perguntas do setor → contato → conclusão. O fluxo e os textos são os do HTML
 * do Roger (v1.7), caractere a caractere (D-22); o desenho é o do site
 * (DESIGN.md).
 *
 * Estado só no cliente, num reducer puro (`lib/diagnostico-maturidade/
 * questionario.ts`, testado à parte). Nada vai ao servidor até o envio do
 * contato, que manda perfil e `estado.respostas` à action da task 025 — ela
 * refaz a conta, grava o lead e manda o resultado **só por e-mail**: a
 * conclusão confirma o endereço e não mostra nota nenhuma (decisão de 26/09).
 *
 * Os textos da UI ficam em português também em `/en`: a rota EN serve o
 * conteúdo PT por decisão da feature, e o `<main>` declara `lang="pt-BR"`. */

/** `CONFIG.autoAdvanceMs` do HTML. */
const AVANCO_AUTOMATICO_MS = 350

/** Abaixo disto o topo do cartão está sob o cabeçalho fixo do site. */
const TOPO_VISIVEL_PX = 96

const MARCA = 'Diagnóstico de Maturidade de Dados'

const CAMPOS: Record<CampoDoPerfil, { rotulo: string; erro: string; opcoes: readonly OpcaoDoPerfil<string>[] }> = {
  setor: { rotulo: 'Setor de atuação', erro: 'Informe o setor.', opcoes: SETORES },
  porte: { rotulo: 'Faturamento anual aproximado', erro: 'Informe o porte.', opcoes: PORTES },
  cargo: { rotulo: 'Seu cargo', erro: 'Informe o cargo.', opcoes: CARGOS },
}

const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export type TextosDoQuestionario = Pick<
  DiagnosticoDeMaturidade,
  'titulo' | 'abertura' | 'conclusao' | 'whatsappUrl' | 'agendaUrl'
>

/* O contato antes de qualquer tecla. `ValoresEnviados` é o formato que a action
 * devolve na recusa — o mesmo que o formulário manda. */
const CONTATO_VAZIO: ValoresEnviados = { name: '', email: '', phone: '', company: '', consentimento: false }

export function Questionario({
  textos,
  setorInicial,
  privacidadeHref,
}: {
  textos: TextosDoQuestionario
  /** `?setor=` já validado pela página; `null` abre o perfil sem setor. */
  setorInicial: Setor | null
  /** Resolvido no servidor por `hrefDe` (regra 6): a ilha não monta URL. */
  privacidadeHref: string
}) {
  const [estado, despachar] = useReducer(questionario, setorInicial, estadoInicial)

  /* ⚠️ A própria Server Action, e não um embrulho — com embrulho o formulário
   * deixa de enviar sem JavaScript (o padrão dos formulários do site, ver
   * `consultores/aba-de-pedido.tsx`). Mora aqui, e não na tela do contato,
   * porque o cartão inteiro depende da resposta: a conclusão troca a tela, a
   * barra e o rodapé, e o botão de envio fica no rodapé. */
  const [envio, acao, enviando] = useActionState(enviarDiagnosticoDeMaturidade, null)
  const concluido = envio?.ok === true
  const etapa = etapaAtual(estado, concluido)
  const rotulo = rotuloDaEtapa(etapa)
  /* A tela que está no cartão. A conclusão não é passo do reducer (ver
     `questionario.ts`), então o passo sozinho não diz quando ela entrou. */
  const tela = concluido ? 'conclusao' : estado.passo

  /* ⚠️ O que já foi digitado no contato mora **aqui**, e não nos campos. A
   * tela é montada do zero a cada passo (o `key` do fade de entrada): sem isto,
   * voltar a uma pergunta para rever a resposta apagava nome, e-mail e
   * telefone — no HTML as telas só se escondem, e o que foi digitado fica. Os
   * campos seguem não controlados, com o rascunho como `defaultValue`: é ele
   * que o React 19 restaura quando reseta o formulário ao fim da action, então
   * uma recusa do servidor devolve o que foi enviado sem precisar dos
   * `valores` da resposta. */
  const [rascunho, setRascunho] = useState(CONTATO_VAZIO)

  /* O `state.startedAt` do HTML: a action calcula o tempo de resposta a partir
     dele. Em efeito, e não no render — `Date.now()` no render faria o HTML do
     servidor divergir do cliente. */
  const inicio = useRef(0)
  useEffect(() => {
    inicio.current = Date.now()
  }, [])

  /* MIG-156: no-op sem GTM ou sem consentimento de estatística (D-30). O
     `setorDasRespostas` é o setor que foi enviado — o reducer só o troca no
     "Começar". */
  useRastrearEnvio(concluido, 'quiz_maturidade_lead', parametrosDoLead(estado.setorDasRespostas))

  const id = useId()
  const ids = {
    marca: `${id}-marca`,
    titulo: `${id}-titulo`,
    instrucao: `${id}-instrucao`,
    campo: `${id}-campo`,
    formulario: `${id}-formulario`,
  }

  const cartao = useRef<HTMLElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const campos = useRef<Partial<Record<CampoDoPerfil, HTMLSelectElement | null>>>({})
  const avanco = useRef<number | undefined>(undefined)
  const telaMostrada = useRef(tela)

  /* Troca de tela: o foco vai para o título da tela nova. Sem isto, quem
     escolheu pelo teclado fica com o foco num botão que acabou de sumir — e o
     navegador o devolve ao `<body>`, no topo da página. O cartão volta à vista
     só se o topo dele saiu dela (o `scrollIntoView` do HTML, sem o solavanco
     quando já está visível). Vale para a conclusão: o botão de envio some com
     ela. */
  useEffect(() => {
    if (telaMostrada.current === tela) return
    telaMostrada.current = tela
    titulo.current?.focus({ preventScroll: true })
    const el = cartao.current
    if (el && el.getBoundingClientRect().top < TOPO_VISIVEL_PX) {
      el.scrollIntoView({ block: 'start', behavior: movimentoReduzido() ? 'instant' : 'smooth' })
    }
  }, [tela])

  useEffect(() => {
    const temporizador = avanco
    return () => window.clearTimeout(temporizador.current)
  }, [])

  function avancar() {
    /* Perfil incompleto: o reducer acende os erros e o foco vai para o
       primeiro campo que falta, que já anuncia o erro dele. */
    if (etapa.tipo === 'perfil') {
      const [primeiro] = camposFaltando(estado.perfil)
      if (primeiro) campos.current[primeiro]?.focus()
    }
    despachar({ tipo: 'avancar' })
  }

  function voltar() {
    window.clearTimeout(avanco.current)
    despachar({ tipo: 'voltar' })
  }

  function escolher(indice: number) {
    if (etapa.tipo !== 'pergunta' || indice >= etapa.pergunta.alternativas.length) return
    despachar({ tipo: 'responder', perguntaId: etapa.pergunta.id, indice })
    window.clearTimeout(avanco.current)
    /* Avanço automático fora com `prefers-reduced-motion` — a tela trocar
       sozinha é movimento que a pessoa não pediu — e com `?e2e=1`, que precisa
       da tela parada. Aí quem avança é o botão, que acende com a resposta. */
    if (congelado() || movimentoReduzido()) return
    const de = estado.passo
    avanco.current = window.setTimeout(() => despachar({ tipo: 'avancar', de }), AVANCO_AUTOMATICO_MS)
  }

  /* Teclado no cartão inteiro, como o `keydown` do HTML: na pergunta, A–D ou
     1–4 escolhem de onde o foco estiver (inclusive do título, que é onde ele
     cai a cada tela); Enter avança, exceto sobre botão e link, que têm o
     próprio Enter — nas alternativas, ele escolhe.
     ⚠️ No contato o Enter fica com o formulário: é o envio implícito do
     navegador, que passa pela validação do `onSubmit`. Interceptá-lo aqui
     engolia o envio — `avancar` no contato não faz nada. */
  function aoTeclar(e: KeyboardEvent<HTMLElement>) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    if (etapa.tipo === 'pergunta') {
      const indice = indiceDaTecla(e.key)
      if (indice !== null) {
        e.preventDefault()
        escolher(indice)
        return
      }
    }
    const avancavel = etapa.tipo === 'perfil' || etapa.tipo === 'pergunta'
    if (avancavel && e.key === 'Enter' && !(e.target as HTMLElement).closest('button, a')) {
      e.preventDefault()
      avancar()
    }
  }

  /* "Tentar novamente" é o texto do HTML depois de uma falha de envio. */
  const falhou = envio?.ok === false && envio.codigo === 'falha'

  return (
    <section
      ref={cartao}
      aria-labelledby={ids.marca}
      onKeyDown={aoTeclar}
      className="relative scroll-mt-24 rounded-[12px] bg-surface-2 shadow-sm md:scroll-mt-28"
    >
      <div className="px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-between gap-3">
          <h1 id={ids.marca} className="text-base text-text-main">
            {MARCA}
          </h1>
          {/* `aria-live`: a cada tela o foco vai para o título, que diz a
              pergunta; isto diz em que ponto dela a pessoa está. */}
          <p aria-live="polite" className="shrink-0 whitespace-nowrap text-xs font-medium text-text-muted">
            {rotulo}
          </p>
        </div>
        <BarraDeProgresso
          className="mt-3.5"
          valor={progresso(estado, concluido)}
          rotuladoPor={ids.marca}
          textoDoValor={rotulo}
        />
      </div>

      {/* `key` pela tela: cada uma entra montada do zero, e o
          `@starting-style` (`starting:`) faz o fade de entrada do HTML sem JS
          de animação. */}
      <div
        key={tela}
        className="min-h-[340px] px-5 py-6 sm:px-8 sm:py-7 motion-safe:transition-[opacity,translate] motion-safe:duration-300 motion-safe:ease-out starting:translate-y-2.5 starting:opacity-0"
      >
        {etapa.tipo === 'perfil' && (
          <TelaDoPerfil
            textos={textos}
            perfil={estado.perfil}
            invalidos={estado.invalidos}
            idDoTitulo={ids.titulo}
            idDoCampo={ids.campo}
            refDoTitulo={titulo}
            refDoCampo={(campo, el) => {
              campos.current[campo] = el
            }}
            onPreencher={(campo, valor) => despachar({ tipo: 'preencher', campo, valor })}
          />
        )}
        {etapa.tipo === 'pergunta' && (
          <TelaDaPergunta
            etapa={etapa}
            idDoTitulo={ids.titulo}
            idDaInstrucao={ids.instrucao}
            refDoTitulo={titulo}
            onEscolher={escolher}
          />
        )}
        {etapa.tipo === 'contato' && (
          <TelaDoContato
            estado={estado}
            rascunho={rascunho}
            onDigitar={(campo, valor) => setRascunho((r) => ({ ...r, [campo]: valor }))}
            envio={envio}
            acao={acao}
            enviando={enviando}
            inicio={inicio}
            whatsappUrl={textos.whatsappUrl}
            privacidadeHref={privacidadeHref}
            idDoTitulo={ids.titulo}
            idDoFormulario={ids.formulario}
            idDoCampo={ids.campo}
            refDoTitulo={titulo}
          />
        )}
        {etapa.tipo === 'conclusao' && envio?.ok && (
          <TelaDeConclusao email={envio.email} textos={textos} idDoTitulo={ids.titulo} refDoTitulo={titulo} />
        )}
      </div>

      {/* Na conclusão não há rodapé nem o convite ao WhatsApp: os botões dela
          já são a saída (o `btnB`/`btnN`/`help` escondidos do `render()` do
          HTML). */}
      {!concluido && (
        <>
          {/* No celular os botões ocupam a largura, com o de avançar em cima —
              o `column-reverse` do HTML. */}
          <div className="flex flex-col-reverse gap-3 px-5 sm:flex-row sm:items-center sm:px-8">
            {estado.passo > 0 && (
              <button
                type="button"
                onClick={voltar}
                /* Sair do contato no meio do envio desmontaria o formulário
                   com a resposta a caminho. */
                disabled={enviando}
                className="pill-btn-outline min-h-11 w-full underline-offset-4 focus-visible:bg-primary/10 focus-visible:underline disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <span aria-hidden>←</span> Voltar
              </button>
            )}
            {etapa.tipo === 'contato' ? (
              /* O envio mora no rodapé, no lugar do "Próxima" — é o `btnN` do
                 HTML trocando de texto. `form` o liga ao formulário da tela,
                 que fica acima dele: é atributo nativo, envia também sem
                 JavaScript. O texto é o do HTML, sem a seta. */
              <button
                type="submit"
                form={ids.formulario}
                disabled={enviando}
                className={cn(BOTAO_DE_AVANCAR, 'disabled:cursor-wait')}
              >
                {enviando ? (
                  <>
                    <LoaderCircle size={16} aria-hidden className="animate-spin motion-reduce:animate-none" />
                    Enviando…
                  </>
                ) : falhou ? (
                  'Tentar novamente'
                ) : (
                  'Receber meu diagnóstico'
                )}
              </button>
            ) : (
              <button type="button" onClick={avancar} disabled={!podeAvancar(estado)} className={BOTAO_DE_AVANCAR}>
                {etapa.tipo === 'perfil' ? 'Começar' : 'Próxima'} <span aria-hidden>→</span>
              </button>
            )}
          </div>

          {/* "Prefere conversar?" (FEATURE §5.2 F): o `#aq-help` do HTML, com
              o texto dele. Visível em toda tela do fluxo, menos na conclusão.
              Link externo, nova aba. */}
          <p className="px-5 pb-6 pt-5 text-center text-[13px] leading-normal text-text-muted sm:px-8">
            Gostaria de um atendimento mais personalizado?{' '}
            <a
              href={textos.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-dark underline-offset-4 hover:underline focus-visible:underline dark:text-primary"
            >
              Clique para falar com nossos especialistas da ATRA
            </a>
          </p>
        </>
      )}
    </section>
  )
}

const BOTAO_DE_AVANCAR =
  'pill-btn-primary min-h-11 w-full underline-offset-4 focus-visible:bg-primary-dark focus-visible:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary disabled:active:scale-100 sm:ml-auto sm:w-auto'

/* ---------------------------------------------------------------------
   Telas
   --------------------------------------------------------------------- */

/* O título de cada tela recebe o foco na troca (`tabIndex={-1}`: focável por
   script, fora da ordem do Tab). ⚠️ Tamanho antes da entrelinha: `text-xl`
   também define `line-height`, e o `cn()` descarta um `leading-*` que venha
   antes dele (armadilha do CLAUDE.md). */
const TITULO_DA_TELA = 'mt-3 text-xl md:text-2xl leading-snug text-text-main'

function TelaDoPerfil({
  textos,
  perfil,
  invalidos,
  idDoTitulo,
  idDoCampo,
  refDoTitulo,
  refDoCampo,
  onPreencher,
}: {
  textos: TextosDoQuestionario
  perfil: Perfil
  invalidos: readonly CampoDoPerfil[]
  idDoTitulo: string
  idDoCampo: string
  refDoTitulo: Ref<HTMLHeadingElement>
  refDoCampo: (campo: CampoDoPerfil, el: HTMLSelectElement | null) => void
  onPreencher: (campo: CampoDoPerfil, valor: string) => void
}) {
  return (
    <>
      <Pilula>Perfil da empresa</Pilula>
      <h2 ref={refDoTitulo} id={idDoTitulo} tabIndex={-1} className={TITULO_DA_TELA}>
        {textos.titulo}
      </h2>
      {textos.abertura && <p className="mt-2 text-sm leading-relaxed text-text-muted">{textos.abertura}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPOS_DO_PERFIL.map((campo) => (
          <CampoDeEscolha
            key={campo}
            id={`${idDoCampo}-${campo}`}
            {...CAMPOS[campo]}
            valor={perfil[campo]}
            invalido={invalidos.includes(campo)}
            refDoCampo={(el) => refDoCampo(campo, el)}
            onMudar={(valor) => onPreencher(campo, valor)}
            className={campo === 'setor' ? 'sm:col-span-2' : undefined}
          >
            {campo === 'setor' && <ImpactosDoSetor setor={perfil.setor} />}
          </CampoDeEscolha>
        ))}
      </div>
    </>
  )
}

function TelaDaPergunta({
  etapa,
  idDoTitulo,
  idDaInstrucao,
  refDoTitulo,
  onEscolher,
}: {
  etapa: Extract<Etapa, { tipo: 'pergunta' }>
  idDoTitulo: string
  idDaInstrucao: string
  refDoTitulo: Ref<HTMLHeadingElement>
  onEscolher: (indice: number) => void
}) {
  const { setor, pergunta, numero, total, resposta } = etapa
  const impactos = impactosDaPergunta(pergunta, setor)

  return (
    <>
      <Pilula>{`${pergunta.pilar} · ${numero}/${total}`}</Pilula>
      <h2 ref={refDoTitulo} id={idDoTitulo} tabIndex={-1} className={TITULO_DA_TELA}>
        {pergunta.enunciado}
      </h2>
      <p id={idDaInstrucao} className="mt-2 text-sm leading-relaxed text-text-muted">
        Escolha a alternativa que mais se aproxima da realidade hoje.
      </p>

      {/* `tagChips` do HTML: a área DAMA e as regulações que a pergunta toca,
          filtradas pelo setor; sem nenhuma, a frase de base. */}
      <div role="group" aria-label="Área DAMA e regulações impactadas" className="mt-4 flex flex-wrap items-center gap-1.5">
        <Etiqueta tom="dama" title="Área de conhecimento DAMA-DMBOK">
          DAMA · {pergunta.dama}
        </Etiqueta>
        <span className="ml-1.5 text-[11px] font-medium text-text-muted">Impacta:</span>
        {impactos.length > 0 ? (
          impactos.map((impacto) => (
            <Etiqueta key={impacto.tag} tom="regulacao">
              {impacto.rotulo}
            </Etiqueta>
          ))
        ) : (
          <Etiqueta tom="regulacao">Base para todas as regulações do setor</Etiqueta>
        )}
      </div>

      <GrupoDeAlternativas
        key={pergunta.id}
        className="mt-5"
        alternativas={pergunta.alternativas}
        escolhida={resposta}
        onEscolher={onEscolher}
        rotuladoPor={idDoTitulo}
        descritoPor={idDaInstrucao}
        comAtalhos
      />
    </>
  )
}

/* Contato (`data-screen="lead"` do HTML): textos, rótulos, placeholders e
 * erros do HTML, caractere a caractere (D-22). O envio vai à action da task 025
 * e o botão fica no rodapé do cartão (ver `Questionario`).
 *
 * ⚠️ `noValidate`: a validação é a do `validateLead` do HTML (`validarContato`,
 * a mesma regra da action), com o erro embaixo de cada campo. Sem ele o
 * navegador barraria o envio antes do `onSubmit` com o balão dele, noutra
 * língua e noutra regra — o `type="email"` aceita `ana@gmail.com`. O
 * `required` fica pela semântica: o leitor de tela anuncia "obrigatório". */
function TelaDoContato({
  estado,
  rascunho,
  onDigitar,
  envio,
  acao,
  enviando,
  inicio,
  whatsappUrl,
  privacidadeHref,
  idDoTitulo,
  idDoFormulario,
  idDoCampo,
  refDoTitulo,
}: {
  estado: EstadoDoQuestionario
  rascunho: ValoresEnviados
  onDigitar: <C extends keyof ValoresEnviados>(campo: C, valor: ValoresEnviados[C]) => void
  envio: ResultadoDoDiagnostico | null
  acao: (dados: FormData) => void
  enviando: boolean
  /** `Date.now()` da montagem do questionário; lido só em efeito. */
  inicio: RefObject<number>
  whatsappUrl: string
  privacidadeHref: string
  idDoTitulo: string
  idDoFormulario: string
  idDoCampo: string
  refDoTitulo: Ref<HTMLHeadingElement>
}) {
  const caminho = usePathname()
  const campos = useRef<Partial<Record<CampoValidado, HTMLInputElement | null>>>({})

  /* ⚠️ Carimbo, início e UTM escritos **depois da montagem**, por `ref`, nos
   * escondidos **sem** `defaultValue` — a nota inteira está em
   * `consultores/formulario-de-solicitacao.tsx`: com `defaultValue` o React
   * reaplicava o valor a cada render e apagava o que o `ref` escreveu.
   *
   * ⚠️ O carimbo do anti-spam é o **início do questionário**, e não a montagem
   * desta tela. A armadilha reprova envio com menos de 3 s — e devolve sucesso
   * falso. Medido daqui, quem chega ao contato e usa o preenchimento automático
   * do navegador envia em 2 ou 3 s e perdia o lead sem saber; medido do início,
   * a pessoa já respondeu de 15 a 18 perguntas. É também o que a action supõe
   * ao limitar o tempo de resposta à janela do carimbo. */
  const carimbo = useRef<HTMLInputElement>(null)
  const campoDoInicio = useRef<HTMLInputElement>(null)
  const utm = useRef<HTMLInputElement[]>([])
  useEffect(() => {
    const t = String(inicio.current)
    if (carimbo.current) carimbo.current.value = t
    if (campoDoInicio.current) campoDoInicio.current.value = t
    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [inicio])

  /* ⚠️ Aba esquecida: a mesma armadilha reprova carimbo de mais de 120 min, e
   * de novo com sucesso falso (a lição de `consultores`). Quem começou há mais
   * de 90 min tem o carimbo renovado ao voltar ao formulário — daí até enviar
   * ainda sobra meia hora, e os 3 s passam a valer a partir daqui. */
  const renovarCarimboVelho = () => {
    const campo = carimbo.current
    if (campo && Date.now() - Number(campo.value) > RENOVAR_CARIMBO_APOS_MS) campo.value = String(Date.now())
  }

  /* Erros na tela: os do cliente (`validarContato`) ou os que a action
   * devolveu, e só um dos dois por vez. `de` guarda **qual resposta** já foi
   * superada por algo feito aqui — nova validação ou campo corrigido —, o
   * mesmo expediente da confirmação de `aba-de-pedido.tsx`: a resposta nova do
   * servidor aparece sozinha, sem efeito sincronizando estado. Nasce com a
   * resposta atual: voltar a esta tela não reacende o erro de um envio antigo. */
  const [local, setLocal] = useState<{ de: ResultadoDoDiagnostico | null; erros: ErrosDoContato }>(() => ({
    de: envio,
    erros: {},
  }))
  const respostaNova = local.de !== envio
  const erros: ErrosDoContato = respostaNova ? (envio && !envio.ok ? envio.campos : {}) : local.erros
  /* Falha que não é de campo — banco fora do ar (`falha`), ou perfil e
     respostas recusados (página velha ou envio forjado). */
  const alerta = respostaNova && envio && !envio.ok && envio.codigo !== 'contato' && !enviando ? envio.erro : null

  /* Recusa do servidor por campo (só com o cliente e o servidor divergindo):
     o foco vai ao primeiro, como na validação do cliente. Nada na montagem —
     aí quem recebe o foco é o título. */
  const envioNaMontagem = useRef(envio)
  useEffect(() => {
    if (envio === envioNaMontagem.current || !envio || envio.ok || envio.codigo !== 'contato') return
    const primeiro = CAMPOS_VALIDADOS.find((campo) => envio.campos[campo])
    if (primeiro) campos.current[primeiro]?.focus()
  }, [envio])

  function digitar<C extends keyof ValoresEnviados>(campo: C, valor: ValoresEnviados[C]) {
    onDigitar(campo, valor)
    /* Mexer no campo apaga o erro **dele** (o `input` do HTML tira o
       `is-invalid` só do próprio campo). */
    if (campo !== 'company' && erros[campo as CampoValidado]) {
      const resto = { ...erros }
      delete resto[campo as CampoValidado]
      setLocal({ de: envio, erros: resto })
    }
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    if (enviando) {
      e.preventDefault()
      return
    }
    /* Do `FormData`, e não do rascunho: é exatamente o que vai para a action.
       `preventDefault` aqui cancela também a action (o React confere
       `defaultPrevented` antes de chamá-la). */
    const dados = new FormData(e.currentTarget)
    const novos = validarContato({
      name: String(dados.get('name') ?? ''),
      email: String(dados.get('email') ?? ''),
      phone: String(dados.get('phone') ?? ''),
      consentimento: dados.get('consentimento') !== null,
    })
    const primeiro = CAMPOS_VALIDADOS.find((campo) => novos[campo])
    if (!primeiro) return
    e.preventDefault()
    /* `flushSync`: o erro precisa estar no DOM — e no `aria-describedby` —
       quando o foco chega ao campo, senão o leitor de tela anuncia o campo sem
       dizer o que há de errado nele. */
    flushSync(() => setLocal({ de: envio, erros: novos }))
    campos.current[primeiro]?.focus()
  }

  const idDe = (campo: keyof ValoresEnviados) => `${idDoCampo}-${campo}`
  /* Chamada só de dentro dos `ref` inline, nunca no render — o lint recusa
     uma fábrica de callbacks que toque no `ref` durante o render. */
  function guardarCampo(campo: CampoValidado, el: HTMLInputElement | null) {
    campos.current[campo] = el
  }

  return (
    <>
      <Pilula>Quase lá</Pilula>
      <h2 ref={refDoTitulo} id={idDoTitulo} tabIndex={-1} className={TITULO_DA_TELA}>
        Para onde enviamos o seu diagnóstico?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        Você recebe por e-mail a leitura da maturidade por pilar, os gaps regulatórios do seu setor e recomendações
        práticas da ATRA.
      </p>

      <form
        id={idDoFormulario}
        action={acao}
        onSubmit={aoEnviar}
        onFocus={renovarCarimboVelho}
        noValidate
        aria-busy={enviando}
        className="mt-6"
      >
        {/* ⚠️ Os escondidos vêm **antes** dos campos reais e fora da grade: o
            `space-y-*` do Tailwind 4 (armadilha do CLAUDE.md) e a contagem de
            células do grid não podem ver filho a mais. Nada de `<fieldset>` em
            volta. Perfil e respostas saem do reducer, controlados: mudam com a
            tela e não passam pelo reset do formulário. */}
        <input type="hidden" name="setor" value={estado.setorDasRespostas ?? ''} />
        <input type="hidden" name="porte" value={estado.perfil.porte ?? ''} />
        <input type="hidden" name="cargo" value={estado.perfil.cargo ?? ''} />
        <input type="hidden" name="respostas" value={JSON.stringify(estado.respostas)} />
        <input type="hidden" name="source" value={caminho ?? ''} />
        <input ref={campoDoInicio} type="hidden" name="inicio" />
        <input ref={carimbo} type="hidden" name="carimbo" />
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
          <label htmlFor={`${idDoCampo}-${CAMPO_ISCA}`}>Não preencha este campo</label>
          <input id={`${idDoCampo}-${CAMPO_ISCA}`} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CampoDeTexto
            id={idDe('name')}
            nome="name"
            rotulo="Nome completo"
            type="text"
            autoComplete="name"
            required
            placeholder="Como devemos te chamar"
            valorInicial={rascunho.name}
            erro={erros.name}
            refDoCampo={(el) => guardarCampo('name', el)}
            onMudar={(valor) => digitar('name', valor)}
            className="sm:col-span-2"
          />
          <CampoDeTexto
            id={idDe('email')}
            nome="email"
            rotulo="E-mail corporativo"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="voce@suaempresa.com.br"
            valorInicial={rascunho.email}
            erro={erros.email}
            refDoCampo={(el) => guardarCampo('email', el)}
            onMudar={(valor) => digitar('email', valor)}
          />
          <CampoDeTexto
            id={idDe('phone')}
            nome="phone"
            rotulo="Telefone / WhatsApp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="(11) 99999-9999"
            valorInicial={rascunho.phone}
            erro={erros.phone}
            refDoCampo={(el) => guardarCampo('phone', el)}
            onMudar={(valor) => digitar('phone', valor)}
          />
          <CampoDeTexto
            id={idDe('company')}
            nome="company"
            rotulo={
              <>
                Empresa <small className="text-[13px] font-medium text-text-muted">(opcional)</small>
              </>
            }
            type="text"
            autoComplete="organization"
            placeholder="Razão social ou nome fantasia"
            valorInicial={rascunho.company}
            onMudar={(valor) => digitar('company', valor)}
            className="sm:col-span-2"
          />

          {/* Consentimento (`#aq-consent`), com o texto do HTML. A política
              abre em **nova aba**: na mesma, a pessoa perdia o questionário
              inteiro, que só existe na memória da página.
              ⚠️ P-14: o texto e a política publicada são pré-requisito de
              produção (LGPD); a pendência segue aberta. */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-normal text-text-muted">
              <input
                ref={(el) => guardarCampo('consentimento', el)}
                id={idDe('consentimento')}
                type="checkbox"
                name="consentimento"
                required
                defaultChecked={rascunho.consentimento}
                onChange={(e) => digitar('consentimento', e.target.checked)}
                aria-invalid={erros.consentimento ? true : undefined}
                aria-describedby={erros.consentimento ? `${idDe('consentimento')}-erro` : undefined}
                className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-primary aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-2 aria-[invalid=true]:outline-red-500"
              />
              <span>
                Autorizo a ATRA a entrar em contato e a tratar meus dados conforme a{' '}
                <a
                  href={privacidadeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary-dark underline underline-offset-2 dark:text-primary"
                >
                  Política de Privacidade
                </a>{' '}
                (LGPD).
              </span>
            </label>
            {erros.consentimento && (
              <p id={`${idDe('consentimento')}-erro`} className="text-xs text-red-600 dark:text-red-400">
                {erros.consentimento}
              </p>
            )}
          </div>
        </div>

        {/* `#aq-send-error` do HTML: o texto vem da action. O WhatsApp é a
            saída que o próprio texto promete. */}
        {alerta && (
          <div role="alert" className="mt-5 rounded-[6px] bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-700 dark:text-red-300">
            {alerta}{' '}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2"
            >
              Falar no WhatsApp
            </a>
          </div>
        )}
      </form>
    </>
  )
}

/** Ver `renovarCarimboVelho`: 30 min antes da janela de 120 do anti-spam. */
const RENOVAR_CARIMBO_APOS_MS = 90 * 60 * 1000

/* Conclusão (`data-screen="done"` do HTML), **sem** o "Ver meu resultado
 * agora" (`#aq-cta-resultado`): o resultado vai só por e-mail (decisão de
 * 26/09), e nenhum número dele passa por esta tela — a action devolve só o
 * endereço.
 *
 * Título e botões são do HTML. "Enviamos o seu resultado para…" é da FEATURE
 * (§4.1, passo 6); o parágrafo seguinte é o `doneMessage` do global (vazio =
 * sem parágrafo). ⚠️ A linha da caixa de spam foi escrita pela engenharia —
 * o HTML não tem texto para ela —, e trocá-la é decisão do marketing (D-22). */
function TelaDeConclusao({
  email,
  textos,
  idDoTitulo,
  refDoTitulo,
}: {
  email: string
  textos: TextosDoQuestionario
  idDoTitulo: string
  refDoTitulo: Ref<HTMLHeadingElement>
}) {
  return (
    <div className="flex flex-col items-center pt-2 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
        <Check size={30} strokeWidth={3} aria-hidden />
      </span>
      <h2 ref={refDoTitulo} id={idDoTitulo} tabIndex={-1} className={cn(TITULO_DA_TELA, 'mt-4')}>
        Diagnóstico registrado. Obrigado!
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
        Enviamos o seu resultado para <strong className="break-all font-semibold text-text-main">{email}</strong>
      </p>
      {textos.conclusao && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">{textos.conclusao}</p>
      )}
      <p className="mt-2 max-w-xl text-[13px] leading-normal text-text-muted">
        Não encontrou o e-mail? Confira também a caixa de spam ou de lixo eletrônico.
      </p>

      {/* `#aq-cta-wa` e `#aq-cta-agenda`, com os textos do HTML. A agenda só
          existe com link no global. Os dois abrem em nova aba, como lá. */}
      <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        <a
          href={textos.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn-primary min-h-11 underline-offset-4 focus-visible:bg-primary-dark focus-visible:underline"
        >
          <MessageCircle size={16} aria-hidden /> Falar no WhatsApp
        </a>
        {textos.agendaUrl && (
          <a
            href={textos.agendaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn-outline min-h-11 bg-surface-1 underline-offset-4 focus-visible:underline"
          >
            <CalendarDays size={16} aria-hidden /> Agendar com um especialista
          </a>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------
   Peças
   --------------------------------------------------------------------- */

/* Sem borda e sem sombra interna: o campo se separa do cartão pelo tom
   recuado (`surface-1` dentro do `surface-2`). `scheme-*` põe a lista nativa
   do `<select>` no tema certo — sem ele, o menu aberto sai branco no escuro.
   `py-3` com `text-sm` dá os 44 px de área de toque. */
const CAMPO =
  'w-full cursor-pointer appearance-none rounded-[6px] bg-surface-1 py-3 pl-4 pr-10 text-sm text-text-main scheme-light dark:scheme-dark transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/70'

function CampoDeEscolha({
  id,
  rotulo,
  erro,
  opcoes,
  valor,
  invalido,
  refDoCampo,
  onMudar,
  className,
  children,
}: {
  id: string
  rotulo: string
  erro: string
  opcoes: readonly OpcaoDoPerfil<string>[]
  valor: string | null
  invalido: boolean
  refDoCampo: (el: HTMLSelectElement | null) => void
  onMudar: (valor: string) => void
  className?: string
  children?: ReactNode
}) {
  const idDoErro = `${id}-erro`
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-text-subtle">
        {rotulo}
      </label>
      <div className="relative">
        <select
          ref={refDoCampo}
          id={id}
          required
          value={valor ?? ''}
          onChange={(e) => onMudar(e.target.value)}
          aria-invalid={invalido || undefined}
          aria-describedby={invalido ? idDoErro : undefined}
          className={CAMPO}
        >
          <option value="">Selecione…</option>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </div>
      {invalido && (
        <p id={idDoErro} className="text-xs text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}
      {children}
    </div>
  )
}

/* O campo de texto do contato, no mesmo desenho do `<select>` do perfil: tom
   recuado sem borda, anel no foco e no erro. Não controlado — o valor inicial
   é o rascunho que o questionário guarda (ver `rascunho` lá em cima). */
const CAMPO_DE_TEXTO =
  'w-full rounded-[6px] bg-surface-1 px-4 py-3 text-sm text-text-main placeholder:text-text-muted transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/70'

function CampoDeTexto({
  id,
  nome,
  rotulo,
  type,
  autoComplete,
  inputMode,
  required = false,
  placeholder,
  valorInicial,
  erro,
  refDoCampo,
  onMudar,
  className,
}: {
  id: string
  nome: string
  rotulo: ReactNode
  type: 'text' | 'email' | 'tel'
  autoComplete: string
  inputMode?: 'email' | 'tel'
  required?: boolean
  placeholder: string
  valorInicial: string
  erro?: string
  refDoCampo?: (el: HTMLInputElement | null) => void
  onMudar: (valor: string) => void
  className?: string
}) {
  const idDoErro = `${id}-erro`
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-text-subtle">
        {rotulo}
      </label>
      <input
        ref={refDoCampo}
        id={id}
        name={nome}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        defaultValue={valorInicial}
        onChange={(e) => onMudar(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idDoErro : undefined}
        className={CAMPO_DE_TEXTO}
      />
      {erro && (
        <p id={idDoErro} className="text-xs text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}
    </div>
  )
}

/* "Impactos avaliados: … entre outros" (`sectorImpactChips`). Região viva e
   atômica: ao escolher o setor, o leitor de tela lê a linha inteira, e não só
   a etiqueta que mudou. Com o setor da URL ela já nasce preenchida no HTML do
   servidor. */
function ImpactosDoSetor({ setor }: { setor: Setor | null }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {setor && (
        <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-text-muted">Impactos avaliados:</span>
          {impactosDoSetor(setor).map((impacto) => (
            <Etiqueta key={impacto.tag} tom="regulacao">
              {impacto.rotulo}
            </Etiqueta>
          ))}
          <span className="text-[11px] font-medium text-text-muted">entre outros</span>
        </p>
      )}
    </div>
  )
}

/* Pílula de topo de tela (`.aq-pilar`): o `StatusBadge` do site com o ponto
   fixo do HTML — o pulsante do badge seria movimento sem motivo.
   ⚠️ `text-primary-dark` no claro: o azul da marca sobre o azul tonal dá
   2,7:1, pouco para 11 px (o azul profundo dá 4,25:1); o escuro fica com o
   azul da marca. */
function Pilula({ children }: { children: string }) {
  return (
    <StatusBadge
      label={children}
      variant="primary"
      icon={<span aria-hidden className="size-1.5 rounded-full bg-primary" />}
      className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary-dark dark:text-primary"
    />
  )
}

/* Etiquetas sem borda, raio de chip (4 px). O laranja das regulações segue o
   `warm-ink` do HTML no claro — o laranja da marca sobre fundo claro não se lê
   em 11 px — e volta ao laranja da marca no escuro. */
const TONS = {
  regulacao: 'bg-secondary/10 text-amber-800 dark:text-secondary',
  dama: 'bg-primary/10 text-primary-dark dark:text-primary',
} as const

function Etiqueta({ tom, title, children }: { tom: keyof typeof TONS; title?: string; children: ReactNode }) {
  return (
    <span
      title={title}
      className={cn('inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-semibold leading-snug', TONS[tom])}
    >
      {children}
    </span>
  )
}
