const fs = require('fs');
const ptPath = './src/locales/pt.json';
const enPath = './src/locales/en.json';

let pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

pt.glossary = {
  title: "Glossário de <1>Dados e IA</1>",
  subtitle: "Explore os termos mais utilizados no universo da tecnologia, dados e inteligência artificial.",
  indexTitle: "Índice de Termos"
};
en.glossary = {
  title: "<1>Data and AI</1> Glossary",
  subtitle: "Explore the most used terms in the universe of technology, data, and artificial intelligence.",
  indexTitle: "Index of Terms"
};

pt.partner = {
  title: "<1>ATRA</1> / Google Cloud Partner",
  subtitle: "Quer agilidade, inovação e resultados? Conheça o Google Cloud com a expertise ATRA.",
  learnMore: "Saiba mais",
  aboutTitle: "Parceria estratégica para sua transformação digital!",
  aboutP1: "O Google Cloud é a plataforma de nuvem do Google que oferece serviços de dados, inteligência artificial e colaboração para empresas. A ATRA, parceira oficial de Google Workspace, Google Cloud Platform e Google Maps Platform, foi Latin America Partner of the Year em 2018, 2020, 2022, 2024 e 2025.",
  aboutP2: "Com mais de 20 anos de experiência, ajudamos organizações a migrar, modernizar e inovar na nuvem, unindo nossa expertise à tecnologia do Google.",
  benefitsTitle: "Por que escolher um Google Cloud Partner?",
  benefitsDesc: "Como parceiro certificado Google Cloud, temos a expertise para compreender suas necessidades e transformar desafios em oportunidades. Apoiamos sua empresa em todas as etapas da jornada na nuvem, aproveitando ao máximo a infraestrutura e as ferramentas do Google.",
  contactExpert: "Fale com um especialista!",
  specTitle: "Nossas especializações",
  specDesc: "A ATRA está preparada para ajudar sua empresa a migrar, modernizar e inovar com o Google Cloud.",
  specLink: "Impulsione seu negócio com a nuvem do Google",
  contactTitle: "Entre em contato",
  contactDesc: "Saiba mais sobre quem somos e como trabalhamos, ou entre em contato conosco para descobrir como podemos moldar o futuro da sua empresa juntos.",
  contactUs: "Fale conosco",
  seeMore: "Ver mais"
};
en.partner = {
  title: "<1>ATRA</1> / Google Cloud Partner",
  subtitle: "Want agility, innovation, and results? Discover Google Cloud with ATRA's expertise.",
  learnMore: "Learn more",
  aboutTitle: "Strategic partnership for your digital transformation!",
  aboutP1: "Google Cloud is Google's cloud platform that offers data, artificial intelligence, and collaboration services for companies. ATRA, an official partner of Google Workspace, Google Cloud Platform, and Google Maps Platform, was Latin America Partner of the Year in 2018, 2020, 2022, 2024, and 2025.",
  aboutP2: "With over 20 years of experience, we help organizations migrate, modernize, and innovate in the cloud, uniting our expertise with Google's technology.",
  benefitsTitle: "Why choose a Google Cloud Partner?",
  benefitsDesc: "As a certified Google Cloud partner, we have the expertise to understand your needs and transform challenges into opportunities. We support your company at every stage of the cloud journey, making the most of Google's infrastructure and tools.",
  contactExpert: "Talk to an expert!",
  specTitle: "Our specializations",
  specDesc: "ATRA is prepared to help your company migrate, modernize, and innovate with Google Cloud.",
  specLink: "Boost your business with Google Cloud",
  contactTitle: "Get in touch",
  contactDesc: "Learn more about who we are and how we work, or contact us to discover how we can shape your company's future together.",
  contactUs: "Contact us",
  seeMore: "See more"
};

