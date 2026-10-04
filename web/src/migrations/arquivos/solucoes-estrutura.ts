import type { AbaDeSolucoes } from '../../lib/abas-de-solucoes'

import { FIM_EN, FIM_PT } from './fim-das-paginas'

/* A estrutura nova do menu de Soluções (D-52) — o que a migração
 * `20261002_213000_nova_estrutura_de_solucoes` grava: 18 soluções em 4 abas, no
 * lugar das 18 que estavam no ar.
 *
 * Título e descrição são os da lista do G-ferrari (02/10), literais; só o
 * espaço duplo e a pontuação solta do rascunho foram acertados. Ícone, ordem e
 * endereço são desta migração — o endereço sai do título.
 *
 * ⚠️ As páginas nascem como **esqueleto**: o topo, com o título e a frase da
 * lista, e a faixa final padrão. Sem texto inventado — quem escreve a página é
 * o time da ATRA, no admin (D-22). Daqui para a frente quem manda é o admin:
 * mexer neste arquivo não muda ambiente que já recebeu a estrutura. */

export type SolucaoNova = {
  slug: string
  aba: AbaDeSolucoes
  title: string
  shortDescription: string
  icon: string
  /** Só no cartão em destaque. */
  badge?: string
}

export const SOLUCOES_NOVAS: SolucaoNova[] = [
  // Aba 1 · IA & Analytics Avançada
  {
    slug: 'ia-generativa-e-agentes-conversacionais',
    aba: 'innovation-ai',
    title: 'IA Generativa & Agentes Conversacionais',
    shortDescription:
      'IA que executa e orquestra processos: copilotos e agentes conectados às suas operações, com governança de modelos e uso responsável.',
    icon: 'sparkles',
  },
  {
    slug: 'analytics-conversacional',
    aba: 'innovation-ai',
    title: 'Analytics Conversacional',
    shortDescription: 'Pergunte aos seus indicadores e relatórios em linguagem natural, sobre dados governados.',
    icon: 'search',
    badge: 'Diferencial ATRA',
  },
  {
    slug: 'modelos-preditivos-e-de-recomendacao',
    aba: 'innovation-ai',
    title: 'Modelos Preditivos & de Recomendação',
    shortDescription: 'Antecipe churn, crédito, fraude e demanda com IA conectada à operação.',
    icon: 'trending-up',
  },
  {
    slug: 'extracao-inteligente-de-documentos',
    aba: 'innovation-ai',
    title: 'Extração Inteligente de Documentos',
    shortDescription: 'Contratos, laudos e PDFs viram dados estruturados, prontos para decisão.',
    icon: 'file-text',
  },
  {
    slug: 'bi-e-advanced-analytics',
    aba: 'innovation-ai',
    title: 'BI & Advanced Analytics',
    shortDescription:
      'Dashboards executivos, self-service e análises avançadas (de descritivas a preditivas) que transformam dados em decisão.',
    icon: 'chart',
  },

  // Aba 2 · Dados & Cloud
  {
    slug: 'plataforma-de-dados-e-lakehouse',
    aba: 'data-bi',
    title: 'Plataforma de Dados & Lakehouse',
    shortDescription: 'Uma base única e escalável (BigQuery, Databricks) para BI, analytics e IA.',
    icon: 'database',
  },
  {
    slug: 'engenharia-de-dados-e-pipelines',
    aba: 'data-bi',
    title: 'Engenharia de Dados & Pipelines',
    shortDescription: 'Alta performance para relatórios gerenciais e regulatórios (IFRS17, IFRS9, KYC).',
    icon: 'workflow',
  },
  {
    slug: 'migracao-e-modernizacao',
    aba: 'data-bi',
    title: 'Migração & Modernização',
    shortDescription: 'Legados para a nuvem com zero downtime e continuidade operacional.',
    icon: 'cloud',
  },
  {
    slug: 'integracao-de-dados',
    aba: 'data-bi',
    title: 'Integração de Dados',
    shortDescription: 'Conecte ambientes multicloud e on-premises, em lote ou tempo real, sem perder contexto.',
    icon: 'zap',
  },
  {
    slug: 'master-data-e-customer-360',
    aba: 'data-bi',
    title: 'Master Data & Customer 360',
    shortDescription: 'Dados únicos e confiáveis de clientes, em tempo real.',
    icon: 'users',
  },
  {
    slug: 'apps-web-mobile-e-apis',
    aba: 'data-bi',
    title: 'Apps Web, Mobile & APIs',
    shortDescription:
      'Aplicações web e mobile integradas ao Lakehouse, APIs em tempo real e modernização de aplicações legadas para cloud native, na ponta da decisão.',
    icon: 'app',
  },

  // Aba 3 · Governança & FinOps
  {
    slug: 'governanca-e-qualidade-de-dados',
    aba: 'governance-culture',
    title: 'Governança & Qualidade de Dados',
    shortDescription: 'Catálogo, qualidade e políticas de acesso com conformidade LGPD e regulatória.',
    icon: 'shield-check',
  },
  {
    slug: 'finops-e-eficiencia-em-nuvem',
    aba: 'governance-culture',
    title: 'FinOps & Eficiência em Nuvem',
    shortDescription: 'Otimização contínua de custos (queries, armazenamento, processamento) com ROI da plataforma.',
    icon: 'target',
  },

  // Aba 4 · Serviços Especializados
  {
    /* O site dizia "Fábrica de transformação de dados"; a lista de 02/10 troca
     * o nome, com a nota de que o antigo soava como ETL. */
    slug: 'fabrica-de-solucoes-de-dados',
    aba: 'specialized-services',
    title: 'Fábrica de Soluções de Dados',
    shortDescription:
      'Necessidade específica do seu negócio? Desenhamos e entregamos a solução de ponta a ponta, com qualidade e economia.',
    icon: 'settings',
  },
  {
    slug: 'sustentacao-remota-especializada',
    aba: 'specialized-services',
    title: 'Sustentação Remota Especializada',
    shortDescription: 'Suporte ágil e custo otimizado.',
    icon: 'headset',
  },
  {
    slug: 'alocacao-de-consultores',
    aba: 'specialized-services',
    title: 'Alocação de Consultores',
    shortDescription: 'Especialistas dentro da sua operação.',
    icon: 'user-check',
  },
  {
    slug: 'assessoria-em-produtos',
    aba: 'specialized-services',
    title: 'Assessoria em Produtos',
    shortDescription: 'A stack certa, recursos direcionados aos melhores resultados.',
    icon: 'briefcase',
  },
  {
    slug: 'cultura-de-dados-e-treinamentos',
    aba: 'specialized-services',
    title: 'Cultura de Dados & Treinamentos',
    shortDescription: 'Data Literacy para executivos e times, com cursos oficiais.',
    icon: 'graduation-cap',
  },
]

