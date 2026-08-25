/* Seed da página de Inteligência Artificial (MIG-056).
 *
 * De `legacy/src/pages/SolutionAI.tsx` e das chaves `solution.*` de
 * `legacy/src/locales/{pt,en}.json`. Idempotente: acha a solução pelo slug e
 * substitui o `layout` inteiro.
 *
 * É a **única** das 6 soluções com conteúdo (D-09). As outras 5 seguem com
 * `hasPage: false` até MIG-093 escrever as delas — o mesmo layout serve, sem
 * componente novo.
 */

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { capaPendente } from './midia'
import { casarIds } from './ids'
import { imagemDoPrototipo } from './imagens-do-prototipo'

const SLUG = 'inteligencia-artificial'

const payload = await getPayload({ config })

/* As duas imagens da página são hotlinks do Unsplash no legado (`:166` e
 * `:715`) — foto de banco que não é da ATRA. Mesmo encaminhamento das capas de
 * material: entra o marcador, e a imagem real vem com o conteúdo. Ver
 * inventario-assets.md e debito-tecnico.md. */

const imagem = await capaPendente(payload)

/* Com `SEED_FIXTURES=1` cada uma volta a ser a foto que o gabarito desenha —
 * são **duas** imagens diferentes no legado, e o marcador as igualava. Sem o
 * sinal, marcador nas duas. Ver `imagens-do-prototipo.ts`. */
const imagemDoHeroi =
  (await imagemDoPrototipo(payload, 'solucao-ia.hero', 'Ilustração de Inteligência Artificial')) ?? imagem
const imagemDoMetodo =
  (await imagemDoPrototipo(payload, 'solucao-ia.como-fazemos', 'Como a ATRA constrói soluções de IA')) ?? imagem

