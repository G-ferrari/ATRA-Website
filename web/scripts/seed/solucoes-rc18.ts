/* Seed da página de solução RC18 (feature rc18, task 003).
 *
 * Fonte de conteúdo:
 * - Resolução Conjunta nº 18, de 28/11/2025 (BCB + CMN), texto oficial — as 12
 *   dimensões (Art. 2º), a política ao conselho (Art. 4º), o diretor responsável
 *   (Art. 5º), o relatório semestral (Art. 3º), a retenção de 5 anos (Art. 11) e
 *   o prazo de adequação 31/12/2026 (Art. 12). Verificado em
 *   www.bcb.gov.br/.../exibeversao (id 52771).
 * - E-mail ATRA × Google Cloud (RC18_2026.pdf): arquitetura de referência e o
 *   roadmap de adequação em 4 fases.
 * - Estrutura inspirada em logiks.com.br/RC-18 (referência de conteúdo).
 *
 * Diferente de `solucao-ia.ts`, este seed **cria** o documento (RC18 não está
 * entre as 6 soluções-base de `solucoes.ts`) e depois grava o layout. Idempotente
 * pelo slug. A categoria `rc18` (4ª aba do mega-menu) veio na migração da task 002.
 *
 * ⚠️ EN é um **stub em português** (decisão PT-only da v1): a RC 18/2025 é norma
 * do BCB para instituições brasileiras, público 100% nacional. O layout de blocos
 * é compartilhado entre locales (só os campos de texto são localizados), então o
 * EN reusa o conteúdo PT — o suficiente para a rota `/en/solutions/rc18` resolver
 * sem texto em branco. Tradução completa fica para depois (FEATURE §2.2).
 *
 * ⚠️ Conteúdo é rascunho: a consolidação de texto é do marketing no CMS (D-22).
 */

import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { ICONES } from '../../src/blocks/shared'
import { casarIds } from './ids'
import { midiaDe } from './midia'

/* O ícone dos blocos é uma união fechada (blocks/shared.ts). O conteúdo abaixo
 * guarda os nomes como string; casamos com a união na montagem do layout. */
type Icone = (typeof ICONES)[number]

const SLUG = 'rc18'

const payload = await getPayload({ config })

/* Resolve a partir de web/ (process.cwd()), sem tocar em legacy/ — o container do
 * seed não monta legacy/. Mesma foto real da home, para o formulário de contato
 * seguir o padrão da home (variante com foto + cartão de contato). */
const fotoContato = await midiaDe(
  payload,
  path.resolve(process.cwd(), 'public/fotos/equipe-atra.jpg'),
  'Equipe da ATRA',
)

