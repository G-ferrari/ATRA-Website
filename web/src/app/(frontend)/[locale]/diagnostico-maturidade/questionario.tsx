'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useReducer, useRef, type KeyboardEvent, type ReactNode, type Ref } from 'react'

import { StatusBadge } from '@/components/ui'
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
  type Perfil,
} from '@/lib/diagnostico-maturidade/questionario'
import { congelado } from '@/lib/e2e'
import { cn } from '@/lib/utils'
import type { DiagnosticoDeMaturidade } from '@/types/content'

import { GrupoDeAlternativas } from './alternativas'
import { BarraDeProgresso } from './barra-de-progresso'

/* Ilha do Diagnóstico de Maturidade de Dados (task 026): perfil → perguntas do
 * setor → contato. O fluxo e os textos são os do HTML do Roger (v1.7),
 * caractere a caractere (D-22); o desenho é o do site (DESIGN.md).
 *
 * Estado só no cliente, num reducer puro (`lib/diagnostico-maturidade/
 * questionario.ts`, testado à parte). Nada vai ao servidor até o envio, que é a
 * task 027 — e ela recebe `estado.respostas` no formato que a action da 025 lê.
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

export type TextosDoQuestionario = Pick<DiagnosticoDeMaturidade, 'titulo' | 'abertura' | 'whatsappUrl'>

export function Questionario({
  textos,
  setorInicial,
}: {
  textos: TextosDoQuestionario
  /** `?setor=` já validado pela página; `null` abre o perfil sem setor. */
  setorInicial: Setor | null
}) {
  const [estado, despachar] = useReducer(questionario, setorInicial, estadoInicial)
  const etapa = etapaAtual(estado)
  const rotulo = rotuloDaEtapa(etapa)

  const id = useId()
  const ids = { marca: `${id}-marca`, titulo: `${id}-titulo`, instrucao: `${id}-instrucao`, campo: `${id}-campo` }

  const cartao = useRef<HTMLElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const campos = useRef<Partial<Record<CampoDoPerfil, HTMLSelectElement | null>>>({})
  const avanco = useRef<number | undefined>(undefined)
  const passoMostrado = useRef(estado.passo)

  /* Troca de tela: o foco vai para o título da tela nova. Sem isto, quem
     escolheu pelo teclado fica com o foco num botão que acabou de sumir — e o
     navegador o devolve ao `<body>`, no topo da página. O cartão volta à vista
     só se o topo dele saiu dela (o `scrollIntoView` do HTML, sem o solavanco
     quando já está visível). */
  useEffect(() => {
    if (passoMostrado.current === estado.passo) return
    passoMostrado.current = estado.passo
    titulo.current?.focus({ preventScroll: true })
    const el = cartao.current
    if (el && el.getBoundingClientRect().top < TOPO_VISIVEL_PX) {
      el.scrollIntoView({ block: 'start', behavior: movimentoReduzido() ? 'instant' : 'smooth' })
    }
  }, [estado.passo])

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
     próprio Enter — nas alternativas, ele escolhe. */
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
    if (e.key === 'Enter' && !(e.target as HTMLElement).closest('button, a')) {
      e.preventDefault()
      avancar()
    }
  }

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
        <BarraDeProgresso className="mt-3.5" valor={progresso(estado)} rotuladoPor={ids.marca} textoDoValor={rotulo} />
      </div>

      {/* `key` pelo passo: cada tela entra montada do zero, e o
          `@starting-style` (`starting:`) faz o fade de entrada do HTML sem JS
          de animação. */}
      <div
        key={estado.passo}
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
        {etapa.tipo === 'contato' && <TelaDoContato idDoTitulo={ids.titulo} refDoTitulo={titulo} />}
      </div>

      {/* No celular os botões ocupam a largura, com o de avançar em cima — o
          `column-reverse` do HTML. */}
      <div className="flex flex-col-reverse gap-3 px-5 sm:flex-row sm:items-center sm:px-8">
        {estado.passo > 0 && (
          <button
            type="button"
            onClick={voltar}
            className="pill-btn-outline min-h-11 w-full underline-offset-4 focus-visible:bg-primary/10 focus-visible:underline sm:w-auto"
          >
            <span aria-hidden>←</span> Voltar
          </button>
        )}
        {etapa.tipo !== 'contato' && (
          <button
            type="button"
            onClick={avancar}
            disabled={!podeAvancar(estado)}
            className="pill-btn-primary min-h-11 w-full underline-offset-4 focus-visible:bg-primary-dark focus-visible:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary disabled:active:scale-100 sm:ml-auto sm:w-auto"
          >
            {etapa.tipo === 'perfil' ? 'Começar' : 'Próxima'} <span aria-hidden>→</span>
          </button>
        )}
      </div>

      {/* "Prefere conversar?" (FEATURE §5.2 F): o `#aq-help` do HTML, com o
          texto dele. Visível em toda tela do fluxo — a conclusão da 027 é que
          o esconde, como no HTML. Link externo, nova aba. */}
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
    </section>
  )
}

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

/* ⚠️ MARCADOR da task 027. Esta tela vira o formulário de contato ("Para onde
   enviamos o seu diagnóstico?", do HTML), com envio pela action da task 025;
   até lá o fluxo termina aqui, e o botão de avançar some. "Quase lá" é o texto
   do HTML para esta tela; o título é provisório e sai com a 027. */
function TelaDoContato({ idDoTitulo, refDoTitulo }: { idDoTitulo: string; refDoTitulo: Ref<HTMLHeadingElement> }) {
  return (
    <>
      <Pilula>Quase lá</Pilula>
      <h2 ref={refDoTitulo} id={idDoTitulo} tabIndex={-1} className={TITULO_DA_TELA}>
        Próxima etapa: seus dados
      </h2>
    </>
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
