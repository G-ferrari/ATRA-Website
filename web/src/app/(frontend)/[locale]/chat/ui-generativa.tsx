'use client'

import { Icon } from '@iconify/react'
import { ArrowRight, CheckCircle2, Phone, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { tokenizarUiGenerativa } from '@/lib/ui-generativa'

/* Cartões da "UI generativa" do chat — porte de
 * `legacy/src/components/ChatGenerativeUI.tsx`, chamado pelos tokens de
 * `lib/ui-generativa.ts`.
 *
 * Sem `motion`: a `Conversa` já portou as mensagens sem a animação de entrada
 * que o legado põe em cada balão, e os cartões seguem o mesmo critério — o
 * gabarito do gate captura só o estado vazio do chat, então nada disto é
 * comparado pixel a pixel.
 *
 * Os textos ficam em português mesmo em `/en`, como no legado: os cartões são
 * hardcoded lá e a resposta do modelo sai no idioma da conversa de qualquer
 * jeito. Traduzi-los é decisão de conteúdo (D-22), não de porte. */

/** [UI_CONTACT] — o convite para falar com um arquiteto no WhatsApp.
 *
 * Duas diferenças deliberadas contra o legado:
 * - o link vem do global `contact` do CMS por prop, não hardcoded — o número
 *   escrito em `ChatGenerativeUI.tsx:37` é conteúdo, e conteúdo mora no CMS;
 * - o retrato Unsplash do "especialista" vira monograma, o mesmo tratamento
 *   dos 4 retratos de depoimento (D-27): foto de banco não vai ao ar. */
function CartaoContato({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="bg-surface-2 dark:bg-[#181b22]  rounded-[6px] shadow-lg p-4 my-3 max-w-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-[6px] bg-primary/15 text-primary flex items-center justify-center  shadow-inner text-xs font-bold tracking-wide">
            AT
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface-2 dark:border-[#181b22]" />
        </div>
        <div>
          <h4 className="font-bold text-text-main text-xs flex items-center gap-1.5">
            Falar com Especialista
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </h4>
          <p className="text-[11px] text-text-muted">Time de Soluções &amp; Arquitetura ATRA</p>
        </div>
      </div>
      <p className="text-[11px] text-text-muted mb-3.5 leading-relaxed">
        Pronto para acelerar seu projeto de Dados e IA? Desenhe o escopo técnico diretamente com nossos arquitetos.
      </p>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-[6px] py-2 px-3.5 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
      >
        <Phone size={13} aria-hidden />
        Conectar no WhatsApp
      </a>
    </div>
  )
}

/** [UI_SERVICE:título:descrição:ícone] — cartão de solução recomendada. */
function CartaoServico({ titulo, descricao, icone }: { titulo: string; descricao: string; icone: string }) {
  /* O modelo nem sempre manda o ícone certo; o legado corrige por palavra-chave
   * do título antes de confiar no que veio. */
  let iconeResolvido = icone || 'fluent:cube-24-regular'
  const t = titulo.toLowerCase()
  if (t.includes('engenharia de dados')) {
    iconeResolvido = 'fluent:database-24-regular'
  } else if (t.includes('inteligência') || t.includes('ia')) {
    iconeResolvido = 'fluent:brain-circuit-24-regular'
  } else if (t.includes('governança') || t.includes('finops')) {
    iconeResolvido = 'fluent:shield-lock-24-regular'
  }

  return (
    <div className="bg-surface-2 dark:bg-[#181b22]  hover:border-primary/50 rounded-[6px] shadow-sm p-3.5 my-2.5 flex flex-col gap-2.5 group transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Icon icon={iconeResolvido} width={18} height={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-text-main text-xs mb-0.5 group-hover:text-primary transition-colors">{titulo}</h4>
          <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{descricao}</p>
        </div>
      </div>
      <div className="pt-2 border-t border-border-main/50 flex items-center justify-between">
        <span className="text-[10px] text-text-muted flex items-center gap-1">
          <Sparkles size={11} className="text-secondary" aria-hidden /> Solução Especializada
        </span>
        <span className="text-[11px] font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Conhecer solução <ArrowRight size={12} aria-hidden />
        </span>
      </div>
    </div>
  )
}

/** [UI_PARTNER:nome] — selo inline de parceiro, no meio da frase. */
function SeloParceiro({ nome }: { nome: string }) {
  const n = nome.toLowerCase()
  const icone = n.includes('google')
    ? 'logos:google-cloud'
    : n.includes('azure')
      ? 'logos:microsoft-azure'
      : n.includes('databricks')
        ? 'logos:databricks'
        : n.includes('snowflake')
          ? 'logos:snowflake-icon'
          : n.includes('ibm')
            ? 'logos:ibm'
            : n.includes('denodo')
              ? 'fluent:layer-diagonal-24-filled'
              : n.includes('atlan')
                ? 'fluent:globe-search-24-filled'
                : 'fluent:star-24-filled'
  /* Marcas com logo colorido próprio ficam sem tint; as demais herdam o azul. */
  const temCorPropria = n.includes('google') || n.includes('azure') || n.includes('databricks')

  return (
    <span className="inline-flex items-center gap-1.5 bg-surface-2 dark:bg-[#181b22]  rounded-[6px] px-2.5 py-1 text-[11px] font-semibold text-text-main shadow-xs mx-1 my-0.5 align-middle hover:border-primary/40 transition-colors">
      <Icon icon={icone} width={13} height={13} className={temCorPropria ? '' : 'text-primary'} />
      {nome}
      <CheckCircle2 size={11} className="text-emerald-500 ml-0.5" aria-hidden />
    </span>
  )
}

/** [UI_CHART:BI|FinOps] — dashboard de demonstração com dados fictícios. */
function CartaoGrafico({ tipo }: { tipo: string }) {
  const dadosBI = [
    { name: 'Jan', vendas: 4000, meta: 2400 },
    { name: 'Fev', vendas: 3000, meta: 1398 },
    { name: 'Mar', vendas: 2000, meta: 9800 },
    { name: 'Abr', vendas: 2780, meta: 3908 },
    { name: 'Mai', vendas: 1890, meta: 4800 },
    { name: 'Jun', vendas: 2390, meta: 3800 },
  ]

  const dadosFinOps = [
    { name: 'S1', custo: 4000 },
    { name: 'S2', custo: 3000 },
    { name: 'S3', custo: 2000 },
    { name: 'S4', custo: 2780 },
    { name: 'S5', custo: 1890 },
    { name: 'S6', custo: 1200 },
  ]

  const finOps = tipo.toLowerCase().includes('finops')

  const estiloDoTooltip = {
    fontSize: '10.5px',
    borderRadius: '6px',
    backgroundColor: 'var(--color-surface-2, #ffffff)',
    borderColor: 'var(--color-border-main, #e2e8f0)',
    color: 'var(--color-text-main, #0f172a)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
  }

  return (
    <div className="bg-surface-2 dark:bg-[#181b22]  rounded-[6px] shadow-lg p-3.5 my-3">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-7 h-7 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
          <Icon icon={finOps ? 'fluent:money-calculator-24-regular' : 'fluent:data-pie-24-regular'} width={16} />
        </div>
        <div>
          <h4 className="font-bold text-text-main text-[11.5px]">
            {finOps ? 'Simulação FinOps (Economia Cloud)' : 'Dashboard BI (Analytics Executivo)'}
          </h4>
          <p className="text-[10px] text-text-muted">
            {finOps ? 'Otimização contínua de custos em nuvem' : 'Acompanhamento estratégico de metas'}
          </p>
        </div>
      </div>

      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {finOps ? (
            <AreaChart data={dadosFinOps}>
              <defs>
                <linearGradient id="colorCustoAtra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3C98FA" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#3C98FA" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                fontSize={9.5}
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                className="text-text-muted opacity-70"
              />
              <YAxis hide />
              <Tooltip contentStyle={estiloDoTooltip} />
              <Area type="monotone" dataKey="custo" stroke="#3C98FA" strokeWidth={2} fillOpacity={1} fill="url(#colorCustoAtra)" />
            </AreaChart>
          ) : (
            <BarChart data={dadosBI}>
              <XAxis
                dataKey="name"
                fontSize={9.5}
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                className="text-text-muted opacity-70"
              />
              <Tooltip cursor={{ fill: 'rgba(60, 152, 250, 0.08)' }} contentStyle={estiloDoTooltip} />
              <Bar dataKey="vendas" fill="#3C98FA" radius={[3, 3, 0, 0]} />
              <Bar dataKey="meta" fill="#FF8B08" fillOpacity={0.4} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Resposta do modelo: texto vira markdown, tags viram cartões.
 *
 * ⚠️ As classes `prose-*` e `markdown-body` vêm do legado e são **inertes** nos
 * dois apps — nenhum tem o plugin de tipografia do Tailwind, então o que formata
 * é o preflight sobre os elementos que o ReactMarkdown emite (negrito funciona;
 * lista sai sem marcador). Tirá-las ou ativar o plugin mudaria a renderização
 * contra o gabarito (D-15). */
export function RespostaDoModelo({ texto, whatsapp }: { texto: string; whatsapp: string }) {
  return (
    <div>
      {tokenizarUiGenerativa(texto).map((token, i) => {
        switch (token.tipo) {
          case 'contato':
            return <CartaoContato key={i} whatsapp={whatsapp} />
          case 'servico':
            return <CartaoServico key={i} titulo={token.titulo} descricao={token.descricao} icone={token.icone} />
          case 'parceiro':
            return <SeloParceiro key={i} nome={token.nome} />
          case 'grafico':
            return <CartaoGrafico key={i} tipo={token.grafico} />
          case 'texto':
            return (
              <div
                key={i}
                className="markdown-body prose prose-xs dark:prose-invert max-w-none text-text-main text-[13px] leading-relaxed prose-p:leading-relaxed prose-headings:text-text-main prose-headings:font-bold prose-a:text-primary prose-a:font-semibold hover:prose-a:underline prose-strong:text-text-main prose-code:text-primary prose-code:bg-surface-1 dark:prose-code:bg-[#0e1015] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[6px] prose-ul:my-1.5 prose-li:my-0.5"
              >
                <ReactMarkdown>{token.texto}</ReactMarkdown>
              </div>
            )
        }
      })}
    </div>
  )
}
