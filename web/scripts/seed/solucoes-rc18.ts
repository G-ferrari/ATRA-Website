/* Seed da página de solução RC18 (feature rc18, task 003).
 *
 * Fonte de conteúdo:
 * - Resolução Conjunta nº 18, de 28/11/2025 (BCB + CMN), texto oficial — as 12
 *   dimensões (Art. 2º), a política ao conselho (Art. 4º), o diretor responsável
 *   (Art. 5º), o relatório semestral (Art. 3º), a retenção de 5 anos (Art. 11) e
 *   o prazo de adequação 31/12/2026 (Art. 12). Verificado em
 *   www.bcb.gov.br/.../exibeversao (id 52771).
 * - **Brief de conteúdo `RC18_2026.pdf` (12 blocos)** — cópia oficial do marketing,
 *   adaptada aqui. O FAQ (bloco 10) ficou de fora: o brief traz as perguntas sem
 *   as respostas, e conteúdo não vai ao ar sem corpo (D-08). A "Arquitetura sobre
 *   Google Cloud" da v1 foi substituída pelo bloco genérico "Capacidades" do brief.
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
 * Limitações do porte do brief para os blocos existentes: o `pageHero` não embute
 * formulário (o brief pede um no herói) — o formulário fica no `ctaContact` do
 * rodapé; e o `iconCardGrid` não tem parágrafo de abertura, então os "textos de
 * abertura" dos blocos de cards do brief não foram portados (ficam eyebrow+título).
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
    title: 'RC 18/2025 — Qualidade e governança da informação prestada ao Banco Central',
    shortDescription:
      'A Resolução Conjunta nº 18/2025 exige comprovar, continuamente, a qualidade das informações prestadas ao Banco Central — governança, processos, tecnologia e evidências. Prazo de adequação: 31/12/2026. A ATRA apoia a jornada ponta a ponta.',
  },
  /* BLOCO 01 | HERO */
  heroBadge: 'Resolução Conjunta nº 18/2025 · BCB + CMN',
  heroChip: 'Prazo de adequação: 31 de dezembro de 2026',
  heroTitle: 'RC 18/2025: sua instituição está preparada para comprovar a qualidade dos dados?',
  heroHighlight: 'comprovar a qualidade dos dados',
  heroDesc:
    'A nova exigência regulatória não termina na criação de uma política. É preciso estruturar processos, tecnologia e evidências capazes de demonstrar, continuamente, a qualidade das informações prestadas ao Banco Central.',
  ctaDiag: 'Avaliar a prontidão da minha instituição',
  ctaSpecialist: 'Falar com especialista',
  /* BLOCO 02 | CONTEXTO */
  contexto: {
    eyebrow: 'A norma',
    title: 'A RC 18 mudou o nível de exigência sobre os dados regulatórios',
    cards: [
      { icon: 'shield', title: 'Governar', desc: 'Responsabilidades e controles claramente definidos.' },
      { icon: 'shield-check', title: 'Validar', desc: 'Testes, verificações e reconciliações antes do envio.' },
      { icon: 'search', title: 'Rastrear', desc: 'Capacidade de acompanhar a origem e o tratamento das informações.' },
      { icon: 'chart', title: 'Monitorar', desc: 'Acompanhamento contínuo da qualidade e identificação de inconsistências.' },
      { icon: 'file-text', title: 'Evidenciar', desc: 'Registros e trilhas que permitam comprovar os controles realizados.' },
    ],
  },
  /* BLOCO 03 | O QUE A RC 18 EXIGE */
  exige: {
    eyebrow: 'O que a RC 18 exige',
    title: 'Qualidade de dados agora precisa estar sustentada por governança',
    cards: [
      { icon: 'user-check', title: 'Governança e responsabilidade', desc: 'Papéis definidos, responsabilidades claras e envolvimento da alta administração.' },
      { icon: 'database', title: 'Dados e tecnologia', desc: 'Arquitetura, infraestrutura e ferramentas adequadas para gestão e qualidade das informações.' },
      { icon: 'shield-check', title: 'Controles e evidências', desc: 'Validações, testes, reconciliações, documentação e trilhas de auditoria.' },
      { icon: 'chart', title: 'Monitoramento contínuo', desc: 'Acompanhamento da qualidade, identificação de irregularidades e ações corretivas.' },
    ],
  },
  /* BLOCO 04 | 12 DIMENSÕES (Art. 2º) */
  dimensoes: {
    eyebrow: 'As 12 dimensões de qualidade (Art. 2º)',
    title: '12 dimensões para uma informação de qualidade',
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
  /* BLOCO 05 | O VERDADEIRO DESAFIO */
  desafio: {
    eyebrow: 'O verdadeiro desafio',
    title: 'O desafio não é apenas ter dados corretos. É conseguir provar a qualidade.',
    cards: [
      { icon: 'database', title: 'Dados distribuídos', desc: 'Informações espalhadas entre diferentes sistemas e fontes.' },
      { icon: 'search', title: 'Baixa rastreabilidade', desc: 'Dificuldade para identificar origem, transformação e responsáveis.' },
      { icon: 'info', title: 'Inconsistências identificadas tarde', desc: 'Erros descobertos apenas próximo ao momento do reporte.' },
      { icon: 'file-text', title: 'Evidências dispersas', desc: 'Controles e registros distribuídos em diferentes processos e ferramentas.' },
      { icon: 'workflow', title: 'Baixa escalabilidade', desc: 'Dependência excessiva de controles manuais.' },
    ],
  },
  /* BLOCO 06 | O PRAZO */
  prazo: {
    eyebrow: 'O prazo',
    title: '31 de dezembro de 2026. O prazo está correndo.',
    desc: 'A resolução entrou em vigor em janeiro de 2026 e estabelece até 31 de dezembro de 2026 para que as instituições realizem os procedimentos necessários à adequação. O desafio é transformar requisitos regulatórios em uma estrutura operacional que funcione de forma contínua, e não apenas para atender a uma data.',
    steps: [
      { title: 'Hoje', desc: 'Situação atual da instituição.' },
      { title: 'Diagnóstico', desc: 'Avaliação do cenário, dos processos e dos controles.' },
      { title: 'Roadmap', desc: 'Plano de adequação priorizado por risco e esforço.' },
      { title: 'Implementação', desc: 'Execução das mudanças de governança, dados e tecnologia.' },
      { title: 'Evidências', desc: 'Registros e trilhas que comprovam os controles realizados.' },
      { title: 'Adequação', desc: 'Conformidade contínua com a norma.' },
    ],
  },
  /* BLOCO 07 | COMO A ATRA AJUDA */
  jornada: {
    eyebrow: 'Como a ATRA ajuda',
    title: 'Da exigência regulatória à operação de dados',
    desc: 'A ATRA combina experiência em dados, governança, qualidade, engenharia e tecnologia para apoiar instituições financeiras na construção de uma estrutura preparada para os requisitos da RC 18/2025.',
    steps: [
      { title: 'Diagnosticar', desc: 'Avaliação do cenário atual: processos, dados, controles e nível de prontidão.' },
      { title: 'Governar', desc: 'Definição de responsabilidades, políticas, processos e mecanismos de controle.' },
      { title: 'Estruturar', desc: 'Evolução da arquitetura, integração, qualidade e gestão dos dados.' },
      { title: 'Evidenciar', desc: 'Construção de mecanismos de rastreabilidade, testes, registros e evidências.' },
      { title: 'Sustentar', desc: 'Monitoramento contínuo, indicadores, melhoria e evolução da maturidade.' },
    ],
  },
  /* BLOCO 08 | CAPACIDADES */
  capacidades: {
    eyebrow: 'Capacidades',
    title: 'Tecnologia como meio para uma governança de dados mais eficiente',
    cards: [
      { icon: 'shield-check', glow: 'blue', title: 'Data Governance', desc: 'Políticas, responsabilidades, catálogo e gestão dos dados.' },
      { icon: 'target', glow: 'orange', title: 'Data Quality', desc: 'Regras, validações, monitoramento e tratamento de inconsistências.' },
      { icon: 'workflow', glow: 'blue', title: 'Data Integration', desc: 'Integração das diferentes fontes e sistemas de informação.' },
      { icon: 'database', glow: 'orange', title: 'Data Engineering', desc: 'Pipelines, processamento e estruturação dos dados.' },
      { icon: 'cloud', glow: 'blue', title: 'Cloud & Architecture', desc: 'Arquiteturas modernas e escaláveis para ambientes regulados.' },
      { icon: 'chart', glow: 'orange', title: 'Analytics', desc: 'Indicadores e análises para acompanhamento da qualidade e do desempenho.' },
    ],
  },
  /* BLOCO 09 | EXPERIÊNCIA / PROVA */
  experiencia: {
    eyebrow: 'Experiência',
    title: 'Experiência em dados no ambiente financeiro',
    desc: 'A ATRA atua há mais de 15 anos com dados, tecnologia e transformação de ambientes complexos, incluindo projetos para instituições do setor financeiro.',
    items: [
      { icon: 'award', accent: 'primary', title: 'Banco ABC', desc: 'Projetos envolvendo governança, qualidade, integração e marketplace de dados.' },
      { icon: 'award', accent: 'secondary', title: 'Banco Carrefour', desc: 'Modernização de processos regulatórios com Google Cloud, alcançando 51x mais velocidade no processamento.' },
      { icon: 'users', accent: 'primary', title: '+15 anos', desc: 'Experiência em dados, cloud, engenharia, analytics e governança.' },
      { icon: 'shield-check', accent: 'secondary', title: 'Setor financeiro', desc: 'Ambientes de risco, compliance, dados regulatórios e proteção de informações.' },
    ],
  },
  /* BLOCO 11 | CTA FINAL */
  ctaBanner: {
    title: 'Sua instituição está preparada para a RC 18/2025?',
    highlight: 'RC 18/2025',
    desc: 'O prazo de adequação termina em 31 de dezembro de 2026. Comece avaliando o cenário atual e identificando os principais gaps de governança, qualidade, processos e tecnologia.',
    label: 'Avaliar a prontidão da minha instituição',
    secondary: 'Falar com especialista',
    caption: 'diagnóstico rápido e gratuito',
  },
  contato: {
    title: 'Fale com o time especializado da ATRA',
    subtitle: 'Comece pela avaliação do cenário atual e pelos principais gaps de governança, qualidade, processos e tecnologia.',
  },
  nav: {
    contexto: 'A norma',
    dimensoes: 'Dimensões',
    desafio: 'O desafio',
    jornada: 'Como ajudamos',
    capacidades: 'Capacidades',
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
    /* BLOCO 01 | HERO. `pageHero` não embute formulário (o brief pede um no
       herói); a captação fica no `ctaContact` do rodapé. */
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
        { label: t.ctaDiag, href: HREF_DIAG },
        { label: t.ctaSpecialist, href: '#contato' },
      ],
      metrics: [],
    },
    { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
    /* BLOCO 02 | CONTEXTO */
    {
      blockType: 'iconCardGrid' as const,
      anchor: 'a-norma',
      navLabel: t.nav.contexto,
      eyebrow: t.contexto.eyebrow,
      title: t.contexto.title,
      columns: '3' as const,
      variant: 'card' as const,
      items: t.contexto.cards.map((c) => ({ icon: c.icon as Icone, title: c.title, description: c.desc })),
    },
    /* BLOCO 03 | O QUE A RC 18 EXIGE */
    {
      blockType: 'iconCardGrid' as const,
      eyebrow: t.exige.eyebrow,
      title: t.exige.title,
      columns: '4' as const,
      variant: 'card' as const,
      items: t.exige.cards.map((c) => ({ icon: c.icon as Icone, title: c.title, description: c.desc })),
    },
    /* BLOCO 04 | 12 DIMENSÕES */
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
    /* BLOCO 05 | O VERDADEIRO DESAFIO */
    {
      blockType: 'iconCardGrid' as const,
      anchor: 'o-desafio',
      navLabel: t.nav.desafio,
      eyebrow: t.desafio.eyebrow,
      title: t.desafio.title,
      columns: '3' as const,
      variant: 'card' as const,
      items: t.desafio.cards.map((c) => ({ icon: c.icon as Icone, title: c.title, description: c.desc })),
    },
    /* BLOCO 06 | O PRAZO */
    {
      blockType: 'processSteps' as const,
      theme: 'surface-2' as const,
      eyebrow: t.prazo.eyebrow,
      title: t.prazo.title,
      description: t.prazo.desc,
      steps: t.prazo.steps.map((s) => ({ title: s.title, description: s.desc })),
    },
    /* BLOCO 07 | COMO A ATRA AJUDA */
    {
      blockType: 'processSteps' as const,
      anchor: 'como-ajudamos',
      navLabel: t.nav.jornada,
      eyebrow: t.jornada.eyebrow,
      title: t.jornada.title,
      description: t.jornada.desc,
      steps: t.jornada.steps.map((s) => ({ title: s.title, description: s.desc })),
    },
    /* BLOCO 08 | CAPACIDADES */
    {
      blockType: 'valueCards' as const,
      anchor: 'capacidades',
      navLabel: t.nav.capacidades,
      variant: 'glow' as const,
      eyebrow: t.capacidades.eyebrow,
      title: t.capacidades.title,
      items: t.capacidades.cards.map((c) => ({
        icon: c.icon as Icone,
        glowColor: c.glow as 'blue' | 'orange',
        title: c.title,
        description: c.desc,
        bullets: [],
      })),
    },
    /* BLOCO 09 | EXPERIÊNCIA / PROVA */
    {
      blockType: 'audienceSplit' as const,
      eyebrow: t.experiencia.eyebrow,
      eyebrowIcon: 'award' as const,
      title: t.experiencia.title,
      description: t.experiencia.desc,
      items: t.experiencia.items.map((it) => ({
        icon: it.icon as Icone,
        accent: it.accent as 'primary' | 'secondary',
        title: it.title,
        description: it.desc,
      })),
    },
    /* BLOCO 11 | CTA FINAL */
    {
      blockType: 'ctaBanner' as const,
      variant: 'dark' as const,
      title: t.ctaBanner.title,
      highlight: t.ctaBanner.highlight,
      description: t.ctaBanner.desc,
      cta: { label: t.ctaBanner.label, href: HREF_DIAG },
      secondaryCta: { label: t.ctaBanner.secondary, href: '#contato', caption: t.ctaBanner.caption },
    },
    /* BLOCO 11 | FORMULÁRIO. Padrão da home (task 004): variante com foto + cartão
       de contato. O brief pede campos extras (empresa, cargo, "já iniciou a
       adequação?") que o `ctaContact` não tem — fica o formulário padrão. */
    {
      blockType: 'ctaContact' as const,
      anchor: 'contato',
      navLabel: t.nav.contato,
      title: t.contato.title,
      subtitle: t.contato.subtitle,
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

console.log('  1 página, 12 blocos, 2 idiomas (EN stub)')
process.exit(0)
