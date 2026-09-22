'use client'

import { Award, ArrowRight, Check, Filter, GraduationCap, HelpCircle, Search, UserCheck, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { GlowCard, StatusBadge } from '@/components/ui'
import {
  alternarPerfil,
  exibicao,
  filtrarPerfis,
  total,
  type PerfilComCobertura,
} from '@/lib/consultores'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { ConsultantRole } from '@/types/content'

import { ChamadaSobMedida } from './chamada-sob-medida'
import { gradienteDe } from './gradientes'
import { TagsRecolhiveis, type Limite } from './tags-recolhiveis'
import { useSolicitacao } from './solicitacao-contexto'

/* Filtros e catálogo — porte de `legacy/src/pages/Consultants.tsx:438` e `:521`.
 *
 * Ilha cliente: busca, senioridade e especialidade rodam no cliente, como no
 * legado. Recebe os perfis prontos — não consulta o CMS.
 *
 * ⚠️ A especialidade é uma **pílula**, não um `select`. A primeira versão desta
 * ilha usou dois `select` lado a lado, o que muda a altura da seção em ~300px e
 * foi parte dos 57% que faltavam na rota.
 *
 * O modal de "Detalhes" nasce fechado, então não entra na regressão visual —
 * mas o **botão** entra, e sem ele o rodapé de cada card ficava mais estreito. */

const TEXTOS = {
  pt: {
    filtrar: 'Filtre por Especialidade & Tecnologia',
    buscar: 'Buscar cargo, tag ou tecnologia...',
    senioridade: 'Senioridade:',
    todas: 'Todas',
    todos: 'Todos',
    modo: 'Perfis que tenham',
    modoOu: 'Qualquer uma',
    modoE: 'Todas estas',
    cobremTudo: (n: number) => `${n} ${n === 1 ? 'cobre' : 'cobrem'} tudo`,
    cobremParte: (n: number) => `${n} ${n === 1 ? 'cobre' : 'cobrem'} parte`,
    parteTitulo: 'Cobrem parte do que você marcou',
    parteTexto: 'Estes trazem só uma parte — dá para pedir mais de um perfil na mesma solicitação.',
    avisoTitulo: 'Nenhum perfil reúne tudo o que você marcou',
    avisoTexto: 'Nenhum perfil sozinho reúne tudo — combine dois na mesma solicitação.',
    selo: (n: number, de: number) => `cobre ${n} de ${de}`,
    titulo: 'Perfis Especializados Disponíveis',
    exibindo: (n: number) => `Exibindo ${n} ${n === 1 ? 'perfil especializado' : 'perfis especializados'}`,
    ativos: 'Filtros ativos:',
    especialidadesAMais: 'especialidades a mais',
    tecnologiasAMais: (perfil: string) => `tecnologias a mais em ${perfil}`,
    menos: 'Mostrar menos',
    limpar: 'Limpar filtros',
    vazioTitulo: 'Nenhum perfil encontrado',
    vazioTexto: 'Não encontramos perfis com os filtros aplicados. Tente alterar os critérios de busca.',
    resetar: 'Resetar Filtros',
    /* Cópia do dono da ATRA, do feedback de 20/09, tal como veio (D-22). */
    ecossistema: 'no ecossistema',
    noTime: 'no time',
    solicitar: 'Solicitar',
    naLista: 'Na solicitação',
    nomeSolicitar: (perfil: string) => `Solicitar: ${perfil}`,
    nomeNaLista: (perfil: string) => `Na solicitação: ${perfil} — clique para remover`,
    jaNaLista: 'Já está na sua solicitação',
    detalhes: 'Detalhes',
    nivel: 'Nível',
    certificacoes: 'Certificações do time ATRA neste Perfil',
    tecnologias: 'Tecnologias de Domínio',
    fechar: 'Fechar',
    solicitarPerfil: 'Solicitar este Profissional',
  },
  en: {
    filtrar: 'Filter by specialty & technology',
    buscar: 'Search role, tag or technology...',
    senioridade: 'Seniority:',
    todas: 'All',
    todos: 'All',
    modo: 'Profiles that have',
    modoOu: 'Any of these',
    modoE: 'All of these',
    cobremTudo: (n: number) => `${n} cover${n === 1 ? 's' : ''} everything`,
    cobremParte: (n: number) => `${n} cover${n === 1 ? 's' : ''} part`,
    parteTitulo: 'Cover part of what you selected',
    parteTexto: 'These bring only part of it — you can request more than one profile at once.',
    avisoTitulo: 'No profile has everything you selected',
    avisoTexto: 'No single profile has it all — combine two in the same request.',
    selo: (n: number, de: number) => `covers ${n} of ${de}`,
    titulo: 'Available specialist profiles',
    exibindo: (n: number) => `Showing ${n} ${n === 1 ? 'profile' : 'profiles'}`,
    ativos: 'Active filters:',
    especialidadesAMais: 'more specialties',
    tecnologiasAMais: (perfil: string) => `more technologies in ${perfil}`,
    menos: 'Show less',
    limpar: 'Clear filters',
    vazioTitulo: 'No profile found',
    vazioTexto: 'No profiles match the filters. Try changing the search criteria.',
    resetar: 'Reset filters',
    ecossistema: 'in the ecosystem',
    noTime: 'on the team',
    solicitar: 'Request',
    naLista: 'In your request',
    nomeSolicitar: (perfil: string) => `Request: ${perfil}`,
    nomeNaLista: (perfil: string) => `In your request: ${perfil} — click to remove`,
    jaNaLista: 'Already in your request',
    detalhes: 'Details',
    nivel: 'Level',
    certificacoes: 'ATRA team certifications for this profile',
    tecnologias: 'Core technologies',
    fechar: 'Close',
    solicitarPerfil: 'Request this professional',
  },
} as const

const TODOS = '__todos__'

/* Quantas especialidades o filtro mostra recolhido (task 019), por faixa de
 * largura. Medido com as 35 tags de hoje e o "Todas" à frente: cabem 4 a 5 por
 * linha a 375px, 8 a 640, 10 a 768, 14 a 1024 e 18 a 1280. Conferido depois:
 * duas linhas a 375 e uma a 640, 768, 1024 e 1280, com o "+N ⌄" no fim.
 * ⚠️ Tag de nome comprido entrando no começo da lista (a ordem é alfabética)
 * pode empurrar o "+N" para a linha de baixo — reconferir se o catálogo mudar
 * muito. */
const LIMITE_DO_FILTRO: Limite = { base: 7, sm: 6, md: 7, lg: 11, xl: 15 }

/* As 7 de sempre do card, que o legado já cortava (`Consultants.tsx:604`). */
const LIMITE_DO_CARD = 7

/* ⚠️ Ordem fixa, espelhando as opções do `level` em `collections/SpecialistRoles.ts`
 * — e **não** derivada dos perfis semeados. O legado lista as três sempre
 * (`Consultants.tsx:59`), e hoje nenhum perfil é "Pleno": derivar dos dados
 * fazia a pílula sumir, o que é uma melhoria, mas muda o pixel. Mesmo caso de
 * `GRADIENTES` (`gradientes.ts`), que também espelha um `select` do schema. */
const SENIORIDADES = ['Senior', 'Pleno', 'Lead / Principal'] as const

/* ⚠️ `Set` não dispara render por mutação — cada alternância devolve um conjunto
 * novo. `delete` responde se removeu, então serve de teste e de remoção.
 *
 * ⚠️ E quem chama tem de usar a forma **funcional** do `setState`. Ler
 * `tagsMarcadas` do render e passar o resultado perde atualização: dois cliques
 * no mesmo tick partem os dois do mesmo conjunto antigo, e o segundo sobrescreve
 * o primeiro. Com o dedo não aparece — há render entre um clique e outro —, mas
 * aparece em teste que clica em sequência, e foi assim que isto foi pego:
 * marcar GCP, FinOps e PySpark de uma vez deixava só PySpark. */
function alternarEm(atual: ReadonlySet<string>, valor: string): ReadonlySet<string> {
  const novo = new Set(atual)
  if (!novo.delete(valor)) novo.add(valor)
  return novo
}

const PILULA_ATIVA = 'bg-primary text-white font-semibold shadow-xs'
const PILULA_INATIVA =
  'bg-surface-1 text-text-muted hover:text-text-main '

export function ListaDeConsultores({
  perfis,
  locale,
}: {
  perfis: ConsultantRole[]
  locale: Locale
}) {
  const t = TEXTOS[locale]
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState<ConsultantRole | null>(null)
  const [tagsMarcadas, setTagsMarcadas] = useState<ReadonlySet<string>>(new Set())
  const [niveisMarcados, setNiveisMarcados] = useState<ReadonlySet<string>>(new Set())
  const [modo, setModo] = useState<'ou' | 'e'>('ou')
  /* O carrinho vem do provedor, e não de um `useState` daqui: a aba de pedido,
   * onde ele é revisto e enviado, precisa ler o mesmo carrinho (tasks 013 e
   * 018 — ver `solicitacao-contexto.tsx`).
   *
   * ⚠️ Como os `Set` do filtro: `Map` não dispara render por mutação, e o
   * `setState` é sempre **funcional** — e o valor novo sai de `atual`, **nunca
   * do render**. `(atual) => definirQuantidade(atual, slug, quantidade + 1)`
   * parece funcional e não é: `quantidade` é do render. Use `ajustarQuantidade`.
   * Ver a nota em `lib/consultores.ts`. */
  const { escolhidos, setEscolhidos, aoAdicionar } = useSolicitacao()

  /* A lista de especialidades **é** derivada dos perfis: no legado é uma
   * literal de 36 tags (`Consultants.tsx:50`) que sai de sincronia na primeira
   * vez que alguém acrescenta um perfil pelo admin, e as tags semeadas dão
   * exatamente o mesmo conjunto. */
  const especialidades = useMemo(() => [...new Set(perfis.flatMap((p) => p.tags))].sort(), [perfis])
  const senioridades = SENIORIDADES

  /* A regra vive em `lib/consultores.ts` — ver lá por que ela **não** conhece o
   * modo: `OU` e `E` devolvem o mesmo conjunto, e só a leitura muda. */
  const resultado = useMemo(
    () => filtrarPerfis({ perfis, tags: tagsMarcadas, niveis: niveisMarcados, busca }),
    [perfis, tagsMarcadas, niveisMarcados, busca],
  )
  const visiveis = total(resultado)
  /* Como isto é lido na tela é decisão de `exibicao`, não da ilha: escrita aqui,
   * ela passou sem teste e produziu uma faixa dizendo "nenhum perfil reúne tudo"
   * com dois perfis que reúnem renderizados logo acima. */
  const vista = exibicao(resultado, modo)

  const limpar = () => {
    setTagsMarcadas(new Set())
    setNiveisMarcados(new Set())
    setBusca('')
  }
  const temFiltro = tagsMarcadas.size > 0 || niveisMarcados.size > 0 || busca !== ''

  /* O cartão é o mesmo nos dois grupos; só os parciais ganham o selo de
   * cobertura. Função local, e não componente à parte, porque depende de
   * quatro estados da ilha e não é reutilizada fora daqui. */
  const cartao = ({ perfil: p, cobertura }: PerfilComCobertura, selo: boolean) => (
    <GlowCard
      key={p.slug}
      glowColor="blue"
      customSize
      radius={6}
      className="p-5 sm:p-6 md:p-7 bg-surface-2 text-text-main shadow-sm flex flex-col justify-between h-full rounded-[6px]  hover:border-primary/40 transition-all duration-300 group"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={cn(
                'w-10 h-10 sm:w-11 sm:h-11 rounded-[6px] bg-linear-to-br flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0',
                gradienteDe(p.gradient),
              )}
            >
              {p.code}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-text-main leading-snug group-hover:text-primary transition-colors truncate">
                  {p.role}
                </h3>
                <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {p.level}
                </span>
                {/* ⚠️ Par claro/escuro, ao contrário da pílula de nível ao lado.
                    O laranja da marca sobre `bg-secondary/10` mede 7,34:1 no
                    escuro e **2,35:1 no claro** — seria o pior contraste da
                    página. Elemento novo não tem gabarito a honrar, então aqui
                    o par vale (mesmo caso do âmbar em `page.tsx`). */}
                {selo && (
                  <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-secondary/10 text-amber-700 dark:text-secondary border border-secondary/20 shrink-0">
                    {t.selo(cobertura, resultado.alvo)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted bg-surface-1 px-3 py-1 rounded-[4px]  font-semibold shrink-0">
            <Users size={12} className="text-primary" aria-hidden />
            <span>
              {p.ecosystem} {t.ecossistema}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-4 line-clamp-2">
          {p.description}
        </p>

        {/* O "+N" deixou de ser só texto: abre as tecnologias deste card, e
            "Mostrar menos" fecha (task 019). Tag marcada no filtro fica à mostra
            mesmo recolhida. */}
        <TagsRecolhiveis
          className="flex flex-wrap gap-2 mb-5"
          itens={p.tags}
          limite={LIMITE_DO_CARD}
          fixos={tagsMarcadas}
          mais={t.tecnologiasAMais(p.role)}
          menos={
            <>
              {t.menos}
              <span className="sr-only">: {p.role}</span>
            </>
          }
          classeDoControle="text-[11px] px-2 py-1 rounded-[4px] bg-surface-1 text-text-muted hover:text-text-main transition-colors cursor-pointer"
          item={(tag, visivel) => (
            <span
              key={tag}
              className={cn(
                'text-[11px] px-2.5 py-1 rounded-[4px] transition-colors font-medium',
                tagsMarcadas.has(tag)
                  ? PILULA_ATIVA
                  : 'bg-surface-1 text-text-muted  hover:text-text-main',
                visivel,
              )}
            >
              {tag}
            </span>
          )}
        />
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
        <span className="sm:hidden text-xs text-text-muted flex items-center gap-1.5">
          <Users size={12} className="text-primary" aria-hidden /> {p.ecosystem} {t.noTime}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => setAberto(p)}
            className="py-2 px-3.5 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-main  text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle size={14} className="text-primary" aria-hidden />
            <span>{t.detalhes}</span>
          </button>

          {/* Deixa de levar a /contato: o link genérico perdia o perfil que o
              visitante estava olhando, que é metade do que o feedback pediu. */}
          <button
            type="button"
            /* ⚠️ Sem `aria-pressed`: o rótulo já muda com o estado, e os dois
               juntos fazem o leitor anunciar o estado duas vezes (APG). O nome
               acessível **contém** o texto visível (WCAG 2.5.3) e acrescenta o
               perfil — eram oito "Solicitar" idênticos — e o que o clique faz. */
            aria-label={escolhidos.has(p.slug) ? t.nomeNaLista(p.role) : t.nomeSolicitar(p.role)}
            data-solicitar={p.slug}
            onClick={() => {
              /* Ler `escolhidos` do render aqui é só para decidir o efeito
                 (abrir a aba); o carrinho novo continua saindo de `atual`. */
              const adicionando = !escolhidos.has(p.slug)
              setEscolhidos((atual) => alternarPerfil(atual, p.slug))
              if (adicionando) aoAdicionar()
            }}
            className={cn(
              'py-2 px-4 rounded-[6px] text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs',
              escolhidos.has(p.slug)
                ? 'bg-surface-1 text-text-main'
                : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20',
            )}
          >
            <span>{escolhidos.has(p.slug) ? t.naLista : t.solicitar}</span>
            {escolhidos.has(p.slug) ? (
              <Check size={14} className="text-emerald-500" aria-hidden />
            ) : (
              <ArrowRight size={14} aria-hidden />
            )}
          </button>
        </div>
      </div>
    </GlowCard>
  )

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="bg-surface-2  rounded-[6px] p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-primary" aria-hidden />
              <h2 className="text-xs sm:text-sm font-bold text-text-main">{t.filtrar}</h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden
              />
              <input
                type="text"
                placeholder={t.buscar}
                aria-label={t.buscar}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-1  rounded-[6px] text-xs font-normal text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold text-text-muted uppercase mr-1 shrink-0">
              {t.senioridade}
            </span>
            {[TODOS, ...senioridades].map((s) => {
              /* "Todos" não é um valor: é o conjunto vazio, e fica aceso quando
                 nenhum nível está marcado. */
              const ativo = s === TODOS ? niveisMarcados.size === 0 : niveisMarcados.has(s)
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() =>
                    setNiveisMarcados((atual) => (s === TODOS ? new Set() : alternarEm(atual, s)))
                  }
                  className={cn(
                    'px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer',
                    ativo ? PILULA_ATIVA : cn(PILULA_INATIVA, 'hover:bg-surface-3'),
                  )}
                >
                  {s === TODOS ? t.todos : s}
                </button>
              )
            })}
          </div>

          {/* ⚠️ O alternador muda a **leitura**, não o conjunto: ver a nota em
              `lib/consultores.ts`. Em `E` os que cobrem tudo sobem e os demais
              ficam sob a faixa de parciais, em vez de a lista esvaziar. */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase mr-1 shrink-0">
              {t.modo}
            </span>
            <div className="flex gap-1" role="group" aria-label={t.modo}>
              {(['ou', 'e'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={modo === m}
                  onClick={() => setModo(m)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer',
                    modo === m ? PILULA_ATIVA : cn(PILULA_INATIVA, 'hover:bg-surface-3'),
                  )}
                >
                  {m === 'ou' ? t.modoOu : t.modoE}
                </button>
              ))}
            </div>
          </div>

          {/* ⚠️ Recolhe em vez de rolar (task 019). Era uma caixa de altura fixa
              com rolagem interna (`max-h-28 overflow-y-auto`), herança do
              protótipo: no celular, 36 tags em 8 linhas dentro de 112px, e a
              roda do mouse ficava presa nela. */}
          <TagsRecolhiveis
            className="flex flex-wrap gap-1.5"
            itens={especialidades}
            limite={LIMITE_DO_FILTRO}
            fixos={tagsMarcadas}
            mais={t.especialidadesAMais}
            menos={t.menos}
            classeDoControle={cn(
              'px-2 py-0.5 rounded-[4px] text-[10.5px] transition-all duration-200 cursor-pointer whitespace-nowrap',
              PILULA_INATIVA,
              'hover:bg-surface-3',
            )}
            antes={
              <button
                type="button"
                aria-pressed={tagsMarcadas.size === 0}
                onClick={() => setTagsMarcadas(new Set())}
                className={cn(
                  'px-2 py-0.5 rounded-[4px] text-[10.5px] transition-all duration-200 cursor-pointer whitespace-nowrap',
                  tagsMarcadas.size === 0 ? PILULA_ATIVA : cn(PILULA_INATIVA, 'hover:bg-surface-3'),
                )}
              >
                {t.todas}
              </button>
            }
            item={(e, visivel) => (
              <button
                key={e}
                type="button"
                aria-pressed={tagsMarcadas.has(e)}
                onClick={() => setTagsMarcadas((atual) => alternarEm(atual, e))}
                className={cn(
                  'px-2 py-0.5 rounded-[4px] text-[10.5px] transition-all duration-200 cursor-pointer whitespace-nowrap',
                  tagsMarcadas.has(e) ? PILULA_ATIVA : cn(PILULA_INATIVA, 'hover:bg-surface-3'),
                  visivel,
                )}
              >
                {e}
              </button>
            )}
          />

          {temFiltro && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span>
                {t.ativos}{' '}
                {[...tagsMarcadas].map((e) => (
                  <strong key={e} className="text-primary font-semibold mr-2">
                    {e}
                  </strong>
                ))}
                {[...niveisMarcados].map((s) => (
                  <strong key={s} className="text-secondary font-semibold mr-2">
                    [{s}]
                  </strong>
                ))}
                {busca && <span className="text-amber-400 font-semibold">&quot;{busca}&quot;</span>}
              </span>
              <button
                type="button"
                onClick={limpar}
                className="text-primary hover:underline font-medium cursor-pointer text-xs"
              >
                {t.limpar}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold font-display text-text-main">{t.titulo}</h2>
            {/* Em `E` o contador responde "quem cobre tudo?" — inclusive com
                zero, que é informação, não falha. Metade nula fica de fora. */}
            <p className="text-xs text-text-muted font-light mt-0.5">
              {modo === 'e' && resultado.alvo > 0
                ? [
                    t.cobremTudo(resultado.completos.length),
                    resultado.parciais.length > 0 && t.cobremParte(resultado.parciais.length),
                  ]
                    .filter(Boolean)
                    .join(' · ')
                : t.exibindo(visiveis)}
            </p>
          </div>
        </div>

        {visiveis === 0 ? (
          <div className="bg-surface-2  rounded-[6px] p-8 text-center max-w-md mx-auto">
            <UserCheck size={32} className="mx-auto text-text-muted mb-2" aria-hidden />
            <h3 className="text-sm font-bold text-text-main mb-1">{t.vazioTitulo}</h3>
            <p className="text-xs text-text-muted font-light mb-4">{t.vazioTexto}</p>
            <button
              type="button"
              onClick={limpar}
              className="px-3.5 py-1.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
            >
              {t.resetar}
            </button>
            <ChamadaSobMedida
              locale={locale}
              variante="discreta"
              className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5"
            />
          </div>
        ) : (
          <>
            {vista.principais.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {vista.principais.map((x) => cartao(x, false))}
              </div>
            )}

            {vista.faixa !== 'nenhuma' && (
              <>
                {/* ⚠️ Duas cópias, e não uma. Como `separador`, a faixa divide
                    dois grupos e não pode dizer que ninguém reúne tudo — os que
                    reúnem estão logo acima. Como `aviso`, ela encabeça os
                    parciais e é aí que a frase vale. É ela que transforma
                    "nenhum perfil serve" em "peça dois". */}
                <div
                  className={cn(
                    'mb-6',
                    vista.faixa === 'separador' &&
                      'mt-8 pt-6 border-t border-slate-200 dark:border-white/5',
                  )}
                >
                  <h3 className="text-sm font-bold text-text-main">
                    {vista.faixa === 'separador' ? t.parteTitulo : t.avisoTitulo}
                  </h3>
                  <p className="text-xs text-text-muted font-light mt-0.5">
                    {vista.faixa === 'separador' ? t.parteTexto : t.avisoTexto}
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {vista.parciais.map((x) => cartao(x, true))}
                </div>
              </>
            )}

          </>
        )}
      </section>


      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={aberto.role}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <button
            type="button"
            aria-label={t.fechar}
            onClick={() => setAberto(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs cursor-default"
          />

          <div className="relative w-full max-w-2xl bg-surface-2  rounded-[6px] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              aria-label={t.fechar}
              onClick={() => setAberto(null)}
              className="absolute top-6 right-6 p-2 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-muted hover:text-text-main transition-colors cursor-pointer "
            >
              <X size={18} aria-hidden />
            </button>

            <div className="flex items-start gap-4 mb-6 pr-10">
              <div
                className={cn(
                  'w-12 h-12 rounded-[6px] bg-linear-to-br flex items-center justify-center text-white font-bold text-base shadow-md shrink-0',
                  gradienteDe(aberto.gradient),
                )}
              >
                {aberto.code}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main leading-tight">
                  {aberto.role}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                    {t.nivel} {aberto.level}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-6 bg-surface-1 p-4 rounded-[6px] ">
              {aberto.description}
            </p>

            {/* ⚠️ Sem "Entregáveis" e "Escopo de Responsabilidade": o legado os
                tem (`Consultants.tsx:1000` e `:1016`), mas a collection não
                modela os dois campos. Como o modal nasce fechado, isso não
                aparece na regressão visual — está em debito-tecnico.md. */}
            {aberto.certifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  <GraduationCap size={16} className="text-primary" aria-hidden />
                  <span>{t.certificacoes}</span>
                </div>
                <div className="space-y-1.5">
                  {aberto.certifications.map((c) => (
                    <div
                      key={c}
                      className="text-xs text-text-main font-medium flex items-center gap-2 bg-surface-1 p-2 rounded-[6px] "
                    >
                      <Award size={14} className="text-amber-400 shrink-0" aria-hidden />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                {t.tecnologias}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aberto.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-[6px] bg-surface-1  text-text-muted font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
              <button
                type="button"
                onClick={() => setAberto(null)}
                className="px-5 py-2.5 rounded-[6px] text-xs font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                {t.fechar}
              </button>
              {/* Aqui **adiciona**, nunca remove: quem abriu o detalhe e clicou
                  no CTA quer pedir, e alternar faria o clique tirar da lista.

                  ⚠️ Com o perfil já escolhido, **selo e não botão**. A primeira
                  versão mantinha um botão "Na solicitação" — o mesmo nome do
                  botão do card, que remove, mas aqui só fechava o modal. Mesmo
                  nome, efeitos opostos. O "Fechar" ao lado já fecha. */}
              {escolhidos.has(aberto.slug) ? (
                <StatusBadge label={t.jaNaLista} variant="online" icon={<Check size={14} aria-hidden />} />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const slug = aberto.slug
                    setEscolhidos((atual) => (atual.has(slug) ? atual : alternarPerfil(atual, slug)))
                    setAberto(null)
                    aoAdicionar(() =>
                      document.querySelector<HTMLElement>(`[data-solicitar="${CSS.escape(slug)}"]`),
                    )
                  }}
                  className="px-6 py-2.5 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{t.solicitarPerfil}</span>
                  <ArrowRight size={14} aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
