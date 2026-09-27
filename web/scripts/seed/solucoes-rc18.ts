/* Seed da página de solução RC18 (feature rc18, task 003; revisto para espelhar a
 * landing oficial; a partir da task 029, aponta para o diagnóstico de maturidade).
 *
 * Fonte de conteúdo:
 * - **Landing oficial `rc18-25` (RD Station), em www-atrainformatica-com-br.rds.land** —
 *   é o gabarito de conteúdo atual do marketing. Textos das seções, ordem e CTAs
 *   foram alinhados a ela em 14/09/2026. As 12 dimensões usam as descrições curtas
 *   da landing (decisão do dono via G-ferrari), no lugar do texto longo da norma.
 * - Resolução Conjunta nº 18, de 28/11/2025 (BCB + CMN) — referência das 12
 *   dimensões (Art. 2º) e do prazo de adequação 31/12/2026 (Art. 12).
 *
 * Diferenças em relação à landing (decididas com o dono):
 * - **Sem formulário na página.** A landing tem o formulário RD; aqui ele não
 *   entra. Até a task 029 havia o nosso `ctaContact` no fim, e ele saiu pela ata
 *   de 24/09 ("substituir dentro dessa página da RC18"): quem chega à RC18 vai
 *   para o **diagnóstico de maturidade** (D-35), não para um formulário genérico.
 *   Com ele saiu o item "Contato" (`#contato`) do submenu, que se monta das
 *   âncoras dos blocos.
 * - **Sem os blocos "Capacidades" e "Experiência"** da versão anterior: a landing
 *   não os tem, e o dono pediu para igualar a ela.
 * - Mantida a **linha do tempo do prazo** (`processSteps`), que enriquece a seção
 *   do prazo sem sair do conteúdo da landing.
 *
 * CTAs:
 * - Herói: "Falar com especialista" → WhatsApp do diretor e "Verificar
 *   diagnóstico" → diagnóstico de maturidade já no setor financeiro
 *   (`/diagnostico-maturidade?setor=financeiro`).
 * - Faixa final (`ctaBanner`): "Falar com especialista" → WhatsApp do diretor.
 *
 * ⚠️ Este seed é para ambientes novos. Banco que já tinha a página na versão
 * anterior (com o `ctaContact` e o link para `/diagnostico-rc18`) é atualizado
 * pela migração `20260926_220000_rc18_aponta_para_o_diagnostico`, que roda no
 * deploy e só age se a página ainda estiver como este seed a deixava.
 *
 * Diferente de `solucao-ia.ts`, este seed **cria** o documento (RC18 não está
 * entre as 6 soluções-base de `solucoes.ts`) e depois grava o layout. Idempotente
 * pelo slug. A categoria `rc18` (4ª aba do mega-menu) veio na migração da task 002.
 *
 * ⚠️ EN é um **stub em português** (decisão PT-only da v1): a RC 18/2025 é norma
 * do BCB para instituições brasileiras, público 100% nacional. O layout de blocos
 * é compartilhado entre locales (só os campos de texto são localizados), então o
 * EN reusa o conteúdo PT — o suficiente para a rota `/en/solutions/rc18` resolver
 * sem texto em branco.
 *
 * ⚠️ Conteúdo é rascunho: a consolidação de texto é do marketing no CMS (D-22).
 * Limitações do porte para os blocos existentes: o `pageHero` não embute
 * formulário; e o `iconCardGrid` não tem parágrafo de abertura, então os "textos
 * de abertura" das seções de cards da landing não foram portados (ficam
 * eyebrow+título).
 */

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { ICONES } from '../../src/blocks/shared'
import { casarIds } from './ids'

/* O ícone dos blocos é uma união fechada (blocks/shared.ts). O conteúdo abaixo
 * guarda os nomes como string; casamos com a união na montagem do layout. */
type Icone = (typeof ICONES)[number]

const SLUG = 'rc18'

