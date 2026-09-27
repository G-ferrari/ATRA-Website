/* As 11 páginas de solução do WordPress, **literais** — lidas de atra.com.br
 * em 27/09/2026 pela API do WordPress (`scripts/wp-import/client.ts`), com a
 * data da última modificação de cada uma em `modificadaEm`.
 *
 * ⚠️ Literal quer dizer literal, inclusive o que parece erro: "modernizare",
 * "Constra", e a sanfona de Cloud com títulos de venda ("Venda Consultiva",
 * "Compra Assertiva") sobre o texto da Alocação de Consultores. Foi escolha do
 * G-ferrari em 27/09: portar como está, e a correção é do marketing, no admin
 * (D-22).
 *
 * O que mudou foi a **forma**, decidida por ele como designer: a sanfona do
 * WordPress vira cartões, e a imagem de cada solução vai para o herói — as duas
 * no padrão da Alocação de Consultores (PR #50). O vídeo do MDM, que o
 * WordPress embute, vira um botão para o YouTube: o site não tem bloco de
 * vídeo. Os 10 selos de certificação do Google Cloud em Data Analytics ficam de
 * fora pelo mesmo motivo — não há bloco de grade de imagens.
 *
 * Os textos fixos de todas as páginas (a chamada "Entre em contato…", o botão
 * "Quero saber mais", "Somos parceiros…") ficam na migração, não aqui.
 *
 * Fica fora de `src/migrations/` de propósito: o Payload trata todo `.ts` da
 * raiz daquela pasta como migração. Subpasta ele não lê. */

export type Trecho = { p: string } | { h3: string } | { link: { texto: string; url: string } }

export type Card = { icone: string; titulo: string; descricao?: string }

export type Secao =
  | {
      tipo: 'texto'
      ancora?: string
      rotulo?: string
      titulo: string
      corpo: Trecho[]
      cta?: { label: string; href: string }
    }
  | {
      tipo: 'cards'
      ancora?: string
      rotulo?: string
      titulo?: string
      colunas: '2' | '3' | '4'
      variante: 'card' | 'compact'
      itens: Card[]
    }

export type PaginaDoWordpress = {
  slug: string
  titulo: string
  chamada: string
  /** Arquivo nesta pasta. O original do WordPress tem 300×300 px. */
  imagem: string
  /** De onde a imagem veio — vai para o campo `credit` da mídia. */
  origem: string
  pagina: string
  modificadaEm: string
  secoes: Secao[]
}