/** A trava da migração: existindo esta solução, a estrutura nova já chegou. */
export const SLUG_MARCADOR = 'analytics-conversacional'

/* As 18 que saem — as 6 do protótipo e as 12 do WordPress —, cada uma com a
 * solução nova que fica no lugar do endereço dela.
 *
 * ⚠️ É este mapa que a migração usa para saber o que apagar: só some o que está
 * aqui. A RC18 não está, e fica (D-37). Duas mantêm o endereço — Alocação de
 * Consultores e Assessoria em Produtos —, e a página nova nasce nele.
 *
 * O destino é o mais próximo em assunto, e serve aos redirects: quem chega pelo
 * endereço antigo (do WordPress ou da homologação) cai numa página que fala do
 * mesmo tema, em vez do índice. */
export const DESTINO_DAS_ANTIGAS = {
  'inteligencia-artificial': 'ia-generativa-e-agentes-conversacionais',
  'apps-e-solucoes-digitais': 'apps-web-mobile-e-apis',
  'fabrica-de-transformacao-de-dados': 'fabrica-de-solucoes-de-dados',
  'sustentacao-remota': 'sustentacao-remota-especializada',
  'assessoria-em-produtos': 'assessoria-em-produtos',
  'engenharia-de-dados-e-cloud': 'engenharia-de-dados-e-pipelines',
  'business-intelligence-e-advanced-analytics': 'bi-e-advanced-analytics',
  cloud: 'migracao-e-modernizacao',
  'data-integration': 'integracao-de-dados',
  'data-analytics': 'bi-e-advanced-analytics',
  'master-data-management': 'master-data-e-customer-360',
  'data-discovery': 'bi-e-advanced-analytics',
  'customer-360': 'master-data-e-customer-360',
  'governanca-de-dados-e-finops': 'governanca-e-qualidade-de-dados',
  'cultura-de-dados': 'cultura-de-dados-e-treinamentos',
  'governanca-de-dados': 'governanca-e-qualidade-de-dados',
  treinamento: 'cultura-de-dados-e-treinamentos',
  'alocacao-de-consultores': 'alocacao-de-consultores',
} as const satisfies Record<string, string>

export const SLUGS_ANTIGOS = Object.keys(DESTINO_DAS_ANTIGAS)

/** Endereço antigo → novo, só onde ele mudou. Alimenta os redirects do site. */
export const ENDERECOS_QUE_MUDARAM = Object.entries(DESTINO_DAS_ANTIGAS).filter(([antigo, novo]) => antigo !== novo)

/* O esqueleto da página: topo e faixa final. O selo do topo é o nome da aba —
 * diz ao visitante em que frente da oferta ele está. */
export function layoutEsqueleto(solucao: SolucaoNova, nomeDaAba: string, idioma: 'pt' | 'en') {
  return [
    {
      blockType: 'pageHero' as const,
      badge: nomeDaAba,
      title: solucao.title,
      description: solucao.shortDescription,
      align: 'left' as const,
      mediaMode: 'none' as const,
    },
    idioma === 'pt'
      ? structuredClone(FIM_PT)
      : {
          ...structuredClone(FIM_PT),
          title: FIM_EN.title,
          description: FIM_EN.description,
          cta: { ...FIM_PT.cta, label: FIM_EN.cta.label },
          secondaryCta: { ...FIM_PT.secondaryCta, label: FIM_EN.secondaryCta.label },
        },
  ]
}