const PT = {
  heroTitle: 'Soluções em Inteligência Artificial & IA Generativa',
  heroHighlight: 'Inteligência Artificial',
  heroDesc:
    'Transforme a maneira como sua empresa opera com nosso serviço de IA, projetado para automatizar processos, gerar conteúdo inteligente e criar agentes autônomos que impulsionam a inovação e garantem resultados precisos.',
  chip: 'Pronto para Produção',
  hire: 'Contrate o serviço',
  contato: 'Entre em contato',
  metricas: ['Automação de Rotinas', 'Velocidade de Análise', 'Precisão de RAG'],
  nav: ['Como funciona', 'Benefícios', 'Para quem é este serviço', 'Como fazemos'],
  s1: {
    eyebrow: '01. Metodologia & Arquitetura',
    title: 'Estruturando a Inovação com Inteligência Artificial',
    desc: 'Nosso serviço de IA foca na construção de infraestruturas e modelos robustos que permitem a automação avançada, geração de conteúdo e análise preditiva de maneira eficiente. Avaliamos as necessidades da empresa, projetamos arquiteturas personalizadas e desenvolvemos agentes autônomos e LLMs que suportam operações de negócios de alta performance. Além disso, garantimos que os modelos sejam precisos, acessíveis e seguros, operacionalizando-os com as melhores práticas de MLOps.',
    cards: [
      {
        badge: '01 / DIAGNÓSTICO',
        title: 'Análise de Oportunidades de IA',
        desc: 'Avaliamos as necessidades específicas da sua empresa para identificar os melhores casos de uso para LLMs, Machine Learning e automação inteligente.',
        bullets: ['Mapeamento de casos de alto ROI', 'Análise de prontidão de dados'],
      },
      {
        badge: '02 / DESENVOLVIMENTO',
        title: 'Desenvolvimento de Agentes e LLMs',
        desc: 'Criamos assistentes virtuais, copilotos corporativos e modelos personalizados que garantem a geração de conteúdo e automação de atendimento.',
        bullets: ['Copilotos corporativos & RAG', 'Agentes autônomos multi-tarefa'],
      },
      {
        badge: '03 / OPERAÇÃO',
        title: 'Operacionalização (MLOps)',
        desc: 'Integramos e monitoramos as soluções de IA (MLOps) para assegurar escalabilidade, governança, desempenho eficiente e segurança contínua.',
        bullets: ['Governança & mitigação de alucinações', 'Observabilidade & MLOps contínuo'],
      },
    ],
  },
  s2: {
    eyebrow: '02. Vantagens Estratégicas',
    title: 'Benefícios do Serviço de IA Generativa',
    desc: 'Resultados mensuráveis com tecnologia de ponta, governança nativa e foco contínuo em impacto nos negócios.',
    cards: [
      {
        badge: 'Alto Impacto Operacional',
        chip: '+70% Automação',
        title: 'Eficiência Operacional',
        desc: 'Automação de tarefas repetitivas e atendimento ao cliente com agentes autônomos rápidos e eficientes. Substitua fluxos manuais lentos por agentes conversacionais inteligentes conectados às suas bases de dados e APIs internas.',
        metrics: [
          { value: '24/7', label: 'Disponibilidade contínua', color: 'secondary' as const },
          { value: '0s', label: 'Fila de espera em SAC', color: 'primary' as const },
          { value: '-60%', label: 'Custo por interação', color: 'emerald' as const },
        ],
        tags: [] as string[],
        bullets: [] as string[],
        footer: 'Agilidade sem perder a governança corporativa.',
      },
      {
        badge: 'Geração & Síntese',
        chip: null,
        title: 'Inovação em Conteúdo',
        desc: 'Geração automatizada de textos, relatórios e insights, acelerando a produção e criatividade.',
        metrics: [],
        tags: ['LLMs Customizadas', 'RAG Proprietário', 'Síntese de Relatórios', 'Extração de PDFs'],
        bullets: [],
        footer: 'Inteligência criativa aliada à precisão analítica.',
      },
      {
        badge: null,
        chip: 'Governança & MLOps',
        title: 'Escalabilidade Inteligente',
        desc: 'Infraestrutura de MLOps flexível que cresce com as necessidades do seu negócio, mantendo a governança.',
        metrics: [],
        tags: [],
        bullets: ['Pipelines de CI/CD para modelos e prompts', 'Segurança de dados e conformidade LGPD'],
        footer: 'Monitoramento contínuo de latência, custo e acurácia.',
      },
      {
        badge: null,
        chip: 'ROI Mensurável',
        title: 'Adoção Acelerada & Retorno Rápido',
        desc: 'Abordagem orientada a PoCs rápidas em 4 a 6 semanas para validação técnica e comprovação de valor antes da escala corporativa.',
        metrics: [],
        tags: [],
        bullets: ['Integração nativa com Lakehouses em Nuvem', 'Capacitação e Enablement para times de negócios'],
        footer: 'Implementação pragmática sem fricção com sistemas existentes.',
      },
    ],
  },
  s3: {
    eyebrow: '03. Perfil de Aplicação',
    title: 'Pra quem é esse serviço?',
    desc: 'Nosso serviço de Inteligência Artificial é ideal para empresas que buscam liderar a inovação em seus setores, automatizando processos complexos e gerando valor através de tecnologias de ponta. Este serviço é particularmente útil para organizações que:',
    items: [
      {
        title: 'Assistentes & Atendimento',
        desc: 'Precisam de assistentes virtuais e copilotos corporativos robustos para suportar operações de atendimento e vendas.',
      },
      {
        title: 'Automação de Conteúdo & Análise',
        desc: 'Desejam otimizar a geração de conteúdo, relatórios e análises preditivas para melhorar a eficiência.',
      },
      {
        title: 'Governança & MLOps Seguro',
        desc: 'Buscam garantir a governança, escalabilidade e segurança dos modelos de Machine Learning (MLOps).',
      },
    ],
  },
  s4: {
    eyebrow: '04. Etapas do Processo',
    title: 'Como fazemos?',
    desc: 'Da identificação do problema à entrega escalável com ciclos contínuos de melhoria.',
    selo: { title: 'Metodologia Ágil ATRA', subtitle: 'Sprint-driven • Foco em ROI' },
    steps: [
      {
        title: 'Abordagem Centrada no Problema',
        desc: 'Focamos em entender profundamente os desafios do seu negócio antes de aplicar a tecnologia, garantindo que a IA resolva problemas reais e gere ROI.',
      },
      {
        title: 'Tecnologias Avançadas (LLMs & ML)',
        desc: 'Utilizamos os modelos de linguagem fundacionais mais avançados e frameworks de Machine Learning modernos para construir soluções precisas e escaláveis.',
      },
      {
        title: 'Iteração e MLOps',
        desc: 'Implementamos ciclos de feedback contínuo e práticas de MLOps para monitorar, retreinar e garantir a governança dos modelos em produção.',
      },
    ],
  },
  cta: {
    title: 'Comece a revolução da IA na sua empresa',
    highlight: 'revolução da IA',
    desc: 'Entre em contato conosco hoje e descubra como a ATRA pode transformar seus processos com Inteligência Artificial. Faça a mudança agora!',
    label: 'Entre em contato',
    secondary: 'Dúvida Rápida?',
    caption: 'fale com nosso assistente de IA',
  },
}

