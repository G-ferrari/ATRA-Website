import { Award, Cpu, ShieldCheck, Zap } from 'lucide-react'

import type { Locale } from '@/lib/locales'

import { ChamadaSobMedida } from './chamada-sob-medida'

/* "Por que os maiores players do mercado confiam nos consultores ATRA?" — os
 * quatro diferenciais do legado (`Consultants.tsx:662`) e, desde a task 017, a
 * chamada "Não encontrou um consultor nesta lista?" fechando a seção.
 *
 * A chamada vem **depois** dos diferenciais, não antes: primeiro o argumento
 * (por que confiar), depois o pedido. "Nesta lista" continua fazendo sentido —
 * a grade de perfis termina logo acima da seção.
 *
 * Server Component: a seção é estática. Só a chamada precisa de JavaScript, e
 * ela é a ilha (regra 4). */

const TEXTOS = {
  pt: {
    titulo: 'Por que os maiores players do mercado confiam nos consultores ATRA?',
    texto:
      'Garantimos alto padrão técnico, governança de processos e alinhamento total com as metas do seu negócio.',
    itens: [
      {
        title: 'Curadoria & Retenção de Elite',
        desc: 'Taxa de turnover inferior a 5%. Nossos profissionais passam por rigorosos processos de seleção e capacitação contínua.',
      },
      {
        title: 'Supervisão Técnica Sem Custos',
        desc: 'Mesmo na alocação individual, um Principal Architect da ATRA acompanha periodicamente as entregas e a qualidade.',
      },
      {
        title: 'Substituição Rápida & Garantida',
        desc: 'Se houver qualquer necessidade de ajuste de perfil, realizamos a substituição em até 5 dias úteis com handover conduzido pela ATRA.',
      },
      {
        title: 'Conformidade, LGPD & Segurança',
        desc: 'Todos os consultores trabalham sob estritos acordos de confidencialidade (NDA), treinados nas normas LGPD e ISO 27001.',
      },
    ],
  },
  en: {
    titulo: 'Why the biggest players trust ATRA consultants',
    texto: 'We guarantee a high technical standard, process governance and full alignment with your business goals.',
    itens: [
      {
        title: 'Elite curation and retention',
        desc: 'Turnover below 5%. Our professionals go through rigorous selection and continuous training.',
      },
      {
        title: 'Technical supervision at no cost',
        desc: 'Even for a single allocation, an ATRA Principal Architect reviews delivery and quality periodically.',
      },
      {
        title: 'Fast, guaranteed replacement',
        desc: 'If a profile needs adjusting we replace it within five working days, with handover run by ATRA.',
      },
      {
        title: 'Compliance, LGPD and security',
        desc: 'Every consultant works under strict NDAs and is trained on LGPD and ISO 27001.',
      },
    ],
  },
} as const

const ICONES = [Award, Cpu, Zap, ShieldCheck] as const

export function Diferenciais({ locale }: { locale: Locale }) {
  const t = TEXTOS[locale]

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
      <div className="bg-surface-2  rounded-[6px] p-5 sm:p-7 shadow-xs">
        <div className="max-w-2xl mb-6">
          <h2 className="text-base md:text-lg font-bold font-display text-text-main mb-1">{t.titulo}</h2>
          <p className="text-xs text-text-muted font-light">{t.texto}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.itens.map((d, i) => {
            const Icone = ICONES[i]
            return (
              <div key={d.title} className="bg-surface-1  rounded-[6px] p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Icone size={16} aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-text-main mb-1">{d.title}</h3>
                  <p className="text-xs text-text-muted font-light leading-relaxed">{d.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <ChamadaSobMedida locale={locale} variante="destaque" className="mt-6" />
      </div>
    </section>
  )
}