const PT = {
  base: {
    title: 'RC 18/2025 — Governança de Qualidade da Informação',
    shortDescription:
      'Adequação à Resolução Conjunta nº 18/2025 do Banco Central: as 12 dimensões de qualidade, arquitetura sobre Google Cloud e roadmap em 4 fases, com diagnóstico gratuito.',
  },
  heroBadge: 'ATRA × Google Cloud · Parceiro Oficial',
  heroChip: 'Prazo do BCB: 31/12/2026',
  heroTitle: 'RC 18/2025: governança de qualidade da informação prestada ao Banco Central',
  heroHighlight: 'RC 18/2025',
  heroDesc:
    'A Resolução Conjunta nº 18/2025 (BCB e CMN) exige qualidade sistemática e auditável das informações prestadas ao regulador — com prazo de adequação em 31/12/2026. Não é uma ferramenta, é um programa de governança. A ATRA constrói a adequação ponta a ponta sobre o Google Cloud.',
  ctaDiag: 'Fazer diagnóstico gratuito',
  ctaSpecialist: 'Falar com especialista',
  metricas: [
    { value: 12, suffix: '', label: 'dimensões de qualidade' },
    { value: 4, suffix: '', label: 'fases de adequação' },
    { value: 5, suffix: ' anos', label: 'de dossiê de auditoria' },
  ],
  exige: {
    eyebrow: 'O que a RC 18/2025 exige',
    title: 'Um programa de governança, não uma ferramenta',
    cards: [
      {
        icon: 'shield',
        title: 'Política de qualidade aprovada pelo conselho',
        desc: 'Política das Informações Prestadas, própria e segregada, aprovada e revisada pelo conselho no mínimo anualmente (Art. 4º).',
      },
      {
        icon: 'user-check',
        title: 'Diretor responsável perante o BCB',
        desc: 'Designação formal de um diretor responsável pelo cumprimento do previsto na norma junto ao Banco Central (Art. 5º).',
      },
      {
        icon: 'target',
        title: '12 dimensões de qualidade',
        desc: 'Cada dimensão mensurada, monitorada e comprovável — com regra, medição e evidência, não declaração (Art. 2º).',
      },
      {
        icon: 'workflow',
        title: 'Validação automatizada antes do envio',
        desc: 'Arquitetura de dados com portão de validação antes da prestação da informação ao BCB.',
      },
      {
        icon: 'file-text',
        title: 'Relatório semestral e dossiê por 5 anos',
        desc: 'Relatório semestral consolidado (Art. 3º) e documentação retida por, no mínimo, cinco anos (Art. 11).',
      },
    ],
  },
  dimensoes: {
    eyebrow: 'As 12 dimensões de qualidade (Art. 2º)',
    title: 'Cada dimensão precisa de regra, medição e evidência',
    cards: [
      { icon: 'user-check', title: 'Acessibilidade', desc: 'Condições para o usuário obter a informação — local, forma de demanda e prazos —, com tratamento especial a pessoas com deficiência.' },
      { icon: 'target', title: 'Acurácia', desc: 'A informação reflete a realidade de maneira precisa e confiável, de acordo com a metodologia utilizada.' },
      { icon: 'settings', title: 'Adaptabilidade', desc: 'Capacidade de gerar informações em formato que atenda a demandas diversas, inclusive não periódicas e em situações de crise.' },
      { icon: 'info', title: 'Clareza', desc: 'Apresentação concisa, de fácil compreensão, atendendo às necessidades do usuário.' },
      { icon: 'chart', title: 'Comparabilidade', desc: 'Permitir identificar semelhanças e diferenças entre informações em diferentes períodos, áreas ou domínios.' },
      { icon: 'database', title: 'Completude', desc: 'A informação atende integralmente os aspectos requeridos, com dados completos.' },
      { icon: 'shield-check', title: 'Confiabilidade', desc: 'Ausência de desvio relevante nos dados revisados em relação ao seu valor inicial.' },
      { icon: 'workflow', title: 'Consistência', desc: 'Informações do mesmo evento padronizadas e sem contradição, mesmo geradas por fontes ou métodos diferentes.' },
      { icon: 'lock', title: 'Integridade', desc: 'Garantia de que a informação é autêntica e não foi modificada de forma não autorizada ou acidental.' },
      { icon: 'search', title: 'Rastreabilidade', desc: 'Condições para rastrear a informação desde a origem até a disponibilização ao usuário final.' },
      { icon: 'star', title: 'Relevância', desc: 'Informação útil, capaz de influenciar a tomada de decisão pelos usuários.' },
      { icon: 'zap', title: 'Tempestividade', desc: 'Fornecimento em tempo hábil, no prazo, com curto intervalo entre o fato e a prestação da informação.' },
    ],
  },
  arquitetura: {
    eyebrow: 'Arquitetura de referência',
    title: 'Adequação ponta a ponta sobre o Google Cloud',
    cards: [
      {
        icon: 'database',
        glow: 'blue',
        title: 'BigQuery',
        desc: 'Plataforma de informação regulatória com zonas segregadas (Raw imutável, Trusted com regra de negócio, Marts regulatórios) e congelamento por data-base.',
      },
      {
        icon: 'book',
        glow: 'orange',
        title: 'Knowledge Catalog',
        desc: 'Dicionário de dados vivo, com glossário de negócio, classificação de sensibilidade e linhagem coluna a coluna.',
      },
      {
        icon: 'workflow',
        glow: 'blue',
        title: 'Dataform',
        desc: 'Regras de qualidade versionadas, com portão automático de validação antes do envio ao BCB.',
      },
      {
        icon: 'cloud',
        glow: 'orange',
        title: 'Datastream + Pub/Sub',
        desc: 'Captura com rastreabilidade desde a origem.',
      },
      {
        icon: 'chart',
        glow: 'blue',
        title: 'Looker',
        desc: 'Painéis executivos de qualidade e o relatório semestral gerado a partir do dado.',
      },
    ],
  },
  roadmap: {
    eyebrow: 'Roadmap de adequação',
    title: 'Quatro fases até a conformidade',
    desc: 'O ponto de partida é um assessment inicial, dimensionado pelo porte e complexidade da sua instituição. 30 minutos de conversa mapeiam o cenário e definem os próximos passos.',
    steps: [
      { title: 'Diagnóstico', desc: 'Inventário, assessment DMBOK e gap das 12 dimensões — mapeando o cenário atual e a distância até o nível exigido.' },
      { title: 'Fundação', desc: 'Política ao conselho, comitê de dados, catálogo e dicionário — papéis formais e governança estabelecidos.' },
      { title: 'Evidência', desc: 'Regras de qualidade em produção, portão de validação antes do envio, linhagem e painéis.' },
      { title: 'Sustentação', desc: 'Relatório semestral ao conselho, auditoria e capacitação contínua.' },
    ],
  },
  porque: {
    eyebrow: 'Por que ATRA',
    title: 'Especialização em dados e parceria oficial Google Cloud',
    desc: '15+ anos em dados, IA e cloud. 140+ profissionais especializados. Agnóstica em plataforma, com 9 parceiros oficiais — e uma arquitetura especialmente robusta para a RC 18/2025 sobre o Google Cloud.',
    items: [
      { icon: 'award', accent: 'primary', title: 'Parceira oficial Google Cloud', desc: 'Arquitetura de referência validada para a RC 18/2025.' },
      { icon: 'users', accent: 'secondary', title: '140+ especialistas · 15+ anos', desc: 'Time especializado em dados, IA, governança e cloud.' },
      { icon: 'shield-check', accent: 'primary', title: 'Foco regulatório', desc: 'Do assessment à sustentação, com evidência para o Banco Central.' },
    ],
  },
  ctaBanner: {
    title: 'Descubra a prontidão da sua instituição para a RC 18/2025',
    highlight: 'RC 18/2025',
    desc: 'Faça o diagnóstico rápido e gratuito e receba um índice de prontidão pelas 12 dimensões da norma.',
    label: 'Fazer diagnóstico gratuito',
    secondary: 'Falar com especialista',
    caption: 'assessment inicial de 30 minutos',
  },
  contato: {
    title: 'Fale com o time especializado da ATRA',
    subtitle: 'Assessment inicial de 30 minutos, dimensionado pelo porte da sua instituição.',
  },
  nav: {
    exige: 'A norma',
    dimensoes: 'Dimensões',
    arquitetura: 'Arquitetura',
    roadmap: 'Roadmap',
    porque: 'Por que ATRA',
    contato: 'Contato',
  },
}