const EN: typeof PT = {
  heroTitle: 'Solutions in Artificial Intelligence & Generative AI',
  heroHighlight: 'Artificial Intelligence',
  heroDesc:
    'Transform how your company operates with our AI service, designed to automate processes, generate intelligent content, and create autonomous agents that drive innovation and ensure precise results.',
  chip: 'Production Ready',
  hire: 'Hire the service',
  contato: 'Contact us',
  metricas: ['Routine automation', 'Analysis speed', 'RAG accuracy'],
  nav: ['How it works', 'Benefits', 'Who is this service for', 'How we do it'],
  s1: {
    eyebrow: '01. Methodology & Architecture',
    title: 'Structuring Innovation with Artificial Intelligence',
    desc: "Our AI service focuses on building robust infrastructures and models that enable advanced automation, content generation, and predictive analysis efficiently. We evaluate the company's needs, design custom architectures, and develop autonomous agents and LLMs that support high-performance business operations. Furthermore, we ensure the models are precise, accessible, and secure, operationalizing them with MLOps best practices.",
    cards: [
      {
        badge: '01 / DIAGNOSIS',
        title: 'AI Opportunities Analysis',
        desc: "We evaluate your company's specific needs to identify the best use cases for LLMs, Machine Learning, and intelligent automation.",
        bullets: ['High-ROI use case mapping', 'Data readiness assessment'],
      },
      {
        badge: '02 / DEVELOPMENT',
        title: 'Agent and LLM Development',
        desc: 'We create virtual assistants, corporate copilots, and custom models that guarantee content generation and customer service automation.',
        bullets: ['Corporate copilots & RAG', 'Multi-task autonomous agents'],
      },
      {
        badge: '03 / OPERATION',
        title: 'Operationalization (MLOps)',
        desc: 'We integrate and monitor AI solutions (MLOps) to ensure scalability, governance, efficient performance, and continuous security.',
        bullets: ['Governance & hallucination mitigation', 'Observability & continuous MLOps'],
      },
    ],
  },
  s2: {
    eyebrow: '02. Strategic Advantages',
    title: 'Benefits of the Generative AI Service',
    desc: 'Measurable results with leading technology, native governance and a continuous focus on business impact.',
    cards: [
      {
        badge: 'High Operational Impact',
        chip: '+70% automation',
        title: 'Operational Efficiency',
        desc: 'Automation of repetitive tasks and customer service with fast and efficient autonomous agents. Replace slow manual flows with intelligent conversational agents connected to your internal databases and APIs.',
        metrics: [
          { value: '24/7', label: 'Continuous availability', color: 'secondary' as const },
          { value: '0s', label: 'Support queue wait', color: 'primary' as const },
          { value: '-60%', label: 'Cost per interaction', color: 'emerald' as const },
        ],
        tags: [],
        bullets: [],
        footer: 'Agility without losing corporate governance.',
      },
      {
        badge: 'Generation & Synthesis',
        chip: null,
        title: 'Innovation in Content',
        desc: 'Automated generation of texts, reports, and insights, accelerating production and creativity.',
        metrics: [],
        tags: ['Custom LLMs', 'Proprietary RAG', 'Report synthesis', 'PDF extraction'],
        bullets: [],
        footer: 'Creative intelligence paired with analytical precision.',
      },
      {
        badge: null,
        chip: 'Governance & MLOps',
        title: 'Intelligent Scalability',
        desc: 'Flexible MLOps infrastructure that grows with your business needs while maintaining governance.',
        metrics: [],
        tags: [],
        bullets: ['CI/CD pipelines for models and prompts', 'Data security and LGPD compliance'],
        footer: 'Continuous monitoring of latency, cost and accuracy.',
      },
      {
        badge: null,
        chip: 'Measurable ROI',
        title: 'Accelerated Adoption & Fast Return',
        desc: 'A PoC-driven approach in 4 to 6 weeks for technical validation and proof of value before scaling across the company.',
        metrics: [],
        tags: [],
        bullets: ['Native integration with cloud Lakehouses', 'Training and enablement for business teams'],
        footer: 'Pragmatic implementation without friction with existing systems.',
      },
    ],
  },
  s3: {
    eyebrow: '03. Application Profile',
    title: 'Who is this service for?',
    desc: 'Our Artificial Intelligence service is ideal for companies looking to lead innovation in their sectors, automating complex processes and generating value through cutting-edge technologies. This service is particularly useful for organizations that:',
    items: [
      {
        title: 'Assistants & Support',
        desc: 'Need robust virtual assistants and corporate copilots to support customer service and sales operations.',
      },
      {
        title: 'Content Automation & Analysis',
        desc: 'Want to optimize content generation, reports, and predictive analysis to improve efficiency.',
      },
      {
        title: 'Governance & Secure MLOps',
        desc: 'Seek to ensure governance, scalability, and security of Machine Learning (MLOps) models.',
      },
    ],
  },
  s4: {
    eyebrow: '04. Process Steps',
    title: 'How we do it?',
    desc: 'From identifying the problem to scalable delivery with continuous improvement cycles.',
    selo: { title: 'ATRA Agile Methodology', subtitle: 'Sprint-driven • ROI-focused' },
    steps: [
      {
        title: 'Problem-Centric Approach',
        desc: 'We focus on deeply understanding your business challenges before applying technology, ensuring AI solves real problems and generates ROI.',
      },
      {
        title: 'Advanced Technologies (LLMs & ML)',
        desc: 'We use the most advanced foundational language models and modern Machine Learning frameworks to build precise and scalable solutions.',
      },
      {
        title: 'Iteration and MLOps',
        desc: 'We implement continuous feedback loops and MLOps practices to monitor, retrain, and ensure the governance of models in production.',
      },
    ],
  },
  cta: {
    title: 'Start the AI revolution in your company',
    highlight: 'AI revolution',
    desc: 'Contact us today and discover how ATRA can transform your processes with Artificial Intelligence. Make the change now!',
    label: 'Contact us',
    secondary: 'Quick Question?',
    caption: 'talk to our AI assistant',
  },
}