const payload = await getPayload({ config })

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
  ctaEspecialista: 'Falar com especialista',
  ctaVerificar: 'Verificar diagnóstico',
  /* BLOCO 02 | O NOVO CENÁRIO */
  contexto: {
    eyebrow: 'O novo cenário',
    title: 'A RC 18 mudou o nível de exigência sobre os dados regulatórios',
    /* Parágrafo de abertura restaurado da landing oficial (o `iconCardGrid` não
       tinha slot de intro; o `audienceSplit` tem). */
    intro:
      'A Resolução Conjunta nº 18/2025 estabelece requisitos para a política de qualidade das informações prestadas ou disponibilizadas ao Banco Central. Na prática, isso significa governança, validação, rastreabilidade, monitoramento e evidências.',
    cards: [
      { icon: 'shield', title: 'Governar', desc: 'Responsabilidades e controles claramente definidos.' },
      { icon: 'shield-check', title: 'Validar', desc: 'Testes, verificações e reconciliações antes do envio.' },
      { icon: 'search', title: 'Rastrear', desc: 'Capacidade de acompanhar a origem e o tratamento das informações.' },
      { icon: 'chart', title: 'Monitorar', desc: 'Acompanhamento contínuo da qualidade e identificação de inconsistências.' },
      { icon: 'file-text', title: 'Evidenciar', desc: 'Registros e trilhas que permitam comprovar os controles realizados.' },
    ],
  },
  /* BLOCO 03 | O QUE PRECISA ESTAR ESTRUTURADO */
  exige: {
    eyebrow: 'O que precisa estar estruturado',
    title: 'Qualidade de dados agora precisa estar sustentada por governança',
    cards: [
      { icon: 'user-check', title: 'Governança e responsabilidade', desc: 'Papéis definidos, responsabilidades claras e envolvimento da alta administração.' },
      { icon: 'database', title: 'Dados e tecnologia', desc: 'Arquitetura, infraestrutura e ferramentas adequadas para gestão e qualidade das informações.' },
      { icon: 'shield-check', title: 'Controles e evidências', desc: 'Validações, testes, reconciliações, documentação e trilhas de auditoria.' },
      { icon: 'chart', title: 'Monitoramento contínuo', desc: 'Acompanhamento da qualidade, identificação de irregularidades e ações corretivas.' },
    ],
  },
  /* BLOCO 04 | 12 DIMENSÕES (Art. 2º) — descrições curtas da landing */
  dimensoes: {
    eyebrow: 'Qualidade da informação',
    title: 'As 12 dimensões para uma informação de qualidade',
    cards: [
      { icon: 'user-check', title: 'Acessibilidade', desc: 'Informações disponíveis nas condições adequadas.' },
      { icon: 'target', title: 'Acurácia', desc: 'Dados que refletem a realidade com precisão.' },
      { icon: 'settings', title: 'Adaptabilidade', desc: 'Capacidade de atender diferentes demandas e cenários.' },
      { icon: 'info', title: 'Clareza', desc: 'Informações apresentadas de forma compreensível.' },
      { icon: 'chart', title: 'Comparabilidade', desc: 'Possibilidade de comparar informações entre períodos e contextos.' },
      { icon: 'database', title: 'Completude', desc: 'Atendimento integral aos aspectos requeridos.' },
      { icon: 'shield-check', title: 'Confiabilidade', desc: 'Redução de desvios relevantes entre dados revisados e iniciais.' },
      { icon: 'workflow', title: 'Consistência', desc: 'Ausência de contradições entre fontes e métodos.' },
      { icon: 'lock', title: 'Integridade', desc: 'Garantia de autenticidade e proteção contra alterações indevidas.' },
      { icon: 'search', title: 'Rastreabilidade', desc: 'Capacidade de acompanhar o dado desde sua origem até o usuário final.' },
      { icon: 'star', title: 'Relevância', desc: 'Informação útil para a tomada de decisão.' },
      { icon: 'zap', title: 'Tempestividade', desc: 'Informação disponível no prazo e no momento adequado.' },
    ],
  },
  /* BLOCO 05 | O VERDADEIRO DESAFIO */
  desafio: {
    eyebrow: 'O verdadeiro desafio',
    title: 'O desafio não é apenas ter dados corretos. É conseguir provar a qualidade.',
    /* Parágrafo à esquerda (coluna do texto), restaurado da landing. A frase de
       intro da faixa é injetada pela página (não há campo CMS p/ ela). */
    lead: 'Em ambientes financeiros, uma mesma informação pode passar por diferentes sistemas, áreas, regras de negócio e processos antes de chegar ao reporte regulatório.',
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
    eyebrow: 'O prazo está correndo',
    title: '31 de dezembro de 2026',
    desc: 'Em vigor desde janeiro de 2026, a resolução dá prazo até 31 de dezembro de 2026 para a adequação — o desafio é transformar a exigência em uma estrutura contínua, não só para bater a data.',
    steps: [
      { title: 'Hoje', desc: 'Situação atual da instituição.' },
      { title: 'Diagnóstico', desc: 'Avaliação do cenário, dos processos e dos controles.' },
      { title: 'Roadmap', desc: 'Plano de adequação priorizado por risco e esforço.' },
      { title: 'Implementação', desc: 'Execução das mudanças de governança, dados e tecnologia.' },
      { title: 'Evidências', desc: 'Registros e trilhas que comprovam os controles realizados.' },
      { title: 'Adequação', desc: 'Conformidade contínua com a norma.' },
    ],
  },
  /* BLOCO 07 | COMO A ATRA TE AJUDA */
  jornada: {
    eyebrow: 'Como a ATRA te ajuda',
    title: 'Nossa jornada de adequação',
    desc: 'Uma abordagem estruturada, com foco na sua realidade e no seu cenário regulatório.',
    steps: [
      { title: 'Diagnosticar', desc: 'Avaliação da maturidade, processos, dados críticos e principais gaps.' },
      { title: 'Governar', desc: 'Políticas, responsabilidades, papéis, processos e indicadores.' },
      { title: 'Estruturar', desc: 'Arquitetura de dados, catálogo, metadados, qualidade e rastreabilidade.' },
      { title: 'Evidenciar', desc: 'Automação de controles, testes, monitoramento e geração de evidências.' },
      { title: 'Sustentar', desc: 'Acompanhamento contínuo, auditoria e evolução.' },
    ],
  },
  /* BLOCO 08 | CTA FINAL (faixa "Próximo passo") */
  ctaBanner: {
    title: 'Sua instituição está preparada para a RC 18/2025?',
    highlight: 'RC 18/2025',
    desc: 'Comece avaliando o cenário atual e identificando os principais gaps de governança, qualidade, processos e tecnologia.',
  },
  nav: {
    contexto: 'O novo cenário',
    dimensoes: 'Dimensões',
    desafio: 'O desafio',
    jornada: 'Como ajudamos',
  },
}

