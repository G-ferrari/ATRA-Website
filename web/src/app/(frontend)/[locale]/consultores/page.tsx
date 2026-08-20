import { Award, CheckCircle2, Cpu, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { ContadorAnimado } from '@/components/blocks/contador-animado'
import { MetricChip, StatusBadge } from '@/components/ui'
import { isLocale, LOCALES } from '@/lib/locales'
import { toConsultantRole } from '@/lib/mappers/consultant'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'

import { ListaDeConsultores } from './lista-de-consultores'
import { SolicitarConsultores } from './solicitar-consultores'

/* /consultores — porte de `legacy/src/pages/Consultants.tsx`.
 *
 * ⚠️ MIG-052 fechou esta rota com **57% da página faltando**: a barra de
 * números do herói, a seção de diferenciais e a de solicitação não tinham sido
 * portadas, e o herói usava a caixa escura de /sobre no lugar da abertura
 * aberta do legado. Passou no aceite porque a rota entrou só no smoke, sem
 * gabarito visual — 11.696px contra 4.975px. Agora tem gabarito.
 *
 * O modal de detalhe do legado segue de fora: ver debito-tecnico.md. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const META = {
  pt: { title: 'Consultores', description: 'Especialistas em dados, cloud e IA prontos para alocação rápida.' },
  en: { title: 'Consultants', description: 'Data, cloud and AI specialists ready for fast allocation.' },
} as const

const TEXTOS = {
  pt: {
    badge: 'Especialistas em Dados, Cloud & IA',
    chip: 'Alocação Rápida',
    titulo: 'Acelere seus projetos de Dados e IA com',
    destaque: 'consultores de elite',
    descricao:
      'Engenheiros de dados, cientistas, arquitetos cloud, analytics engineers e especialistas em governança prontos para integrar sua equipe em até 48 horas.',
    metricas: ['No Time', 'Projetos Ativos', 'Tempo Médio', 'Satisfação'],
    diferenciaisTitulo: 'Por que os maiores players do mercado confiam nos consultores ATRA?',
    diferenciaisTexto:
      'Garantimos alto padrão técnico, governança de processos e alinhamento total com as metas do seu negócio.',
    diferenciais: [
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
    badge: 'Data, Cloud & AI specialists',
    chip: 'Fast allocation',
    titulo: 'Accelerate your data and AI projects with',
    destaque: 'elite consultants',
    descricao:
      'Data engineers, scientists, cloud architects, analytics engineers and governance specialists ready to join your team within 48 hours.',
    metricas: ['On the team', 'Active projects', 'Average time', 'Satisfaction'],
    diferenciaisTitulo: 'Why the biggest players trust ATRA consultants',
    diferenciaisTexto:
      'We guarantee a high technical standard, process governance and full alignment with your business goals.',
    diferenciais: [
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

/* Ícone e cor de cada número, na ordem do legado (`Consultants.tsx:395`). */
const METRICAS = [
  { Icone: Users, cor: 'text-primary', marca: 'text-primary/40' },
  { Icone: Zap, cor: 'text-secondary', marca: 'text-secondary/40' },
  { Icone: CheckCircle2, cor: 'text-emerald-400', marca: 'text-emerald-500/40' },
  { Icone: Award, cor: 'text-amber-400', marca: 'text-amber-400/40' },
] as const

const ICONES_DIFERENCIAIS = [Award, Cpu, Zap, ShieldCheck] as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return META[isLocale(locale) ? locale : 'pt']
}

export default async function ConsultoresPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'specialist-roles',
    locale,
    depth: 0,
    limit: 100,
    sort: 'order',
  })
  const perfis = docs.map(toConsultantRole)

  /* Somados dos perfis, como no legado (`Consultants.tsx:360`) — não são
   * números institucionais, então não vêm do global `site-settings`. */
  const noTime = perfis.reduce((s, p) => s + p.totalTeamSize, 0)
  const emProjetos = perfis.reduce((s, p) => s + p.allocatedProjects, 0)

  return (
    <main className="pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
            <MetricChip label={t.chip} variant="neutral" size="sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-text-main mb-4 leading-tight">
            {t.titulo} <span className="text-primary font-normal">{t.destaque}</span>.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-text-muted max-w-2xl font-light leading-relaxed mb-6">
            {t.descricao}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-4xl pt-1">
            {METRICAS.map(({ Icone, cor, marca }, i) => (
              <div
                key={t.metricas[i]}
                className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] px-4 py-3 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-text-muted font-normal">{t.metricas[i]}</div>
                  <div className={`text-lg md:text-xl font-bold ${cor}`}>
                    {/* O terceiro é texto fixo no legado, não contador. */}
                    {i === 0 && <ContadorAnimado ate={noTime} sufixo="+" />}
                    {i === 1 && <ContadorAnimado ate={emProjetos} sufixo="+" />}
                    {i === 2 && <>&lt; 48h</>}
                    {i === 3 && <ContadorAnimado ate={99} sufixo=".4%" />}
                  </div>
                </div>
                <Icone size={20} className={`${marca} shrink-0`} aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ListaDeConsultores perfis={perfis} contatoHref={hrefDe('contato', locale)} locale={locale} />

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-5 sm:p-7 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h2 className="text-base md:text-lg font-bold font-display text-text-main mb-1">{t.diferenciaisTitulo}</h2>
            <p className="text-xs text-text-muted font-light">{t.diferenciaisTexto}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.diferenciais.map((d, i) => {
              const Icone = ICONES_DIFERENCIAIS[i]
              return (
                <div
                  key={d.title}
                  className="bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] p-4 flex items-start gap-3.5"
                >
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
        </div>
      </section>

      <SolicitarConsultores locale={locale} />
    </main>
  )
}