/* Ícones por posição, iguais nos dois idiomas — `SolutionAI.tsx` importa os
 * mesmos glifos do Lucide que o app novo usa. */
const ICONES_S1 = ['search', 'brain', 'settings'] as const
const ACENTOS_S1 = ['primary', 'primary', 'secondary'] as const
const ICONES_S2 = ['zap', 'cpu', 'shield-check', 'trending-up'] as const
const ACENTOS_S2 = ['secondary', 'primary', 'primary', 'secondary'] as const
const LARGURAS_S2 = ['7', '5', '6', '6'] as const
const ICONES_RODAPE_S2 = ['arrow-up-right', 'cpu', null, null] as const
const PESOS_S2 = ['featured-wide', 'featured', 'supporting', 'supporting'] as const
const ICONES_S3 = ['target', 'zap', 'shield-check'] as const
const ACENTOS_S3 = ['primary', 'secondary', 'primary'] as const

function layout(t: typeof PT) {
  return [
    {
      blockType: 'pageHero' as const,
      /* ⚠️ "solution.categoryBadge" é literal, e não engano de porte: a chave
       * não existe em `pt.json` nem em `en.json`, e o i18next devolve o nome da
       * chave. O legado publica isso no selo do herói — conferido no navegador.
       * Portado como está (D-15) e registrado em debito-tecnico.md. */
      badge: 'solution.categoryBadge',
      chip: t.chip,
      title: t.heroTitle,
      highlight: [t.heroHighlight],
      description: t.heroDesc,
      descriptionWidth: 'wide' as const,
      ctaVariant: 'secondary' as const,
      metrics: [
        { value: 70, suffix: '%', label: t.metricas[0], color: 'primary' as const },
        { value: 3, suffix: 'x', label: t.metricas[1], color: 'secondary' as const },
        { value: 99, suffix: '.8%', label: t.metricas[2], color: 'emerald' as const },
      ],
      ctas: [{ label: t.hire, href: '#contato' }],
      mediaMode: 'image' as const,
      images: [imagemDoHeroi],
    },
    { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
    {
      blockType: 'methodCards' as const,
      anchor: 'como-funciona',
      navLabel: t.nav[0],
      eyebrow: t.s1.eyebrow,
      eyebrowIcon: 'workflow' as const,
      title: t.s1.title,
      description: t.s1.desc,
      headerCta: { label: t.contato, href: '#contato' },
      items: t.s1.cards.map((c, i) => ({
        icon: ICONES_S1[i],
        accent: ACENTOS_S1[i],
        badge: c.badge,
        title: c.title,
        description: c.desc,
        bullets: c.bullets.map((text) => ({ text })),
      })),
    },
    {
      blockType: 'bentoGrid' as const,
      anchor: 'beneficios',
      navLabel: t.nav[1],
      theme: 'surface-2' as const,
      eyebrow: t.s2.eyebrow,
      eyebrowIcon: 'sparkles' as const,
      title: t.s2.title,
      description: t.s2.desc,
      items: t.s2.cards.map((c, i) => ({
        span: LARGURAS_S2[i],
        size: PESOS_S2[i],
        accent: ACENTOS_S2[i],
        icon: ICONES_S2[i],
        badge: c.badge,
        chip: c.chip,
        title: c.title,
        description: c.desc,
        metrics: c.metrics,
        tags: c.tags.map((name) => ({ name })),
        bullets: c.bullets.map((text) => ({ text })),
        footer: c.footer,
        footerIcon: ICONES_RODAPE_S2[i],
      })),
    },
    {
      blockType: 'audienceSplit' as const,
      anchor: 'para-quem',
      navLabel: t.nav[2],
      eyebrow: t.s3.eyebrow,
      eyebrowIcon: 'target' as const,
      title: t.s3.title,
      description: t.s3.desc,
      cta: { label: t.contato, href: '#contato' },
      items: t.s3.items.map((it, i) => ({
        icon: ICONES_S3[i],
        accent: ACENTOS_S3[i],
        title: it.title,
        description: it.desc,
      })),
    },
    {
      blockType: 'accordionSteps' as const,
      anchor: 'como-fazemos',
      navLabel: t.nav[3],
      theme: 'surface-2' as const,
      eyebrow: t.s4.eyebrow,
      eyebrowIcon: 'settings' as const,
      title: t.s4.title,
      description: t.s4.desc,
      image: imagemDoMetodo,
      imageBadge: { icon: 'workflow' as const, title: t.s4.selo.title, subtitle: t.s4.selo.subtitle },
      steps: t.s4.steps.map((e) => ({ title: e.title, description: e.desc })),
    },
    {
      blockType: 'ctaBanner' as const,
      anchor: 'contato',
      variant: 'dark' as const,
      title: t.cta.title,
      highlight: t.cta.highlight,
      description: t.cta.desc,
      /* WhatsApp com o número de `App.tsx:2391`. ⚠️ P-09: o telefone oficial
       * pode ser outro — se for, muda aqui e no global `contact`. */
      cta: { label: t.cta.label, href: 'https://wa.me/5511963052391' },
      secondaryCta: { label: t.cta.secondary, href: '/chat', caption: t.cta.caption },
    },
  ]
}

console.log('→ página de solução: IA')
const { docs } = await payload.find({
  collection: 'solutions',
  where: { slug: { equals: SLUG } },
  limit: 1,
  locale: 'pt',
  depth: 0,
})
if (!docs[0]) {
  console.error(`✖ solução "${SLUG}" não existe. Rode scripts/seed/solucoes.ts antes.`)
  process.exit(1)
}

await payload.update({
  collection: 'solutions',
  id: docs[0].id,
  data: { hasPage: true, layout: layout(PT), _status: 'published' },
  locale: 'pt',
})
/* Relê o gravado e casa os ids **em todos os níveis** antes de escrever o
 * inglês. Casar só o id do bloco não basta: `items`, `metrics`, `bullets` e
 * `tags` também têm id, e sem eles o português dentro dos cards some. Ver
 * `ids.ts` — foi exatamente o que aconteceu aqui na primeira tentativa. */
const gravado = await payload.findByID({ collection: 'solutions', id: docs[0].id, locale: 'pt', depth: 0 })
await payload.update({
  collection: 'solutions',
  id: docs[0].id,
  data: { layout: casarIds(layout(EN), gravado.layout), _status: 'published' },
  locale: 'en',
})

console.log('  1 página, 7 blocos, 2 idiomas')
process.exit(0)