export const PAGINAS_DO_WORDPRESS: PaginaDoWordpress[] = [
  {
    slug: 'cloud',
    titulo: 'Cloud',
    chamada: 'Descubra como seu negócio pode ser muito mais eficiente com os produtos e soluções de Nuvem mais inovadores do mercado',
    imagem: 'solucao-wp-cloud.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Cloud.jpg',
    pagina: 'https://www.atra.com.br/cloud/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Uma nuvem de inovações',
        corpo: [
          {
            p: 'A nuvem pode gerar inovação, descobrir eficiências e ajudar a redefinir os processos de negócios. Mas esses benefícios apenas são alcançados quando sua infraestrutura em nuvem permite integrar, sincronizar e relacionar todos os dados, aplicativos e processos – no local ou em qualquer parte do ambiente com várias nuvens.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '4',
        variante: 'card',
        itens: [
          {
            icone: 'briefcase',
            titulo: 'Venda Consultiva',
            descricao: 'Consultores especialistas em várias áreas tais como Power Center, Data Quality, MDM, Funcional, Gestão, Big Data e Negócios.',
          },
          {
            icone: 'target',
            titulo: 'Compra Assertiva',
            descricao: 'O consultor trabalha alocado nas dependências da Empresa.',
          },
          {
            icone: 'sparkles',
            titulo: 'Novidades',
            descricao: 'Rápida disponibilização do consultor contratado.',
          },
          {
            icone: 'settings',
            titulo: 'Flexibilidade de Contratação',
            descricao: 'Modalidades de contratação por hora trabalhada ou por preço fixo, de acordo com a conveniência do cliente.',
          },
        ],
      },
    ],
  },
  {
    slug: 'data-integration',
    titulo: 'Data Integration',
    chamada: 'Integre dados e aplicativos em lote ou em tempo real de maneira segura e eficiente.',
    imagem: 'solucao-wp-data-integration.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Data-Integration.jpg',
    pagina: 'https://www.atra.com.br/data-integration/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Aplicações Simples e Fáceis',
        corpo: [
          {
            p: 'Nossos produtos integram seus dados e aplicativos de forma fácil e segura, não importa onde eles estejam.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'cloud',
            titulo: 'Cloud Data Integration',
            descricao: 'Crie um data warehouse em nuvem em qualquer uma das principais plataformas em nuvem ou mantenha um local. Comece a operar rapidamente, conectando-se a fontes de dados locais e aplicativos em nuvem e integre grandes volumes de dados.',
          },
          {
            icone: 'workflow',
            titulo: 'Cloud Application Integration',
            descricao: 'Integre aplicativos Salesforce, Microsoft Azure e Amazon Web Services, bem como aplicativos, serviços e sistemas de mensagens locais. Use o Informatica Cloud Application para automatizar processos e agilizar transações.',
          },
          {
            icone: 'zap',
            titulo: 'Power Center',
            descricao: 'O Informatica PowerCenter acelera a integração de dados no local e os projetos de data warehouse. Suporte rapidamente todo o ciclo de vida da integração de dados, desde o início do seu primeiro projeto até as principais implantações empresariais de missão crítica.',
          },
        ],
      },
    ],
  },
  {
    slug: 'data-analytics',
    titulo: 'Data Analytics',
    chamada: 'Desenvolva uma estratégia para modernizare colocar os seus dados no centro da Transformação Digital',
    imagem: 'solucao-wp-data-analytics.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Data-Analytics.jpg',
    pagina: 'https://www.atra.com.br/data-analytics/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Constra uma base madura de dados confiáveis',
        corpo: [
          {
            p: 'Explore, transforme e analise dados para identificar tendências e padrões que revelem insights significativos e construir eficiências que apoiem a tomada de decisões.',
          },
          {
            p: 'Considere uma estratégia moderna de análise de dados para uma vantagem competitiva no mercado.',
          },
        ],
      },
      {
        tipo: 'texto',
        ancora: 'certificacoes',
        rotulo: 'Certificações',
        titulo: 'Somos Certificados nas Soluções Google Cloud',
        corpo: [
          {
            p: 'Temos profissionais experientes e reconhecidos no mercado, preparados para compreender necessidades e definir as melhores soluções para empresas dos mais diversos portes e segmentos.',
          },
        ],
      },
      {
        tipo: 'texto',
        ancora: 'google-cloud',
        rotulo: 'Google Cloud',
        titulo: 'Soluções que podem transformar seus dados',
        corpo: [
          {
            p: 'A plataforma de análises do Google Cloud é uma plataforma, aberta e segura que oferece um caminho fácil para se tornar uma organização guiada por dados.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '4',
        variante: 'compact',
        itens: [
          {
            icone: 'cloud',
            titulo: 'BigQuery',
          },
          {
            icone: 'cloud',
            titulo: 'Looker',
          },
          {
            icone: 'cloud',
            titulo: 'Dataproc',
          },
          {
            icone: 'cloud',
            titulo: 'Dataflow',
          },
          {
            icone: 'cloud',
            titulo: 'Dataform',
          },
          {
            icone: 'cloud',
            titulo: 'Pub/Sub',
          },
          {
            icone: 'cloud',
            titulo: 'Cloud Data Fusion',
          },
          {
            icone: 'cloud',
            titulo: 'Data Catalog',
          },
          {
            icone: 'cloud',
            titulo: 'Cloud Composer',
          },
          {
            icone: 'cloud',
            titulo: 'Dataprep',
          },
          {
            icone: 'cloud',
            titulo: 'Dataplex',
          },
          {
            icone: 'cloud',
            titulo: 'Analytics Hub',
          },
          {
            icone: 'cloud',
            titulo: 'Looker Studio',
          },
          {
            icone: 'cloud',
            titulo: 'Earth Engine',
          },
          {
            icone: 'cloud',
            titulo: 'BigLake',
          },
        ],
      },
      {
        tipo: 'texto',
        ancora: 'cases',
        rotulo: 'Cases',
        titulo: 'Confira os Cases de Sucesso ATRA',
        corpo: [
          {
            h3: 'Transformação Digital através da Governança de Dados',
          },
          {
            p: 'Com o objetivo de implementar processos robustos de Governança de Dados, trabalhamos em conjunto com a equipe de Governança e Qualidade de Dados do cliente para definir as necessidades do negócio e executar o projeto.',
          },
          {
            link: {
              texto: 'Confira o Case',
              url: 'https://cloud.google.com/find-a-partner/partner/atra-informatica',
            },
          },
          {
            h3: 'Migrando cargas de trabalho legadas para o GCP',
          },
          {
            p: 'O nosso papel no projeto foi entender o que o cliente desejava, apresentar variações e discutir melhorias das soluções apresentadas, em seguida implementar a solução final.',
          },
          {
            link: {
              texto: 'Confira o Case',
              url: 'https://cloud.google.com/find-a-partner/partner/atra-informatica',
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'master-data-management',
    titulo: 'Master Data Management',
    chamada: 'Liberte o valor dos seus dados com uma solução MDM de ponta a ponta',
    imagem: 'solucao-wp-master-data-management.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Master-Data-Management.jpg',
    pagina: 'https://www.atra.com.br/master-data-management/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Tenha o controle total sobre seus dados',
        corpo: [
          {
            p: 'Gerencie seus dados de forma integrada e tenha um poderoso aliado na hora de tomar decisões',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'database',
            titulo: 'Visão única dos dados',
            descricao: 'Crie uma visão de autoridade dos seus dados críticos para os negócios a partir de fontes de informações diferentes, duplicadas e conflitantes.',
          },
          {
            icone: 'users',
            titulo: 'Uma visão 360 dos seus relacionamentos',
            descricao: 'Identifique as idéias de relacionamento em seus dados para localizar conexões entre clientes, produtos, fornecedores e muito mais.',
          },
          {
            icone: 'search',
            titulo: 'Uma visão completa das interações',
            descricao: 'Vincule transações e interações para ter uma visão completa do comportamento de um cliente.',
          },
        ],
      },
      {
        tipo: 'texto',
        ancora: 'transformacao-digital',
        rotulo: 'Transformação digital',
        titulo: 'Uma verdadeira transformação digital baseada em dados',
        corpo: [
          {
            p: 'Uma solução de gerenciamento de dados mestre é a cola que une seus sistemas e informações. É a única fonte de verdade para sua transformação digital baseada em dados, fornecendo dados completos confiáveis, precisos e completos para o seu programa de experiência do cliente, operações de marketing e vendas, varejo omnichannel, otimização da cadeia de suprimentos, esforços de governança, iniciativas de conformidade e muito mais.',
          },
        ],
        cta: {
          label: 'Assista ao vídeo',
          href: 'https://www.youtube.com/watch?v=_AWiWYvCXn0',
        },
      },
    ],
  },
  {
    slug: 'data-discovery',
    titulo: 'Data Discovery',
    chamada: 'Seu negócio capaz de explorar e analisar grandes conjuntos de dados para identificar padrões, tendências e insights valiosos',
    imagem: 'solucao-wp-data-discovery.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Data-Discovery.jpg',
    pagina: 'https://www.atra.com.br/data-discovery/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Desenvolvimento que atende às demandas do seu negócio',
        corpo: [
          {
            p: 'Conte com nossa equipe criação de um processo orientado para a detecção de padrões e falhas. Pode ser dividido em três etapas:',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'database',
            titulo: 'Preparação dos Dados',
            descricao: 'É realizada uma limpeza, organização e estruturação de dados.',
          },
          {
            icone: 'chart',
            titulo: 'Análise visual',
            descricao: 'Entender qual é o propósito da visualização e para quem ela será apresentada.',
          },
          {
            icone: 'trending-up',
            titulo: 'Análise guiada avançada',
            descricao: 'Tenha agilidade na tomada de decisão, vantagem competitiva e dados mais precisos.',
          },
        ],
      },
    ],
  },
  {
    slug: 'customer-360',
    titulo: 'Customer 360',
    chamada: 'Tome decisões fundamentadas em dados confiáveis e precisos dos seus clientes em tempo real',
    imagem: 'solucao-wp-customer-360.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Customer-360o.jpg',
    pagina: 'https://www.atra.com.br/customer-360/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'cards',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Saiba tudo sobre seu cliente num único lugar',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'workflow',
            titulo: 'Integração de dados',
            descricao: 'Dados dos clientes em um único local.',
          },
          {
            icone: 'database',
            titulo: 'Gerenciamento de dados',
            descricao: 'Dados dos clientes em tempo real e confiável.',
          },
          {
            icone: 'users',
            titulo: 'Visão 360º do cliente',
            descricao: 'Tenha uma visão única e unificada do cliente a partir de suas ferramentas.',
          },
        ],
      },
    ],
  },
  {
    slug: 'governanca-de-dados',
    titulo: 'Data Governance',
    chamada: 'Seus dados adequados aos padrões e às regulamentações dos mais diversos organismos regulatórios.',
    imagem: 'solucao-wp-governanca-de-dados.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Data-Governance.jpg',
    pagina: 'https://www.atra.com.br/governanca-de-dados/',
    modificadaEm: '2024-04-19',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Garanta a Governança de dados por toda a sua organização',
        corpo: [
          {
            p: 'Nós temos um portfolio completo de produtos designados a formatados para entregar dados consistentes, confiáveis e governáveis.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'shield',
            titulo: 'Axon Data Governance',
            descricao: 'Facilite a colaboração entre as comunidades de governança de dados – estejam elas nos negócios ou na TI – para que elas possam desenvolver um entendimento comum dos dados corporativos.',
          },
          {
            icone: 'shield-check',
            titulo: 'Data Quality',
            descricao: 'Garanta que os dados, independentemente de seu volume ou tipo, sejam da mais alta qualidade, para que você obtenha análises precisas, melhor experiência do cliente e migração otimizada para a nuvem ou um data lake.',
          },
          {
            icone: 'user-check',
            titulo: 'Verificação de Dados de Contato',
            descricao: 'Melhore interações com dados de contato confiáveis e confiáveis por meio do Data as a Service (DaaS), para que você possa alcançar de maneira impecável todos os clientes, possíveis clientes ou parceiros do mundo todo.',
          },
        ],
      },
    ],
  },
  {
    slug: 'treinamento',
    titulo: 'Treinamento',
    chamada: 'A ATRA é parceiro oficial autorizado a comercializar e ministrar os cursos.',
    imagem: 'solucao-wp-treinamento.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Treinamento.jpg',
    pagina: 'https://www.atra.com.br/treinamento/',
    modificadaEm: '2025-07-08',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Aumente seus conhecimentos com quem é autoridade em Dados',
        corpo: [
          {
            p: 'Os cursos oficiais capacitam profissionais a implementar e operar as melhores plataformas de dados do mercado.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '4',
        variante: 'card',
        itens: [
          {
            icone: 'award',
            titulo: 'Treinamentos Oficiais',
            descricao: 'A ATRA é parceiro oficial autorizado a comercializar e ministrar cursos.',
          },
          {
            icone: 'users',
            titulo: 'Cursos Presenciais',
            descricao: 'Em turma pública ou fechada para a Empresa',
          },
          {
            icone: 'book',
            titulo: 'Apostilas',
            descricao: 'Material disponibilizado no formato digital.',
          },
          {
            icone: 'settings',
            titulo: 'Flexibilidade',
            descricao: 'Cursos Presenciais e Online.',
          },
        ],
      },
      {
        tipo: 'cards',
        ancora: 'treinamentos',
        rotulo: 'Treinamentos',
        titulo: 'Treinamentos Disponíveis',
        colunas: '4',
        variante: 'compact',
        itens: [
          {
            icone: 'graduation-cap',
            titulo: 'Data Engineering',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Cloud',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Data Quality',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Data Integration',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Product 360',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Master Data Management',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Data Governance',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Fundamentos Google Cloud',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Looker',
          },
          {
            icone: 'graduation-cap',
            titulo: 'Dataform',
          },
          {
            icone: 'graduation-cap',
            titulo: 'API & IA',
          },
        ],
      },
    ],
  },
  {
    slug: 'fabrica-de-transformacao-de-dados',
    titulo: 'Fábrica de transformação de dados',
    chamada: 'Possui uma necessidade específica para o seu negócio? Nós entregamos a solução com eficiência, qualidade e economia.',
    imagem: 'solucao-wp-fabrica-de-transformacao-de-dados.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Fabrica-de-transformacao-de-dados.jpg',
    pagina: 'https://www.atra.com.br/fabrica-de-transformacao-de-dados/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Desenvolvimento que atende às demandas do seu negócio',
        corpo: [
          {
            p: 'Conte com nossa equipe para o desenvolvimento de soluções perfeitamente customizadas para as necessidades de sua empresa.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '4',
        variante: 'card',
        itens: [
          {
            icone: 'trending-up',
            titulo: 'Economia com Custos Operacionais',
            descricao: 'O desenvolvimento é remoto, estando os consultores alocados no escritório da Atra.',
          },
          {
            icone: 'zap',
            titulo: 'Dinamismo',
            descricao: 'Atendimento de mais de um pacote por vez.',
          },
          {
            icone: 'shield-check',
            titulo: 'Garantia de Entrega',
            descricao: 'Ao adquirir um desenvolvimento por escopo, todo desenvolvimento é realizado pela Atra e sua entrega é garantida.',
          },
          {
            icone: 'award',
            titulo: 'Qualidade',
            descricao: 'O Fluxo interno de desenvolvimento é resultado da experiência do desenvolvimento de inúmeros projetos.',
          },
        ],
      },
    ],
  },
  {
    slug: 'sustentacao-remota',
    titulo: 'Sustentação Remota',
    chamada: 'Suporte ágil e eficiente com custos otimizados para sua empresa.',
    imagem: 'solucao-wp-sustentacao-remota.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Sustentacao-Remota.jpg',
    pagina: 'https://www.atra.com.br/sustentacao-remota/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'Otimização de custos no atendimento',
        corpo: [
          {
            p: 'O serviço de Sustentação Remota garante o perfeito funcionamento de sua solução com economia de custos.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'trending-up',
            titulo: 'Economia com Custos Operacionais',
            descricao: 'O Atendimento é remoto, estando os consultores alocados no escritório da ATRA.',
          },
          {
            icone: 'headset',
            titulo: 'Capacidade expandida de atendimento',
            descricao: 'Atendimento de mais de um chamado por vez.',
          },
          {
            icone: 'settings',
            titulo: 'Sustentação Interdisciplinar',
            descricao: 'Administração, dúvidas, manutenção de mapas de PWC e IDQ.',
          },
        ],
      },
      {
        tipo: 'cards',
        ancora: 'opcionais',
        rotulo: 'Opcionais',
        titulo: 'Opcionais que agregam ainda mais valor',
        colunas: '2',
        variante: 'card',
        itens: [
          {
            icone: 'shield-check',
            titulo: 'Monitoramento pró-ativo',
            descricao: 'A equipe analisa frequentemente o ambiente e em caso de problemas toma uma ação preventiva.',
          },
          {
            icone: 'headset',
            titulo: 'Atendimento 24x7',
            descricao: 'Estrutura de Integração de dados 100% segura com a nossa equipe sempre à postos.',
          },
        ],
      },
    ],
  },
  {
    slug: 'assessoria-em-produtos',
    titulo: 'Assessoria em Produtos',
    chamada: 'Com a ATRA, você sabe exatamente qual o produto mais adequado às necessidades da sua empresa. Assim, você aloca seus recursos de forma eficiente, direcionados aos melhores resultados.',
    imagem: 'solucao-wp-assessoria-em-produtos.jpg',
    origem: 'https://www.atra.com.br/wp-content/uploads/2024/04/Assessoria-em-Produtos.jpg',
    pagina: 'https://www.atra.com.br/assessoria-em-produtos/',
    modificadaEm: '2025-07-02',
    secoes: [
      {
        tipo: 'texto',
        ancora: 'visao-geral',
        rotulo: 'Visão geral',
        titulo: 'A ATRA recomenda sempre o produto mais adequado à sua empresa',
        corpo: [
          {
            p: 'Os recursos da sua empresa são valiosos. É fundamental ter a certeza de alocá-los sempre nos produtos, serviços e ferramentas corretas.',
          },
        ],
      },
      {
        tipo: 'cards',
        colunas: '3',
        variante: 'card',
        itens: [
          {
            icone: 'briefcase',
            titulo: 'Venda Consultiva',
            descricao: 'A Atra representa produtos Informatica de forma Consultiva. Com o real entendimento das necessidades da Empresa para oferecer o melhor produto.',
          },
          {
            icone: 'target',
            titulo: 'Compra Assertiva',
            descricao: 'Com apresentações, demonstrações e documentação adequada, a empresa tem uma boa visão dos produtos Informatica e como adquirir da melhor forma.',
          },
          {
            icone: 'sparkles',
            titulo: 'Novidades',
            descricao: 'Mantém a Empresa atualizada com todas as novidades de Integração de Dados.',
          },
        ],
      },
      {
        tipo: 'cards',
        ancora: 'produtos',
        rotulo: 'Produtos',
        titulo: 'Produtos',
        colunas: '4',
        variante: 'card',
        itens: [
          {
            icone: 'database',
            titulo: 'Power Center :: Integração de Dados',
            descricao: '',
          },
          {
            icone: 'file-text',
            titulo: 'IDQ :: Qualidade dos Dados',
            descricao: '',
          },
          {
            icone: 'server',
            titulo: 'MDM :: Dados Mestres',
            descricao: '',
          },
          {
            icone: 'workflow',
            titulo: 'EIC :: Governança',
            descricao: '',
          },
        ],
      },
    ],
  },
]