/* EN é stub em PT (decisão PT-only da v1) — ver cabeçalho. */
const EN = PT

/* Destino do diagnóstico. String literal como o resto dos seeds (solucao-ia.ts
 * usa `/chat`, `#contato`): é conteúdo de CMS, não link de app. A rota
 * `/diagnostico-rc18` chega na task 006.
 *
 * ⚠️ **Não** localizar por locale. O `href` do CTA **não** é `localized`, então
 * é gravado uma vez só; escrever `/en/...` no passo EN sobrescreveria o PT na
 * mesma coluna (armadilha do CLAUDE.md). Um path só, válido nos dois locales —
 * o EN é stub e o diagnóstico é PT-only na v1. */
const HREF_DIAG = '/diagnostico-rc18'

function layout(t: typeof PT) {
  return [
    {
      blockType: 'pageHero' as const,
      badge: t.heroBadge,
      chip: t.heroChip,
      title: t.heroTitle,
      highlight: [t.heroHighlight],
      description: t.heroDesc,
      descriptionWidth: 'wide' as const,
      align: 'left' as const,
      mediaMode: 'none' as const,
      ctaVariant: 'secondary' as const,
      ctas: [
        { label: t.ctaDiag, href: HREF_DIAG},
        { label: t.ctaSpecialist, href: '#contato' },
      ],
      metrics: [
        { value: t.metricas[0].value, suffix: t.metricas[0].suffix, label: t.metricas[0].label, color: 'primary' as const },
        { value: t.metricas[1].value, suffix: t.metricas[1].suffix, label: t.metricas[1].label, color: 'secondary' as const },
        { value: t.metricas[2].value, suffix: t.metricas[2].suffix, label: t.metricas[2].label, color: 'emerald' as const },
      ],
    },
    { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
    {
      blockType: 'iconCardGrid' as const,
      anchor: 'o-que-exige',
      navLabel: t.nav.exige,
      eyebrow: t.exige.eyebrow,
      title: t.exige.title,
      columns: '3' as const,
      variant: 'card' as const,
      items: t.exige.cards.map((c) => ({ icon: c.icon as Icone, title: c.title, description: c.desc })),
    },
    {
      blockType: 'iconCardGrid' as const,
      anchor: 'dimensoes',
      navLabel: t.nav.dimensoes,
      theme: 'surface-2' as const,
      eyebrow: t.dimensoes.eyebrow,
      title: t.dimensoes.title,
      columns: '4' as const,
      variant: 'card' as const,
      items: t.dimensoes.cards.map((c) => ({ icon: c.icon as Icone, title: c.title, description: c.desc })),
    },
    {
      blockType: 'valueCards' as const,
      anchor: 'arquitetura',
      navLabel: t.nav.arquitetura,
      variant: 'glow' as const,
      eyebrow: t.arquitetura.eyebrow,
      title: t.arquitetura.title,
      items: t.arquitetura.cards.map((c) => ({
        icon: c.icon as Icone,
        glowColor: c.glow as 'blue' | 'orange',
        title: c.title,
        description: c.desc,
        bullets: [],
      })),
    },
    {
      blockType: 'processSteps' as const,
      anchor: 'roadmap',
      navLabel: t.nav.roadmap,
      theme: 'surface-2' as const,
      eyebrow: t.roadmap.eyebrow,
      title: t.roadmap.title,
      description: t.roadmap.desc,
      steps: t.roadmap.steps.map((s) => ({ title: s.title, description: s.desc })),
    },
    {
      blockType: 'audienceSplit' as const,
      anchor: 'por-que-atra',
      navLabel: t.nav.porque,
      eyebrow: t.porque.eyebrow,
      eyebrowIcon: 'award' as const,
      title: t.porque.title,
      description: t.porque.desc,
      cta: { label: t.ctaSpecialist, href: '#contato' },
      items: t.porque.items.map((it) => ({
        icon: it.icon as Icone,
        accent: it.accent as 'primary' | 'secondary',
        title: it.title,
        description: it.desc,
      })),
    },
    {
      blockType: 'ctaBanner' as const,
      variant: 'dark' as const,
      title: t.ctaBanner.title,
      highlight: t.ctaBanner.highlight,
      description: t.ctaBanner.desc,
      cta: { label: t.ctaBanner.label, href: HREF_DIAG},
      secondaryCta: { label: t.ctaBanner.secondary, href: '#contato', caption: t.ctaBanner.caption },
    },
    {
      blockType: 'ctaContact' as const,
      anchor: 'contato',
      navLabel: t.nav.contato,
      title: t.contato.title,
      subtitle: t.contato.subtitle,
      /* Padrão da home (task 004): variante com foto + cartão de contato. O cartão
       * (telefone/e-mail/endereço/redes) é populado por `comContato` na rota de
       * solução, que passou a lê-lo do global `contact`. */
      showContactCard: true,
      variant: 'photo' as const,
      photo: fotoContato,
    },
  ]
}

const comuns = { category: 'rc18' as const, icon: 'shield-check' as const, order: 0, hasPage: true, _status: 'published' as const }

console.log('→ página de solução: RC18')

const { docs } = await payload.find({
  collection: 'solutions',
  where: { slug: { equals: SLUG } },
  limit: 1,
  locale: 'pt',
  depth: 0,
})

const dataPt = { ...comuns, ...PT.base, slug: SLUG, layout: layout(PT) }
const doc = docs[0]
  ? await payload.update({ collection: 'solutions', id: docs[0].id, data: dataPt, locale: 'pt' })
  : await payload.create({ collection: 'solutions', data: dataPt, locale: 'pt' })

/* Relê o gravado e casa os ids em todos os níveis antes de gravar o EN, senão o
 * texto localizado dentro dos cards some (ver ids.ts). */
const gravado = await payload.findByID({ collection: 'solutions', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({
  collection: 'solutions',
  id: doc.id,
  data: { ...comuns, ...EN.base, slug: SLUG, layout: casarIds(layout(EN), gravado.layout) },
  locale: 'en',
})

console.log('  1 página, 9 blocos, 2 idiomas (EN stub)')
process.exit(0)