pt.solution = {
    heroTitle: "Soluções em <1>Inteligência Artificial</1> & IA Generativa",
    heroDesc: "Transforme a maneira como sua empresa opera com nosso serviço de IA, projetado para automatizar processos, gerar conteúdo inteligente e criar agentes autônomos que impulsionam a inovação e garantem resultados precisos.",
    hireService: "Contrate o serviço",
    menu: {
      howItWorks: "Como funciona",
      benefits: "Benefícios",
      whoIsFor: "Para quem é este serviço",
      howWeDo: "Como fazemos"
    },
    section1: {
      title: "Estruturando a Inovação com Inteligência Artificial",
      p1: "Nosso serviço de IA foca na construção de infraestruturas e modelos robustos que permitem a automação avançada, geração de conteúdo e análise preditiva de maneira eficiente.",
      p2: "Avaliamos as necessidades da empresa, projetamos arquiteturas personalizadas e desenvolvemos agentes autônomos e LLMs que suportam operações de negócios de alta performance. Além disso, garantimos que os modelos sejam precisos, acessíveis e seguros, operacionalizando-os com as melhores práticas de MLOps.",
      card1Title: "Análise de Oportunidades de IA",
      card1Desc: "Avaliamos as necessidades específicas da sua empresa para identificar os melhores casos de uso para LLMs, Machine Learning e automação inteligente.",
      card2Title: "Desenvolvimento de Agentes e LLMs",
      card2Desc: "Criamos assistentes virtuais, copilotos corporativos e modelos personalizados que garantem a geração de conteúdo e automação de atendimento.",
      card3Title: "Operacionalização (MLOps)",
      card3Desc: "Integramos e monitoramos as soluções de IA (MLOps) para assegurar escalabilidade, governança, desempenho eficiente e segurança contínua."
    },
    section2: {
      title: "Benefícios do Serviço de IA Generativa",
      b1Title: "Eficiência Operacional",
      b1Desc: "Automação de tarefas repetitivas e atendimento ao cliente com agentes autônomos rápidos e eficientes.",
      b2Title: "Inovação em Conteúdo",
      b2Desc: "Geração automatizada de textos, relatórios e insights, acelerando a produção e criatividade.",
      b3Title: "Escalabilidade Inteligente",
      b3Desc: "Infraestrutura de MLOps flexível que cresce com as necessidades do seu negócio, mantendo a governança."
    },
    section3: {
      title: "Pra quem é esse serviço?",
      desc: "Nosso serviço de Inteligência Artificial é ideal para empresas que buscam liderar a inovação em seus setores, automatizando processos complexos e gerando valor através de tecnologias de ponta. Este serviço é particularmente útil para organizações que:",
      item1: "Precisam de assistentes virtuais e copilotos corporativos robustos para suportar operações de atendimento e vendas.",
      item2: "Desejam otimizar a geração de conteúdo, relatórios e análises preditivas para melhorar a eficiência.",
      item3: "Buscam garantir a governança, escalabilidade e segurança dos modelos de Machine Learning (MLOps)."
    },
    section4: {
      title: "Como fazemos?",
      acc1Title: "Abordagem Centrada no Problema",
      acc1Desc: "Focamos em entender profundamente os desafios do seu negócio antes de aplicar a tecnologia, garantindo que a IA resolva problemas reais e gere ROI.",
      acc2Title: "Tecnologias Avançadas (LLMs & ML)",
      acc2Desc: "Utilizamos os modelos de linguagem fundacionais mais avançados e frameworks de Machine Learning modernos para construir soluções precisas e escaláveis.",
      acc3Title: "Iteração e MLOps",
      acc3Desc: "Implementamos ciclos de feedback contínuo e práticas de MLOps para monitorar, retreinar e garantir a governança dos modelos em produção."
    },
    contact: {
      title: "Comece a <1>revolução da IA</1> na sua empresa",
      desc: "Entre em contato conosco hoje e descubra como a ATRA pode transformar seus processos com Inteligência Artificial. Faça a mudança agora!",
      contactUs: "Entre em contato",
      quickDoubt: "Dúvida Rápida?",
      talkToAI: "fale com nosso assistente de IA"
    }
};