/* EN é stub em PT (decisão PT-only da v1) — ver cabeçalho. */
const EN = PT

/* WhatsApp do diretor (Fábio) — link externo, aberto em nova aba pelo componente
 * (formato api.whatsapp.com). `href` não é `localized`: gravado uma vez, vale nos
 * dois locales. */
const HREF_WHATSAPP =
  'https://api.whatsapp.com/send/?phone=5511963060267&text=Oi+Fabio+vamos+agendar+um+papo&type=phone_number&app_absent=0'

/* Diagnóstico de maturidade de dados, aberto no setor financeiro (D-35: substituiu
 * o quick check da RC18, cujo endereço antigo virou redirect para cá). Direto na
 * rota nova, sem passar pelo redirect. Link interno literal, como o resto dos
 * seeds; `href` não é `localized`, vale nos dois locales (EN é stub). */
const HREF_DIAGNOSTICO = '/diagnostico-maturidade?setor=financeiro'

function layout(t: typeof PT) {
  return [
    /* BLOCO 01 | HERO. `pageHero` não embute formulário. Botão primário (laranja)
       abre o WhatsApp do diretor; o secundário leva ao diagnóstico de maturidade. */
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
        { label: t.ctaEspecialista, href: HREF_WHATSAPP },
        { label: t.ctaVerificar, href: HREF_DIAGNOSTICO },
      ],
      metrics: [],
    },
    { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
    /* BLOCO 02 | O NOVO CENÁRIO — audienceSplit: intro da norma + CTA à esquerda,
       as 5 capacidades empilhadas à direita (recompõe a antiga grade uniforme e
       recupera o parágrafo de abertura da landing). */
    {
      blockType: 'audienceSplit' as const,
      anchor: 'a-norma',
      navLabel: t.nav.contexto,
      eyebrow: t.contexto.eyebrow,
      title: t.contexto.title,
      description: t.contexto.intro,
      items: t.contexto.cards.map((c, i) => ({
        icon: c.icon as Icone,
        accent: (i % 2 === 0 ? 'primary' : 'secondary') as 'primary' | 'secondary',
        title: c.title,
        description: c.desc,
      })),
    },
    /* BLOCO 03 | O QUE PRECISA ESTAR ESTRUTURADO */
    {
      blockType: 'iconCardGrid' as const,
      eyebrow: t.exige.eyebrow,
      title: t.exige.title,
      columns: '4' as const,
      variant: 'card' as const,
      items: t.exige.cards.map((c) => ({ icon: c.icon as Icone, title: c.title, description: c.desc })),
    },
    /* BLOCO 04 | 12 DIMENSÕES — accordionSteps: recolhe a parede de 12 cards
       (ganho grande no mobile) e vira interativo. Sem imagem → acordeão em largura
       cheia; a 1ª nasce aberta. Os ícones das dimensões não entram (o acordeão
       numera 01–12); os títulos ficam sempre visíveis. */
    {
      blockType: 'accordionSteps' as const,
      anchor: 'dimensoes',
      navLabel: t.nav.dimensoes,
      theme: 'surface-2' as const,
      eyebrow: t.dimensoes.eyebrow,
      title: t.dimensoes.title,
      steps: t.dimensoes.cards.map((c) => ({ title: c.title, description: c.desc })),
    },
    /* BLOCO 05 | O VERDADEIRO DESAFIO — audienceSplit no layout da landing: texto
       (eyebrow + título + parágrafo) à esquerda; à direita, a frase de intro + uma
       faixa compacta de ícone+rótulo num painel. O modo "strip" e a frase de intro
       são injetados pela página (apresentação-only, escopada ao slug rc18). Ícones
       todos `primary` (azul), como a faixa toda azul da landing. */
    {
      blockType: 'audienceSplit' as const,
      anchor: 'o-desafio',
      navLabel: t.nav.desafio,
      eyebrow: t.desafio.eyebrow,
      title: t.desafio.title,
      description: t.desafio.lead,
      items: t.desafio.cards.map((c) => ({
        icon: c.icon as Icone,
        accent: 'primary' as const,
        title: c.title,
        description: c.desc,
      })),
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
    /* BLOCO 07 | COMO A ATRA TE AJUDA */
    {
      blockType: 'processSteps' as const,
      anchor: 'como-ajudamos',
      navLabel: t.nav.jornada,
      eyebrow: t.jornada.eyebrow,
      title: t.jornada.title,
      description: t.jornada.desc,
      steps: t.jornada.steps.map((s) => ({ title: s.title, description: s.desc })),
    },
    /* BLOCO 08 | CTA FINAL. Botão único "Falar com especialista" → WhatsApp do
       diretor (mesmo do herói). Sem âncora própria, e é o último bloco da página:
       o formulário de contato que vinha abaixo saiu na task 029 (ver cabeçalho). */
    {
      blockType: 'ctaBanner' as const,
      variant: 'dark' as const,
      title: t.ctaBanner.title,
      highlight: t.ctaBanner.highlight,
      description: t.ctaBanner.desc,
      cta: { label: t.ctaEspecialista, href: HREF_WHATSAPP },
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

console.log('  1 página, 9 blocos (8 seções + submenu), 2 idiomas (EN stub)')
process.exit(0)
