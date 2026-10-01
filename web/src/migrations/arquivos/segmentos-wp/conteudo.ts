/* As 8 páginas de segmento do WordPress, **literais** — lidas de atra.com.br
 * em 27/09/2026 pela API do WordPress, com a data da última modificação de
 * cada uma em `modificadaEm`.
 *
 * O herói leva a manchete do WordPress, e o nome curto fica no menu e nos
 * cartões: é o caso de Saúde, que no WordPress se chama "Saúde e Ciências da
 * Vida" (G-ferrari, 27/09). Nas outras sete a manchete é o próprio nome. O
 * WordPress guarda as manchetes em minúsculas e as desenha em caixa alta por
 * CSS; aqui ficam com as maiúsculas do nome.
 *
 * Educação é a única com dois grupos de itens e uma frase de fechamento.
 *
 * Fica fora de `src/migrations/` de propósito: o Payload trata todo `.ts` da
 * raiz daquela pasta como migração. Subpasta ele não lê. */

export type CardDeSegmento = { icone: string; titulo: string; descricao: string }

export type PaginaDeSegmento = {
  slug: string
  /** Título do herói — a manchete do WordPress. */
  titulo: string
  chamada: string
  grade: { titulo: string; intro: string }
  grupos: { titulo: string | null; ancora?: string; rotulo?: string; colunas: '3' | '4'; cards: CardDeSegmento[] }[]
  fechamento?: string
  /** Botões do herói além de "Quero saber mais". */
  ctasExtras?: { label: string; href: string }[]
  pagina: string
  modificadaEm: string
}

