'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { EsforcoDaFase } from '@/lib/roadmap'

/* Os gráficos do /roadmap — Recharts direto, sem shadcn: o invólucro de chart
 * do shadcn é Recharts por baixo, e o projeto já tem a dependência (o chat a
 * usa) e um design system próprio para vestir os eixos.
 *
 * As cores passaram pelo validador de paleta (um passo por tema, como manda a
 * regra de dark mode): claro `#2A75C5` — o token `--color-primary-dark` — e
 * escuro `#3A8FEA`, porque a faixa de luminosidade do tema escuro (L 0.48–
 * 0.67) reprova tanto o azul da marca quanto qualquer clareada dele. O trilho
 * cinza é neutro de propósito: é o "resto", não uma segunda identidade. O
 * contraste do claro fica abaixo de 3:1 por 0,03 — o alívio exigido são os
 * rótulos diretos nas barras e a lista completa logo abaixo, que é a visão
 * de tabela dos mesmos números. */

export type ProgressoDaFase = { fase: string; feitas: number; restantes: number }

const dicaEstilizada = {
  contentStyle: {
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border-main)',
    borderRadius: 6,
    fontSize: 12,
    color: 'var(--color-text-main)',
  },
  labelStyle: { color: 'var(--color-text-main)', fontWeight: 600 },
  itemStyle: { color: 'var(--color-text-muted)' },
  cursor: { fill: 'var(--color-surface-3)', opacity: 0.4 },
}

export function Graficos({ progresso, esforco }: { progresso: ProgressoDaFase[]; esforco: EsforcoDaFase[] }) {
  return (
    <div className="graficos-roadmap grid lg:grid-cols-2 gap-4">
      <style>{`
        .graficos-roadmap { --serie-feitas: #2A75C5; }
        html.dark .graficos-roadmap { --serie-feitas: #3A8FEA; }
      `}</style>

      <div className="vort-card dark:vort-card-dark">
        <h3 className="text-sm font-semibold text-text-main mb-1">Tasks por fase</h3>
        <div className="flex items-center gap-4 text-xs text-text-muted mb-4" aria-hidden>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: 'var(--serie-feitas)' }} />
            feitas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-surface-3 border border-border-main" />
            restantes
          </span>
        </div>
        <ResponsiveContainer width="100%" height={progresso.length * 34 + 8}>
          <BarChart data={progresso} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="fase"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
            />
            {/* O rótulo direto "feitas/total" mora num segundo eixo, não num
             * LabelList: rótulo preso à barra some quando o segmento tem valor
             * zero, e fase completa (ou não começada) zera um dos dois. */}
            <YAxis
              yAxisId="rotulos"
              orientation="right"
              type="category"
              dataKey="fase"
              width={44}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              tickFormatter={(_, i) => `${progresso[i].feitas}/${progresso[i].feitas + progresso[i].restantes}`}
            />
            <Tooltip {...dicaEstilizada} />
            {/* Sem animação: rAF não dispara em aba oculta e as barras nem
             * chegam a desenhar — e um painel de estado não precisa de tween. */}
            <Bar
              dataKey="feitas"
              name="feitas"
              stackId="fase"
              isAnimationActive={false}
              fill="var(--serie-feitas)"
              stroke="var(--color-surface-2)"
              strokeWidth={2}
              barSize={16}
              radius={[3, 0, 0, 3]}
            />
            <Bar
              dataKey="restantes"
              name="restantes"
              stackId="fase"
              isAnimationActive={false}
              fill="var(--color-surface-3)"
              stroke="var(--color-surface-2)"
              strokeWidth={2}
              barSize={16}
              radius={[0, 3, 3, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="vort-card dark:vort-card-dark">
        <h3 className="text-sm font-semibold text-text-main mb-1">Esforço estimado por fase</h3>
        <p className="text-xs text-text-muted mb-4">
          Horas de sessão assistida, da tabela de totais do backlog.
        </p>
        <ResponsiveContainer width="100%" height={progresso.length * 34 - 24}>
          <BarChart data={esforco} layout="vertical" margin={{ top: 0, right: 52, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-border-main)" strokeDasharray="2 4" />
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="fase"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
            />
            <Tooltip {...dicaEstilizada} formatter={(v) => [`~${v}h`, 'estimadas']} />
            <Bar
              dataKey="horas"
              name="horas"
              fill="var(--serie-feitas)"
              barSize={16}
              radius={[0, 3, 3, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="horas"
                position="right"
                formatter={(v) => `~${String(v)}h`}
                style={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