en.solution = {
    heroTitle: "Solutions in <1>Artificial Intelligence</1> & Generative AI",
    heroDesc: "Transform how your company operates with our AI service, designed to automate processes, generate intelligent content, and create autonomous agents that drive innovation and ensure precise results.",
    hireService: "Hire the service",
    menu: {
      howItWorks: "How it works",
      benefits: "Benefits",
      whoIsFor: "Who is this service for",
      howWeDo: "How we do it"
    },
    section1: {
      title: "Structuring Innovation with Artificial Intelligence",
      p1: "Our AI service focuses on building robust infrastructures and models that enable advanced automation, content generation, and predictive analysis efficiently.",
      p2: "We evaluate the company's needs, design custom architectures, and develop autonomous agents and LLMs that support high-performance business operations. Furthermore, we ensure the models are precise, accessible, and secure, operationalizing them with MLOps best practices.",
      card1Title: "AI Opportunities Analysis",
      card1Desc: "We evaluate your company's specific needs to identify the best use cases for LLMs, Machine Learning, and intelligent automation.",
      card2Title: "Agent and LLM Development",
      card2Desc: "We create virtual assistants, corporate copilots, and custom models that guarantee content generation and customer service automation.",
      card3Title: "Operationalization (MLOps)",
      card3Desc: "We integrate and monitor AI solutions (MLOps) to ensure scalability, governance, efficient performance, and continuous security."
    },
    section2: {
      title: "Benefits of the Generative AI Service",
      b1Title: "Operational Efficiency",
      b1Desc: "Automation of repetitive tasks and customer service with fast and efficient autonomous agents.",
      b2Title: "Innovation in Content",
      b2Desc: "Automated generation of texts, reports, and insights, accelerating production and creativity.",
      b3Title: "Intelligent Scalability",
      b3Desc: "Flexible MLOps infrastructure that grows with your business needs while maintaining governance."
    },
    section3: {
      title: "Who is this service for?",
      desc: "Our Artificial Intelligence service is ideal for companies looking to lead innovation in their sectors, automating complex processes and generating value through cutting-edge technologies. This service is particularly useful for organizations that:",
      item1: "Need robust virtual assistants and corporate copilots to support customer service and sales operations.",
      item2: "Want to optimize content generation, reports, and predictive analysis to improve efficiency.",
      item3: "Seek to ensure governance, scalability, and security of Machine Learning (MLOps) models."
    },
    section4: {
      title: "How we do it?",
      acc1Title: "Problem-Centric Approach",
      acc1Desc: "We focus on deeply understanding your business challenges before applying technology, ensuring AI solves real problems and generates ROI.",
      acc2Title: "Advanced Technologies (LLMs & ML)",
      acc2Desc: "We use the most advanced foundational language models and modern Machine Learning frameworks to build precise and scalable solutions.",
      acc3Title: "Iteration and MLOps",
      acc3Desc: "We implement continuous feedback loops and MLOps practices to monitor, retrain, and ensure the governance of models in production."
    },
    contact: {
      title: "Start the <1>AI revolution</1> in your company",
      desc: "Contact us today and discover how ATRA can transform your processes with Artificial Intelligence. Make the change now!",
      contactUs: "Contact us",
      quickDoubt: "Quick Question?",
      talkToAI: "talk to our AI assistant"
    }
};

pt.chat = {
  header: "Converse com a ATRA",
  beta: "BETA",
  subtext: "IA Especialista em Dados & Negócios",
  error: "Erro ao conectar com a IA da ATRA. Verifique se a chave de API está configurada.",
  timeout: "A resposta demorou muito. Por favor, tente enviar novamente.",
  errorGeneral: "Desculpe, ocorreu um erro ao se comunicar com nossos especialistas. Tente novamente em alguns segundos.",
  botWelcome: "Nossa IA está pronta para responder suas dúvidas sobre Transformação Digital, Dados, IA e Nuvem.",
  placeholder: "O que você deseja construir hoje?",
  poweredBy: "POWERED BY ATRA AI"
};

en.chat = {
  header: "Chat with ATRA",
  beta: "BETA",
  subtext: "Data & Business Expert AI",
  error: "Error connecting to ATRA AI. Check if the API key is configured.",
  timeout: "The response took too long. Please try sending again.",
  errorGeneral: "Sorry, an error occurred communicating with our experts. Try again in a few seconds.",
  botWelcome: "Our AI is ready to answer your questions about Digital Transformation, Data, AI, and Cloud.",
  placeholder: "What do you want to build today?",
  poweredBy: "POWERED BY ATRA AI"
};

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log('Locales updated');