export const PAGINAS_DE_SEGMENTO: PaginaDeSegmento[] = [
  {
    slug: 'bancos-seguradoras-servicos-financeiros',
    titulo: 'Bancos, Seguradoras e Serviços Financeiros',
    chamada: 'Transforme a experiência de seus clientes construindo relacionamentos de longo prazo e alto valor integrando e cruzando seus dados de forma estratégica.',
    grade: { titulo: 'O que nós fazemos', intro: 'Descubra nossos serviços customizados para as empresas do Setor Financeiro.' },
    grupos: [
      {
        titulo: null,
        colunas: '3',
        cards: [
          { icone: 'shield', titulo: 'Risco e Compliance', descricao: 'Agregue, governe e entregue dados confiáveis para ficar em conformidade com as leis do setor.' },
          { icone: 'lock', titulo: 'Proteção de Dados', descricao: 'Identifique e proteja os dados sensíveis para cumprir com as regulamentações de privacidade, incluindo a Lei Geral de Proteção de Dados (LGPD).' },
          { icone: 'users', titulo: 'Centralização no cliente', descricao: 'Mantenha, aumente e atraia clientes com dados oportunos, holísticos e certificadamente precisos.' },
          { icone: 'building', titulo: 'Combate a crimes financeiros', descricao: 'Reduza a fraude, reduza o risco de reputação, melhore a KYC (Know Your Customer) e cumpra com as regulamentações do setor.' },
          { icone: 'building', titulo: 'Fusões e Aquisições', descricao: 'Racionalize, migre, consolide e integre dados críticos de negócios e sistemas após uma Fusão & Aquisição.' },
        ],
      },
    ],
    /* D-37: a RC18 saiu de Soluções e se chega a ela por aqui. */
    ctasExtras: [{ label: 'Conheça a RC18', href: '/solucoes/rc18' }],
    pagina: 'https://www.atra.com.br/bancos-seguradoras-servicos-financeiros/',
    modificadaEm: '2025-07-02',
  },
  {
    slug: 'educacao',
    titulo: 'Educação',
    chamada: 'A inteligência dos dados no centro da estratégia educacional.',
    grade: { titulo: 'Os desafios no setor Educacional', intro: 'As instituições enfrentam uma pressão constante por inovação, eficiência e resultados, ao mesmo tempo em que lidam com recursos limitados, aumento da concorrência e a necessidade de se adaptar rapidamente às mudanças.' },
    grupos: [
      {
        titulo: null,
        colunas: '3',
        cards: [
          { icone: 'users', titulo: 'O que faz o aluno continuar?', descricao: 'Engajamento acadêmico, currículos atualizados de acordo com as necessidades de mercado e o envolvimento de comunidade como um todo. O problema é que a maioria das instituições não conhecem o perfil de sua comunidade de forma mais abrangente do que o perfil socioeconômico. E mesmo as que conhecem tomam poucas ações proativas sobre estas informações!' },
          { icone: 'lock', titulo: 'Como identificar sinais de risco?', descricao: 'Análise aprofundada do perfil baseada em dados: variações de comportamentos como queda em presença, notas, participação em atividades extracurriculares, etc. Simplicidade na coleta de feedbacks, além de feedbacks frequentes e periódicos, de forma que as tendências possam ser identificadas quando estão nascendo.' },
          { icone: 'graduation-cap', titulo: 'Como tornar a jornada mais fluida?', descricao: 'Mapeamento da jornada do aluno: entender os pontos de dor e encantamento desde a matrícula até a conclusão. Criação de perfis de alunos a partir de informações comportamentais e alertar de forma proativa potenciais riscos a partir de desvios. Personalização da comunicação: usar dados para se comunicar com o aluno no momento certo, com o conteúdo certo.' },
        ],
      },
      {
        titulo: 'O poder dos dados com a ATRA', ancora: 'o-poder-dos-dados', rotulo: 'O poder dos dados',
        colunas: '3',
        cards: [
          { icone: 'graduation-cap', titulo: 'Otimização da gestão acadêmica e administrativa', descricao: 'Integramos dados de sistemas distribuídos e construímos bases de dados de inteligência de dados com foco em educação, auxiliando nossos cliente a extrair insights de forma fácil e automatizada.' },
          { icone: 'shield', titulo: 'Melhoria da qualidade dos dados e do compliance', descricao: 'Uma grande barreira para o entendimento da jornada do aluno é a falta de qualidade e consistência nos dados. Temos experiência em criar métodos de melhoria contínua dos dados, permitindo às organizações identificarem e corrigirem riscos de forma proativa.' },
          { icone: 'graduation-cap', titulo: 'Desenvolvimento de habilidades baseadas em interesses individuais', descricao: 'Preparamos as empresas para o futuro, usando soluções de IA como motor para sistemas de avaliação de risco, recomendação de ações baseadas em eventos e personalização de projetos de acordo com sua necessidade.' },
        ],
      },
    ],
    fechamento: 'Transforme sua instituição em referência em decisões orientadas a dados.',
    pagina: 'https://www.atra.com.br/educacao/',
    modificadaEm: '2025-07-08',
  },
  {
    slug: 'industria',
    titulo: 'Indústria',
    chamada: 'Através do tratamento estratégico dos dados, otimize sua cadeia de suprimentos, potencializando produtividade e qualidade no produto final, conquistando e fidelizando mais clientes.',
    grade: { titulo: 'O que nós fazemos', intro: 'Descubra nossos Produtos e Soluções em Dados para as empresas de Varejo.' },
    grupos: [
      {
        titulo: null,
        colunas: '3',
        cards: [
          { icone: 'workflow', titulo: 'Gerenciamento de Pedidos', descricao: 'Reduza o capital de giro e aumente a fidelidade do cliente mudando para uma visão mais precisa da eficácia do pedido.' },
          { icone: 'trending-up', titulo: 'Marketing Contextual', descricao: 'Manter um relacionamento significativo e próximo para incentivar a lealdade do cliente.' },
          { icone: 'database', titulo: 'Gerenciamento de Qualidade', descricao: 'Capturar a exposição total de cadeia de suprimentos relacionada a problemas de qualidade com produto de fornecedor.' },
          { icone: 'chart', titulo: 'Desempenho de Equipamentos', descricao: 'Testar, calibrar e integrar rapidamente os sensores com dados confiáveis de equipamento para garantia de qualidade, desenvolvimento de produto e manutenção de operações.' },
          { icone: 'users', titulo: 'Experiência do Cliente', descricao: 'Evoluir novos modelos de negócios usando big data de sensores de domínios públicos e privados para impulsionar a segurança e a satisfação do cliente.' },
        ],
      },
    ],
    pagina: 'https://www.atra.com.br/industria/',
    modificadaEm: '2025-07-08',
  },
  {
    slug: 'logistica',
    titulo: 'Logística',
    chamada: 'Logística integrada de forma inteligente, transformando seus dados de forma estratégica.',
    grade: { titulo: 'O que nós fazemos', intro: 'Descubra nossos serviços customizados para as empresas de Logística.' },
    grupos: [
      {
        titulo: null,
        colunas: '3',
        cards: [
          { icone: 'database', titulo: 'Integração de Dados', descricao: 'Integre dados de clientes, frotas, rotas e muito mais, tornando sua operação mais eficiente.' },
          { icone: 'database', titulo: 'Qualidade Cadastral', descricao: 'Melhore a qualidade e a confiabilidade dos seus dados cadastrais, seja de dados de clientes, parceiros ou fornecedores.' },
          { icone: 'cloud', titulo: 'Cloud', descricao: 'Ganhe agilidade tendo seus dados seguros e acessíveis a qualquer momento, de qualquer dispositivo.' },
        ],
      },
    ],
    pagina: 'https://www.atra.com.br/logistica/',
    modificadaEm: '2025-07-08',
  },
  {
    slug: 'saude',
    titulo: 'Saúde e Ciências da Vida',
    chamada: 'Integre dados clínicos de forma eficiente, agregando mais eficiência ao atendimento e garantindo a satisfação dos pacientes.',
    grade: { titulo: 'Produtos e Soluções para empresas de Saúde', intro: 'Descubra nossas soluções em dados para integração de emrpesas em Saúde.' },
    grupos: [
      {
        titulo: null,
        colunas: '3',
        cards: [
          { icone: 'chart', titulo: 'Análises críticas', descricao: 'Garanta o apoio a descobertas de informações clínicas, engajamento, conformidade normativa e eficiência operacional com dados de qualquer fonte – mesmo Big Data.' },
          { icone: 'cloud', titulo: 'Conectividade na Nuvem', descricao: 'Habilite os administradores do Salesforce de forma que eles possam integrar dados de forma segura com aplicativos on-premise, como registros médicos eletrônicos (EMR), processamento de reclamações e software de compras.' },
          { icone: 'server', titulo: 'Modernização de Aplicativos', descricao: 'Assegure o ROI ao mesmo tempo em que é simplificada a manutenção do acesso aos dados de aplicativos clínicos e administrativos que não estão mais sendo usados na produção.' },
          { icone: 'users', titulo: 'Engajamento de pacientes', descricao: 'Ofereça produtos mais intuitivos, comunique-se de forma mais eficiente e garanta um engajamento consistente a partir de uma visão única dos pontos de contato de pacientes e associados a planos de saúde.' },
          { icone: 'heart', titulo: 'Intercâmbio de Seguro Saúde', descricao: 'Utilize os recursos do gerenciamento de dados flexível da Informatica para apoiar o cadastro, elegibilidade, governança e conciliação financeira do intercâmbio eletrônico de dados.' },
          { icone: 'shield', titulo: 'Governança de Dados', descricao: 'Abasteça seu diretor executivo de dados (CDO) com dados transparentes, pontuais, seguros e confiáveis para garantir a conformidade normativa com o sistema de gerenciamento de conteúdo (CMS) e outros.' },
        ],
      },
    ],
    pagina: 'https://www.atra.com.br/saude/',
    modificadaEm: '2025-07-08',
  },
  {
    slug: 'telecom',
    titulo: 'Telecom',
    chamada: 'Conquiste e retenha mais clientes gerando mais valor e estreitando o relacionamento através da análise eficiente de dados.',
    grade: { titulo: 'O que nós fazemos', intro: 'Descubra nossos Produtos e Soluções em Dados para as empresas de Telecomunicações.' },
    grupos: [
      {
        titulo: null,
        colunas: '3',
        cards: [
          { icone: 'chart', titulo: 'Análise de Rotatividade', descricao: 'Plataforma e as ferramentas necessárias para ingerir, processar, agregar e analisar fluxos de análise de dados de telecomunicações estruturados e não estruturados, em tempo real, para prever e impedir a rotatividade.' },
          { icone: 'server', titulo: 'Otimização de Rede', descricao: 'Usando nossa plataforma de dados conectada, as operadoras podem identificar problemas de rede em tempo real para resolver problemas de maneira mais rápida e confiável.' },
          { icone: 'users', titulo: 'Experiência do Cliente', descricao: 'Nossas plataformas de dados ajudam a criar uma verdadeira experiência 360 graus, integrando as informações do cliente em vários canais, sistemas, dispositivos e produtos.' },
          { icone: 'chart', titulo: 'Análises e Prevenções', descricao: 'Desde ameaças cibernéticas, fraudes e regulamentações de conformidade em constante mudança, você precisa aumentar a visibilidade e liberar o poder do Learning Machine e da análise avançada de dados de telecomunicações para proteger seus negócios.' },
          { icone: 'server', titulo: 'IoT e Ecossistemas conectados', descricao: 'Desbloqueie novos mecanismos de receita e ofereça novos serviços atraentes em torno da IoT e dos ecossistemas digitais conectados.' },
        ],
      },
    ],
    pagina: 'https://www.atra.com.br/telecom/',
    modificadaEm: '2025-07-08',
  },
  {
    slug: 'utilidades',
    titulo: 'Utilidades',
    chamada: 'Através do tratamento estratégico dos dados, otimize sua cadeia de suprimentos, potencializando produtividade e qualidade no produto final, conquistando e fidelizando mais clientes.',
    grade: { titulo: 'O que nós fazemos', intro: 'Descubra nossos produtos e soluções em dados para as empresas de Utilidades' },
    grupos: [
      {
        titulo: null,
        colunas: '4',
        cards: [
          { icone: 'workflow', titulo: 'Planejamento de Demanda', descricao: 'Crie perfis confiáveis de dados de medidor e transformador para auxiliar no planejamento.' },
          { icone: 'lock', titulo: 'Mitigação de Fraude', descricao: 'Use as análises confiáveis para detectar e mitigar fraudes nas empresas de utilidades públicas.' },
          { icone: 'workflow', titulo: 'Smart Meter Operations', descricao: 'Identifique os problemas que afetam as operações de medidor inteligente para aumentar a produtividade e melhorar as previsões.' },
          { icone: 'workflow', titulo: 'Gerenciamento de Vegetação', descricao: 'Reduza as condições de perigo com avaliação de riscos orientada por dados.' },
        ],
      },
    ],
    pagina: 'https://www.atra.com.br/utilidades/',
    modificadaEm: '2025-07-08',
  },
  {
    slug: 'varejo',
    titulo: 'Varejo',
    chamada: 'Compreenda a jornada de compra dos seus clientes e proporcione experiências únicas e personalizadas através da coleta e análise estratégica de dados para melhor atrair, reter e encantar seus clientes.',
    grade: { titulo: 'O que nós fazemos', intro: 'Proporcione experiências únicas a seus clientes com nossos Produtos e Soluções em dados' },
    grupos: [
      {
        titulo: null,
        colunas: '4',
        cards: [
          { icone: 'users', titulo: 'Experiência do Consumidor', descricao: 'Engaje melhor seus clientes com dados confiáveis sobre suas preferências e jornada de compra.' },
          { icone: 'users', titulo: 'Experiência de Produto', descricao: 'Obtenha dados ricos e consistentes de produtos das mais diversas fontes para transformar a experiência de compra do seu cliente.' },
          { icone: 'database', titulo: 'Privacidade de Dados', descricao: 'Potencialize a privacidade dos dados dos seus clientes, proporcionando confiabilidade e fidelidade.' },
          { icone: 'users', titulo: 'Experiência Omnichannel', descricao: 'Ofereça de forma eficiente dados de produtos avançados e consistentes em todos os canais para aprimorar a experiência do cliente.' },
        ],
      },
    ],
    pagina: 'https://www.atra.com.br/varejo/',
    modificadaEm: '2025-07-08',
  },
]
